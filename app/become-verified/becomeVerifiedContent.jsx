"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import FloatingLabelInput from "../components/UI/FloatingLabelInput";
import api from "@/services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Img from "../components/Image";
import { toast } from "react-toastify";
import FloatingLabelDropdown from "../components/UI/FloatingDropdown";

export default function BecomeVerifiedContent() {
  const router = useRouter();
  const { token, isLoggedIn, role } = useAuth();
  
  const [view, setView] = useState("main"); // main, personal, business
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [verificationData, setVerificationData] = useState({
    personal: null,
    businesses: [],
  });
  const [userBusinesses, setUserBusinesses] = useState([]);

  // Personal Verification State
  const [validIdType, setValidIdType] = useState("nin");
  const [validIdFile, setValidIdFile] = useState(null);

  // Business Verification State
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [certificate, setCertificate] = useState(null);

  // Fetch user's businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!isLoggedIn || !token) return;

      try {
        const response = await api.get("/business/my-businesses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, [isLoggedIn, token]);

  // Fetch verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!isLoggedIn || !token) {
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await api.get("/verification/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVerificationData(response.data);
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchVerificationStatus();
  }, [isLoggedIn, token]);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();

    if (!validIdFile) {
      toast.error("Please upload your valid ID");
      return;
    }

    // Check file size (10MB limit)
    if (validIdFile.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Please upload a document smaller than 10MB.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("validIdType", validIdType);
      formData.append("validId", validIdFile);

      await api.post("/verification/submit-personal", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Personal verification submitted successfully!");
      
      // Refresh status
      const response = await api.get("/verification/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerificationData(response.data);
      setView("main");
      setValidIdFile(null);
    } catch (error) {
      console.error("Personal Verification Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBusinessId || !businessAddress || !businessEmail || !certificate) {
      toast.error("Please complete all required fields");
      return;
    }

    // Check file size (10MB limit)
    if (certificate.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Please upload a document smaller than 10MB.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("businessId", selectedBusinessId);
      formData.append("businessAddress", businessAddress);
      formData.append("businessEmail", businessEmail);
      formData.append("businessPhoneNumber", businessPhone);
      formData.append("certificate", certificate);

      await api.post("/verification/submit-business", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Business verification submitted successfully!");

      // Refresh status
      const response = await api.get("/verification/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerificationData(response.data);
      setView("main");
      
      // Reset form
      setSelectedBusinessId("");
      setBusinessAddress("");
      setBusinessEmail("");
      setBusinessPhone("");
      setCertificate(null);
    } catch (error) {
      console.error("Business Verification Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-[#CAA416] text-[#FAFAFA]",
      verified: "bg-[#16A34A] text-white",
      rejected: "bg-[#DC2626] text-white",
    };
    return badges[status] || badges.pending;
  };

  // Get businesses that haven't been verified yet
  const getUnverifiedBusinesses = () => {
    const verifiedBusinessNames = verificationData.businesses.map(b => b.businessName);
    return userBusinesses.filter(business => 
      !verifiedBusinessNames.includes(business.businessName)
    );
  };

  if (checkingStatus) {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000087] mb-4"></div>
          <p className="text-[#525252] font-inter font-[500] text-[14px]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Main View
  if (view === "main") {
    const unverifiedBusinesses = getUnverifiedBusinesses();

    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center text-center justify-center space-x-2 text-[#525252] hover:text-[#000087] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-[500]">Go back</span>
        </button>

        <h3 className="text-[#525252] text-center font-[600] font-inter text-[20px] mb-6">
         {role === "buyer" ? "Become verified" : "Become a verified seller"}
        </h3>

        {/* Personal Identity Verification */}
        <div
          className={`flex items-center justify-between p-4 border border-[#E8E8FF] rounded-lg mb-4 ${
            !verificationData.personal ? 'cursor-pointer hover:bg-[#F7F7FF]' : ''
          } transition`}
          onClick={() => !verificationData.personal && setView("personal")}
        >
          <div className="flex-1">
            <p className="text-[#525252] font-inter font-[500] text-[14px]">
              Verify your personal identity
            </p>
            {verificationData.personal && (
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-[500] ${getStatusBadge(
                  verificationData.personal.status
                )}`}
              >
                {verificationData.personal.status.charAt(0).toUpperCase() +
                  verificationData.personal.status.slice(1)}
              </span>
            )}
          </div>
          {!verificationData.personal && <ChevronRight className="w-5 h-5 text-[#525252]" />}
        </div>

        {/* Buyer Specific message */}
        {role === "buyer" && verificationData.personal?.status === "verified" && (
          <div className="text-center py-8 text-[#16A34A]">
            <p className="font-inter text-[14px] font-[500]">
              You are verified! Your personal identity has been confirmed.
            </p>
          </div>
        )}

        {/* Verified Businesses */}
        {role === "seller" && (
          <>
           {verificationData.businesses.map((business, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-[#E8E8FF] rounded-lg mb-4"
          >
            <div className="flex-1">
              <p className="text-[#525252] font-inter font-[500] text-[14px]">
                {business.businessName}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-[12px] font-[500] ${getStatusBadge(
                  business.status
                )}`}
              >
                {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
              </span>
            </div>
          </div>
        ))}

        {/* Show unverified businesses */}
        {unverifiedBusinesses.length > 0 && (
          <>
            <h4 className="text-[#525252] font-inter font-[500] text-[14px] mt-6 mb-3">
              Verify your businesses
            </h4>
            {unverifiedBusinesses.map((business) => (
              <div
                key={business._id}
                className="flex items-center justify-between p-4 border border-[#E8E8FF] rounded-lg mb-4 cursor-pointer hover:bg-[#F7F7FF] transition"
                onClick={() => {
                  setSelectedBusinessId(business._id);
                  setView("business");
                }}
              >
                <p className="text-[#525252] font-inter font-[500] text-[14px]">
                  {business.businessName}
                </p>
                <ChevronRight className="w-5 h-5 text-[#525252]" />
              </div>
            ))}
          </>
        )}

        {/* Message if no businesses to verify */}
        {userBusinesses.length === 0 && (
          <div className="text-center py-8 text-[#868686]">
            <p className="font-inter text-[14px]">
              You haven't created any businesses yet. 
              <br />
              Create a business first to verify it.
            </p>
          </div>
        )}
          </>
        )}
      </div>
    );
  }

  // Personal Identity Verification Form
  if (view === "personal") {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full">
        <button
          onClick={() => setView("main")}
          className="flex items-center space-x-2 text-[#525252] hover:text-[#000087] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-[500]">Go back</span>
        </button>

        <h3 className="text-[#525252] font-[500] font-inter text-[18px] mb-6">
          Verify your personal identity
        </h3>

        <form onSubmit={handlePersonalSubmit} className="max-w-lg">
          <FloatingLabelDropdown
            value={validIdType}
            onChange={(e) => setValidIdType(e.target.value)}
            className="mb-4"
          >
            <option value="nin">National Identification Number (NIN)</option>
            <option value="driverlicense">Driver License</option>
            <option value="passport">Passport</option>
            <option value="voterscard">Voters Card</option>
          </FloatingLabelDropdown>

          <h4 className="text-[#525252] font-inter font-[500] text-[14px] mt-4 mb-2">
            Upload valid means of ID (Max: 10MB)
          </h4>

          {!validIdFile ? (
            <label
              htmlFor="valid-id-upload"
              className="flex flex-col items-center justify-center bg-[#F7F7FF] border-2 border-dashed border-[#5555DD] rounded-[8px] p-10 cursor-pointer w-full h-[150px]"
            >
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
                id="valid-id-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={(e) => setValidIdFile(e.target.files[0])}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center mt-3">
              <div className="relative w-32 h-32">
                {validIdFile.type.startsWith("image/") ? (
                  <Img
                    src={URL.createObjectURL(validIdFile)}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-contain rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-[#F7F7FF] rounded border">
                    <span className="text-[#1031AA] text-xs text-center px-2">
                      {validIdFile.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  onClick={() => setValidIdFile(null)}
                >
                  <Img src="/close-circle.svg" alt="Remove" width={20} height={20} />
                </button>
              </div>
              <p className="text-xs text-[#868686] mt-2">
                Size: {(validIdFile.size / (1024 * 1024)).toFixed(2)}MB
              </p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-[#00A8DF] to-[#1031AA] px-6 py-2 text-white w-full md:w-[317px] h-[44px] rounded-[8px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Business Verification Form
  if (view === "business") {
    const selectedBusiness = userBusinesses.find(b => b._id === selectedBusinessId);

    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full">
        <button
          onClick={() => {
            setView("main");
            setSelectedBusinessId("");
            setCertificate(null);
          }}
          className="flex items-center space-x-2 text-[#525252] hover:text-[#000087] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px] font-[500]">Go back</span>
        </button>

        <h3 className="text-[#525252] font-[500] text-center font-inter text-[18px] mb-6">
          Verify {selectedBusiness?.businessName}
        </h3>

        <form onSubmit={handleBusinessSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="text-[#525252] font-inter font-[500] text-[14px]">
              Business Name
            </label>
            <div className="mt-2 p-3 bg-[#F7F7FF] rounded-lg">
              <p className="text-[#000087] font-[500]">{selectedBusiness?.businessName}</p>
            </div>
          </div>

          <FloatingLabelInput
            label="Business Address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
          <FloatingLabelInput
            label="Business Email"
            type="email"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            required
          />
          <FloatingLabelInput
            label="Business Phone number"
            value={businessPhone}
            onChange={(e) => setBusinessPhone(e.target.value)}
          />

          <h4 className="text-[#525252] font-inter font-[500] text-[14px] mt-4 mb-2">
            Upload Business Registration Certificate (Max: 10MB)
          </h4>

          {!certificate ? (
            <label
              htmlFor="certificate-upload"
              className="flex flex-col items-center justify-center bg-[#F7F7FF] border-2 border-dashed border-[#5555DD] rounded-[8px] p-10 cursor-pointer w-full h-[150px]"
            >
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
                id="certificate-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setCertificate(e.target.files[0])}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center mt-3">
              <div className="relative w-32 h-32">
                {certificate.type.startsWith("image/") ? (
                  <Img
                    src={URL.createObjectURL(certificate)}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-contain rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-[#F7F7FF] rounded border">
                    <span className="text-[#1031AA] text-xs text-center px-2">
                      {certificate.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                  onClick={() => setCertificate(null)}
                >
                  <Img src="/close-circle.svg" alt="Remove" width={20} height={20} />
                </button>
              </div>
              <p className="text-xs text-[#868686] mt-2">
                Size: {(certificate.size / (1024 * 1024)).toFixed(2)}MB
              </p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-[#00A8DF] to-[#1031AA] px-6 py-2 text-white w-full md:w-[317px] h-[44px] rounded-[8px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}