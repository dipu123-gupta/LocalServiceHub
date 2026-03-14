import express from "express";
import {
  getProviderProfile,
  updateProviderProfile,
  uploadDocument,
  getPendingProviders,
  verifyProviderStatus,
  getAllProviders,
  getProviderStats,
} from "../controllers/serviceProviderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);

// Provider only routes
router.route("/profile").get(getProviderProfile).put(updateProviderProfile);
router.route("/stats").get(getProviderStats);
router.route("/documents").post(upload.single("document"), uploadDocument);

// Admin only routes
router.route("/").get(admin, getAllProviders);
router.route("/pending").get(admin, getPendingProviders);
router.route("/:id/verify").put(admin, verifyProviderStatus);

export default router;
