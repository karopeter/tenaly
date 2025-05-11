"use client";
import { useState } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";

export default function MorePropertyPost() {
  const router = useRouter();
  const handleGoBack  = () => router.back();
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />

           <main className="flex-1">
              <div className="bg-white shadow-phenom md:rounded-[12px] p-10 text-center">
              <Button
                onClick={handleGoBack}
                className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]"  /> 
                <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
              </Button>
              </div>
              <h3 className="text-center text-[#525252] fonmt-[500] font-inter md:text-[16px]">Shortlet</h3>
           </main>
        </div>
      </div>
    );
}