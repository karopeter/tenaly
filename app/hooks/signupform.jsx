"use client"
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; 
import Img from "../components/Image";
// import { useSession } from "next-auth/react";
// import { signIn } from "next-auth/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import SignInModal from "./signin-modal";
import api from "@/services/api";

export default function SignUpForm({ onClose }) {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const router = useRouter(); // Initialize router
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
      const [showSignInModal, setShowSignInModal] = useState(false);
      const { login } = useAuth(); 
       const [form, setForm] = useState({
            email: "",
            fullName: "",
            phone: "",
            password: "",
            passwordConfirm: ""
        });
        const [formErrors, setFormErrors] = useState({});
    
        const isFormValid = Object.values(form).every((val) => val.trim() !== "");

      
    
        const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value});
        };
    
        const validateForm = () => {
          const errors = {};
    
          if (!form.fullName.trim()) {
            errors.fullName = "Full Name is required";
          }
    
          if (!form.email.trim()) {
            errors.email = "Email is required";
          } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = "Email is invalid";
          }
    
          if (!form.phone.trim()) {
            errors.phone = "Phone Number is required";
          } else if (!/^\d{11}$/.test(form.phone)) {
            errors.phone = "Phone number must be 11 digits";
          }
    
          if (!form.password) {
            errors.password = "Password is required";
          } else if (form.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
          }
    
          if (!form.passwordConfirm) {
            errors.passwordConfirm = "Confirm your password";
          } else if (form.password !== form.passwordConfirm) {
            errors.passwordConfirm = "Password do not match";
          }
    
          setFormErrors(errors);
          return Object.keys(errors).length === 0;
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
        
          if (!validateForm()) return;
        
          try {
            const response = await api.post("/auth/signup", {
              fullName: form.fullName,
              email: form.email,
              phoneNumber: form.phone,
              password: form.password,
              passwordConfirm: form.passwordConfirm,
            });
        
            const data = response.data;
        
            localStorage.setItem("token", data.token);
            toast.success("Signup successful! 🎉");
            setShowSignInModal(true);
          } catch (error) {
            if (error.response && error.response.status === 400) {
              toast.error(error.response.data.message || "Email or phone number already exists");
            } else {
              toast.error("Invalid Authentication. Please try again");
            }
          }
        };              
    
  
    
const handleGoogleSuccess = async (googleResponse) => {
  try {
    console.log("Google Response:", googleResponse);

    const { credential } = googleResponse;

    if (!credential) {
      toast.error("Google authentication failed: No credential received.");
      return;
    }

    const response = await api.post("/auth/google-auth", { token: credential });

    const data = response.data;

    // ✅ call login to update isLoggedIn immediately
    login(data.token);

    toast.success("Google authentication successful! 🎉");
    router.push("/Add");
    onClose();
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message || "Google authentication failed.");
    } else {
      toast.error("Error during Google authentication. Please try again.");
    }
  }
};
       

     if (showSignInModal) {
        return <SignInModal onClose={onClose} />
      }

    return (
      <>
      <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">Welcome to Tenaly</h2>
      <p className="text-[#868686] md:text-[14px] font-[400] font-inter">Fill in your details to enjoy all the features of Tenaly</p>
            {/* Form Inputs */}
            <div className="space-y-3">
              <form onSubmit={handleSubmit}>
                 <div className="mt-4">
                   <input 
                     name="email" 
                     type="email" 
                     placeholder="Enter your email"
                     onChange={handleChange} 
                     value={form.email} 
                     className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]" />
                     {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                 </div>
                <div className="mt-4">
                 <input 
                   name="fullName" 
                   placeholder="Enter your first and last name" 
                   onChange={handleChange} 
                   value={form.fullName} 
                   className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]" />
                    {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                </div>
               <div className="mt-4">
                  <input 
                    name="phone"
                     placeholder="+234 | Enter your phone number" 
                     onChange={handleChange} 
                     value={form.phone} 
                     className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] outline-none rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]" />
                   {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
               </div>
               {/* Password field */}
               <div className="mt-4 relative">
                 <input
                   name="password" 
                   type={showPassword ? "text" : "password"}
                   placeholder="Enter your password" 
                   onChange={handleChange} 
                   value={form.password} 
                   className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] 
                   outline-none rounded-[4px] border border-[#CDCDD7] 
                   text-sm placeholder:text-[#CDCDD7]" />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-[#525252]" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-[#525252]" />
                )}
              </button>
                {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
               </div>
               {/* Confirm Password Field */}
                <div className="mt-4 relative">
                  <input 
                    name="passwordConfirm" 
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password" 
                    onChange={handleChange} value={form.passwordConfirm} 
                    className="pt-1 pr-3 pb-1 pl-3 w-[380px] h-[52px] 
                    outline-none rounded-[4px] border border-[#CDCDD7]
                     text-sm placeholder:text-[#CDCDD7]" />
               <button
                 type="button"
                 onClick={() => setShowConfirm(!showConfirm)}
                 className="absolute right-4 top-1/2 transform -translate-y-1/2"
               >
                {showConfirm ? (
                  <EyeSlashIcon className="w-5 h-5 text-[#525252]" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-[#525252]" />
                )}
              </button>
                 {formErrors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{formErrors.passwordConfirm}</p>}
                </div>
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
            </div>
      
            {/* Terms */}
            <p className="text-[#232323] font-[400] md:text-[11px] font-inter text-center mt-3">
              By signing up, you agree to all the Terms Of Service and Privacy Policy
            </p>
      
            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-sm text-gray-400">or Sign up with</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>
      
           {/* Social Buttons */}
           {/* <div className="flex gap-4 justify-center mt-4">
  <Button
    onClick={() => signIn("google", { callbackUrl: "/Add" })}
    className="flex items-center gap-2 w-[184px] h-[52px] rounded-[8px] border font-inter font-[500] text-[#525252] text-[16px] border-[#CDCDD7]"
    type="button"
  >
    <Img src="/google.svg" alt="Google" width={24} height={24} />
    Google
  </Button>
</div> */}
         <div className="flex gap-4 justify-center mt-4">
         <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={(error) => console.error("Google Login Failed:", error)}
              render={(renderProps) => (
             <Button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="flex items-center gap-2 w-[184px] h-[52px] rounded-[8px] border font-inter font-[500] text-[#525252] text-[16px] border-[#CDCDD7]">
               <Img src="/google.svg" alt="Google" width={24} height={24} />
               Google
            </Button>
           )}
         />
        </GoogleOAuthProvider>
        </div>
      </>
    )
}