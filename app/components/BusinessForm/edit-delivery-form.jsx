"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState  } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import api from "@/services/api";
import { MoreVertical } from "lucide-react";
import BusinessLink from "../navbar/business.link";
import Link from "next/link";
import Img from "../Image";

export default function EditDeliveryForm() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");
    const addressId = searchParams.get("addressId");

    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

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
     <div className="relative flex flex-col md:flex-row w-full gap-2 min-h-screen mt-10">
       <div className="hidden md:block">
         <BusinessLink />
       </div>

       {/* Mobile: 3 dots button on top-right of the card */ }
       <div className="absolute top-0 right-4 z-30 md:hidden">
         <button
           onClick={() => setShowMobileMenu(!showMobileMenu)}
           className="p-1"
           aria-label="Toogle menu">
            <MoreVertical size={22} />
         </button>
       </div>

       {/* Mobile Menu Dropdown */ }
       {showMobileMenu && (
         <div className="absolute top-10 left-0 w-full bg-white z-20 shadow-md p-4 md:hidden">
            <BusinessLink />
         </div>
       )}
       <div className="flex-1 px-4 md:px-0 mt-10 md:mt-0">
         <div className="bg-white shadow p-4 rounded-lg h-auto md:h-[429px]">
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
  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 justify-between mb-2">
    
    {/* Address Row */}
    <div className="flex items-start gap-2 w-full xs:w-auto">
      <Img 
        src="/addressLoc.svg"
        alt="Address Location"
        width={11.67}
        height={11.67}
        className="w-[11.6px] h-[11.6px]" 
      />
      <span className="text-[#868686] font-[400] font-inter text-[14px] break-words leading-snug">
        {address.address}
      </span>
    </div>

    {/* Delivery Status Box */}
    <div className="flex items-center gap-2 bg-[#F7F7FF] rounded-[4px] px-2 py-1 w-fit max-w-full">
      <Img 
        src="/truck-remove.svg"
        width={16}
        height={16}
        className="w-[16px] h-[16px]" 
      />
      <span className="text-[10px] font-inter font-[500] text-[#000087] leading-tight">
        {address.deliveryAvailable
          ? `Delivery Available (${address.deliverySettings?.dayFrom || 'N/A'}–${address.deliverySettings?.daysTo || 'N/A'} days)`
          : "No Delivery"}
      </span>
    </div>
  </div>

  {/* Explanation + Fee */}
  <div className="flex flex-col justify-start items-start gap-2">
    <p className="text-[#868686] font-[400] text-[14px] font-inter leading-snug">
      {address.deliverySettings.explanation || "-"}
    </p>
    {address.deliverySettings.feeFrom !== undefined && 
      address.deliverySettings.feeTo !== undefined && (
        <div className="text-[#868686] font-[400] font-inter text-[14px]">
          <strong className="mr-1">Fee:</strong>
          ₦{address.deliverySettings.feeFrom.toLocaleString()} - ₦{address.deliverySettings.feeTo.toLocaleString()}
        </div>
    )}
  </div>
</div>

           ))}
         </div>
       </div>
     </div>
    )
}