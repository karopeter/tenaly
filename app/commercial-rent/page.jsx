"use client";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import Select from 'react-select';
import Img from "../components/Image";
import { 
  propertyTypeOptions, 
  furnishingOptions, 
  parkingSpaceOptions, 
  ownershipStatusOptions, 
  serviceChargeOptions, 
  propertyDurationOptions, 
  negotiationOptions
} from "../lib/propertyData";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import InputField from "../components/input";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import FreePropertySuccessModal from "../components/free-property-sucess-modal";


export default function MorePropertyPost() {
  const router = useRouter();
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
  const [showModal, setShowModal] = useState(false);
  const [showModalPromote, setShowModalPromote] = useState(false);
  const [showFreeCommercialPropertySuccessModal, setShowFreeCommercialPropertyModal] = useState(false);

  
    // New state to track if the component has mounted on the client
    const [mounted, setMounted] = useState(false);

    const { profile, token, login } = useAuth();

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
    parking,
    squareMeter,
    ownershipStatus,
    serviceCharge,
    serviceFee,
    propertyDuration,
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
  }, [ propertyName, propertyAddress, propertyType, furnishing, parking, squareMeter, ownershipStatus, serviceCharge, serviceFee, propertyDuration, amount, negotiation, business, description, token, login, router]); 

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
  

 

  const handleGoBack  = () => router.back();
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />

           <main className="flex-1">
              <div className="bg-white shadow-phenom md:rounded-[12px] p-10 text-center">
              <Button
                onClick={handleGoBack}
                className="flex items-center text-left text-[#1031AA] hover:text-[#00A8DF] font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-1 text-[#141B34]"  /> 
                <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
              </Button>
                <h3 
                 className="text-center text-[#525252] 
                 font-[500] font-inter md:text-[16px] mt-8 mb-4">
                    Commercial Propert for rent</h3>
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
                     options={propertyTypeOptions}
                   />

                   <PostDropdown 
                     label="Furnishing"
                     value={furnishing}
                    onChange={setFurnishing}
                    options={furnishingOptions}
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
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
                     onChange={e => setSquareMeter(e.target.value)}
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                   <PostDropdown
                     label="Are you the owner or an agent of the property?"
                     value={ownershipStatus}
                     onChange={setOwnerShipStatus}
                     options={ownershipStatusOptions}
                   />
                   <div></div> {/* optional placeholder to maintain layout */}
                </div>
                  <div className="bg-[#FAFAFA] px-3 py-2 p-5 md:h-auto mt-5">
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <PostDropdown
                          label="Is there a service charge?"
                          value={serviceCharge}
                          onChange={setServiceCharge}
                          options={serviceChargeOptions}
                        />
                       <div></div> {/* optional placeholder to maintain layout */}
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
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
                        onChange={e => setAmount(e.target.value)}
                      />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Are you open for negotiation?"
                      value={negotiation}
                      onChange={setNegotiation}
                      options={negotiationOptions}
                    />
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
                    placeholder="Enter the description of the property"
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
                  <div className="text-center mt-5 font-[400] font-inter md:text-[12px]">
                   <p className="text-[#767676]">By clicking on Post Ad, you accept to 
                    <span className="text-[#000087]"> Terms of Use,</span>
                    confirm that you will abide by the Safety Tips, 
                    <br />
                    and declare that this posting does not include any Prohibited items.
                  </p>
                </div> 
                </form>
              </div>
           </main>

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
        </div>
      </div>
    );
}