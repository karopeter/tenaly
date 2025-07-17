"use client";
import { useState, useRef } from "react";
import { Plus, SendHorizonal } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = () => fileInputRef.current.click();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button type="button" onClick={handleFileUpload} className="p-2 bg-gray-100 rounded-full">
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 bg-[#FAFAFA] border border-gray-200 rounded-lg text-sm outline-none"
        />
        <button type="submit" className="p-2 rounded-full text-[#4C4C4C] hover:bg-gray-100">
          <SendHorizonal className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" />
      </form>
    </div>
  );
}
