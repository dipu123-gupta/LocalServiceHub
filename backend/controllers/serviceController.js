import Service from "../models/Service.js";
import Category from "../models/Category.js";
import ServiceProvider from "../models/ServiceProvider.js";
import asyncHandler from "express-async-handler";
import { getSurgeMultiplier } from "../utils/surgeUtils.js";

// Haversine distance calculation (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const { category, search, city, lat, lng } = req.query;

  const query = {};
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // We no longer strictly filter by city, instead we use it for sorting priority
  let services = await Service.find(query)
    .populate("provider", "businessName rating numReviews user location")
    .populate("category", "name icon");

  // 1. Distance Calculation & Sorting (if lat/lng provided)
  if (req.query.lat && req.query.lng) {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    services = services.map((service) => {
      let distance = Infinity;
      if (service.provider?.location?.coordinates?.length === 2) {
        const [provLng, provLat] = service.provider.location.coordinates;
        distance = calculateDistance(userLat, userLng, provLat, provLng);
      }
      return {
        ...service._doc,
        distance: distance === Infinity ? null : distance,
      };
    });

    // Sort by distance (nearest first, nulls at the end)
    services.sort((a, b) => {
      const distA = a.distance !== null ? a.distance : Infinity;
      const distB = b.distance !== null ? b.distance : Infinity;
      return distA - distB;
    });
  }

  // 2. City Priority Sorting: Services operating in the requested city come first (overrides distance priority)
  if (req.query.city) {
    const targetCity = req.query.city.toLowerCase();
    services.sort((a, b) => {
      const aHasCity =
        a.cities && Array.isArray(a.cities) && a.cities.some((c) => c.toLowerCase() === targetCity);
      const bHasCity =
        b.cities && Array.isArray(b.cities) && b.cities.some((c) => c.toLowerCase() === targetCity);
      if (aHasCity && !bHasCity) return -1;
      if (!aHasCity && bHasCity) return 1;
      return 0; // maintain relative order (which is now distance order) otherwise
    });
  }

  // 3. Apply surge multiplier if city is provided
  if (req.query.city) {
    services = await Promise.all(
      services.map(async (s) => {
        // Check if it's already unwrapped by the map above
        const doc = s._doc ? s._doc : s;
        const surge = await getSurgeMultiplier(
          req.query.city,
          doc.category?._id,
        );
        return {
          ...doc,
          price: Math.round(doc.price * surge.multiplier),
          originalPrice: doc.price,
          surgeMultiplier: surge.multiplier,
        };
      }),
    );
  }

  res.status(200).json(services);
});

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate("provider", "businessName rating numReviews description user")
    .populate("category", "name");

  if (service) {
    // Calculate surge for the city provided in query or default to a common one
    // For detail view, we usually need a city to calculate surge accurately.
    const city = req.query.city || "";
    const surge = await getSurgeMultiplier(city, service.category?._id);

    res.status(200).json({
      ...service._doc,
      surgeMultiplier: surge.multiplier,
      surgeReason: surge.reason,
    });
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = asyncHandler(async (req, res) => {
  const { title, description, price, duration, category } = req.body;

  // Parse comma-separated features and cities from FormData
  const features = req.body.features
    ? req.body.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];
  const cities = req.body.cities
    ? req.body.cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename || `temp_${Date.now()}`, // Fallback if local storage
    }));
  }

  // Find the ServiceProvider document for this user
  let provider = await ServiceProvider.findOne({ user: req.user._id });

  if (!provider) {
    // If no provider profile exists yet, create one
    provider = await ServiceProvider.create({
      user: req.user._id,
      businessName: `${req.user.name}'s Services`,
      description: "No description provided yet.",
    });
  }

  if (!provider.isVerified) {
    res.status(403);
    throw new Error(
      "Your account is not verified. Please complete verification to create services.",
    );
  }

  const service = new Service({
    provider: provider._id,
    title,
    description,
    price,
    duration,
    category,
    images,
    features,
    cities,
  });

  const createdService = await service.save();
  res.status(201).json(createdService);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Provider
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate("provider");

  if (service) {
    // Only owner or admin can delete
    if (
      service.provider.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(401);
      throw new Error("Not authorized to delete this service");
    }
    await service.deleteOne();
    res.json({ message: "Service removed" });
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Provider
const updateService = asyncHandler(async (req, res) => {
  const { title, description, price, duration, category } = req.body;
  const service = await Service.findById(req.params.id).populate("provider");

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // Ensure only the owner can update
  if (
    service.provider.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401);
    throw new Error("Not authorized to update this service");
  }

  // Parse comma-separated arrays
  let features = service.features;
  if (req.body.features !== undefined) {
    features = req.body.features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  }

  let cities = service.cities;
  if (req.body.cities !== undefined) {
    cities = req.body.cities
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }

  let images = service.images;
  if (req.files && req.files.length > 0) {
    // If new images are uploaded, append them
    const newImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename || `temp_${Date.now()}`,
    }));
    images = [...images, ...newImages];
  }

  // Handle deletions if 'removedImages' is sent from frontend
  if (req.body.removedImages) {
    const removedUrls = JSON.parse(req.body.removedImages);
    images = images.filter((img) => !removedUrls.includes(img.url));
  }

  service.title = title || service.title;
  service.description = description || service.description;
  service.price = price || service.price;
  service.duration = duration || service.duration;
  service.category = category || service.category;
  service.features = features;
  service.cities = cities;
  service.images = images;

  const updatedService = await service.save();
  res.status(200).json(updatedService);
});

// @desc    Moderate a service (Admin)
// @route   PUT /api/services/:id/moderate
// @access  Private/Admin
const moderateService = asyncHandler(async (req, res) => {
  const { moderationStatus, isActive } = req.body;
  const service = await Service.findById(req.params.id);

  if (service) {
    if (moderationStatus) service.moderationStatus = moderationStatus;
    if (isActive !== undefined) service.isActive = isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Get my services (Provider)
// @route   GET /api/services/my
// @access  Private/Provider
const getMyServices = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (!provider) {
    res.status(404);
    throw new Error("Provider profile not found");
  }

  const services = await Service.find({ provider: provider._id })
    .populate("category", "name icon")
    .sort({ createdAt: -1 });

  res.json(services);
});

export {
  getServices,
  getServiceById,
  createService,
  deleteService,
  updateService,
  moderateService,
  getMyServices,
};
