import express from "express";
import {
  getPlansByRole,
  createSubscriptionIntent,
  getAllPlans,
} from "../controllers/subscriptionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/plans/all", getAllPlans);
router.get("/plans/:role", getPlansByRole);
router.post("/subscribe", protect, createSubscriptionIntent);

export default router;
