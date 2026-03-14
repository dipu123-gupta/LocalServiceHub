import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const SocketProvider = ({ children }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userInfo?._id) {
      const newSocket = io(SOCKET_URL, {
        query: { userId: userInfo._id },
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      setSocket(newSocket);
      return () => newSocket.disconnect();
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
    }
  }, [userInfo?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
