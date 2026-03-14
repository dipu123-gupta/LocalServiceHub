import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendPushNotification } from "../services/pushNotificationService.js";
import { emitToUser } from "../services/socketService.js";

// @desc    Helper: Create notification and send real-time
export const createNotification = async (
  io,
  { recipient, title, message, type, link, data },
) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      link,
      data,
    });

    // 1. Send via Socket.io
    emitToUser(io, recipient, "newNotification", notification);

    // 2. Send via Push (FCM)
    await sendPushNotification(recipient, title, message, {
      type: type || "system",
      link: link || "/",
      notificationId: notification._id.toString(),
    });

    return notification;
  } catch (error) {
    console.error("Error in createNotification:", error);
  }
};

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(notifications);
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });
  res.json({ unreadCount: count });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.recipient.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    notification.isRead = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
  } else {
    res.status(404);
    throw new Error("Notification not found");
  }
});

// @desc    Mark all as read
// @route   PUT /api/notifications/readall
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } },
  );
  res.json({ message: "All notifications marked as read" });
});

// @desc    Save/Update FCM token
// @route   POST /api/notifications/tokens
// @access  Private
const saveToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error("Token is required");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Add token if it doesn't exist
    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }
    res.status(200).json({ message: "Token saved successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Remove FCM token (on logout)
// @route   DELETE /api/notifications/tokens
// @access  Private
const removeToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.fcmTokens = user.fcmTokens.filter((t) => t !== token);
    await user.save();
    res.status(200).json({ message: "Token removed successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  saveToken,
  removeToken,
};
