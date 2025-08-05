"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Img from "../Image";
import Button from "../Button";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import SignUpModal from "../../hooks/signup-modal";
import SignInModal from "@/app/hooks/signin-modal";

export default function Navbar() {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
       try {
       const { data } = await api.get("/profile");
       console.log("Profile Data:", data);
       setProfileData({
         image: data.image || ""
       });
       } catch (error) {
         toast.error("Failed to fetch user details:", error);
       }
    };

    fetchUserDetails();
  }, []);


  useEffect(() => {
    let interval;


    const fetchUnreadCount = async () => {
       try {
         const res = await api.get("/messages/unread-count");
         console.log("Unread count:", res.data.unreadCount);
         setUnreadCount(res.data.unreadCount);
       } catch (err) {
        console.error("Failed to fetch unread count:", err); 
       }
    };


    if (isLoggedIn) {
      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, 10000);
    }

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
  let interval;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notification");
      const notificationList = Array.isArray(res.data)
        ? res.data
        : res.data.notifications || [];

      const unread = notificationList.filter(n => !n.isRead);
      setNotifications(notificationList);
      setUnreadNotifications(unread.length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  if (isLoggedIn) {
    fetchNotifications();
    interval = setInterval(fetchNotifications, 10000); // Poll every 10s
  }

  return () => clearInterval(interval);
}, [isLoggedIn]);

  
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-custom-header">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between md:justify-around">
          {/* Logo always on the left */}
          <Link href="/" className="flex md:items-center">
            <Img src="/tenalyLogo.svg" alt="Tenaly Logo" width={89.95} height={44} />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-3 text-[#000087] font-[500] font-inter">
            <Link href="/" className="text-[14px] transition">Find Anything,</Link>
            <Link href="/" className="text-[14px] transition">Sell Anything</Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-2  md:gap-4">
                <div className="relative">
                  <Link href="/Message">
                  <Img 
                   src="/chatIcon.svg"
                   alt="Chat"
                   width={44}
                   height={44}
                   className="w-[32px] h-[32px] md:w-[44px] md:h-[44px]"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                </div>
                <div className="relative">
                  <Link href="/Notification">
                  <Img 
                    src="/notification.svg"
                    alt="Notification"
                    width={44}
                    height={44}
                    className="w-[32px] h-[32px] md:w-[44px] md:h-[44px]"
                  />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                       {unreadNotifications}
                    </span>
                  )}
                </Link>
                </div>
                <Link href="/">
                  <Img 
                    src="/crown.svg"
                    alt="Crown"
                    width={44}
                    height={44}
                     className="w-[32px] h-[32px] md:w-[44px] md:h-[44px]"
                  />
                </Link>
                <Link href="/">
                 <Img 
                   src={profileData?.image || "/profile-circles1.svg"}
                   alt="GF"
                   width={44}
                   height={44}
                   className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] rounded-[30px]"
                   />
                </Link>
                <Link href="/Add">
                 <Button
                  onClick={() => console.log("Sell button clicked")}
                  className="w-[57px] h-[32px] rounded-[4px] pt-[6px] pr-[16px] pb-[10px] pl-[16px] md:pt-[10px] md:pr-4 md:pl-4 md:pb-[10px]  md:w-[111px] md:h-[44px] md:rounded-[8px] 
                  bg-[#5555DD] md:inline-block text-white font-inter text-[14px] font-[500]"
                >
                  Sell
                </Button>
                 </Link>
              </div>
            ): (
             <>
              {/* Desktop Buttons */}
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-[83px] h-[32px] rounded-[4px] pt-[10px] pr-[16px] pb-[10px] pl-[16px] md:pt-[10px] md:pr-4 md:pl-4 md:pb-[10px] 
                md: md:w-[111px] md:h-[44px] md:rounded-[8px] 
                md:inline-block border border-[#BABAF2] text-[#000087]
                 font-inter text-[14px] font-[500]"
              >
                Sign Up
              </button>
              <Button
                onClick={() => setIsSignInModalOpen(true)} // Open Sign In Modal
                className="w-[57px] h-[32px] rounded-[4px] pt-[10px] pr-[16px] pb-[10px] pl-[16px] md:pt-[10px] md:pr-4 md:pl-4 md:pb-[10px]  md:w-[111px] md:h-[44px] md:rounded-[8px] 
                bg-[#5555DD] md:inline-block text-white font-inter text-[14px] font-[500]"
              >
                Sell
              </Button>
            </div>

            {/* Mobile Buttons (smaller & visible on mobile) */}
            <div className="flex md:hidden gap-2">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 rounded-[6px] border border-[#BABAF2] text-[#000087] text-[12px] font-inter"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => setIsSignInModalOpen(true)} // Open Sign In Modal
                className="px-3 py-1 rounded-[6px] bg-[#5555DD] text-white text-[12px] font-inter"
              >
                Sell
              </Button>
            </div>
             </>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      {isModalOpen && <SignUpModal onClose={() => setIsModalOpen(false)} />}
      {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} />} 
    </>
  );
}