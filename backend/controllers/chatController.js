import Message from "../models/Message.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { emitToUser } from "../services/socketService.js";
import { sendPushNotification } from "../services/pushNotificationService.js";

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, message, bookingId } = req.body;

  if (!recipientId || !message) {
    res.status(400);
    throw new Error("Please provide recipient and message");
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    message,
    booking: bookingId,
  });

  const populatedMessage = await Message.findById(newMessage._id)
    .populate("sender", "name profileImage")
    .populate("recipient", "name profileImage");

  // Notify recipient via socket
  const io = req.app.get("io");
  emitToUser(io, recipientId, "newMessage", populatedMessage);

  // Notify recipient via Push (FCM)
  await sendPushNotification(
    recipientId,
    `New message from ${populatedMessage.sender.name}`,
    message,
    {
      type: "chat",
      senderId: req.user._id.toString(),
      link: "/dashboard", // Link to chat tab
    },
  );

  res.status(201).json(populatedMessage);
});

// @desc    Get messages between two users
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: userId },
      { sender: userId, recipient: req.user._id },
    ],
  })
    .populate("sender", "name profileImage")
    .populate("recipient", "name profileImage")
    .sort({ createdAt: 1 });

  res.json(messages);
});

// @desc    Get list of users chatted with
// @route   GET /api/chat/list
// @access  Private
const getChatList = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all messages involving the user
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name profileImage")
    .populate("recipient", "name profileImage");

  const chatListMap = new Map();

  messages.forEach((msg) => {
    const otherUser =
      msg.sender._id.toString() === userId.toString()
        ? msg.recipient
        : msg.sender;
    if (!chatListMap.has(otherUser._id.toString())) {
      chatListMap.set(otherUser._id.toString(), {
        user: otherUser,
        lastMessage: msg.message,
        createdAt: msg.createdAt,
      });
    }
  });

  res.json(Array.from(chatListMap.values()));
});

export { sendMessage, getMessages, getChatList };
