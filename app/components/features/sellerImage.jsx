"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Button from "../Button";
import Img from "../Image";


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


const SellerImage = ({ sellerId }) => {
  const { sellerDetails, loading, error } = useSellerDetails(sellerId);

  if (loading) return <p className="text-sm text-gray-500">Loading seller info...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!sellerDetails) return null;
  
  return (
    <div className="">
      {/* ✅ Profile Image */}
      <Img
        src={sellerDetails.image || "/profile-circles1.svg"}
        alt={sellerDetails.fullName}
        width={52}
        height={52}
        className="w-[40px] h-[40px] rounded-[30px] object-cover"
        onError={(e) => {
         e.currentTarget.src = "/profile-circles1.svg"; 
       }}
      />
    </div>
  );
};

export { SellerImage, useSellerDetails };
