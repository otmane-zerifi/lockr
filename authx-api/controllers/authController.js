import User from "../models/User.js"
import { generateTokens, verifyToken } from "../utils/jwt.js"
import { validateRegister, validateLogin } from "../utils/validators.js"
import { AppError } from "../utils/appError.js"

// Register a new user
export const register = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateRegister(req.body)
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    const { name, email, password, role } = req.body

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
      role: role || "user", // Default to 'user' if not specified
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.toJSON(),
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

    // Find user by email
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return next(new AppError("Invalid credentials", 401))
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401))
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Save refresh token to user
    user.refreshToken = refreshToken
    await user.save()

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
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
    const { refreshToken } = req.body
    if (!refreshToken) {
      return next(new AppError("Refresh token is required", 400))
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
    if (!decoded) {
      return next(new AppError("Invalid refresh token", 401))
    }

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    }).select("+refreshToken")

    if (!user) {
      return next(new AppError("Invalid refresh token", 401))
    }

    // Generate new tokens
    const tokens = generateTokens(user)

    // Update refresh token in database
    user.refreshToken = tokens.refreshToken
    await user.save()

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    next(error)
  }
}

// Logout user
export const logout = async (req, res, next) => {
  try {
    // Find user and remove refresh token
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null })

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    next(error)
  }
}
