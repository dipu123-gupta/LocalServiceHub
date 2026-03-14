import express from "express";
import {
  requestWithdrawal,
  getMyWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
} from "../controllers/withdrawalController.js";
import { protect, admin, provider } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, provider, requestWithdrawal)
  .get(protect, admin, getAllWithdrawals);

router.route("/my").get(protect, provider, getMyWithdrawals);

router.route("/:id").put(protect, admin, updateWithdrawalStatus);

export default router;
