"use client";
import Link from "next/link";

export default function VehicleDropdown({ onSelect }) {
  const options = ["car", "bus", "tricycle"];

  return (
    <div className="bg-white">
      <ul>
        {options.map(opt => (
          <li
            key={opt}
            className="px-3 py-2 hover:bg-[#EDEDED] cursor-pointer capitalize text-[#525252] text-[14px] font-[400] font-inter text-left border-b border-[#EDEDED] last:border-b-0"
            onClick={() => {
              onSelect(`Vehicle - ${opt}`);
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
  );
}