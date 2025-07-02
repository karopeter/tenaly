"use client";
import { useState } from "react";
import Button from "../Button";
import Img from "../Image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import SignInModal from "@/app/hooks/signin-modal";
import SignUpModal from "@/app/hooks/signup-modal";
import TenalyDiscovery from "./Discovery";

export default function TenalyLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const backgroundImageUrl = "/circle-bg1.svg";

  return (
    <>
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      ></div>

      {/* Content Wrapper */}
      <div className="w-full max-w-7xl mx-auto relative z-10 md:pr-[104px] md:pl-[104px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-20 md:mt-2">
          {/* Text Section */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] font-inter mb-4">
              Connecting Buyers and Sellers Seamlessly
            </h1>
            <p className="text-[#3C3C3C] mb-6 font-[400] font-inter text-sm sm:text-base">
              Tenaly is a trusted online marketplace for buying and selling vehicles and real estate with ease, security, and convenience.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#000087] rounded-[8px] 
                text-white px-6 py-3 min-w-[140px]">
                Start Selling
              </Button>
              <Button 
               onClick={() => setIsSignInModalOpen(true)}
               className="border border-[#000087] rounded-[8px] px-6 py-3 text-[#000087] min-w-[140px]">
                Start Buying
              </Button>
            </div>
            <div className="mt-4 flex justify-center md:justify-start">
                <Img 
                  src="/Trustpilot.svg"
                  alt="TrustPilot"
                  width={208}
                  height={89}
                  className="w-[208px] h-[89px]"
                  />
            </div>
          </div>

          {/* Image Section */}
          <div>
            <Img
              src="/excitedMan.svg"
              alt="Excited man"
              width={844}
              height={716.59}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <TenalyDiscovery />

    {/* Modals */ }
    {isModalOpen && <SignUpModal onClose={() => setIsModalOpen(false)} />}
    {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} />}  
    </>
  );
}