"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Img from "./Image";

export default function ChatBox({ conversationId, selectedUser, currentUserId, contactImg, token }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Failed to fetch messages:", err.response?.data || err.message);
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-white">
      <div className="text-center text-[#868686] text-sm mb-2">Today</div>

      {messages.map((msg, i) => {
        const isCurrentUser = msg.from._id === currentUserId;
        return (
          <div key={i} className={`flex items-start gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            {!isCurrentUser && (
              <Img src={contactImg} alt="user" width={30} height={30} className="rounded-full" />
            )}
            <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isCurrentUser ? "bg-[#DFDFF9]" : "bg-[#F7F7FF]"}`}>
              <p>{msg.text}</p>
              <div className="text-[11px] text-gray-500 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            {isCurrentUser && (
              <Img src="/mark.svg" alt="me" width={30} height={30} className="rounded-full" />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
