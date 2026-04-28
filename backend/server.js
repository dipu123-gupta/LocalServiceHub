import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { initSocket } from "./services/socketService.js";
import mongoSanitize from "express-mongo-sanitize";
// xss-clean removed — deprecated/unmaintained since 2022. Helmet CSP provides XSS protection.
import hpp from "hpp";
import { apiLimiter, authLimiter } from "./middlewares/rateLimitMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import serviceProviderRoutes from "./routes/serviceProviderRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

//

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Enable trust proxy for Render/Proxy environments
// Enable trust proxy for Render/Proxy environments
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://localservicehub-frontend.onrender.com",
  "https://localservicehub-7f9q.onrender.com",
  process.env.FRONTEND_URL,
];

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Attach io to app so controllers can emit events
app.set("io", io);

// Socket.io Authentication Middleware
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user info to socket
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Init socket handlers
initSocket(io);

// Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://apis.google.com"],
        connectSrc: [
          "'self'",
          process.env.BACKEND_URL || "http://localhost:5000",
          process.env.BACKEND_WS_URL || "ws://localhost:5000",
          "http://127.0.0.1:5000",
          "ws://127.0.0.1:5000",
          "https://firebaseinstallations.googleapis.com",
          "https://fcmregistrations.googleapis.com",
          "https://identitytoolkit.googleapis.com",
          "https://securetoken.google.com",
        ],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://lh3.googleusercontent.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());

// Security Middlewares
app.use(mongoSanitize()); // Prevent NoSQL Injection
// xss-clean removed — deprecated. Helmet CSP + mongoSanitize provide sufficient protection.
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting
app.use("/api", apiLimiter); // Apply general API limits

// Diagnostic Middleware (development only — Morgan handles production logging)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.on("finish", () => {
      console.log(
        `✅ [${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode}`,
      );
    });
    next();
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/service-providers", serviceProviderRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/support", supportRoutes);

app.get("/", (req, res) => {
  res.send("LocalServiceHub API is running...");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io listening on port ${PORT}`);
});

// Global error handlers to prevent silent crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("🔴 Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit - just log. The error middleware will handle Express errors.
});

process.on("uncaughtException", (error) => {
  console.error("🔴 Uncaught Exception:", error);
  // For truly fatal errors, exit gracefully
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
});

//
