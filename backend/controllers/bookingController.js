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
import sendEmail from "../utils/sendEmail.js";
import APIFeatures from "../utils/apiFeatures.js";
import logAction from "../utils/auditLogger.js";
import generateInvoice from "../utils/pdfUtils.js";

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
  // Note: Coupon usedCount increment is moved inside the transaction below to prevent race conditions
  let validatedCoupon = null;
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
      validatedCoupon = coupon; // Save reference for atomic increment inside transaction
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

  // 1.5 Check Provider Availability BEFORE starting transaction
  const bDate = new Date(bookingDate);
  const dayName = bDate.toLocaleDateString('en-US', { weekday: 'long' });
  if (provider.availability?.days?.length > 0 && !provider.availability.days.includes(dayName)) {
    res.status(400);
    throw new Error(`Provider is not available on ${dayName}s`);
  }

  // 2. Handle Wallet Payment & Booking Creation (Atomic)
  const session = await mongoose.startSession();
  session.startTransaction();

  let booking; // Declare booking outside try block to be accessible later

  try {
    // Atomically increment coupon usage inside the transaction to prevent race conditions
    if (validatedCoupon) {
      const updatedCoupon = await Coupon.findOneAndUpdate(
        {
          _id: validatedCoupon._id,
          isActive: true,
          expiryDate: { $gt: new Date() },
          usedCount: { $lt: validatedCoupon.usageLimit },
        },
        { $inc: { usedCount: 1 } },
        { new: true, session },
      );

      if (!updatedCoupon) {
        throw new Error("Coupon usage limit reached or coupon expired");
      }
    }

    if (paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ user: req.user._id }).session(session);
      if (!wallet || wallet.balance < finalAmount) {
        throw new Error("Insufficient wallet balance");
      }

      wallet.balance -= finalAmount;
      // Loyalty points are awarded on booking completion, not here (prevent double-award)
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
      otp: Math.floor(1000 + Math.random() * 9000).toString(), // Generate 4-digit OTP
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
    try {
      await session.abortTransaction();
    } catch (_) {
      // Transaction may have already been committed/aborted
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
  const totalBookings = await Booking.countDocuments({ user: req.user._id });
  const features = new APIFeatures(
    Booking.find({ user: req.user._id })
      .populate("service", "title price images duration")
      .populate("provider", "businessName"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const bookings = await features.query;
  res.status(200).json({
    bookings,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalBookings / (req.query.limit * 1 || 10)),
    total: totalBookings,
  });
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

  const totalBookings = await Booking.countDocuments({ provider: provider._id });
  const features = new APIFeatures(
    Booking.find({ provider: provider._id })
      .populate("service", "title price images")
      .populate("user", "name email phone"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const bookings = await features.query;
  res.status(200).json({
    bookings,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalBookings / (req.query.limit * 1 || 10)),
    total: totalBookings,
  });
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

    if (status === "completed") {
      if (!req.body.otp || req.body.otp !== booking.otp) {
        res.status(400);
        throw new Error("Invalid completion OTP. Please ask the customer for the correct code.");
      }
    }

    const oldStatus = booking.status;
    booking.status = status || booking.status;

    // Handle Photos if provided
    if (req.body.arrivalPhoto) booking.arrivalPhoto = req.body.arrivalPhoto;
    if (req.body.completionPhoto) booking.completionPhoto = req.body.completionPhoto;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedBooking = await booking.save({ session });

    if (status === "completed" && oldStatus !== "completed") {
      // Generate Invoice ID if not exists
      if (!booking.invoiceId) {
        booking.invoiceId = `INV-${Date.now()}-${booking._id.toString().slice(-4).toUpperCase()}`;
      }

      // Calculate granular financial breakdown for the transaction
      // For this app, subtotal is totalAmount - tax, where tax is 18% inclusive
      const taxRate = booking.taxPercentage || 18;
      const subtotal = booking.totalAmount / (1 + taxRate / 100);
      const taxAmount = booking.totalAmount - subtotal;

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
              subtotal,
              taxAmount,
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
            // Provider collected full cash from the user.
            // Commission is owed to the platform — we track it but do NOT
            // deduct from balance (which can't go below 0). Commission
            // reconciliation happens via the pending settlement flow.
            providerWallet.totalEarnings += booking.providerEarnings;
            await providerWallet.save({ session });

            await Transaction.create(
              [
                {
                  user: providerProfile.user,
                  amount: booking.commissionAmount,
                  type: "debit",
                  description: `Commission owed to platform for COD booking: ${booking.service.title}`,
                  status: "pending", // Pending until provider pays/settles
                  booking: booking._id,
                  subtotal,
                  taxAmount,
                  commissionAmount: booking.commissionAmount
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
                  subtotal,
                  taxAmount,
                  commissionAmount: booking.commissionAmount
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

    // Send OTP email when booking is accepted
    if (status === "accepted") {
      try {
        const userDoc = await User.findById(booking.user._id).select("name email");
        const serviceName = booking.service?.title || "your booked service";
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const otpEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Booking OTP</title>
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 48px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px; }
    .body { padding: 40px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    .subtext { font-size: 14px; color: #64748b; margin-bottom: 32px; line-height: 1.6; }
    .otp-box { background: linear-gradient(135deg, #eef2ff, #e0e7ff); border: 2px solid #c7d2fe; border-radius: 20px; padding: 32px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
    .otp-code { font-size: 52px; font-weight: 900; color: #312e81; letter-spacing: 14px; margin: 0; }
    .otp-hint { font-size: 12px; color: #818cf8; margin-top: 12px; }
    .details-box { background: #f8fafc; border-radius: 16px; padding: 24px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 13px; font-weight: 800; color: #1e293b; }
    .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px 20px; font-size: 13px; color: #92400e; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 24px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🏠 HomeServiceHub</h1>
      <p>Your booking has been confirmed!</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, ${userDoc?.name || "Valued Customer"}! 👋</p>
      <p class="subtext">
        Great news! Your service provider has <strong>accepted your booking</strong>.
        Please share the OTP below with the provider only after they have completed the work
        to your satisfaction. Do not share it before the job is done.
      </p>

      <div class="otp-box">
        <p class="otp-label">🔐 Your Completion OTP</p>
        <p class="otp-code">${booking.otp}</p>
        <p class="otp-hint">Share this with the provider only after work is complete</p>
      </div>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${serviceName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Date</span>
          <span class="detail-value">${bookingDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time Slot</span>
          <span class="detail-value">${booking.timeSlot}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking ID</span>
          <span class="detail-value">#${booking._id.toString().slice(-8).toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value">₹${booking.totalAmount}</span>
        </div>
      </div>

      <div class="warning">
        ⚠️ <strong>Important:</strong> Only share this OTP with the service provider after you are fully satisfied with the completed work. This OTP cannot be regenerated.
      </div>
    </div>
    <div class="footer">
      <p>You're receiving this because you booked a service on HomeServiceHub.</p>
      <p>© ${new Date().getFullYear()} HomeServiceHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

        await sendEmail({
          email: userDoc.email,
          subject: `🔐 Your Booking OTP for ${serviceName} — HomeServiceHub`,
          message: `Your booking for "${serviceName}" has been accepted. Your OTP is: ${booking.otp}. Share this with the provider only after work is complete.`,
          html: otpEmailHtml,
        });

        console.log(`OTP email sent to ${userDoc.email} for booking ${booking._id}`);
      } catch (emailErr) {
        // Non-blocking: log the error but don't fail the request
        console.error("Failed to send OTP email:", emailErr.message);
      }
    }

    // Emit notification after successful status update
    const io = req.app.get("io");
    if (io && booking.user) {
      const statusMessages = {
        accepted:
          "Your booking has been accepted! Check your email for the completion OTP.",
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
  const financials = await Booking.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalCommission: { $sum: "$commissionAmount" },
        providerEarnings: { $sum: "$providerEarnings" },
        totalBookings: { $count: {} },
      },
    },
  ]);

  const stats = financials[0] || {
    totalRevenue: 0,
    totalCommission: 0,
    providerEarnings: 0,
    totalBookings: 0,
  };

  // Calculate real growth metrics by comparing current vs previous month
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthData] = await Booking.aggregate([
    { $match: { status: "completed", createdAt: { $gte: startOfThisMonth } } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" }, commission: { $sum: "$commissionAmount" } } },
  ]) || [{ revenue: 0, commission: 0 }];

  const [lastMonthData] = await Booking.aggregate([
    { $match: { status: "completed", createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" }, commission: { $sum: "$commissionAmount" } } },
  ]) || [{ revenue: 0, commission: 0 }];

  const thisRevenue = thisMonthData?.revenue || 0;
  const lastRevenue = lastMonthData?.revenue || 0;
  const thisCommission = thisMonthData?.commission || 0;
  const lastCommission = lastMonthData?.commission || 0;

  stats.revenueGrowth = lastRevenue > 0
    ? parseFloat((((thisRevenue - lastRevenue) / lastRevenue) * 100).toFixed(1))
    : 0;
  stats.commissionGrowth = lastCommission > 0
    ? parseFloat((((thisCommission - lastCommission) / lastCommission) * 100).toFixed(1))
    : 0;

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

  // City-wise Demand
  const cityWiseDemand = await Booking.aggregate([
    { $group: { _id: "$address.city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    financials: stats,
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
  const totalBookings = await Booking.countDocuments();
  const features = new APIFeatures(
    Booking.find({})
      .populate("user", "name email phone")
      .populate("service", "title price")
      .populate("provider", "businessName"),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const bookings = await features.query;
  res.status(200).json({
    bookings,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalBookings / (req.query.limit * 1 || 10)),
    total: totalBookings,
  });
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

  // Fetch provider profile for notifications
  const providerProfile = await ServiceProvider.findById(booking.provider);

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
    
    // Refund if paid via wallet — always refund to the booking owner, not req.user (could be admin)
    if (booking.paymentMethod === "wallet" && booking.paymentStatus === "completed") {
      const wallet = await Wallet.findOne({ user: booking.user }).session(session);
      if (wallet) {
        wallet.balance += booking.totalAmount;
        await wallet.save({ session });

        await Transaction.create(
          [
            {
              // Ledger must credit the booking owner (money is refunded to their wallet)
              user: booking.user,
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

    // Log the cancellation
    await logAction(
      req,
      "CANCEL_BOOKING",
      booking._id,
      "Booking",
      `Booking #${booking._id.toString().slice(-8).toUpperCase()} was cancelled.`,
    );

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

// @desc    Add additional charge to booking (Provider)
// @route   POST /api/bookings/:id/additional-charge
// @access  Private/Provider
const addAdditionalCharge = asyncHandler(async (req, res) => {
  const { item, price } = req.body;

  if (!item || !price) {
    res.status(400);
    throw new Error("Please provide item name and price");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const providerProfile = await ServiceProvider.findOne({ user: req.user._id });
  if (!providerProfile || booking.provider.toString() !== providerProfile._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to add charges to this booking");
  }

  if (booking.status !== "started") {
    res.status(400);
    throw new Error("Extra charges can only be added while the job is in progress (started status).");
  }

  booking.additionalCharges.push({ item, price, approvalStatus: "pending" });
  
  // NOTE: In a full production app, we would notify the customer to approve this.
  // For this version, we'll auto-approve or add it to the pending list.
  // We'll update totalAmount so the provider sees it in earnings calculation later.
  
  await booking.save();

  res.status(200).json(booking);
});

// @desc    Approve or reject additional charge (Customer)
// @route   PUT /api/bookings/:id/approve-charge/:chargeId
// @access  Private
const approveAdditionalCharge = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Must be 'approved' or 'rejected'");
  }

  const booking = await Booking.findById(req.params.id)
    .populate("service", "title")
    .populate("provider", "user");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to approve charges for this booking");
  }

  const charge = booking.additionalCharges.id(req.params.chargeId);
  if (!charge) {
    res.status(404);
    throw new Error("Additional charge not found");
  }

  if (charge.approvalStatus !== "pending") {
    res.status(400);
    throw new Error("Charge is already processed");
  }

  charge.approvalStatus = status;

  // If approved, update the total amount and commission/earnings
  if (status === "approved") {
    // Calculate original commission rate from booking data with division-by-zero guard
    const originalRate = booking.totalAmount > 0
      ? (booking.commissionAmount / booking.totalAmount) * 100
      : 15; // Fallback to default 15% if totalAmount is 0
    
    booking.totalAmount += charge.price;
    const extraCommission = (charge.price * originalRate) / 100;
    booking.commissionAmount += extraCommission;
    booking.providerEarnings += (charge.price - extraCommission);
  }

  await booking.save();

  // Notify Provider
  const io = req.app.get("io");
  if (io && booking.provider && booking.provider.user) {
    await createNotification(io, {
      recipient: booking.provider.user,
      title: `Extra Charge ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `The customer has ${status} the extra charge of ₹${charge.price} for "${charge.item}".`,
      type: "booking_update",
      link: "/provider/bookings",
    });
  }

  res.status(200).json(booking);
});

// @desc    Download booking invoice (PDF)
// @route   GET /api/bookings/:id/invoice
// @access  Private
const downloadInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("service", "title price")
    .populate("provider", "businessName email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Auth check
  const isOwner = booking.user?._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(401);
    throw new Error("Not authorized to download this invoice");
  }

  // Set response headers for PDF download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking._id}.pdf`
  );

  generateInvoice(booking, res);
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
  addAdditionalCharge,
  approveAdditionalCharge,
  downloadInvoice,
};
