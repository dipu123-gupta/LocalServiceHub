import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCiQ4H95XaTYbE1YZ5ielvgkgckm73eGMnk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase Init Config (Synced):", {
  apiKey: firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase only if projectId is present
let app;
let messaging = null;

if (firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} else {
  console.warn(
    "Firebase Project ID missing. Push notifications will be disabled.",
  );
}

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
