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
          console.error('Error fetching seller details:', err);
          setError(err.response?.data?.message || 'Failed to fetch seller details');
        } finally {
          setLoading(false);
        }
     };

     fetchSellerDetails();
  }, [sellerId]);

  return { sellerDetails, loading, error };
};

// Component that takes sellerId directly 
const SellerPhoneNumberBookmarked = ({ sellerId}) => {
    const { sellerDetails, loading, error } = useSellerDetails(sellerId);

    const handleCall = () => {
        window.open(`tel:${sellerDetails.phoneNumber}`, '_self')
    };

    return (
       <button
        onClick={handleCall}
       className="bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white
                   h-[40px] flex-1 flex items-center justify-center px-4 py-2 rounded-md
                    font-inter text-sm hover:bg-[#444444] transition">
        
         {sellerDetails?.phoneNumber
        ? ` ${sellerDetails.phoneNumber}`
        : ""}
       </button>
    );
}



export { SellerPhoneNumberBookmarked };