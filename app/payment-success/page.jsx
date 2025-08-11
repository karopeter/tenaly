"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessModal from "../components/successModal";

// This is the component that uses client-side hooks like useSearchParams.
// We've extracted it so it can be wrapped by a Suspense boundary.
function PostSuccessContent() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      // Optionally verify the payment on the backend
      setShowModal(true);
    }

    const timer = setTimeout(() => {
      router.push("/view-add");
    }, 8000);

    return () => clearTimeout(timer);
  }, [searchParams, router]); // Added router to the dependency array

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/view-add");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {showModal && <SuccessModal onClose={handleCloseModal} />}
    </div>
  );
}

// The main page component now wraps the client-side logic in a Suspense boundary.
// This allows Next.js to pre-render the page successfully.
export default function PostSuccessPage() {
  return (
    <Suspense fallback={<div>Loading success page...</div>}>
      <PostSuccessContent />
    </Suspense>
  );
}