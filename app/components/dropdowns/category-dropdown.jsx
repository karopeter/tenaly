"use client";
import { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import VehicleDropdown from "./vehicleDropdown";
import PropertyDropdown from "./property-dropdown";
import AgricultureDropdown from "./AgricultureDropdown";
import KidsDropdown from "./KidsDropdown";
import PetsDropdown from "./PetsDropdown";
import ServicesDropdown from "./ServicesDropdown";
import EquipmentDropdown from "./equipmentDropdown";
import GadgetDropdown from "./gadgetDropdown";
import LaptopDropdown from "./laptopDropdown";
import FashionDropdown from "./fashionDropdown";
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
        <div 
          className="absolute top-[52px] left-0 right-0 bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
            <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => handleTypeSelect("agriculture")}
            >
             <Img
              src="/agricultureIcon.svg"
              alt="Agriculature Icon"
              width={24}
              height={24}
              className="w-5 h-5"
             />
             Agriculture & Food 
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
             onClick={() => handleTypeSelect("pets")}
            >
              <Img 
               src="/petsIcon.svg"
               alt="Pets Icon"
               width={24}
               height={24}
               className="w-5 h-5"
              />
              Animal & Pets
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleSubSelect("Available for hire");
            }}
            >
              <Img 
                src="/hireIcon.svg"
                alt="Hire Icon"
                width={24}
                height={24}
                className="w-5 h-5"
              />
              Available for hire 
          </div>
          <div 
           className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
           onClick={() => {
            handleTypeSelect("equipments");
           }}
           >
            <Img 
             src="/equipmentIcon.svg"
             alt="Equipment Icon"
             width={24}
             height={24}
             className="w-5 h-5"
            />
            Equipments & Machineries 
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => handleTypeSelect("kids")}
            >
             <Img
               src="/kidsIcon.svg"
               alt="Kids Icon"
               width={24}
               height={24}
               className="w-5 h-5" 
             />
             For Kids 
          </div>
          <div 
           className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
           onClick={() => {
            handleTypeSelect("fashion");
           }}
           >
           <Img 
             src="/fashionIcon.svg"
             alt="Fashion Icon"
             width={24}
             height={24}
             className="w-5 h-5"
           />
           Fashion
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleTypeSelect("gadgets");
            }}
            >
             <Img 
              src="/gadgetIcon.svg"
              alt="Gadget Icon"
              width={24}
              height={24}
              className="w-5 h-5"
             />
             Gadgets 
          </div>
          <div 
           className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
           onClick={() => handleSubSelect("Household Items")}
           >
            <Img
              src="/householdIcon.svg"
              alt="Household Icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            Household Items
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleSubSelect("Job");
            }}
          >
            <Img 
             src="/jobIcon.svg"
             alt="Job Icon"
             width={24}
             height={24}
             className='w-5 h-5'
            />
            Job 
          </div>
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleTypeSelect("laptops");
            }}
            >
            <Img 
             src="/laptopIcon.svg"
             alt="Laptop Icon"
             width={24}
             height={24}
             className="w-5 h-5"
            />
            Laptops & Computers 
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
          <div 
            className="px-3 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleTypeSelect("services");
            }}
            >
            <Img 
              src="/servicesIcon.svg"
              alt="Services Icon"
              width={24}
              height={24}
              className="w-5 h-5"
            />
            Services 
          </div>
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
        </div>
      )}

      {/* Agriculture Drodown */}
      {type === "agriculture" && (
        <div 
         className="absolute top-[52px] left-0 right-0 bg-white 
         border border-[#CDCDD7] border-t-0 
         rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <AgricultureDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "kids" && (
        <div className="absolute top-[52px] left-0 right-0 bg-white 
         border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <KidsDropdown  onSelect={handleSubSelect} />
        </div>
      )}

      {type === "services" && (
        <div className="absolute top-[52px] left-0 right-0 bg-white 
         border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <ServicesDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "pets" && (
        <div className="absolute top-[52px] left-0 right-0
         bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <PetsDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "gadgets" && (
         <div className="absolute top-[52px] left-0 right-0
         bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <GadgetDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "laptops" && (
        <div className="absolute top-[52px] left-0 right-0
         bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <LaptopDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "fashion" && (
        <div className="absolute top-[52px] left-0 right-0 
        bg-white border border-[#CDCDD7] bordder-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <FashionDropdown onSelect={handleSubSelect} />
        </div>
      )}

      {type === "equipments" && (
        <div className="absolute top-[52px] left-0 right-0
         bg-white border border-[#CDCDD7] border-t-0 rounded-b-[4px] z-10 max-h-60 overflow-y-auto">
          <EquipmentDropdown onSelect={handleSubSelect} />
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