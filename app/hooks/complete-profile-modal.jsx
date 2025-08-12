"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import api from "@/services/api";

export default function CompleteProfileModal({ onClose }) {
   const router = useRouter();
   const { login } = useAuth();
   const [form, setForm] = useState({
     phoneNumber: "",
     role: "customer",
   });
   const [formErrors, setFormErrors] = useState([]);

   const handleChange = (e) => {
     setForm({ ...form, [e.target.name]: e.target.value });
   };

   const validateForm = () => {
     const errors = {};
     if (!form.phoneNumber.trim()) {
        errors.phoneNumber = "Phone Number is required";
     } else if (!/^\d{11}$/.test(form.phoneNumber)) {
         errors.phoneNumber = "Phone number must be 11 digits";
     }
     if (!form.role) errors.role = "Plesse select a role";
     setFormErrors(errors);
     return Object.keys(errors).length === 0;
   };

   const handleSubmit = async (e) => {
     e.preventDefault();
     if (!validateForm()) return;

     try {
       const response = await api.post("/auth/complete-profile", {
        phoneNumber: form.phoneNumber,
        role: form.role,
       });

       if (response.status === 200) {
        login(response.data.user, response.data.token);
        toast.success("Profile updated successfully!");
        onClose();
        router.push("/Add");
       }
     } catch (err) {
       console.error("Complete profile error:", err.response?.data || err.message);
       toast.error(err.response?.data?.message || "Failed to complete profile.");
     }
   };

   return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Complete Your Profile</h2>
        <p className="text-gray-600 text-center mb-6">
          To continue, please provide your phone number and select your role.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="e.g., 08012345678"
            />
            {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
            <select
              name="role"
              id="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
            {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white font-medium"
            >
              Complete Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
   );
}