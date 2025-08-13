import React from 'react';
import { useState } from 'react';

export default function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
     const handleFocus = () => setIsFocused(true);
  return (

    <div className="relative mb-6">
      {/* <span className="absolute top-1 left-3 text-[12px] text-gray-500 font-medium z-10 pointer-events-none">
        {label}
      </span> */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
          onFocus={handleFocus}
        className="w-full h-[48px] px-4 py-2  border border-[#CDCDD7] rounded-lg  bg-white
         focus:outline-none text-sm focus:ring-2 focus:ring-[#5555DD] focus:border-[#5555DD] peer font-inter"
        {...props}
      />
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