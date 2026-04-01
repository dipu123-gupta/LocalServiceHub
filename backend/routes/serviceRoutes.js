import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  deleteService,
  updateService,
  moderateService,
  getMyServices,
} from "../controllers/serviceController.js";
import { 
  protect, 
  provider, 
  admin, 
  optionalAuth 
} from "../middlewares/authMiddleware.js";
import {
  validateRequest,
  serviceSchema,
} from "../middlewares/validationMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/").get(optionalAuth, getServices).post(protect, provider, upload.array("images", 5), createService);
router.route("/my").get(protect, provider, getMyServices);
router
  .route("/:id")
  .get(getServiceById)
  .put(protect, provider, upload.array("images", 5), updateService)
  .delete(protect, provider, deleteService);

router.route("/:id/moderate").put(protect, admin, moderateService);

export default router;
