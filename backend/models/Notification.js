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
        "booking_accepted",
        "booking_cancelled",
        "booking_completed",
        "booking_on_the_way",
        "booking_started",
        "booking_update",
        "payment",
        "review",
        "system",
        "announcement",
        "chat",
      ],
      default: "system",
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    data: { type: Object },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
