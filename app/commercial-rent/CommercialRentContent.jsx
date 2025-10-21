"use client";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { useRouter,  useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Select from "../components/clientOnlySelect";
import { 
  propertyTypeOptions, 
  furnishingOptions, 
  parkingSpaceOptions, 
  ownershipStatusOptions, 
  serviceChargeOptions, 
  propertyDurationOptions, 
  negotiationOptions,
  propertyFacilities
} from "../lib/propertyData";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import MultiSelectDropdown from "../components/dropdowns/MultiSelectDropdown";
import FreePropertySuccessModal from "../components/free-property-sucess-modal";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import WalletPaymentModal from "../components/WalletModal/walletModal";

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

const planAmounts = {
  free: 0,
  basic: 15000,
  premium: 30000,
  vip: 45000,
  diamond: 60000,
  enterprise: 100000
};

export default function CommercialRentContent() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [parking, setParking] = useState("");
  const [squareMeter, setSquareMeter] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [ownershipStatus, setOwnerShipStatus] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceFee, setServiceFee] = useState("")
  const [propertyDuration, setPropertyDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessOptions, setBusinessOptions] = useState([]);
  const [business, setBusiness] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hasPromoted, setHasPromoted] = useState(false);
  const [propertyFacility, setPropertyFacility] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);

 const [editingCarAd, setEditingCarAd] = useState(null);
 const [isLoadingDraft, setIsLoadingDraft] = useState(null);

  
    // New state to track if the component has mounted on the client
    const [mounted, setMounted] = useState(false);
    const { profile, token, login } = useAuth();
    const router = useRouter();

     const searchParams = useSearchParams();
      const carAdId = searchParams.get('carAdId');

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

        console.log("🔍 Checking for property draft:", {
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
          // Fetch propertyAd drat by carAdId
          const propertyResponse = await api.get(`/property/draft/${idToUse}`);

          if (!propertyResponse.data || !propertyResponse.data.propertyAd) {
            console.log("⚠️ No PropertyAd draft found");
            setIsLoadingDraft(false);
            return;
          }

          const propertyAd = propertyResponse.data.propertyAd;
          console.log("✅ Loaded PropertyAd draft:", propertyAd);

          // Also fetch carad for images and location
          let carAd = null;
          try {
           const carResponse = await api.get(`/carAdd/${idToUse}`);
            carAd = carResponse.data;
            console.log("✅ Loaded CarAd:", carAd);
          } catch (carError) {
            console.warn("⚠️ Could not load CarAd:", carError);
          }

          // Pre-fill  form fields for propertyAd 
          setPropertyName(propertyAd.propertyName || "");
          setPropertyAddress(propertyAd.propertyAddress || propertyAd.location || "");
          setPropertyType(propertyAd.propertyType || "");
          setFurnishing(propertyAd.furnishing || "");
          setParking(propertyAd.parking || "");
          setSquareMeter(propertyAd.squareMeter || "");
          setOwnerShipStatus(propertyAd.ownershipStatus || "");
          setServiceCharge(propertyAd.serviceFee || "");
          setPropertyDuration(propertyAd.propertyDuration || "");
          setAmount(propertyAd.amount || "");
          setNegotiation(propertyAd.negotiation || "");
          setDescription(propertyAd.description || "");
          setPropertyFacility(propertyAd.propertyFacilities || "");
          //Set business form either propertyAd or carAd 
          const businessId = propertyAd.businessCategory?._id
            || propertyAd.businessCategory
            || carAd?.businessCategory?._id
            || carAd?.businessCategory;
          setBusiness(businessId || "");
          setBusinessCategory(businessId || "");

          // store editing state 
          setEditingCarAd({
            carAdId: idToUse,
            businessId: businessId,
            category: carAd?.category | 'Commercial Property For Rent',
            location: carAd?.location || propertyAd.propertyAddress ||  '',
            images: carAd?.propertyImage || [],
          });

          toast.success("Draft loaded successfully! Complete your property  ad details.");
          setIsLoadingDraft(false);

        } catch (error) {
          console.error("❌ Error loading property draft:", error);
          toast.error("Failed to load draft. Starting fresh.");

          // Clear invalid data 
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
      if (!mounted) {
        return;
      }
  
      const revalidateProfile = async () => {
        if (token) {
          try {
            const profileRes = await api.get("/profile");
            login(profileRes.data, token);
            console.log("Property: Profile revalidated from backend:", profileRes.data);
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
    parking: parking || null, 
    squareMeter: squareMeter?.trim() || null,
    ownershipStatus: ownershipStatus || null,
    serviceCharge: serviceCharge || null,
    serviceFee: serviceCharge === "yes" && serviceFee ? parseFloat(serviceFee) : null,
    location: propertyAddress?.trim(),
    propertyFacilities: Array.isArray(propertyFacilities)
     ? propertyFacilities.map((f) => (typeof f === "string" ? f : f.name))
     : [],
    propertyDuration: propertyDuration || null,
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

 
const submitAd = useCallback(async (planToSubmit, useWallet = false) => {
    try {
      console.log("Submitting ad with plan:", planToSubmit, "useWallet:", useWallet);

      // Validate require fields 
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
      console.log("Payload beign sent:", payload);

      const res = await api.post("/property/create-commercial-rent", payload);
      console.log("Backend response:", res.data);

      // Handle different response scenarios 
      if (res.data.data?.paymentUrl && !useWallet) {
        toast.info("Redirecting to paystack for payment...");
        setShowModalPromote(false);
        setShowWalletModal(false);
        window.location.href = res.data.data.paymentUrl;
      } else if (res.data.data?.paymentStatus === 'success') {
        toast.success(res.data.message || "Property Ad posted successfully!"); 
        setShowModalPromote(false);
        setShowWalletModal(false);

        // clear incomplete ad tracking 
        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");
        localStorage.setItem('adUpdated', 'true');
        router.push("/Add");
      } else if (res.data.data?.paymentStatus === "free") {
        toast.success(res.data.message || "Free ad posted successfully!");
        setShowModalPromote(false);
        setShowWalletModal(false);
        setShowFreeSuccessModal(true);

         // 🔑 Clear incomplete ad tracking
        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");
        localStorage.removeItem('adUpdated', 'true');
      } else {
        toast.success(res.data.message || "Ad posted successfully");
        setShowModalPromote(false);
        setShowWalletModal(false);

         // 🔑 Clear incomplete ad tracking
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
    if (!profile) {
      toast.error("You need to be logged in to post an ad.");
      return;
    }
  
    // Validate required fields
    if (!propertyName || !propertyAddress || !propertyType || !amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    console.log("Current profile paid plans:", profile.paidPlans);
  
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
  
    console.log("Highest paid plan found:", highestPlan);
  
    // If user has any successful paid plan, use it directly
    if (highestPlan !== "free") {
      console.log("Using existing paid plan:", highestPlan);
      toast.success(`Post created successfully Using your existing ${highestPlan} plan to post this ad.`);
      router.push('/view-property-add');
      await submitAd(highestPlan, false); 
    } else {
      // User has no paid plans, show promote modal
      console.log("No paid plans found, showing promote modal");
      setSelectedPlan("basic");
      setShowModalPromote(true);
      return;
    }
  }, [profile, submitAd, propertyName, propertyAddress, propertyType, amount]);

  const handleGoBack  = () => router.back();

  const onPlanSelect = (plan) => {
    setSelectedPlan(plan);
  };


  const handleSaveAsDraft = useCallback(async () => {
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
   }
}, [buildPayload, router]);

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
   <div className="bg-white shadow-phenom rounded-[12px] p-5 md:p-10">
        <button
          onClick={handleGoBack}
          className="flex items-center hidden md:block text-[#1031AA] hover:text-[#00A8DF] font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1 text-[#141B34]" />
        </button>

        <h3 className="text-[#525252] font-[500] text-left md:text-center font-inter text-[14px] md:text-[16px] mb-4">
          {editingCarAd ? "Complete your Commercial Property for Rent Ad" : "Commercial Property For Rent"}
        </h3>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField
              label="Title"
              placeholder="Enter name of the property"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
            />
            <InputField
              label="Address"
              placeholder="Enter the address of the property"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <PostDropdown
              label="Property Type"
              value={propertyType}
              onChange={setPropertyType}
              options={propertyTypeOptions}
            />
            <PostDropdown
              label="Furnishing"
              value={furnishing}
              onChange={setFurnishing}
              options={furnishingOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <PostDropdown
              label="Is there a parking space"
              value={parking}
              onChange={setParking}
              options={parkingSpaceOptions}
            />
            <InputField
              label="Square Meters (sqm)"
              placeholder="Enter"
              value={squareMeter}
              onChange={(e) => setSquareMeter(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <PostDropdown
              label="Are you the owner or an agent of the property?"
              value={ownershipStatus}
              onChange={setOwnerShipStatus}
              options={ownershipStatusOptions}
            />
             <MultiSelectDropdown
              label="Property Amenities"
              value={propertyFacility}
              onChange={setPropertyFacility}
              options={propertyFacilities}
            />
          </div>

          <div className="bg-[#FAFAFA] px-3 py-3 md:py-5 mt-3 md:mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <PostDropdown
                label="Is there a service charge?"
                value={serviceCharge}
                onChange={setServiceCharge}
                options={serviceChargeOptions}
              />
               <PostDropdown
              label="Are you open for negotiation?"
              value={negotiation}
              onChange={setNegotiation}
              options={negotiationOptions}
            />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <PostDropdown
              label="Duration"
              value={propertyDuration}
              onChange={setPropertyDuration}
              options={propertyDurationOptions}
            />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div>
              <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">
                Business
              </label>
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

          <div>
            <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">
              Description
            </label>
            <textarea
              placeholder="Enter the description of the property"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-4 justify-center mt-5">
             {!editingCarAd && (
               <Button
              type="button"
              onClick={handleSaveAsDraft}
              className="w-full md:w-[200px] h-[44px] md:rounded-[8px] 
                      font-[500] text-[14px] border border-[#CDCDD7] text-[#525252]">
               Save as Draft
           </Button>
             )}
              <Button
                 type="button"
                 onClick={handlePost}
                 className="w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                     {editingCarAd ? "Complete Ad": "Post Ad"}
                    </Button>
                </div>

          <div className="text-center mt-5 font-[400] font-inter text-sm leading-relaxed px-2 md:px-4">
            <p className="text-[#767676]">
              By clicking on <strong>Post Ad</strong>, you accept the{" "}
              <span className="text-[#000087]">Terms of Use</span>, confirm that you will abide
              by the Safety Tips, and declare that this posting does not include any Prohibited items.
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
          onClose={() => showFreeCommercialPropertySuccessModal(false)}
        />
      )}
      </>
   )}
  </>
  );
}