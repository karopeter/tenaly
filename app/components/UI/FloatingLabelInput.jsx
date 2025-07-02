import React from 'react';

export default function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  ...props
}) {
    return (
    <div className="relative w-[361px] mb-4">
      <span className="absolute top-1 left-3 text-[12px] text-gray-500 font-medium z-10 pointer-events-none">
       {label}
     </span>
       <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#CDCDD7] rounded px-3 pt-6 pb-2 bg-white focus:outline-none text-sm"
       {...props}
      />
    </div>
   );
  }