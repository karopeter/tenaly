"use client"
import { useState } from "react";
import Link from "next/link";
import SignUpForm from "./signupform";
import SignInModal from "./signin-modal";


export default function SignUpModal({ onClose, initialView = "signup" }) {
    const [authView, setAuthView] = useState(initialView);
    const [setShowSignInModal] = useState(false);
   
   return (
    <>
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
    <div className="bg-white w-[497px] max-w-md max-h-[90vh] overflow-y-auto rounded-[24px] shadow-lg p-6 relative z-60">
      {/* Close Icon */}
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 z-60">&times;</button>
       
       {authView === "signup" ? (
         <>
          <SignUpForm onClose={onClose} />
          {/* Already have an account */}
          <p className="text-center text-[14px] font-[400] font-inter text-[#545454] mt-4">
            Already have an account?{" "}
            <Link href="/" 
              onClick={() => setAuthView("signin")}>
             <span className="bg-clip-text text-transparent bg-gradient-to-r font-inter md:text-[14px] from-[#00A8DF] to-[#1031AA] md:text-[12px] font-inter font-[400] underline">Sign in</span>
            </Link>
          </p> 
          </>
       ): (
        <>
           <SignInModal onClose={onClose} />
        </>
       )}
    </div>
  </div>
  </>
);
}
