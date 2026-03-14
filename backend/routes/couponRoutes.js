import express from "express";
import {
  validateCoupon,
  createCoupon,
  getCoupons,
} from "../controllers/couponController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);
router.route("/validate").post(protect, validateCoupon);

export default router;
