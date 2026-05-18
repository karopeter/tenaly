"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
    borderColor: state.isFocused ? '#000087' : '#d1d5db',
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
  const [propertyFacility, setPropertyFacility] = useState(""); // ✅ Added back
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editingCarAd, setEditingCarAd] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const { profile, token, login } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const carAdId = searchParams.get('carAdId') || null;

  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };

  // ✅ Set mounted first
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ CRITICAL FIX: Fetch draft data from backend
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
        // ✅ Fetch PropertyAd draft by carAdId
        const propertyResponse = await api.get(`/property/draft/${idToUse}`);

        if (!propertyResponse.data || !propertyResponse.data.propertyAd) {
          console.log("⚠️ No PropertyAd draft found");
          setIsLoadingDraft(false);
          return;
        }

        const propertyAd = propertyResponse.data.propertyAd;
        console.log("✅ Loaded PropertyAd draft:", propertyAd);

        // ✅ Also fetch CarAd for images and location
        let carAd = null;
        try {
          const carResponse = await api.get(`/carAdd/${idToUse}`);
          carAd = carResponse.data;
          console.log("✅ Loaded CarAd:", carAd);
        } catch (carError) {
          console.warn("⚠️ Could not load CarAd:", carError);
        }

        // ✅ Pre-fill form fields from PropertyAd
        setPropertyName(propertyAd.propertyName || "");
        setPropertyAddress(propertyAd.propertyAddress || propertyAd.location || "");
        setPropertyType(propertyAd.propertyType || "");
        setFurnishing(propertyAd.furnishing || "");
        setPropertyCondition(propertyAd.propertyCondition || "");
        setParking(propertyAd.parking || "");
        setSquareMeter(propertyAd.squareMeter || "");
        setOwnerShipStatus(propertyAd.ownershipStatus || "");
        setServiceCharge(propertyAd.serviceCharge || "");
        setServiceFee(propertyAd.serviceFee?.toString() || "");
        setPropertyDuration(propertyAd.propertyDuration || "");
        setAmount(propertyAd.amount?.toString() || "");
        setNegotiation(propertyAd.negotiation || "");
        setDescription(propertyAd.description || "");
        setPropertyFacility(propertyAd.propertyFacilities || "");

        // ✅ Set business from either propertyAd or carAd
        const businessId = propertyAd.businessCategory?._id 
          || propertyAd.businessCategory 
          || carAd?.businessCategory?._id 
          || carAd?.businessCategory;
        setBusiness(businessId || "");
        setBusinessCategory(businessId || "");

        // ✅ Store editing state
        setEditingCarAd({
          carAdId: idToUse,
          businessId: businessId,
          category: carAd?.category || 'Commercial Property For Sale',
          location: carAd?.location || propertyAd.propertyAddress || '',
          images: carAd?.propertyImage || [],
        });

        toast.success("Draft loaded successfully! Complete your property ad details.");
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
    const payload = {
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
      propertyFacilities: propertyFacility || null, 
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

      if (res.data.data?.paymentUrl && !useWallet) {
        toast.info("Redirecting to Paystack for payment...");
        setShowModalPromote(false);
        setShowWalletModal(false);
        window.location.href = res.data.data.paymentUrl;
      } else if (res.data.data?.paymentStatus === 'success') {
        toast.success(res.data.message || "Property ad posted successfully!");
        setShowModalPromote(false);
        setShowWalletModal(false);

        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");
        localStorage.setItem('adUpdated', 'true');
        router.push('/Add');

        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } else if (res.data.data?.paymentStatus === "free") {
        toast.success(res.data.message || "Free property ad posted successfully!");
        setShowModalPromote(false);
        setShowWalletModal(false);
        setShowFreeCommercialPropertyModal(true);

        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");
        localStorage.setItem('adUpdated', 'true');
      } else {
        toast.success(res.data.message || "Ad posted successfully");
        setShowModalPromote(false);
        setShowWalletModal(false);
        
        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");

        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      }
    } catch (error) {
      console.error("Ad submission error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error ||
        "Something went wrong posting your ad. Please try again."
      );
    }
  }, [propertyName, propertyAddress, propertyType, amount, router, token, login, editingCarAd, carAdId, buildPayload]);

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

    if (walletBalance >= planCost) {
      setShowModalPromote(false);
      setShowWalletModal(true);
    } else {
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

    if (successfulPaidPlans.length > 0) {
      for (const plan of successfulPaidPlans) {
        const planPriority = planHierarchy[plan.planType] || 0;
        if (planPriority > highestPlanPriority) {
          highestPlanPriority = planPriority;
          highestPlan = plan.planType;
        }
      }
    }

    if (highestPlan !== "free") {
      toast.success(`Using your existing ${highestPlan} plan to post this ad.`);
      await submitAd(highestPlan, false);
    } else {
      setSelectedPlan("basic");
      setShowModalPromote(true);
    }
    } finally {
     setIsPosting(false);
    }
  }, [profile, submitAd, propertyName, propertyAddress, propertyType, amount, isPosting]);

  const handleGoBack = () => router.back();

  const onPlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSaveAsDraft = useCallback(async () => {
    if (isSavingDraft) return;
    setIsSavingDraft(true);
    try {
      const payload = buildPayload('free', false);
      delete payload.plan;
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
      <div className="bg-white shadow-phenom rounded-[12px] p-4 sm:p-6 md:p-10">
        <button
          onClick={handleGoBack}
          className="flex items-center hidden md:block text-[#1031AA] hover:text-[#00A8DF] font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
        </button>

        <h3 className="text-[#525252] font-[500] font-inter text-[14px] md:text-[16px] mb-4 text-left md:text-center">
          {editingCarAd ? "Complete Your Commercial Sale Property Ad" : "Commercial Property for Sale"}
        </h3>

        <form>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Amount"
              placeholder="₦ Enter your amount"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setAmount(value);
                }
              }}
              type="text"
            />
            <PostDropdown
              label="Are you open for negotiation?"
              value={negotiation}
              onChange={setNegotiation}
              options={negotiationOptions}
            />
          </div>

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

          <div className="flex gap-4 justify-center mt-6">
           {!editingCarAd && (
             <Button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSavingDraft}
              className="w-full md:w-[200px] h-[44px] md:rounded-[8px] font-[500] text-[14px] border border-[#CDCDD7] text-[#525252] disabled:opacity-60 disabled:cursor-not-allowed"
            >
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
              className="w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
             {isPosting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Processing...
              </span>
             ): editingCarAd ? "Complete Ad" : "Post Ad"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 font-[400] font-inter text-[12px] px-2">
          <p className="text-[#767676]">
            By clicking on <strong>Post Ad</strong>, you accept to{" "}
            <span className="text-[#000087]">Terms of Use</span>, confirm that
            you will abide by the Safety Tips, and declare that this posting
            does not include any Prohibited items.
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
              onClose={() => setShowFreeCommercialPropertySuccessModal(true)}
            />
          )}
        </>
      )}
    </>
  );
}