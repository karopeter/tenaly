"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/services/api";
import Link from "next/link";

export default function AccountSetupBanner() {
  const { isLoggedIn, role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [setupStatus, setSetupStatus] = useState({
    hasBusinessProfile: false,
    hasBusinessHours: false,
    hasBusinessDelivery: false,
    hasTierVerification: false,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || role !== 'seller') return;

    const checkSetup = async () => {
      try {
        const res = await api.get('/business/my-businesses');
        const businesses = res.data || [];
        const hasBusiness = businesses.length > 0;
        const hasHours = businesses.some(b => b.businessHours?.length > 0);
        const hasDelivery = businesses.some(b =>
          b.addresses?.some(a => a.deliveryAvailable !== undefined)
        );

        const tierRes = await api.get('/tier-verification/status');
        const hasTier = tierRes.data?.currentLevel > 0;

        const status = {
          hasBusinessProfile: hasBusiness,
          hasBusinessHours: hasHours,
          hasBusinessDelivery: hasDelivery,
          hasTierVerification: hasTier,
        };
        setSetupStatus(status);
        setIsComplete(Object.values(status).every(Boolean));
        setBannerLoading(false);
      } catch {
        setBannerLoading(false);
      }
    };
    checkSetup();
  }, [isLoggedIn, role]);

  // Only show for sellers who haven't completed setup
 if (!isLoggedIn || role !== 'seller' || isComplete || bannerLoading) return null;

  const steps = [
    {
      label: 'Create your business profile',
      done: setupStatus.hasBusinessProfile,
      href: '/Business'
    },
    {
      label: 'Set your business hour',
      done: setupStatus.hasBusinessHours,
      href: '/BusinessHours'
    },
    {
      label: 'Set your business delivery',
      done: setupStatus.hasBusinessDelivery,
      href: '/BusinessDelivery'
    },
    {
      label: 'Tier Verification',
      done: setupStatus.hasTierVerification,
      href: '/tier-verification'
    },
  ];

  return (
    <>
      {/* ✅ Banner strip under navbar - matches design exactly */}
      <div className="w-full bg-[#EEEEFF] px-6 py-2 flex items-center justify-between mt-20">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-lg">⚠️</span>
          <span className="text-[#525252] text-[13px] font-[500]">
            You are yet to complete your account setup
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[#000087] text-[13px] font-[600] flex items-center gap-1 hover:underline"
        >
          Complete Setup →
        </button>
      </div>

      {/* ✅ Modal - matches design exactly */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-[560px] shadow-xl">
            <h2 className="text-[18px] font-[600] text-[#1A1A2E] mb-1">
              Complete Your Account Setup
            </h2>
            <p className="text-[#767676] text-[13px] mb-6">
              Set up your business to start selling and reach more buyers on Tenaly
            </p>

            <div className="border-t border-[#EDEDED]">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-4 border-b border-[#EDEDED]"
                >
                  <span className="text-[#525252] text-[14px]">{step.label}</span>
                  {step.done ? (
                    <span className="flex items-center gap-2 text-green-600 font-[500] text-[14px]">
                      Completed ✅
                    </span>
                  ) : (
                    <Link
                      href={step.href}
                      onClick={() => setShowModal(false)}
                      className="flex items-center gap-1 text-[#000087] font-[600] text-[14px] hover:underline"
                    >
                      Proceed →
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Overall Proceed link at bottom left */}
            <div className="mt-4">
              <Link
                href={steps.find(s => !s.done)?.href || '/Business'}
                onClick={() => setShowModal(false)}
                className="text-[#000087] font-[600] text-[14px] flex items-center gap-1 hover:underline"
              >
                Proceed →
              </Link>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-[#EDEDED] rounded-lg text-[#525252] text-[14px] hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}