import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "UPDATE_ROLE",
        "BLOCK_USER",
        "UNBLOCK_USER",
        "WALLET_CREDIT",
        "WALLET_DEBIT",
        "WITHDRAWAL_REQUEST",
        "WITHDRAWAL_APPROVE",
        "MFA_ENABLED",
        "MFA_DISABLED",
        "DELETE_SERVICE",
        "CANCEL_BOOKING",
      ],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    targetModel: {
      type: String,
      required: false,
      enum: ["User", "Booking", "Wallet", "Service", "Withdrawal"],
    },
    details: {
      type: String,
      required: true,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
