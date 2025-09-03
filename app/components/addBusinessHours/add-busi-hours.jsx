"use client";
import { useState, useEffect } from "react";
import Img from "../Image";
import HourSelectionModal from "../business/HourSelectionModal";
import Button from "../Button";
import BusinessLink from "../navbar/business.link";
import { Plus, MoreVertical, MapPin, Clock, Pencil, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";
import { PencilIcon } from "@heroicons/react/24/solid";



function BusinessList({ businesses, onAddHourClick }) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-hidden p-2">
      <ul className="flex flex-col gap-4 mt-5 w-full">
        {businesses.map((biz) => {
          const hasHours = biz.businessHours && biz.businessHours.length > 0;

          return (
            <li
              key={biz._id}
              className="flex flex-col gap-2 p-4"
            >
              {/* Business Name and Edit/Add Button */}
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium font-[500] text-[#525252] font-inter">
                  {biz.businessName}
                </span>

                <div
                  className="flex flex-row items-center gap-2 px-3 py-1 bg-[#FAFAFA] rounded-md cursor-pointer"
                  onClick={() => {
                    if (hasHours) {
                      router.push(`/EditBusinessHour?businessId=${biz._id}`);
                    } else {
                      onAddHourClick(biz);
                    }
                  }}
                >
                  {hasHours ? (
                    <PencilIcon className="w-4 h-4 text-[#000087]" />
                  ) : (
                    <Plus size={16} className="w-4 h-4 text-[#000087]" />
                  )}
                  <span className="text-[13px] text-[#000087] font-[500] font-inter whitespace-nowrap">
                    {hasHours ? "Edit" : "Add business hour"}
                  </span>
                </div>
              </div>

              {/* Loop through addresses and display hours */}
              {biz.addresses.map((addressObj, index) => {
               
                const hoursForAddress = biz.businessHours && biz.businessHours[index];

                return (
                  <div key={addressObj._id} className="mt-2">
                    {/* Address section */}
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                      <div className="flex items-center gap-4 min-w-0">
                        <Img 
                           src="/addressLoc.svg"
                           alt="Address Location"
                           width={11.67}
                           height={11.67}
                        />
                        <span className="text-[#868686] font-[400] text-[13px] font-inter truncate">{addressObj.address}</span>
                      </div>
                     <div className="flex items-center gap-2 shrink-0">
                       
                       {hoursForAddress ? (
                       <>
                        <Img 
                         src="/timeClock.svg"
                         width={16}
                         height={16}
                         className="w-[16px] h-[16px]"
                       />
                        <span className="text-[#238E15] font-[500] font-inter text-[10px] whitespace-nowrap">
                            {hoursForAddress.openingTime} - {hoursForAddress.closingTime}
                          </span>
                       </>
                       ): (
                        <span>No hour selected</span>
                       )}
                     </div>
                    </div>

                    {/* Business Hours section */}
                    {hoursForAddress ? (
                      <>
                        {/* Days of the week */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {hoursForAddress.days.map((day) => (
                            <span
                              key={day}
                              className="bg-[#F7F7FF] rounded-[4px] px-2 py-1 text-[10px] text-[#000087] font-[500] font-inter flex items-center justify-center min-w-[28px]"
                            >
                              {day.substring(0, 3)}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="text-[12px] text-[#868686] font-inter ml-6">
                        No hours set for this location.
                      </span>
                    )}

                    {/* Separator for multiple addresses within one business */}
                    {index < biz.addresses.length - 1 && (
                      <hr className="my-4 border-t border-[#EDEDED]" />
                    )}
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AddBusinessHourss() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const mode = searchParams.get("mode") || "same";

  const [businessHours, setBusinessHours] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  if (loading) {
    return (
       <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading Business Hour...</p>
        </div>
      </section>
    )
  }

  return (
    <div className="relative flex flex-col md:flex-row w-full gap-2 min-h-screen md:mt-4">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <BusinessLink />
      </div>

      {/* Mobile: 3 dots button on top-right of the card */}
      <div className="absolute top-0 right-4 z-30 md:hidden">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-1"
          aria-label="Toogle menu"
        >
          <MoreVertical size={22} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="absolute top-10 left-0 w-full bg-white z-20 shadow-md p-4 md:hidden">
          <BusinessLink />
        </div>
      )}

      <div className="flex-1 md:px-4 md:px-0 mt-10 md:mt-0">
        <div className="bg-white md:border md:border-[#EDEDED] p-0 md:p-4 rounded-lg w-full">
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
              <p className="text-[#868686] mt-2 font-inter font-[500] text-[14px] text-center">
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

