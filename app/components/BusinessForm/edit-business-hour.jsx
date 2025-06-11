"use client";
import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BusinessLink from "../navbar/business.link";
import Img from "../Image";

export default function EditBusinessForm() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");
  const [mode, setMode] = useState("same");

  const [businessName, setBusinessName] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessHours, setBusinessHours] = useState([]);

  const router = useRouter();

  function inferMode(business) {
    if (!business.businessHours || business.businessHours.length === 0) return "same";
    const first = business.businessHours[0];
    return business.businessHours.every(
      (hour) =>
        hour.openingTime === first.openingTime &&
        hour.closingTime === first.closingTime &&
        JSON.stringify(hour.days) === JSON.stringify(first.days)
    )
      ? "same"
      : "different";
  }
  
  useEffect(() => {
    function cleanAddressString(rawStr) {
    if (typeof rawStr !== "string") return rawStr;

    // 1. Remove newlines and extra spaces
    let cleaned = rawStr.replace(/\n/g, " ").trim();

    // 2. Remove new ObjectId(...) but keep the id string inside quotes
    cleaned = cleaned.replace(/new ObjectId\('([^']+)'\)/g, '"$1"');

    // 3. Replace unquoted keys (like address:) with quoted keys ("address":)
    cleaned = cleaned.replace(/(\w+):/g, '"$1":');

    // 4. Replace single quoted strings ('...') with double quotes ("...")
    cleaned = cleaned.replace(/'([^']*)'/g, '"$1"');

    // 5. Ensure cleaned string is wrapped in braces
    if (!cleaned.startsWith("{")) cleaned = "{" + cleaned;
    if (!cleaned.endsWith("}")) cleaned = cleaned + "}";

    return cleaned;
  }

  const fetchBusinessHour = async () => {
    if (!businessId) return;
    try {
      const res = await api.get("/business/my-businesses");
      const businessesHour = res.data;
      const businessHour = businessesHour.find((b) => b._id === businessId);
      if (businessHour) {
        setBusinessName(businessHour.businessName);
        setAddresses(businessHour.addresses || []);

        const parsedHours = (businessHour.businessHours || []).map((hour) => {
          let addressObj = {};
          try {
            if (typeof hour.address === "string") {
              const cleaned = cleanAddressString(hour.address);
              addressObj = JSON.parse(cleaned);
            } else if (typeof hour.address === "object" && hour.address !== null) {
              addressObj = hour.address;
            }
          } catch (e) {
            console.error("Failed to parse cleaned address:", e, hour.address);
          }
          return {
            ...hour,
            addressObj,
          };
        });

        setBusinessHours(parsedHours);
        setMode(inferMode(businessHour));
      }
    } catch (error) {
      console.error("Failed to fetch business hour", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBusinessHour();
}, [businessId]);



  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
      <BusinessLink />
      <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[#525252] text-[14px] font-[500] font-inter">
              {businessName}
            </span>
            <Link
              href={`/add-business-hours?businessId=${businessId}&mode=${mode}`}
              className="flex items-center text-[#000087] text-[14px] font-[500] font-inter hover:underline"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Link>
          </div>

          {/* Business Hours */}
          {businessHours.length > 0 ? (
            businessHours.map((hour, idx) => (
              <div key={hour._id || idx} className="mb-4">
                {/* Address row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Img
                      src="/addressLoc.svg"
                      alt="Address Location"
                      width={11.67}
                      height={11.67}
                      className="w-[11.6px] h-[11.6px]"
                    />
                    <span className="text-[#868686] font-[400] text-[14px] font-inter">
                      {hour.addressObj?.address || "No address"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Img
                      src="/timeClock.svg"
                      width={16}
                      height={16}
                      className="w-[16px] h-[16px]"
                    />
                    <span className="text-[#238E15] font-[500] font-inter text-[10px]">
                      {hour.openingTime || "--:--"} - {hour.closingTime || "--:--"}
                    </span>
                  </div>
                </div>

                {/* Days row */}
                <div className="mt-1 flex gap-2 flex-wrap">
                  {hour.days && hour.days.length > 0 ? (
                    hour.days.map((day, i) => {
                      const shortDay =
                        day.length > 3
                          ? day.slice(0, 3).charAt(0).toUpperCase() +
                            day.slice(1, 3).toLowerCase()
                          : day;
                      return (
                        <span
                          key={i}
                          className="bg-[#F7F7FF] rounded-[4px] px-2 py-1 text-[10px] text-[#000087] font-[500] font-inter flex items-center justify-center min-w-[28px]"
                          style={{ minWidth: "28px", textAlign: "center" }}
                        >
                          {shortDay}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px]">No days set</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 italic">No business hours yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
