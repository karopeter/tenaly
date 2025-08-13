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
const SellerPhoneDisplay = ({ sellerId}) => {
    const { sellerDetails, loading, error } = useSellerDetails(sellerId);

    const handleCall = () => {
        window.open(`tel:${sellerDetails.phoneNumber}`, '_self')
    };

    return (
       <Button 
        onClick={handleCall}
       className="flex items-center justify-center 
               gap-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] md:w-[300px]
               md:h-[52px] md:rounded-[8px] text-[#FFFFFF] md:text-[16px] font-inter font-[500]">
         <Img 
         src="/call.svg"
         alt="Call Icon"
          width={19.97}
          height={20}
          className="w-[24px] h-[24px]" />
         {sellerDetails?.phoneNumber
        ? `Call ${sellerDetails.phoneNumber}`
        : "Call"}
       </Button>
    )
}

export { SellerPhoneDisplay };