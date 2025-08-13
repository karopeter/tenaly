"use client";
import { useState } from "react";


export default function FloatingLabelDropdown({
  label,
  value,
  onChange,
  children,
  className = "",
  ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  return (
    <div className="relative mb-6">
      {/* <span className="absolute top-1 left-3 text-[10px] text-gray-500 font-medium z-10 pointer-events-none">
        {label}
      </span> */}
      <select
        value={value}
        onChange={onChange}
         onFocus={handleFocus}
        className="w-full h-[45px] border border-[#CDCDD7] rounded-lg px-4 py-2 focus:outline-none 
        text-[12px] bg-white shadow focus:ring-2 focus:ring-[#5555DD] focus:border-[#5555DD] peer font-inter appearance-none text-[#525252]"
        {...props}
      >
        {children}
      </select>
       <label
        className={`absolute left-4 transition-all duration-200 text-gray-500 font-inter text-sm pointer-events-none ${
          isFocused || value ? "-top-2.5 text-xs bg-white px-1 text-[#5555DD]" : "top-3.5 text-base"
        }`}
      >
        {label}
      </label>
    </div>
  );
}