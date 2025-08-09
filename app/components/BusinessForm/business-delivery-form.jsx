"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import BusinessLink from "../navbar/business.link";
import Button from "../Button";
import { MoreVertical } from "lucide-react";
import Img from "../Image";
import api from "@/services/api";
import { toast } from "react-toastify";

export default function BusinessDeliveryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const addressId = searchParams.get("addressId");

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formStates, setFormStates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  // Fetch business data
  useEffect(() => {
    if (!businessId) return;

    const fetchBusiness = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        if (Array.isArray(res.data)) {
          const found = res.data.find((b) => b._id === businessId);
          if (found) {
            setBusiness(found);
            const initialStates = {};

            // Initialize form state for addresses where deliveryAvailable is true
            found.addresses.forEach((addr) => {
              if (addr.deliveryAvailable) {
                initialStates[addr._id] = {
                  explanation: addr.deliverySettings?.explanation || "",
                  dayFrom: addr.deliverySettings?.dayFrom || "",
                  daysTo: addr.deliverySettings?.daysTo || "",
                  chargeDelivery: addr.deliverySettings?.chargeDelivery || "",
                  feeFrom: addr.deliverySettings?.feeFrom || "",
                  feeTo: addr.deliverySettings?.feeTo || "",
                };
              }
            });

            setFormStates(initialStates);
            validateForm(initialStates);
          }
        }
      } catch (error) {
        console.error("Failed to fetch business:", error);
        toast.error("Could not load business data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  const handleChange = (id, field, value) => {
    const updatedState = {
      ...formStates,
      [id]: {
        ...formStates[id],
        [field]: value,
      },
    };
    setFormStates(updatedState);
    validateForm(updatedState);
  };

  const validateForm = (formState) => {
    const isFilled = (val) => 
        val !== undefined && 
        val !== null && 
        String(val).trim() !== "";

    if (addressId) {
      const settings = formState[addressId];
      const valid =
        settings &&
        isFilled(settings.explanation)&&
        isFilled(settings.dayFrom) &&
        isFilled(settings.daysTo) &&
        settings.chargeDelivery !== undefined &&
        isFilled(settings.feeFrom) &&
        isFilled(settings.feeTo);

      setSubmitEnabled(!!valid);
      return;
    }

    const anyValid = Object.values(formState).some((settings) => {
      return (
        isFilled(settings.explanation) &&
        isFilled(settings.dayFrom) &&
        isFilled(settings.daysTo) &&
        settings.chargeDelivery !== undefined &&
        isFilled(settings.feeFrom) &&
        isFilled(settings.feeTo)
      );
    });

    setSubmitEnabled(anyValid);
  };

const handleSubmit = async () => {
  if (!submitEnabled) return;
  setIsSubmitting(true);

  try {
    if (addressId) {
      // Single Address Update
      const settings = formStates[addressId];
      const payload = {
        deliverySettings: {
          explanation: settings.explanation?.trim() || "",
          dayFrom: Number(settings.dayFrom),
          daysTo: Number(settings.daysTo),
          chargeDelivery: settings.chargeDelivery,
          feeFrom: Number(settings.feeFrom),
          feeTo: Number(settings.feeTo),
        },
      };
      await api.patch(`/business/${businessId}/address/${addressId}`, payload);
      toast.success("Delivery settings updated successfully.");
    } else {
      // Multiple Addresses Update
      const updates = Object.entries(formStates)
        .filter(([_, settings]) => {
          return (
            typeof settings.explanation === "string" &&
            settings.explanation.trim() !== "" &&
            settings.dayFrom !== "" &&
            settings.daysTo !== "" &&
            settings.chargeDelivery !== undefined &&
            settings.feeFrom !== "" &&
            settings.feeTo !== ""
          );
        })
        .map(([id, settings]) => ({
          addressId: id,
          explanation: settings.explanation?.trim() || "",
          dayFrom: Number(settings.dayFrom),
          daysTo: Number(settings.daysTo),
          chargeDelivery: settings.chargeDelivery,
          feeFrom: Number(settings.feeFrom),
          feeTo: Number(settings.feeTo),
        }));

      if (updates.length === 0) {
        toast.error("Please fill all required fields for at least one address.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        deliverySettingsArray: updates,
      };

      await api.patch(`/business/${businessId}/addresses`, payload);
      toast.success("Business Delivery updated successfully");
    }

    // Redirect to Edit Delivery Page
    router.push(`/edit-delivery?businessId=${businessId}`);
  } catch (error) {
    console.error("Failed to update delivery settings:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) return <p>Loading...</p>;
  if (!business) return <p>Business not found.</p>;

  const deliveryAddresses = business.addresses.filter(
    (addr) => addr.deliveryAvailable
  );

  return (
    <div className="relative flex flex-col md:flex-row w-full gap-2 min-h-screen">
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
        <div className="bg-white shadow p-4 rounded-lg w-full max-w-[361px]">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => router.back()} className="flex gap-4 items-center">
              <ArrowLeftIcon className="h-5 w-5 text-[#141B34]" />
              <span className="text-[#525252] font-inter text-[14px] font-[500]">
                Go Back
              </span>
            </button>
          </div>
          <div className="flex flex-col items-start gap-2 mb-4">
            <h3 className="text-[#525252] text-[16px] font-[500] font-inter">
              {business.businessName}
            </h3>
          </div>

          {deliveryAddresses.map((addressObj) => (
            <div key={addressObj._id} className="border p-4 mb-6 rounded-md">
              {/* Checkbox and Address */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 mb-4 bg-white p-2 rounded">
             <div className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="w-4 h-4 accent-blue-600" />
            <label className="text-[#525252] text-[14px] font-inter whitespace-nowrap">Delivery Available</label>
          </div>
           <span className="block md:inline text-[#232323] text-[13px] font-inter leading-tight md:ml-2">
          {addressObj.address}
          </span>
          </div>


              {/* Delivery Explanation */}
            <div className="relative w-full mb-4">
            <span className="absolute top-1 left-3 text-[11px] sm:text-[12px] text-gray-500 font-medium z-10 leading-tight">
              Delivery Explanation
           </span>
          <textarea
            placeholder="e.g., We deliver only in Lagos"
            value={formStates[addressObj._id]?.explanation || ""}
            onChange={(e) =>
             handleChange(addressObj._id, "explanation", e.target.value)
           }
           className="w-full h-[100px] border border-[#CDCDD7] rounded px-3 pt-6 pb-2 bg-white focus:outline-none text-sm resize-none leading-tight sm:leading-normal text-[13px] sm:text-sm"
          />
        </div>

         {/* Days From-To */}
         <div className="mb-4">
          <label className="text-[#525252] text-[14px] font-[500] font-inter mb-1 block">
           Number of days it takes to be delivered
         </label>
         <div className="flex gap-3 sm:gap-4 flex-row">
           {["dayFrom", "daysTo"].map((field, i) => (
         <div className="relative flex-1 min-w-0" key={field}>
            <span className="absolute top-1 left-2 text-[11px] sm:text-[12px] text-[#525252] font-inter font-[400] leading-tight">
             {i === 0 ? "From" : "To"}
          </span>
          <input
            type="number"
            value={formStates[addressObj._id]?.[field] || ""}
            onChange={(e) =>
              handleChange(addressObj._id, field, e.target.value)
           }
            className="w-full pt-5 pr-10 pb-1 pl-2 border border-gray-300 rounded-md text-sm text-[13px] sm:text-sm focus:outline-none"
          />
          <span className="absolute right-2 bottom-1.5 text-gray-500 text-xs">
            days
         </span>
       </div>
         ))}
        </div>
       </div>

       {/* Charge Delivery Select */}
        <div className="relative w-full mb-4">
          <span className="absolute top-1 left-3 text-[10px] text-gray-500 font-medium">
              Do you charge for delivery?
           </span>
          <select
             value={formStates[addressObj._id]?.chargeDelivery || ""}
             onChange={(e) =>
                handleChange(addressObj._id, "chargeDelivery", e.target.value)
             }
             className="w-full h-[45px] border border-[#CDCDD7] rounded px-3 pt-5 focus:outline-none text-[12px] bg-white shadow font-inter text-[#525252]"
             >
             <option value="">Select an option</option>
             <option value="yes">Yes</option>
             <option value="no">No</option>
           </select>
          </div>

          {/* Fee From-To */}
          <div>
           <label className="text-[#525252] text-[14px] font-[500] font-inter mb-1 block">
            How much will the buyer pay for delivery fee
          </label>
        <div className="flex flex-row gap-3 sm:gap-4">
         {["feeFrom", "feeTo"].map((field, i) => (
         <div className="relative flex-1 min-w-0" key={field}>
           <span className="absolute top-1 left-2 text-[11px] sm:text-[12px] text-[#525252] font-inter font-[400]">
             {i === 0 ? "From" : "To"}
          </span>
          <input
            type="number"
            placeholder="₦ Enter Amount"
            value={formStates[addressObj._id]?.[field] || ""}
            onChange={(e) =>
              handleChange(addressObj._id, field, e.target.value)
            }
            className="w-full pt-5 pr-10 pb-1 pl-2 focus:outline-none border border-gray-300 rounded-md text-[13px] sm:text-sm"
          />
        </div>
       ))}
      </div>
     </div> 
     </div>
     ))}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!submitEnabled || isSubmitting}
              className={`flex justify-center items-center w-full md:w-[262px] gap-2 px-6 py-2 mt-5 rounded-[8px] text-white ${
                !submitEnabled || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA]"
              }`}
            >
              <Img src="/tick-circles.svg" alt="Save" width={20} height={20} />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}