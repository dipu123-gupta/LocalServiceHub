import AuditLog from "../models/AuditLog.js";

const logAction = async (req, action, targetId, targetModel, details) => {
  try {
    await AuditLog.create({
      user: req.user ? req.user._id : targetId,
      action,
      targetId,
      targetModel,
      details,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });
  } catch (err) {
    console.error("🔴 Error logging audit action:", err.message);
    // Don't throw error to avoid failing the main request
  }
};

export default logAction;
