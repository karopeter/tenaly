"use client";
import { useState } from "react";
import Button from "../Button";

export default function RoleSwitchModal({ isOpen, onClose, onConfirm, targetRole }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideRoleSwitchModal", "true");
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-[#525252] font-[500] text-[18px] font-inter mb-2">
          You are about to switch to your {targetRole} profile
        </h3>
        <p className="text-[#868686] text-[14px] font-inter mb-4">
          {targetRole === "buyer" 
            ? "Browse thousands of listings and connect with sellers instantly"
            : "Start selling your products and manage your business"}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="dontShow"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="dontShow" className="text-[#525252] text-[14px] font-inter">
            Don't show this again
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="px-6 py-2 border border-[#CDCDD7] text-[#525252] rounded-[8px] font-inter text-[14px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="px-6 py-2 bg-[#5555DD] text-white rounded-[8px] font-inter text-[14px]"
          >
            {targetRole === "buyer" ? "Start shopping" : "Start selling"}
          </Button>
        </div>
      </div>
    </div>
  );
}