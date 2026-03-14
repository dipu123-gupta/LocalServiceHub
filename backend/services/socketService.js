// Map userId -> socketId for targeted real-time messages
const userSocketMap = {};

export const getSocketId = (userId) => userSocketMap[userId];

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connection attempt...", {
      id: socket.id,
      origin: socket.handshake.headers.origin,
      query: socket.handshake.query
    });
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log(`Socket connected: user ${userId} → socket ${socket.id}`);
    }

    // Emit online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Join a room (for booking-specific messages)
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
    });

    // --- WebRTC Signaling ---
    socket.on("call-user", (data) => {
      const targetSocketId = getSocketId(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("incoming-call", {
          from: userId,
          offer: data.offer,
          userRole: data.userRole,
          userName: data.userName,
        });
      }
    });

    socket.on("answer-call", (data) => {
      const targetSocketId = getSocketId(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-answered", {
          from: userId,
          answer: data.answer,
        });
      }
    });

    socket.on("ice-candidate", (data) => {
      const targetSocketId = getSocketId(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", {
          from: userId,
          candidate: data.candidate,
        });
      }
    });

    socket.on("end-call", (data) => {
      const targetSocketId = getSocketId(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-ended", { from: userId });
      }
    });

    // --- Provider Real-Time Availability ---
    socket.on("updateProviderStatus", async (data) => {
      try {
        const { providerId, status } = data;
        const ServiceProvider = (await import("../models/ServiceProvider.js"))
          .default;

        const provider = await ServiceProvider.findByIdAndUpdate(
          providerId,
          { status },
          { new: true },
        );
        if (provider) {
          io.emit("providerStatusUpdated", { providerId, status });
        }
      } catch (error) {
        console.error("Error updating provider status via socket:", error);
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`Socket disconnected: user ${userId}`);
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

// Utility: emit a notification to a specific user
export const emitToUser = (io, userId, event, data) => {
  const socketId = getSocketId(userId?.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};
