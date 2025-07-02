import React from "react";

export default function FloatingLabelDropdown({
  label,
  value,
  onChange,
  children,
  className = "",
  ...props
}) {
  return (
    <div className={`relative w-[300px] mb-4 ${className}`}>
      <span className="absolute top-1 left-3 text-[10px] text-gray-500 font-medium z-10 pointer-events-none">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="w-[300px] h-[45px] border border-[#CDCDD7] rounded px-3 pt-5 focus:outline-none text-[12px] bg-white shadow font-inter text-[#525252]"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}