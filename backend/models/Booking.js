import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    contactNumber: {
      type: String,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    providerEarnings: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "confirmed",
        "on-the-way",
        "started",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    otp: {
      type: String,
    },
    arrivalPhoto: {
      url: String,
      public_id: String,
    },
    completionPhoto: {
      url: String,
      public_id: String,
    },
    additionalCharges: [
      {
        item: String,
        price: Number,
        approvalStatus: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    taxPercentage: {
      type: Number,
      default: 18,
    },
    invoiceId: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ category: 1 }); // Fixed: added category index for booking query optimization

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
