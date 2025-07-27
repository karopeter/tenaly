// components/business/HourSelectionModal.js
"use client";
import Button from "../Button";
import Img from "../Image";
import { X } from "lucide-react";

export default function HourSelectionModal({ business, onClose, onSelectMode }) {
  if (!business) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="relative bg-white rounded-[24px] p-6 w-full max-w-[361px] h-auto text-center shadow-xl">
    <Button
      onClick={onClose}
      className="absolute top-3 right-1 mt-4 text-gray-500 hover:text-gray-700"
      aria-label="Close Modal"
    >
      <X size={20} />
    </Button>
    <div className="flex items-center justify-center mt-4">
      <Img
        src="/bigbag.svg"
        alt="Big image"
        width={60}
        height={60}
        className="w-[60px] h-[60px]"
      />
    </div>
    <h3 className="text-[#525252] font-[500] font-inter text-[18px] mb-4">
      Working Hour Selection
    </h3>
    <p className="text-[#767676] font-inter font-[400] text-[14px]">
      Will the address of <span>{business.businessName}</span>
      <br />
      have the same working hours?
    </p>

    <div className="flex flex-col gap-3 mt-4">
      <Button
        className="bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white 
        w-full p-3 h-auto whitespace-normal rounded-[8px] text-[12px] md:text-[16px] font-[500] font-inter leading-snug"
        onClick={() => onSelectMode("same")}
      >
        Yes, they have the same business hours
      </Button>

      <Button
        className="border border-[#CDCDD7] w-full p-3 rounded-[8px] text-[#525252] text-[13px] md:text-[16px] font-[500] font-inter"
        onClick={() => onSelectMode("different")}
      >
        No, they will be different
      </Button>
    </div>
  </div>
</div>

  );
}
