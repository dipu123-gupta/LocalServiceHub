import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: Number, // in days
      required: true,
      default: 30,
    },
    type: {
      type: String,
      enum: ["user", "provider"],
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    commissionRate: {
      type: Number, // Only for provider plans
    },
    discountPercentage: {
      type: Number, // Only for user plans
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema,
);
export default SubscriptionPlan;
