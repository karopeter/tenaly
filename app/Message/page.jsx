"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Img from "../components/Image";
import ChatInput from "../components/ChatInput";
import {
  initialSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  emitTyping,
  emitStopTyping,
  emitReadMessage
} from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import api from "@/services/api";
import { format, isSameDay, parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function MessagePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [typingUser, setTypingUser] = useState(null);

  const searchParams = useSearchParams();
  const initialSellerId = searchParams.get("sellerId");
  const initialProductId = searchParams.get("productId");
  const initialPreviewMessage = searchParams.get("previewMessage");
  const initialProductImageUrl = searchParams.get("productImageUrl");
  const initialProductTitle = searchParams.get("productTitle");

  const [initialMessageSent, setInitialMessageSent] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/profile/contacts", {
          headers: { Authorization: `Bearer ${token}`},
        });
        const formatted = res.data.contacts.map((user) => ({
          ...user,
          img: user.image || "/profile-circles1.svg"
        }))
        setContacts(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (profile && token) fetchContacts();
  }, [profile, token]);

  useEffect(() => {
    const autoLoadLastChatOrNew = async () => {
      if (initialSellerId && !initialMessageSent && contacts.length > 0) {
        const sellerUser = contacts.find((u) => u._id === initialSellerId);
        if (sellerUser) {
          await handleUserClick(sellerUser, {
            previewMessage: initialPreviewMessage,
            productImageUrl: initialProductImageUrl,
            productId: initialProductId,
            productTitle: initialProductTitle,
          });
          setInitialMessageSent(true);
          return;
        }
      }

      const lastUserId = localStorage.getItem("lastSelectedUserId");
      if (lastUserId && contacts.length > 0) {
        const user = contacts.find((u) => u._id === lastUserId);
        if (user) {
          await handleUserClick(user);
        }
      }
    };

    if (profile && contacts.length > 0) {
      autoLoadLastChatOrNew();
    }
  }, [
    profile,
    contacts,
    initialSellerId,
    initialPreviewMessage,
    initialProductImageUrl,
    initialProductId,
    initialProductTitle,
    initialMessageSent,
  ]);

  // --- NEW CORRECTED useEffect BLOCK START ---
  useEffect(() => {
    if (!token || !chatRoomId || !profile) return;

    const socket = initialSocket(token);
    socketRef.current = socket; // Store reference to the current socket instance

  const handleReceiveMessage = (msg) => {
  setConversations((prev) => {
    if (prev.some((existingMsg) => existingMsg._id === msg._id)) {
      return prev;
    }
    return [...prev, msg];
  });
  setLastMessages((prev) => ({
    ...prev,
    [msg.from._id === profile._id ? msg.to._id : msg.from._id]: msg.text,
  }));
};

    
    // const handleReceiveMessage = (msg) => {
    //   console.log("Received message via socket:", msg); // For debugging
    //   setConversations((prev) => {
    //     // Only add message if it's not already in conversations (deduplication)
    //     if (prev.some((existingMsg) => existingMsg._id === msg._id)) {
    //       console.log("Message already exists, skipping:", msg._id); // For debugging
    //       return prev;
    //     }
    //     return [...prev, msg];
    //   });
    //   setLastMessages((prev) => ({
    //     ...prev,
    //     [msg.from._id === profile._id ? msg.to._id : msg.from._id]: msg.text,
    //   }));
    // };

    const handleTyping = (userId) => {
      if (userId !== profile._id) setTypingUser(userId);
    };

    const handleStopTyping = () => {
      setTypingUser(null);
    };

    const handleMessagesRead = ({ messageIds, readerId }) => {
      setConversations((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id)
            ? { ...msg, readBy: [...(msg.readBy || []), readerId] }
            : msg
        )
      );
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const joinAndListen = () => {
      joinRoom(chatRoomId); // Join the specific chat room

      // CRITICAL: Remove any existing listeners for these events before adding new ones
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messagesRead");
      socket.off("onlineUsers");

      // Add the listeners
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("typing", handleTyping);
      socket.on("stopTyping", handleStopTyping);
      socket.on("messagesRead", handleMessagesRead);
      socket.on("onlineUsers", handleOnlineUsers);
    };

    // If socket is already connected, just join and listen
    if (socket.connected) {
      joinAndListen();
    } else {
      // Otherwise, wait for connection, then join and listen
      socket.on("connect", joinAndListen);
    }

    // Cleanup function: This runs when the component unmounts
    // or when the dependencies of useEffect change, before the new effect runs.
    return () => {
      console.log("🔌 Cleaning up socket listeners for room:", chatRoomId); // For debugging
      socket.off("connect", joinAndListen); // Remove the specific 'connect' handler
      socket.off("receiveMessage", handleReceiveMessage); // Remove the specific 'receiveMessage' handler
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [chatRoomId, token, profile]); // Dependencies for useEffect
  // --- NEW CORRECTED useEffect BLOCK END ---


  const handleSend = async ({ text, file, productId, productImageUrl, productTitle }) => {
  if (!chatRoomId || !selectedUser || !profile) return;

  // Build the message data
  const msgData = {
    conversationId: chatRoomId,
    to: selectedUser._id,
    from: profile._id,
    text,
    productId,
    productImageUrl,
    productTitle,
    // If you want to support file upload via socket, handle it here
  };

  // Send via socket only
  sendMessage(msgData);

  emitStopTyping(chatRoomId);
};

  // const handleSend = async ({ text, file, productId, productImageUrl, productTitle }) => {
  //   if (!chatRoomId || !selectedUser || !profile) return;

  //   try {
  //     const formData = new FormData();
  //     formData.append("conversationId", chatRoomId);
  //     formData.append("to", selectedUser._id);
  //     if (text) formData.append("text", text);
  //     if (file) formData.append("file", file);

  //     if (productId) formData.append("productId", productId);
  //     if (productImageUrl) formData.append("productImageUrl", productImageUrl);
  //     if (productTitle) formData.append("productTitle", productTitle);

  //     const res = await api.post("/messages", formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     const msg = res.data; // This is the message object returned by your API
      
  //     // Optimistically update UI immediately with the message from the API response
  //     // setConversations((prev) => {
  //     //     // Check if this message (by its _id) is already in the list to prevent duplicates
  //     //     if (prev.some(existingMsg => existingMsg._id === msg._id)) {
  //     //         return prev;
  //     //     }
  //     //     return [...prev, msg];
  //     // });

  //     setLastMessages((prev) => ({
  //       ...prev,
  //       [msg.from._id === profile._id ? msg.to._id : msg.from._id]: msg.text,
  //     }));

  //    sendMessage(msg); 
  //     emitStopTyping(chatRoomId);
  //   } catch (err) {
  //     console.error(
  //       "❌ Failed to send message:",
  //       err.response?.data || err.message
  //     );
  //   }
  // };

  const handleUserClick = async (
    user,
    initialDetails = { previewMessage: null, productImageUrl: null, productId: null, productTitle: null }
  ) => {
    try {
      localStorage.setItem("lastSelectedUserId", user._id);

      const res = await api.post(
        "/conversation/create-conversation",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const conversation = res.data?.conversation;
      if (!conversation?._id) return;

      setSelectedUser(user);
      setChatRoomId(conversation._id);

      const history = await api.get(`/messages/${conversation._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const existingMessages = Array.isArray(history.data?.messages)
        ? history.data.messages
        : [];
      setConversations(existingMessages);
      let messageIds = [];
      existingMessages.forEach((message) => {
         messageIds.push(message._id);
      });
      emitReadMessage(messageIds, conversation._id);

      if (
        initialDetails.previewMessage &&
        existingMessages.length === 0 &&
        profile?._id !== user._id
      ) {
        await handleSend({
          text: initialDetails.previewMessage,
          file: null,
          productId: initialDetails.productId,
          productImageUrl: initialDetails.productImageUrl,
          productTitle: initialDetails.productTitle,
        });
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return conversations.map((msg, i) => {
      const currentDate = format(parseISO(msg.createdAt), "yyyy-MM-dd");
      const isNewDate =
        !lastDate || !isSameDay(parseISO(lastDate), parseISO(msg.createdAt));
      lastDate = msg.createdAt;

      const fromId = typeof msg.from === "object" ? msg.from._id : msg.from;
      const isFromSelf = fromId === profile?._id;

      const senderImg = isFromSelf
        ? profile?.image || "/profile-circles1.svg"
        : selectedUser?.img || "/profile-circles1.svg";

      const isRead = msg.readBy?.includes(selectedUser?._id);
      const isDelivered = true; // Assuming messages are delivered once sent

      return (
        <div key={msg._id || i}>
          {isNewDate && (
            <div className="text-center text-gray-400 text-xs my-2">
              {format(parseISO(msg.createdAt), "eeee, MMMM do yyyy")}
            </div>
          )}

          <div
            className={`flex items-end space-x-2 ${
              isFromSelf ? "justify-end" : "justify-start"
            }`}
          >
            {!isFromSelf && (
              <Img
                src={senderImg}
                alt="sender"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}

            <div
              className={`max-w-[70%] px-3 py-2 rounded-lg text-sm relative ${
                isFromSelf ? "bg-gray-100" : "bg-green-200"
              }`}
            >
              {msg.productImageUrl && msg.productId && (
                <Link href={`/details/${msg.productId}`} target="_blank" rel="noopener noreferrer">
                <div className="mb-2 p-2 bg-white rounded-md border border-gray-200 cursor-pointer">
                  <img
                    src={msg.productImageUrl}
                    alt={msg.productTitle || "Product"}
                    className="w-24 h-24 object-cover rounded-md mx-auto mb-2"
                  />
                  <p className="text-xs font-semibold text-center text-blue-600 hover:underline">
                    {msg.productTitle || "View Product"}
                  </p>
                </div>
                </Link>
              )}

              {msg.file && msg.file.path && (
                <div className="mt-1">
                  {msg.file.mimetype?.startsWith("image/") ? (
                    <img
                      src={`http://localhost:8080/${msg.file.path}`}
                      alt="uploaded"
                      className="w-40 h-auto rounded-md"
                    />
                  ) : (
                    <a
                      href={`http://localhost:8080/${msg.file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      Download file
                    </a>
                  )}
                </div>
              )}

              <div className="text-sm mb-1">{msg.text}</div>
              <div className="text-[10px] text-right text-gray-500">
                {format(parseISO(msg.createdAt), "hh:mm a")}
              </div>
              {isFromSelf && (
                <div className="text-[10px] text-right text-gray-400">
                  {isRead ? "Read" : isDelivered ? "Delivered" : "Sent"}
                </div>
              )}
            </div>

            {isFromSelf && (
              <Img
                src={senderImg}
                alt="you"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
          </div>
        </div>
      );
    });
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="md:px-[104px] px-4 md:ml-10">
      <div className="mt-28 flex items-center gap-2 mb-4 font-[400] font-inter flex-nowrap">
        <Link
          href="/"
          className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap"
        >
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/" className="text-[#000087] md:text-[14px] font-[500]">
          Messages
        </Link>
      </div>

      <div className="flex bg-white h-[calc(100vh-150px)]">
        {/* Left Panel */}
        <div className="w-[350px] bg-[#FAFAFA] border-r border-gray-300 p-4 overflow-y-auto">
          {/* <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
            My Messages
            <span className="bg-[#525252] md:w-[27px] md:h-[20px] rounded-full text-white text-xs px-2 py-[2px]">
              {contacts.length}
            </span>
          </h2> */}
          <div className="space-y-4">
            {contacts.map((user, i) => (
              <div
                key={i}
                onClick={() => handleUserClick(user)}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
              >
                <Img
                  src={user.img || "/profile-circles1.svg"}
                  alt={user.fullName}
                  width={44}
                  height={44}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="text-base font-medium text-[#525252] font-inter">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-[#868686] font-inter line-clamp-1">
                    {lastMessages[user._id] || "Start Conversation"}
                  </p>
                </div>
                {/* <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline(user._id) ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span> */}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white">
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              {selectedUser?.img && (
                <Img
                  src={selectedUser.img || "/profile-circles1.svg"}
                  alt={selectedUser.fullName || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <p className="font-medium text-[#525252] text-base">
                {selectedUser?.fullName}
              </p>
            </div>
            {/* <span
              className={`font-medium text-sm ${
                isOnline(selectedUser?._id) ? "text-[#238E15]" : "text-gray-500"
              }`}
            >
              {isOnline(selectedUser?._id) ? "ONLINE" : "OFFLINE"}
            </span> */}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {renderMessages()}
            {typingUser === selectedUser?._id && (
              <div className="text-sm text-gray-500 italic">Typing...</div>
            )}
          </div>

          {chatRoomId && selectedUser && (
            <ChatInput
              onSend={handleSend}
              conversationId={chatRoomId}
              recipientId={selectedUser._id}
              token={token}
              onTyping={() => emitTyping(chatRoomId)}
              onStopTyping={() => emitStopTyping(chatRoomId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}