import mongoose from "mongoose"

// This model is used to store blacklisted tokens for immediate revocation
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["refresh", "access", "reset", "verification"],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Auto-delete when expired
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
tokenSchema.index({ token: 1, type: 1 })
tokenSchema.index({ userId: 1, type: 1 })
tokenSchema.index({ expiresAt: 1 })

const Token = mongoose.model("Token", tokenSchema)

export default Token
