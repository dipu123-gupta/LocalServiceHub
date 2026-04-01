import SupportTicket from "../models/SupportTicket.js";
import asyncHandler from "express-async-handler";
import APIFeatures from "../utils/apiFeatures.js";

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { subject, message, booking, category, priority } = req.body;

  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    message,
    booking,
    category,
    priority,
  });

  res.status(201).json(ticket);
});

// @desc    Get user's support tickets
// @route   GET /api/support
// @access  Private
const getMyTickets = asyncHandler(async (req, res) => {
  const totalTickets = await SupportTicket.countDocuments({ user: req.user._id });
  const features = new APIFeatures(
    SupportTicket.find({ user: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const tickets = await features.query;
  res.status(200).json({
    tickets,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalTickets / (req.query.limit * 1 || 10)),
    total: totalTickets,
  });
});

// @desc    Get all support tickets (Admin only)
// @route   GET /api/support/admin
// @access  Private/Admin
const getAllTickets = asyncHandler(async (req, res) => {
  const totalTickets = await SupportTicket.countDocuments();
  const features = new APIFeatures(
    SupportTicket.find().populate("user", "name email"),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const tickets = await features.query;
  res.status(200).json({
    tickets,
    page: req.query.page * 1 || 1,
    pages: Math.ceil(totalTickets / (req.query.limit * 1 || 10)),
    total: totalTickets,
  });
});

// @desc    Update ticket status (Admin)
// @route   PUT /api/support/:id
// @access  Private/Admin
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  ticket.status = req.body.status || ticket.status;
  ticket.resolution = req.body.resolution || ticket.resolution;
  ticket.priority = req.body.priority || ticket.priority;
  
  if (req.body.status === "resolved") {
    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = Date.now();
  }

  const updatedTicket = await ticket.save();
  res.json(updatedTicket);
});

export { createTicket, getMyTickets, getAllTickets, updateTicket };
