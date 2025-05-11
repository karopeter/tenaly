"use client";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Img from "../Image";
import Button from "../Button";
import api from "@/services/api";

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
  { label: "Settings", icon: "/setting-2.svg", href: "/" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/profile");
  
        // Split fullName safely
        const [first, ...rest] = (data.fullName || "").split(" ");
        const firstName = first || "";
        const lastName = rest.join(" ") || "";
  
        // Now set profileData correctly
        setProfileData({
          firstName,
          lastName,
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          createdAt: data.createdAt || "",
          image: data.image || "", // assuming it's a single string
        });
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUserDetails();
  }, []);
  
  const toggleExpand = (label) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  const NavItems = () => (
    <nav className="flex flex-col space-y-4">
      {sidebarItems.map((item) => (
        <div key={item.label}>
          <button
            onClick={() => toggleExpand(item.label)}
            className="flex justify-between items-center w-full p-2 rounded hover:bg-[#000087] hover:text-white transition"
          >
            <div className="flex items-center gap-3 text-sm md:text-base">
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <Link href={item.href}>
                <span>{item.label}</span>
              </Link>
            </div>
            {expanded === item.label ? (
              <ChevronDown className="w-4 h-4 text-white md:text-[#525252]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#525252]" />
            )}
          </button>
          {expanded === item.label && (
            <div className="ml-8 mt-2 text-sm text-gray-500">
              {item.label === "Settings" && isLoggedIn ? (
                <Button
                  onClick={logout}
                  className="px-3 py-1 rounded-[6px] border border-[#BABAF2] text-[#000087] text-[12px] font-inter"
                >
                  Logout
                </Button>
              ) : (
                <div className="text-gray-800"></div>
              )}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <aside className="flex-shrink-0 w-full md:w-72">
      {/* Profile Box */}
      <div className="bg-[#F7F7FF] p-4 rounded-[8px] text-center mb-4">
  {profileData !== null ? (
    <>
      <Img
        src={
          profileData?.image
            ? profileData.image
            : "/profile-circles1.svg" // fallback image
        }
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

      {/* Mobile Hamburger */}
      <div className="flex justify-start mb-4 md:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 bg-white hover:bg-gray-100 rounded-md shadow focus:outline-none"
        >
          <Menu className="w-6 h-6 text-[#525252]" />
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:block bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm">
        <NavItems />
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAFAFA] border border-[#EDEDED] p-4 rounded-[4px] shadow-sm mb-4">
          <NavItems />
        </div>
      )}
    </aside>
  );
}
