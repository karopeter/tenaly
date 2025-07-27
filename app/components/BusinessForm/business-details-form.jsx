"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { MoreVertical } from "lucide-react";
import BusinessLink from "../navbar/business.link";
import Img from "../Image";
import api from "@/services/api";
import { toast } from "react-toastify";

export default function AddBusinessDetailsForm() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const businessId = searchParams.get("businessId");
   const [businesses, setBusinesses] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const [selectedAddresses, setSelectedAddresses] = useState({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!businessId) return;

      try {
        const res = await api.get("/business/my-businesses");
        if (Array.isArray(res.data)) {
          setBusinesses(res.data);

          // Initialize Selected Address with empty objects for each business 
          const initialSelection = {};
          res.data.forEach((business) => {
            initialSelection[business._id] = {};
          });
          setSelectedAddresses(initialSelection);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        toast.error("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [businessId]);

  // Handle Checkbox change
  const handleCheckboxChange = async (businessId, addressIndex, isChecked) => {
  const business = businesses.find(b => b._id === businessId);
  if (!business || !business.addresses[addressIndex]) return;

  try {
    await api.patch(
      `/business/toogle-delivery-availiability/${businessId}/${addressIndex}`,
      {
        deliveryAvailable: isChecked
      }
    );

    // Update frontend state
    setSelectedAddresses(prev => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        [addressIndex]: isChecked
      }
    }));

    toast.success("Delivery availability updated!");

    // Redirect
    router.push(`/create-business-delivery?businessId=${businessId}`);

  } catch (error) {
    console.error("Failed to update delivery status:", error);
    toast.error("Failed to update delivery status");
  }
};

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
        <div className="bg-white shadow p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <button
              className="flex gap-4 items-center"
              onClick={() => router.push('/BusinessDelivery')}
            >
              <ArrowLeftIcon className="h-5 w-5 text-[#141B34] cursor-pointer" />
              <span className="text-[#525252] font-inter text-[14px] font-[500]">Go Back</span>
            </button>
          </div>

          {loading ? (
            <p>Loading businesses...</p>
          ) : businesses.length === 0 ? (
            <p>No business found. Please add one.</p>
          ) : (
           <div className="space-y-4">
           {businesses.map((business) => (
         <div key={business._id}>
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-[#232323] text-[16px] font-[500] font-inter">{business.businessName}</h3>
        <ul className="space-y-1 w-full">
          {business.addresses.map((addressObj, index) => (
            <li
              key={addressObj._id}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1 w-full"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`delivery-${business._id}-${index}`}
                  checked={!!selectedAddresses[business._id]?.[index]}
                  onChange={(e) => handleCheckboxChange(business._id, index, e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <label
                  htmlFor={`delivery-${business._id}-${index}`}
                  className="text-[#525252] font-[400] text-[14px] font-inter"
                >
                  Delivery Available
                </label>
              </div>

              <span className="text-[12px] text-[#232323] font-[400] font-inter sm:ml-auto sm:text-right">
                {addressObj.address}
              </span>
            </li>
          ))}
          </ul>
        </div>
       </div>
      ))}
    </div>
   )}
   </div>
   </div>
   </div>
  );
}