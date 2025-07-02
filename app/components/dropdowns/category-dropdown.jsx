"use client";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import VehicleDropdown from "./vehicleDropdown";
import PropertyDropdown from "./property-dropdown";
import Img from "../Image";

export default function MainCategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null); // "vehicle" or "property"

  // Reset internal state when parent clears value
  useEffect(() => {
    if (!value) {
      setType(null);
      setOpen(false);
    }
  }, [value]);

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
  };

  // const handleSubSelect = (subCategory) => {
  //   const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1); // "Vehicle" or "Property"
  //   onChange(subCategory); // Do not alter subCategory
  //   setType(null);
  //   setOpen(false);
  // };

  const handleSubSelect = (subCategory) => {
  const cleanCategory = subCategory.includes(" - ")
    ? subCategory.split(" - ")[1].trim()
    : subCategory;

  onChange(cleanCategory); 
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
        className="border border-[#CDCDD7] h-[52px] rounded-[4px] px-3 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="text-[#525252]">{value || "Select Category"}</span>
        {open ? (
          <IoIosArrowUp className="w-5 h-5 text-gray-500" />
        ) : (
          <IoIosArrowDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Main category options */}
      {open && !type && (
        <div className="absolute bg-white shadow-md w-full z-10 border border-[#CDCDD7] rounded-[4px] mt-1">
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleTypeSelect("vehicle")}
          >
            <Img
              src="/carDrop.svg"
              alt="Vehicle Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            Vehicle
          </div>
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleTypeSelect("property")}
          >
            <Img
              src="/houseDrop.svg"
              alt="Property Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            Property
          </div>
        </div>
      )}

      {/* Vehicle dropdown */}
      {type === "vehicle" && (
        <div className="absolute bg-white w-full mt-1 z-10">
          <VehicleDropdown
            value={value?.split(" - ")[1] || ""}
            onChange={handleSubSelect}
          />
        </div>
      )}

      {/* Property dropdown */}
      {type === "property" && (
        <div className="absolute bg-white w-full mt-1 z-10">
          <PropertyDropdown
            value={value?.split(" - ")[1] || ""}
            onChange={handleSubSelect}
          />
        </div>
      )}
    </div>
  );
}
