import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
  googleAuth,
  setupMFA,
  verifyAndEnableMFA,
  loginVerifyMFA,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";
import { upload } from "../config/cloudinary.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, validateRequest(registerSchema), registerUser);
router.post("/login", authLimiter, validateRequest(loginSchema), loginUser);
router.post("/google", authLimiter, googleAuth);
router.post("/logout", logoutUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.put("/update-password", protect, updatePassword);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profileImage"), updateUserProfile);

// MFA Routes
router.post("/mfa/setup", protect, setupMFA);
router.post("/mfa/verify", protect, verifyAndEnableMFA);
router.post("/mfa/login-verify", authLimiter, loginVerifyMFA);

export default router;
