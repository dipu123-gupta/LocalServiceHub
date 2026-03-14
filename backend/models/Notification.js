import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "booking_confirmed",
        "booking_cancelled",
        "booking_completed",
        "payment",
        "review",
        "system",
      ],
      default: "system",
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    data: { type: Object },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
