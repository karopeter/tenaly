"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import FloatingLabelInput from "../components/UI/FloatingLabelInput";
import api from '@/services/api';
import { useAuth } from '../context/AuthContext';
import Img from '../components/Image';
import { toast } from 'react-toastify';
import FloatingLabelDropdown from '../components/UI/FloatingDropdown';

export default function BecomeVerifiedContent() {
  const router = useRouter();
  const handleGoBack = () => router.back();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validId, setValidId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [certificate, setCertificate] = useState("");
  const [photoDoc, setPhotoDoc] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'pending', 'verified'
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { token, isLoggedIn, profile } = useAuth();

  // Check verification status when component mounts
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!isLoggedIn || !token) {
        setCheckingStatus(false);
        return;
      }

      // First check if user is already verified in their profile
      if (profile?.isVerified) {
        setVerificationStatus('verified');
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await api.get('/verification/status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.hasSubmitted) {
          setVerificationStatus(response.data.isVerified ? 'verified' : 'pending');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setVerificationStatus(null);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkVerificationStatus();
  }, [isLoggedIn, token, profile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("You must be logged in to submit verification.");
      return;
    }

    if (!certificate || !photoDoc || !validId || !businessName || !email || !address) {
      toast.error("Please fill out all fields and upload documents.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("businessName", businessName);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("validIdType", validId);
      formData.append("certificate", certificate);
      formData.append("validId", photoDoc);

      const res = await api.post("/verification/submit-verification", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Verification submitted successfully!");
      setVerificationStatus('pending'); // Update status to pending
      
    } catch (error) {
      console.error("Verification Error:", error);
      setError(error.response?.data?.message || "Something went wrong.");
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking verification status
  if (checkingStatus) {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000087] mb-4"></div>
          <p className="text-[#525252] font-inter font-[500] text-[14px]">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // Verification pending state
 if (verificationStatus === 'pending') {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-[#525252] hover:text-[#000087] font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[#525252] font-[400] text-[14px] font-inter">Go back</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-center mb-6">
            <span className="text-[#525252] font-inter font-[400] text-[14px] mr-3">
              Verification status:
            </span>
            <span className="bg-[#CAA416] text-[#FAFAFA] px-3 py-1 rounded-[28px] text-[12px] font-inter font-[500]">
              Pending
            </span>
          </div>
          
          <p className="text-[#525252] font-inter font-[400] text-[14px] text-center max-w-md leading-relaxed">
            Our team is reviewing your information and will get back to you shortly. Thank you for your patience!
          </p>
        </div>
      </div>
    );
  }

  // Verification successful state
 if (verificationStatus === 'verified') {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 mt-20 md:mt-0 w-full">
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center hidden md:block text-[#525252] hover:text-[#000087] font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[#525252] font-[400] text-[14px] font-inter">Go back</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          {/* Star badge with checkmark */}
          <div className="relative mb-4">
            <Img 
              src="/verifiedSuccess.svg"
              width={120}
              height={120}
            />
          </div>
          
          <h2 className="text-[#525252] font-inter font-[500] text-[16px] mb-4 text-center leading-relaxed">
            Congratulations, you are now a 
            <br />
            verified user of Tenaly
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-phenom md:rounded-[12px] p-4 md:p-8 w-full  text-center">
      <div className="flex justify-start  mb-6">
        {/* <Button
          onClick={handleGoBack}
          className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]" />
          <span className="text-[#525252] font-[500] text-[14px] font-inter">Go Back</span>
        </Button> */}
      </div>

      <div className="flex flex-col  justify-start items-start md:justify-center md:items-center">
        <div>
        <h3 className="text-[#525252] font-[500] font-inter text-[16px] mb-6 text-center md:text-left">
          Become a verified user
        </h3>

        {/* Stepper */}
        <div className="flex items-center mb-8 justify-center md:justify-start">
          <div
            className={`flex items-center w-[67px] h-[28px] justify-center rounded-[40px] ${
              step === 1 ? "bg-[#000087] text-[#F7F7FF]" : "bg-[#E8E8FF] text-[#000087]"
            }`}
          >
            <span className="font-inter font-[500] text-[12px]">Step 1</span>
          </div>
          <div
            className={`w-1/2 md:w-[373px] h-[6px] rounded-[10px] mx-2 transition-all duration-300 ${
              step === 2 ? "bg-[#000087]" : "bg-[#E8E8FF]"
            }`}
          ></div>
          <div
            className={`flex items-center w-[67px] h-[28px] justify-center rounded-[40px] ${
              step === 2 ? "bg-[#000087] text-[#F7F7FF]" : "bg-[#E8E8FF] text-[#000087]"
            }`}
          >
            <span className="font-inter font-[500] text-[12px]">Step 2</span>
          </div>
        </div>

        {/* Form */}
        <form className="mx-auto max-w-lg md:max-w-none" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <FloatingLabelInput
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <FloatingLabelInput
                label="Business Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <FloatingLabelInput
                label="Business Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h3 className="text-left text-[#525252] font-inter font-[500] text-[14px] mt-4 mb-2">
                Upload Business Registration Certificate
              </h3>
              {!certificate ? (
                <label
                htmlFor="certificate-upload"
                id="dropZone"
                className="flex flex-col items-center justify-center bg-[#F7F7FF] border-2 border-dashed border-[#5555DD] rounded-[8px] p-10 cursor-pointer w-full h-[150px] transition"
              >
                <Img
                  src="/document-upload.svg"
                  alt="Document Icon"
                  width={24}
                  height={24}
                  className="mx-auto mb-2"
                />
                <span className="text-[#000087] font-inter font-[500] text-[14px]">
                  Upload Document
                </span>
                <input
                  id="certificate-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              ): (
                <div className="flex flex-col items-center mt-3">
                  <div className="relative w-32 h-32">
                    {certificate.type.startsWith("image/") ? (
                      <Img 
                        src={URL.createObjectURL(certificate)}
                        alt="Preview"
                        width={32}
                        height={32}
                        className="w-32 h-32 object-contain rounded border"
                      />
                    ): (
                      <div className="w-32 h-32 flex items-center justify-center bg-[#F7F7FF] rounded border">
                        <span className="text-[#1031AA] text-xs break-all text-center px-2">
                            {certificate.name}
                        </span>
                      </div>
                    )}
                    <button 
                     type="button"
                     className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                     onClick={() => setCertificate(null)}
                       aria-label="Cancel upload">
                       <Img src="/close-circle.svg" alt="Cancel" width={20} height={20} />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-center items-center mt-4">
                <Button
                  type="button"
                  className="bg-gradient-to-r from-[#00A8DF] to-[#1031AA] px-6 py-2 text-white w-full md:w-[317px] h-[44px] rounded-[8px]"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <FloatingLabelDropdown
                value={validId}
                onChange={(e) => setValidId(e.target.value)}
                className="w-full"
              >
                <option value="national">National Identification Number (NIN)</option>
                <option value="driverlicense">Driver License</option>
                <option value="passport">Passport</option>
                <option value="voterscard">Voters Card</option>
              </FloatingLabelDropdown>

              {/* Upload Photo Document */}
              <div className="mt-4">
                <h3 className="text-left text-[#525252] font-inter font-[500] text-[14px] mt-4 mb-2">
                  Upload valid means of ID
                </h3>
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center justify-center bg-[#F7F7FF] border-2 border-dashed border-[#5555DD] 
                  rounded-[8px] p-10 cursor-pointer w-full  h-[150px] transition relative"
                >
                  <Img
                    src="/document-upload.svg"
                    alt="Document Icon"
                    width={24}
                    height={24}
                    className="mx-auto mb-2"
                  />
                  <span className="text-[#525252] text-[14px] font-inter font-[500]">
                    Upload Document
                  </span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => setPhotoDoc(e.target.files[0])}
                  />
                </label>
                {photoDoc && (
                  <div className="flex flex-col items-center mt-3">
                    <div className="relative w-32 h-32">
                      {photoDoc.type.startsWith("image/") ? (
                        <Img
                          src={URL.createObjectURL(photoDoc)}
                          alt="Preview"
                          width={32}
                          height={32}
                          className="w-32 h-32 object-contain rounded border"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-[#F7F7FF] rounded border">
                          <span className="text-[#1031AA] text-xs break-all text-center px-2">
                            {photoDoc.name}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                        onClick={() => setPhotoDoc(null)}
                        aria-label="Cancel upload"
                      >
                        <Img src="/close-circle.svg" alt="Cancel" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-5">
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
            </>
          )}
        </form>
      </div>
      </div>
    </div>
  );
}