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

  useEffect(() => {
   const verifyPayment = async () => {
      const reference = searchParams.get("ref");

      if (!reference) {
        toast.error("No Payment reference found.");
        router.push("/Add");
        return;
      }

      try {
       const res = await api.get(`/vehicles/verify-payment/${reference}`);
       if (res.data.success || res.data.status === "success") {
        setStatus("success");
        toast.success("Payment successful! Your ad has been posted.");

        // Clear any incomplete ad tracking 
        localStorage.removeItem("editingCarAdId");
        localStorage.removeItem("editingCarAdData");
        localStorage.removeItem("editingAdType");

        // Set flag to refresh ads list 
        localStorage.setItem('adUpdated', 'true');

        // Redirect after 2 seconds 
        setTimeout(() => {
          router.push("/Add");
        }, 2000);
       } else {
        setStatus("failed");
        toast.error("Payment verification failed");

        setTimeout(() => {
          router.push("/Add");
        }, 3000);
       }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        toast.error("Error verifying payment. Please contact support.");

        setTimeout(() => {
          router.push("/Add");
        }, 3000);
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
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying Payment...
            </h2>
            <p className="text-gray-600 mt-2">Please wait</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your ad has been posted successfully. Redirecting...
            </p>
          </>
        ) : (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your ad has been posted successfully. Redirecting...
            </p>
          </>
        )}
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