"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Img from "../Image";
import { useRouter, usePathname } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";

const allSidebarItems = [
  { label: "Profile", icon: "/profile-circle.svg", href: "/Profile", roles: ["buyer", "seller"] },
  { label: "Business", icon: "/businessIcon.svg", href: "/Business", roles: ["seller"] },
  { label: "My Ads", icon: "/addKai.svg", href: "/Add", roles: ["seller"] },
  { label: "Analytics", icon: "/chart.svg", href: "/Analytics", roles: ["seller"] },
  { label: "Bookmarked", icon: "/bookmarkIcon.svg", href: "/Bookmarked", roles: ["buyer"] },
  { label: "Customer Reviews", icon: "/star.svg", href: "/CustomerReviews", roles: ["seller"] },
  { label: "Wallet", icon: "/wallet-money.svg", href: "/Wallet", roles: ["seller"] },
  { label: "Customer Support", icon: "/24-support.svg", href: "/Support", roles: ["buyer", "seller"] },
  { label: "Frequently Asked Questions", icon: "/message-question.svg", href: "/Faq", roles: ["buyer", "seller"] },
  { label: "Settings", icon: "/setting-2.svg", href: '/Settings', roles: ["buyer", "seller"] },
];

export default function Sidebar({ isMobile, activeSection, setActiveSection }) {
  const [profileData, setProfileData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { logout, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Filter sidebar items - role defaults to buyers in AuthContext 
  const userRole = role || "buyer";
  const sidebarItems = allSidebarItems.filter(item => 
    item.roles.includes(userRole)
  );

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
          isVerified: data.isVerified || false,
          paidPlan: data.paidPlans?.[0]?.planType || null,
          tierLevel: data.tierLevel || 0,
        });
      } catch (error) {
        toast.error("Failed to fetch user details:", error.message);
      }
    };
    fetchUserDetails();
  }, []);

  const getIsActive = (item) => {
    if (isMobile) return activeSection === item.label;
    return pathname?.toLowerCase().startsWith(item.href.toLowerCase());
  };

  const handleNavClick = (item) => {
    if (isMobile) {
      setActiveSection(item.label);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const renderNavItems = () => (
    <>
      {sidebarItems.map((item) => {
        const isActive = getIsActive(item);
        return (
          <div key={item.label}>
            <button
              onClick={() => handleNavClick(item)}
              className={`group flex items-center justify-between gap-3 p-2 transition text-left w-full rounded-[4px] ${
                isActive ? 'bg-[#000087] text-white' : 'hover:bg-[#000087] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-5 h-5 transition ${isActive ? 'filter invert brightness-0 contrast-200' : 'group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:contrast-200'}`}
                />
                <span className={`transition ${isActive ? 'text-white' : 'group-hover:text-white'}`}>{item.label}</span>
              </div>
              {item.label === "Settings" &&
                (settingsOpen ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                ))}
            </button>
          </div>
        );
      })}
    </>
  );

  return (
    <aside className="flex-shrink-0 w-full md:w-72 mt-4">
      <div className="bg-[#F7F7FF] p-4 rounded-[8px] text-center mb-4">
       {profileData !== null ? (
        <>
         <div className="relative mb-2">
          {/* Profile Photo - Centered */}
           <div className="flex justify-center">
             <Img
               src={profileData.image || "/profile-circles1.svg"}
               width={83.33}
               height={83.33}
               className="w-20 h-20 rounded-full object-cover"
               alt="Profile Picture"
               onError={(e) => {
                e.currentTarget.src = "/profile-circles1.svg";
               }}
             />
           </div>

           {/* Tier Badge - Positioned at top right */}
           {profileData?.tierLevel > 0 && (
            <div 
             className="absolute top-2 right-2 text-white rounded-[17px] flex items-center justify-center gap-1 px-2 bg-cover bg-center bg-no-repeat"
             style={{
              backgroundImage: `url("/tier-background1.svg")`,
              width: "60px",
              height: "28px",
             }}
            >
              <span className="text-white text-[10px] font-[500]">Tier</span>
              <span
               className="inline-flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0"
               style={{
                backgroundColor: '#BCD7F657',
                width: '14px',
                height: '14px',
                minWidth: '14px',
                minHeight: '14px',
                borderRadius: '50%'
               }}
              >
                {profileData.tierLevel}
              </span>
            </div>
           )}
           <h3 className="text-[#525252] font-[500] font-inter">
            {profileData.firstName} {profileData.lastName}
           </h3>
           <p className="text-[#868686] text-sm font-medium">
            {profileData.createdAt
              ? `Joined since ${new Date(profileData.createdAt).toLocaleDateString()}`
              : ""}
           </p>

           {profileData?.paidPlan && role === "seller" && (
            <>
             <hr className="my-2 border-t border-[#EDEDED]" />
             <p className="text-[#868686] text-sm font-medium flex items-center justify-center gap-2 mt-2">
              <Img 
                src="/plan-crown.svg"
                alt="Crown Image"
                width={20}
                height={20}
              />
              You are on the {" "}
              {profileData.paidPlan.charAt(0).toUpperCase() + profileData.paidPlan.slice(1)} plan 
             </p>
            </>
           )}
          </div>
        </>
       ): (
        <div>Loading</div>
       )}
      </div>
      <div className="bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm">
        <nav className="flex flex-col space-y-4">{renderNavItems()}</nav>
      </div>
    </aside>
  );
}