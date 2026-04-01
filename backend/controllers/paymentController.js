import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import User from "../models/User.js";
import ServiceProvider from "../models/ServiceProvider.js";
import asyncHandler from "express-async-handler";

// @desc    Create Razorpay Order for a booking
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    res.status(503);
    throw new Error(
      "Payment service is currently unavailable. Razorpay is not configured.",
    );
  }

  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate("service");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to pay for this booking");
  }

  try {
    const options = {
      amount: Math.round(booking.totalAmount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `rcpt_${booking._id.toString().substring(0, 10)}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        type: "booking",
      },
    };

    const order = await razorpay.orders.create(options);

    // Update booking with Razorpay Order ID
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    const errorMsg =
      error.error?.description ||
      error.message ||
      "Razorpay order creation failed";
    res.status(500);
    throw new Error(errorMsg);
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
    type, // 'booking' or 'subscription'
    planId, // if subscription
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Payment success
    if (type === "subscription") {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const plan = await SubscriptionPlan.findById(planId).session(session);
        if (!plan) throw new Error("Subscription plan not found");

        const expiryDate = new Date(
          Date.now() + plan.duration * 24 * 60 * 60 * 1000,
        );

        const user = await User.findById(req.user._id).session(session);
        if (user) {
          user.activeSubscription = plan._id;
          user.subscriptionExpiresAt = expiryDate;
          await user.save({ session });
        }

        const provider = await ServiceProvider.findOne({
          user: req.user._id,
        }).session(session);
        if (provider) {
          provider.activeSubscription = plan._id;
          provider.subscriptionExpiresAt = expiryDate;
          await provider.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res
          .status(200)
          .json({ status: "success", message: "Subscription updated" });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw error;
      }
    } else if (bookingId) {
      const booking = await Booking.findById(bookingId).populate("service");
      if (booking) {
        booking.paymentStatus = "completed";
        // Do NOT auto-set status to "accepted" — provider must accept manually
        booking.razorpayPaymentId = razorpay_payment_id;
        await booking.save();
      }
      return res
        .status(200)
        .json({ status: "success", message: "Payment verified successfully" });
    }
  } else {
    res.status(400);
    throw new Error("Invalid signature sent!");
  }
});

export { createRazorpayOrder, verifyPayment };
