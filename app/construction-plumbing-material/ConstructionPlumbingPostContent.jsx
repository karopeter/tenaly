"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Select from "../components/clientOnlySelect";
import { useAuth } from "../context/AuthContext";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import Img from "../components/Image";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import WalletPaymentModal from "../components/WalletModal/walletModal";
import FreeSuccessModal from "../components/free-success-modal";
import Link from "next/link";

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

export default function ConstructionPlumbingPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, token, login } = useAuth();

  // Form states
  const [constructionTitle, setConstructionTitle] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [constructionMaterial, setConstructionMaterial] = useState("");
  const [condition, setCondition] = useState("");
  const [constructionBrand, setConstructionBrand] = useState("");
  
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  
  // UI states
  const [businessOptions, setBusinessOptions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showFreeSuccessModal, setShowFreeSuccessModal] = useState(false);
  const [editingCarAd, setEditingCarAd] = useState(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  const carAdId = searchParams.get('carAdId');

  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };

  // ✅ Fetch draft data from backend on mount
  useEffect(() => {
    const fetchDraftData = async () => {
      const carAdIdFromStorage = localStorage.getItem('editingCarAdId');
      const carAdIdFromQuery = carAdId;
      const adType = localStorage.getItem('editingAdType');

      const idToUse = carAdIdFromQuery || carAdIdFromStorage;

      console.log("🔍 Checking for draft:", { 
        carAdIdFromQuery, 
        carAdIdFromStorage, 
        adType,
        idToUse 
      });

    //   if (!idToUse || adType !== 'pets') {
    //     console.log("⚠️ No pets draft to load");
    //     return;
    //   }

    if (!carAdIdFromQuery && !carAdIdFromStorage) {
      console.log("⚠️ No draft to load - creating new ad");
      return; 
    }

    const isEditMode = searchParams.get('edit') === 'true';
    const isDraftMode = searchParams.get('draft') === 'true';

    if (!isEditMode && isDraftMode && !idToUse) {
      console.log("⚠️ Fresh ad creation - skipping draft load");
      return;
    }

      setIsLoadingDraft(true);

      try {
        const constructionResponse = await api.get(`/construction/draft/${idToUse}`);
                 
       if (!constructionResponse.data || !constructionResponse.data.constructionAd) {
         console.log("⚠️ No Construction draft found");
         setIsLoadingDraft(false);
         return;
      }   
         
      const constructionAd = constructionResponse.data.constructionAd;
      console.log("✅ Loaded ConstructionAd draft:", constructionAd);
         
     let carAd = null;
        try {
         const carResponse = await api.get(`/carAdd/get-car-byId/${idToUse}`);
         carAd = carResponse.data.ad;
         console.log("✅ Loaded CarAd:", carAd);
        } catch (carError) {
          console.warn("⚠️ Could not load CarAd:", carError);
        }
         
       setConstructionTitle(constructionAd.constructionTitle || "");
       setConstructionType(constructionAd.constructionType || "");
       setConstructionMaterial(constructionAd.constructionMaterial || "");
       setCondition(constructionAd.condition || "");
       setConstructionBrand(constructionAd.constructionBrand || "");
      setAmount(constructionAd.amount?.toString() || "");
      setNegotiation(constructionAd.negotiation || "");
     setDescription(constructionAd.description || "");
         
     const businessId = constructionAd.businessCategory?._id 
           || constructionAd.businessCategory 
           || carAdId?.businessCategory?._id 
           || carAd?.businessCategory;
          setBusiness(businessId || "");
         
         
       setEditingCarAd({
         carAdId: idToUse,
         businessId: businessId,
         category: carAd?.category || 'Plumbing Material & Fittings',
         location: carAd?.location || '',
         images: carAd?.constructionImage || [],
      });
         
                 
      toast.success("Draft loaded successfully! Complete your ad details.");
      setIsLoadingDraft(false);
    } catch (error) {
       console.error("❌ Error loading draft:", error);
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
  }, [mounted, carAdId, searchParams]);

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
    if (!mounted) return;

    const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        const options = res.data.map((b) => ({
          label: b.businessName,
          value: b._id,
        }));
        setBusinessOptions(options);
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
    if (!mounted || !token) return;

    const revalidateProfile = async () => {
      try {
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } catch (error) {
        console.error("Failed to revalidate profile:", error);
        toast.error("Failed to load latest user profile.");
      }
    };

    revalidateProfile();
  }, [token, login, mounted]);

  const handleGoBack = () => router.back();


  const buildPayload = (planType, useWallet = false) => {
    const payload = {
      constructionTitle,
      constructionType,
      constructionMaterial,
      condition,
      constructionBrand,
      amount: parseFloat(amount),
      negotiation,
      businessCategory: business,
      description,
      plan: planType,
      promotionAmount: planAmounts[planType] || 0,
      useWalletBalance: useWallet,
    };

    const storedCarAdId = localStorage.getItem('editingCarAdId');
    if (storedCarAdId) {
      payload.carAdId = storedCarAdId;
      console.log("✅ Including carAdId from localStorage:", storedCarAdId);
    } else if (editingCarAd?.carAdId) {
      payload.carAdId = editingCarAd.carAdId;
      console.log("✅ Including carAdId from editingCarAd state:", editingCarAd.carAdId);
    } else if (carAdId) {
      payload.carAdId = carAdId;
      console.log("✅ Including carAdId from query params:", carAdId);
    }

    return payload;
  };

  const submitAd = useCallback(async (planToSubmit, useWallet = false) => {
    try {
      const payload = buildPayload(planToSubmit, useWallet);

      const res = await api.post("/construction/create-construction-ad", payload);

      if (res.data.data?.paymentUrl && !useWallet) {
        toast.info("Redirecting to Paystack for payment...");
        setShowModalPromote(false);
        setShowWalletModal(false);
        window.location.href = res.data.data.paymentUrl;
      } else if (res.data.data?.paymentStatus === "success") {
        toast.success(res.data.message || "Ad posted successfully!");
        setShowModalPromote(false);
        setShowWalletModal(false);

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
  }, [
   constructionTitle, constructionType, constructionMaterial, condition, constructionBrand,  amount, negotiation, business, description,
    token, login, router, editingCarAd, carAdId, buildPayload
  ]);

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
    if (!profile) {
      toast.error("You need to be logged in to post an ad.");
      return;
    }

    const successfulPaidPlans = profile.paidPlans?.filter(p => p.status === "success");
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

    console.log("Highest paid plan found:", highestPlan);

    if (highestPlan !== "free") {
      console.log("Using existing paid plan:", highestPlan);
      toast.success(`Using your existing ${highestPlan} plan to post this ad.`);
      await submitAd(highestPlan, false);
    } else {
      console.log("No paid plans found, showing promote modal");
      setSelectedPlan("basic");
      setShowModalPromote(true);
      return;
    }
  }, [profile, submitAd]);

  const handleSaveAsDraft = useCallback(async () => {
    try {
      const payload = buildPayload('free', false);
      delete payload.plan;
      delete payload.promotionAmount;
      delete payload.useWalletBalance;


      payload.isDraft = true;

      const res = await api.post("/construction/save-draft", payload);

      const savedPlan = res.data.data?.plan || 'free';

      toast.success(`Construction & Building ad saved as draft with ${savedPlan} plan!`);

      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingCarAdData");
      localStorage.removeItem("editingAdType");

      router.push("/Add");
    } catch (error) {
      console.error("Draft saved error:", error);
      toast.error(error.response?.data?.error || "Failed to save draft!");
    }
  }, [buildPayload, router]);

  if (isLoadingDraft) {
    return (
      <div className="bg-white shadow-phenom rounded-[12px] p-5 md:p-10 flex items-center justify-center min-h-[400px]">
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
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
        </button>

        <h3 className="text-[#525252] font-[500] font-inter text-[16px] mb-4 text-left md:text-center">
          {editingCarAd ? "Complete Your Pluming Materials & Fittings Ad" : "Post Plumbing Material & Fittings Ad"}
        </h3>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField
              label="Title"
              placeholder="Enter Title"
              value={constructionTitle}
              onChange={(e) => setConstructionTitle(e.target.value)}
            />

            <PostDropdown 
               label="Type"
               value={constructionType}
               onChange={setConstructionType}
               options={[
                 "Toilet Seat",
                "Tap",
                "Faucet",
                "Shower",
                "Hose",
                "Connector",
                "Water Pump",
                "Tank",
                "Sink",
                "Others",
                "Vase"
               ]}
            />

            <PostDropdown 
               label="Condition"
               value={condition}
               onChange={setCondition}
               options={[
                "Brand New",
                "Used"
               ]}
            />
             <PostDropdown 
             label="Material"
             value={constructionMaterial}
             onChange={setConstructionMaterial}
             options={[
              "Stainless Steel",
              "PVC",
              "Copper",
              "Plastic",
              "Brass",
              "Others"
             ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField 
               label="Brand (Optional)"
               placeholder="Enter Brand"
               value={constructionBrand}
               onChange={(e) => setConstructionBrand(e.target.value)}
              />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              label="Are you open for negotiation"
              value={negotiation}
              onChange={setNegotiation}
              options={["Yes", "No"]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-4">
              <label htmlFor="business" className="block text-[#525252] font-[500] mb-1">Select your business</label>
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
            <label className="block mb-1 text-[#525252] font-[500] font-inter">Description</label>
            <textarea
              placeholder="Enter"
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
                className="w-full md:w-[200px] h-[44px] md:rounded-[8px] font-[500] text-[14px] border border-[#CDCDD7] text-[#525252]"
              >
                Save as Draft
              </Button>
            )}

            <Button
              type="button"
              onClick={handlePost}
              className="w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
            >
              {editingCarAd ? "Complete Ad" : "Post Ad"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-5 font-[400] font-inter text-sm md:text-[12px] leading-relaxed px-4">
          <p className="text-[#767676]">
            By clicking on <strong>Post Ad</strong>, you accept to{" "}
            <Link href="/terms-condition" className="text-[#000087]">Terms of Use</Link>, confirm that you will abide by the Safety Tips, and declare that this posting does not include any Prohibited items.
          </p>
        </div>
      </div>

      {mounted && (
        <>
          {showModalPromote && (
            <PromoteAdModal
              selectedPlan={selectedPlan}
              onPlanSelect={setSelectedPlan}
              onCancel={postAdForFree}
              onConfirm={promoteAd}
              onClose={() => setShowModalPromote(false)}
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
          
          {showFreeSuccessModal && (
            <FreeSuccessModal
              onClose={() => setShowFreeSuccessModal(false)}
            />
          )}
        </>
      )}
    </>
  );
}