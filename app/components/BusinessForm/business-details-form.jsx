"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Button from "../Button";
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

// const handleSave = async () => {
//   const patchRequests = [];

//   businesses.forEach((business) => {
//     const addressSelections = selectedAddresses[business._id] || {};

//     Object.entries(addressSelections).forEach(([indexStr, isChecked]) => {
//       const index = parseInt(indexStr);
//       const address = business.addresses[index];

//       if (!address) return;

//       patchRequests.push(
//         api.patch(`/business/toogle-delivery-availiability/${business._id}/${index}`, {
//           addresses: [
//             {
//               address: address.address,
//               deliveryAvailable: isChecked,
//             },
//           ],
//         })
//       );
//     });
//   });

//   if (patchRequests.length === 0) {
//     toast.warn("Please select at least one address for delivery.");
//     return;
//   }

//   try {
//     await Promise.all(patchRequests);
//     toast.success("All delivery availability settings saved!");
//     router.push("/add-delivery");
//   } catch (error) {
//     console.error("Error saving delivery options:", error);
//     toast.error("Failed to save one or more delivery settings");
//   }
// };

  // Handle Checkbox change
  const handleCheckboxChange = async (businessId, addressIndex, isChecked) => {
  const business = businesses.find(b => b._id === businessId);
  if (!business || !business.addresses[addressIndex]) return;

  try {
    // Send PATCH with deliveryAvailable directly
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
//   const handleCheckboxChange = async (businessId, addressIndex, isChecked) => {
//   const addressObj = businesses.find(b => b._id === businessId)?.addresses[addressIndex];
//   if (!addressObj) return;

//   try {
//     // Update backend with new deliveryAvailable state
//     await api.patch(`/business/toogle-delivery-availiability/${businessId}/${addressIndex}`, {
//       addresses: [{
//         address: addressObj.address,
//         deliveryAvailable: isChecked
//       }]
//     });

//     // Update frontend checkbox state
//     setSelectedAddresses(prev => ({
//       ...prev,
//       [businessId]: {
//         ...prev[businessId],
//         [addressIndex]: isChecked
//       }
//     }));

//      toast.success("Delivery Availability successfully Added!");

//     // Redirect to delivery setup page
//     router.push(`/create-business-delivery?businessId=${businessId}`);

//   } catch (error) {
//     toast.error("Failed to update delivery status");
//   }
// };


  // Check if any checkbox is checked 
  // const isAnyAddressSelected = Object.values(selectedAddresses).some(
  //    (addresses) => Object.values(addresses).includes(true)
  // );

  return (
    <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
      <BusinessLink />
      
      <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto">
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

                     <ul className="space-y-1">
                       {business.addresses.map((addressObj, index) => (
                        <li key={addressObj._id} className="flex items-center gap-4">
                         {/* Checkbox + Delivery Available */}
                         <input 
                           type="checkbox"
                           id={`delivery-${business._id}-${index}`}
                          checked={!!selectedAddresses[business._id]?.[index]}
                           onChange={(e) => handleCheckboxChange(business._id, index, e.target.checked)}
                           className="w-4 h-4 accent-blue-600 mb-1"
                         />
                         <label 
                           htmlFor={`delivery-${business._id}-${index}`} 
                          className="text-[#525252] font-[400] text-[14px] font-inter">
                            Delivery Available
                         </label>

                         <span className="ml-auto text-right text-[12px] text-[#232323] font-[400] text-[12px] font-inter">
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

         {/* <div className="flex justify-center mt-4">
          <Button 
          onClick={handleSave}
             type="button"
             disabled={!isAnyAddressSelected}
             className={`flex justify-center items-center md:w-[262px] gap-2 px-6 py-2 mt-5 rounded-[8px] ${
                isAnyAddressSelected
                  ? 'bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white'
                  : 'bg-[#EDEDED] border border-[#EDEDED] text-[#CDCDD7] cursor-not-allowed'
              }`}>
              <Img
                src="/tick-circles.svg"
                alt="Save"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
             Save
           </Button>
        </div> */}
        </div>
      </div>
    </div>
  );
}