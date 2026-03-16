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
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";


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
  const [showContacts, setShowContacts] = useState(true); // For mobile view toggle
  const [isMobileView, setIsMobileView] = useState(false);

  const searchParams = useSearchParams();
  const initialSellerId = searchParams.get("sellerId");
  const initialProductId = searchParams.get("productId");
  const initialPreviewMessage = searchParams.get("previewMessage");
  const initialProductImageUrl = searchParams.get("productImageUrl");
  const initialProductTitle = searchParams.get("productTitle");

  const [initialMessageSent, setInitialMessageSent] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

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
     const isMobile = window.innerWidth < 768;

     // Check for conversationId in URL (from offer redirect)
     const urlConversationId = searchParams.get("conversationId");

     if (urlConversationId) {
      try {
      // Fetch conversation details 
      const convRes = await api.get(`/conversation/${urlConversationId}`, {
        headers: { Authorization: `Bearer ${token}`}
      });

        const conversation = convRes.data.conversation;
        const otherUserId = conversation.sellerId._id.toString() === profile._id.toString()
            ? conversation.buyerId._id
            : conversation.sellerId._id;


        // Fetch other user detasils 
        const userRes = await api.get(`/profile/user/${otherUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const otherUser = {
          ...userRes.data.user,
          img: userRes.data.user.image || "/profile-circles1.svg"
        };
        await handleUserClick(otherUser);
        return;
      } catch (err) {
        console.error("Failed to load conversation from URL:", err);
      }
     }

     if (initialSellerId && !initialMessageSent) {
      // Try to find in contacts 
      let sellerUser = contacts.find((u) => u._id === initialSellerId);

      // if not found in current contaccts, fetch seller by id from backend 
      if (!sellerUser) {
        try {
          const res = await api.get(`/profile/user/${initialSellerId}`, {
            headers: { Authorization: `Bearer ${token}`}
          });
          const u = res.data.user;
          sellerUser = {
            ...u,
            img: u.image || "/profile-circles1.svg"
          };
        } catch (err) {
           console.error("Failed to fetch seller by id:", err);
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

     // On desktop, fallback to last selected user 
     // On mobile, only load  if there are no contacts (show empty state)
     if (!isMobile) {
      const lastUserId = localStorage.getItem("lastSelectedUserId");
      if (lastUserId && contacts.length > 0) {
        const user = contacts.find((u) => u._id === lastUserId);
        if (user) {
          await handleUserClick(user);
        }
      }
     } else {
      // On mobile, if no initial seller and no contacts, show empty state 
      if (contacts.length === 0) {
        setShowContacts(false);
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
   token,
   searchParams
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

     const fromId = typeof msg.from === 'object' ? msg.from._id?.toString() : msg.from?.toString();
     const toId = typeof msg.to === 'object' ? msg.to._id?.toString() : msg.to?.toString();
     const otherUserId = fromId === profile?._id?.toString() ? toId : fromId;

     setLastMessages((prev) => ({
       ...prev,
       [otherUserId]: msg.text,
     }));

     // Bubble contact to top of list 
     setContacts((prev) => {
       const idx = prev.findIndex((c) => c._id?.toString() === otherUserId);
        if (idx <= 0) return prev; // top or not found 
        const updated = [...prev];
        const [contact] = updated.splice(idx, 1);
        return [contact, ...updated];
     });
     setLastMessages((prev) => ({
       ...prev,
       [selectedUser._id]: text,
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
      productId: productId || null,
      productImageUrl: productImageUrl || null,
      productTitle: productTitle || null,
    };

    // send over socket
    sendMessage(msgData);
    emitStopTyping(chatRoomId);

    setContacts((prev) => {
      const idx = prev.findIndex((c) => c._id === selectedUser._id);
      if (idx <= 0) return prev;
      const updated = [...prev];
      const [contact] = updated.splice(idx, 1);
      return [contact, ...updated];
    });
    setLastMessages((prev) => ({
      ...prev,
      [selectedUser._id]: text,
    }));
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
      setShowContacts(false); // Hide contacts panel on mobile when chat is selected

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

      // mark message as read 
       api.post("/messages/mark-all-read")
       .catch(err => console.warn("mark-all-read failed:", err?.response?.data));
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

  const handleBackToContacts = () => {
    setShowContacts(true);
    setSelectedUser(null);
    setChatRoomId(null);
    // On mobile, if no contacts exist, keep showing the empty state
  };

  const handleAcceptOffer = async (offerId) => {
     try {
      await api.post(`/offer/accept-offer/${offerId}`);
      // Update the message locally so UI replace accepted status 
      setConversations(prev => 
        prev.map(msg => 
          (msg.offerDetails?.offerId?._id || msg.offerDetails?.offerId)?.toString() === offerId?.toString()
            ? { ...msg, offerDetails: { ...msg.offerDetails, status: "accepted"} }
            : msg 
        )
      );
      toast.success("offer accepted!");
     } catch (err) {
       console.error("Failed to accept offer:", err);
     }
  };

  const handleRejectOffer = async (offerId) => {
     try {
      await api.post(`/offer/reject-offer/${offerId}`);
      setConversations(prev => 
        prev.map(msg => 
          msg.offerDetails?.offerId === offerId
            ? { ...msg, offerDetails: { ...msg.offerDetails, status: "rejected"} }
            : msg
        )
      );
      toast.success("Offer rejected");
     } catch (error) {
      console.log("Failed to reject offer:", error);
     }
  }

  const renderMessages = () => {
    let lastDate = null;

    return conversations.map((msg, i) => {
      const currentDate = format(parseISO(msg.createdAt), "yyyy-MM-dd");
      const isNewDate =
        !lastDate || !isSameDay(parseISO(lastDate), parseISO(msg.createdAt));
      lastDate = msg.createdAt;

      const fromId = typeof msg.from === "object" ? msg.from._id?.toString() : msg.from?.toString();
      const isFromSelf = fromId === profile?._id?.toString();

      const senderImg = isFromSelf
        ? profile?.image || "/profile-circles1.svg"
        : selectedUser?.img || "/profile-circles1.svg";

      const isRead = msg.readBy?.includes(selectedUser?._id);
      const isDelivered = true;

      return (
        <div key={msg._id || i} className="mb-4">
          {isNewDate && (
            <div className="text-center text-gray-400 text-xs my-4 bg-gray-50 py-1 px-3 rounded-full mx-auto w-fit">
              {format(parseISO(msg.createdAt), "MMM dd, yyyy")}
            </div>
          )}

          <div
            className={`flex items-end gap-2 px-2 ${
              isFromSelf ? "justify-end" : "justify-start"
            }`}
          >
            {!isFromSelf && (
              <Img
                src={senderImg}
                alt="sender"
                width={28}
                height={28}
                className="rounded-full flex-shrink-0 mb-2"
              />
            )}

            <div
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm relative ${
                isFromSelf 
                  ? "bg-blue-500 text-white rounded-br-md" 
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              {msg.productImageUrl && msg.productId && (
                <Link href={`/HomeList/${msg.productId}`} target="_blank" rel="noopener noreferrer">
                  <div className="mb-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                    <img
                      src={msg.productImageUrl}
                      alt={msg.productTitle || "Product"}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
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
                      src={`https://api.tenaly.com/${msg.file.path}`}
                      alt="uploaded"
                      className="w-40 h-auto rounded-lg"
                    />
                  ) : (
                    <a
                      href={`https://api.tenaly.com/${msg.file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      Download file
                    </a>
                  )}
                </div>
              )}

              {msg.messageType === "offer" && msg.offerDetails && (
                <div className={`mt-2 p-3 rounded-lg border ${
                  isFromSelf ? "border-blue-300 bg-blue-400": "border-gray-300 bg-white"
                }`}>
                  <p className={`text-xs font-semibold mb-1 ${isFromSelf ? "text-blue-100" : "text-gray-500"}`}>
                  OFFER 
                  </p>
                  <p className={`text-lg font-bold ${isFromSelf ? "text-white" : "text-gray-900"}`}>
                     ₦{msg.offerDetails.amount?.toLocaleString()}
                  </p>
                  {msg.offerDetails.productTitle && (
                    <p className={`text-xs mt-1 ${isFromSelf ? "text-blue-100" : "text-gray-500"}`}>
                      for {msg.offerDetails.productTitle}
                    </p>
                  )}
                  {msg.offerDetails.originalPrice && (
                    <p className={`text-xs ${isFromSelf ? "text-blue-200" : "text-gray-400"}`}>
                      Listed price: ₦{msg.offerDetails.originalPrice?.toLocaleString()}
                    </p>
                  )}
                  {/* Only show accept/reject to the seller (non-self) and if pending */}
                  {!isFromSelf && msg.offerDetails?.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAcceptOffer(msg.offerDetails.offerId?._id || msg.offerDetails.offerId)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors"
                      >
                        Accept 
                      </button>
                      <button
                       onClick={() => handleRejectOffer(msg.offerDetails.offerId?._id || msg.offerDetails.offerId)}
                       className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                  {msg.offerDetails?.status && msg.offerDetails.status !== "pending" && (
                    <p className={`text-xs mt-2 font-semibold capitalize ${
                      msg.offerDetails.status === "accepted" ? "text-green-500" : "text-red-500"
                    }`}>
                    {msg.offerDetails.status}
                    </p>
                  )}
                </div>
              )}

          <div className="text-sm leading-relaxed">
         {msg.messageType !== "offer" && msg.text && msg.productId && msg.productTitle ? (
        <>
         {msg.text.split(`"${msg.productTitle}"`)[0]}
         <Link 
           href={`/HomeList/${msg.productId}`}
           target="_blank"
           rel="noopener noreferrer"
           className={`font-semibold underline ${
             isFromSelf ? 'text-white hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'
           }`}> 
           "{msg.productTitle}"
         </Link>
          {msg.text.split(`"${msg.productTitle}"`)[1]}
       </>
      ) : (
        msg.messageType !== "offer" ? msg.text : null
      )}
           </div>
              <div className={`text-[10px] mt-1 ${isFromSelf ? 'text-blue-100' : 'text-gray-500'}`}>
                {format(parseISO(msg.createdAt), "hh:mm a")}
              </div>
              {isFromSelf && (
                <div className="text-[10px] text-blue-200 mt-1">
                  {isRead ? "Read" : isDelivered ? "Delivered" : "Sent"}
                </div>
              )}
            </div>

            {isFromSelf && (
              <Img
                src={senderImg}
                alt="you"
                width={28}
                height={28}
                className="rounded-full flex-shrink-0 mb-2"
              />
            )}
          </div>
        </div>
      );
    });
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="md:px-[104px] px-0 md:ml-10">
      {/* Breadcrumb - Only show on desktop */}
      <div className="hidden md:flex mt-28 items-center gap-2 mb-4 font-[400] font-inter flex-nowrap px-4">
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

      <div className="flex bg-white md:h-[calc(100vh-150px)] h-screen">
        {/* Left Panel - Contacts List */}
        <div className={`
          ${showContacts ? 'flex' : 'hidden'} 
          md:flex md:w-[350px] w-full bg-[#FAFAFA] border-r border-gray-200 flex-col
        `}>
          {/* Header for mobile */}
          <div className="md:hidden p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {contacts.map((user, i) => (
                <div
                  key={i}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-3 transition-colors"
                >
                  <div className="relative">
                    <Img
                      src={user.img || "/profile-circles1.svg"}
                      alt={user.fullName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {isOnline(user._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 font-inter truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 font-inter truncate mt-1">
                      {lastMessages[user._id] || "Start Conversation"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className={`
          ${showContacts ? 'hidden' : 'flex'} 
          md:flex flex-1 flex-col  min-h-0 mt-20 md:mt-0 bg-white
        `}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3 bg-white">
                {/* Back button for mobile */}
                <button 
                  onClick={handleBackToContacts}
                  className="md:hidden flex items-center justify-center w-10 h-10 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <Img
                      src={selectedUser.img || "/profile-circles1.svg"}
                      alt={selectedUser.fullName || "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {isOnline(selectedUser._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {selectedUser?.fullName || "Select a chat"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isOnline(selectedUser._id) ? "Online" : "Last seen 08:37pm"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto py-4 bg-gray-50">
                {renderMessages()}
                {typingUser === selectedUser?._id && (
                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <Img
                        src={selectedUser.img || "/profile-circles1.svg"}
                        alt="typing"
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-md">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              {chatRoomId && selectedUser && (
                <div className="border-t border-gray-200 bg-white">
                  <ChatInput
                    onSend={handleSend}
                    conversationId={chatRoomId}
                    recipientId={selectedUser._id}
                    token={token}
                    onTyping={() => emitTyping(chatRoomId)}
                    onStopTyping={() => emitStopTyping(chatRoomId)}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Mobile header for no conversation */}
              <div className="md:hidden border-b border-gray-200 px-4 py-3 bg-white">
                {/* <button 
                  onClick={handleBackToContacts}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button> */}
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-8">
                <Img 
                  src="/msgImg.svg"
                  alt="No Message"
                  width={80}
                  height={80}
                  className="mb-4 opacity-50"
                />
                <h3 className="text-[14px] font-inter font-[500] font-normal mb-2 text-[#868686]">
                  No messages yet.
                </h3>
              </div>
            </>
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