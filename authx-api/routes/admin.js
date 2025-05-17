import express from "express"
import { getDashboard, getAllUsers } from "../controllers/adminController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected and require admin role
router.use(protect)
router.use(authorize("admin"))

router.get("/dashboard", getDashboard)
router.get("/users", getAllUsers)

export default router
