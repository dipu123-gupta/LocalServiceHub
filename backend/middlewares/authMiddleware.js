import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      if (req.user.isBlocked) {
        res.status(403);
        throw new Error("Your account has been blocked. Please contact support.");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

const provider = (req, res, next) => {
  if (req.user && (req.user.role === "provider" || req.user.role === "admin")) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as a provider" });
  }
};

export { protect, admin, provider };
