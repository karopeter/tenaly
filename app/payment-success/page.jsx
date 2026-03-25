"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";


function PostSuccessContent() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(null);
  
  const VERIFY_ENDPOINTS = {
    agriculture: (ref) => `/agriculture/verify-payment/${ref}`,
    vehicles: (ref) => `/vehicles/verify-payment/${ref}`,
    beauty: (ref) => `/beauty/verify-payment/${ref}`,
    equipment: (ref) => `/equipments/verify-payment/${ref}`,
    gadget: (ref) => `/gadget/verify-payment/${ref}`,
    pet: (ref) => `/pets/verify-payment/${ref}`,
    property: (ref) => `/property/verify-payment/${ref}`,
    kids: (ref) => `/kids/verify-payment/${ref}`,
    services: (ref) => `/services/verify-payment/${ref}`,
    laptop: (ref) => `/laptops/verify-payment/${ref}`,
    fashion: (ref) => `/fashion/verify-payment/${ref}`,
    household: (ref) => `/household/verify-payment/${ref}`,
    construction: (ref) => `/construction/verify-payment/${ref}`,
    job: (ref) => `/job/verify-payment/${ref}`,
    hire: (ref) =>  `/hire/verify-payment/${ref}`,
  }

  useEffect(() => {
   const verifyPayment = async () => {
    setVerifying(true);

    const reference = searchParams.get("ref");
    const adType = searchParams.get("adType");

    if (!reference) {
      toast.error("No payment reference found.");
      router.push("/Add");
      return;
    }

    if (!adType || !VERIFY_ENDPOINTS[adType]) {
     // toast.error("Unknown ad type. Please contact support");
      router.push("/Add");
      return;
    }

    try {
      const endpoint = VERIFY_ENDPOINTS[adType](reference);
      const res = await api.get(endpoint);

      if (res.data.success || res.data.status === "success" || res.data.message?.includes("verified")) {
        setStatus("success");
        toast.success("Payment successful! Your ad has been posted.");

        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");
        localStorage.setItem("adUpdated", "true");

        setTimeout(() => router.push("/Add"), 2000);
      } else {
         setStatus("failed");
         toast.error("Payment verification failed.");
         setTimeout(() => router.push("/Add"), 3000);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      toast.error("Error verifying payment. Please contact support.");
      setTimeout(() => router.push("/Add"), 3000);
    } finally {
      setVerifying(false);
    }
   };

   verifyPayment();
  }, [searchParams, router]); 

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      {verifying ? (
        <>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Verifying Payment...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </>
      ) : status === "success" ? (
        <>
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your ad has been posted successfully. Redirecting...</p>
        </>
      ) : status === null ? (
       <p className="text-gray-500">Please wait...</p>
      ): status === "failed" || status === "error" ? (
        <>
         <div className="text-red-500 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600">
          {status === "error"
           ? "An error occurred. Please contact support."
            : "Payment verification failed. Please contact support."}
        </p>
        </>
      ): null}
    </div>
  </div>
);
}


export default function PostSuccessPage() {
  return (
    <Suspense fallback={<div>Loading success page...</div>}>
      <PostSuccessContent />
    </Suspense>
  );
}