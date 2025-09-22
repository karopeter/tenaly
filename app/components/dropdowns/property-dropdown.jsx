"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function PropertyDropdown({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const options = [
    "Commercial Property For Rent",
    "Commercial Property For Sale",
    "House and Apartment Property For Rent",
    "House and Apartment Property For Sale",
    "Land and Plot For Rent",
    "Land and Plot For Sale",
    "Short Let Property",
    "Event Center And Venues"
  ];

  const handleSelect = (opt) => {
    onSelect(opt);
  };

  return (
    <div className="bg-white">
      <div className="p-2 border-b">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 md:h-[44px] bg-[#FAFAFA] border-[1px] 
            border-[#EDEDED] focus:outline-none placeholder:text-[#CDCDD7]"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-4 text-gray-400 w-4 h-4" />
        </div>
      </div>
      <ul className="max-h-60 overflow-y-auto">
        {options
          .filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((opt) => (
            <li
              key={opt}
              className="px-3 py-2 hover:bg-[#EDEDED] cursor-pointer text-[#525252] text-[14px] font-[400] font-inter text-left border-b border-[#EDEDED] last:border-b-0"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
      </ul>
    </div>
  );
}