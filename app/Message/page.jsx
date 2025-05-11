"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Img from "../components/Image";
import Button from "../components/Button";
import { SendHorizonal, ArrowLeft, Plus } from "lucide-react";
import { 
  initialSocket,
  disconnectSocket,
  joinRoom,
  sendMessage,
  onReceieveMessage
} from "../utils/socket";

export default function MessagePage() {
  const [conversations, setConversations] = useState(() => ({ 
    "Blessing Joe": [
      { from: "buyer", text: "Good afternoon, Please I want to ask if this is still available", time: "2:30 PM" },
      { from: "seller", text: "Good afternoon", time: "2:31 PM" },
      { from: "seller", text: "No, it's not. So sorry for the inconvenience. I forgot to mark it as sold", time: "2:32 PM" },
      { from: "seller", text: "I have others for sale, you can check my profile", time: "2:35 PM" }
    ],
    "Kalu Mark": [
      { from: "buyer", text: "Is the car still available?", time: "10:00 AM" },
      { from: "seller", text: "Yes, it is.", time: "10:05 AM" }
    ],
    "Angela White": [
      { from: "buyer", text: "How many year warranty is the car", time: "10:30 AM" },
      { from: "seller", text: "2 Years.", time: "10:32 AM" }
    ],
    "Mark Brown": [
      { from: "buyer", text: "How about the car documents?", time: "10:35 AM" },
      { from: "seller", text: "All the documents are available.", time: "10:40 AM" }
    ]
  }));
  
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("Blessing Joe");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatRoomId = "tenaly-123-buyer&sellers-456";
  
  // Default contact list
  const contacts = [
    { name: "Blessing Joe", img: "/blessing.svg", lastMsg: "Hello good morning, is the car still available..." },
    { name: "Kalu Mark", img: "/kalu.svg", lastMsg: "is the car still available?" },
    { name: "Angela White", img: "/angela.svg", lastMsg: "is the car still available?" },
    { name: "Mark Brown", img: "/mark.svg", lastMsg: "Hello good morning, is the car still available..." }
  ];

  // Default buyer status
  const buyerStatus = {
    name: "Blessing Joe",
    img: "/blessing.svg",
    isOnline: true,
    lastSeen: "Today at 4:32 PM"
  };

  useEffect(() => {
    initialSocket();
    joinRoom(chatRoomId);

    onReceieveMessage((msg) => {
      setConversations((prev) => {
        const updated = { ...prev };
        if (!updated[selectedUser]) updated[selectedUser] = [];
        updated[selectedUser].push(msg);
        return updated;
      });
    });

    return () => {
      disconnectSocket();
    };
  }, [selectedUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const newMessage = {
      from: "seller",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Send to backend
    sendMessage(chatRoomId, newMessage);

    // Optimistically update UI
    setConversations((prev) => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), newMessage],
    }));

    setMessage("");
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations[selectedUser]]);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="md:px-[104px] px-4 md:ml-10">
      {/* Breadcrumb */}
      <div className="mt-28 flex items-center gap-2 mb-4 font-[400] font-inter flex-nowrap">
        <Link href="/" className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap">
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/" className="text-[#000087] md:text-[14px] font-[500]">
          Messages
        </Link>
      </div>

      <div className="flex h-screen bg-white">
        {/* Left Panel */}
        <div className="w-[350px] bg-[#FAFAFA] border-r border-gray-300 p-4">
          <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
            My Messages <span className="bg-[#525252] md:w-[27px] md:h-[20px] md:rounded-[100px] md:pt-[4px] md:pr-[8px] md:pb-[4px] md:pl-[8px] text-[#FFFFFF] md:text-[12px]">4</span>
          </h2>
          <div className="space-y-4">
            {contacts.map((user, i) => (
              <div key={i} onClick={() => setSelectedUser(user.name)} 
               className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                <Img src={user.img} alt={user.name} width={44} height={44} className="rounded-full" />
                <div>
                  <p className="md:text-[16px] font-[500] text-[#525252] font-inter">{user.name}</p>
                  <p className="md:text-[14px] font-[400] text-[#868686] font-inter">{user.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel (Chat View) */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div 
            className="border-b border-gray-200 px-4 py-3 flex items-center 
            justify-between bg-[#FAFAFA] sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 cursor-pointer text-[#4C4C4C]" />
              <Img
                src={contacts.find((contact) => contact.name === selectedUser).img}
                alt={selectedUser}
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="font-[500] text-[#525252] text-[16px]">{selectedUser}</p>
            </div>

            {/* Right section: ONLINE or Last seen */}
            <div>
              {buyerStatus.isOnline ? (
                <span className="text-[#238E15] font-[500] text-[14px]">ONLINE</span>
              ) : (
                <span className="text-[#8C8C8C] font-[400] text-[14px]">
                  Last seen: {buyerStatus.lastSeen}
                </span>
              )}
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-5">
            {/* Date Divider */}
            <div className="text-center text-[#868686] text-sm mb-2">Today</div>
            {conversations[selectedUser]?.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.from === "seller" ? "justify-end" : "justify-start"}`}>
                {msg.from === "buyer" && (
                  <Img src="/blessing.svg" alt="buyer" width={30} height={30} className="rounded-full" />
                )}
                <div 
                 className={`max-w-[70%] p-3 rounded-xl text-sm relative ${msg.from === "seller" ? "bg-[#DFDFF9]" : "bg-[#F7F7FF]"}`}>
                  <p>{msg.text}</p>
                  <div className="text-[11px] text-gray-500 mt-1 text-right">{msg.time}</div>
                </div>
                {msg.from === "seller" && (
                  <Img src="/mark.svg" alt="seller" width={30} height={30} className="rounded-full" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="px-4 py-3 bg-white">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* "+" icon for file upload */}
              <button type="button" onClick={handleFileUpload} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <Plus className="w-5 h-5" />
              </button>

              {/* Input field */}
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 bg-[#FAFAFA] border-none rounded-lg text-sm outline-none placeholder:text-[#8C8C8C]"
              />

              {/* Send button */}
              <button type="submit" className="p-2 rounded-full text-[#4C4C4C]">
                <SendHorizonal className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
