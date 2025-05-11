"use client";
import { useState } from "react";
import InputField from "../components/input";
import Button from "../components/Button";
import api from "@/services/api";
import { toast } from "react-toastify";

export default function PersonalProfile({ isEditable, imageFile }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Ensure that all required fields are filled
    if (!firstName || !lastName || !email || !phoneNumber) {
      setError("All fields are required: FirstName, LastName, Email, and PhoneNumber.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);

    if (imageFile) {
      formData.append("image", imageFile); // Add the image to formData if it exists
    }

    try {
      const response = await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile created successfully");
      toast.success("Profile created successfully");
      console.log(response.data);
    } catch (err) {
      console.error(err.response?.data?.message || "Something went wrong");
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:px-[50px] px-4 mt-8">
      <form onSubmit={handleSubmit}>
        {/* First and Last Name */}
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
          <InputField
            label="First Name"
            placeholder="Golibe"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            label="Last Name"
            placeholder="Faith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mt-1">
          <div className="grid grid-cols-1">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex-1">
                <InputField
                  label="Email"
                  placeholder="golibe.f@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              {isEditable && (
                <Button
                  type="button"
                  className="text-[#232323] text-sm underline bg-transparent whitespace-nowrap"
                >
                  Change my email
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mt-1">
          <InputField
            label="Phone Number"
            placeholder="08183168098"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="md:w-[262px] md:h-[44px] md:rounded-[8px] 
            md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
            font-[500] md:text-[14px] bg-[#EDEDED] text-[#CDCDD7] 
            bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Save Changes"}
          </Button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
      </form>
    </div>
  );
}
