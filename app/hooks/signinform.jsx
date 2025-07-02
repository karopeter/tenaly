"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; 
import Button from "../components/Button";
import Img from "../components/Image";
import ForgotPassword from "./forgot-password-model";
import SignUpModal from "./signup-modal";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

export default function SignInForm({ onClose }) {
     const baseURI = process.env.NEXT_PUBLIC_BASE_URL;
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const router = useRouter();
        const [showForgotPasswordModal, setShowForgotPaswordModal] = useState(false)
        const [showSignUpModal] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const {login } = useAuth();
        const [isPhoneSignIn, setIsPhoneSignIn] = useState(false);
        const [form, setForm] = useState({
            email: "",
            phone: "",
            password: ""
        });
       
       const [formErrors, setFormErrors] = useState({
         email: "",
         phone: "",
         password: "",
         general: ""
       });
    
       const validateForm  = () => {
         const errors = { email: "",  phone: "", password: "", general: ""}
         let isValid = true;
    
         if (form.password.trim() === "") {
            errors.password = "Password is required";
            isValid = false;
         }
    
         if (isPhoneSignIn) {
            if (!form.phone.trim()) {
              errors.phone = "Phone Number is required.";
              isValid = false;
            } else if (!/^(\+234|0)[789][01]\d{8}$/.test(form.phone)) {
              errors.phone = "Enter a valid phone number.";
              isValid = false;
            }
         } else {
            if (!form.email.trim()) {
              errors.email = "Email is required.";
              isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                errors.email = "Invalid email address.";
                isValid = false;
            }
         }
    
         
         setFormErrors(errors);
         return isValid;
       }
    
        const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };
    
        const isFormValid = form.password.trim() !== "" && (form.email.trim() !== "" || form.phone.trim() !== "");
    
        const handleSignIn = async (e) => {
            e.preventDefault();
    
    
            if (!validateForm()) return;
    
            try {
             const loginValue = isPhoneSignIn ? form.phone : form.email;

             const payload = {
               login: loginValue,
               password: form.password
             };

             console.log('Sending login request', payload);
    
             const response = await fetch(`${baseURI}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
             });
    
             const data = await response.json();

             console.log("📥 Login Response:", data);
    
             if (response.ok) {
                login(data, data.token);
                toast.success("Login successful!");
                onClose();
                router.push("/Add"); 
    
                // setTimeout(() => {
                //    window.location.reload();
                // }, 300);
             } else {
                toast.error(data.message || "Login failed:");
             }
            } catch (error) {
              toast.error("Something went wrong. Please try again.");
            }
        };
    
        const handleGoogleSuccess = async (response) => {
            try {
              const { credential } = response; 
          
              if (!credential) {
                toast.error("Google authentication failed: No credential received.");
                return;
              }
          
              const res = await fetch(`${baseURI}/auth/google-auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credential }),
              });
          
              const data = await res.json();
          
              if (res.ok) {
                login(data, data.token);
                toast.success("Google authentication successful!", data.token);
                 router.push("/Add");
                 onClose();
              } else {
                toast.error(data.message || "Google authentication failed");
              }
            } catch (error) {
              toast.error("Something went wrong. Please try again.");
            }
          };
    
        if (showForgotPasswordModal) {
            return <ForgotPassword onClose={() => setShowForgotPaswordModal(false)} />
        }
    
        if (showSignUpModal) {
            return <SignUpModal onClose={onClose} />
        }
    return (
     <>
       <h2 className="md:text-[20px] font-[500] text-center font-inter mb-4 text-[#525252]">Welcome to Tenaly</h2>
          <p className="text-[#868686] md:text-[14px] font-[400] font-inter text-center">Sign in with your details to enjoy all the features of Tenaly</p>

          {/* Switch between Email and Phone */}
          <div className="flex justify-between mt-6">
               <Button
                   onClick={() => setIsPhoneSignIn(false)}
                   className={`w-[184px] h-[37px] rounded-[4px] pt-[10px] pr-[16px] pb-[10px] pl-[16px] 
                   ${!isPhoneSignIn ? 'bg-[#5555DD] text-white' : 'border border-[#EDEDED] text-[#525252]'}`}
                >
                    Email
               </Button>
               <Button
                 onClick={() => setIsPhoneSignIn(true)}
                 className={`w-[184px] h-[37px] rounded-[4px] pt-[10px] pr-[16px] pb-[10px] pl-[16px] 
                 ${isPhoneSignIn ? 'bg-[#5555DD] text-white' : 'border border-[#EDEDED] text-[#525252]'}`}
                 >
                  Phone Number
                </Button>
                </div>

                {formErrors.general && <p className="text-red-500 text-sm mt-2">{formErrors.general}</p>}
                {/* Form Inputs */}
                <div className="space-y-3">
                <form onSubmit={handleSignIn}>
                    <div className="mt-4">
                        {isPhoneSignIn ? (
                            <>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="+234| Enter your phone number"
                                onChange={handleChange}
                                value={form.phone}
                                className="w-[380px] h-[52px] px-4 outline-none rounded-[4px] 
                                border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
                            />
                            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                            </>
                        ) : (
                            <>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                value={form.email}
                                className="w-[380px] h-[52px] pt-1 pr-3 pb-1 pl-3 outline-none rounded-[4px] 
                                border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                           </> 
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mt-4 relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            value={form.password}
                            className="w-[380px] h-[52px] pt-1 pr-3 pb-1 pl-3 outline-none 
                            rounded-[4px] border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5 text-[#525252]" />
                            ) : (
                                <EyeIcon className="w-5 h-5 text-[#525252]" />
                            )}
                        </Button>
                        {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                    </div>

            {/* Forgot Password */}
             <div className="text-left mt-2">
                <span className="text-[#4C4C4C] md:text-[12px] font-[400] font-inter">
                 Forgot Password?</span>{" "}
               <Link 
                 href="/" 
                 onClick={() => setShowForgotPaswordModal(true)}>
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A8DF] to-[#1031AA] 
                  md:text-[12px] font-inter font-[400] 
                  underline">
                 Reset</span>
               </Link>
             </div>

             {/* Sign In Button */}
              <Button
                 type="submit"
                  disabled={!isFormValid}
                  className={`pt-[10px] pr-[16px] pb-[10px] pl-[16px] w-[380px] h-[52px] rounded-[8px] mt-4 font-inter md:text-[16px] font-[500] ${
                 isFormValid
                 ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white" 
                : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7]" 
              }`}>
                Sign In
            </Button>

             {/* Divider */}
            <div className="flex items-center my-4">
               <div className="flex-grow h-px bg-gray-300" />
                 <span className="mx-2 text-sm text-gray-400">or Sign in with</span>
                    <div className="flex-grow h-px bg-gray-300" />
            </div>
  {/* Social Buttons */}
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
  </form>
 </div>
     </>
    )
}