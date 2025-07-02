"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Img from "../Image";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import BusinessLink from "../navbar/business.link";
import InputField from "../input";
import LocationModal from "../UI/locationModal";
import Button from "../Button";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

const AddressFields = ({ addresses, setAddresses }) => (
  <>
    {addresses.map((addr, index) => (
      <InputField
        key={index}
        label={index === 0 ? "Address" : `Address ${index + 1}`}
        value={addr}
        onChange={(e) => {
          const updated = [...addresses];
          updated[index] = e.target.value;
          setAddresses(updated);
        }}
      />
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


export default function EditBussinessPage() {
  const { id  } = useParams();
  const [business, setBusiness] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");
 const [showLocationModal, setShowLocationModal] = useState(false);
  const [addresses, setAddresses] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

 useEffect(() => {
  const fetchBusiness = async () => {
    try {
      const res = await api.get(`/business/getbusiness/${id}`, {
        withCredentials: true,
      });

      const data = res.data
      setBusiness(data);


      //Initialize from states 
      setBusinessName(data.businessName || "");
      setAboutBusiness(data.aboutBusiness || "");
      setLocation(data.location || "");

      if (Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else if (typeof data.addresses === "string") {
        setAddresses(
          data.addresses
            .split(/[,;]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr.length > 0)
        );
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error loading business:", err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchBusiness();
}, [id]);

  if (loading) return <p className="text-center mt-20">Loading....</p>;
  if (!business) return <p className="text-center mt-20">No business found</p>;

  const handleUpdateBusiness =  async () => {
    setSaving(true);

    try {
     const payload = {};

     if (businessName !== business.businessName) {
       payload.businessName = businessName;
     }

     if (aboutBusiness !== business.aboutBusiness) {
       payload.aboutBusiness = aboutBusiness;
     }

     if (location !== business.location) {
      payload.location = location;
     }

     // Check if addreses have changed 
     const currentAddresses = Array.isArray(business.addresses) ? business.addresses : [];
     const filteredNew = addresses.filter((a) => a.trim() !== "");
     const filteredOld = currentAddresses.filter((a) => a.trim() !== "");

     const addressesChanged = 
           filteredNew.length !== filteredOld.length || 
           filteredNew.some((addr, i) => addr !== filteredOld[i]);


    if (addressesChanged) {
      payload.addresses = filteredNew;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No Changes made to the business.");
      setSaving(false);
      return;
    }

     const res = await api.put(`business/editbusiness/${id}`, payload, {
      withCredentials: true
     });

     if (res.status === 200) {
      toast.success("Business updated successfully!");
      router.push("/Business");
     }
    } catch(error) {
      console.error("Error Updating business:", error);
      toast.error(error?.response?.data?.message || "Failed to update business. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const handleAddressChange = (idx, value) => {
    const newAddresses = [...addresses];
    newAddresses[idx] = value;
    setAddresses(newAddresses);
  }

  const addAddress = () => {
    setAddresses([...addresses, " "]);
  }

   const handleLocationSelect = ({ state: selectedState, lga }) => {
        setState(selectedState);
        setLocation(lga);
        setShowLocationModal(false);
    };

    return (
     <>
       <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
         <BusinessLink />
         <div className="flex-1">
           <div className="bg-white shadow p-4 rounded-lg h-auto">
            <div className="flex items-center gap-2 mb-4">
               <button onClick={() => router.push('/Business')}>
                  <ArrowLeftIcon className="h-5 w-5 text-[#141B34] cursor-pointer" />
               </button>
               <h2 className="text-[#525252] font-[500] font-inter md:text-[14px]">Edit Business</h2>
            </div>
            <div>
                <label htmlFor="businessName" className="flex items-start text-[#525252] text-[12px] font-[500] font-inter">Business Name</label>
               <InputField 
                 id="businessName"
                 type="text"
                 placeholder={business.businessName}
                 value={businessName}
                 className="placeholder-[#525252]"
                 onChange={(e) => setBusinessName(e.target.value)}
               />
            </div>
            <div>
              <textarea
                  placeholder={business.aboutBusiness}
                  value={aboutBusiness}
                  onChange={(e) => setAboutBusiness(e.target.value)}
                  className="w-full h-[120px] border-[1px] border-[#2C2CCD] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                >
                </textarea>
            </div>
            <div 
                onClick={() => setShowLocationModal(true)}
               className="w-full mt-2 h-[52px]
                      border border-[#CDCDD7] rounded-[4px]
                             flex justify-between items-center px-3 cursor-pointer">
                   <span className="text-[#525252]">{business.location}</span>
                   <Plus className="w-5 h-5 text-[#525252]" />
               </div>
               <AddressFields addresses={addresses} setAddresses={setAddresses} />
           </div>
            <div className="flex justify-center">
             <Button
               type="button"
               onClick={handleUpdateBusiness}
               disabled={saving}
               className={`flex items-center justify-center gap-2 px-6 py-2 mt-5 text-white rounded-[8px] 
               ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#00A8DF] to-[#1031AA]'}`}>
                {saving ? (
                  <span className="animate-pulse">Saving...</span>
               ) : (
            <>
              <Plus size={20} /> Save Changes
            </>
        )}
             </Button>
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
    );
}