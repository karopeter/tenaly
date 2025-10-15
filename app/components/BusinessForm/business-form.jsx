"use client";
import { useState, useEffect } from "react";
import BusinessLink from "../navbar/business.link";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Button from "../Button";
import InputField from "../input";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical, Loader2, X } from "lucide-react"; // Import X for the remove icon
import LocationModal from "../UI/locationModal";
import api from "@/services/api";
import { toast } from "react-toastify";

const AddressFields = ({ addresses, setAddresses }) => {
  // Function to remove an address by index
  const removeAddress = (indexToRemove) => {
    setAddresses(addresses.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      {addresses.map((addr, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1">
            <InputField
              label={index === 0 ? "Address" : `Address ${index + 1}`}
              placeholder="24, Shola Martins Street, Ajah Lagos"
              value={addr}
              onChange={(e) => {
                const updated = [...addresses];
                updated[index] = e.target.value;
                setAddresses(updated);
              }}
            />
          </div>
          {/* Only show the remove button for addresses after the first one */}
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeAddress(index)}
              className="mt-6 p-2 rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Remove address"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}
      <div
        onClick={() => setAddresses([...addresses, ""])}
        className="flex items-center gap-2 cursor-pointer mt-2 text-[#1031AA] hover:underline"
      >
        <Plus size={16} />
        <span>Add another address</span>
      </div>
    </>
  );
};

export default function BusinessForm({ initialData, isEditMode, businessId, mode}) {
    const router = useRouter();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [aboutBusiness, setAboutBusiness] = useState("");
    const [state, setState] = useState("");
    const [lga, setLga] = useState("");
    const [location, setLocation] = useState("Choose location");
    const [addresses, setAddresses] = useState([""]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [businessHours, setBusinessHours] = useState(initialData?.businessHours || []);

    useEffect(() => {
      if (initialData) {
        setBusinessName(initialData.businessName || "");
        setAboutBusiness(initialData.aboutBusiness || "");
        setLocation(initialData.location || "");
        setAddresses(initialData.addresses || [""]);
        setBusinessHours(initialData.businessHours || []);
      }
    }, [initialData]);
  
    const handleLocationSelect = ({ state: selectedState, lga }) => {
        setState(selectedState);
        setLga(lga);
        setLocation(`${selectedState}, ${lga}`);
        setShowLocationModal(false);
    };

    const handleSubmit = async () => {
      if (!businessName || !aboutBusiness || !state || !lga || addresses.some(addr => !addr.trim())) {
        toast.error("Please complete all fields and at least one address");
        return;
      }
      
      setLoading(true); 

      try {
        const res = await api.post("/business/add-business", {
          businessName,
          aboutBusiness,
          location,
          addresses
        });
        toast.success("Business added successfully!");
        router.push("/BusinessHours");
      } catch(err) {
        console.error("Add business error:", err);
        
        if (err.response?.status === 409) {
          toast.error("You already created a business with this name.");
        } else if (err.response?.status === 400) {
          toast.error("All fields are required.");
        } else {
          const message = err.response?.data?.message || "Failed to add business";
          toast.error(message);
        }
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    }
  
    return (
      <>
      {/* Add a simple spinner animation style */}
      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="relative flex flex-col md:flex-row w-full gap-2 min-h-screen md:mt-4">
        {/* Desktop sidebar */ }
        <div className="hidden md:block">
            <BusinessLink />
        </div>

        {/* Mobile 3 dots button on top right of the card */ }
        <div className="absolute top-0 right-4 z-30 md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1"
            aria-label="Toggle menu">
              <MoreVertical size={22} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */ }
        {showMobileMenu && (
          <div className="absolute top-10 left-0 w-full bg-white z-20 shadow-md p-4 md:hidden">
             <BusinessLink />
         </div>
        )}
        <div className="flex-1 md:px-4 md:px-0 mt-10 md:mt-0">
          <div className="bg-white md:border md:border-[#EDEDED] p-4 rounded-lg h-auto">
             <div className="flex items-center gap-2 mb-4">
              <button onClick={() => router.push('/Business')}>
                <ArrowLeftIcon className="h-5 w-5 text-[#141B34] cursor-pointer" />
              </button>
              <h2 className="text-[#525252] font-[500] font-inter md:text-[14px]">Add new business</h2>
             </div>
             <div>
                <InputField 
                  label="Business Name"
                  placeholder="Golibe Enterprise"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <textarea
                  placeholder="About Business"
                  value={aboutBusiness}
                  onChange={(e) => setAboutBusiness(e.target.value)}
                  className="w-full h-[120px] border-[1px] mt-5 border-[#2C2CCD] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                >
                </textarea>
               <div 
                 onClick={() => setShowLocationModal(true)}
                 className="w-full mt-2 h-[52px]
                   border border-[#CDCDD7] rounded-[4px]
                   flex justify-between items-center px-3 cursor-pointer">
                   <span className="text-[#525252]">
                     {state && lga ? `${state}, ${lga}` : location}
                   </span>
                   <Plus className="w-5 h-5 text-[#525252]" />
               </div>
               <AddressFields addresses={addresses} setAddresses={setAddresses} />
               <div className="flex justify-center">
                 <Button
                   type="button"
                   onClick={handleSubmit}
                   // Disable the button while loading
                   disabled={loading}
                   className={`flex items-center gap-2 px-6 py-2 mt-5 text-white rounded-[8px] ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA]"
                   }`}
                 >
                   {/* Conditionally render the spinner or the plus icon */}
                   {loading ? (
                     <>
                      <Loader2 size={20} className="spinner" />
                      Adding...
                     </>
                   ) : (
                     <>
                      <Plus size={20} />
                      Add a business
                     </>
                   )}
                </Button>
               </div>
             </div>
          </div>
        </div>
      </div>
      {showLocationModal && (
        <LocationModal 
          isOpen
          onClose={() => setShowLocationModal(false)}
          onSelectLocation={handleLocationSelect}
        />
      )}  
      </>
    )
}