"use client";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import VehicleDropdown from "./vehicleDropdown";
import PropertyDropdown from "./property-dropdown";
import Img from "../Image";

export default function MainCategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null); 
  const [displayValue, setDisplayValue] = useState("");

  // Reset internal state when parent clears value
  useEffect(() => {
    if (!value) {
      setType(null);
      setOpen(false);
      setDisplayValue("");
    } else {
      setDisplayValue(value);
    }
  }, [value]);
  
  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
  };

  const handleSubSelect = (subCategory) => {
    const cleanCategory = subCategory.includes(" - ")
      ? subCategory.split(" - ")[1].trim()
      : subCategory;

    onChange(cleanCategory); 
    setDisplayValue(subCategory);
    setType(null);
    setOpen(false);
    console.log("Sending category:", cleanCategory);
  };

  return (
    <div className="relative w-full md:w-[481px]">
      {/* Top-level dropdown */}
      <div
        onClick={() => {
          setOpen((prev) => !prev);
          setType(null);
        }}
        className="border border-[#CDCDD7] w-full h-[52px] rounded-[4px] px-3 flex justify-between items-center cursor-pointer bg-white"
      >
       <span className={displayValue ? "text-black" : "text-gray-500"}>
          {displayValue || "Select Category"}
       </span>
       {open ? (
        <IoIosArrowUp className="text-[#525252]" />
       ): (
         <IoIosArrowDown className="w-5 h-5 text-gray-500" />
       )}
      </div>

      {/* Main category options */}
      {open && !type && (
        <div className="absolute top-[52px] left-0 right-0 bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <div
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => handleTypeSelect("vehicle")}
          >
            <Img
              src="/carDrop.svg"
              alt="Vehicle Icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            Vehicle
          </div>
          <div
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => handleTypeSelect("property")}
          >
            <Img
              src="/houseDrop.svg"
              alt="Property Icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            Property
          </div>
        </div>
      )}

      {/* Vehicle dropdown */}
      {type === "vehicle" && (
        <div className="absolute top-[52px] left-0 right-0 bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <VehicleDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {/* Property dropdown */}
      {type === "property" && (
        <div className="absolute top-[52px] left-0 right-0 bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <PropertyDropdown onSelect={handleSubSelect} />
        </div>
      )}
    </div>
  );
}