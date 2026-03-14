import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import ServiceProvider from "../models/ServiceProvider.js";
import asyncHandler from "express-async-handler";
import { createNotification } from "./notificationController.js";
import Setting from "../models/Setting.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import { getSurgeMultiplier } from "../utils/surgeUtils.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId,
    serviceProviderId,
    bookingDate,
    timeSlot,
    address,
    totalAmount,
    paymentMethod,
    couponCode,
    notes,
    contactNumber,
  } = req.body;

  if (!serviceId || !bookingDate || !timeSlot || !address) {
    res.status(400);
    throw new Error(
      "Please provide all required fields: serviceId, bookingDate, timeSlot, address",
    );
  }

  const service = await Service.findById(serviceId)
    .populate({
      path: "provider",
      populate: { path: "activeSubscription" },
    })
    .populate("category");
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // Fetch global commission if not set by category
  const globalCommissionSetting = await Setting.findOne({ key: "platformCommissionPercentage" });
  let commissionRateValue = service.category?.commissionRate || (globalCommissionSetting ? globalCommissionSetting.value : 15);
  
  const provider = service.provider;
  if (
    provider &&
    provider.activeSubscription &&
    (!provider.subscriptionExpiresAt ||
      new Date(provider.subscriptionExpiresAt) > new Date())
  ) {
    if (provider.activeSubscription.commissionRate !== undefined) {
      commissionRateValue = provider.activeSubscription.commissionRate;
    }
  }

  // 0. Calculate Demand Surge
  const surge = await getSurgeMultiplier(address.city, service.category?._id);
  const basePrice = service.price * surge.multiplier;
  let finalAmount = basePrice;

  // 1. Handle Coupon Validation (Security Re-check)
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (
      coupon &&
      new Date(coupon.expiryDate) > new Date() &&
      coupon.usedCount < coupon.usageLimit &&
      service.price >= coupon.minBookingAmount
    ) {
      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (service.price * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount)
          discount = coupon.maxDiscount;
      } else {
        discount = coupon.discountValue;
      }
      finalAmount = Math.max(0, basePrice - discount);
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  // 1.1 Handle User Subscription Discount
  const user = await User.findById(req.user._id).populate("activeSubscription");
  if (
    user &&
    user.activeSubscription &&
    (!user.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt) > new Date())
  ) {
    if (user.activeSubscription.discountPercentage) {
      const subDiscount =
        (finalAmount * user.activeSubscription.discountPercentage) / 100;
      finalAmount = Math.max(0, finalAmount - subDiscount);
    }
  }

  // 2. Handle Wallet Payment & Booking Creation (Atomic)
  const session = await mongoose.startSession();
  session.startTransaction();

  let booking; // Declare booking outside try block to be accessible later

  try {
    if (paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
      if (!wallet || wallet.balance < finalAmount) {
        throw new Error("Insufficient wallet balance");
      }

      wallet.balance -= finalAmount;
      wallet.loyaltyPoints += Math.floor(finalAmount / 100);
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            user: req.user._id,
            amount: finalAmount,
            type: "debit",
            description: `Payment for ${service.title}`,
            status: "completed",
          },
        ],
        { session },
      );
    }

    // 0.5 Check Provider Availability (Basic day-based check)
    const bDate = new Date(bookingDate);
    const dayName = bDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (provider.availability?.days?.length > 0 && !provider.availability.days.includes(dayName)) {
      throw new Error(`Provider is not available on ${dayName}s`);
    }

    const commissionAmount = (finalAmount * commissionRateValue) / 100;
    const providerEarnings = finalAmount - commissionAmount;

    const bookingData = {
      user: req.user._id,
      service: serviceId,
      provider: serviceProviderId || service.provider,
      category: service.category?._id,
      contactNumber,
      bookingDate,
      timeSlot,
      address,
      totalAmount: finalAmount,
      commissionAmount: commissionAmount,
      providerEarnings: providerEarnings,
      paymentMethod: paymentMethod || "Cash on Delivery",
      notes,
      status: "pending",
      paymentStatus: paymentMethod === "wallet" ? "completed" : "pending",
    };

    const [createdBooking] = await Booking.create([bookingData], { session });

    // 3. Create Payment Transaction Record
    await PaymentTransaction.create(
      [
        {
          booking: createdBooking._id,
          user: req.user._id,
          provider: provider.user,
          totalAmount: finalAmount,
          providerEarning: providerEarnings,
          platformCommission: commissionAmount,
          commissionPercentage: commissionRateValue,
          paymentMethod: paymentMethod || "Cash on Delivery",
          status: paymentMethod === "wallet" ? "completed" : "pending",
        },
      ],
      { session },
    );
    await session.commitTransaction();
    session.endSession();

    // 3. Post-Transaction: Notifications & Population
    const populatedBooking = await Booking.findById(createdBooking._id)
      .populate("service", "title price images")
      .populate("provider", "businessName");

    const io = req.app.get("io");
    if (io) {
      // Notify the customer
      await createNotification(io, {
        recipient: req.user._id,
        title: "Booking Received!",
        message: `Your booking for "${service.title}" is confirmed and pending approval.`,
        type: "booking_confirmed",
        link: "/bookings",
      });

      // Notify the provider
      if (service.provider && service.provider.user) {
        await createNotification(io, {
          recipient: service.provider.user, // Use User ID for notification
          title: "New Booking Request",
          message: `You have a new booking for "${service.title}". Please review and confirm.`,
          type: "booking_confirmed",
          link: "/provider/bookings",
        });
      }
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    if (session.inAtomicity) {
      await session.abortTransaction();
    }
    session.endSession();
    res.status(400);
    throw error;
  }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("service", "title price images duration")
    .populate("provider", "businessName")
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

// @desc    Get provider's bookings (for provider dashboard)
// @route   GET /api/bookings/provider
// @access  Private/Provider
const getProviderBookings = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (!provider) {
    res.status(404);
    throw new Error(
      "Provider profile not found. Please complete your profile to view bookings.",
    );
  }

  const bookings = await Booking.find({ provider: provider._id })
    .populate("service", "title price images")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("service", "title price duration")
    .populate("provider", "businessName email phone");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isOwner = booking.user?._id.toString() === req.user._id.toString();
  
  // booking.provider is a ServiceProvider ObjectId, not a User ObjectId
  const providerProfile = await ServiceProvider.findById(booking.provider);
  const isProvider = 
    providerProfile && 
    providerProfile.user.toString() === req.user._id.toString();
    
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isProvider && !isAdmin) {
    res.status(401);
    throw new Error("Not authorized to view this booking");
  }
  res.status(200).json(booking);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id)
    .populate("service", "title")
    .populate("user", "_id name");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // booking.provider is a ServiceProvider ObjectId, not a User ObjectId
  const providerProfile = await ServiceProvider.findById(booking.provider);
  const isProvider =
    providerProfile &&
    providerProfile.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isProvider && !isAdmin) {
    res.status(401);
    throw new Error("Not authorized to update this booking");
  }

  booking.status = status || booking.status;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedBooking = await booking.save({ session });

    if (status === "completed" && booking.status !== "completed") {
      const userWallet = await Wallet.findOne({ user: booking.user._id }).session(session);
      if (userWallet) {
        const pointsToAdd = Math.floor(booking.totalAmount / 100);
        userWallet.loyaltyPoints += pointsToAdd;
        await userWallet.save({ session });

        await Transaction.create(
          [
            {
              user: booking.user._id,
              amount: 0,
              points: pointsToAdd,
              type: "credit",
              category: "points",
              description: `Points earned for completing ${booking.service.title}`,
              booking: booking._id,
            },
          ],
          { session },
        );
      }

      // PROVIDER EARNINGS RECONCILIATION
      if (providerProfile) {
        const providerWallet = await Wallet.findOne({ user: providerProfile.user }).session(session);
        if (providerWallet) {
          if (booking.paymentMethod === "Cash on Delivery") {
            // Provider has full cash, platform takes commission as a "debt" or debit from balance
            providerWallet.balance -= booking.commissionAmount;
            // totalEarnings still increases because they earned the full amount minus commission
            providerWallet.totalEarnings += booking.providerEarnings;
            await providerWallet.save({ session });

            await Transaction.create(
              [
                {
                  user: providerProfile.user,
                  amount: booking.commissionAmount,
                  type: "debit",
                  description: `Commission for COD booking: ${booking.service.title}`,
                  status: "completed",
                  booking: booking._id,
                },
              ],
              { session },
            );
          } else {
            // Digital payment, platform pays provider their earnings
            providerWallet.balance += booking.providerEarnings;
            providerWallet.withdrawableBalance += booking.providerEarnings;
            providerWallet.totalEarnings += booking.providerEarnings;
            await providerWallet.save({ session });

            await Transaction.create(
              [
                {
                  user: providerProfile.user,
                  amount: booking.providerEarnings,
                  type: "credit",
                  description: `Earnings for service completion: ${booking.service.title} (Digital Payment)`,
                  status: "completed",
                  booking: booking._id,
                },
              ],
              { session },
            );
          }

          // Update the PaymentTransaction record to completed
          await PaymentTransaction.findOneAndUpdate(
            { booking: booking._id },
            { status: "completed" },
            { session }
          );
        }
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Emit notification after successful status update
    const io = req.app.get("io");
    if (io && booking.user) {
      const statusMessages = {
        accepted:
          "Your booking has been accepted! The professional will be at your location on time.",
        "on-the-way": "Good news! The professional is on the way to your location.",
        started: "The service has started. The professional is now working on your request.",
        completed: "Your service has been completed. Please leave a review!",
        cancelled: "Unfortunately, your booking has been cancelled.",
      };
      if (statusMessages[status]) {
        await createNotification(io, {
          recipient: booking.user._id,
          title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}`,
          message: statusMessages[status],
          type: `booking_${status === "accepted" ? "confirmed" : status.replace("-", "_")}`,
          link: "/bookings",
        });
      }
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// @desc    Get admin financial stats
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  let financials = await PaymentTransaction.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalCommission: { $sum: "$platformCommission" },
        totalBookings: { $count: {} },
      },
    },
  ]);

  // Fallback: If no payment transactions yet (legacy data), calculate from completed bookings
  if (!financials || financials.length === 0) {
    const bookingFinancials = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalCommission: { $sum: "$commissionAmount" },
          totalBookings: { $count: {} },
        },
      },
    ]);
    if (bookingFinancials && bookingFinancials.length > 0) {
      financials = bookingFinancials;
    } else {
      financials = [{ totalRevenue: 0, totalCommission: 0, totalBookings: 0 }];
    }
  }

  const statusBreakdown = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Daily Bookings (Last 7 Days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const dailyBookings = await Booking.aggregate([
    {
      $match: { createdAt: { $gte: last7Days } },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top Services
  const topServices = await Booking.aggregate([
    { $group: { _id: "$service", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "services",
        localField: "_id",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    { $unwind: "$serviceInfo" },
    { $project: { title: "$serviceInfo.title", count: 1 } },
  ]);

  // City Demand
  const cityDemand = await Booking.aggregate([
    {
      $lookup: {
        from: "serviceproviders",
        localField: "provider",
        foreignField: "_id",
        as: "providerInfo",
      },
    },
    { $unwind: "$providerInfo" },
    { $unwind: "$providerInfo.location" }, // this might depend on schema, let's assume cities are strings as per Service model
    // Actually, services have cities. Let's group by service city if available.
    // However, booking has a 'service' populated.
  ]);
  // Re-evaluating City Demand: Since user has address in booking, let's use that.
  const cityWiseDemand = await Booking.aggregate([
    { $group: { _id: "$address.city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    financials: financials[0] || {
      totalRevenue: 0,
      totalCommission: 0,
      totalBookings: 0,
    },
    statusBreakdown,
    dailyBookings,
    topServices,
    cityWiseDemand,
  });
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "name email phone")
    .populate("service", "title price")
    .populate("provider", "businessName")
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Check if the user is the owner OR admin
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("Not authorized to cancel this booking");
  }

  // Only allow cancellation if not already completed/cancelled
  if (booking.status === "completed" || booking.status === "cancelled") {
    res.status(400);
    throw new Error(`Cannot cancel booking with status: ${booking.status}`);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    booking.status = "cancelled";
    
    // Refund if paid via wallet
    if (booking.paymentMethod === "wallet" && booking.paymentStatus === "completed") {
      const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
      if (wallet) {
        wallet.balance += booking.totalAmount;
        await wallet.save({ session });

        await Transaction.create(
          [
            {
              user: req.user._id,
              amount: booking.totalAmount,
              type: "credit",
              description: `Refund for cancelled booking #${booking._id.toString().slice(-8).toUpperCase()}`,
              status: "completed",
              booking: booking._id,
            },
          ],
          { session },
        );
        booking.paymentStatus = "refunded";
      }
    }

    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Notifications
    const io = req.app.get("io");
    if (io) {
      // Notify user
      await createNotification(io, {
        recipient: req.user._id,
        title: "Booking Cancelled",
        message: `Your booking for "${booking._id}" has been successfully cancelled.`,
        type: "booking_cancelled",
        link: "/bookings",
      });

      // Notify provider
      if (providerProfile && providerProfile.user) {
        await createNotification(io, {
          recipient: providerProfile.user,
          title: "Booking Cancelled by Customer",
          message: `A customer has cancelled their booking #${booking._id.toString().slice(-8).toUpperCase()}.`,
          type: "booking_cancelled",
          link: "/provider/bookings",
        });
      }
    }

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// @desc    Get all payment transactions (Admin)
// @route   GET /api/bookings/admin/transactions
// @access  Private/Admin
const getPaymentTransactions = asyncHandler(async (req, res) => {
  let transactions = await PaymentTransaction.find({})
    .populate("booking", "status")
    .populate("user", "name email")
    .populate("provider", "name email")
    .sort({ createdAt: -1 });

  // Fallback: If no transactions in ledger, return formatted historical completed bookings
  if (!transactions || transactions.length === 0) {
    const historicalBookings = await Booking.find({ status: "completed" })
      .populate("user", "name email")
      .populate("provider", "businessName")
      .sort({ createdAt: -1 });

    transactions = historicalBookings.map(b => ({
      _id: b._id,
      booking: { _id: b._id, status: b.status },
      user: b.user,
      provider: { name: b.provider?.businessName || "Provider", email: "" },
      totalAmount: b.totalAmount,
      providerEarning: b.providerEarnings,
      platformCommission: b.commissionAmount,
      commissionPercentage: 15, // Default
      paymentMethod: b.paymentMethod,
      status: "completed",
      createdAt: b.createdAt
    }));
  }

  res.status(200).json(transactions);
});

export {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  getAdminStats,
  getAllBookings,
  cancelBooking,
  getPaymentTransactions,
};
