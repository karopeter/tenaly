"use client";
import { useState } from "react";
import Link from "next/link";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function VehicleDropdown({ value, onChange = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["car", "bus", "tricycle"];

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(o => !o)}
        className="border border-[#CDCDD7] h-[52px] rounded-[4px] px-3 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="capitalize text-[#525252]">
          {value || "Select Vehicle"}
        </span>
        {isOpen ? (
          <IoIosArrowUp className="w-5 h-5 text-gray-500" />
        ) : (
          <IoIosArrowDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isOpen && (
        <div className="absolute bg-white w-full mt-1 shadow-lg border border-[#EDEDED] rounded-md z-10">
          <ul>
            {options.map(opt => (
              <li
                key={opt}
                className="px-3 py-2 hover:bg-[#EDEDED] cursor-pointer capitalize text-[#525252] text-[14px] font-[400] font-inter text-left border-b border-[#EDEDED] last:border-b-0"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
          <div className="px-3 py-2 border-t flex justify-end">
            <Link href="#" className="text-[#1031AA] underline text-sm">
              Change Category
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
