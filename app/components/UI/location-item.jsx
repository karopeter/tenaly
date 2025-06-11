"use client";
import { useState } from "react";
import Img from "../Image";
import LocationModal from "./locationModal";

export default function LocationSearch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Choose location");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSearchQuery("");
  };

  const handleLGASelect = ({ state, lga }) => {
    setSelectedLocation(`${state}, ${lga}`);
    setIsModalOpen(false);
    setSelectedState(null);
  };

  return (
    <div className="flex justify-center items-center space-x-4 w-full mt-10">
      {/* Dropdown Button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between outline-none w-[185px] h-[52px] rounded-[8px] py-2 px-4 bg-[#E8E8FF] text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter"
        >
          <span>{selectedLocation}</span>
          <Img
            src="/dropdown.svg"
            alt="Dropdown Icon"
            width={16}
            height={16}
            className="ml-2"
          />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for anything"
          className="outline-none py-2 px-4 pr-12 rounded-[8px] text-[14px]  
          bg-[#E8E8FF] w-[193px] h-[44px] md:w-[365px] md:h-[52px] placeholder:text-[#CDCDD7]"
        />
        <Img
          src="/search.svg"
          alt="Search"
          width={60}
          height={52}
          className="absolute -right-1 top-1/2 transform -translate-y-1/2 cursor-pointer w-[52px] h-[44px] md:w-[60px] md:h-[52px]"
        />
      </div>

      {/* Modal Component */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedState(null);
        }}
        onSelectLocation={handleLGASelect}
      />
    </div>
  );
}
