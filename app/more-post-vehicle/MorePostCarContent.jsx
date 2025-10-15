"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Select from "../components/clientOnlySelect";
import { useAuth } from "../context/AuthContext";
import {
  carMakes,
  carModels,
  carYears,
  carTrims,
  carColors,
  interiorColors,
  carTransmissions,
  registrationStatus,
  exchangeOptions,
  carKeyFeatures,
  carTypes,
  vehicleBodyTypes,
  fuelTypes,
  seatTypes,
  driveTrains,
  numCylinders,
  engineSizes,
  horsePowerOptions,
  negotiationOptions
} from "../lib/carData";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import MultiSelectDropdown from "../components/dropdowns/MultiSelectDropdown";
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import WalletPaymentModal from "../components/WalletModal/walletModal";
import FreeSuccessModal from "../components/free-success-modal";
import Link from "next/link";

// Define plan amounts
const planAmounts = {
  free: 0,
  basic: 15000,
  premium: 30000,
  vip: 45000,
  diamond: 60000,
  enterprise: 100000
};

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

export default function MorePostCarContent() {
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTrim, setSelectedTrim] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("");
  const [transmission, setTransmission] = useState("");
  const [vin, setVin] = useState("");
  const [registerd, setRegistered] = useState("");
  const [exchange, setExchange] = useState("");
  const [carFeatures, setCarFeatures] = useState([]);
  const [carType, setCarType] = useState("");
  const [vehicleBody, setVehicleBody] = useState("");
  const [fuel, setFuel] = useState("");
  const [seat, setSeat] = useState("");
  const [driveTrain, setDriveTrain] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [horsePower, setHorzePower] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessOptions, setBusinessOptions] = useState([]);
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");

  // Modal states
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showFreeSuccessModal, setShowFreeSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);

 const [editingCarAd, setEditingCarAd] = useState(null);



  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, token, login } = useAuth();

  const carAdId = searchParams.get('carAdId');

  // Define plan hierarchy for determining the highest active plan
  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };


  // load all makes on mount 
   useEffect(() => {
    fetch("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json")
      .then(res => res.json())
      .then(data => {
        const makes = data.Results.map(m => ({
          id: m.MakeId,
          name: m.MakeName
        }));
        setCarMakes(makes);
      })
      .catch(err => console.error("Error fetching makes:", err));
  }, []);

  useEffect(() => {
    if (!selectedMake) return;

    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`)
      .then(res => res.json())
      .then(data => {
        const models = data.Results.map(m => ({
          id: m.Model_ID,
          name: m.Model_Name
        }));
        setCarModels(models);
      })
      .catch(err => console.error("Error fetching models:", err));
  }, [selectedMake]);


 // Check if we editing an incomplete Ad 
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
      setSelectedMake(carAdData.make || "");
      setSelectedModel(carAdData.model || "");
      setSelectedYear(carAdData.year || "");
      setSelectedTrim(carAdData.trim || "");
      setSelectedColor(carAdData.color || "");
      setSelectedInteriorColor(carAdData.interiorColor || "");
      setTransmission(carAdData.transmission || "");
      setVin(carAdData.vinChassisNumber || "");
      setRegistered(carAdData.carRegistered || "");
      setExchange(carAdData.exchangePossible || "");
      setCarFeatures(Array.isArray(carAdData.carKeyFeatures) ? carAdData.carKeyFeatures : []);
      setCarType(carAdData.carType || "");
      setVehicleBody(carAdData.carBody || "");
      setFuel(carAdData.fuel || "");
      setSeat(carAdData.seat || "");
      setDriveTrain(carAdData.driveTrain || "");
      setCylinders(carAdData.numberOfCylinders || "");
      setEngineSize(carAdData.engineSizes || "");
      setHorzePower(carAdData.horsePower || "");
      setAmount(carAdData.amount?.toString() || "");
      setNegotiation(carAdData.negotiation || "");
      setBusiness(carAdData.businessCategory._id || "");
      setDescription(carAdData.description || "");

      toast.info("Complete your vehicle details. Images are already uploaded");
    } catch (error) {
      console.error("Error loading CarAd data:", error);

      // Clear invalid data
      localStorage.removeItem('editingCarAdId');
      localStorage.removeItem('editingCarAdData');
      localStorage.removeItem('editingAdType');
    }
  }
}, []);


  // Set mounted to true after the component has mounted
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
      } catch (error) {
        console.error("Failed to revalidate profile:", error);
        toast.error("Failed to load latest user profile.");
      }
    };

    revalidateProfile();
  }, [token, login, mounted]);

  const handleGoBack = () => router.back();

  const handleMakeChange = (value) => {
    setSelectedMake(value);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTrim("");
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setSelectedYear("");
    setSelectedTrim("");
  };

  const buildPayload = (planType, useWallet = false) => {
  const payload = {
    vehicleType: selectedMake,
    model: selectedModel,
    year: selectedYear,
    trim: selectedTrim,
    color: selectedColor,
    interiorColor: selectedInteriorColor,
    transmission,
    vinChassisNumber: vin,
    carRegistered: registerd,
    exchangePossible: exchange,
    carKeyFeatures:  Array.isArray(carKeyFeatures) 
     ? carFeatures.map((f) => (typeof f === "string" ? f : f.name))
     : [],
    carType,
    carBody: vehicleBody,
    fuel,
    seat,
    driveTrain,
    numberOfCylinders: cylinders,
    engineSizes: engineSize,
    horsePower,
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

    const res = await api.post("/vehicles/post-vehicle-ad", payload);

    // ✅ Success handlers
    if (res.data.data?.paymentUrl && !useWallet) {
      toast.info("Redirecting to Paystack for payment...");
      setShowModalPromote(false);
      setShowWalletModal(false);
      window.location.href = res.data.data.paymentUrl;

      // ⬅️ Don’t clear localStorage yet (wait for payment success callback)
    } else if (res.data.data?.paymentStatus === "success") {
      toast.success(res.data.message || "Ad posted successfully!");
      setShowModalPromote(false);
      setShowWalletModal(false);

      // 🔑 Clear incomplete ad tracking
      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingAdData");

      localStorage.setItem('adUpdated', 'true');
      router.push("/Add");
    } else if (res.data.data?.paymentStatus === "free") {
      toast.success(res.data.message || "Free ad posted successfully!");
      setShowModalPromote(false);
      setShowWalletModal(false);
      setShowFreeSuccessModal(true);

      // 🔑 Clear incomplete ad tracking
      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingAdData");
       localStorage.setItem('adUpdated', 'true');
    } else {
      toast.success(res.data.message || "Ad posted successfully");
      setShowModalPromote(false);
      setShowWalletModal(false);
      setShowFreeSuccessModal(true);

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
}, [
  selectedMake, selectedModel, selectedYear, selectedTrim,
  selectedColor, selectedInteriorColor, transmission, vin,
  registerd, exchange, carFeatures, carType, vehicleBody,
  fuel, seat, driveTrain, cylinders, engineSize, horsePower,
  amount, negotiation, business, description,
  token, login, router, editingCarAd, carAdId
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


    //setSelectedPlan(highestPlan === "free" ? "basic" : highestPlan);

    if (highestPlan !== "free") {
      console.log("Using existing paid plan:", highestPlan);
      toast.success(`Post created successfully Using your existing ${highestPlan} plan to post this ad.`);
     await submitAd(highestPlan, false);
    }  else {
       // User has no paid plans, show promote modal
      console.log("No paid plans found, showing promote modal");
      setSelectedPlan("basic");
      setShowModalPromote(true);
      return;
    }
  }, [profile, submitAd, selectedMake, selectedModel, amount]);

  const handleSaveAsDraft = useCallback(async () => {
    try {
     const payload = buildPayload('free', false);
     delete payload.plan; // Remove plan so backend sets it 
     delete payload.promotionAmount; // Not needed for drafts 
     delete payload.useWalletBalance; // Not needed for drafts 

     const res = await api.post("/vehicles/save-draft", payload);

     const savedPlan = res.data.data?.plan || 'free';

     toast.success(`Vehicle ad saved as draft with ${savedPlan} plan!`);

     localStorage.removeItem("editingCarAdId");
     localStorage.removeItem("editingCarAdData");
     localStorage.removeItem("editingAdType");

     router.push("/Add");
    } catch (error) {
      console.error("Draft saved error:", error);
      toast.error(error.response?.data?.error || "Failed to save draft!");
    }
  }, [buildPayload, router]);

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
          Post Vehicle Ad
        </h3>

        <form>
          {/* Form Fields Grouped */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <PostDropdown
               label="Make" 
               value={selectedMake} 
               onChange={setSelectedMake} 
               options={carMakes} />
            <PostDropdown
              label="Model"
              value={selectedModel}
              onChange={setSelectedModel}
             options={carModels}
              disabled={!selectedMake}
            />

            <PostDropdown
              label="Year"
              value={selectedYear}
              onChange={setSelectedYear}
              options={selectedModel ? [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] : []}
              disabled={!selectedModel}
            />
            <PostDropdown
              label="Trim"
              value={selectedTrim}
              onChange={setSelectedTrim}
             options={selectedModel ? ["Base", "Sport", "Luxury"] : []}
              disabled={!selectedModel}
            />

            <PostDropdown label="Color" value={selectedColor} onChange={setSelectedColor} options={carColors} />
            <PostDropdown
              label="Interior Color"
              value={selectedInteriorColor}
              onChange={setSelectedInteriorColor}
              options={interiorColors}
            />

            <PostDropdown label="Transmission" options={carTransmissions} value={transmission} onChange={setTransmission} />
            <InputField
              label="VIN / Chassis Number"
              placeholder="Enter"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full"
            />

            <PostDropdown
              label="Is it registered?"
              options={registrationStatus}
              value={registerd}
              onChange={setRegistered}
            />
            <PostDropdown
              label="Is exchange possible?"
              options={exchangeOptions}
              value={exchange}
              onChange={setExchange}
            />

            <MultiSelectDropdown
             label="Key Features"
             options={carKeyFeatures}
             value={carFeatures}
             onChange={setCarFeatures}
            />
            
            <PostDropdown label="Type" options={carTypes} value={carType} onChange={setCarType} />
          </div>

          {/* Non-editable section */}
          <div className="bg-[#FAFAFA] rounded-[8px] p-4 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <PostDropdown label="Body" value={vehicleBody} onChange={setVehicleBody} options={vehicleBodyTypes} />
              <PostDropdown label="Fuel" value={fuel} onChange={setFuel} options={fuelTypes} />

              <PostDropdown label="Seat" value={seat} onChange={setSeat} options={seatTypes} />
              <PostDropdown label="Drive train" value={driveTrain} onChange={setDriveTrain} options={driveTrains} />

              <PostDropdown label="Number of cylinders" value={cylinders} onChange={setCylinders} options={numCylinders} />
              <PostDropdown label="Engine Sizes (cc)" value={engineSize} onChange={setEngineSize} options={engineSizes} />

              <PostDropdown label="Horse Power (hp)" value={horsePower} onChange={setHorzePower} options={horsePowerOptions} />
            </div>
          </div>

          {/* Amount and Negotiation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
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
              label="Are you opened for negotiation"
              value={negotiation}
              onChange={setNegotiation}
              options={negotiationOptions}
            />
          </div>

          {/* Business Select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
            <Select
              options={businessOptions}
              value={businessOptions.find((opt) => opt.value === business)}
              onChange={(selected) => setBusiness(selected?.value)}
              placeholder="Select a business"
              isClearable
              styles={customStyles}
            />
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block mb-1 text-[#525252] font-[500] font-inter">Description</label>
            <textarea
              placeholder="Enter the description of the vehicle"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Post Button */}
          <div className="flex gap-4 justify-center mt-5">
            <Button
              type="button"
              onClick={handleSaveAsDraft}
            className="w-full md:w-[200px] h-[44px] md:rounded-[8px] 
            font-[500] text-[14px] border border-[#CDCDD7] text-[#525252]"
            >
            Save as Draft
            </Button>

             <Button
              type="button"
              onClick={handlePost}
              className="w-full md:w-[262px] h-[44px] md:rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
            >
             Post Ad
            </Button>
          </div>
        </form>

        {/* Terms */}
        <div className="text-center mt-5 font-[400] font-inter text-sm md:text-[12px] leading-relaxed px-4">
          <p className="text-[#767676]">
            By clicking on <strong>Post Ad</strong>, you accept to{" "}
            <Link href="/terms-condition" className="text-[#000087]">Terms of Use</Link>, confirm that you will abide by the Safety Tips, and declare that this posting does not include any Prohibited items.
          </p>
        </div>
      </div>

      {/* Conditionally render modals only after component has mounted */}
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