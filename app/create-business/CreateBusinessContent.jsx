"use client";
import BusinessForm from "../components/BusinessForm/business-form";
import { useRouter } from "next/navigation";

export default function CreateBusinessContent() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/Profile");
  };

  return (
    <>
      <BusinessForm onBack={handleBack} />
    </>
  );
}
