"use client";
import { useRouter  } from "next/navigation";
import AddBusinessHourss from "../components/addBusinessHours/add-busi-hours";

export default function BusinessHourContent() {
    const router = useRouter();

  const handleBack = () => {
    router.push('/Profile');
  };

  return (
    <>
      <AddBusinessHourss onBack={handleBack} />
    </>
  );
}