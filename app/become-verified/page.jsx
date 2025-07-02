"use client";
import  { useState } from 'react';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import FloatingLabelInput from "../components/UI/FloatingLabelInput";
import api from '@/services/api';
import { useAuth } from '../context/AuthContext';
import Img from '../components/Image';
import { toast } from 'react-toastify';
import FloatingLabelDropdown from '../components/UI/FloatingDropdown';

export default function BecomeVerified() {
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
      const { token, isLoggedIn } = useAuth();

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

           // 🔍 DEBUG: log formData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

         const res = await api.post("/verification/submit-verification", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
         });
         toast.success("Verification submitted successfully!");
         router.push("/create-add");
        } catch (error) {
         console.error("Verification Error:", error);
         setError(error.response?.data?.message || "Something went wrong.");
         toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      };
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
       <div className="flex flex-col md:flex-row gap-10">
          <Sidebar />

          <main className="flex-1">
            <div className="bg-white shadow-phenom md:rounded-[12px] p-8 text-center">
               <div className="flex justify-start mb-6">
                 <Button
                  onClick={handleGoBack}
                  className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium">
                     <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]"  /> 
                      <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
                 </Button>
               </div>

               <div className="md:px-[40px]">
                <h3 className="text-[#525252] font-[500] font-inter md:text-[16px] mb-6 ml-0 md:ml-4 text-left">
                 Become a verified user
               </h3>
                
                {/* Stepper */}
                <div className="flex items-center mb-8 ml-0 md:ml-4">
                  <div 
                   className={`flex items-center w-[67.12px] h-[28px] justify-center rounded-[40px]  ${step === 1 ? "bg-[#000087] text-[#F7F7FF]" : "bg-[#E8E8FF] text-[#000087]"}`}>
                   <span className="font-inter font-[500]  text-[12px]">Step 1</span>
                  </div>
                 <div className={`md:w-[373px] h-[6px] rounded-[10px] mx-2 transition-all duration-300 ${step === 2 ? "bg-[#000087]" : "bg-[#E8E8FF]"}`}></div>
                  <div className={`flex items-center w-[67.12px] h-[28px] justify-center rounded-[40px]  ${step === 2 ? "bg-[#000087] text-[#F7F7FF]" : "bg-[#E8E8FF] text-[#000087]"}`}>
                  <span className="font-inter font-[500]  text-[12px]">Step 2</span>
                </div>
               </div>

                {/*Form */}
                <form className="ml-0 md:ml-4" onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                    <FloatingLabelInput
                      label="Business Name"
                      value={businessName}
                      onChange={e  => (setBusinessName(e.target.value))}
                      placeholder="Enter business name"
                    />
                    <FloatingLabelInput
                      label="Business Address"
                      value={address}
                      onChange={e => (setAddress(e.target.value))}
                      placeholder="Enter business address"
                    />
                    <FloatingLabelInput
                       label="Business Email"
                       value={email}
                       onChange={e => (setEmail(e.target.value))}
                       placeholder="+234 | Enter your phone number"
                    />
                    <h3 className="text-left">
                        Upload Business Registration Certificate
                    </h3>
                    <label
                      htmlFor="certificate-upload"
                      id="dropZone" 
                      className="flex flex-col border-2 border-dashed border-[#5555DD] rounded-[8px] p-10 cursor-pointer md:w-[441px] md:h-[150px] mt-2 text-center transition">
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
                        {certificate && (
                          <span className="mt-2 text-xs text-[#1031AA] break-all">
                             {certificate.name}
                          </span>
                        )}
                    </label>
                    <div className="flex justify-center mt-4">
                    <Button 
                       type="button"
                       className="mt-4 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] px-6 py-2 text-white w-[160px] md:w-[317px] h-[44px] rounded-[8px]"
                       onClick={() => setStep(2)}>
                        Next
                    </Button>
                    </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                    <FloatingLabelDropdown
                      label="Valid means of ID"
                      value={validId}
                      onChange={e => setValidId(e.target.value)}>
                         <option value="national">National Identification Number (NIN)</option>
                         <option value="driverlicense">Driver License</option>
                         <option value="passport">Passport</option>
                         <option value="voterscard">Voters Card</option>
                     </FloatingLabelDropdown>

            {/* Upload Photo Document */ }
           <div className="mt-4">
    <label
    htmlFor="photo-upload"
    className="flex flex-col border-2 border-dashed border-[#5555DD] rounded-[8px] p-10 cursor-pointer md:w-[441px] md:h-[150px] mt-2 text-center transition relative"
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
      onChange={e => setPhotoDoc(e.target.files[0])}
    />
  </label>
  {/* Show preview and cancel below the dropzone */}
  {photoDoc && (
    <div className="flex flex-col items-center mt-3 relative">
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
            <span className="text-[#1031AA] text-xs break-all text-center px-2">{photoDoc.name}</span>
         </div>
        )}
         <button
           type="button"
           className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
           onClick={() => setPhotoDoc(null)}
          aria-label="Cancel upload">
          <Img src="/close-circle.svg" alt="Cancel" width={20} height={20} />
        </button>
     </div>
    </div>
    )}
    </div>
    )}
           </div>
           <div className="flex justify-center mt-5">
            <Button 
             type="submit"
             disabled={loading}
              className={`bg-gradient-to-r from-[#00A8DF] to-[#1031AA] px-6 py-2 text-white w-[160px] h-[44px] ${
               loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {loading ? "Submitting..." : "Submit"}
           </Button>
           </div>
       </>
     )}
     </form>
    </div>
  </div>
  </main>
  </div>
  </div>
  );
 }