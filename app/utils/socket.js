import { io } from "socket.io-client";

let socket;

export const initialSocket = (token) => {
  if (socket && socket.connected) return socket;

  socket = io("https://api.tenaly.com", {
    auth: { token },
  });

  socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
  socket.on("disconnect", (reason) => console.log("🔌 Socket disconnected:", reason));
  socket.on("connect_error", (error) => console.error("❌ Socket error:", error.message));

  return socket;
};

export const joinRoom = (roomId) => {
  if (socket && socket.connected) {
    socket.emit("joinRoom", roomId);
    console.log("✅ Joined room:", roomId);
  }
};

export const sendMessage = (messageData) => {
  if (socket && socket.connected) {
    socket.emit("sendMessage", messageData);
  } else {
    console.warn("Socket not connected");
  }
};

export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on("receiveMessage", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


export const emitTyping = (roomId) => {
  socket.emit("typing", roomId);
};

export const emitStopTyping = (roomId) => {
  socket.emit("stopTyping", roomId);
};

export const emitReadMessage = (messageIds, conversationId) => {
    socket.emit("markAsRead", {messageIds, conversationId});
}