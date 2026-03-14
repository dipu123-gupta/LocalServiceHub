import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  getSettings,
  getSettingByKey,
  updateSetting,
} from "../controllers/settingController.js";

const router = express.Router();

router.route("/").get(protect, admin, getSettings).post(protect, admin, updateSetting);
router.route("/:key").get(protect, getSettingByKey);

export default router;
