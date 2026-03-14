import express from "express";
import {
  getWallet,
  addFunds,
  getTransactions,
  redeemPoints,
} from "../controllers/walletController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  validateRequest,
  addFundsSchema,
  redeemPointsSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getWallet);
router.route("/add").post(protect, validateRequest(addFundsSchema), addFunds);
router.route("/transactions").get(protect, getTransactions);
router
  .route("/redeem")
  .post(protect, validateRequest(redeemPointsSchema), redeemPoints);

export default router;
