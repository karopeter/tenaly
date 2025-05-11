import  { io } from "socket.io-client";


let socket;


export const initialSocket  = () => {
    socket = io("http://localhost:8080"); 
    console.log("Connecting socket");
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
  };

export const joinRoom = (roomId) => {
    if (socket && roomId) {
        socket.emit("joinRoom", roomId);
        console.log("Joined room:", roomId);
    }
};

export const sendMessage = (roomId, message) => {
    if (socket) socket.emit("sendMessage", { roomId, message });
};

export const onReceieveMessage = (cb) => {
  if (!socket) return;
  socket.on("receieveMessage", (msg) => {
    cb(msg);
  });
};