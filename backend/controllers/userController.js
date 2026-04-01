import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import AuditLog from "../models/AuditLog.js";
import asyncHandler from "express-async-handler";
import APIFeatures from "../utils/apiFeatures.js";
import logAction from "../utils/auditLogger.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, isBlocked } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) query.role = role;
  if (isBlocked !== undefined) query.isBlocked = isBlocked === "true";

  const totalUsers = await User.countDocuments(query);
  const features = new APIFeatures(
    User.find(query).select("-password"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const users = await features.query;
  res.json({
    users,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalUsers / (req.query.limit * 1 || 10)),
    total: totalUsers,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "admin") {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Toggle favorite service
// @route   POST /api/users/favorites
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const isFavorite = user.favorites.includes(serviceId);

    if (isFavorite) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== serviceId,
      );
    } else {
      user.favorites.push(serviceId);
    }

    await user.save();
    res.json({
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
      favorites: user.favorites,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user favorite services
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "favorites",
    populate: {
      path: "category",
      select: "name",
    },
  });

  if (user) {
    res.json(user.favorites);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Toggle block user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "admin") {
      res.status(400);
      throw new Error("Cannot block/unblock an admin user");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    // Log block/unblock action
    await logAction(
      req,
      user.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
      user._id,
      "User",
      `User ${user.email} was ${user.isBlocked ? "blocked" : "unblocked"}.`,
    );

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get referral stats
// @route   GET /api/users/referral-stats
// @access  Private
const getReferralStats = asyncHandler(async (req, res) => {
  const referredUsersCount = await User.countDocuments({
    referredBy: req.user._id,
  });

  const wallet = await Wallet.findOne({ user: req.user._id });

  // Calculating total rewards from transactions to be accurate
  const transactions = await Transaction.find({
    user: req.user._id,
    description: { $regex: /Bonus for referring|Referral signup bonus/i },
  });

  const totalRewards = transactions.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    referredCount: referredUsersCount,
    totalRewards: totalRewards,
  });
});

// @desc    Get all audit logs
// @route   GET /api/users/audit-logs
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const totalLogs = await AuditLog.countDocuments();
  const logsRaw = await AuditLog.find()
    .populate("user", "name email")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  // Map to match frontend expectations (Renaming internal fields for UI compatibility)
  const logs = logsRaw.map((log) => ({
    ...log._doc,
    admin: log.user, // UI uses .admin.name
    targetType: log.targetModel, // UI uses .targetType
  }));

  res.json({
    logs,
    page,
    pages: Math.ceil(totalLogs / limit),
    total: totalLogs,
  });
});

export {
  getUsers,
  deleteUser,
  updateUserRole,
  toggleFavorite,
  getFavorites,
  toggleBlockUser,
  getReferralStats,
  getAuditLogs,
};
