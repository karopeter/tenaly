"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Img from "../components/Image";
import ChatBox from "../components/ChatBox";
import ChatInput from "../components/ChatInput";
import {
  initialSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  onReceiveMessage,
} from "../utils/socket";
import { useAuth } from "../context/AuthContext";

export default function MessagePage() {
  const [conversations, setConversations] = useState({});
  const [selectedUser, setSelectedUser] = useState("Blessing Joe");
  const { token, profile } = useAuth();
  const chatRoomId = "686b9776f938aa033479e87f"; // Replace with actual ID logic

  const contacts = [
    { name: "Blessing Joe", img: "/blessing.svg", lastMsg: "Hello good morning, is the car still available..." },
    { name: "Kalu Mark", img: "/kalu.svg", lastMsg: "is the car still available?" },
    { name: "Angela White", img: "/angela.svg", lastMsg: "is the car still available?" },
    { name: "Mark Brown", img: "/mark.svg", lastMsg: "Hello good morning, is the car still available..." }
  ];

  const selectedUserObj = contacts.find((c) => c.name === selectedUser);
const selectedUserId = selectedUserObj?._id;


  useEffect(() => {
  if (!token || !profile) return;

  const socket = initialSocket(token);
  joinRoom(chatRoomId);

  onReceiveMessage((msg) => {
    const senderName = contacts.find((c) => c._id === msg.from)?._id === selectedUserId ? selectedUser : "Unknown";

    setConversations((prev) => {
      const updated = { ...prev };
      if (!updated[senderName]) updated[senderName] = [];
      updated[senderName].push(msg);
      return updated;
    });
  });

  return () => {
    disconnectSocket();
  };
}, [selectedUser, token, profile]);


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

      <div className="flex h-screen bg-white">
        {/* Left Panel */ }
        <div className="w-[350px] bg-[#FAFAFA] border-r border-gray-300 p-4">
          <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
            My Messages <span className="bg-[#525252] md:w-[27px] md:h-[20px] rounded-full text-white text-xs px-2 py-[2px]">4</span>
          </h2>
          <div className="space-y-4">
            {contacts.map((user, i) => (
              <div key={i} onClick={() => setSelectedUser(user.name)} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                <Img src={user.img} alt={user.name} width={44} height={44} className="rounded-full" />
                <div>
                  <p className="text-base font-medium text-[#525252] font-inter">{user.name}</p>
                  <p className="text-sm text-[#868686] font-inter">{user.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <Img
                src={contacts.find((c) => c.name === selectedUser)?.img || ""}
                alt={selectedUser}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="font-medium text-[#525252] text-base">{selectedUser}</p>
            </div>
            <span className="text-[#238E15] font-medium text-sm">ONLINE</span>
          </div>
          <ChatBox conversationId={chatRoomId} selectedUser={selectedUser} currentUserId={profile?._id} contactImg={contacts.find((c) => c.name === selectedUser)?.img || ""} token={token} />
          <ChatInput 
            onSend={(msg) => {
            setConversations((prev) => ({
            ...prev,
           [selectedUser]: [...(prev[selectedUser] || []), msg],
         }));

          sendMessage({
           conversationId: chatRoomId,
           from: profile?._id,
           to: selectedUserId,
           text: msg.text,
        });
       }}
       conversationId={chatRoomId}
       recipientId={selectedUserId}
       token={token}
      />
        </div>
      </div>
    </div>
  );
}
