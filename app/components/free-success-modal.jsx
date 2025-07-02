// components/SuccessModal.jsx
"use client";
import { useState, useEffect } from "react";
import Img from "./Image";
import Button from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";

export default function FreeSuccessModal({ onClose }) {
  const [profileData, setProfileData] = useState(false);
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
    const timeout = setTimeout(onClose, 5000); 
    return () => clearTimeout(timeout);
  }, [onClose]);

  const redirect = () => {
    router.push("/view-vehicle-add");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-[24px] shadow-md max-w-md w-full text-center">
        <div className="flex justify-center">
         <Img 
          src="/lottifile.svg"
          alt="Success Image"
          width={120}
          height={120}
          className="w-[120px] h-[120px] object-contain"
         />
        </div>
        <h2 className="text-[18px] font-[500] mb-2 text-[#525252] font-inter">
           Congratulation!!!
         </h2>
        <p className="text-[#868686] font-[400] font-inter text-[14px] mb-4">
          Your journey as a seller has offically begun. Your ad is 
          <br className="hidden-xs" />
          currently under review to ensure it meets our
          <br className="hidden-xs" />
          guidelines. You will be notified once it's approved. or 
          <br className="hidden-xs" />
          declined.
        </p>

        <div className="flex justify-center">
        <Button
        onClick={redirect}
          className="mt-4 bg-gradient-to-r md:w-[197px] md:h-[44px] from-[#00A8DF] to-[#1031AA] text-white px-4 py-2 rounded-[8px]"
        >
          See Add
        </Button>
        </div>
      </div>
    </div>
  );
}
