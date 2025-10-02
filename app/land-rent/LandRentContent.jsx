"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/input";
import api from "@/services/api";
import Select from "../components/clientOnlySelect";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import { toast } from "react-toastify";
import { 
  landLegalFeeOptions,
  landPropertyPricingUnitOptions, 
  landPropertyTypeOptions, 
  landSalePropertyOptions, 
  landTitleDocument, 
  ownershipStatusOptions, 
  propertyFacilities,
   serviceChargeOptions 
} from "../lib/propertyData";
import { negotiationOptions } from "../lib/carData";
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

// Define plan amounts
const planAmounts = {
  free: 0,
  basic: 15000,
  premium: 30000,
  vip: 45000,
  diamond: 60000,
  enterprise: 100000
};


export default function  LandRentContent() {
   const [propertyName, setPropertyName] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [squareMeter, setSquareMeter] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("basic");
    const [ownershipStatus, setOwnerShipStatus] = useState("");
    const [serviceCharge, setServiceCharge] = useState("");
    const [propertyFacility, setPropertyFacilities] = useState("");
    const [titleDocuments, setTitleDocuments] = useState("");
    const [developmentFee, setDevelopmentFee] = useState("");
    const [surveyFee, setSurveyFee] = useState("");
    const [legalFee, setLegalFee] = useState("");
   const [negotiation, setNegotiation] = useState("");
    const [pricingUnits, setPricingUnits] = useState("");
    const [serviceFee, setServiceFee] = useState("");
    const [amount, setAmount] = useState("");
   const [businessOptions, setBusinessOptions] = useState([]);
   const [business, setBusiness] = useState("");
   const [description, setDescription] = useState("");
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const [editingCarAd, setEditingCarAd] = useState(null);


  // New state to track if the component has mounted 
  const [mounted, setMounted] = useState(false);
  const { profile, token, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carAdId = searchParams.get('carAdId');

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
    const carAdId = localStorage.getItem('editingCarAdId');
  const carAdDataStr = localStorage.getItem('editingCarAdData');
  const adType = localStorage.getItem('editingAdType');

    if (carAdId && carAdDataStr && adType === 'vehicle') {
      try {
       const carAdData = JSON.parse(carAdDataStr);

       setEditingCarAd({
        carAdId,
        businessId: carAdData.businessCategory._id,
        category: carAdData.category,
        location: carAdData.location,
        images: carAdData.images,
       });

       // 🔥 Pre-fill form fields here
       if (adType === 'property') {
        setPropertyName(adData.propertyName || "");
        setPropertyAddress(adData.propertyAddress || "");
        setPropertyType(adData.propertyType || "");
       setFurnishing(adData.furnishing || "");
       setParking(adData.parking || "");
       setSquareMeter(adData.squareMeter || "");
       setOwnerShipStatus(adData.ownershipStatus || "");
       setServiceCharge(adData.serviceCharge || "");
       setServiceFee(adData.serviceFee || "");
       setDevelopmentFee(adData.developmentFee || "");
       setSurveyFee(adData.surveyFee || "");
       setLegalFee(adData.legalFee || "");
       setPricingUnits(adData.pricingUnits || "");
       setPropertyDuration(adData.propertyDuration || "");
       setAmount(adData.amount || "");
       setNegotiation(adData.negotiation || "");
       setBusiness(adData.businessCategory?._id || "");
       setDescription(adData.description || "");
       }
      } catch (err) {
       console.error("Failed to parse saved ad data:", err);

       // Clear invalid data
      localStorage.removeItem('editingCarAdId');
      localStorage.removeItem('editingCarAdData');
      localStorage.removeItem('editingAdType');
      }
    }
  }, []);

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
        // These window/document checks are now safe as this entire effect
        // only runs on the client after mounting.
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
     propertyFacilities: propertyFacilities || null,
     squareMeter: squareMeter?.trim() || null,
     ownershipStatus: ownershipStatus || null,
     serviceCharge: serviceCharge || null,
     developmentFee: developmentFee || null,
     surveyFee: serviceCharge === "yes" && serviceFee ? parseFloat(serviceFee) : null,
     legalFee: legalFee || null,
     pricingUnits: pricingUnits || null,
     amount: parseFloat(amount) || 0,
     negotiation: negotiation || "no",
     businessCategory: business || null,
     description: description?.trim() || "",
     plan: planType,
     promotionAmount: planAmounts[planType] || 0,
     useWalletBalance: useWallet
   };

   // carAdId if editing 
   if (editingCarAd?.carAdId) {
    payload.carAdId = editingCarAd.carAdId;
   } else if (carAdId) {
    payload.carAdId = carAdId; // fallback if passed via query 
   }

   return payload;
  };


 const submitAd = useCallback(async (planToSubmit, useWallet = false) => {
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
       localStorage.removeItem("editingAdData");

      localStorage.setItem('adUpdated', 'true');
       router.push("/Add");

     } else if (res.data.data?.paymentStatus === "free") {
       toast.success(res.data.message || "Free property ad posted successfully!");
       setShowModalPromote(false);
       setShowWalletModal(false);
       setShowFreeCommercialPropertyModal(true);

        // 🔑 Clear incomplete ad tracking
        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingAdData");
        localStorage.setItem('adUpdated', 'true');
     } else {
       toast.success(res.data.message || "Property ad posted successfully");
       setShowModalPromote(false);
       setShowWalletModal(false);

       // 🔑 Clear incomplete ad tracking
       localStorage.removeItem("editingCarAdId");
       localStorage.removeItem("editingAdData");
     }
   } catch (error) {
    console.error("Ad submission error:", error.response?.data || error.message);
     toast.error(
        error.response?.data?.error ||
       "Something went wrong posting your ad. Please try again."
     );
   }
 }, [propertyName, propertyAddress, propertyType, amount, router, token, login, router, editingCarAd, carAdId]);


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
  }
}, [profile, submitAd, propertyName, propertyAddress, propertyType, amount]);

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

  return  (
      <>
          <div className="bg-white shadow-phenom rounded-[12px] p-10 text-left md:text-center">
              <button
                onClick={handleGoBack}
                className="flex justify-start items-start  hidden md:block md:justify-center md:items-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]"  /> 
              </button>
               <h3 className="text-left md:text-center text-[#525252] font-[500] font-inter text-[14px] md:text-[16px] mt-8 mb-4">
                  Lands and Plots for rent & sale
               </h3>
               <form>
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
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
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Property Type"
                    value={propertyType}
                    onChange={setPropertyType}
                    options={landPropertyTypeOptions}
                  />
                  <InputField
                    label="Square Meters (sqm)"
                    placeholder="Enter"
                    value={squareMeter}
                    onChange={e => setSquareMeter(e.target.value)}
                  />
                 </div>
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Are you the owner or an agent of the property"
                      value={ownershipStatus}
                      onChange={setOwnerShipStatus}
                      options={ownershipStatusOptions}
                    />
                    <PostDropdown
                      label="Property facilities"
                      value={propertyFacility}
                      onChange={setPropertyFacilities}
                      options={landSalePropertyOptions}
                    />
                 </div>
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Title Documents"
                    value={titleDocuments}
                    onChange={setTitleDocuments}
                    options={landTitleDocument}
                   />
                   <PostDropdown 
                    label="Are you opened for negotiation"
                     value={negotiation}
                    onChange={setNegotiation}
                    options={negotiationOptions}
                  />
                 </div>
                 <div className="bg-[#FAFAFA] px-3 py-2 p-5 md:h-auto mt-5">
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      <PostDropdown
                        label="Is there a service Charge?"
                        value={serviceCharge}
                       onChange={setServiceCharge}
                        options={serviceChargeOptions}
                        className="bg-transparent"
                      />
                       <InputField
                         label="Development fee"
                         placeholder="₦| Enter your amount"
                         className="bg-transparent"
                         value={developmentFee}
                         onChange={(e) => {
                           const value = e.target.value;
                           if (/^\d*\.?\d*$/.test(value)) {
                            setDevelopmentFee(value);
                           }
                         }}
                         type="text"
                       />
                   </div>
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField
                          label="Survey fee"
                          placeholder="₦| Enter your survey fee"
                          value={surveyFee}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                              setSurveyFee(value);
                            }
                          }}
                          type="text"
                        />
                        <PostDropdown
                          label="Legal fee"
                          value={legalFee}
                          onChange={setLegalFee}
                          options={landLegalFeeOptions}
                        />
                     </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Pricing Units"
                      value={pricingUnits}
                      onChange={setPricingUnits}
                      options={landPropertyPricingUnitOptions}
                    />
                    <InputField
                      label="Amount"
                      placeholder="₦| Enter your amount"
                      value={amount}
                      onChange={(e) => {
                        // Only allow numbers and optional decimal point 
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
                   <label htmlFor="business" className="block text-[#525252] font-[500] font-inter mb-1 text-left">Select your business</label>
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
                 <div className="mt-2">
                  <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">Description</label>
                  <textarea
                    placeholder="Enter the description of this property"
                    className="w-full h-[120px] border border-[#CDCDD7] 
                    rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                   >
                  </textarea>
                 </div>
                    <div className="flex gap-4 justify-center mt-5">
                    <Button 
                     type="button"
                     onClick={handleSaveAsDraft}
                     className="w-full md:w-[200px] h-[44px] md:rounded-[8px] 
                      font-[500] text-[14px] border border-[#CDCDD7] text-[#525252]">
                      Save as Draft
                    </Button>
                   <Button
                     type="button"
                     onClick={handlePost}
                       className="w-[262px] h-[44px] rounded-[8px] 
                       md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
                       font-[500] md:text-[14px] bg-[#EDEDED] text-[#CDCDD7] 
                       bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                       Post Ad
                   </Button>
                 </div>
                 
               </form>
                 <div className="text-center mt-5 font-[400] font-inter text-sm md:text-[12px] leading-relaxed px-4">
                   <p className="text-[#767676]">
                    By clicking on <strong>Post Ad</strong>, you accept to{" "}
                    <span className="text-[#000087]">Terms of Use</span>, confirm that you will abide by the Safety Tips, and declare that this posting does not include any Prohibited items.
                    </p>
                 </div>
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