"use client";
import BusinessDeliveryForm from "../components/BusinessForm/business-delivery-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/navbar/sidebar";

export default function AddBusinessDelivery() {
    const router = useRouter();

     const handleBack = () => {
      // Navigate back to the dashboard when the back button is clicked
      router.push("/Profile");
    };

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
                   <BusinessDeliveryForm onBack={handleBack} />
               </main>
               </div>
         </div>
    );
}