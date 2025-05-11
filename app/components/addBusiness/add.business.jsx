"use client";
import { useState, useEffect } from "react";
import Img from "../Image";
import { Plus } from "lucide-react";
import Button from "../Button";
import { useRouter } from "next/navigation";
import BusinessLink from "../navbar/business.link";
import api from "@/services/api";
import { toast } from "react-toastify";


export default function AddBusiness() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

   
    useEffect(() => {
      const fetchBusinesses = async () => {
        try {
          const res = await api.get("/business/my-businesses");
          setBusinesses(res.data);
        } catch (err) { 
          if (err.response?.status === 404) {
            setBusinesses([]); // No businesses
          } else {
            toast.error("Failed to load businesses");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchBusinesses();
    }, []);

    if (loading) return <p className="text-center mt-20">Loading....</p>

    return (
     <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
      <BusinessLink />
      <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto md:h-[470px]">
          {businesses.length === 0 ?  (
            <>
           <div className="mt-20">
            <Img 
            src="/postAds.svg"
            width={158}
            height={158}
            className="mx-auto mb-4"
            alt="No Business Post"
            />
           </div>
           <p className="text-[#868686] mt-2  font-inter font-[500] md:text-[14px]">
             No Bussiness added yet
            </p>
           </>
          ): (
          <>
          <div className="mt-20">
            <Img 
            src="/postAds.svg"
            width={158}
            height={158}
            className="mx-auto mb-4"
            alt="No Business Post"
            />
           </div>
           <h2 className="text-lg font-semibold mb-2 text-center">
                You have added {businesses.length} business{businesses.length > 1 ? "es" : ""}
            </h2>
            <ul className="flex md:flex-row justify-center gap-2 text-center text-gray-700">
                {businesses.map((biz) => (
                  <li key={biz._id} className="font-medium mb-1">
                    • {biz.businessName}
                  </li>
                ))}
              </ul>
          </>
          )}
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/create-business")}
              className="flex items-center gap-2 px-6 py-2 mt-5 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
            >
              <Plus size={20} /> {businesses.length === 0 ? "Add a business" : "Add more business"}
            </Button>
          </div>
      </div>
    </div>
    </div>
    )
}