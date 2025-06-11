"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Img from "../Image";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";

const sidebarItems = [
  { label: "Profile", icon: "/profile-circle.svg", href: "/Profile" },
  { label: "My Ads", icon: "/addItem.svg", href: "/Add" },
  { label: "Analytics", icon: "/chart.svg", href: "/Analytics" },
  { label: "Customer Reviews", icon: "/star.svg", href: "/CustomerReviews" },
  { label: "Premium Services", icon: "/crown-2.svg", href: "/PremiumService" },
  { label: "Pro Sales", icon: "/presention-chart.svg", href: "/ProSales" },
  { label: "Wallet", icon: "/wallet-money.svg", href: "/Wallet" },
  { label: "Customer Support", icon: "/24-support.svg", href: "/Support" },
  { label: "FAQs", icon: "/message-question.svg", href: "/Questions" },
  { label: "Settings", icon: "/setting-2.svg", href: '/' }, 
];

export default function Sidebar({ onProfileClick }) {
  const [isMobile, setIsMobile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false); // toggle dropdown

  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/profile");
        const [first, ...rest] = data.fullName.split(" ");
        setProfileData({
          firstName: first || "",
          lastName: rest.join(" ") || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          createdAt: data.createdAt || "",
          image: data.image || "",
        });
      } catch (error) {
        toast.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavClick = (item) => {
    if (item.label === "Profile") {
      if (typeof onProfileClick === "function") onProfileClick();
    }

    if (item.label === "Settings") {
      setSettingsOpen((prev) => !prev);
      return;
    }

    if (item.href) {
      router.push(item.href);
    }

    if (isMobile) {
      setActiveMobileSection(item.label);
    }
  };

  const renderNavItems = () => (
    <>
      {sidebarItems.map((item) => (
        <div key={item.label}>
          <button
            onClick={() => handleNavClick(item)}
            className="flex items-center justify-between gap-3 p-2 hover:bg-[#000087] hover:text-white transition text-left w-full"
          >
            <div className="flex items-center gap-3">
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.label === "Settings" &&
              (settingsOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              ))}
          </button>

          {item.label === "Settings" && settingsOpen && (
            <div className="pl-10 pt-1">
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
    <>
      {!activeMobileSection && isMobile ? null : !isMobile ? null : (
        <div className="md:hidden mt-10">
          <button
            onClick={() => setActiveMobileSection(null)}
            className="text-blue-700 mb-4"
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {(!isMobile || !activeMobileSection) && (
        <aside className="flex-shrink-0 w-full md:w-72">
          <div className="bg-[#F7F7FF] p-4 rounded-[8px] text-center mb-4">
            {profileData !== null ? (
              <>
                <Img
                  src={profileData?.image || "/profile-circles1.svg"}
                  width={83.33}
                  height={83.33}
                  className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                  alt="Profile Picture"
                />
                <h3 className="text-[#525252] font-[500] font-inter">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-[#868686] text-sm font-[500]">
                  {profileData.createdAt
                    ? `Joined since ${new Date(profileData.createdAt).toLocaleDateString()}`
                    : ""}
                </p>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm mb-4">
              <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm">
            <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
          </div>
        </aside>
      )}
    </>
  );
}
