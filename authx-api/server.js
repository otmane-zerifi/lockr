import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import hpp from "hpp"
import cookieParser from "cookie-parser"
import compression from "compression"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.js"
import userRoutes from "./routes/user.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { limiter } from "./middleware/rateLimiter.js"
import { csrfProtection } from "./middleware/csrfProtection.js"
import { swaggerOptions } from "./config/swagger.js"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Rate limiting
app.use("/api", limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Compression
app.use(compression())

// Swagger documentation
const specs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// CSRF protection for non-GET requests
app.use(csrfProtection)

// Routes
app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)
app.use("/users", userRoutes)

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/authx", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")
    // Start server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AuthX API", version: "2.0.0" })
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})
