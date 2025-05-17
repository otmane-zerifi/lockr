import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.js"
import { errorHandler } from "./middleware/errorHandler.js"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/authx")
  .then(() => {
    console.log("Connected to MongoDB")
    // Start server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AuthX API" })
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  process.exit(1)
})
