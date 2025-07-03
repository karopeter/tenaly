// utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initialSocket = (token) => {
    if (!token) {
        console.error("No authentication token provided for socket connection.");
        return;
    }
    if (socket && socket.connected) {
        console.log("Socket already connected.");
        return;
    }

    socket = io("http://localhost:8080", {
        auth: {
            token: token,
        },
        transports: ['websocket'],
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        },
        reconnectionAttempts: 5, // Attempt to reconnect 5 times
        reconnectionDelay: 1000 // 1 second delay between attempts
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        if (err.data && err.data.message) {
            console.error("Error data:", err.data.message);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        // Handle token expiry or other reasons
        if (reason === "io server disconnect" || reason === "transport close") {
            // e.g., if token expired, you might want to redirect to login
            console.warn("Server disconnected socket, likely due to authentication error.");
        }
    });

    return socket; // Return the socket instance
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null; // Clear the instance
        console.log("Socket disconnected.");
    }
};

export const joinRoom = (conversationId) => {
    if (socket && socket.connected) {
        socket.emit("joinRoom", conversationId);
        console.log(`Joining room: ${conversationId}`);
    } else {
        console.warn("Socket not connected to join room.");
    }
};

export const sendMessage = (conversationId, messageContent) => {
    if (socket && socket.connected) {
        socket.emit("sendMessage", { conversationId, messageContent });
        console.log(`Sending message to room ${conversationId}: "${messageContent}"`);
    } else {
        console.warn("Socket not connected to send message.");
    }
};

export const onReceiveMessage = (callback) => {
    if (socket) {
        socket.on("receiveMessage", callback);
    } else {
        console.warn("Socket not initialized for receiveMessage listener.");
    }
};

export const onHistoricalMessages = (callback) => {
    if (socket) {
        socket.on("historicalMessages", callback);
    } else {
        console.warn("Socket not initialized for historicalMessages listener.");
    }
};

export const onNewMessageNotification = (callback) => {
    if (socket) {
        socket.on("newMessageNotification", callback);
    } else {
        console.warn("Socket not initialized for newMessageNotification listener.");
    }
};

// New function to listen for messages being read
export const onMessagesRead = (callback) => {
    if (socket) {
        socket.on("messagesRead", callback);
    } else {
        console.warn("Socket not initialized for messagesRead listener.");
    }
};

// Export the socket instance itself for more advanced use if needed
export const getSocket = () => socket;