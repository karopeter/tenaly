"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import api from "@/services/api";

export default function CompleteProfileModal({ user, token, onClose }) {
  const { login } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleSaveRole = async () => {
    setLoading(true);
    try {
      // Use the correct endpoint and variable name
      const response = await api.put("/auth/complete-profile", { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create updated user profile with the new role
      const updatedProfile = { 
        ...user, 
        role: response.data.user.role 
      };
      
      // Update the context with the new profile data
      login(updatedProfile, token);
      toast.success("Profile updated successfully! Welcome to Tenaly! 🎉");
      
      // Close the modal first
      onClose();

      // Redirect to the correct page based on the selected role
      if (response.data.user.role === "seller") {
        router.push("/Profile");
      } else {
        router.push("/Product-List");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error(error.response?.data?.message || "Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-2 text-center text-[#525252]">Welcome to Tenaly! 🎉</h3>
        <p className="mb-6 text-center text-[#868686]">
          To get started, please tell us how you want to use the platform.
        </p>
        <div className="mb-6">
          <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-3">
            What do you want to perform?
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full px-3 py-3 border border-[#CDCDD7] rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     text-[#525252] bg-white"
          >
            <option value="customer">I am buying</option>
            <option value="seller">I am selling</option>
          </select>
        </div>
        <Button
          onClick={handleSaveRole}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] hover:opacity-90"
          }`}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}