"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import Select from 'react-select';
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
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import PromoteAdModal from "../components/PromoteModal/promote-modal";
import FreeSuccessModal from "../components/free-success-modal";


export default function MoreAddPost() {
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
  const [carFeatures, setCarFeatures] = useState("");
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

  // Plan and Modal states
  const [selectedPlan, setSelectedPlan] = useState("basic"); // Default to basic for promotion in modal
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showFreeSuccessModal, setShowFreeSuccessModal] = useState(false);

  // State to track if the component has mounted on the client to prevent hydration errors
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, token, login } = useAuth();

  // Get  carAdId for URL search parameters
  const carAdId = searchParams.get('carAdId'); //This is the ID of the carAd to the link to 
  

  // Define plan hierarchy for determining the highest active plan
  const planHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    vip: 3,
    diamond: 4,
    enterprise: 5,
  };

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

  // Fetch businesses and Paystack script on component mount, guarded by 'mounted'
  useEffect(() => {
    if (!mounted) { // Ensure this effect only runs on the client after hydration
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
  }, [mounted]); // Added 'mounted' to dependency array

  // Explicitly re-fetch profile on component mount or token change, guarded by 'mounted'
  useEffect(() => {
    if (!mounted) { // Ensure this effect only runs on the client after hydration
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
  }, [token, login, mounted]); // Added 'mounted' to dependency array


  const handleGoBack = () => router.back();

  const handleMakeChange = (value) => {
    setSelectedMake(value);
    setSelectedModel("");
    setSelectedYear("");
    setSelectedTrim("");
  }

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setSelectedYear("");
    setSelectedTrim("");
  }


  const buildPayload = (planType) => ({
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
    carKeyFeatures: carFeatures,
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

      const res = await api.post("/vehicles/post-vehicle-ad", payload);

      // CRITICAL LOGIC FOR REDIRECTION
      if (res.data.data && res.data.data.paymentUrl) {
        toast.info("Redirecting to Paystack for payment...");
        setShowModalPromote(false);
        window.location.href = res.data.data.paymentUrl;
      } else if (res.data.data && res.data.data.paymentStatus === 'success') {
        toast.success(res.data.message || "Ad posted successfully using your existing plan!");
        router.push('/view-vehicle-add');
        setShowModalPromote(false);
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      } else if (res.data.data && res.data.data.paymentStatus === "free") {
        toast.success(res.data.message || "Free ad posted successfully!");
        setShowModalPromote(false);
        setShowFreeSuccessModal(true);
      } else {
        toast.success(res.data.message || "Ad posted successfully");
        console.warn("Unexpected successful ad submission response. Response:", res.data);
        setShowFreeSuccessModal(true);
        const profileRes = await api.get("/profile");
        login(profileRes.data, token);
      }
    } catch (error) {
      console.error("Ad submission error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Something went wrong posting your ad. Please try again.");
    }
  }, [selectedMake, selectedModel, selectedYear, selectedTrim, selectedColor, selectedInteriorColor, transmission, vin, registerd, exchange, carFeatures, carType, vehicleBody, fuel, seat, driveTrain, cylinders, engineSize, horsePower, amount, negotiation, business, description, token, login, router]);


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

    const successfulPaidPlans = profile.paidPlans?.filter(p => p.status === "success");
    const hasAnySuccessfulPaidPlan = successfulPaidPlans && successfulPaidPlans.length > 0;

    console.log("Current profile in handlePost (on button click):", profile);
    console.log("Has any successful paid plan (on button click):", hasAnySuccessfulPaidPlan);

    if (hasAnySuccessfulPaidPlan) {
      // Determine the highest active plan from the user's profile
      let highestPlan = "free"; // Default to 'free' as a fallback
      if (successfulPaidPlans) {
        for (const p of successfulPaidPlans) {
          if (planHierarchy[p.planType] > planHierarchy[highestPlan]) {
            highestPlan = p.planType;
          }
        }
      }
      // Set selectedPlan state to the highest active plan for consistency,
      // although it might not be directly used if the modal isn't shown.
      setSelectedPlan(highestPlan);
      await submitAd(highestPlan); // Submit the ad with the determined highest plan
    } else {
      // If no successful paid plan, show the promotion modal, defaulting to "basic"
      setShowModalPromote(true);
    }
  }, [profile, submitAd, setSelectedPlan, planHierarchy]); // Added planHierarchy to dependencies


  return (
    <>
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
          <Sidebar />

          <main className="flex-1">
            <div className="bg-white shadow-phenom md:rounded-[12px] p-8 text-center">
              <div className="flex justify-start mb-6">
                <Button
                  onClick={handleGoBack}
                  className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
                  <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
                </Button>
              </div>
              <h3 className="text-center text-[#525252] fonmt-[500] font-inter md:text-[16px]">Post your Ad</h3>
              <form>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Make"
                    value={selectedMake}
                    onChange={handleMakeChange}
                    options={carMakes}
                  />

                  <PostDropdown
                    label="Model"
                    value={selectedModel}
                    onChange={handleModelChange}
                    options={selectedMake ? carModels[selectedMake] : []}
                    disabled={!selectedMake}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Year"
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={selectedModel ? carYears[selectedModel] : []}
                    disabled={!selectedModel}
                  />

                  <PostDropdown
                    label="Trim"
                    value={selectedTrim}
                    onChange={setSelectedTrim}
                    options={selectedModel ? carTrims[selectedModel] : []}
                    disabled={!selectedModel}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Car Color"
                    value={selectedColor}
                    onChange={setSelectedColor}
                    options={carColors}
                  />
                  <PostDropdown
                    label="Interior Color"
                    value={selectedInteriorColor}
                    onChange={setSelectedInteriorColor}
                    options={interiorColors}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Transmission"
                    options={carTransmissions}
                    value={transmission}
                    onChange={setTransmission}
                  />
                  <InputField
                    label="VIN / Chassis Number"
                    placeholder="Enter"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="flex justify-between items-center"
                  />
                  <div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Is the car registered?"
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
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <PostDropdown
                    label="Car Key Features"
                    options={carKeyFeatures}
                    value={carFeatures}
                    onChange={setCarFeatures}
                  />
                  <PostDropdown
                    label="Car Type"
                    options={carTypes}
                    value={carType}
                    onChange={setCarType}
                  />
                </div>
                { /* this cannot be editted. it fills automatically  based on the selection */ }
                <div
                  className="bg-[#FAFAFA] md:pt-[16px]
                    md:pr-[12px] md:mt-5 md:pb-[16px] md:pl-[12px]
                    md:h-[276px] md:h-auto md:rounded-[8px]">
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Body"
                      value={vehicleBody}
                      onChange={setVehicleBody}
                      options={vehicleBodyTypes}
                    />
                    <PostDropdown
                      label="Fuel"
                      value={fuel}
                      onChange={setFuel}
                      options={fuelTypes}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Seat"
                      value={seat}
                      onChange={setSeat}
                      options={seatTypes}
                    />
                    <PostDropdown
                      label="Drive train"
                      value={driveTrain}
                      onChange={setDriveTrain}
                      options={driveTrains}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Number of cylinders"
                      value={cylinders}
                      onChange={setCylinders}
                      options={numCylinders}
                    />
                    <PostDropdown
                      label="Engine Sizes (cc)"
                      value={engineSize}
                      onChange={setEngineSize}
                      options={engineSizes}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Horse Power (hp)"
                      value={horsePower}
                      onChange={setHorzePower}
                      options={horsePowerOptions}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    label="Amount"
                    placeholder="₦ Enter your amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min="0"
                    step="any"
                  />
                  <PostDropdown
                    label="Are you opened for negotiation"
                    value={negotiation}
                    onChange={setNegotiation}
                    options={negotiationOptions}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <Select
                    options={businessOptions}
                    value={businessOptions.find((opt) => opt.value === business)}
                    onChange={(selected) => setBusiness(selected?.value)}
                    placeholder="Select a business"
                    isClearable
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">Description</label>
                  <textarea
                    placeholder="Enter the description of the vehicle"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                  >
                  </textarea>
                </div>
                <div className="flex justify-center mt-5">
                  <Button
                    type="button"
                    onClick={handlePost}
                    className="md:w-[262px] md:h-[44px] md:rounded-[8px]
                      md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px]
                      font-[500] md:text-[14px] bg-[#EDEDED] text-[#CDCDD7]
                      bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                    Post Ad
                  </Button>
                </div>
              </form>
              <div className="text-center mt-5 font-[400] font-inter md:text-[12px]">
                <p className="text-[#767676]">By clicking on Post Ad, you accept to
                  <span className="text-[#000087]"> Terms of Use,</span>
                  confirm that you will abide by the Safety Tips,
                  <br />
                  and declare that this posting does not include any Prohibited items.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Conditionally render modals only after the component has mounted on the client */}
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
