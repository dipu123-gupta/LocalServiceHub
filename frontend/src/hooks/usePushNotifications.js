import { useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import { requestForToken, onMessageListener } from "../utils/firebase.config";

const usePushNotifications = () => {
  const { userInfo } = useSelector((s) => s.auth);

  const handleTokenSync = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        // Send token to backend
        await api.post("/notifications/tokens", { token });
      }
    } catch (error) {
      console.error("Error syncing FCM token:", error);
    }
  };

  useEffect(() => {
    if (userInfo?._id) {
      handleTokenSync();
    }

    // Setup foreground listener
    onMessageListener()
      .then((payload) => {
        // You can show a custom toast or banner here if needed
        if (Notification.permission === "granted") {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: "/logo192.png",
          });
        }
      })
      .catch((err) => {});
  }, [userInfo?._id]);

  return { refreshTokens: handleTokenSync };
};

export default usePushNotifications;
