"use client";
import EditDeliveryForm from "../components/BusinessForm/edit-delivery-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/navbar/sidebar";

export default function EditDeliveryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/Profile");
  }

    return (
        <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
                         <div className="flex flex-col md:flex-row gap-10">
                         {/* Sidebar for desktop view */}
                         <div className="hidden md:block">
                           <Sidebar activeSection="Business Profile" />
                         </div>
                           {/* Main content area */}
                         <main className="flex-1">
                           {/* Back button for mobile view */}
                           <button 
                             onClick={handleBack} 
                             className="text-blue-700 mb-4 flex items-center gap-2 md:hidden"
                           >
                             <ArrowLeft size={20} /> Back
                           </button>
                             <EditDeliveryForm onBack={handleBack} />
                         </main>
                         </div>
            </div>
    )
}