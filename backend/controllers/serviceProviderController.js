import ServiceProvider from "../models/ServiceProvider.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get current provider profile
// @route   GET /api/service-providers/profile
// @access  Private/Provider
const getProviderProfile = asyncHandler(async (req, res) => {
  let provider = await ServiceProvider.findOne({ user: req.user._id }).populate(
    "category",
    "name",
  );

  if (!provider) {
    // Create a default profile if it doesn't exist
    provider = await ServiceProvider.create({
      user: req.user._id,
      businessName: `${req.user.name}'s Services`,
      description: "No description provided yet.",
    });
    provider = await provider.populate("category", "name");
  }

  res.status(200).json(provider);
});

// @desc    Update provider profile
// @route   PUT /api/service-providers/profile
// @access  Private/Provider
const updateProviderProfile = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (provider) {
    provider.businessName = req.body.businessName || provider.businessName;
    provider.description = req.body.description || provider.description;
    provider.availability = req.body.availability || provider.availability;
    provider.category = req.body.category || provider.category;
    provider.experience = req.body.experience || provider.experience;
    provider.serviceArea = req.body.serviceArea || provider.serviceArea;
    
    if (req.body.skills) {
      provider.skills = Array.isArray(req.body.skills) 
        ? req.body.skills 
        : req.body.skills.split(",").map(s => s.trim()).filter(Boolean);
    }
    
    if (req.body.bankDetails) {
      provider.bankDetails = {
        ...provider.bankDetails,
        ...req.body.bankDetails
      };
    }
    
    if (req.body.status) provider.status = req.body.status;

    const updatedProvider = await (
      await provider.save()
    ).populate("category", "name");

    // Sync User level fields (Contact Details)
    const user = await User.findById(req.user._id);
    if (user) {
      if (req.body.name) user.name = req.body.name;
      if (req.body.phone) user.phone = req.body.phone;
      await user.save();
    }

    if (req.body.status) {
      const io = req.app.get("io");
      if (io) {
        io.emit("providerStatusUpdated", {
          providerId: updatedProvider._id,
          status: updatedProvider.status,
        });
      }
    }

    res.json(updatedProvider);
  } else {
    res.status(404);
    throw new Error("Provider profile not found");
  }
});

// @desc    Upload verification document
// @route   POST /api/service-providers/documents
// @access  Private/Provider
const uploadDocument = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (provider) {
    const documentUrl = req.file ? req.file.path : req.body.url;
    const documentName = name || (req.file ? req.file.originalname : "Document");

    if (!documentUrl) {
      res.status(400);
      throw new Error("No document file or URL provided");
    }

    provider.documents.push({ name: documentName, url: documentUrl, status: "pending" });
    provider.submittedAt = Date.now();
    await provider.save();
    res.status(201).json({
      message: "Document uploaded successfully",
      documents: provider.documents,
    });
  } else {
    res.status(404);
    throw new Error("Provider profile not found");
  }
});

// @desc    Get all pending provider verifications (Admin)
// @route   GET /api/service-providers/pending
// @access  Private/Admin
const getPendingProviders = asyncHandler(async (req, res) => {
  const providers = await ServiceProvider.find({
    "documents.status": "pending",
  }).populate("user", "name email phone");

  res.json(providers);
});

// @desc    Verify a document or overall provider status (Admin)
// @route   PUT /api/service-providers/:id/verify
// @access  Private/Admin
const verifyProviderStatus = asyncHandler(async (req, res) => {
  const { docId, status, isVerified } = req.body;
  const provider = await ServiceProvider.findById(req.params.id);

  if (provider) {
    if (docId && status) {
      const doc = provider.documents.id(docId);
      if (doc) {
        doc.status = status;
      }
    } else if (status) {
      // If status is provided without docId, treat as overall status
      if (status === "verified") {
        provider.isVerified = true;
        provider.verifiedAt = Date.now();
      } else if (status === "rejected") {
        provider.isVerified = false;
        provider.verifiedAt = null;
      }
    }

    if (isVerified !== undefined) {
      provider.isVerified = isVerified;
      if (isVerified) {
        provider.verifiedAt = Date.now();
      } else {
        provider.verifiedAt = null;
      }
    }

    await provider.save();

    // Notify Provider via Real-time & Push
    const io = req.app.get("io");
    if (io) {
      let title = "Verification Update";
      let message = "Your verification status has been updated.";

      if (status === "verified" || isVerified === true) {
        title = "Congratulations! You're Verified";
        message =
          "Your provider profile has been approved. You can now start receiving bookings.";
      } else if (status === "rejected" || isVerified === false) {
        title = "Verification Rejected";
        message =
          "Your provider verification has been rejected. Please check your documents and try again.";
      }

      const { createNotification } =
        await import("./notificationController.js");
      await createNotification(io, {
        recipient: provider.user,
        title,
        message,
        type:
          status === "verified" || isVerified ? "system" : "booking_cancelled", // using system type
        link: "/provider/dashboard",
      });
    }

    res.json({ message: "Verification status updated", provider });
  } else {
    res.status(404);
    throw new Error("Provider profile not found");
  }
});

// @desc    Get provider dashboard stats
// @route   GET /api/service-providers/stats
// @access  Private/Provider
const getProviderStats = asyncHandler(async (req, res) => {
  const provider = await ServiceProvider.findOne({ user: req.user._id });

  if (!provider) {
    res.status(404);
    throw new Error("Provider profile not found");
  }

  const { default: Booking } = await import("../models/Booking.js");
  const { default: Review } = await import("../models/Review.js");
  const { default: Wallet } = await import("../models/Wallet.js");

  const wallet = await Wallet.findOne({ user: req.user._id });

  const bookings = await Booking.find({ provider: provider._id });

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((acc, curr) => acc + (curr.providerEarnings || 0), 0);

  const recentBookings = await Booking.find({ provider: provider._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name profileImage");

  const stats = {
    totalBookings,
    completedBookings,
    pendingBookings,
    totalEarnings: wallet?.totalEarnings || 0,
    withdrawableBalance: wallet?.withdrawableBalance || 0,
    pendingBalance: wallet?.pendingBalance || 0,
    balance: wallet?.balance || 0,
    rating: provider.rating,
    numReviews: provider.numReviews,
    recentActivities: recentBookings.map(b => ({
      id: b._id,
      type: "booking",
      title: `Booking ${b.status}`,
      description: `Job for ${b.user?.name || "Customer"}`,
      timestamp: b.createdAt,
      status: b.status
    }))
  };

  res.json(stats);
});

// @desc    Get all service providers (Admin)
// @route   GET /api/service-providers
// @access  Private/Admin
const getAllProviders = asyncHandler(async (req, res) => {
  const providers = await ServiceProvider.find({})
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.json(providers);
});

export {
  getProviderProfile,
  updateProviderProfile,
  uploadDocument,
  getPendingProviders,
  verifyProviderStatus,
  getAllProviders,
  getProviderStats,
};
