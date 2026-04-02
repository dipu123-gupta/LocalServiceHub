import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import admin from "firebase-admin";
import mongoose from "mongoose";
import * as otplib from "otplib";
const { authenticator } = otplib;
import qrcode from "qrcode";
import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

import logAction from "../utils/auditLogger.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import Wallet from "../models/Wallet.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import asyncHandler from "express-async-handler";

const QRCode = qrcode.default || qrcode;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, referralCode } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (!userExists.isEmailVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      userExists.emailOtp = crypto.createHash("sha256").update(otp).digest("hex");
      userExists.emailOtpExpire = Date.now() + 10 * 60 * 1000;
      await userExists.save();
      
      const message = `Your new verification OTP is: ${otp}\nIt is valid for 10 minutes.`;
      try {
        await sendEmail({
          email: userExists.email,
          subject: "Email Verification OTP",
          message,
        });
      } catch (err) {
        console.error("Email Verification Error:", err);
        res.status(500);
        throw new Error("Render Mail Error: " + err.message);
      }
      return res.status(200).json({ requiresOTP: true, email: userExists.email, message: "OTP resent to your email" });
    }
    res.status(400);
    throw new Error("User already exists");
  }

  // Ensure the email domain is valid and can receive emails
  const domain = email.split("@")[1];
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      res.status(400);
      throw new Error("Please enter your valid email id");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Please enter your valid email id");
  }

  // Handle referral - checking existence of referrer early
  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      referredBy = referrer._id;
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await User.create(
      [
        {
          name,
          email,
          password,
          role: role || "user",
          referredBy,
        },
      ],
      { session },
    );

    // Create wallet for new user
    const [wallet] = await Wallet.create([{ user: user._id }], { session });

    // If referred, award bonuses
    if (referredBy) {
      // New user bonus (₹50)
      wallet.balance += 50;
      await wallet.save({ session });
      await Transaction.create(
        [
          {
            user: user._id,
            amount: 50,
            type: "credit",
            description: "Referral signup bonus",
          },
        ],
        { session },
      );

      // Referrer bonus (₹100)
      const referrerWallet = await Wallet.findOne({ user: referredBy }).session(
        session,
      );
      if (referrerWallet) {
        referrerWallet.balance += 100;
        await referrerWallet.save({ session });
        await Transaction.create(
          [
            {
              user: referredBy,
              amount: 100,
              type: "credit",
              description: `Bonus for referring ${user.name}`,
            },
          ],
          { session },
        );
      }
    }

    // --- Email Verification Implementation ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.emailOtpExpire = Date.now() + 10 * 60 * 1000;
    
    await user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();
    session.endSession();

    // Post-Transaction: Non-blocking Email
    const message = `Welcome to LocalServiceHub! Your email verification OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Email Verification OTP",
        message,
      });
    } catch (err) {
      console.error("Email Verification Error:", err);
      // Rollback transaction because email failed
      await session.abortTransaction();
      session.endSession();
      res.status(500);
      throw new Error("Render Mail Error: " + err.message);
    }

    res.status(201).json({
      requiresOTP: true,
      email: user.email,
      message: "Please verify your email using the OTP sent.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw error;
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if user has a password (might be a Google account)
  if (!user.password && user.authProvider === "google") {
    res.status(401);
    throw new Error(
      "This account uses Google Sign-In. Please log in with Google.",
    );
  }

  if (await user.matchPassword(password)) {
    // Check if user is blocked
    if (user.isBlocked) {
      res.status(403);
      throw new Error("Your account has been blocked. Please contact support.");
    }

    // Check if MFA is enabled
    if (user.isTwoFactorEnabled) {
      return res.status(200).json({
        mfaRequired: true,
        userId: user._id,
        email: user.email,
        message: "MFA code required to complete login",
      });
    }

    generateToken(res, user._id);
    await logAction(req, "LOGIN", user._id, "User", "User logged in successfully (Standard)");

    const populatedUser = await User.findById(user._id).populate(
      "activeSubscription",
    );
    res.status(200).json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      profileImage: populatedUser.profileImage,
      activeSubscription: populatedUser.activeSubscription,
      subscriptionExpiresAt: populatedUser.subscriptionExpiresAt,
      isEmailVerified: populatedUser.isEmailVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("activeSubscription");

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      activeSubscription: user.activeSubscription,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("There is no user with that email");
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid token");
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.body.address) user.address = req.body.address;
  // SECURITY: Remote password update from profile edit. 
  // Password updates MUST use the /update-password route which requires currentPassword.

  if (req.file) {
    user.profileImage = req.file.path;
  }

  const updatedUser = await (await user.save()).populate("activeSubscription");

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    address: updatedUser.address,
    profileImage: updatedUser.profileImage,
    activeSubscription: updatedUser.activeSubscription,
    subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
  });
});

// @desc    Verify Email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// @desc    Update Password securely
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Please provide both current and new passwords");
  }

  // Find user and explicitly select password field
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if user has a password (might be a Google account)
  if (!user.password && user.authProvider === "google") {
    res.status(400);
    throw new Error(
      "This account uses Google Sign-In. You cannot change your password here.",
    );
  }

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Set new password (will be hashed automatically by pre-save hook)
  user.password = newPassword;
  await user.save();

  // Return new token
  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// @desc    Google Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error("Google ID token is required");
  }

  console.log("🚀 [GoogleAuth] Received Token Verification Request");

  try {
    let googleId, email, name, picture;

    // 1. Try Firebase Admin if available (Most secure)
    if (admin.apps.length > 0) {
      console.log("🔹 Using Firebase Admin for verification...");
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      googleId = decodedToken.uid;
      email = decodedToken.email;
      name = decodedToken.name;
      picture = decodedToken.picture;
    } else {
      // 2. Fallback to google-auth-library (Requires audience to be Project ID for Firebase tokens)
      console.log("🔸 Firebase Admin not ready. Falling back to google-auth-library...");
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken,
        // For Firebase ID tokens, the audience IS the project ID
        audience: process.env.VITE_FIREBASE_PROJECT_ID || process.env.GOOGLE_CLIENT_ID || undefined,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    console.log(`✅ [GoogleAuth] Token Verified for: ${email}`);

    // Check MongoDB Connection State
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB not connected! State:", mongoose.connection.readyState);
      res.status(503);
      throw new Error("Database connection is currently unavailable. Please try again in a few seconds.");
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      console.log(`🔹 Existing user found: ${user.email}`);
      // link Google if not already
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider === "local" ? "local" : "google";
        if (picture && (!user.profileImage || !user.profileImage.includes("cloudinary"))) {
          user.profileImage = picture;
        }
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      console.log(`🆕 Creating new user: ${email}`);
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        profileImage: picture || undefined,
        isEmailVerified: true,
        role: "user",
      });

      await Wallet.create({ user: user._id });
    }

    generateToken(res, user._id);

    const populatedUser = await User.findById(user._id).populate("activeSubscription");

    res.status(200).json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      profileImage: populatedUser.profileImage,
      activeSubscription: populatedUser.activeSubscription,
      isEmailVerified: populatedUser.isEmailVerified,
      authProvider: populatedUser.authProvider,
    });
  } catch (error) {
    console.error("🔴 [GoogleAuth Error]:", error.message);
    res.status(error.statusCode || 401);
    throw new Error(error.message || "Google authentication failed.");
  }
});

// @desc    Setup MFA
// @route   POST /api/auth/mfa/setup
// @access  Private
const setupMFA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isTwoFactorEnabled) {
    res.status(400);
    throw new Error("MFA is already enabled");
  }

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(user.email, "HomeServiceHub", secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  user.twoFactorSecret = secret;
  await user.save();

  res.status(200).json({
    secret,
    qrCode: qrCodeDataUrl,
  });
});

// @desc    Verify MFA and Enable
// @route   POST /api/auth/mfa/verify
// @access  Private
const verifyAndEnableMFA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id).select("+twoFactorSecret");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isValid = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  });

  if (!isValid) {
    res.status(400);
    throw new Error("Invalid MFA token");
  }

  user.isTwoFactorEnabled = true;
  await user.save();

  await logAction(req, "MFA_ENABLED", user._id, "User", "MFA was enabled by the user.");

  res.status(200).json({
    success: true,
    message: "MFA enabled successfully",
  });
});

// @desc    Validate MFA for Login
// @route   POST /api/auth/mfa/login-verify
// @access  Public
const loginVerifyMFA = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId).select("+twoFactorSecret");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.isTwoFactorEnabled) {
    res.status(400);
    throw new Error("MFA is not enabled for this user");
  }

  const isValid = authenticator.verify({
    token,
    secret: user.twoFactorSecret,
  });

  if (!isValid) {
    res.status(400);
    throw new Error("Invalid MFA token");
  }

  generateToken(res, user._id);
  await logAction(req, "LOGIN", user._id, "User", "User logged in successfully (MFA Verified)");

  const populatedUser = await User.findById(user._id).populate("activeSubscription");

  res.status(200).json({
    _id: populatedUser._id,
    name: populatedUser.name,
    email: populatedUser.email,
    role: populatedUser.role,
    profileImage: populatedUser.profileImage,
    activeSubscription: populatedUser.activeSubscription,
    isEmailVerified: populatedUser.isEmailVerified,
  });
});

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Please provide email and OTP");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    emailOtp: hashedOtp,
    emailOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpire = undefined;
  await user.save();

  generateToken(res, user._id);
  await logAction(req, "REGISTER_VERIFY", user._id, "User", "User registered and verified OTP");

  const populatedUser = await User.findById(user._id).populate("activeSubscription");

  res.status(200).json({
    _id: populatedUser._id,
    name: populatedUser.name,
    email: populatedUser.email,
    role: populatedUser.role,
    profileImage: populatedUser.profileImage,
    activeSubscription: populatedUser.activeSubscription,
    isEmailVerified: true,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyEmailOTP,
  updatePassword,
  googleAuth,
  setupMFA,
  verifyAndEnableMFA,
  loginVerifyMFA,
};
