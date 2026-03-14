import Withdrawal from "../models/Withdrawal.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "express-async-handler";

// @desc    Request a withdrawal (Provider)
// @route   POST /api/withdrawals
// @access  Private/Provider
const requestWithdrawal = asyncHandler(async (req, res) => {
  const { amount, bankDetails } = req.body;

  if (!amount || amount < 100) {
    res.status(400);
    throw new Error("Minimum withdrawal amount is ₹100");
  }

  const wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet || wallet.withdrawableBalance < amount) {
    res.status(400);
    throw new Error("Insufficient withdrawable balance");
  }

  // Deduct from wallet balances
  wallet.balance -= amount;
  wallet.withdrawableBalance -= amount;
  await wallet.save();

  const withdrawal = await Withdrawal.create({
    provider: req.user._id,
    amount,
    bankDetails,
  });

  await Transaction.create({
    user: req.user._id,
    amount,
    type: "debit",
    description: "Withdrawal request (Pending)",
    status: "pending",
    withdrawal: withdrawal._id,
  });

  res.status(201).json(withdrawal);
});

// @desc    Get my withdrawals (Provider)
// @route   GET /api/withdrawals/my
// @access  Private/Provider
const getMyWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ provider: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(withdrawals);
});

// @desc    Get all withdrawals (Admin)
// @route   GET /api/withdrawals
// @access  Private/Admin
const getAllWithdrawals = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const withdrawals = await Withdrawal.find(filter)
    .populate("provider", "name email phone")
    .sort({ createdAt: -1 });

  res.json(withdrawals);
});

// @desc    Update withdrawal status (Admin)
// @route   PUT /api/withdrawals/:id
// @access  Private/Admin
const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const { status, adminNote, transactionId } = req.body;
  const withdrawal = await Withdrawal.findById(req.params.id);

  if (!withdrawal) {
    res.status(404);
    throw new Error("Withdrawal request not found");
  }

  if (withdrawal.status !== "pending") {
    res.status(400);
    throw new Error("Withdrawal is already processed");
  }

  withdrawal.status = status;
  withdrawal.adminNote = adminNote || withdrawal.adminNote;
  withdrawal.transactionId = transactionId || withdrawal.transactionId;
  withdrawal.processedAt = Date.now();

  await withdrawal.save();

  // If rejected, refund the amount to the provider's wallet
  if (status === "rejected") {
    const wallet = await Wallet.findOne({ user: withdrawal.provider });
    if (wallet) {
      wallet.balance += withdrawal.amount;
      wallet.withdrawableBalance += withdrawal.amount;
      await wallet.save();

      await Transaction.create({
        user: withdrawal.provider,
        amount: withdrawal.amount,
        type: "credit",
        description: `Withdrawal rejected: ${adminNote || "No reason provided"}`,
        status: "completed",
        withdrawal: withdrawal._id,
      });
    }
  } else if (status === "approved") {
    // Find the linked transaction and mark as completed
    const transaction = await Transaction.findOne({
      withdrawal: withdrawal._id,
      type: "debit",
    });

    if (transaction) {
      transaction.status = "completed";
      transaction.description = `Withdrawal successful (Ref: ${transactionId || "N/A"})`;
      await transaction.save();

      // Update total withdrawn
      const wallet = await Wallet.findOne({ user: withdrawal.provider });
      if (wallet) {
        wallet.totalWithdrawn += withdrawal.amount;
        await wallet.save();
      }
    }
  }

  res.json(withdrawal);
});

export {
  requestWithdrawal,
  getMyWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
};
