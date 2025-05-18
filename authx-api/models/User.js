import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    permissions: {
      type: [String],
      default: [],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    accountLockedUntil: Date,
    lastLogin: Date,
    lastActive: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ status: 1 })
userSchema.index({ role: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)

    // If password is changed, update passwordChangedAt
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000 // Subtract 1 second to ensure token is created after password change
    }

    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Number.parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Method to generate email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex")

  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return verificationToken
}

// Method to handle failed login attempts
userSchema.methods.registerFailedLogin = async function () {
  this.failedLoginAttempts += 1

  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true
    this.accountLockedUntil = Date.now() + 30 * 60 * 1000 // 30 minutes
  }

  await this.save()
}

// Method to reset failed login attempts
userSchema.methods.resetFailedLoginAttempts = async function () {
  this.failedLoginAttempts = 0
  this.accountLocked = false
  this.accountLockedUntil = undefined
  this.lastLogin = Date.now()

  await this.save()
}

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
  if (!this.accountLocked) return false

  // Check if lock period has expired
  if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
    this.accountLocked = false
    this.accountLockedUntil = undefined
    this.failedLoginAttempts = 0
    return false
  }

  return true
}

// Method to return user data without sensitive information
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.refreshToken
  delete user.passwordResetToken
  delete user.passwordResetExpires
  delete user.emailVerificationToken
  delete user.emailVerificationExpires
  delete user.__v

  // Rename _id to id
  user.id = user._id
  delete user._id

  return user
}

const User = mongoose.model("User", userSchema)

export default User
