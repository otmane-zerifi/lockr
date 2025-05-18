import User from "../models/User.js"
import Token from "../models/Token.js"
import LoginActivity from "../models/LoginActivity.js"
import { generateTokens, verifyToken, blacklistToken } from "../utils/jwt.js"
import { validateRegister, validateLogin, validatePassword } from "../utils/validators.js"
import { AppError } from "../utils/appError.js"
import { sendEmail } from "../utils/email.js"
import { getClientInfo } from "../utils/clientInfo.js"
import crypto from "crypto"
import zxcvbn from "zxcvbn"

// Register a new user
export const register = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateRegister(req.body)
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    const { name, email, password, role } = req.body

    // Check password strength
    const passwordStrength = zxcvbn(password)
    if (passwordStrength.score < 3) {
      return next(
        new AppError(
          `Password is too weak: ${passwordStrength.feedback.warning}. ${passwordStrength.feedback.suggestions.join(" ")}`,
          400,
        ),
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError("User already exists with this email", 400))
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role && req.user?.role === "admin" ? role : "user", // Only admins can set roles
    })

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken()
    await user.save()

    // Send verification email
    const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`

    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link: ${verificationURL}`,
      html: `
        <h1>Welcome to our platform!</h1>
        <p>Please verify your email by clicking on the button below:</p>
        <a href="${verificationURL}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, you can also click on this link: <a href="${verificationURL}">${verificationURL}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// Verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    // Hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400))
    }

    // Update user
    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateLogin(req.body)
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    const { email, password } = req.body
    const clientInfo = getClientInfo(req)

    // Find user by email
    const user = await User.findOne({ email }).select(
      "+password +accountLocked +accountLockedUntil +failedLoginAttempts",
    )

    // Record login attempt regardless of success
    const loginActivity = new LoginActivity({
      userId: user?._id || null,
      ip: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      status: "failed", // Default to failed, will update if successful
    })

    // Check if user exists
    if (!user) {
      await loginActivity.save()
      return next(new AppError("Invalid credentials", 401))
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      loginActivity.reason = "account_locked"
      await loginActivity.save()

      const lockTimeRemaining = Math.ceil((user.accountLockedUntil - Date.now()) / 1000 / 60)
      return next(
        new AppError(
          `Account is locked due to too many failed login attempts. Please try again in ${lockTimeRemaining} minutes.`,
          401,
        ),
      )
    }

    // Check if account is inactive
    if (user.status !== "active") {
      loginActivity.reason = "account_inactive"
      await loginActivity.save()
      return next(new AppError("Your account is not active. Please contact support.", 401))
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      loginActivity.reason = "unverified_email"
      await loginActivity.save()
      return next(new AppError("Please verify your email before logging in.", 401))
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      // Register failed login attempt
      await user.registerFailedLogin()

      loginActivity.reason = "invalid_credentials"
      await loginActivity.save()

      return next(new AppError("Invalid credentials", 401))
    }

    // Reset failed login attempts
    await user.resetFailedLoginAttempts()

    // Generate tokens
    const { accessToken, refreshToken, expiresIn } = generateTokens(user)

    // Save refresh token to database for tracking
    const refreshTokenDoc = new Token({
      token: refreshToken,
      type: "refresh",
      userId: user._id,
      expiresAt: new Date(
        Date.now() + Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS || 7 * 24 * 60 * 60 * 1000),
      ),
    })
    await refreshTokenDoc.save()

    // Update login activity to success
    loginActivity.status = "success"
    loginActivity.reason = null
    await loginActivity.save()

    // Set HTTP-only cookie with refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS || 7 * 24 * 60 * 60 * 1000),
    })

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken, // Also send in response for non-browser clients
      expiresIn,
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Update last active timestamp
    user.lastActive = Date.now()
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// Refresh access token
export const refreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 400))
    }

    // Check if token is blacklisted
    const blacklistedToken = await Token.findOne({ token: refreshToken, blacklisted: true })
    if (blacklistedToken) {
      return next(new AppError("Invalid refresh token", 401))
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
    if (!decoded) {
      return next(new AppError("Invalid refresh token", 401))
    }

    // Find user
    const user = await User.findById(decoded.id)
    if (!user || user.status !== "active") {
      return next(new AppError("User not found or inactive", 401))
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("User recently changed password. Please login again", 401))
    }

    // Blacklist the old refresh token (token rotation for security)
    await blacklistToken(refreshToken, "refresh", user._id)

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = generateTokens(user)

    // Save new refresh token to database
    const refreshTokenDoc = new Token({
      token: newRefreshToken,
      type: "refresh",
      userId: user._id,
      expiresAt: new Date(
        Date.now() + Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS || 7 * 24 * 60 * 60 * 1000),
      ),
    })
    await refreshTokenDoc.save()

    // Set HTTP-only cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS || 7 * 24 * 60 * 60 * 1000),
    })

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    })
  } catch (error) {
    next(error)
  }
}

// Logout user
export const logout = async (req, res, next) => {
  try {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (refreshToken) {
      // Blacklist the refresh token
      await blacklistToken(refreshToken, "refresh", req.user.id)
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken")

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new AppError("Please provide an email", 400))
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal user existence, just return success
      return res.status(200).json({
        success: true,
        message: "Password reset email sent if the email exists",
      })
    }

    // Generate password reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // Send password reset email
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        text: `Your password reset token is valid for 10 minutes. Please reset your password by clicking on the following link: ${resetURL}`,
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset. Please click the button below to reset your password:</p>
          <a href="${resetURL}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If the button doesn't work, you can also click on this link: <a href="${resetURL}">${resetURL}</a></p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      })

      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      })
    } catch (error) {
      // If email sending fails, reset the token fields
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })

      return next(new AppError("There was an error sending the email. Please try again later.", 500))
    }
  } catch (error) {
    next(error)
  }
}

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password, passwordConfirm } = req.body

    if (!password || !passwordConfirm) {
      return next(new AppError("Please provide password and password confirmation", 400))
    }

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400))
    }

    // Validate password strength
    const { error } = validatePassword({ password })
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    // Check password strength
    const passwordStrength = zxcvbn(password)
    if (passwordStrength.score < 3) {
      return next(
        new AppError(
          `Password is too weak: ${passwordStrength.feedback.warning}. ${passwordStrength.feedback.suggestions.join(" ")}`,
          400,
        ),
      )
    }

    // Hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with this token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400))
    }

    // Update password
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // Blacklist all refresh tokens for this user
    await Token.updateMany({ userId: user._id, type: "refresh", blacklisted: false }, { blacklisted: true })

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    next(error)
  }
}

// Update password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return next(new AppError("Please provide current password, new password and password confirmation", 400))
    }

    if (newPassword !== newPasswordConfirm) {
      return next(new AppError("New passwords do not match", 400))
    }

    // Validate password strength
    const { error } = validatePassword({ password: newPassword })
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    // Check password strength
    const passwordStrength = zxcvbn(newPassword)
    if (passwordStrength.score < 3) {
      return next(
        new AppError(
          `Password is too weak: ${passwordStrength.feedback.warning}. ${passwordStrength.feedback.suggestions.join(" ")}`,
          400,
        ),
      )
    }

    // Find user
    const user = await User.findById(req.user.id).select("+password")
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(new AppError("Current password is incorrect", 401))
    }

    // Update password
    user.password = newPassword
    await user.save()

    // Blacklist all refresh tokens for this user except the current one
    const currentRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (currentRefreshToken) {
      await Token.updateMany(
        {
          userId: user._id,
          type: "refresh",
          blacklisted: false,
          token: { $ne: currentRefreshToken },
        },
        { blacklisted: true },
      )
    } else {
      // If no current token, blacklist all
      await Token.updateMany({ userId: user._id, type: "refresh", blacklisted: false }, { blacklisted: true })
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    next(error)
  }
}
