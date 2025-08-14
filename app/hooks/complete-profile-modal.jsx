"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import api from "@/services/api";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfileModal({ user, token, onClose }) {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState("customer");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!role) {
      errors.role = "Please select a role.";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{11}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be exactly 11 digits.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.put(
        "/auth/complete-profile",
        { role, phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { token: updatedToken, user: updatedUser } = response.data;
      onClose(updatedUser, updatedToken);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">
        Complete Your Profile
      </h2>
      <p className="text-[#868686] md:text-[14px] font-[400] font-inter">
        Please provide your role and phone number to continue.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="customer">I am buying</option>
            <option value="seller">I am selling</option>
          </select>
          {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 | Enter your phone number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-4 text-white p-3 rounded-md font-inter md:text-[16px] font-[500] ${
            isSubmitting
              ? "bg-[#EDEDED] cursor-not-allowed"
              : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA]"
          }`}
        >
          {isSubmitting ? "Completing..." : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}