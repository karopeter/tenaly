"use client";
import { useState, useEffect } from "react";
import Button from "../Button";
import Img from "../Image";
import { Plus, MoreVertical } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import BusinessLink from "../navbar/business.link";
import { toast } from "react-toastify";

import BusinessDetailsList from "../business/businessDetailsList";

export default function AddBusinessDetails() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "same";
    const businessId = searchParams.get("businessId");
    const [businessDetails, setBusinessDetails] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const fetchBusinesses = async () => {
         try {
            const res = await api.get("/business/my-businesses");
            setBusinesses(res.data);
            setLoading(false);
         } catch (err) {
           if (err.response?.status === 404) {
            setBusinesses([]);
           } else {
            toast.error("Failed to load businesses");
           }
         } finally {
            setLoading(false);
         }
      };

      fetchBusinesses();
    }, []);

    const handleAddDeliveryClick = (biz) => {
        const addresses = biz.addresses || [];
        if (addresses.length === 0) {
          toast.warn("This business has no address. Please add an address first");
          return;
        }

        const mode = addresses.length === 1 ? "same" : "different";

        router.push(`/add-business-details?businessId=${biz._id}&mode=${mode}`);
    }

    if (loading) return <p className="text-center mt-20">Loading....</p>

    
    return (
      <div className="relative flex flex-col md:flex-row w-full gap-2 min-h-screen mt-10">
       {/* Desktop sidebar */}
       <div className="hidden md:block">
          <BusinessLink />
       </div>

       {/* Mobile: 3 dots button on top-right of the card */}
       <div className="absolute top-0 right-4 z-30 md:hidden">
         <button
           onClick={() => setShowMobileMenu(!showMobileMenu)}
           className="p-1"
           aria-label="Toggle menu">
             <MoreVertical size={22} />
         </button>
       </div>

       {/* Mobile menu Dropdown */ }
       {showMobileMenu && (
         <div className="absolute top-10 left-0 w-full bg-white z-20 shadow-md p-4 md:hidden">
           <BusinessLink />
        </div>
       )}
        <div className="flex-1 px-4 md:px-0 mt-10 md:mt-0">
          <div className="bg-white shadow p-4 rounded-lg w-full">
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
                   <p className="text-[#868686] mt-2 font-inter font-medium md:text-[14px] text-center]">
                      You can't add delivery option because 
                      <br className="hidden md:block" />
                      you haven't added a business yet
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
              ): (
                 <BusinessDetailsList businesses={businesses} onAddDeliveryClick={handleAddDeliveryClick} />
              )}
          </div>
        </div>
      </div>
    )
}