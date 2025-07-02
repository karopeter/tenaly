"use client";
import { useState, useEffect } from "react";
import Img from "../Image";
import Button from "../Button";
import BusinessLink from "../navbar/business.link";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";

import BusinessList from "../business/businessList";
import HourSelectionModal from "../business/HourSelectionModal";

export default function AddBusinessHourss() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const mode = searchParams.get("mode") || "same";


  const [businessHours, setBusinessHours] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        setBusinesses(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setBusinesses([]);
        } else {
          toast.error("Failed to load businesses");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleAddHourClick = (biz) => {
    const addresses = biz.addresses || [];
    if (addresses.length === 0) {
      toast.warn("This business has no address. Please add an address first.");
      return;
    }

    if (addresses.length === 1) {
      router.push(`/add-business-hours?businessId=${biz._id}&mode=same`);
    } else {
      setSelectedBusiness(biz);
      setShowModal(true);
    }
  };

  const handleChoice = (mode) => {
    setShowModal(false);
    if (selectedBusiness) {
      router.push(`/add-business-hours?businessId=${selectedBusiness._id}&mode=${mode}`);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
      <BusinessLink />
      <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto md:h-[470px]">
          {businesses.length === 0 ? (
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
              <p className="text-[#868686] mt-2 font-inter font-[500] md:text-[14px]">
                You can't add a business hour because you
                <br className="hidden-xs" />
                haven't added a business yet
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/create-business")}
                  className="flex items-center gap-2 px-6 py-2 mt-5 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]"
                >
                  <Plus size={20} /> Add a business
                </Button>
              </div>
            </>
          ) : (
            <BusinessList businesses={businesses} onAddHourClick={handleAddHourClick} />
          )}
        </div>
      </div>
      {showModal && (
        <HourSelectionModal
          business={selectedBusiness}
          onClose={() => setShowModal(false)}
          onSelectMode={handleChoice}
        />
      )}
    </div>
  );
}
