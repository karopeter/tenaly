"use client";
import { X } from "lucide-react";
import Button from "../Button";

export default function BusinessOnbardingModal({ onClose, onContinue }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] shadow-lg p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Register Your Business
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete your business registration to start posting ads and reach
          potential customers.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[6px] border border-gray-300 text-gray-700 bg-white whitespace-nowrap hover:bg-gray-100"
          >
            Skip for now
          </Button>
          <Button
            type="button"
            onClick={onContinue}
            className="px-4 py-2 rounded-[6px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] whitespace-nowrap text-white hover:opacity-90"
          >
            Continue to Registration
          </Button>
        </div>
      </div>
    </div>
  );
}