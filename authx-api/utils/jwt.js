import jwt from "jsonwebtoken"

// Generate access and refresh tokens
export const generateTokens = (user) => {
  // Create access token
  const accessToken = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" },
  )

  // Create refresh token
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  })

  return { accessToken, refreshToken }
}

// Verify token
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}
