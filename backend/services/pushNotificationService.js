import admin from "firebase-admin";
import fs from "fs";
import User from "../models/User.js";

// Load service account (This should be provided by the USER in the backend folder)
// Typically: backend/firebase-service-account.json
let isFirebaseInitialized = false;

const initFirebase = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH || !fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert(
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      ),
    });
    isFirebaseInitialized = true;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
};

// Call init on load
initFirebase();

/**
 * Send a push notification to a specific user
 * @param {string} userId
 * @param {string} title
 * @param {string} body
 * @param {object} data - Optional data payload
 */
export const sendPushNotification = async (userId, title, body, data = {}) => {
  if (!isFirebaseInitialized) return;

  try {
    const user = await User.findById(userId);
    if (!user || !user.fcmTokens || user.fcmTokens.length === 0) return;

    const message = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        click_action: process.env.FRONTEND_URL || "http://localhost:5173",
      },
      tokens: user.fcmTokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    // Cleanup invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(user.fcmTokens[idx]);
        }
      });

      if (failedTokens.length > 0) {
        user.fcmTokens = user.fcmTokens.filter(
          (t) => !failedTokens.includes(t),
        );
        await user.save();
      }
    }

    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
