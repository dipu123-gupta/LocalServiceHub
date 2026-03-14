import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userInfo?._id) {
      console.log("Socket Attempting connection to:", SOCKET_URL, "for user:", userInfo._id);
      const newSocket = io(SOCKET_URL, {
        query: { userId: userInfo._id },
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully with ID:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
      });

      setSocket(newSocket);
      return () => {
        console.log("Socket Disconnecting...");
        newSocket.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
  }, [userInfo?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
