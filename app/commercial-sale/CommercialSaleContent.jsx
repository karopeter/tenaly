"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import InputField from "../components/input";
import Select from "../components/clientOnlySelect";
import Button from "../components/Button";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import { 
  furnishingOptions, 
  ownershipStatusOptions, 
  parkingSpaceOptions, 
  propertyConditionOptions, 
  propertyTypeOptions, 
  serviceChargeOptions 
} from "../lib/propertyData";
import { negotiationOptions } from "../lib/carData";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
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

export default function CommercialSaleContent() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [propertyCondition, setPropertyCondition] = useState("");
  const [parking, setParking] = useState("");
  const [squareMeter, setSquareMeter] = useState("");
  const [ownershipStatus, setOwnerShipStatus] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [propertyDuration, setPropertyDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessOptions, setBusinessOptions] = useState([]);
  const [business, setBusiness] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [description, setDescription] = useState("");

  // Modal states
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [isPosting, setIsPosting] = useState(false);

  const { profile, token, login } = useAuth();
  const router = useRouter();

  // Define plan hierarchy
  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };

  // Set mounted to true after component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close promote modal after timeout
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

  // Fetch businesses and load Paystack
  useEffect(() => {
    if (!mounted) return;

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

  // Revalidate profile on mount
  useEffect(() => {
    if (!mounted || !token) return;

    const revalidateProfile = async () => {
      try {
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
        console.log("Property: Profile revalidated from backend:", profileRes.data);
      } catch (error) {
        console.error("Property: Failed to revalidate profile on mount:", error);
        toast.error("Failed to load latest user profile for ad posting checks.");
      }
    };

    revalidateProfile();
  }, [token, login, mounted]);

const buildPayload = (planType, useWallet = false) => {
  return {
    propertyName: propertyName?.trim(),
    propertyAddress: propertyAddress?.trim(),
    propertyType,
    furnishing: furnishing || null,
    propertyCondition: propertyCondition || null,
    parking: parking || null,
    squareMeter: squareMeter?.trim() || null,
    ownershipStatus: ownershipStatus || null,
    serviceCharge: serviceCharge || null,
    serviceFee: serviceCharge === "yes" && serviceFee ? parseFloat(serviceFee) : null,
    location: propertyAddress?.trim(),
    amenities: [],
    size: squareMeter || null,
    amount: parseFloat(amount) || 0,
    negotiation: negotiation || "no",
    businessCategory: business || null, 
    description: description?.trim() || "",
    plan: planType,
    promotionAmount: planAmounts[planType] || 0,
    useWalletBalance: useWallet
  };
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
      
      // Refresh profile
      try {
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } catch (profileError) {
        console.error("Failed to refresh profile:", profileError);
      }
      
      router.push('/Add');
    } else if (res.data.data?.paymentStatus === "free") {
      toast.success(res.data.message || "Free property ad posted successfully!");
      setShowModalPromote(false);
      setShowWalletModal(false);
      setShowFreeCommercialPropertyModal(true);
    } else {
      // Default success case
      toast.success(res.data.message || "Property ad posted successfully");
      setShowModalPromote(false);
      setShowWalletModal(false);
      
      // Refresh profile
      try {
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } catch (profileError) {
        console.error("Failed to refresh profile:", profileError);
      }
      
      router.push('/view-property-add');
    }
  } catch (error) {
    console.error("Property ad submission error:", error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      toast.error("Server error occurred. Please check your data and try again.");
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Something went wrong posting your property ad. Please try again.");
    }
  }
}, [propertyName, propertyAddress, propertyType, amount, router, token, login]);

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

  const handleGoBack = () => router.back();

  const onPlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <>
      <div className="bg-white shadow-phenom rounded-[12px] p-4 sm:p-6 md:p-10">
        <button
          onClick={handleGoBack}
          className="flex items-center hidden md:block text-[#1031AA] hover:text-[#00A8DF] font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
        </button>

        <h3 className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px] mb-4 text-left md:text-center">
          Commercial Property for Sale
        </h3>

        <form>
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown
              label="Property Condition"
              value={propertyCondition}
              onChange={setPropertyCondition}
              options={propertyConditionOptions}
            />
            <PostDropdown
              label="Is there a parking space"
              value={parking}
              onChange={setParking}
              options={parkingSpaceOptions}
            />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Square Meters (sqm)"
              placeholder="Enter"
              value={squareMeter}
              onChange={(e) => setSquareMeter(e.target.value)}
            />
            <PostDropdown
              label="Are you the owner or an agent of the property"
              value={ownershipStatus}
              onChange={setOwnerShipStatus}
              options={ownershipStatusOptions}
            />
          </div>

          {/* Row 5 */}
          <div className="bg-[#FAFAFA] px-4 py-4 mt-5 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PostDropdown
                label="Is there a service charge?"
                value={serviceCharge}
                onChange={setServiceCharge}
                options={serviceChargeOptions}
              />
              {serviceCharge === "yes" && (
                <InputField
                  label="Service Fee Amount"
                  placeholder="₦ Enter service fee"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(e.target.value)}
                  type="number"
                  min="0"
                />
              )}
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Amount"
              placeholder="₦ Enter your amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0"
            />
            <PostDropdown
              label="Are you open for negotiation?"
              value={negotiation}
              onChange={setNegotiation}
              options={negotiationOptions}
            />
          </div>

          {/* Business Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-[#525252] font-[500] font-inter mb-1">
                Select a business
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

          {/* Description */}
          <div className="mt-4">
            <label className="block mb-1 text-[#525252] font-[500] font-inter">
              Description
            </label>
            <textarea
              placeholder="Enter the description of the property"
              className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              onClick={handlePost}
            disabled={isPosting}
            className={`w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] ${
                  isPosting ? "opacity-70 cursor-wait" : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
              }`}
            >
             Post Ad
          </Button>
          </div>
        </form>

        {/* Terms */}
        <div className="text-center mt-6 font-[400] font-inter text-[12px] px-2">
          <p className="text-[#767676]">
            By clicking on <strong>Post Ad</strong>, you accept to{" "}
            <span className="text-[#000087]">Terms of Use</span>, confirm that
            you will abide by the Safety Tips, and declare that this posting
            does not include any Prohibited items.
          </p>
        </div>
      </div>

      {/* Conditionally render modals only after component has mounted */}
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
              onClose={() => setShowFreeCommercialPropertyModal(false)}
            />
          )}
        </>
      )}
    </>
  );
}