"use client";

import { useEffect, useState, useRef, Suspense } from "react";
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

// This is the component that uses the useSearchParams hook.
// It is now a separate component to be wrapped by Suspense.
function MessageContent() {
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

  // Load profile
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

  // Load contacts (only those with messages)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/profile/contacts", {
          headers: { Authorization: `Bearer ${token}`},
        });
        const formatted = res.data.contacts.map((user) => ({
          ...user,
          img: user.image || "/profile-circles1.svg"
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (profile && token) fetchContacts();
  }, [profile, token]);

  // Auto-load last selected or open sellerId from URL
  useEffect(() => {
    const autoLoadLastChatOrNew = async () => {
      // If sellerId present in URL, try to open that first
      if (initialSellerId && !initialMessageSent) {
        // Try to find in contacts
        let sellerUser = contacts.find((u) => u._id === initialSellerId);
        // If not found in current contacts, fetch seller by id from backend
        if (!sellerUser) {
          try {
            const res = await api.get(`/profile/users/${initialSellerId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const u = res.data.user;
            sellerUser = {
              ...u,
              img: u.image || "/profile-circles1.svg"
            };
          } catch (err) {
            console.error("Failed to fetch seller by id:", err);
            // continue and fallback to lastSelectedUser
          }
        }

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

      // fallback to last selected user
      const lastUserId = localStorage.getItem("lastSelectedUserId");
      if (lastUserId && contacts.length > 0) {
        const user = contacts.find((u) => u._id === lastUserId);
        if (user) {
          await handleUserClick(user);
        }
      }
    };

    if (profile) {
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
    token
  ]);

  // Socket useEffect for current chatRoomId
  useEffect(() => {
    if (!token || !chatRoomId || !profile) return;

    const socket = initialSocket(token);
    socketRef.current = socket;

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

    const handleTyping = (userId) => {
      if (userId !== profile._id) setTypingUser(userId);
    };

    const handleStopTyping = () => setTypingUser(null);

    const handleMessagesRead = ({ messageIds, readerId }) => {
      setConversations((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id)
            ? { ...msg, readBy: [...(msg.readBy || []), readerId] }
            : msg
        )
      );
    };

    const handleOnlineUsers = (users) => setOnlineUsers(users);

    const joinAndListen = () => {
      joinRoom(chatRoomId);

      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messagesRead");
      socket.off("onlineUsers");

      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("typing", handleTyping);
      socket.on("stopTyping", handleStopTyping);
      socket.on("messagesRead", handleMessagesRead);
      socket.on("onlineUsers", handleOnlineUsers);
    };

    if (socket.connected) {
      joinAndListen();
    } else {
      socket.on("connect", joinAndListen);
    }

    return () => {
      socket.off("connect", joinAndListen);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [chatRoomId, token, profile]);

  const handleSend = async ({ text, file, productId, productImageUrl, productTitle }) => {
    if (!chatRoomId || !selectedUser || !profile) return;

    const msgData = {
      conversationId: chatRoomId,
      to: selectedUser._id,
      from: profile._id,
      text,
      productId,
      productImageUrl,
      productTitle,
    };

    // send over socket
    sendMessage(msgData);
    emitStopTyping(chatRoomId);
  };

  // handleUserClick: create conversation, fetch history, add to contacts immediately
  const handleUserClick = async (
    user,
    initialDetails = { previewMessage: null, productImageUrl: null, productId: null, productTitle: null }
  ) => {
    try {
      localStorage.setItem("lastSelectedUserId", user._id);

      // create or get conversation
      const res = await api.post(
        "/conversation/create-conversation",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const conversation = res.data?.conversation;
      if (!conversation?._id) {
        console.error("No conversation returned");
        return;
      }

      setSelectedUser(user);
      setChatRoomId(conversation._id);

      // ---- Add seller to contacts immediately if not present ----
      setContacts(prevContacts => {
        if (!prevContacts.some(c => c._id === user._id)) {
          const newContact = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            img: user.image || user.img || "/profile-circles1.svg",
            isVerified: user.isVerified || false,
            createdAt: user.createdAt
          };
          return [...prevContacts, newContact];
        }
        return prevContacts;
      });

      // fetch conversation messages
      const history = await api.get(`/messages/${conversation._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const existingMessages = Array.isArray(history.data?.messages)
        ? history.data.messages
        : [];
      setConversations(existingMessages);

      // mark messages as read (if any)
      const messageIds = existingMessages.map(m => m._id);
      emitReadMessage(messageIds, conversation._id);

      // send initial preview message if provided and no existing messages
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
      console.error("Failed to load/create conversation:", err);
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
      const isDelivered = true;

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
                {selectedUser?.fullName || "Select a chat"}
              </p>
            </div>
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



export default function MessagePage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessageContent />
    </Suspense>
  );
}