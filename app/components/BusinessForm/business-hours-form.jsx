"use client";
import React, { useState, useEffect } from "react";
import BusinessLink from "../navbar/business.link";
import api from "@/services/api";
import { useSearchParams, useRouter } from "next/navigation";
import Img from "../Image";
import { toast } from "react-toastify";

export default function BusinessHoursForm() {
  const [businessName, setBusinessName] = useState("");
  const [addresses, setAddresses] = useState([""]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const businessId = searchParams.get("businessId"); 
  const mode = searchParams.get("mode");
  const [isEditMode, setIsEditMode] = useState(false);

  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [businessHours, setBusinessHours] = useState([
    { openingTime: '', closingTime: '', days: [] }
  ]);
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  
    useEffect(() => {
      const fetchBusiness = async () => {
          if (!businessId) return;
    
          try {
              const res = await api.get("/business/my-businesses");
              const businesses = res.data;
              const business = businesses.find((b) => b._id === businessId);
              if (business) {
                  setBusinessName(business.businessName);
                  const fetchedAddresses = business.addresses || [];
                  setAddresses(fetchedAddresses);
                  
                  if (business.businessHours && business.businessHours.length > 0) {
                    setIsEditMode(true);

                    // Set mode if it's not already set (fallback logic)
                    const fetchedMode = business.mode || mode;

                    if (fetchedMode === "same") {
                      setOpeningTime(business.businessHours[0].openingTime || "");
                      setClosingTime(business.businessHours[0].closingTime || "");
                      setSelectedDays(business.businessHours[0].days || []);
                    } else if (fetchedMode === "different") {
                      setBusinessHours(
                        business.businessHours.map((item) => ({
                           openingTime: item.openingTime || "",
                           closingTime: item.closingTime || "",
                           days: item.days || [],
                        }))
                      );
                    }
                  } else {
                    // New creating - initialize blank for each address 
                    setBusinessHours(
                      fetchedAddresses.map(() => ({
                        openingTime: "",
                        closingTime: "",
                        days: [],
                      }))
                    );
                  }
              }
          } catch (error) {
              console.error("Failed to fetch business", error);
          } finally {
              setLoading(false);
          }
      };
    
      fetchBusiness();
    }, [businessId]);

    const updateOpeningTime = (index, value) => {
      const updated = [...businessHours];
      updated[index].openingTime = value;
      setBusinessHours(updated);
    };
    
    const updateClosingTime = (index, value) => {
      const updated = [...businessHours];
      updated[index].closingTime = value;
      setBusinessHours(updated);
    };
    
    const handleDayChange = (index, day) => {
      const updated = [...businessHours];
      const days = updated[index].days;
    
      if (days.includes(day)) {
        updated[index].days = days.filter((d) => d !== day);
      } else {
        updated[index].days = [...days, day];
      }
    
      setBusinessHours(updated);
    };
    
    const handleDayChangeSame = (day) => {
      if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
      } else {
        setSelectedDays([...selectedDays, day]);
      }
    };

    

    const isFormValid = mode === "same"
    ? openingTime && closingTime && selectedDays.length > 0 // Check for "same" mode
    : businessHours.every(
        (item) => item.openingTime && item.closingTime && item.days.length > 0
      ); 

   const buildBusinessHoursPayload = (mode, addresses, openingTime, closingTime, selectedDays, businessHours) => {
  if (mode === "same") {
    return addresses.map(() => ({
      openingTime,
      closingTime,
      days: selectedDays,
    }));
  }

  if (mode === "different") {
    return businessHours.map((item) => ({
      openingTime: item.openingTime,
      closingTime: item.closingTime,
      days: item.days,
    }));
  }

  return [];
};
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

     const businessHoursPayload = buildBusinessHoursPayload(
       mode,
       addresses,
      openingTime,
      closingTime,
      selectedDays,
      businessHours
     );
   
    const payload = {
      mode,
      businessHours: businessHoursPayload,
    }

    try {
       await api.put(`/business/${businessId}/hours`, payload);


        if (isEditMode) {
           toast.success("Business Hour updated successfully!");
           router.push(`/EditBusinessHour?businessId=${businessId}`);
        } else {
           toast.success("Business Hours saved successfully!");
           router.push(`/EditBusinessHour?businessId=${businessId}`);
        }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to submit. Please try again.";

      toast.error(errorMessage);
      console.error("Error submitting business hours:", err);

      if (!isEditMode) {
        router.push(`/EditBusinessHour?businessId=${businessId}`);
      }
    }
};

  if (loading) return <p className="text-center mt-20">Loading...</p>;

    return (
      <div className="flex md:flex-row w-full gap-2 min-h-screen mt-10">
       <BusinessLink />
       <div className="flex-1">
        <div className="bg-white shadow p-4 rounded-lg h-auto">
           <div className="flex items-center gap-2 mb-4">
           <button className="flex items-center gap-2" onClick={() => router.push('/BusinessHours')}>
              <Img 
                src="/doc.svg"
                alt="Arrow Left"
                width={8}
                height={12}
                className="w-[8px] height-[12px]" />
                <span className="text-[#525252] font-[500] font-inter text-[14px]">Go Back</span>
              </button>
           </div>

           {mode === "same" && (
            <>
             <div className="flex flex-col items-start">
                 <h2 className="text-[#525252] font-inter font-[500] text-[16px] mb-2">{businessName}</h2>
                 <ul>
                    {addresses.map((addressObj, i) => (
                      <li key={addressObj._id} className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked disabled className="accent-[#525252]" />
                        <span className="text-[#232323] text-[14px] font-[400] font-inter">{addressObj.address}</span>
                       </li>
                    ))}
                 </ul>
                 <div className="flex flex-row gap-4 mt-4">
                    <div>
                      <div className="flex items-start">
                         <label className="text-[#525252] font-inter font-[500] text-[12px]">
                           Opening Time
                          </label>
                         </div>
                      <select 
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                       className="border-[1px] border-[#CDCDD7] md:w-[159.5px]
                        md:h-[52px] focus:outline-none rounded-[4px] md:pt-[4px]
                         md:pr-[12px] md:pb-[4px] md:pl-[12px]">
                         <option value="">Select</option>
                         {Array.from({ length: 12 }, (_, i) => {
                          const hour = i + 1;
                           return (
                             <React.Fragment key={`am-${hour}`}>
                               <option value={`${hour}:00AM`}>{hour}:00 AM</option>
                               <option value={`${hour}:30 AM`}>{hour}:30 AM</option>
                             </React.Fragment>
                           )
                         })}
                      </select>
                    </div>
                   <div>
                     <div className="flex items-start">
                       <label className="text-[#525252] font-inter font-[500] text-[12px]">
                        Closing Time
                       </label>
                      </div>
                     <select 
                     value={closingTime}
                     onChange={(e) => setClosingTime(e.target.value)}
                       className="border-[1px] border-[#CDCDD7] md:w-[159.5px] md:h-[52px] focus:outline-none rounded-[4px] md:pt-[4px] md:pr-[12px] md:pb-[4px] md:pl-[12px]">
                       <option value="">Select</option>
                       {Array.from({ length: 12 }, (_, i) => {
                          const hour = i + 1;
                          return (
                           <React.Fragment key={`pm-${hour}`}>
                              <option value={`${hour}:00 PM`}>{hour}:00 PM</option>
                              <option value={`${hour}:30 AM`}>{hour}:30 AM</option>
                           </React.Fragment>
                          )
                        })}
                     </select>
                   </div>
                 </div> 

                 <div className="flex flex-col gap-4 mt-6">
                    <div className="flex gap-4 flex-wrap">
                     {allDays.map((day) => (
                        <label
                        key={day}
                        className="flex items-center gap-2 text-[#525252] font-inter font-[500] text-[14px]">
                         <input 
                           type="checkbox"
                           checked={selectedDays.includes(day)}
                           onChange={() => handleDayChangeSame(day)}
                           className="accent-[#000087]"
                         />
                         {day}
                        </label>
                     ))}
                    </div>
                 </div>
             </div>
             <div className="flex justify-center mt-4">
                   <button
                    onClick={handleSubmit}
                    type="submit"
                   disabled={!isFormValid}
                    className={`flex items-center justify-center gap-2 md:w-[262px] md:h-[44px] rounded-[8px] px-4 py-2 transition duration-300 ${
                    isFormValid
                   ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                  : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7] border border-[#EDEDED]"
                  }`}>
                  <Img
                     src="/tick-circles.svg"
                    alt="Save"
                     width={20}
                     height={20}
                  className="w-[20px] h-[20px]"
                  />
                  <span className="font-[500] font-inter text-[14px]"> 
                    {isEditMode ? "Update business hours" : "Save Business Hours"}
                  </span>
               </button>
             </div>
            </>
           )}

       {mode === "different" && businessHours.length > 0 && (
         <>
        <div className="flex items-start">
          <h2 className="text-[#525252] font-inter font-[500] text-[16px] mb-2">{businessName}</h2>
        </div>
        {addresses.map((addressObj, index) => (
         <div key={addressObj._id} className="flex flex-col items-start mb-6">
          {/* Address Title */}
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked disabled className="accent-[#525252]" />
            <span className="text-[#232323] text-[14px] font-[400] font-inter">{addressObj.address}</span>
          </div>

        {/* Opening and Closing Time */}
        <div className="flex flex-row gap-4 mt-2">
          {/* Opening Time */}
          <div>
            <label className="flex items-start text-[#525252] font-inter font-[500] text-[12px]">Opening Time</label>
            <select
              value={businessHours[index].openingTime}
              onChange={(e) => updateOpeningTime(index, e.target.value)}
              className="border border-[#CDCDD7] w-[159.5px] h-[52px] rounded-[4px] p-3 focus:outline-none"
            >
              <option value="">Select</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = i + 1;
                  return (
                  <React.Fragment key={`open-${hour}`}>
                    <option value={`${hour}:00 AM`}>{hour}:00 AM</option>
                    <option value={`${hour}:30 AM`}>{hour}:30 AM</option>
                  </React.Fragment>
                );
                })}
            </select>
          </div>

          {/* Closing Time */}
          <div>
            <label className="flex items-start text-[#525252] font-inter font-[500] text-[12px]">Closing Time</label>
            <select
             value={businessHours[index].closingTime}
              onChange={(e) => updateClosingTime(index, e.target.value)}
              className="border border-[#CDCDD7] w-[159.5px] h-[52px] rounded-[4px] p-3 focus:outline-none"
            >
              <option value="">Select</option>
               {Array.from({ length: 12 }, (_, i) => {
                 const hour = i + 1;
                  return (
                  <React.Fragment key={`close-${hour}`}>
                    <option value={`${hour}:00 PM`}>{hour}:00 PM</option>
                    <option value={`${hour}:30 PM`}>{hour}:30 PM</option>
                  </React.Fragment>
                );
               })}
            </select>
          </div>
        </div>

        {/* Days Selection */}
        <div className="flex flex-wrap gap-4 mt-4">
          {allDays.map((day) => (
            <label 
              key={day} 
              className="flex items-center gap-2 text-[#525252] font-inter font-[500] text-[14px]">
              <input
                type="checkbox"
                 checked={businessHours[index].days.includes(day)}
                onChange={() => handleDayChange(index, day)}
                className="accent-[#000087]"
              />
              {day}
            </label>
          ))}
        </div>

        {/* Separator */}
        {index < addresses.length - 1 && <hr className="my-6 w-full border-t border-[#CDCDD7]" />}
      </div>
    ))}

    {/* Save Button */}
    <div className="flex justify-center mt-4">
      <button
        onClick={handleSubmit}
        type="submit"
        disabled={!isFormValid}
        className={`flex items-center justify-center gap-2 w-[262px] h-[44px] rounded-[8px] px-4 py-2 transition duration-300 ${
          isFormValid
            ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
            : "bg-[#EDEDED] cursor-not-allowed text-[#CDCDD7] border border-[#EDEDED]"
        }`}
      >
        <Img src="/tick-circles.svg" alt="Save" width={20} height={20} className="w-[20px] h-[20px]" />
        <span className="font-[500] font-inter text-[14px]">
          {isEditMode ? "Update business hours" : "Save Business Hours"}
        </span>
      </button>
     </div>
    </>
     )}
    </div>
   </div>
   </div>
  );
}