"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Button from "../Button";
import Img from "../Image";

// Hook (unchanged)
const useSellerDetails = (sellerId) => {
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    const fetchSellerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/profile/seller/${sellerId}`);
        setSellerDetails(response.data);
      } catch (err) {
        console.error("Error fetching seller details:", err);
        setError(err.response?.data?.message || "Failed to fetch seller details");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [sellerId]);

  return { sellerDetails, loading, error };
};

// Component
const SellerInfo = ({ sellerId }) => {
  const { sellerDetails, loading, error } = useSellerDetails(sellerId);

  if (loading) return <p className="text-sm text-gray-500">Loading seller info...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!sellerDetails) return null;

  // ✅ define isVerified from API data
  const isVerified = !!sellerDetails?.isVerified;

  const handleCall = () => {
    window.open(`tel:${sellerDetails.phoneNumber}`, "_self");
  };

  return (
    <div className="">
     <div
       className={`mt-1 flex items-center gap-1 rounded-[2px] px-2 py-[2px] w-fit max-w-full
       ${isVerified ? "bg-[#E9F4E8]" : "bg-[#FBEAEA]"}`}>
            <Img
              src={isVerified ? "/profile.svg" : "/unverified.svg"}
              alt={isVerified ? "Verified Icon" : "Unverified Icon"}
              width={10}
              height={10}
              className="w-[10px] h-[10px]"
            />
            <span
              className={`text-[10px] font-[500] font-inter whitespace-nowrap
              ${isVerified ? "text-[#238E15]" : "text-[#D72638]"}`}
            >
              {isVerified ? "Verified Business" : "Unverified Business"}
            </span>
          </div>

          
    </div>
  );
};

export { SellerInfo, useSellerDetails };
