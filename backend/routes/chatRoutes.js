import express from "express";
import {
  sendMessage,
  getMessages,
  getChatList,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  validateRequest,
  sendMessageSchema,
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(validateRequest(sendMessageSchema), sendMessage);
router.route("/list").get(getChatList);
router.route("/:userId").get(getMessages);

export default router;
