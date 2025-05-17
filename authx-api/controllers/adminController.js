import User from "../models/User.js"

// Get admin dashboard data
export const getDashboard = async (req, res, next) => {
  try {
    // Get count of users by role
    const userCount = await User.countDocuments({ role: "user" })
    const adminCount = await User.countDocuments({ role: "admin" })

    // Get recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5)

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount + adminCount,
          users: userCount,
          admins: adminCount,
        },
        recentUsers: recentUsers.map((user) => user.toJSON()),
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((user) => user.toJSON()),
    })
  } catch (error) {
    next(error)
  }
}
