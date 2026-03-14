import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    experience: {
      type: String,
      trim: true,
    },
    serviceArea: [
      {
        type: String,
        trim: true,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    availability: {
      days: [String],
      startTime: String,
      endTime: String,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    documents: [
      {
        name: String,
        url: String,
        type: {
          type: String,
          enum: ["Identity Proof", "Address Proof", "Business License", "Other"],
          default: "Identity Proof",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    earnings: {
      type: Number,
      default: 0,
    },
    activeSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
  },
  {
    timestamps: true,
  },
);

serviceProviderSchema.index({ location: "2dsphere" });

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema,
);
export default ServiceProvider;
