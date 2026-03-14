import express from "express";
import {
  getUsers,
  deleteUser,
  updateUserRole,
  toggleFavorite,
  getFavorites,
  toggleBlockUser,
  getReferralStats,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// User favorites routes
router.route("/favorites").get(getFavorites).post(toggleFavorite);

// Referral routes
router.get("/referral-stats", getReferralStats);

// Admin only routes
router.use(admin);
router.route("/").get(getUsers);
router.route("/:id").delete(deleteUser);
router.route("/:id/role").put(updateUserRole);
router.route("/:id/block").put(toggleBlockUser);

export default router;
