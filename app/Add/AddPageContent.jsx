"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Img from "../components/Image";
import Button from "../components/Button";
import api from "@/services/api";
import Link from "next/link"; 

export default function AddCarPostContent() {
  const [userAds, setUserAds] = useState(undefined); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized");
        setUserAds([]);
        return;
      }
      try {
        const res = await api.get("/carAdd/check-ad");
        setUserAds(res.data.ads || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setUserAds([]);
      }
    };
    fetchUserAds();
  }, []);

  return (
    <div className="p-4 md:p-8 rounded-[12px] bg-white shadow-phenom">
 {/* Loading state */}
  {userAds === undefined && (
  <div className="p-6 md:p-10 text-center rounded-lg">
    <span className="text-[#525252] text-sm md:text-base font-[500] font-inter">
       Loading your ads…
     </span>
    </div>
   )}

   {/* Error state */}
   {error && (
    <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
      <p className="text-red-500 text-sm md:text-base">{error}</p>
      <div className="mt-4">
        <Link href="/create-post-car" passHref>
          <Button
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]">
             <Plus size={20} /> Post an Ad
            </Button>
          </Link>
         </div>
       </div>
     )}

     {/* No ads state */}
      {userAds !== undefined && !error && userAds.length === 0 && 
      <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
         <Img
            src="/postAds.svg"
             width={158}
              height={158}
              className="mx-auto mb-4"
               alt="No Posts"
             />
             <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
             No ads posted yet
          </p>
         <div className="flex justify-center">
         <Link href="/create-add" passHref>
           <Button
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105" >
            <Plus size={20} /> Post an Ad
            </Button>
           </Link>
           </div>
          </div>
       }

    {/* Existing ads state */}
     {userAds !== undefined && !error && userAds.length > 0 && (
     <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
      <p className="font-[500] text-[#525252] font-inter text-sm md:text-base mb-4">
        You already have {userAds.length} ad{userAds.length > 1 ? "s" : ""}.
       </p>
      <div className="flex justify-center">
     <Link href="/create-add" passHref>
       <Button
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]" >
         <Plus size={20} /> Continue
        </Button>
         </Link>
        </div>
      </div>
     )}
    </div>
  );
}
