import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  saveToken,
  removeToken,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread", getUnreadCount);
router.put("/readall", markAllAsRead);
router.put("/:id/read", markAsRead);

// FCM Token Management
router.post("/tokens", saveToken);
router.delete("/tokens", removeToken);

export default router;
