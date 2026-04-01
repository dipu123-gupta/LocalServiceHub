import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
} from "../controllers/supportController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createTicket)
  .get(protect, getMyTickets);

router.route("/admin")
  .get(protect, admin, getAllTickets);

router.route("/:id")
  .put(protect, admin, updateTicket);

export default router;
