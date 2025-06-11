"use client";
import { useState, useEffect } from "react";
import Img from "../Image";
import { Plus } from "lucide-react";
import Button from "../Button";
import { useRouter, useSearchParams } from "next/navigation";
import BusinessLink from "../navbar/business.link";
import Link from "next/link";
import api from "@/services/api";
import { toast } from "react-toastify";

function BusinessCard({ biz, index }) {
  return (
   <div className="bg-white border mt-2 rounded-lg p-4 shadow">
        <div
          className="border-b last:border-b-0 border-gray-200 pb-4 mb-4 last:mb-0"
        >
          <div className="flex justify-between w-full mt-5 items-center text-[#000087]  gap-2 text-sm font-medium">
              <span className="font-[500] font-inter text-[14px]">Business {index + 1}</span>
               <Link href="/Editbusiness/[id]" as={`/Editbusiness/${biz._id}`}>
                  Edit
                </Link>
            </div>
         <div className="flex flex-col gap-1 mt-4">
          <div className="flex items-center gap-1">
          <Img 
            src="/brifecase-tick.svg"
           width={20}
          height={20}
         className="w-[20px] h-[20px]"
       />
        <p className="text-[#525252] font-[500] font-inter text-[14px]">
         {biz.businessName}
       </p>
     </div>
     <p className="text-sm text-[#555] leading-snug break-words whitespace-pre-wrap max-w-xs ml-2">
       {biz.aboutBusiness}
     </p>
    </div>

    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center gap-1">
       <div className="flex flex-col">
        {biz.addresses.map((addrObj, idx) => (
  <div key={addrObj._id || idx} className="mb-2">
    <p className="flex items-start text-[#525252] font-[500] text-[14px] font-inter mb-1">
      Address {idx + 1}
    </p>
    <div className="flex items-start gap-1 ml-4">
      <Img
        src="/location.svg"
        width={20}
        height={20}
        className="w-[20px] h-[20px]"
      />
      <span className="text-[#525252] text-[14px] font-[500] font-inter">
        {addrObj.address}
      </span>
    </div>
  </div>
))}
       </div>
     </div>
    </div>
   </div>
    </div>
  );
}


export default function AddBusiness() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

   
    useEffect(() => {
      const fetchBusinesses = async () => {
        try {
          const res = await api.get("/business/my-businesses");
          setBusinesses(res.data);
        } catch (err) { 
          if (err.response?.status === 404) {
            setBusinesses([]); // No businesses
          } else {
            toast.error("Failed to load businesses");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchBusinesses();
    }, [businessId]);

    if (loading) return <p className="text-center mt-20">Loading....</p>

    return (
     <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
      <BusinessLink />
      <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto">
          {businesses.length === 0 ? (
            <>
              <div className="mt-20">
                <Img
                  src="/postAds.svg"
                  width={158}
                  height={158}
                  className="mx-auto mb-4"
                  alt="No Business Post"
                />
              </div>
              <p className="text-[#868686] mt-2 font-inter font-medium md:text-[14px] text-center">
                No Business added yet
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/create-business")}
                  className="flex items-center gap-2 px-6 py-2 mt-5 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
                >
                  <Plus size={20} />
                  Add a business
                </Button>
              </div>
            </>
          ) : (
            <>
            <div className="flex flex-row justify-between items-center w-full gap-4 mb-4">
             <h2 className="text-[14px] text-[#525252] font-[500] font-inter whitespace-nowrap">Business Details</h2>
             <Button className="flex flex-row gap-2">
             <Img
              src="/add-circle.svg"
              alt="Add-Circle"
              width={20}
              height={20}
             className="md:w-[20px] md:h-[20px]" />
            <Link 
               href="/create-business"
              className="whitespace-nowrap text-[#000087] text-[14px] font-[400] font-inter">
                Add another business</Link>
           </Button>
          </div>
            {businesses.map((biz, index) => (
               <BusinessCard key={biz._id} biz={biz} index={index} />
            ))}
          </>
          )}
        </div>
      </div>
    </div>
    )
}