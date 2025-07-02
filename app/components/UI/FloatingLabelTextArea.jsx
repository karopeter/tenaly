import React from "react";

export default function FloatingLabelTextArea({
  label,
  value,
  onChange,
  placeholder = "",
  ...props
}) {
  return (
    <div className="relative w-full mb-4">
      <span className="absolute top-1 left-3 text-[12px] text-gray-500 font-medium z-10 pointer-events-none">
        {label}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[100px] border border-[#CDCDD7] rounded px-3 pt-6 pb-2 bg-white focus:outline-none text-sm resize-none"
        {...props}
      />
    </div>
  );
}