"use client";
import { useState } from "react";
import Button from "../components/Button";
import ForgotPasswordVerifyModal from "./forgotpassword-verify-modal";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") return;
    
    setShowVerifyModal(true);
  }

  if (showVerifyModal) {
    return <ForgotPasswordVerifyModal onClose={() => setShowVerifyModal(false)} />
  }
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
        <div className="bg-white w-[497px] max-w-md max-h-[90vh] overflow-y-auto rounded-[24px] shadow-lg p-6 relative">
          {/* Close Icon */}
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-500">
            &times;
          </button>
  
          <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">
            Forgot Password
          </h2>
          <p className="text-[#868686] md:text-[14px] font-[400] font-inter text-center">
            Enter your email so you can recieve code to reset your password
          </p>
  
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Email Input */}
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[380px] h-[52px] px-4 outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
            />
  
            {/* Reset Button */}
            <Button
              type="submit"
              disabled={email.trim() === ""}
              className={`pt-[10px] pr-[16px] pb-[10px] pl-[16px] w-[380px] h-[52px] rounded-[8px] mt-4 font-inter md:text-[16px] font-[500] ${
                email.trim() !== ""
                  ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                  : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7]"
              }`}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>  
    );
}