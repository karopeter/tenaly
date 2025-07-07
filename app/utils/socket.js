// app/utils/socket.js
import { io } from "socket.io-client";

let socket;

export const initialSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io("http://localhost:8080", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected.");
  }
};

export const joinRoom = (roomId) => {
  if (socket?.connected && roomId) {
    socket.emit("joinRoom", roomId);
    console.log("Joined room:", roomId);
  }
};

export const sendMessage = ({ conversationId, from, to, text }) => {
  if (socket?.connected) {
    socket.emit("sendMessage", { conversationId, from, to, text });
  } else {
    console.warn("Socket not connected. Cannot send message.");
  }
};

export const onReceiveMessage = (cb) => {
  if (!socket) {
    console.warn("Socket not initialized.");
    return;
  }
  socket.off("receiveMessage");
  socket.on("receiveMessage", cb);
};
