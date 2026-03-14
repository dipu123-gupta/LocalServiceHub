import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "express-async-handler";

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
const getWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet) {
    // Create wallet if it doesn't exist (safety)
    wallet = await Wallet.create({ user: req.user._id });
  }

  res.json(wallet);
});

// @desc    Add funds to wallet (Mock)
// @route   POST /api/wallet/add
// @access  Private
const addFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  const wallet = await Wallet.findOne({ user: req.user._id });
  wallet.balance += Number(amount);
  await wallet.save();

  await Transaction.create({
    user: req.user._id,
    amount: Number(amount),
    type: "credit",
    description: "Wallet top-up (Mock)",
  });

  res.json(wallet);
});

// @desc    Get user transactions
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(transactions);
});

// @desc    Redeem loyalty points for wallet balance
// @route   POST /api/wallet/redeem
// @access  Private
const redeemPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;

  if (!points || points < 100) {
    res.status(400);
    throw new Error("Minimum 100 points required for redemption");
  }

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (wallet.loyaltyPoints < points) {
    res.status(400);
    throw new Error("Insufficient loyalty points");
  }

  // Conversion: 10 points = ₹1
  const amountToAdd = Math.floor(points / 10);

  wallet.loyaltyPoints -= points;
  wallet.balance += amountToAdd;
  await wallet.save();

  await Transaction.create({
    user: req.user._id,
    amount: amountToAdd,
    points: -points,
    type: "credit",
    category: "cash",
    description: `Redeemed ${points} loyalty points`,
  });

  res.json(wallet);
});

export { getWallet, addFunds, getTransactions, redeemPoints };
