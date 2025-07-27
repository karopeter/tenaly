"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Img from "../Image";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Profile from "@/app/Profile/page";
import AddCarPost from "@/app/Add/page";
import Wallet from "@/app/Wallet/page";
import FrequentlyAskedQuestions from "@/app/Faq/page";
import { toast } from "react-toastify";

const sidebarItems = [
  { label: "Profile", icon: "/profile-circle.svg", href: "/Profile" },
  { label: "My Ads", icon: "/addKai.svg", href: "/Add" },
  { label: "Analytics", icon: "/chart.svg", href: "/Analytics" },
  { label: "Customer Reviews", icon: "/star.svg", href: "/CustomerReviews" },
  { label: "Premium Services", icon: "/crown-2.svg", href: "/PremiumService" },
  { label: "Pro Sales", icon: "/presention-chart.svg", href: "/ProSales" },
  { label: "Wallet", icon: "/wallet-money.svg", href: "/Wallet" },
  { label: "Customer Support", icon: "/24-support.svg", href: "/Support" },
  { label: "Frequently Asked Questions", icon: "/message-question.svg", href: "/Faq" },
  { label: "Settings", icon: "/setting-2.svg", href: '/Settings' }, 
];

const sectionComponents = {
  Profile: <Profile />,
  "My Ads": <AddCarPost />,
  Wallet: <Wallet />,
  "Frequently Asked Questions": <FrequentlyAskedQuestions />,
};

export default function Sidebar({ isMobile, activeSection, setActiveSection }) {
  const [profileData, setProfileData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/profile");
        console.log("Profile Data:", data);
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

  const handleNavClick = (item) => {
    if (isMobile) {
      setActiveSection(item.label);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  const renderNavItems = () => (
    <>
      {sidebarItems.map((item) => (
        <div key={item.label}>
          <button
            onClick={() => handleNavClick(item)}
            className="group flex items-center justify-between gap-3 p-2 hover:bg-[#000087] hover:text-white transition text-left w-full"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.icon} 
                alt={item.label} 
                className="w-5 h-5 transition group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:contrast-200" />
              <span className="transition group-hover:text-white">{item.label}</span>
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
              {/* <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Logout
              </button> */}
            </div>
          )}
        </div>
      ))}
    </>
  );

  // MOBILE: Only sidebar or only content
  if (isMobile) {
    if (!activeSection) {
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
          <div className="bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm mb-4">
            <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
          </div>
        </aside>
      );
    } else {
      return (
        <div className="w-full">
          <button
            onClick={handleBackToMenu}
            className="text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Menu
          </button>
          <div className="p-4">
            {sectionComponents[activeSection] || (
              <div>
                <h2 className="text-xl font-bold mb-2">{activeSection}</h2>
                <p>This is the <b>{activeSection}</b> page content.</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // DESKTOP: Show sidebar always
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
      <div className="hidden md:block bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm">
        <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
      </div>
    </aside>
  );
}