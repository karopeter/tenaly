"use client";
import { Plus, MoreVertical, MapPin, Clock, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";
import { PencilIcon } from "@heroicons/react/24/solid";

// This is the redesigned BusinessList component
function BusinessList({ businesses, onAddHourClick }) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-hidden p-2">
      <ul className="flex flex-col gap-4 mt-5 w-full">
        {businesses.map((biz) => {
          const hasHours = biz.businessHours && biz.businessHours.length > 0;

          // The main card for each business
          return (
            <li
              key={biz._id}
              className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md"
            >
              {/* Business Name and Edit/Add Button */}
              <div className="flex justify-between items-center w-full">
                <span className="text-sm font-medium text-[#525252] font-inter">
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
                    {hasHours ? "Edit business hour" : "Add business hour"}
                  </span>
                </div>
              </div>

              {/* Loop through addresses and display hours */}
              {biz.addresses.map((addressObj, index) => {
                // Find the corresponding business hours for this address.
                // We're assuming a 1-to-1 mapping based on array index due to the data structure.
                // A more robust solution would match by address ID after parsing the address string
                // in the businessHours object.
                const hoursForAddress = biz.businessHours && biz.businessHours[index];

                return (
                  <div key={addressObj._id} className="mt-2">
                    {/* Address section */}
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-[#525252]" />
                      <span className="text-[14px] text-[#525252] font-[400] font-inter">
                        {addressObj.address}
                      </span>
                    </div>

                    {/* Business Hours section */}
                    {hoursForAddress ? (
                      <>
                        <div className="flex items-center gap-2 mb-2 ml-6">
                          <Clock size={16} className="text-[#525252]" />
                          <span className="text-[14px] text-[#525252] font-[400] font-inter">
                            {hoursForAddress.openingTime} - {hoursForAddress.closingTime}
                          </span>
                        </div>
                        {/* Days of the week */}
                        <div className="flex flex-wrap gap-2 ml-6">
                          {hoursForAddress.days.map((day) => (
                            <span
                              key={day}
                              className="px-2 py-1 text-xs font-inter rounded-full bg-[#E6F4FF] text-[#000087]"
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