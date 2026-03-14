import express from "express";
import {
  createReview,
  getServiceReviews,
  getMyReviews,
  getProviderReviews,
} from "../controllers/reviewController.js";
import { protect, provider } from "../middlewares/authMiddleware.js";
import {
  validateRequest,
  createReviewSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, validateRequest(createReviewSchema), createReview);
router.route("/service/:id").get(getServiceReviews);
router.route("/myreviews").get(protect, getMyReviews);
router.route("/provider").get(protect, provider, getProviderReviews);

export default router;
