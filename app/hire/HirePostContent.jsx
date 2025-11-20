"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Select from "../components/clientOnlySelect";
import { useAuth } from "../context/AuthContext";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import WalletPaymentModal from "../components/WalletModal/walletModal";
import FreeSuccessModal from "../components/free-success-modal";
import Link from "next/link";

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

export default function HirePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, token, login } = useAuth();

  // Form states
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [otherLinks, setOtherLinks] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
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

  // Handle resume file upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setResumeFile(file);
    setResumePreview(file.name);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumePreview("");
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

      if (!carAdIdFromQuery && !carAdIdFromStorage) {
        console.log("⚠️ No draft to load - creating new ad");
        return;
      }

      const isEditMode = searchParams.get('edit') === 'true';
      const isDraftMode = searchParams.get('draft') === 'true';

      if (!isEditMode && !isDraftMode && !idToUse) {
        console.log("⚠️ Fresh ad creation - skipping draft load");
        return;
      }

      setIsLoadingDraft(true);

      try {
        // ✅ Fetch HireAd draft by carAdId
        const hireResponse = await api.get(`/hire/draft/${idToUse}`);
        
        if (!hireResponse.data || !hireResponse.data.hireAd) {
          console.log("⚠️ No HireAd draft found");
          setIsLoadingDraft(false);
          return;
        }

        const hireAd = hireResponse.data.hireAd;
        console.log("✅ Loaded HireAd draft:", hireAd);

        // ✅ Also fetch CarAd for images and location
        let carAd = null;
        try {
          const carResponse = await api.get(`/carAdd/get-car-byId/${idToUse}`);
          carAd = carResponse.data.ad;
          console.log("✅ Loaded CarAd:", carAd);
        } catch (carError) {
          console.warn("⚠️ Could not load CarAd:", carError);
        }

        setTitle(hireAd.hireTitle || "");
        setGender(hireAd.hireGender || "");
        setJobType(hireAd.jobType || "");
        setExperienceLevel(hireAd.experienceLevel || "");
        setWorkMode(hireAd.workMode || "");
        setYearsOfExperience(hireAd.yearsOfExperience || "");
        setRelationshipStatus(hireAd.relationshipStatus || "");
        setPortfolioLink(hireAd.portfolioLink || "");
        setOtherLinks(hireAd.otherLinks || "");
        setSkills(hireAd.skills || "");
        setPricingType(hireAd.pricingType || "");
        setSalaryRange(hireAd.salaryRange || "");
        setNegotiation(hireAd.negotiation || "");
        setDescription(hireAd.description || "");

        // Set resume preview if exists
        if (hireAd.resume) {
          setResumePreview(hireAd.resume);
        }

        // ✅ Set business from either hireAd or carAd
        const businessId = hireAd.businessCategory?._id 
          || hireAd.businessCategory 
          || carAd?.businessCategory?._id 
          || carAd?.businessCategory;
        setBusiness(businessId || "");

        // ✅ Store editing state
        setEditingCarAd({
          carAdId: idToUse,
          businessId: businessId,
          category: carAd?.category || 'Hire Tech & IT',
          location: carAd?.location || '',
          images: carAd?.hireImage || [],
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
      hireTitle: title,
      hireGender: gender,
      jobType,
      experienceLevel,
      workMode,
      yearsOfExperience,
      relationshipStatus,
      portfolioLink,
      otherLinks,
      skills,
      pricingType,
      salaryRange: parseFloat(salaryRange),
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
      const formData = new FormData();
      const payload = buildPayload(planToSubmit, useWallet);

      // Append all text fields
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      // Append resume file if exists
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.post("/hire/create-hire-ad", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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
    title, gender, jobType, experienceLevel, workMode, yearsOfExperience,
    relationshipStatus, portfolioLink, otherLinks, skills, resumeFile,
    pricingType, salaryRange, negotiation, business, description,
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
      const formData = new FormData();
      const payload = buildPayload('free', false);
      delete payload.plan;
      delete payload.promotionAmount;
      delete payload.useWalletBalance;

      payload.isDraft = true;

      // Append all text fields
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      // Append resume file if exists
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.post("/hire/save-draft", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const savedPlan = res.data.data?.plan || 'free';

      toast.success(`Hire ad saved as draft with ${savedPlan} plan!`);

      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingCarAdData");
      localStorage.removeItem("editingAdType");

      router.push("/Add");
    } catch (error) {
      console.error("Draft saved error:", error);
      toast.error(error.response?.data?.error || "Failed to save draft!");
    }
  }, [buildPayload, resumeFile, router]);

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
          {editingCarAd ? "Complete Hire Ad" : "Post Hire Ad"}
        </h3>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <InputField
              label="Title"
              placeholder="E.g. Experienced Graphic Designer Available for Hire"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <PostDropdown
              label="Gender"
              value={gender}
              onChange={setGender}
              options={["Male", "Female"]}
            />
            <PostDropdown
              label="Job Type"
              value={jobType}
              onChange={setJobType}
              options={[
                "Full-Time",
                "Part-Time",
                "Contract",
                "Internship"
              ]}
            />
            <PostDropdown
              label="Experience Level"
              value={experienceLevel}
              onChange={setExperienceLevel}
              options={[
               "Beginner Level",
               "Intermediate",
               "Expert",
               "Certified Professional"
              ]}
            />
            <PostDropdown 
              label="Work Mode"
              value={workMode}
              onChange={setWorkMode}
              options={[
                "Remote",
                "On-site",
                "Hybrid"
              ]}
            />
            <InputField
              label="Years of Experience"
              placeholder="E.g. 3-5 years"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
            />
            <PostDropdown 
              label="Relationship Status (Optional)"
              value={relationshipStatus}
              onChange={setRelationshipStatus}
              options={[
                "Single",
                "Married",
                "Prefer not to say"
              ]}
            />
            <InputField
              label="Portfolio Link (Optional)"
              placeholder="https://yourportfolio.com"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
            />
            <InputField
              label="Other Important Links (Optional)"
              placeholder="Enter"
              value={otherLinks}
              onChange={(e) => setOtherLinks(e.target.value)}
            />
            <InputField
              label="Skills"
              placeholder="E.g Graphic Designer, Sales, Data Entry, Eletrical Repairs, Teaching"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {/* Resume Upload Section */}
          <div className="mt-4">
            <label className="block text-[#525252] font-[500] mb-2">
              Upload necessary document like CV or Resume
            </label>
            <div className="border-2 border-dashed border-[#CDCDD7] rounded-lg p-6 text-center">
              {!resumePreview ? (
                <>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleResumeChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop files here or{" "}
                      <span className="text-[#000087] underline">click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">
                        {resumePreview.split('.').pop().toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 truncate max-w-xs">
                      {resumePreview.split('/').pop() || resumePreview}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PostDropdown
              label="Pricing type"
              value={pricingType}
              onChange={setPricingType}
              options={[
                "Per Hour",
                "Per Session",
                "Per Week",
                "Per Day",
                "Per Project",
                "Per Month"
              ]}
            />
            <InputField
              label="Expected Salary Range"
              placeholder="Enter business category"
              value={salaryRange}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setSalaryRange(value);
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
            <div>
              <label htmlFor="business" className="block text-[#525252] font-[500] mb-1">
                Select your business
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
              placeholder="Enter Description"
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
            <Link href="/terms-condition" className="text-[#000087]">
              Terms of Use
            </Link>, confirm that you will abide by the Safety Tips, and declare 
            that this posting does not include any Prohibited items.
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