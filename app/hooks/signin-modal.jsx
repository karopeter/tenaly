"use client";
import { useState } from "react";
import Link from "next/link";
import SignInForm from "./signinform";
import SignUpForm from "./signupform";

const SignInModal = ({ onClose, initialView = "signin" }) => {
  const [authView, setAuthView] = useState(initialView);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white w-[497px] max-w-md max-h-[90vh] overflow-y-auto rounded-[24px] shadow-lg p-6 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500"
        >
          &times;
        </button>

        {authView === "signin" ? (
          <>
            <SignInForm onClose={onClose} />
            <p className="text-center text-sm text-[#545454] mt-4">
              Don’t have an account yet?{" "}
              <button
                onClick={() => setAuthView("signup")}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A8DF] to-[#1031AA] md:text-[14px] font-inter font-[400] underline"
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <SignUpForm onClose={onClose} />
            <p className="text-center text-sm text-[#545454] mt-4">
              Already have an account?{" "}
              <Link
                 href="/"
                onClick={() => setAuthView("signin")}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#00A8DF] to-[#1031AA] md:text-[14px] font-inter font-[400] underline"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
