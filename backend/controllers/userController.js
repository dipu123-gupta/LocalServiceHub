import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "express-async-handler";

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

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json(users);
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

export {
  getUsers,
  deleteUser,
  updateUserRole,
  toggleFavorite,
  getFavorites,
  toggleBlockUser,
  getReferralStats,
};
