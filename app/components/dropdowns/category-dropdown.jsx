"use client";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import VehicleDropdown from "./vehicleDropdown";
import Img from "../Image";
import PropertyDropdown from "./property-dropdown";

export default function MainCategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null); // "vehicle" or "property"

  // close dropdown if parent resets value
  useEffect(() => {
    if (!value) {
      setType(null);
      setOpen(false);
    }
  }, [value]);

  const handleTypeSelect = (t) => {
    setType(t);
  };

  const handleSubSelect = (sub) => {
    const prettyType = type.charAt(0).toUpperCase() + type.slice(1);
    const prettySub = sub.charAt(0).toUpperCase() + sub.slice(1);
    onChange(`${prettyType} - ${prettySub}`);
    setType(null);
    setOpen(false);
  };

  return (
    <div className="relative w-full md:w-[481px]">
      {/* main label */}
      <div
        onClick={() => {
          setOpen(o => !o);
          setType(null);
        }}
        className="border border-[#CDCDD7] h-[52px] rounded-[4px] px-3 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="text-[#525252]">
          {value || "Select Category"}
        </span>
        {open ? (
          <IoIosArrowUp className="w-5 h-5 text-gray-500" />
        ) : (
          <IoIosArrowDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* pick Vehicle / Property */}
      {open && !type && (
        <div className="absolute bg-white shadow-md w-full z-10 border border-[#CDCDD7] rounded-[4px]">
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleTypeSelect("vehicle")}
          >
            <Img 
              src="/carDrop.svg" 
              alt="Vehicle Icon" 
              width={24}
              height={24}
              className="md:w-[24px] md:h-[24px] mr-2" />
            Vehicle
          </div>
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleTypeSelect("property")}
          >
            <Img 
              src="/houseDrop.svg" 
               alt="Propety Icon"
               width={24}
               height={24} 
               className="md:w-[24px] md:h-[24px] mr-2" />
            Property
          </div>
        </div>
      )}

      {/* Vehicle sub-dropdown */}
      {type === "vehicle" && (
        <div className="absolute bg-white w-full mt-1 z-10">
          <VehicleDropdown value={value?.split(" - ")[1] || ""} onChange={handleSubSelect} />
        </div>
      )}

      {/* Property sub-dropdown */}
      {type === "property" && (
        <div className="absolute bg-white w-full mt-1 z-10">
          <PropertyDropdown value={value?.split(" - ")[1] || ""} onChange={handleSubSelect} />
        </div>
      )}
    </div>
  );
}
