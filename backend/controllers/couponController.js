import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid or expired coupon code");
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    res.status(400);
    throw new Error("Coupon has expired");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }

  if (amount < coupon.minBookingAmount) {
    res.status(400);
    throw new Error(
      `Minimum booking amount for this coupon is ₹${coupon.minBookingAmount}`,
    );
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    code: coupon.code,
    discount,
    finalAmount: Math.max(0, amount - discount),
  });
});

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

export { validateCoupon, createCoupon, getCoupons };
