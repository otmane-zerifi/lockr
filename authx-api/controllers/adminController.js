import User from "../models/User.js"
import LoginActivity from "../models/LoginActivity.js"
import Token from "../models/Token.js"
import { AppError } from "../utils/appError.js"
import { validateUserUpdate } from "../utils/validators.js"

// Get admin dashboard data
export const getDashboard = async (req, res, next) => {
  try {
    // Get count of users by role and status
    const userCount = await User.countDocuments({ role: "user" })
    const adminCount = await User.countDocuments({ role: "admin" })
    const moderatorCount = await User.countDocuments({ role: "moderator" })
    const verifiedCount = await User.countDocuments({ isEmailVerified: true })
    const unverifiedCount = await User.countDocuments({ isEmailVerified: false })
    const activeCount = await User.countDocuments({ status: "active" })
    const inactiveCount = await User.countDocuments({ status: "inactive" })
    const suspendedCount = await User.countDocuments({ status: "suspended" })

    // Get recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10)

    // Get login activity stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const todayLogins = await LoginActivity.countDocuments({
      status: "success",
      timestamp: { $gte: today },
    })

    const weekLogins = await LoginActivity.countDocuments({
      status: "success",
      timestamp: { $gte: weekAgo },
    })

    const monthLogins = await LoginActivity.countDocuments({
      status: "success",
      timestamp: { $gte: monthAgo },
    })

    // Get failed login attempts
    const failedLogins = await LoginActivity.countDocuments({
      status: "failed",
      timestamp: { $gte: weekAgo },
    })

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount + adminCount + moderatorCount,
          users: userCount,
          admins: adminCount,
          moderators: moderatorCount,
          verifiedUsers: verifiedCount,
          unverifiedUsers: unverifiedCount,
          activeUsers: activeCount,
          inactiveUsers: inactiveCount,
          suspendedUsers: suspendedCount,
        },
        recentUsers: recentUsers.map((user) => user.toJSON()),
        loginActivity: {
          today: todayLogins,
          week: weekLogins,
          month: monthLogins,
          failedAttempts: failedLogins,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const skip = (page - 1) * limit

    // Filtering
    const filter = {}
    if (req.query.role) filter.role = req.query.role
    if (req.query.status) filter.status = req.query.status
    if (req.query.isEmailVerified) filter.isEmailVerified = req.query.isEmailVerified === "true"
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    }

    // Sorting
    const sort = {}
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":")
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    } else {
      sort.createdAt = -1
    }

    // Execute query
    const users = await User.find(filter).sort(sort).skip(skip).limit(limit)

    // Get total count for pagination
    const total = await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users: users.map((user) => user.toJSON()),
    })
  } catch (error) {
    next(error)
  }
}

// Get user by ID (admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Get user's login activity
    const loginActivity = await LoginActivity.find({ userId: user._id }).sort({ timestamp: -1 }).limit(10)

    res.status(200).json({
      success: true,
      user: user.toJSON(),
      loginActivity,
    })
  } catch (error) {
    next(error)
  }
}

// Update user (admin only)
export const updateUser = async (req, res, next) => {
  try {
    // Validate input
    const { error } = validateUserUpdate(req.body)
    if (error) {
      return next(new AppError(error.details[0].message, 400))
    }

    const { role, status, permissions } = req.body

    // Find user
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Update user
    if (role) user.role = role
    if (status) user.status = status
    if (permissions) user.permissions = permissions

    await user.save()

    // If user is suspended or inactive, blacklist all their tokens
    if (status === "suspended" || status === "inactive") {
      await Token.updateMany({ userId: user._id, blacklisted: false }, { blacklisted: true })
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Delete user's tokens
    await Token.deleteMany({ userId: user._id })

    // Delete user's login activity
    await LoginActivity.deleteMany({ userId: user._id })

    // Delete user
    await user.deleteOne()

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get system stats (admin only)
export const getSystemStats = async (req, res, next) => {
  try {
    // Get user registration stats by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])

    // Get login activity by day for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const loginStats = await LoginActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        userRegistrations,
        loginStats,
      },
    })
  } catch (error) {
    next(error)
  }
}
