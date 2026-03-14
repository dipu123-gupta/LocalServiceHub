import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [100, "Minimum withdrawal amount is ₹100"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
    adminNote: {
      type: String,
    },
    transactionId: {
      type: String, // Reference of the actual bank transfer
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
