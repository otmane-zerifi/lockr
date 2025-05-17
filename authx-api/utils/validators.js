import Joi from "joi"

// Validate user registration
export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    role: Joi.string().valid("user", "admin"),
  })

  return schema.validate(data)
}

// Validate user login
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  })

  return schema.validate(data)
}
