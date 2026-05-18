"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import Button from "../components/Button";
import Select from "../components/clientOnlySelect";
import InputField from "../components/input";
import { toast } from "react-toastify";
import FreePropertySuccessModal from "../components/free-property-sucess-modal";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import WalletPaymentModal from "../components/WalletModal/walletModal";
import { apartmentRentBathroomsOptions, apartmentRentBedroomNumberOptions, apartmentRentOptions, apartmentRentToiletOptions, furnishingOptions, ownershipStatusOptions, parkingSpaceOptions, propertyConditionOptions, propertyDurationOptions, propertyFacilities, propertyTypeOptions, serviceChargeOptions } from "../lib/propertyData";
import { negotiationOptions } from "../lib/carData";
import { useAuth } from "../context/AuthContext";
import MultiSelectDropdown from "../components/dropdowns/MultiSelectDropdown";


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

// Define plan amounts
const planAmounts = {
  free: 0,
  basic: 15000,
  premium: 30000,
  vip: 45000,
  diamond: 60000,
  enterprise: 100000
};


export default function ApartmentRentContent() {
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
   const [selectedFacilities, setSelectedFacilities] = useState([]);
   const [propertyDuration, setPropertyDuration] = useState("");
   const [amount, setAmount] = useState("");
   const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
   const [numberofBathrooms, setNumberOfBathrooms] = useState("");
   const [numberOfToilet, setNumberOfToilet] = useState("");
   const [negotiation, setNegotiation] = useState("");
   const [businessOptions, setBusinessOptions] = useState([]);
   const [business, setBusiness] = useState("");
   const [businessCategory, setBusinessCategory] = useState("");
   const [description, setDescription] = useState("");
   const [showModalPromote, setShowModalPromote] = useState(false);
   const [showWalletModal, setShowWalletModal] = useState(false);
   const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);
  const [editingCarAd, setEditingCarAd] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

   // New state to track if the component has mounted 
   const [mounted, setMounted] = useState(false);

   const {profile, token, login} = useAuth();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const carAdId = searchParams.get('carAdId') || null;

  const handleGoBack  = () => router.back();

  
  // Define plan hierarchy
  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };
  
   
  useEffect(() => {
    const fetchDraftData = async () => {
      const carAdIdFromStorage = localStorage.getItem('editingCarAdId');
      const carAdIdFromQuery = carAdId;
      const adType = localStorage.getItem('editingAdType');

      const idToUse = carAdIdFromQuery || carAdIdFromStorage;

      console.log("🔍 Checking for property draft:",  {
        carAdIdFromQuery,
        carAdIdFromStorage,
        adType,
        idToUse
      });

      if (!idToUse || adType !== 'property') {
        console.log("⚠️ No property draft to load");
        return;
      }

      setIsLoadingDraft(true);

      try {
       // Fetch PropetyAd draft by CarAdId 
       const propertyResponse = await api.get(`/property/draft/${idToUse}`);

       if (!propertyResponse.data || !propertyResponse.data.propertyAd) {
        console.log("⚠️ No PropertyAd draft found");
        setIsLoadingDraft(false);
        return;
       }

       const propertyAd = propertyResponse.data.propertyAd;
      console.log("✅ Loaded PropertyAd draft:", propertyAd);

      // Aslso fetch CarAd for images and location 
      let carAd = null;
      try {
      const carResponse = await api.get(`/carAdd/${idToUse}`);
      carAd = carResponse.data;
      console.log("✅ Loaded CarAd:", carAd);
      } catch (carError) {
       console.warn("⚠️ Could not load CarAd:", carError);
      }

      // Pre-fill form fields from PropertyAd 
      setPropertyName(propertyAd.propertyName || "");
      setPropertyAddress(propertyAd.propertyAddress || propertyAd.location || "");
      setPropertyType(propertyAd.furnishing || "");
      setParking(propertyAd.parking || "");
      setSquareMeter(propertyAd.squareMeter || "");
      setOwnerShipStatus(propertyAd.ownershipStatus || "");
      setServiceCharge(propertyAd.serviceCharge || "");
      setNumberOfBedrooms(propertyAd.numberOfBedrooms || "");
      setNumberOfBathrooms(propertyAd.numberofBathrooms || "");
       setNumberOfBedrooms(propertyAd.numberOfBedrooms || "");
      setNumberOfToilet(propertyAd.numberOfToilet || "");
      setAmount(propertyAd.amount || "");
      setSelectedFacilities(propertyAd.selectedFacilities || "");
      setNegotiation(propertyAd.negotiation || "");
      setDescription(propertyAd.description || "");

      // Set Business from either propertyAd or carAd 
      const businessId = propertyAd.businessCategory?._id 
        || propertyAd.businessCategory
        || carAd?.businessCategory?._id
        || carAd?.businessCategory;
      setBusiness(businessId || "");
      setBusinessCategory(businessId || "");

      // Store editing state 
      setEditingCarAd({
        carAdId: idToUse,
        businessId: businessId,
        category: carAd?.category || 'House and Apartment Property For Rent',
        location: carAd?.location || propertyAd.propertyAddress || '',
        images: carAd?.propertyImage || [],
      });

      toast.success("Draft loaded successfully! Complete your project  ad details.");
      setIsLoadingDraft(false);


      } catch (error) {
       console.error("❌ Error loading property draft:", error);
      toast.error("Failed to load draft. Starting fresh.");

       // clear invalid data 
         localStorage.removeItem('editingCarAdId');
         localStorage.removeItem('editingCarAdData');
         localStorage.removeItem('editingAdType');

         setIsLoadingDraft(false);
      }
    };

    if (mounted) {
      fetchDraftData();
    }
  }, [mounted, carAdId]);

  
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
        const savedBusinessId = localStorage.getItem('selectedBusinessId');
        if (savedBusinessId) {
          setBusiness(savedBusinessId);
          localStorage.removeItem('selectedBusinessId');
        }
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

  const buildPayload = (planType, useWallet = false) => {
    const payload = {
       propertyName: propertyName?.trim(),
    propertyAddress: propertyAddress?.trim(),
    propertyType,
    furnishing: furnishing || null,
    propertyCondition: propertyCondition || null,
    propertyFacilities: Array.isArray(selectedFacilities)
     ? selectedFacilities.map(f => (typeof f === "string" ? f : f.value || f.label))
     : [],
    parking: parking || null,
    serviceCharge: serviceCharge || null,
    squareMeter: squareMeter?.trim() || null,
    ownershipStatus: ownershipStatus || null,
    serviceCharge: serviceCharge || null,
    numberOfBedrooms: numberOfBedrooms || null,
    numberofBathrooms: numberofBathrooms || null,
    numberOfToilet: numberOfToilet || null,
    serviceFee: serviceCharge === "yes" && serviceFee ? parseFloat(serviceFee) : null,
    amount: parseFloat(amount) || 0,
    negotiation: negotiation || "no",
    businessCategory: business || null,
    description: description?.trim() || "",
    plan: planType,
    promotionAmount: planAmounts[planType] || 0,
    useWalletBalance: useWallet
    };

  const storedCarAdId = localStorage.getItem('editingCarAdId');
    if (storedCarAdId) {
      payload.carAdId = storedCarAdId;
      console.log("✅ Including carAdId in payload:", storedCarAdId);
    } else if (carAdId) {
      payload.carAdId = carAdId;
    }

    return payload;
  };


  const submitAd = useCallback(async (planToSubmit, useWallet) => {
    try {
      console.log("Submitting ad with plan:", planToSubmit, "useWallet:", useWallet);

      // Validate required fields 
      if (!propertyName?.trim()) {
        toast.error("Property name is required");
        return;
      }
      if (!propertyAddress?.trim()) {
        toast.error("Property address is required");
         return;
      }
      if (!propertyType) {
        toast.error("Property type is required");
        return;
      }
      if (!amount || parseFloat(amount) <= 0) {
       toast.error("Valid amount is required");
        return;
      }
      const payload = buildPayload(planToSubmit, useWallet);
      console.log("Payload being sent:", payload);

      const res = await api.post("/property/create-commercial-rent", payload);
      console.log("Backend response:", res.data);

        // Handle different response scenarios
          if (res.data.data?.paymentUrl && !useWallet) {
            toast.info("Redirecting to Paystack for payment...");
            setShowModalPromote(false);
            setShowWalletModal(false);
            window.location.href = res.data.data.paymentUrl;
          } else if (res.data.data?.paymentStatus === 'success') {
            toast.success(res.data.message || "Property ad posted successfully!");
            setShowModalPromote(false);
            setShowWalletModal(false);

            // clear incomplete ad tracking 
            localStorage.removeItem("editingCarAdId");
            localStorage.removeItem("editingCarAdData");
            localStorage.removeItem('editingAdType');
            localStorage.setItem('adUpdated', 'true');
            router.push("/Add");
            // Refresh Profile 
          } else if (res.data.data?.paymentStatus === "free") {
            toast.success(res.data.message || "Free property ad posted successfully!");
            setShowModalPromote(false);
            setShowWalletModal(false);
            setShowFreeCommercialPropertyModal(true);

            // 🔑 Clear incomplete ad tracking
            localStorage.removeItem("editingCarAdId");
            localStorage.removeItem("editingCarAdData");
            localStorage.removeItem("editingAdType");
            localStorage.setItem('adUpdated', 'true');
          } else {
            toast.success(res.data.message || "Property ad posted successfully");
            setShowModalPromote(false);
            setShowWalletModal(false);

            //  🔑 Clear incomplete ad tracking
           localStorage.removeItem("editingCarAdId");
           localStorage.removeItem("editingCarAdData");
           localStorage.removeItem("editingAdType");

           const profileRes = await api.get("/profile");
           login(profileRes.data, token);
          }
        } catch(error) {
         console.error("Ad submission error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.error ||
         "Something went wrong posting your ad. Please try again."
       );
     }
    }, [propertyName, propertyAddress, propertyType, amount, router, token, login, router, editingCarAd, carAdId, buildPayload]); 

  
 const postAdForFree = useCallback(async () => {
      await submitAd("free");
    }, [submitAd]);

  
  const promoteAd = useCallback(async () => {
    if (!profile) {
      toast.error("Profile not loaded. Please try again.");
      return;
    }

    const planCost = planAmounts[selectedPlan] || 0;
    const walletBalance = profile.walletBalance || 0;

    // If user has sufficient wallet balance, show wallet modal
    if (walletBalance >= planCost) {
      setShowModalPromote(false);
      setShowWalletModal(true);
    } else {
      // Directly proceed to Paystack payment
      await submitAd(selectedPlan, false);
    }
  }, [selectedPlan, submitAd, profile]);

 const handleWalletPayment = useCallback(async () => {
    await submitAd(selectedPlan, true);
  }, [selectedPlan, submitAd]);

  const handlePaystackPayment = useCallback(async () => {
    await submitAd(selectedPlan, false);
  }, [selectedPlan, submitAd]);

  
const handlePost = useCallback(async () => {
  if (isPosting) return;
  if (!profile) {
    toast.error("You need to be logged in to post an ad.");
    return;
  }

  setIsPosting(true);

  try {
   // Validate required fields
  if (!propertyName || !propertyAddress || !propertyType || !amount) {
    toast.error("Please fill in all required fields.");
    return;
  }

  const successfulPaidPlans = profile.paidPlans?.filter(p => p.status === "success") || [];
  let highestPlan = "free";
  let highestPlanPriority = 0;

  // Find the highest priority successful plan
  if (successfulPaidPlans.length > 0) {
    for (const plan of successfulPaidPlans) {
      const planPriority = planHierarchy[plan.planType] || 0;
      if (planPriority > highestPlanPriority) {
        highestPlanPriority = planPriority;
        highestPlan = plan.planType;
      }
    }
  }

  // If user has any successful paid plan, use it directly
  if (highestPlan !== "free") {
    toast.success(`Post created successfully Using your existing ${highestPlan} plan to post this ad.`);
    router.push('/Add');
    await submitAd(highestPlan, false);
  } else {
    setSelectedPlan("basic");
    setShowModalPromote(true);
  }
  } finally {
    setIsPosting(false);
  }
}, [profile, submitAd, propertyName, propertyAddress, propertyType, amount, isPosting]);


 const onPlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

    const handleSaveAsDraft = useCallback(async () => {
      if (isSavingDraft) return;
      setIsSavingDraft(true);
     try {
      const payload = buildPayload('free', false);
      delete payload.plan; // Remove plan 
      delete payload.promotionAmount;
      delete payload.useWalletBalance;
  
      const res = await api.post("/property/save-draft", payload);
  
      const savedPlan = res.data.data?.plan || 'free';
  
      toast.success(`Property ad saved as draft with ${savedPlan} plan!`);
  
      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingCarAdData");
      localStorage.removeItem("editingAdType");
  
      router.push("/Add");
     } catch (error) {
      console.error("Draft save error:", error);
      toast.error(error.response?.data?.error || "Failed to save draft");
     } finally {
      setIsSavingDraft(false);
     }
  }, [buildPayload, router, isSavingDraft]);


   if (isLoadingDraft) {
    return (
      <div className="bg-white shadow-phenom rounded-[12px] p-4 sm:p-6 md:p-10 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading draft...</p>
        </div>
      </div>
    );
  }
  

    return (
      <>
    <div className="bg-white shadow-phenom rounded-[12px] p-5 sm:p-10 text-left">
        <button
          onClick={handleGoBack}
          className="flex justify-start items-center hidden md:block md:justify-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
        </button>

        <h3 className="text-left md:text-center text-[#525252] font-[500] font-inter text-sm md:text-base mt-8 mb-4">
          {editingCarAd ? "Complete Your House For Rent Property Ad" : "House and Apartment Property for rent"}
        </h3>

        <form className="space-y-6">
          {/* Input Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Title" placeholder="Enter name of the property" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
            <InputField label="Address" placeholder="Enter the address of the property" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown label="Property Type" value={propertyType} onChange={setPropertyType} options={apartmentRentOptions} />
            <PostDropdown label="Furnishing" value={furnishing} onChange={setFurnishing} options={furnishingOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown label="Property Condition" value={propertyCondition} onChange={setPropertyCondition} options={propertyConditionOptions} />
            <PostDropdown label="Is there a parking space" value={parking} onChange={setParking} options={parkingSpaceOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField label="Square Meters (sqm)" placeholder="Enter" value={squareMeter} onChange={(e) => setSquareMeter(e.target.value)} />
            <PostDropdown label="Are you the owner or an agent of the property" value={ownershipStatus} onChange={setOwnerShipStatus} options={ownershipStatusOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MultiSelectDropdown label="Property facilities" value={selectedFacilities} onChange={setSelectedFacilities} options={propertyFacilities} />
            <PostDropdown label="Number of bedrooms" value={numberOfBedrooms} onChange={setNumberOfBedrooms} options={apartmentRentBedroomNumberOptions} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown label="Number of bathrooms" value={numberofBathrooms} onChange={setNumberOfBathrooms} options={apartmentRentBathroomsOptions} />
            <PostDropdown label="Number of toilet" value={numberOfToilet} onChange={setNumberOfToilet} options={apartmentRentToiletOptions} />
          </div>

          {/* Gray Box */}
          <div className="bg-[#FAFAFA] px-4 py-5 mt-5 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PostDropdown label="Is there a service charge?" value={serviceCharge} onChange={setServiceCharge} options={serviceChargeOptions} />
              <PostDropdown label="Are you opened for negotiation" value={negotiation} onChange={setNegotiation} options={negotiationOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown label="Duration" value={propertyDuration} onChange={setPropertyDuration} options={propertyDurationOptions} />
            <InputField
              label="Amount" 
              placeholder="₦| Enter your amount" 
              value={amount} 
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                   setAmount(value);
                }
              }} 
              type="text"
              />
          </div>

          {/* Business Select with Label Left on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="business" className="text-[#525252] font-[500] font-inter mb-2 md:mb-0 min-w-[160px]">
                Select your business
              </label>
              <div className="flex-1">
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
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">Description</label>
            <textarea
              placeholder="Enter the description of this property"
              className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Post Button */}
          <div className="flex gap-4 justify-center mt-6">
           {!editingCarAd && (
             <Button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}
              className="w-full md:w-[200px] h-[44px] md:rounded-[8px] font-[500] text-[14px] border border-[#CDCDD7] text-[#525252] disabled:opacity-60 disabled:cursor-not-allowed">
               {isSavingDraft ? (
                 <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></span>
                    Saving...
                 </span>
               ): "Save as Draft"}
            </Button>
           )}
            <Button
              type="button"
              onClick={handlePost}
              disabled={isPosting}
              className="w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
             {isPosting ? (
              <span className="flex items-center justify-center">
                 <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                 Processing...
              </span>
             ): editingCarAd ? "Complete Ad" : "Post Ad"}
          </Button>
          </div>

          {/* Terms Notice */}
          <div className="text-center mt-5 font-[400] font-inter text-sm leading-relaxed px-2 sm:px-4">
            <p className="text-[#767676]">
              By clicking on <strong>Post Ad</strong>, you accept to{" "}
              <span className="text-[#000087]">Terms of Use</span>, confirm that you will abide by the Safety Tips, and declare that this posting does not include any Prohibited items.
            </p>
          </div>
        </form>
      </div>


    {mounted && (
      <>
      {showModalPromote && (
        <PromoteAdModal 
          selectedPlan={selectedPlan}
          onPlanSelect={onPlanSelect}
          onCancel={postAdForFree}
          onConfirm={promoteAd}
          onClose={() => setShowModalPromote(false)}
          walletBalance={profile?.walletBalance || 0}
        />
      )}

      {showWalletModal && (
        <WalletPaymentModal 
           selectedPlan={selectedPlan}
           planAmount={planAmounts[selectedPlan] || 0}
           walletBalance={profile?.walletBalance || 0}
           onWalletPayment={handleWalletPayment}
           onPaystackPayment={handlePaystackPayment}
           onCancel={() => setShowWalletModal(false)}
           onClose={() => setShowWalletModal(false)}
        />
      )}
     {showFreeCommercialPropertySuccessModal && (
      <FreePropertySuccessModal
        onClose={() => setShowFreeCommercialPropertyModal(true)}
       />
      )}        
      </>
     )}
    </>
    );
}