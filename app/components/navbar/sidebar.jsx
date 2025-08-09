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
  { label: "My Ads", icon: "/addKai.svg", href: "/Add" },
  { label: "Analytics", icon: "/chart.svg", href: "/Analytics" },
  { label: "Bookmarked", icon: "/bookmarked1.svg", href: "/Bookmarked" },
  { label: "Customer Reviews", icon: "/star.svg", href: "/CustomerReviews" },
  { label: "Premium Services", icon: "/crown-2.svg", href: "/PremiumService" },
  { label: "Pro Sales", icon: "/presention-chart.svg", href: "/ProSales" },
  { label: "Wallet", icon: "/wallet-money.svg", href: "/Wallet" },
  { label: "Customer Support", icon: "/24-support.svg", href: "/Support" },
  { label: "Frequently Asked Questions", icon: "/message-question.svg", href: "/Faq" },
  { label: "Settings", icon: "/setting-2.svg", href: '/Settings' },
];

export default function Sidebar({ isMobile, activeSection, setActiveSection }) {
  const [profileData, setProfileData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { logout } = useAuth();
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
        toast.error("Failed to fetch user details:", error.message);
      }
    };
    fetchUserDetails();
  }, []);

  const handleNavClick = (item) => {
    if (isMobile) {
      setActiveSection(item.label);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const renderNavItems = () => (
    <>
      {sidebarItems.map((item) => (
        <div key={item.label}>
          <button
            onClick={() => handleNavClick(item)}
            className={`group flex items-center justify-between gap-3 p-2 transition text-left w-full rounded-[4px] ${
              activeSection === item.label ? 'bg-[#DFDFF9] text-[#000087]' : 'hover:bg-[#000087] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={item.icon}
                alt={item.label}
                className={`w-5 h-5 transition ${activeSection === item.label ? 'filter invert brightness-0 contrast-200' : 'group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:contrast-200'}`}
              />
              <span className={`transition ${activeSection === item.label ? 'text-white' : 'group-hover:text-white'}`}>{item.label}</span>
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
            </div>
          )}
        </div>
      ))}
    </>
  );

  return (
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
      <div className="bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm">
        <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
      </div>
    </aside>
  );
}