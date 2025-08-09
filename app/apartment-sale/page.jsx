"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import InputField from "../components/input";
import Select from "../components/clientOnlySelect";
import Img from "../components/Image";
import { toast } from "react-toastify";
import api from "@/services/api";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import { 
   apartmentForSaleOptions, 
   apartmentForSaleOwnershipStatusOptions, 
   apartmentRentBathroomsOptions, 
   apartmentRentBedroomNumberOptions, 
   apartmentRentOptions, 
   apartmentRentToiletOptions, 
   furnishingOptions, 
   ownershipStatusOptions,
    parkingSpaceOptions, 
    propertyConditionOptions, 
    propertyDurationOptions, 
    propertyFacilities, 
    serviceChargeOptions
  } from "../lib/propertyData";
  import { useAuth } from "../context/AuthContext";
import { negotiationOptions } from "../lib/carData";
import FreePropertySuccessModal from "../components/free-property-sucess-modal";


const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#000087' : '#d1d5db', // Tailwind: border-gray-300
    boxShadow: state.isFocused ? '0 0 0 1px #000087' : 'none',
    '&:hover': {
      borderColor: '#000087',
    },
    borderRadius: '0.375rem', 
    minHeight: '2.75rem',    
    fontSize: '0.875rem',   
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? '#000087'
      : isFocused
      ? '#e5e7eb' 
      : 'white',
    color: isSelected ? 'white' : '#111827', 
    fontSize: '0.875rem', 
    padding: '0.5rem 0.75rem', 
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    marginTop: '0.25rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    zIndex: 10,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#6b7280', 
    fontSize: '0.875rem',
  }),
};


export default function MorePropertyPost() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("");
  const [parking, setParking] = useState("");
  const [squareMeter, setSquareMeter] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [ownershipStatus, setOwnerShipStatus] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceFees, setServiceFees] = useState("")
  const [propertyFacility, setPropertyFacilities] = useState("");
  const [propertyDuration, setPropertyDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
  const [numberofBathrooms, setNumberOfBathrooms] = useState("");
  const [numberOfToilet, setNumberOfToilet] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessOptions, setBusinessOptions] = useState([]);
  const [business, setBusiness] = useState("");
  const [titleDocuments, setTitleDocuments] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hasPromoted, setHasPromoted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);

  // New state to track if the component has mounted 
  const [mounted, setMounted] = useState(false);
  
  const { profile, token, login } = useAuth();

  const router = useRouter();
  const handleGoBack  = () => router.back();

  // Set mounted to true after the component has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

   useEffect(() => {
      let timeout;
      if (showModalPromote) {
        timeout = setTimeout(() => {
          setShowModalPromote(false);
        }, 1200000);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, [showModalPromote]);

    useEffect(() => {
      if (!mounted) {
        return;
     }
  
     const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        const options = res.data.map((b) => ({
          label: b.businessName,
          value: b._id,
        }));
        setBusinessOptions(options);
        console.log("Fetched Business Options:", options);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
        toast.error("Failed to load business categories.");
      }
    };
  
    const loadPaystack = () => {
          return new Promise((resolve, reject) => {

           if (typeof window !== 'undefined' && window.PaystackPop) {
              resolve();
              return;
            }
    
            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v1/inline.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject("Failed to load Paystack script");
            if (typeof document !== 'undefined') {
              document.body.appendChild(script);
            }
          });
        };
    
        fetchBusinesses();
        loadPaystack().catch(error => {
          console.error(error);
          toast.error("Failed to load payment gateway script.");
        });
  }, [mounted]);

  useEffect(() => {
    // This effect should also ideally run only client-side if it relies on auth context
    // that might not be fully initialized or consistent during SSR.
    if (!mounted) {
      return;
    }

    const revalidateProfile = async () => {
      if (token) {
        try {
          const profileRes = await api.get("/profile");
          login(profileRes.data, token);
          console.log("MoreAddPost: Profile revalidated from backend:", profileRes.data);
        } catch (error) {
          console.error("MoreAddPost: Failed to revalidate profile on mount:", error);
          toast.error("Failed to load latest user profile for ad posting checks.");
        }
      }
    };

    revalidateProfile();
  }, [token, login, mounted]); 

const planDetails = {
  basic: { name: "Basic", amount: 15000, image: "/basic.svg" },
  premium: { name: "Premium", amount: 30000, image: "/premium-plan.svg" },
  vip: { name: "VIP", amount: 45000, image: "/medal-star.svg" },
  diamond: { name: "Diamond", amount: 60000, image: "/diamonds.svg" },
  enterprise: { name: "Enterprise", amount: 100000, image: "/crown3.svg" }
 };

   const buildPayload = (planType) => ({
    propertyName,
    propertyAddress,
    propertyType,
    furnishing,
    propertyCondition,
    propertyFacilities,
    parking,
    squareMeter,
    ownershipStatus,
    serviceCharge,
    numberOfBedrooms,
    numberofBathrooms,
    numberOfToilet,
    titleDocuments,
    serviceFees,
    amount,
    negotiation,
    businessCategory: business,
    description,
    plan: planType
  });

   const submitAd = useCallback(async (planToSubmit) => {
    try {
      const payload = { ...buildPayload(planToSubmit) };

      if (planToSubmit !== "free") {
        const planAmounts = { // Renamed to avoid conflict with outer planDetails
          basic: 15000,
          premium: 30000,
          vip: 45000,
          diamond: 60000,
          enterprise: 100000,
        };
        payload.promotionAmount = planAmounts[planToSubmit];
        if (!payload.promotionAmount || payload.promotionAmount <= 0) {
          toast.error("Invalid promotion amount for selected plan.");
          return;
        }
      } else {
        payload.promotionAmount = 0;
      }

      const res = await api.post("/property/create-commercial-rent", payload);

      // CRITICAL LOGIC FOR REDIRECTION
      if (res.data.data && res.data.data.paymentUrl) {
        toast.info("Redirecting to Paystack for payment...");
        setShowModalPromote(false);
        window.location.href = res.data.data.paymentUrl;
      } else if (res.data.data && res.data.data.paymentStatus === 'success') {
        toast.success(res.data.message || "Ad posted successfully using your existing plan!");
        router.push('/view-property-add');
        setShowModalPromote(false);
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } else if (res.data.data && res.data.data.paymentStatus === "free") {
        toast.success(res.data.message || "Free ad posted successfully!");
        setShowModalPromote(false);
        setShowFreeCommercialPropertyModal(true); // Corrected state setter
      } else {
        toast.success(res.data.message || "Ad posted successfully");
        console.warn("Unexpected successful ad submission response. Response:", res.data);
        setShowFreeCommercialPropertyModal(true); // Corrected state setter
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      }
    } catch (error) {
      console.error("Ad submission error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Something went wrong posting your ad. Please try again.");
    }
  }, [propertyName, propertyAddress, propertyType, furnishing, propertyCondition, propertyFacilities, parking, squareMeter, ownershipStatus, serviceCharge, numberOfBedrooms, numberofBathrooms, numberOfToilet, titleDocuments, serviceFees, amount, negotiation, business, description, token, login, router]); // Added router to dependencies

   const postAdForFree = useCallback(async () => {
    await submitAd("free");
  }, [submitAd]);


  const promoteAd = useCallback(async () => {
    await submitAd(selectedPlan);
  }, [selectedPlan, submitAd]);

 
   const handlePost = useCallback(async () => {
      if (!profile) {
        toast.error("You need to be logged in to post an ad.");
        return;
      }
  
      const hasAnySuccessfulPaidPlan = profile.paidPlans?.some(p => p.status === "success");
  
      console.log("Current profile in handlePost (on button click):", profile);
      console.log("Has any successful paid plan (on button click):", hasAnySuccessfulPaidPlan);
  
      if (hasAnySuccessfulPaidPlan) {
        await submitAd(selectedPlan);
      } else {
        setShowModalPromote(true);
      }
    }, [profile, selectedPlan, submitAd]);


  // Helper function for plan selection in the modal
  const onPlanSelect = (plan) => {
    setSelectedPlan(plan);
  };
  
    return (
      <>
    <div className="px-4 md:px-[104px] mt-20 md:mt-40">
  <div className="flex flex-col md:flex-row gap-10">
    <Sidebar />

    <main className="flex-1">
      <div className="bg-white shadow-phenom rounded-[12px] p-6 md:p-10">
        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
          <span className="text-[#525252] font-[500] text-[14px] font-inter">Go Back</span>
        </button>

        {/* Heading */}
        <h3 className="text-[#525252] font-[500] font-inter text-[16px] md:text-[18px] mt-4 mb-6 text-left md:text-center">
          House and Apartment for Sale
        </h3>

        {/* Form */}
        <form className="space-y-6">
          {/* Section 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title" placeholder="Enter name of the property" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
            <InputField label="Address" placeholder="Enter the address" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
          </div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Property Type" value={propertyType} onChange={setPropertyType} options={apartmentRentOptions} />
            <PostDropdown label="Furnishing" value={furnishing} onChange={setFurnishing} options={furnishingOptions} />
          </div>

          {/* Section 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Property Condition" value={propertyCondition} onChange={setPropertyCondition} options={propertyConditionOptions} />
            <PostDropdown label="Parking Space" value={parking} onChange={setParking} options={parkingSpaceOptions} />
          </div>

          {/* Section 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Square Meters (sqm)" placeholder="Enter" value={squareMeter} onChange={(e) => setSquareMeter(e.target.value)} />
            <PostDropdown label="Ownership" value={ownershipStatus} onChange={setOwnerShipStatus} options={ownershipStatusOptions} />
          </div>

          {/* Section 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Property Facilities" value={propertyFacility} onChange={setPropertyFacilities} options={propertyFacilities} />
            <PostDropdown label="Bedrooms" value={numberOfBedrooms} onChange={setNumberOfBedrooms} options={apartmentRentBedroomNumberOptions} />
          </div>

          {/* Section 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Bathrooms" value={numberofBathrooms} onChange={setNumberOfBathrooms} options={apartmentRentBathroomsOptions} />
            <PostDropdown label="Toilets" value={numberOfToilet} onChange={setNumberOfToilet} options={apartmentRentToiletOptions} />
          </div>

          {/* Section 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Title Documents" value={titleDocuments} onChange={setTitleDocuments} options={apartmentForSaleOptions} />
            <PostDropdown label="Ownership Status" value={ownershipStatus} onChange={setOwnerShipStatus} options={apartmentForSaleOwnershipStatusOptions} />
          </div>

          {/* Service Charge Section */}
          <div className="bg-[#FAFAFA] p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PostDropdown label="Service Charge?" value={serviceCharge} onChange={setServiceCharge} options={serviceChargeOptions} />
               <PostDropdown label="Open to Negotiation?" value={negotiation} onChange={setNegotiation} options={negotiationOptions} />
            </div>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostDropdown label="Duration" value={propertyDuration} onChange={setPropertyDuration} options={propertyDurationOptions} />
            <InputField label="Amount" placeholder="₦ | Enter your amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          {/* Business and Negotiation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="business" className="block text-[#525252] font-[500] font-inter mb-1">Select your business</label>
              <Select
                options={businessOptions}
                value={businessOptions.find((opt) => opt.value === business)}
                onChange={(selected) => setBusiness(selected?.value)}
                placeholder="Select a business"
                isClearable
                styles={customStyles}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-[#525252] font-[500] font-inter">Description</label>
            <textarea
              className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
              placeholder="Enter the description of this property"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              onClick={handlePost}
              className="w-full md:w-[262px] h-[44px] rounded-[8px] font-[500] text-[14px] text-white bg-gradient-to-r from-[#00A8DF] to-[#1031AA]"
            >
              Post Ad
            </Button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="text-center mt-6 font-[400] font-inter text-[12px]">
          <p className="text-[#767676]">
            By clicking on Post Ad, you accept the
            <span className="text-[#000087]"> Terms of Use,</span> agree to abide by the Safety Tips,
            <br />
            and confirm this posting does not include any Prohibited items.
          </p>
        </div>
      </div>
    </main>
  </div>
</div>


      {mounted && (
            <>
               {showModalPromote && (
                             <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-40 z-50">
                               <div className="bg-white p-6 rounded-[24px] shadow-lg max-w-md mx-4 p-6 w-full md:h-[600px]">
                                 <h2 className="text-[#525252] text-center font-[500] font-inter text-[18px]">Boost Your Ad for More Views</h2>
                                 <p className="text-[#767676] font-[400] font-inter text-[14px]">
                                   Get up to 5x more visibility by promoting your ad.
                                   <br className="hidden-xs" />
                                   Choose from our affordable plans.
                                 </p>
                           
                                   <div className="text-center mt-4">
                                           <h4 className="text-[#525252] text-[16px] font-[500] font-inter mb-4">Promote your Ad</h4>
                                           <p className="text-[#767676] text-[12px] font-[400] font-inter mb-6">
                                             You have reached your limit of free ad posting in vehicles
                                           </p>
                           
                                           {Object.keys(planDetails).map((plan) => (
                                           <div
                                             key={plan}
                                            onClick={() => onPlanSelect(plan)}
                                           className={`max-w-md mx-auto border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                           selectedPlan === plan
                                            ? "border-[#000087] bg-[#F7F7FF]"
                                            : "border-[#EDEDED] hover:border-[#000087] hover:bg-gray-50"
                                          }`}>
                                         <label htmlFor={plan} className="flex items-center gap-3 flex-1 cursor-pointer">
                                           <div
                                             id={plan}
                                             className={`w-5 h-5 border rounded flex items-center justify-center flex-shrink-0 ${
                                             selectedPlan === plan ? "border-[#000087]" : "border-[#EDEDED]"
                                            }`}>
                                           {selectedPlan === plan && (
                                             <Img
                                              src="/icon-check.svg"
                                              alt="Check"
                                              width={4}
                                              height={4}
                                              className="w-4 h-4"
                                            />
                                           )}
                                         </div>
                           
                                       <div className="w-8 h-8 flex-shrink-0">
                                         <Img
                                           src={planDetails[plan].image}
                                           width={67}
                                           height={67}
                                           alt={`${plan} plan`}
                                           className="w-full h-full object-contain"
                                         />
                                       </div>
                           
                                        <span className="text-[#525252] font-inter font-[500] text-sm truncate">
                                           {plan.charAt(0).toUpperCase() + plan.slice(1)}
                                         </span>
                                       </label>
                           
                                     <div className="text-right ml-4">
                                       <span className="text-[#525252] font-inter font-[500] text-sm">
                                         ₦{planDetails[plan].amount.toLocaleString()}
                                       </span>
                                        </div>
                                       </div>
                                       ))}
                                     </div>
                           
                                     <div className="mt-6 flex justify-center gap-2 items-center">
                                        <Button 
                                           onClick={postAdForFree} className="md:w-[121px] md:h-[52px] md:rounded-[8px] 
                                             md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] border border-[#CDCDD7]
                                             font-[500] md:text-[14px] text-[#525252]">
                                           No, Post for free
                                        </Button>
                                        <Button 
                                          onClick={promoteAd} className="md:w-[241px] md:h-[52px] md:rounded-[8px] 
                                             md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
                                             font-[500] md:text-[14px]  text-[#CDCDD7] 
                                             bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                                           Yes, promote my ad
                                       </Button>
                                     </div>
                               </div>
                             </div>
                         )}
                </>
               )}
          
          {showFreeCommercialPropertySuccessModal && (
            <FreePropertySuccessModal
              onClose={() => showFreeCommercialPropertySuccessModal(false)}
           />
          )}
      </>
    );
}