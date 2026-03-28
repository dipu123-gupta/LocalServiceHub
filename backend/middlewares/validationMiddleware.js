import Joi from "joi";

/**
 * Middleware to validate request body against a Joi schema
 * Uses next(error) instead of throw to safely pass errors to Express error handler
 * @param {Object} schema - Joi schema object
 */
export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400);
    return next(new Error(errorMessage));
  }

  next();
};

/**
 * Auth Validation Schemas
 */
export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid("user", "provider"),
  referralCode: Joi.string().allow("", null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Booking Validation Schemas
 */
export const createBookingSchema = Joi.object({
  serviceId: Joi.string().required(),
  bookingDate: Joi.date().required().greater("now"),
  timeSlot: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().optional().allow("", null),
    zipCode: Joi.string().required(),
    country: Joi.string().default("India").optional(),
  }).required(),
  paymentMethod: Joi.string().valid(
    "wallet",
    "Razorpay",
    "stripe",
    "Cash on Delivery",
  ),
  couponCode: Joi.string().allow("", null),
  notes: Joi.string().max(500).allow("", null),
});

/**
 * Review Validation Schema
 */
export const createReviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().min(5).max(500),
  serviceId: Joi.string().required(),
});

/**
 * Wallet Validation Schemas
 */
export const addFundsSchema = Joi.object({
  amount: Joi.number().required().min(1),
});

export const redeemPointsSchema = Joi.object({
  points: Joi.number().required().min(100),
});

/**
 * Chat Validation Schema
 */
export const sendMessageSchema = Joi.object({
  recipientId: Joi.string().required(),
  message: Joi.string().required().min(1).max(2000),
  bookingId: Joi.string().allow("", null),
});

/**
 * Service Validation Schema (for non-multipart routes)
 */
export const serviceSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(20),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  duration: Joi.string().required(),
  images: Joi.array().items(Joi.string()),
});
