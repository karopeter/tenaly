"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Img from "../Image";
import Button from "../Button";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import SignUpModal from "@/app/hooks/signup-modal";
import SignInModal from "@/app/hooks/signin-modal";
import RoleSwitchModal from "../UI/RoleSwitchModa";

export default function Navbar() {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false);
  const [targetRole, setTargetRole] = useState(null);
  
  const { isLoggedIn, logout, role, switchRole } = useAuth();

  // Fetch user details and update when role changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isLoggedIn) return;
      
      try {
        const { data } = await api.get("/profile");
        setProfileData({
          image: data.image || ""
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [isLoggedIn, role]); // Added role as dependency

  useEffect(() => {
    let interval;

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/messages/unread-count");
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
      interval = setInterval(fetchNotifications, 10000);
    }

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleRoleToggle = async () => {
    const hideModal = localStorage.getItem("hideRoleSwitchModal");
    const newRole = role === "buyer" ? "seller" : "buyer";
    
    if (hideModal === "true") {
      // Switch role directly without modal
      await switchRole(newRole);
    } else {
      // Show modal first
      setTargetRole(newRole);
      setShowRoleSwitchModal(true);
    }
  };

  const handleConfirmRoleSwitch = async () => {
    const success = await switchRole(targetRole);
    if (success) {
      setShowRoleSwitchModal(false);
      // Force re-render by fetching fresh profile data
      try {
        const { data } = await api.get("/profile");
        setProfileData({
          image: data.image || ""
        });
      } catch (error) {
        console.error("Failed to refresh profile:", error);
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-custom-header">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between md:justify-around">
          <Link href="/Product-List" className="flex md:items-center">
            <Img src="/tenalyLogo.svg" alt="Tenaly Logo" width={89.95} height={44} />
          </Link>

          {/* Desktop Navigation with Role Toggle */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <span className={`text-[14px] font-inter font-[500] ${role === "buyer" ? "text-[#000087]" : "text-[#868686]"}`}>
                  I am buying
                </span>
                <button
                  onClick={handleRoleToggle}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    role === "seller" ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      role === "seller" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-[14px] font-inter font-[500] ${role === "seller" ? "text-[#000087]" : "text-[#868686]"}`}>
                  I am selling
                </span>
              </div>
            )}
          </div>

          {/* Right Side Icons/Buttons */}
          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div 
                  className="relative cursor-pointer"
                  onClick={async () => {
                    setUnreadCount(0);
                    try {
                      await api.post("/messages/mark-all-read");
                    } catch (err) {
                      console.error("Failed to mark messages as read:", err);
                    }
                  }}
                >
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
                <Link href="/Premium">
                  <Img
                    src="/plan-image.svg"
                    alt="Crown"
                    width={44}
                    height={44}
                    className="w-[32px] h-[32px] md:w-[44px] md:h-[44px]"
                  />
                </Link>
                <Link href="/Profile">
                  <Img
                    src={profileData?.image || "/profile-circles1.svg"}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="w-[32px] h-[32px] md:w-[44px] md:h-[44px] rounded-[30px]"
                    onError={(e) => {
                      e.currentTarget.src = "/profile-circles1.svg";
                    }}
                  />
                </Link>
                {role === "seller" && (
                  <Link href="/Add">
                    <Button className="w-[57px] h-[32px] rounded-[4px] md:w-[111px] md:h-[44px] md:rounded-[8px] bg-[#5555DD] text-white font-inter text-[14px] font-[500]">
                      Sell
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-[111px] h-[44px] rounded-[8px] border border-[#BABAF2] text-[#000087] font-inter text-[14px] font-[500]"
                  >
                    Sign Up
                  </button>
                  <Button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="w-[111px] h-[44px] rounded-[8px] bg-[#5555DD] text-white font-inter text-[14px] font-[500]"
                  >
                    Sell
                  </Button>
                </div>

                <div className="flex md:hidden gap-2">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1 rounded-[6px] border border-[#BABAF2] text-[#000087] text-[12px] font-inter"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={() => setIsSignInModalOpen(true)}
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

      {isModalOpen && <SignUpModal onClose={() => setIsModalOpen(false)} />}
      {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} />}
      <RoleSwitchModal
        isOpen={showRoleSwitchModal}
        onClose={() => setShowRoleSwitchModal(false)}
        onConfirm={handleConfirmRoleSwitch}
        targetRole={targetRole}
      />
    </>
  );
}