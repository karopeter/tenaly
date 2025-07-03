"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Img from "../components/Image"; 
import { SendHorizonal, ArrowLeft, Plus } from "lucide-react";
import {
    initialSocket,
    joinRoom,
    sendMessage,
    onReceiveMessage,
    onHistoricalMessages,
    onNewMessageNotification,
    onMessagesRead,
    getSocket
} from "../utils/socket";
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

import api from "@/services/api"; 


const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("No authentication token found in localStorage.");
        }
        return token;
    }
    return null;
};

export default function MessagePage() {
    const router = useRouter();
    const [myUserId, setMyUserId] = useState(null);
    const [myProfilePicture, setMyProfilePicture] = useState("/placeholder.svg"); // Default for yourself
    const [myFullName, setMyFullName] = useState("You"); // Default for yourself
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const searchParams = useSearchParams();
const sellerIdFromQuery = searchParams.get('sellerId');
const productIdFromQuery = searchParams.get('productId');

    // Initial fetch of user ID and conversations
    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            console.error("Authentication token not found. Redirecting to login.");
            // router.push('/login'); // Uncomment this if you want to enforce login redirection
            setIsLoading(false);
            return;
        }

        // Set Authorization header for Axios instance
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const fetchData = async () => {
            try {
                // Fetch current user's ID and profile details
                const userRes = await api.get('/profile');
                console.log("User profile fetched:", userRes.data);
                const userId = userRes.data._id || userRes.data.id; // Correctly looking for _id or id
                if (!userId) {
                    console.error("User ID not found in /profile response:", userRes.data);
                    setIsLoading(false);
                    return;
                }
                setMyUserId(userId);
                // Set my own profile picture and full name using the 'image' field
                setMyProfilePicture(userRes.data.image || "/placeholder.svg");
                setMyFullName(userRes.data.fullName || userRes.data.email || "You");


               const convRes = await api.get('/conversations');
setConversations(convRes.data);

// Automatically select the conversation with the seller (if provided in query)
if (sellerIdFromQuery) {
  const existingConv = convRes.data.find(conv => {
    return (
      (conv.sellerId?._id === sellerIdFromQuery || conv.sellerId === sellerIdFromQuery) ||
      (conv.customerId?._id === sellerIdFromQuery || conv.customerId === sellerIdFromQuery)
    );
  });

  if (existingConv) {
    setSelectedConversation(existingConv);
  } else {
    // No conversation found, create a new one
    const newConvRes = await api.post('/conversations', {
      sellerId: sellerIdFromQuery,
      productId: productIdFromQuery,
    });

    if (newConvRes?.data) {
      setConversations(prev => [...prev, newConvRes.data]);
      setSelectedConversation(newConvRes.data);
    }
  }
} else if (convRes.data.length > 0) {
  setSelectedConversation(convRes.data[0]);
}


                

            } catch (error) {
                console.error("Error during initial data fetch:", error);
               
            } finally {
                setIsLoading(false); // Always stop loading, even on error
            }
        };

        fetchData();
    }, [router]);

    // Socket.IO Connection and Listeners
    useEffect(() => {
        const token = getAuthToken();
        if (!token || !myUserId) {
            console.log("Waiting for token or myUserId to initialize socket.");
            return;
        }

        const socket = initialSocket(token);

        const handleReceiveMessage = (msg) => {
            console.log("Received new message:", msg);
            if (selectedConversation && msg.conversationId === selectedConversation._id) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            } else {
                setConversations(prevConvs => prevConvs.map(conv => {
                    if (conv._id === msg.conversationId) {
                        const isSelectedAndFromMe = selectedConversation?._id === msg.conversationId && msg.senderId === myUserId;
                        return { ...conv, lastMessageAt: msg.createdAt, hasUnread: !isSelectedAndFromMe };
                    }
                    return conv;
                }));

                const convForNotification = conversations.find(c => c._id === msg.conversationId);
                const senderNameForNotification = (convForNotification && msg.senderId === myUserId)
                    ? 'You'
                    : (convForNotification ? getOtherParticipant(convForNotification).name : 'Someone');

                onNewMessageNotification({
                    conversationId: msg.conversationId,
                    senderName: senderNameForNotification,
                    messageContent: msg.messageContent,
                });
            }
        };

        const handleHistoricalMessages = (historicalMsgs) => {
            console.log("Received historical messages:", historicalMsgs);
            setMessages(historicalMsgs);
        };

        const handleMessagesRead = ({ messageIds, readerId }) => {
            if (selectedConversation && readerId !== myUserId && messageIds.length > 0) {
                setMessages(prevMsgs => prevMsgs.map(msg => {
                    if (messageIds.includes(msg._id) && msg.senderId !== readerId && !msg.readBy.includes(readerId)) {
                        return { ...msg, readBy: [...msg.readBy, readerId] };
                    }
                    return msg;
                }));
            }
        };

        onReceiveMessage(handleReceiveMessage);
        onHistoricalMessages(handleHistoricalMessages);
        onMessagesRead(handleMessagesRead);

        return () => {
            const currentSocket = getSocket();
            if (currentSocket) {
                currentSocket.off("receiveMessage", handleReceiveMessage);
                currentSocket.off("historicalMessages", handleHistoricalMessages);
                currentSocket.off("messagesRead", handleMessagesRead);
            }
        };
    }, [selectedConversation, myUserId, conversations]);

    useEffect(() => {
        if (selectedConversation && myUserId) {
            joinRoom(selectedConversation._id);
        } else if (!selectedConversation && myUserId) {
            setMessages([]);
        }
    }, [selectedConversation, myUserId]);

    useEffect(() => {
        if (messages.length > 0 && selectedConversation && myUserId) {
            const unreadMessageIds = messages
                .filter(msg => msg.senderId !== myUserId && !msg.readBy.includes(myUserId))
                .map(msg => msg._id);

            if (unreadMessageIds.length > 0) {
                const socket = getSocket();
                if (socket && socket.connected) {
                    socket.emit("markAsRead", {
                        messageIds: unreadMessageIds,
                        conversationId: selectedConversation._id
                    });
                    console.log("Marked messages as read:", unreadMessageIds);
                    setMessages(prevMsgs => prevMsgs.map(msg => {
                        if (unreadMessageIds.includes(msg._id) && !msg.readBy.includes(myUserId)) {
                            return { ...msg, readBy: [...msg.readBy, myUserId] };
                        }
                        return msg;
                    }));
                }
            }
        }
    }, [messages, selectedConversation, myUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        const trimmedMessage = messageInput.trim();

        if (!trimmedMessage) {
            console.warn("Message input is empty or contains only spaces.");
            return;
        }

        if (!selectedConversation) {
            alert("Please select a conversation before sending a message.");
            return;
        }

        if (!myUserId) {
            console.error("My user ID is not set. Cannot send message.");
            return;
        }

        sendMessage(selectedConversation._id, trimmedMessage);

        const optimisticMessage = {
            conversationId: selectedConversation._id,
            senderId: myUserId,
            messageContent: trimmedMessage,
            createdAt: new Date().toISOString(),
            readBy: [myUserId],
            _id: `temp-${Date.now()}`
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setMessageInput("");
    };

    const handleFileUpload = () => {
        fileInputRef.current.click();
        alert("File upload is not yet implemented.");
    };

    // Helper to get the other participant's details in a conversation
    const getOtherParticipant = useCallback((conversation) => {
        if (!myUserId || !conversation) {
            return { name: "Unknown User", img: "/placeholder.svg", _id: null };
        }

        const seller = conversation.sellerId;
        const customer = conversation.customerId;

        if (!seller || !customer) {
             console.warn("Conversation participant IDs not populated or missing:", conversation);
             return { name: "Unknown User", img: "/placeholder.svg", _id: null };
        }

        const otherParticipant = seller._id === myUserId
            ? customer
            : seller;

        // Use the 'image' field for profile pictures
        const name = otherParticipant.fullName || otherParticipant.email || "Unnamed User";
        const img = otherParticipant.image || "/placeholder.svg"; // Changed from profilePictureUrl to 'image'
        return { name, img, _id: otherParticipant._id };
    }, [myUserId]);

    const currentChatPartner = selectedConversation
        ? getOtherParticipant(selectedConversation)
        : { name: "Start a New Chat", img: "/placeholder.svg", _id: null };

    const isChatPartnerOnline = true; // Placeholder
    const chatPartnerLastSeen = "Today at 4:32 PM"; // Placeholder

    if (isLoading) {
        return (
            <div className="md:px-[104px] px-4 md:ml-10 mt-28 text-center text-lg text-gray-700">
                Loading user profile and conversations...
            </div>
        );
    }

    if (!myUserId) {
        return (
            <div className="md:px-[104px] px-4 md:ml-10 mt-28 text-center text-lg text-red-500">
                Failed to load user profile. Please log in again.
            </div>
        );
    }

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

            <div className="flex h-[calc(100vh-180px)] bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Left Panel - Conversation List */}
                <div className="w-[350px] bg-[#FAFAFA] border-r border-gray-300 p-4 overflow-y-auto">
                    <h2 className="md:text-18px text-[#525252] font-[500] font-inter mb-4">
                        My Messages <span className="bg-[#525252] md:w-[27px] md:h-[20px] md:rounded-[100px] md:pt-[4px] md:pr-[8px] md:pb-[4px] md:pl-[8px] text-[#FFFFFF] md:text-[12px]">{conversations.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {conversations.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active conversations. Start a new chat!</p>
                        ) : (
                            conversations.map((conv) => {
                                const otherParticipant = getOtherParticipant(conv);
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => {
                                            setSelectedConversation(conv);
                                            setConversations(prev => prev.map(c =>
                                                c._id === conv._id ? { ...c, hasUnread: false } : c
                                            ));
                                        }}
                                        className={`flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2
                                            ${selectedConversation?._id === conv._id ? 'bg-gray-100' : ''}`}
                                    >
                                        <Img src={otherParticipant.img} alt={otherParticipant.name} width={44} height={44} className="rounded-full" />
                                        <div className="flex-1">
                                            <p className="md:text-[16px] font-[500] text-[#525252] font-inter">{otherParticipant.name}</p>
                                            <p className="md:text-[14px] font-[400] text-[#868686] font-inter">
                                                {conv.lastMessageAt ? `Last activity: ${format(new Date(conv.lastMessageAt), 'p')}` : 'Start chatting!'}
                                            </p>
                                        </div>
                                        {conv.hasUnread && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-auto">New</span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel (Chat View) */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-[#FAFAFA] sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5 cursor-pointer text-[#4C4C4C] md:hidden" />
                            <Img
                                src={currentChatPartner.img}
                                alt={currentChatPartner.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <p className="font-[500] text-[#525252] text-[16px]">
                                {currentChatPartner.name}
                            </p>
                        </div>

                        {selectedConversation && (
                            <div>
                                {isChatPartnerOnline ? (
                                    <span className="text-[#238E15] font-[500] text-[14px]">ONLINE</span>
                                ) : (
                                    <span className="text-[#8C8C8C] font-[400] text-[14px]">
                                        Last seen: {chatPartnerLastSeen}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-gray-50">
                        {selectedConversation ? (
                            <>
                                <div className="text-center text-[#868686] text-sm mb-2">Today</div>
                                {messages.map((msg) => {
                                    const isMyMessage = msg.senderId === myUserId;
                                    const senderImg = isMyMessage ? myProfilePicture : currentChatPartner.img;
                                    const messageTime = msg.createdAt ? format(new Date(msg.createdAt), 'p') : 'N/A';

                                    return (
                                        <div key={msg._id} className={`flex items-start gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                                            {!isMyMessage && (
                                                <Img src={senderImg} alt="sender" width={30} height={30} className="rounded-full" />
                                            )}
                                            <div
                                                className={`max-w-[70%] p-3 rounded-xl text-sm relative ${isMyMessage ? "bg-[#DFDFF9]" : "bg-[#F7F7FF]"}`}
                                            >
                                                <p>{msg.messageContent}</p>
                                                <div className="text-[11px] text-gray-500 mt-1 text-right">
                                                    {messageTime}
                                                    {isMyMessage && msg.readBy && msg.readBy.length > 1 && (
                                                        <span className="ml-2 text-blue-500">✓✓</span>
                                                    )}
                                                </div>
                                            </div>
                                            {isMyMessage && (
                                                <Img src={senderImg} alt="sender" width={30} height={30} className="rounded-full" />
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {conversations.length === 0
                                    ? "No active conversations. To start a new chat, navigate to a user's profile or a product listing and initiate contact."
                                    : "Select a conversation from the left to view messages."
                                }
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="px-4 py-3 bg-white">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <button type="button" onClick={handleFileUpload} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                                <Plus className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder={selectedConversation ? "Type your message" : "Select a conversation to start chatting"}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 p-2 bg-[#FAFAFA] border-none rounded-lg text-sm outline-none placeholder:text-[#8C8C8C]"
                            />
                            <button
                                type="submit"
                                className={`p-2 rounded-full ${!selectedConversation || !messageInput.trim() ? 'text-gray-400 cursor-not-allowed' : 'text-[#4C4C4C] hover:bg-gray-100'}`}
                            >
                                <SendHorizonal className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}