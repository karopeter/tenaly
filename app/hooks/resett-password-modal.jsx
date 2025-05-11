"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Button from "../components/Button";
import Img from "../components/Image";

export default function ResetPasswordModal({ onBack }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle reset password logic here
    alert("Password reset successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white w-[497px] max-w-md max-h-[90vh] overflow-y-auto rounded-[24px] shadow-lg p-6 relative">
        {/* Back Button */}
        <button onClick={onBack} className="absolute top-4 left-4 text-2xl font-bold text-gray-500">
          <Img 
            src="/back.svg"
            alt="Back arrow"
            width={15}
            height={15}
          />
        </button>

        <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">
          Reset Password
        </h2>
        <p className="text-[#868686] md:text-[14px] font-[400] font-inter text-center">
          Enter your email so you can receive a code to reset your password
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* New Password Input */}
          <div className="relative mb-4">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-[380px] h-[52px] px-4 outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              {showNewPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-[#525252]" />
              ) : (
                <EyeIcon className="w-5 h-5 text-[#525252]" />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-[380px] h-[52px] px-4 outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5 text-[#525252]" />
              ) : (
                <EyeIcon className="w-5 h-5 text-[#525252]" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={newPassword.trim() === "" || confirmPassword.trim() === ""}
            className={`pt-[10px] pr-[16px] pb-[10px] pl-[16px] w-[380px] h-[52px] rounded-[8px] mt-4 font-inter md:text-[16px] font-[500] ${
              newPassword.trim() !== "" && confirmPassword.trim() !== ""
                ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7]"
            }`}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}