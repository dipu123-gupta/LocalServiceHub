import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/announcementController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createAnnouncement)
  .get(protect, getAnnouncements);

export default router;
