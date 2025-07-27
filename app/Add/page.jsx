"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import api from "@/services/api";

export default function AddCarPost() {
  const router = useRouter();
  const [userAds, setUserAds] = useState(undefined); // undefined = loading
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized");
        setUserAds([]);
        return;
      }
      try {
        const res = await api.get("/carAdd/check-ad");
        setUserAds(res.data.ads || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setUserAds([]);
      }
    };
    fetchUserAds();
  }, []);


  return (
    <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
  <div className="flex flex-col md:flex-row gap-6">
    {/* Sidebar */}
    <div className="w-full md:w-auto">
      <Sidebar />
    </div>

    {/* Main */}
    <main className="flex-1 mt-6 md:mt-0">
      {userAds === undefined ? (
        <div className="bg-white p-6 md:p-10 text-center shadow-phenom rounded-lg">
          <span className="text-[#525252] text-sm md:text-base font-[500] font-inter">
            Loading your ads…
          </span>
        </div>
      ) : error ? (
        <div className="bg-white w-full h-[490px] p-6 md:p-10 text-center shadow-phenom rounded-lg flex flex-col justify-center items-center">
          <p className="text-red-500 text-sm md:text-base">{error}</p>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => router.push("/create-post-car")}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
            >
              <Plus size={20} /> Post an Ad
            </Button>
          </div>
        </div>
      ) : userAds.length === 0 ? (
        <div className="bg-white w-full h-[490px] p-6 md:p-10 text-center shadow-phenom rounded-lg flex flex-col justify-center items-center">
          <Img
            src="/postAds.svg"
            width={158}
            height={158}
            className="mx-auto mb-4"
            alt="No Posts"
          />
          <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
            No ads posted yet
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/create-add")}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
            >
              <Plus size={20} /> Post an Ad
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white w-full h-[490px] p-6 md:p-10 text-center shadow-phenom rounded-lg flex flex-col justify-center items-center">
          <p className="font-[500] text-[#525252] font-inter text-sm md:text-base mb-4">
            You already have {userAds.length} ad{userAds.length > 1 ? "s" : ""}.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/create-add")}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
            >
              <Plus size={20} /> Continue
            </Button>
          </div>
        </div>
      )}
    </main>
    </div>
    </div>
  );
}
