import mongoose from "mongoose"

// This model is used to track login activity for analytics and security
const loginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    required: true,
  },
  reason: {
    type: String,
    enum: ["invalid_credentials", "account_locked", "account_inactive", "unverified_email", null],
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
loginActivitySchema.index({ userId: 1 })
loginActivitySchema.index({ timestamp: 1 })
loginActivitySchema.index({ status: 1 })
loginActivitySchema.index({ ip: 1 })

const LoginActivity = mongoose.model("LoginActivity", loginActivitySchema)

export default LoginActivity
