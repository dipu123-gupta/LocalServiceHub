import Announcement from "../models/Announcement.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import asyncHandler from "express-async-handler";
import { sendPushNotification } from "../services/pushNotificationService.js";

// @desc    Create a new announcement and broadcast via Socket.io
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, targetRole } = req.body;

  const announcement = await Announcement.create({
    sender: req.user._id,
    title,
    message,
    targetRole,
  });

  if (announcement) {
    // 1. Broadcast via Socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("broadcastAnnouncement", {
        _id: announcement._id,
        title: announcement.title,
        message: announcement.message,
        targetRole: announcement.targetRole,
        createdAt: announcement.createdAt,
      });
    }

    // 2. Broadcast via Push (FCM) & Save to DB Notifications
    const query = {};
    if (targetRole !== "everyone" && targetRole !== "all") {
      query.role = targetRole === "users" ? "user" : "provider";
    }

    const users = await User.find(query).select("_id");

    // Save to Notification DB in bulk
    const notificationsToInsert = users.map((u) => ({
      recipient: u._id,
      title,
      message,
      type: "announcement",
      link: "/announcements",
      data: { announcementId: announcement._id.toString() },
    }));

    if (notificationsToInsert.length > 0) {
      await Notification.insertMany(notificationsToInsert);
    }

    // Send Push Notifications
    users.forEach((u) => {
      sendPushNotification(u._id, title, message, {
        type: "announcement",
        announcementId: announcement._id.toString(),
        link: "/",
      });
    });

    res.status(201).json(announcement);
  } else {
    res.status(400);
    throw new Error("Invalid announcement data");
  }
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = asyncHandler(async (req, res) => {
  // Basic filter by role if needed, or just return all and filter on frontend
  const query = { isActive: true };
  if (req.user.role !== "admin") {
    query.targetRole = { $in: ["all", req.user.role] };
  }

  const announcements = await Announcement.find(query)
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(announcements);
});

export { createAnnouncement, getAnnouncements };
