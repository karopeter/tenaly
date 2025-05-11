"use client";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

export default function PropertyDropdown({ value, onChange = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const options = [
    "Commercial Property for rent",
    "Commercial Property for sale",
    "House and Apartment Property for rent",
    "House and Apartment Property for sale",
    "Lands and Plot for rent",
    "Lands and Plot for sale",
    "Short let Property",
    "Event center and Venues",
  ];

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen((o) => !o)}
        className="border border-[#CDCDD7] h-[52px] rounded-[4px] px-3 
        flex justify-between items-center cursor-pointer bg-white">
        <span className="capitalize text-[#525252]">{value || "Select Property"}</span>
        {isOpen ? (
          <IoIosArrowUp className="w-5 h-5 text-gray-500" />
        ) : (
          <IoIosArrowDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="absolute bg-white w-full mt-1 shadow-lg border border-[#EDEDED] rounded-md z-10">
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
                  className="px-3 py-2 hover:bg-[#EDEDED] cursor-pointer capitalize 
                  text-[#525252] text-[14px] font-[400] font-inter text-left 
                  border-b border-[#EDEDED] last:border-b-0"
                  onClick={() => handleSelect(opt)}>
                  {opt}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
