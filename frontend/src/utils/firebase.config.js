import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
};

console.log("Firebase Init Config (Synced):", firebaseConfig);

// Initialize Firebase only if projectId is present
let app;
let messaging = null;
let auth = null;

try {
  if (firebaseConfig.projectId) {
    // Use a named app to avoid conflicts during hot-reloads
    app = initializeApp(firebaseConfig, "HomeHubApp");
    messaging = getMessaging(app);
    auth = getAuth(app);
    console.log("Firebase 'HomeHubApp' initialized with API Key:", firebaseConfig.apiKey?.substring(0, 10) + "...");
  } else {
    console.warn("Firebase Project ID missing.");
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

const googleProvider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized");
  
  console.log("Attempting Google Sign-In...");
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google Sign-In Success!");
    return result.user;
  } catch (error) {
    console.error("Firebase Google Sign-In Error Details:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
      customData: error.customData
    });
    throw error;
  }
};

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
    });
    if (currentToken) {
      return currentToken;
    } else {
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging)
      return reject(new Error("Firebase messaging not initialized"));
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default messaging;
