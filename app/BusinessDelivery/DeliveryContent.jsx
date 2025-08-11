"use client";
import { useRouter } from "next/navigation";
import AddBusinessDetails from "../components/addBusinessDetails/add-business-details";

export default function DeliveryContent() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/Profile');
  };

  return (
    <div>
      <AddBusinessDetails onBack={handleBack} />
    </div>
  );
}