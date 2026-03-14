import Review from "../models/Review.js";
import Service from "../models/Service.js";
import ServiceProvider from "../models/ServiceProvider.js";
import Booking from "../models/Booking.js";
import asyncHandler from "express-async-handler";
import { createNotification } from "./notificationController.js";

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, serviceId } = req.body;

  const service = await Service.findById(serviceId);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // Check if user has already reviewed this service
  const alreadyReviewed = await Review.findOne({
    service: serviceId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this service");
  }

  // Check if user has a completed booking for this service
  const hasCompletedBooking = await Booking.findOne({
    service: serviceId,
    user: req.user._id,
    status: "completed",
  });

  if (!hasCompletedBooking) {
    res.status(400);
    throw new Error(
      "You can only review services you have completed bookings for",
    );
  }

  const review = new Review({
    service: serviceId,
    provider: service.provider,
    user: req.user._id,
    rating: Number(rating),
    comment,
  });

  await review.save();

  // Update Service rating
  const reviews = await Review.find({ service: serviceId });
  service.numReviews = reviews.length;
  service.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await service.save();

  // Update ServiceProvider rating
  const provider = await ServiceProvider.findById(service.provider);
  if (provider) {
    const providerReviews = await Review.find({ provider: service.provider });
    provider.numReviews = providerReviews.length;
    provider.rating =
      providerReviews.reduce((acc, item) => item.rating + acc, 0) /
      providerReviews.length;

    await provider.save();
  }

  // Notify Provider via Real-time & Push
  const providerUser = await ServiceProvider.findById(service.provider).select(
    "user businessName",
  );
  if (providerUser && providerUser.user) {
    const io = req.app.get("io");
    if (io) {
      await createNotification(io, {
        recipient: providerUser.user,
        title: "New Review Received!",
        message: `A customer has left a ${rating}-star review for "${service.title}".`,
        type: "review",
        link: "/provider/dashboard",
      });
    }
  }

  res.status(201).json({ message: "Review added" });
});

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:id
// @access  Public
const getServiceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get current user reviews
// @route   GET /api/reviews/myreviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate("service", "title images")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider
// @access  Private/Provider
const getProviderReviews = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });
  if (!provider) {
    res.status(404);
    throw new Error(
      "Provider profile not found. Please complete your profile to view reviews.",
    );
  }
  const reviews = await Review.find({ provider: provider._id })
    .populate("user", "name")
    .populate("service", "title")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export { createReview, getServiceReviews, getMyReviews, getProviderReviews };
