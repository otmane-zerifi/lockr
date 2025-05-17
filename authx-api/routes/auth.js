import express from "express"
import { register, login, getCurrentUser, refreshToken, logout } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)

// Protected routes
router.get("/me", protect, getCurrentUser)
router.post("/logout", protect, logout)

export default router
