"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState  } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import api from "@/services/api";
import BusinessLink from "../navbar/business.link";
import Link from "next/link";
import Img from "../Image";

export default function EditDeliveryForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");
    const addressId = searchParams.get("addressId");

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusiness = async () => {
          try {
            const res = await api.get("/business/my-businesses");
            const found = res.data.find((b) => b._id === businessId);
            setBusiness(found);
          } catch (error) {
            console.error("Error fetching business:", error);
          } finally {
            setLoading(false);
          }
        };

        if (businessId) fetchBusiness();
     }, [businessId]);

     if (loading) return <p>Loading...</p>
     if (!business) return <p>Business not found.</p>

     const deliveryAddresses = business.addresses.filter(
        (addr) => addr.deliveryAvailable
     );

    return (
     <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
       <BusinessLink />
       <div className="flex-1">
         <div className="bg-white shadow p-4 rounded-lg h-auto">
           <div className='flex items-center justify-between mb-6'>
             <span className="text-[#525252] text-[14px] font-[500] font-inter">
                {business.businessName}
             </span>
             <Link 
               href={`/create-business-delivery?businessId=${businessId}`}
               className="flex items-center text-[#000087] text-[14px] font-[500] font-inter hover:underline"
             >
              <PencilIcon className="w-4 h-4 mr-1" /> 
               Edit
             </Link>
           </div>
           {deliveryAddresses.length === 0 && (
            <p>No addresses have delivery enabled.</p>
           )}

           {deliveryAddresses.map((address) => (
             <div key={address._id} className="mb-4">
               <div className="flex items-center gap-4 justify-between mb-2">
                 <div className="flex items-center gap-2">
                  <Img 
                    src="/addressLoc.svg"
                    alt="Address Location"
                    width={11.67}
                    height={11.67}
                    className="w-[11.6px] h-[11.6px" />
                    <span className="text-[#868686] font-[400] font-inter text-[14px] whitespace-nowrap">
                        {address.address}
                    </span>
                </div>
              <div className="flex items-center gap-2 bg-[#F7F7FF]  rounded-[4px] whitespace-nowrap">
               <Img 
                src="/truck-remove.svg"
                width={16}
                height={16}
                className="w-[16px] h-[16px]" />
              <span className="text-[10px] font-inter font-[500] text-[#000087]">
               {address.deliveryAvailable
                ? `Delivery Available (${address.deliverySettings?.dayFrom || 'N/A'}–${address.deliverySettings?.daysTo || 'N/A'} days)`
               : "No Delivery"}
               </span>
             </div>
               </div>
               <div className="flex flex-col justify-start items-start gap-2">
                <p className="text-[#868686] font-[400] text-[14px] font-inter">
                  {address.deliverySettings.explanation || "-"}
                </p>
                {address.deliverySettings.feeFrom !== undefined && 
                 address.deliverySettings.feeTo !== undefined && 
                   <div className="text-[#868686] font-[400] font-inter text-[14px]">
                     <strong className="ml-2">Fee:</strong>
                      ₦{address.deliverySettings.feeFrom.toLocaleString()} -{" "}
                      ₦{address.deliverySettings.feeTo.toLocaleString()}
                   </div>
                 }
              </div>
             </div>
           ))}
         </div>
       </div>
     </div>
    )
}