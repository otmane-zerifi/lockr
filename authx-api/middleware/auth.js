import { verifyToken } from "../utils/jwt.js"
import User from "../models/User.js"
import { AppError } from "../utils/appError.js"

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized to access this route", 401))
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    if (!decoded) {
      return next(new AppError("Not authorized to access this route", 401))
    }

    // Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Set user in request
    req.user = decoded
    next()
  } catch (error) {
    next(new AppError("Not authorized to access this route", 401))
  }
}

// Authorize based on user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}
