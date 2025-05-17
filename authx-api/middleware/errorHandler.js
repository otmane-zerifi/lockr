export const errorHandler = (err, req, res, next) => {
  const error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  // Log error for development
  console.error(err)

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = "Duplicate field value entered"
    error.statusCode = 400
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message)
    error.message = messages.join(", ")
    error.statusCode = 400
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    error.message = `Resource not found with id of ${err.value}`
    error.statusCode = 404
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token"
    error.statusCode = 401
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired"
    error.statusCode = 401
  }

  // Send response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
  })
}
