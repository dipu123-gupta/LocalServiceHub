import rateLimit from "express-rate-limit";

/**
 * General API Limiter
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

/**
 * Authentication Limiter (Login/Register/Reset Password)
 * 5 attempts per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increased slightly for usability but still protected
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many authentication attempts, please try again after 15 minutes.",
  },
});

/**
 * Token/Notification Limiter
 * 50 requests per 15 minutes
 */
export const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Normal notification flow limit reached.",
  },
});
