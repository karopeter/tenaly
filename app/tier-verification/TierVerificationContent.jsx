"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { Upload, X, ArrowLeft } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-toastify";
import FloatingLabelDropdown from "../components/UI/FloatingDropdown";
import FloatingLabelInput from "../components/UI/FloatingLabelInput";

export default function TierVerificationContent() {
    const router = useRouter();
    const [activeTier, setActiveTier] = useState(1); // Current tier user is on 
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [upgradeToTier, setUpgradingToTier] = useState(null);
    const [tierStatus, setTierStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLevel, setCurrentLevel] = useState(0);

    useEffect(() => {
      fetchTierStatus();
      fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
      try {
       const response = await api.get("/business/my-businesses");
       setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

     useEffect(() => {
       fetchTierStatus();
     }, []);

     const fetchTierStatus = async () => {
       try {
        setLoading(true);
        const response = await api.get("/tier-verification/status");
        setTierStatus(response.data);
        setCurrentLevel(response.data.currentLevel);

        // Set active tier based on status 
       if (response.data.tier3?.status === "approved") {
        setActiveTier(4);
       } else if (response.data.tier3) {
        setActiveTier(3); // Tier 3 submitted (pending/rejected)
       } else if (response.data.tier2?.status === "approved") {
        setActiveTier(3);
       } else if (response.data.tier2) {
        setActiveTier(2); // Tier 2 submitted (pending/rejected)
       } else if (response.data.tier1?.status === "approved") {
        setActiveTier(2);
       } else if (response.data.tier1) {
         setActiveTier(1); // Tier 1 submitted (pending/rejected) - show Tier 2 
       } else {
        setActiveTier(1); // No tiers submitted yet
       }
       } catch (error) {
        console.error("Error fetching tier status:". error);
        toast.error("Failed to load tier status"); 
       } finally {
        setLoading(false);
       }
     };

    // Form state to Tier 1
    const [tier1Form, setTier1Form] = useState({
        email: "",
        phone: "",
        idType: "",
        idDocument: null,
    });

    // Form state for Tier 2 
    const [tier2Form, setTier2Form] = useState({
        utilityBill: null,
        address: "",
        town: "",
        city: "",
        state: "",
    });

    //Form state for Tier 3 
    const [tier3Form, setTier3Form] = useState({
        businessId: "",
        cacNumber: "",
        tinNumber: "",
        businessLicense: null,
        businessLicenseNumber: "",
        cacDocument: null,
    });

    const [uploadedFileName, setUploadedFileName] = useState("");

    const getTierStatus = (tier) => {
      if (!tierStatus) return "locked";

      const tierData = tierStatus[`tier${tier}`];
      if (!tierData) return "locked";

      return tierData.status; // "pending" "approved", "rejected"
    }

    const tierData = {
        1: {
         title: "Tier 1 - Basic KYC",
         benefits: [
           "Can start selling immediately", 
           "Access to marketplace visibility",
           "Builds initial trust vs unverified sellers",
           "Eligible for standard messaging"
          ],
         requirements: [
            "Email and phone confirmation",
            "Governement-issued ID"
         ],
         status: getTierStatus(1),
        },
        2: {
          title: "Tier 2 - Address Verification",
          benefits: [
            "Higher trust that yields higher conversion rate", 
            "Better visibility in search",
            {text: "Eligible for escrow transactions", comingSoon: true },
            "Lower dispute penalty weighting"
          ],
          requirements: [
            "Utitlity bill submission",
            "Physical address confirmation"
          ],
          status: getTierStatus(2),
        },
        3: {
          title: "Tier 3 - Business Verification",
          benefits: [
            "Higher search priority",
            "Access to paid ads tools",
            { text: "Access to API integrations", comingSoon: true },
            "Eligible for bulk products uploads",
            "Lower escrow fees (incentive)",
            { text: "Access to Tenaly logistics partners", comingSoon: true },
            "Featured listing eligibility",
            "Dedicated seller storefront page",
            { text:  "Advanced analytics dashboard", comingSoon: true }
          ],
          requirements: [
            "Corporate Affairs Commission (CAC) documents",
            "Tax Identification Number (TIN)",
            "Business license or supporting documents"
          ],
          status: getTierStatus(3),
        },
        4: {
          title: "Tier 4 - Elite Seller Tier",
          subtitle: "Awarded to top-performing sellers on Tenaly",
          benefits: [
            "Top placements in search results",
            "Higher conversion rate",
            "Access to promotional campaigns",
            "Reduced transaction fees",
            "Faster payouts",
            "Eligible for Tenaly-backed return guarantee"
          ],
          requirements: [
            "Performance-driven",
            "High consistency, high volume"
          ],
          unlockInfo: {
           title: "How to unlock Elite Seller status",
           description: "Elite Seller status is automatically awarded based on performance.",
           criteria: [
            "High rating (e.g 4.7+)",
            "Low dispute rate",
            "Fast reponse time",
            "Sales volume threshold",
            "Compliance consistency"
           ]
          },
          status: "locked",
          isElite: true
        }
    };

    const handleUpgradeClick = (tier) => {
        if (tier <= activeTier + 1 && tier !== 4) {
            setUpgradingToTier(tier);
            setShowUpgradeForm(true);
        }
    };

    const handleFileUpload = (e, fieldName, tierNum) => {
        const file = e.target.files[0];
        if (file) {
         setUploadedFileName(file.name);
         if (tierNum === 1) {
            setTier1Form({...tier1Form, [fieldName]: file});
         } else if (tierNum === 2) {
            setTier2Form({...tier2Form, [fieldName]: file});
         } else if (tierNum === 3) {
            setTier3Form({...tier3Form, [fieldName]: file});
         }
        }
    };

    const removeFile = (fieldName, tierNum) => {
        setUploadedFileName("");
        if (tierNum === 1) {
            setTier1Form({...tier1Form, [fieldName]: null});
        } else if (tierNum === 2) {
            setTier2Form({...tier2Form, [fieldName]: null});
        } else if (tierNum === 3) {
            setTier3Form({...tier3Form, [fieldName]: null});
        }
    };

    const handleSubmitTier1 = async (e) => {
        e.preventDefault();

        // validation 
        if (!tier1Form.email) {
          toast.error("Email is required");
          return;
        }

        if (!tier1Form.phone) {
          toast.error("Phone number is required");
          return;
        }

        if (!tier1Form.idType) {
          toast.error("Please select a vlid means of ID");
          return;
        }

        if (!tier1Form.idDocument) {
          toast.error("Please upload your ID document");
          return;
        }
       
        const formData = new FormData();
        formData.append("email", tier1Form.email);
        formData.append("phone", tier1Form.phone);
        formData.append("idType", tier1Form.idType);
        formData.append("idDocument", tier1Form.idDocument);

        try {
         const response = await api.post("/tier-verification/tier1", formData, {
           headers: { "Content-Type": "multipart/form-data" },
         });

         toast.success(response.data.message);
         fetchTierStatus(); // Refresh status 
         setShowUpgradeForm(false);
        } catch (error) {
          console.error("Tier 1 submission error:", error);
          toast.error(error.response?.data?.message || "Failed to submit Tier 1");
        }
    };

    const handleSubmitTier2  = async (e) => {
        e.preventDefault();

        if (!tier2Form.state) {
          toast.error("State is required");
          return;
        }

        if (!tier2Form.city) {
          toast.error("LGA is required");
          return;
        }

        if (!tier2Form.address) {
          toast.error("Address is required");
          return;
        }

        if (!tier2Form.town) {
          toast.error("Town is required");
          return;
        }

        if (!tier2Form.utilityBill) {
          toast.error("Please upload utility bill");
          return;
        }
      
       const formData = new FormData();
       formData.append("state", tier2Form.state);
       formData.append("lga", tier2Form.city);
       formData.append("address", tier2Form.address);
       formData.append("town", tier2Form.town);
       formData.append("utilityBill", tier2Form.utilityBill);

       try {
        const response = await api.post("/tier-verification/tier2", formData, {
          headers: {"Content-Type": "multipart/form-data" },
        });

        toast.success(response.data.message);
        fetchTierStatus();
        setShowUpgradeForm(false);
       } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit Tier 2");
       }
    };

    const handleSubmitTier3 = async (e) => {
        e.preventDefault();

        // Validation 
        if (!tier3Form.businessId) {
          toast.error("Please select a business to verify");
          return;
        }

        if (!tier3Form.cacNumber) {
          toast.error("CAC Number is required");
          return;
        }

        if (!tier3Form.cacDocument) {
          toast.error("Please upload your CAC document");
          return;
        }
       
        const formData = new FormData();
        formData.append("businessId", tier3Form.businessId); 
        formData.append("cacNumber", tier3Form.cacNumber);
        formData.append("tinNumber", tier3Form.tinNumber);
        formData.append("businessLicenseNumber", tier3Form.businessLicenseNumber);
        formData.append("cacDocument", tier3Form.cacDocument);
        if (tier3Form.businessLicense) {
          formData.append("otherDocument", tier3Form.businessLicense);
        }

        try {
         const response = await api.post("/tier-verification/tier3", formData, {
           headers: {"Content-Type": "multipart/form-data" }, 
         });

         toast.success(response.data.message);
         fetchTierStatus();
         setShowUpgradeForm(false);
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to submit Tier 3");
        }
    };

    if (showUpgradeForm) {
      return (
        <div className="bg-white shadow-phenom rounded-[12px] p-5 md:p-10">
                <button 
                    onClick={() => setShowUpgradeForm(false)}
                    className="flex items-center gap-2 text-[#525252] font-inter text-[14px] mb-6 hover:text-[#00A8DF]"
                >
                    <ArrowLeft size={16} />
                    Go back
                </button>

                <h2 className="text-[#525252] font-[600] font-inter text-left ml-0 md:ml-8 text-[18px] mb-6">
                    Upgrade to Tier {upgradeToTier}
                </h2>

                {/* Tier 1 Form */}
                {upgradeToTier === 1 && (
                    <form onSubmit={handleSubmitTier1} className="space-y-4 max-w-[500px] mx-auto">
                        <div>
                            <FloatingLabelInput
                              label="Email"
                                type="email"
                                value={tier1Form.email}
                                onChange={(e) => setTier1Form({...tier1Form, email: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <div className="">
                                <FloatingLabelInput
                                  label="Phone Number"
                                    type="tel"
                                    value={tier1Form.phone}
                                    onChange={(e) => setTier1Form({...tier1Form, phone: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                            <FloatingLabelDropdown
                                 label="Valid means of ID"
                                value={tier1Form.idType}
                                onChange={(e) => setTier1Form({...tier1Form, idType: e.target.value})}
                                className="mb-4"
                            >
                                <option value="">Select</option>
                                <option value="drivers-license">Driver's Licence</option>
                                <option value="nin">National ID (NIN)</option>
                                <option value="voters-card">Voter's Card</option>
                                <option value="passport">International Passport</option>
                            </FloatingLabelDropdown>

                         
                        <div>
                            <label className="block text-[#525252] font-inter text-[14px] font-[500] mb-2">
                                Upload valid means of ID
                            </label>
                            
                            {!tier1Form.idDocument ? (
                                <label className="border-2 border-dashed bg-[#F7F7FF] border-[#5555DD] rounded-[8px] p-10 flex flex-col items-center justify-center cursor-pointer  transition">
                                    {/* <Upload className="text-[#00A8DF] mb-2" size={32} /> */}
                                    <Img
                                      src={'/document-upload.svg'}
                                      alt="Document Upload Icon"
                                      width={24}
                                      height={24}
                                    />
                                    <span className="text-[#000087] font-inter font-[500] text-[14px]">
                                        Upload Document
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'idDocument', 1)}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="border border-[#EDEDED] rounded-[8px] p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-[4px] flex items-center justify-center">
                                            <Img 
                                                src={URL.createObjectURL(tier1Form.idDocument)} 
                                                alt="ID" 
                                                width={100}
                                                height={100}
                                                className="w-full h-full object-cover rounded-[4px]"
                                            />
                                        </div>
                                        <span className="text-[#525252] font-inter text-[14px]">
                                            {uploadedFileName}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('idDocument', 1)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={20} className="text-[#868686]" />
                                    </button>
                                </div>
                            )}
                        </div>


                         <div className="flex justify-center">
                         <Button
                            type="submit"
                            className="w-full md:w-[317px] h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] font-inter font-[500] text-[16px] mt-6"
                        >
                            Submit
                        </Button>
                       </div>
                    </form>
                )}

                {/* Tier 2 Form */}
                {upgradeToTier === 2 && (
                    <form onSubmit={handleSubmitTier2} className="space-y-4 max-w-[500px] mx-auto">
                     <div>
                       <h3 className="text-[#000087] font-[600] text-[16px]">Proof of business address</h3>
                       <span className="text-[#868686] font-[400] text-[14px]">
                        Please upload a proof of your business address 
                        <Link href="" className="font-[700]">(Utility <br /> bill)</Link> that contains your address. Kindly ensure that the 
                        <br />
                        state, LGA, and area you select matches that of your utility 
                        <br />
                        bill you will upload.
                       </span>
                     </div>
                        <div>
                         <FloatingLabelInput
                           type="text"
                           value={tier2Form.state}
                          onChange={(e) => setTier2Form({...tier2Form, state: e.target.value})}
                          label="State"
                         />
                        </div>

                        <div>
                         <FloatingLabelInput
                          type="text"
                          value={tier2Form.city}
                          onChange={(e) => setTier2Form({...tier2Form, city: e.target.value})}
                          label="LGA"
                         />
                        </div>

                        <div>
                         <FloatingLabelInput
                          type="text"
                          value={tier2Form.address}
                          onChange={(e) => setTier2Form({...tier2Form, address: e.target.value})}
                           label="Enter your address"
                         />
                        </div>

                        <div>
                         <FloatingLabelInput
                           type="text"
                           value={tier2Form.town}
                           onChange={(e) => setTier2Form({...tier2Form, town: e.target.value})}
                           label="Town"
                         />
                        </div>

                        <div>
                            <label className="block text-[#525252] font-inter text-[14px] font-[500] mb-2">
                                Upload utility bill
                            </label>
                            
                            {!tier2Form.utilityBill ? (
                                <label className="border-2 border-dashed bg-[#F7F7FF] border-[#5555DD] rounded-[8px] p-10 flex flex-col items-center justify-center cursor-pointer  transition">
                                    <Img 
                                      src="/document-upload.svg"
                                      alt="Upload"
                                      width={24}
                                      height={24}
                                      className="mb-2"
                                    />
                                    <span className="text-[#000087] font-inter font-[500] text-[14px]">
                                        Upload Document
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'utilityBill', 2)}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="border border-[#EDEDED] rounded-[8px] p-4 flex items-center justify-between">
                                    <span className="text-[#525252] font-inter text-[14px]">
                                        {uploadedFileName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('utilityBill', 2)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={20} className="text-[#868686]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                         <Button
                            type="submit"
                            className="w-full md:w-[317px] h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] font-inter font-[500] text-[16px] mt-6"
                        >
                            Submit
                        </Button>
                       </div>
                    </form>
                )}

                {/* Tier 3 Form */}
                {upgradeToTier === 3 && (
                    <form onSubmit={handleSubmitTier3} className="space-y-4 max-w-[500px] mx-auto">
                      <div>
                        <h3 className="text-[#000087] font-[600] text-[16px]">Business Verification</h3>
                      </div>
                       <div>
                        <FloatingLabelDropdown
                          label="Select Business to Verify"
                          value={tier3Form.businessId}
                          onChange={(e) => setTier3Form({ ...tier3Form, businessId: e.target.value })}
                          required
                        >
                       {/* <option value="">Select a business</option> */}
                       {businesses.map((biz) => (
                        <option key={biz._id} value={biz._id}>
                          {biz.businessName}
                        </option>
                       ))}
                        </FloatingLabelDropdown>
                       </div>

                       <div>
                        <FloatingLabelInput
                          label="Corporate Affairs Commission (CAC) Number"
                          type="text"
                          value={tier3Form.cacNumber}
                          onChange={(e) => setTier3Form({ ...tier3Form, cacNumber: e.target.value })}
                          required
                        />
                       </div>

                        <div>
                            <FloatingLabelInput
                               label="Tax Identification Number (TIN)"
                                type="text"
                                value={tier3Form.tinNumber}
                                onChange={(e) => setTier3Form({...tier3Form, tinNumber: e.target.value})}
                            />
                        </div>

                        <div>
                          <FloatingLabelInput
                            label="Business license number"
                            type="text"
                            value={tier3Form.businessLicenseNumber}
                            onChange={(e) => setTier3Form({...tier3Form, businessLicenseNumber: e.target.value})}
                          />
                        </div>

                        <div>
                            <label className="block text-[#525252] font-inter text-[14px] font-[500] mb-2">
                                Upload Corporate Affairs Commission (CAC)
                            </label>
                            
                            {!tier3Form.cacDocument ? (
                                <label className="border-2 border-dashed bg-[#F7F7FF] border-[#5555DD] rounded-[8px] p-10 flex flex-col items-center justify-center cursor-pointer  transition">
                                    <Img 
                                      src="/document-upload.svg"
                                      alt="Upload"
                                      width={24}
                                      height={24}
                                      className="mb-2"
                                    />
                                    <span className="text-[#000087] font-inter font-[500] text-[14px]">
                                        Upload Document
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'cacDocument', 3)}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="border border-[#EDEDED] rounded-[8px] p-4 flex items-center justify-between">
                                    <span className="text-[#525252] font-inter text-[14px]">
                                        {uploadedFileName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('cacDocument', 3)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={20} className="text-[#868686]" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[#525252] font-inter text-[14px] font-[500] mb-2">
                                Upload other neccessary document (optional)
                            </label>
                            
                            {!tier3Form.businessLicense ? (
                                <label className="border-2 border-dashed bg-[#F7F7FF] border-[#5555DD] rounded-[8px] p-10 flex flex-col items-center justify-center cursor-pointer  transition">
                                    <Img 
                                      src="/document-upload.svg"
                                      alt="Upload"
                                      width={24}
                                      height={24}
                                      className="mb-2"
                                    />
                                    <span className="text-[#000087] font-inter font-[500] text-[14px]">
                                        Upload Document
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, 'businessLicense', 3)}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="border border-[#EDEDED] rounded-[8px] p-4 flex items-center justify-between">
                                    <span className="text-[#525252] font-inter text-[14px]">
                                        {uploadedFileName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile('businessLicense', 3)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={20} className="text-[#868686]" />
                                    </button>
                                </div>
                            )}
                        </div>

                       <div className="flex justify-center">
                         <Button
                            type="submit"
                            className="w-full md:w-[317px] h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] font-inter font-[500] text-[16px] mt-6"
                        >
                            Submit
                        </Button>
                       </div>
                    </form>
                )}
            </div>
      )
    }

    if (loading) {
      return (
      <div className="bg-white shadow-phenom rounded-[12px] p-5 md:p-10 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-inter">Loading tier status...</p>
      </div>
      </div>
      )
    }

    return (
      <div className="bg-white shadow-phenom rounded-[12px] p-5 md:p-10">
       <h2 className="text-[#525252] font-[600] font-inter text-[20px] mb-6 text-center">
         Tier verification 
       </h2>

       {/* Tier Tabs */}
       <div className="flex gap-2 md:gap-4 mb-6 justify-center">
         {[1, 2, 3, 4].map((tier) => (
         <button
           key={tier}
           onClick={() => setActiveTier(tier)}
           className={`px-4 md:px-6 py-2 rounded-[8px] font-inter font-[500] text-[14px] transition ${
              activeTier === tier
              ? "bg-[#000087] text-white"
              : tier <= activeTier
              ? "bg-[#E8E8E8] text-[#525252] hover:bg-[#D8D8D8]"
              : "bg-[#E8E8E8] text-[#868686] cursor-not-allowed" 
           }`} 
          > 
            Tier {tier}
          </button>
         ))}
       </div>

       {/* Current Level Display */}
       {currentLevel > 0 && (
         <div 
           className="w-[404px] mx-auto flex items-center justify-between rounded-[8px] p-4 mb-4"
           style={{
           backgroundImage: 'linear-gradient(to right, #002CAE, #2403B800), url("/tier-background.svg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           //boxShadow: 'inset 0 2px 8px rgba(186, 186, 186, 0.25), 0 4px 20px rgba(0, 0, 0, 0.14)'
            // backgroundColor: 'white',
            // backgroundImage: 'linear-gradient(to right, rgba(0, 44, 174, 0.6), rgba(36, 3, 184, 0)), url("/tierImage.png")',
            // backgroundBlendMode: 'normal, luminosity',
           }}
           >
          <span className="text-white font-[600] text-[16px]">
            Current Level
          </span>
           <Button 
           className="text-white w-[105px] h-[45px] rounded-[17px] bg-cover bg-center bg-no-repeat"
           style={{
            backgroundImage: 'url("/tier-background1.svg")'
           }}> 
        <span className="whitespace-nowrap text-white text-[14px] font-[500] relative z-10 flex items-center gap-1">
          Tier
          <span
           className="inline-flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
           style={{
             backgroundColor: '#BCD7F657',
             width: '16px',
             height: '16px',
             minWidth: '16px',
             minHeight: '16px',
             borderRadius: '50%'
           }}>
             {currentLevel}
          </span>
         </span>
        </Button>
         </div>
       )}

       {/* Tier Content */}
       <div className="flex flex-col items-center">
         <div className="w-[404px] bg-[#EDEDED] rounded-[4px] p-6">
           <div className="flex items-start justify-between mb-2">
             <h3 className="text-[#525252] font-semibold font-inter text-[16px]">
               {tierData[activeTier].title}
             </h3>
              {tierData[activeTier].isElite && (
               <span className="bg-[#CB0D0D] text-white px-3 py-1 rounded-[4px] text-[12px] font-inter font-[500] flex items-center gap-1">
                 🔒 Locked
              </span>
             )}
             {tierData[activeTier].status === "approved" && (
              <span className="bg-[#4FA544] text-white px-3 py-1 rounded-[4px] text-[12px] font-inter font-[500]">
                Verified
              </span>
             )}
              {tierData[activeTier].status === "pending" && (
               <span className="bg-[#FFA500] text-white px-3 py-1 rounded-[4px] whitespace-nowrap text-[12px] font-inter font-[500]">
                Pending Verification
               </span>
              )}
               {tierData[activeTier].status === "rejected" && (
                <span className="bg-[#CB0D0D] text-[#FFFFFF] px-3 py-1 rounded-[4px] text-[12px] font-inter font-[500]">
                 Verification Failed 
               </span>
               )}
           </div>

           {tierData[activeTier].subtitle && (
            <p className="text-[#000087] font-medium text-[14px] mb-4">
               {tierData[activeTier].subtitle}
            </p>
           )}

           <div className="mb-4">
             <h4 className="text-[#525252] font-[600] font-inter text-[14px] mb-2">
               Benefits 
             </h4>
             <ul className="space-y-1">
               {tierData[activeTier].benefits.map((benefit, idx) => {
                const isObject = typeof benefit === 'object';
                const text = isObject ? benefit.text : benefit;
                const showComingSoon = isObject && benefit.comingSoon;

                return (
                 <li key={idx} className="flex items-center justify-between gap-2 text-[#525252] font-inter text-[14px]">
                   <div className="flex items-center gap-2">
                    <span className="w-[6px] h-[6px] bg-[#868686] rounded-full flex-shrink-0"></span>
                    <span>{text}</span>
                   </div>
                   {showComingSoon && (
                   <span 
                     className="text-white text-[9px] font-[500] flex items-center justify-center flex-shrink-0 whitespace-nowrap px-2"
                     style={{
                      backgroundColor: '#CAA416',
                      minWidth: '65px',
                      height: '16px',
                      borderRadius: '4px'
                    }}>
                    Coming soon
                 </span>
               )}
               </li>
            )
           })}
          </ul>
        </div>

           {/* Show requirement for business Name verified */}
           {activeTier ===  3 && tierStatus?.tier3?.businessName && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-[#525252] font-[600] font-inter text-[14px] mb-2">
                Verified Business 
              </h4>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                {tierStatus.tier3.status === "approved" ? (
                 <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                 </svg>
                ): (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg> 
                )}
                <span className="text-[#525252] font-inter text-[14px]">
                  {tierStatus.tier3.businessName}
                </span>
                <span className={`ml-auto text-xs px-2 py-1 rounded ${
                  tierStatus.tier3.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
                }`}>
                  {tierStatus.tier3.status === "approved" ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
           )}


           {/* Only show Requirements if NOT Tiers 4 */}
           {activeTier !== 4 && (
             <div>
              <h4 className="text-[#525252] font-[600] font-inter text-[14px] mb-2">
               Requirement 
             </h4>
             <ol className="space-y-1">
               {tierData[activeTier].requirements.map((req, idx) => (
                 <li key={idx} className="text-[#525252] font-inter text-[14px]">
                     {idx + 1}. {req}
                 </li>
               ))}
             </ol>
             </div>
           )}

           {/* Unlock Info for Tier 4 - MOVED INSIDE */}
           {activeTier === 4 && tierData[4].unlockInfo && (
            <div className="mt-4">
              <h4 className="text-[#525252] font-[600] font-inter text-[14px] mb-2">
                 {tierData[4].unlockInfo.title}
              </h4>

              <div className="bg-[#DFDFF9] md:h-[48px] rounded-[4px] p-2  mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-[#000087] text-[16px]">ℹ️</span>
                  <p className="text-[#000087] font-inter text-[12px]">
                     {tierData[4].unlockInfo.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-1">
               {tierData[4].unlockInfo.criteria.map((criterion, idx) => (
                 <li key={idx} className="flex items-center gap-2 text-[#525252] font-inter text-[14px]">
                   <span className="w-[6px] h-[6px] bg-[#868686] rounded-full"></span>
                    {criterion}   
                 </li>
               ))}
              </ul>
            </div>
           )}
         </div>

           {/* Rejection Reason Section */}
           {tierData[activeTier].status === "rejected" && tierStatus?.[`tier${activeTier}`]?.rejectionReason && (
            <div className="w-[404px] mt-4 pt-4 border-t border-gray-300">
               <h4 className="text-[#525252] font-semibold font-inter text-[14px] mb-3">
                Documents submitted were rejected
               </h4>

               <div className="bg-[#F8EFEF] w-full rounded-[8px] p-4 mb-3">
                <p className="text-[#525252] font-semibold font-inter text-[14px] md:text-[16px] mb-2">
                  Reason for rejection
                </p>
                <p className="text-[#525252] font-medium text-[14px]">
                    {tierStatus[`tier${activeTier}`].rejectionReason}
                </p>
               </div>

               <div className="flex justify-end">
                 <button 
                 onClick={() => handleUpgradeClick(activeTier)}
                 className="flex items-center gap-2 text-[#000087] font-inter font-medium text-[14px] md:text-[16px] hover:underline"
               >
                Reapply to Upgrade to Tier {activeTier}
                 <Img
                   src='/tier-arrow-right.svg'
                   alt="Tier Arrow Right icon"
                   width={24}
                   height={24}
                 />
               </button>
              </div>
            </div>
           )}

         {/* Upgrade Button */}
         {activeTier < 4 && (
      <>
        {/* Only show button if no tier is submitted OR if current tier is approved */}
        {((!tierStatus?.tier1) || 
         (activeTier === 2 && tierStatus?.tier1?.status === "approved" && !tierStatus?.tier2) || 
         (activeTier === 3 && tierStatus?.tier2?.status === "approved" && !tierStatus?.tier3)) && (
          <Button
              onClick={() => handleUpgradeClick(activeTier)}
              className="w-[240px] mx-auto mt-6 h-[48px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] font-inter font-[500] text-[14px]"
            >
             Upgrade to Tier {activeTier}
            </Button>
         )}
      </>
     )}
       </div>
      </div>
    );
}
