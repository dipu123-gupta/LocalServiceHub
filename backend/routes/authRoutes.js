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
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.put("/update-password", protect, updatePassword);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profileImage"), updateUserProfile);

export default router;
