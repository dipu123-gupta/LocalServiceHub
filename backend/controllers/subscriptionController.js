import SubscriptionPlan from "../models/SubscriptionPlan.js";
import User from "../models/User.js";
import ServiceProvider from "../models/ServiceProvider.js";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
if (!stripe) {
  console.warn(
    "STRIPE_SECRET_KEY not found in .env. Subscription features will be disabled.",
  );
}

// @desc    Get all active subscription plans for a role
// @route   GET /api/subscriptions/plans/:role
// @access  Public
const getPlansByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const plans = await SubscriptionPlan.find({ type: role, isActive: true });
  res.json(plans);
});

// @desc    Create subscription payment intent
// @route   POST /api/subscriptions/subscribe
// @access  Private
const createSubscriptionIntent = asyncHandler(async (req, res) => {
  if (!stripe) {
    res.status(503);
    throw new Error(
      "Subscription payments are currently unavailable. Stripe is not configured.",
    );
  }

  const { planId } = req.body;

  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(plan.price * 100),
    currency: "inr",
    metadata: {
      planId: plan._id.toString(),
      userId: req.user._id.toString(),
      type: "subscription",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});

// Note: Confirmation will be handled by the same payment webhook
// but we need to update the logic there to detect 'subscription' metadata.

// @desc    Get all active subscription plans
// @route   GET /api/subscriptions/plans/all
// @access  Public
const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.json(plans);
});

export { getPlansByRole, createSubscriptionIntent, getAllPlans };
