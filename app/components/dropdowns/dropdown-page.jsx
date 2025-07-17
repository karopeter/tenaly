"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Img from "../Image";

export default function DropdownPage({ onCategoryChange }) {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);


  const propertyOptions = [
    { value: "Commercial Property For Rent", label: "Commercial Property For Rent", ads: "(15,000 ads)" },
    { value: "Commercial Property For Sale", label: "Commercial Property For Sale", ads: "(15,000 ads)" },
    { value: "House and Apartment Property For Rent", label: "House and Apartment Property For Rent", ads: "(15,000 ads)" },
    { value: "House and Apartment Property For Sale", label: "House and Apartment Property For Sale", ads: "(15,000 ads)" },
    { value: "Land and Plot For Rent", label: "Land and Plot For Rent", ads: "(15,000 ads)" },
    { value: "Land and Plot For Sale", label: "Land and Plot For Sale", ads: "(15,000 ads)" },
    { value: "Event Center And Venues", label: "Event Center And Venues", ads: "(15,000 ads)" },
    { value: "Short Let Property", label: "Short Let Property", ads: "(15,000 ads)" }
  ];

 
  const vehicleOptions = [
    { value: "car", label: "Car", ads: "(15,000 ads)" }, 
    { value: "bus", label: "Bus", ads: "(15,000 ads)" },
    { value: "tricycle", label: "Tricycle", ads: "(15,000 ads)" },
  ];

  const handlePropertySelect = (option) => {
    setSelectedProperty(option.value);
    setSelectedVehicle("");
    setIsPropertyDropdownOpen(false);
    if (onCategoryChange) {
      onCategoryChange(option.value);
    }
  };

  const handleVehicleSelect = (option) => {
    setSelectedVehicle(option.value);
    setSelectedProperty("");
    setIsVehicleDropdownOpen(false);
    if (onCategoryChange) {
      onCategoryChange(option.value); 
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-6 relative z-[20] px-4">
      {/* Property Dropdown */}
      <div className="relative w-full sm:w-auto max-w-[330px] flex-1">
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
        >
          <Img
            src="/property.svg"
            alt="property icon"
            width={40}
            height={40}
          />
        </div>

        <div
          className="w-full h-[52px] pl-16 pr-4 py-[4px] rounded-[8px] border border-[#CDCDD7] text-[#525252] outline-none flex items-center justify-between cursor-pointer"
          onClick={() => {
            setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
            setIsVehicleDropdownOpen(false);
          }}
        >
          <span
            className={`truncate ${selectedProperty ? "text-[#525252]" : "text-[#A9A9A9] md:ml-5"}`}
          >
            {selectedProperty === ""
              ? "Property"
              : propertyOptions.find((option) => option.value === selectedProperty)?.label}
          </span>
          <FiChevronDown />
        </div>

        {isPropertyDropdownOpen && (
          <div className="absolute z-[1000] w-full max-w-[330px] max-h-[406px] top-[58px] left-0 rounded-[5px] border border-[#EDEDED] bg-white shadow-lg overflow-auto">
            <ul className="text-sm">
              {propertyOptions.map((option) => (
                <li
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handlePropertySelect(option)}
                >
                  <div className="block">
                    <span className="text-[#525252] text-[14px] font-[400] font-inter">
                      {option.label}
                    </span>
                    <div className="text-[#868686] text-[13px] font-[400] font-inter">
                      {option.ads}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Vehicle Dropdown */}
      <div className="relative w-full sm:w-auto max-w-[330px] flex-1">
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
        >
          <Img
            src="/vehicle.svg"
            alt="vehicle icon"
            width={40}
            height={40}
          />
        </div>

        <div
          className="w-full h-[52px] pl-16 pr-4 py-[4px] rounded-[8px] border border-[#CDCDD7] text-sm text-[#525252] outline-none flex items-center justify-between cursor-pointer"
          onClick={() => {
            setIsVehicleDropdownOpen(!isVehicleDropdownOpen);
            setIsPropertyDropdownOpen(false);
          }}
        >
          <span
            className={`truncate ${selectedVehicle ? "text-[#525252]" : "text-[#A9A9A9] md:ml-5"}`}
          >
            {selectedVehicle === ""
              ? "Vehicle"
              : vehicleOptions.find((option) => option.value === selectedVehicle)?.label}
          </span>
          <FiChevronDown />
        </div>

        {isVehicleDropdownOpen && (
          <div className="absolute z-[1000] w-full max-w-[330px] max-h-[406px] top-[58px] left-0 rounded-[5px] border border-[#EDEDED] bg-white shadow-lg overflow-auto">
            <ul className="text-sm">
              {vehicleOptions.map((option) => (
                <li
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleVehicleSelect(option)}
                >
                  <div className="block">
                    <span className="text-[#525252] text-[14px] font-[400] font-inter">
                      {option.label}
                    </span>
                    <div className="text-[#868686] text-[13px] font-[400] font-inter">
                      {option.ads}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}