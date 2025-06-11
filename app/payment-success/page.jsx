"use client";
import { useEffect, useState  } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessModal from "../components/successModal";

export default function PostSuccessPage() {
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
  }, [searchParams]);

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