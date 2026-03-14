import express from "express";
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  getAdminStats,
  getAllBookings,
  cancelBooking,
  getPaymentTransactions,
} from "../controllers/bookingController.js";
import { protect, provider, admin } from "../middlewares/authMiddleware.js";
import {
  validateRequest,
  createBookingSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getAllBookings)
  .post(protect, validateRequest(createBookingSchema), createBooking);
router.route("/mybookings").get(protect, getMyBookings);
router.route("/provider").get(protect, provider, getProviderBookings);
router.route("/admin/stats").get(protect, admin, getAdminStats);
router.route("/admin/transactions").get(protect, admin, getPaymentTransactions);
router.route("/:id").get(protect, getBookingById);
router.route("/:id/status").put(protect, provider, updateBookingStatus);
router.route("/:id/cancel").put(protect, cancelBooking);

export default router;
