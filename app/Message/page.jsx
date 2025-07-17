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
} from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import api from "@/services/api";
import { format, isSameDay, parseISO } from "date-fns";

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
        const res = await api.get("/profile/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.users.filter((u) => u._id !== profile?._id);
        const formatted = filtered.map((user) => ({
          ...user,
          img: user.image || "/profile-circles1.svg",
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (profile && token) fetchContacts();
  }, [profile, token]);

  useEffect(() => {
    if (!token || !chatRoomId || !profile) return;

    const socket = initialSocket(token);
    socketRef.current = socket;

    const handleReceiveMessage = (msg) => {
      setConversations((prev) => [...prev, msg]);
      setLastMessages((prev) => ({
        ...prev,
        [msg.from._id === profile._id ? msg.to._id : msg.from._id]: msg.text,
      }));
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const joinAndListen = () => {
      joinRoom(chatRoomId);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.on("receiveMessage", handleReceiveMessage);
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
      socket.off("onlineUsers", handleOnlineUsers);
      disconnectSocket();
    };
  }, [chatRoomId, token, profile]);

  const handleSend = (text) => {
    if (!text || !chatRoomId || !selectedUser || !profile) return;
    const msg = {
      conversationId: chatRoomId,
      to: selectedUser._id,
      from: profile._id,
      text,
    };
    sendMessage(msg);
  };

  const handleUserClick = async (user) => {
    try {
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
      setConversations(Array.isArray(history.data) ? history.data : []);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

const renderMessages = () => {
  let lastDate = null;

  return conversations.map((msg, i) => {
    const currentDate = format(parseISO(msg.createdAt), "yyyy-MM-dd");
    const isNewDate = !lastDate || !isSameDay(parseISO(lastDate), parseISO(msg.createdAt));
    lastDate = msg.createdAt;

    // Handle cases where msg.from might be an object or string
    const fromId = typeof msg.from === "object" ? msg.from._id : msg.from;
    const isFromSelf = fromId === profile?._id;

    const senderImg = isFromSelf
      ? profile?.image || "/profile-circles1.svg"
      : selectedUser?.img || "/profile-circles1.svg";

    return (
      <div key={msg._id || i}>
        {isNewDate && (
          <div className="text-center text-gray-400 text-xs my-2">
            {format(parseISO(msg.createdAt), "eeee, MMMM do yyyy")}
          </div>
        )}

        <div className={`flex items-end space-x-2 ${isFromSelf ? "justify-end" : "justify-start"}`}>
          {!isFromSelf && (
            <Img src={senderImg} alt="sender" width={32} height={32} className="rounded-full" />
          )}

          <div
            className={`max-w-[70%] px-3 py-2 rounded-lg text-sm relative ${
              isFromSelf ? "bg-gray-100" : "bg-green-200"
            }`}
          >
            <div className="text-sm mb-1">{msg.text}</div>
            <div className="text-[10px] text-right text-gray-500">
              {format(parseISO(msg.createdAt), "hh:mm a")}
            </div>
          </div>

          {isFromSelf && (
            <Img src={senderImg} alt="you" width={32} height={32} className="rounded-full" />
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
        <Link href="/" className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap">
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/" className="text-[#000087] md:text-[14px] font-[500]">
          Messages
        </Link>
      </div>

      <div className="flex bg-white h-[calc(100vh-150px)]">
        {/* Left Panel */}
        <div className="w-[350px] bg-[#FAFAFA] border-r border-gray-300 p-4 overflow-y-auto">
          <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
            My Messages
            <span className="bg-[#525252] md:w-[27px] md:h-[20px] rounded-full text-white text-xs px-2 py-[2px]">
              {contacts.length}
            </span>
          </h2>
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
                  <p className="text-base font-medium text-[#525252] font-inter">{user.fullName}</p>
                  <p className="text-sm text-[#868686] font-inter line-clamp-1">
                    {lastMessages[user._id] || "Click to start chat"}
                  </p>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline(user._id) ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
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
              <p className="font-medium text-[#525252] text-base">{selectedUser?.fullName}</p>
            </div>
            <span
              className={`font-medium text-sm ${
                isOnline(selectedUser?._id) ? "text-[#238E15]" : "text-gray-500"
              }`}
            >
              {isOnline(selectedUser?._id) ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {renderMessages()}
          </div>

          {chatRoomId && selectedUser && (
            <ChatInput
              onSend={handleSend}
              conversationId={chatRoomId}
              recipientId={selectedUser._id}
              token={token}
            />
          )}
        </div>
      </div>
    </div>
  );
}
