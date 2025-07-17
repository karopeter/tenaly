"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import Button from "../components/Button";
import Img from "../components/Image";
import SignInModal from "./signin-modal";
import api from "@/services/api";
import { useAuth } from "../context/AuthContext";

export default function SignUpForm({ onClose }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    role: "customer",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const isFormValid = Object.values(form).every((val) => val.trim() !== "");

  // Optional: support dynamic role via URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam) {
      setForm((prev) => ({ ...prev, role: roleParam }));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/Add");
      onClose?.();
    }
  }, [isLoggedIn, router, onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email is invalid";
    if (!form.phone.trim()) errors.phone = "Phone Number is required";
    else if (!/^\d{11}$/.test(form.phone)) errors.phone = "Phone number must be 11 digits";
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!form.passwordConfirm) errors.passwordConfirm = "Confirm your password";
    else if (form.password !== form.passwordConfirm) errors.passwordConfirm = "Passwords do not match";
    if (!form.role) errors.role = "Please select a role";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const signupRes = await api.post("/auth/signup", {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        role: form.role,
      });

      const authToken = signupRes.data.token;

      // Fetch full user profile using token
      const profileRes = await api.get("/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const userProfile = profileRes.data;
      login(userProfile, authToken);
      toast.success("Signup successful! 🎉 Welcome to Tenaly!");
      setShowSignInModal(true);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      const { credential } = googleResponse;
      if (!credential) return toast.error("Google authentication failed: No credential received.");

      const authRes = await api.post("/auth/google-auth", { token: credential });
      const authToken = authRes.data.token;

      const profileRes = await api.get("/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      login(profileRes.data, authToken);
      toast.success("Google authentication successful! 🎉 Welcome to Tenaly!");
      router.push("/Add");
      onClose?.();
    } catch (err) {
      console.error("Google auth error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  if (showSignInModal) return <SignInModal onClose={onClose} />;

  return (
    <>
      <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">Welcome to Tenaly</h2>
      <p className="text-[#868686] md:text-[14px] font-[400] font-inter">Fill in your details to enjoy all the features of Tenaly</p>

      <form onSubmit={handleSubmit} className="space-y-3 mt-4">
        {/* Email */}
        <InputField
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          error={formErrors.email}
        />
        {/* Full Name */}
        <InputField
          name="fullName"
          placeholder="Enter your first and last name"
          value={form.fullName}
          onChange={handleChange}
          error={formErrors.fullName}
        />
        {/* Phone */}
        <InputField
          name="phone"
          placeholder="+234 | Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          error={formErrors.phone}
        />
        {/* Role */}
        <div className="mt-4">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm text-[#525252] bg-white"
          >
            <option value="customer">Sign up as Customer</option>
            <option value="seller">Sign up as Seller</option>
          </select>
          {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
        </div>
        {/* Password */}
        <PasswordInput
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          error={formErrors.password}
        />
        {/* Confirm Password */}
        <PasswordInput
          name="passwordConfirm"
          placeholder="Re-enter your password"
          value={form.passwordConfirm}
          onChange={handleChange}
          show={showConfirm}
          toggle={() => setShowConfirm(!showConfirm)}
          error={formErrors.passwordConfirm}
        />
        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`pt-[10px] pr-[16px] pb-[10px] pl-[16px] w-[380px] h-[52px] rounded-[8px] mt-4 font-inter md:text-[16px] font-[500] ${
            isFormValid
              ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
              : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7]"
          }`}
        >
          Sign Up
        </Button>
      </form>

      <p className="text-[#232323] font-[400] md:text-[11px] font-inter text-center mt-3">
        By signing up, you agree to all the Terms Of Service and Privacy Policy
      </p>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="mx-2 text-sm text-gray-400">or Sign up with</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Google Auth */}
      <div className="flex gap-4 justify-center mt-4">
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={(err) => toast.error("Google Login Failed")}
          />
        </GoogleOAuthProvider>
      </div>
    </>
  );
}

// Reusable Input Field
const InputField = ({ name, value, onChange, placeholder, error }) => (
  <div className="mt-4">
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Password Field
const PasswordInput = ({ name, value, onChange, placeholder, show, toggle, error }) => (
  <div className="mt-4 relative">
    <input
      name={name}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
    />
    <button type="button" onClick={toggle} className="absolute right-4 top-1/2 transform -translate-y-1/2">
      {show ? <EyeSlashIcon className="w-5 h-5 text-[#525252]" /> : <EyeIcon className="w-5 h-5 text-[#525252]" />}
    </button>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
