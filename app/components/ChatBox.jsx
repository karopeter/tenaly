"use client";

import { useState, useRef } from "react";
import { Plus, SendHorizonal } from "lucide-react";
import axios from "axios";

export default function ChatInput({ onSend, conversationId, recipientId, token }) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!conversationId || !recipientId || !token) {
      console.warn("Missing data to send message");
      return;
    }

    try {
      const response = await axios.post(
        "/api/messages",
        {
          conversationId,
          to: recipientId,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSend?.(response.data.message); // Pass to parent to update UI if needed
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFileUpload}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 bg-[#FAFAFA] border border-gray-200 rounded-lg text-sm outline-none placeholder:text-[#8C8C8C]"
        />
        <button type="submit" className="p-2 rounded-full text-[#4C4C4C] hover:bg-gray-100">
          <SendHorizonal className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" />
      </form>
    </div>
  );
}
