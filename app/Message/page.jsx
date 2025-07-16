"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

export default function MessagePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);
  const socketRef = useRef(null);

  // Fetch profile
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

  // Fetch other users (contacts)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/profile/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.users.filter((u) => u._id !== profile?._id);
        const formatted = filtered.map((user) => ({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          img: user.image || "/profile-circles1.svg",
          lastMsg: "Click to start chat",
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (profile && token) fetchContacts();
  }, [profile, token]);

  // Handle incoming socket messages
  const handleReceiveMessage = useCallback(
    (msg) => {
      const senderId = msg.from?._id || msg.from;
      const key =
        contacts.find((c) => c._id === senderId)?.fullName ||
        selectedUser?.fullName ||
        "Unknown";

      setConversations((prev) => {
        const updated = { ...prev };
        if (!updated[key]) updated[key] = [];

        // Prevent duplicates
        const isDuplicate = updated[key].some((m) => m._id === msg._id);
        if (!isDuplicate) {
          updated[key].push(msg);
        }
        return updated;
      });
    },
    [contacts, selectedUser]
  );

  // Setup socket connection and listeners
  useEffect(() => {
    if (!token || !chatRoomId || !profile) return;

    const socket = initialSocket(token);
    socketRef.current = socket;

    const joinAndListen = () => {
      joinRoom(chatRoomId);
      console.log("✅ Joined room:", chatRoomId);

      socket.off("receiveMessage", handleReceiveMessage);
      socket.on("receiveMessage", handleReceiveMessage);
    };

    if (socket.connected) {
      joinAndListen();
    } else {
      socket.once("connect", joinAndListen);
    }

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("connect", joinAndListen);
      disconnectSocket();
    };
  }, [chatRoomId, token, profile, handleReceiveMessage]);

  // Send message
  const handleSend = (text) => {
    if (!text || !chatRoomId || !selectedUser || !profile) return;

    const msg = {
      conversationId: chatRoomId,
      to: selectedUser._id,
      from: profile._id,
      text,
    };

    // setConversations((prev) => ({
    //   ...prev,
    //   [selectedUser.fullName]: [
    //     ...(prev[selectedUser.fullName] || []),
    //     msg,
    //   ],
    // }));

    sendMessage(msg);
  };

  // Select user and get/create conversation
  const handleUserClick = async (user) => {
    try {
      const res = await api.post(
        "/conversation/create-conversation",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const conversation = res.data?.conversation;
      if (!conversation?._id) return;
      setSelectedUser(user);
      setChatRoomId(conversation._id);
    } catch (err) {
      console.error("Failed to create/get conversation:", err);
    }
  };

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
          <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
            My Messages{" "}
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
                <div>
                  <p className="text-base font-medium text-[#525252] font-inter">
                    {user.fullName}
                  </p>
                  <p className="text-sm text-[#868686] font-inter line-clamp-1">
                    {user.lastMsg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              {selectedUser?.img && (
                <Img
                  src={selectedUser.img || "/profile-circle1.svg"}
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
            <span className="text-[#238E15] font-medium text-sm">ONLINE</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {conversations[selectedUser?.fullName]?.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                  msg.from === profile?._id
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
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
