"use client";
import { useState, useRef } from "react";
import Img from "../components/Image";
import Button from "../components/Button";
import api from "@/services/api";
import ResetPasswordModal from "./resett-password-modal";

export default function ForgotPasswordVerifyModal({ email, onClose, onPasswordResetSuccess }) {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]); // 5 inputs
  const inputsRef = useRef([]);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all digits are filled
  const isCodeValid = codeDigits.every((digit) => digit !== "");

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    // Move to next input (changed from index < 3 to index < 4 for 5 inputs)
    if (index < 4 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newDigits = [...codeDigits];
      if (newDigits[index]) {
        newDigits[index] = "";
        setCodeDigits(newDigits);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCodeValid || isSubmitting) return;

    const otp = codeDigits.join("");
    setIsSubmitting(true);

    try {
      await api.post("/auth/mock-verify-otp", { email, otpCode: otp });
      setOtpCode(otp);
      setShowResetPasswordModal(true);
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert(error.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResetPasswordModal) {
    return (
      <ResetPasswordModal 
        email={email}
        otp={otpCode}
        onClose={() => setShowResetPasswordModal(false)} 
       onBack={() => setShowResetPasswordModal(false)}
       onPasswordResetSuccess={() => {
         setShowResetPasswordModal(false);
         onClose();
         if (onPasswordResetSuccess) {
          onPasswordResetSuccess();
         }
       }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white w-[411px] max-w-md rounded-[24px] shadow-lg p-6 relative max-h-[259px] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 left-4 text-2xl font-bold text-gray-500">
          <Img 
            src="/back.svg"
            alt="Back arrow"
            width={15}
            height={15}
          />
        </button>
        
        <h2 className="text-center text-[20px] font-semibold text-[#525252] mb-2">Let's verify it's you</h2>
        <p className="text-center text-[#868686] mb-6">Enter code sent to your email</p>
 
       <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-center gap-4 items-center">
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[52px] h-[52px] text-center text-xl border border-[#CDCDD7] rounded-[8px] outline-none placeholder:text-[#CDCDD7]"
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div className="flex justify-center items-center">
          <Button
            type="submit"
            disabled={!isCodeValid || isSubmitting}
            className={`mt-6 w-[197px] h-[44px] border border-[#EDEDED] rounded-[8px] pt-[10px] pr-[16px] pb-[10px] pl-[16px] font-[500] text-[14px] ${
              isCodeValid && !isSubmitting 
                ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white" 
                : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7]"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Submit"}
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
}