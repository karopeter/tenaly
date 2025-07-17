"use client";
import { useState, useRef } from "react";
import { Plus, SendHorizonal, X } from "lucide-react";

export default function ChatInput({ onSend, onTyping, onStopTyping }) {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    await onSend({ text: message.trim(), file: selectedFile });
    setMessage("");
    clearFile();
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      {preview && (
        <div className="flex items-center mb-2">
          <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded-md mr-2" />
          <button onClick={clearFile} className="text-red-500 hover:text-red-700">
            <X />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button type="button" onClick={handleFileUpload} className="p-2 bg-gray-100 rounded-full">
          <Plus className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.trim()) onTyping?.();
            else onStopTyping?.();
          }}
          className="flex-1 p-2 bg-[#FAFAFA] border border-gray-200 rounded-lg text-sm outline-none"
        />
        <button type="submit" className="p-2 rounded-full text-[#4C4C4C] hover:bg-gray-100">
          <SendHorizonal className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
      </form>
    </div>
  );
}
