"use client";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function MultiSelectDropdown({
  label,
  options,
  value = [],
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const handleToggleOption = (optValue) => {
    if (value.includes(optValue)) {
        onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const display = 
    value.length  > 0 ? value.join(", ") : "Select features";

    return (
     <div className="relative w-full mt-5">
      {/* Label */}
      <label className="block text-left mb-1 text-[#525252] md:text-[12px] font-[500]">
       {label}
      </label>

      {/* Dropdown Trigger */}
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
         "border-[1px] border-[#CDCDD7] h-[52px] rounded-[4px] mb-0 md:mb-2 px-3 py-2 text-[#525252] flex justify-between items-center bg-white",
         disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
      <span className="text-[#525252] truncate">{display}</span>
      {open ? (
        <IoIosArrowUp className="w-5 h-5 text-gray-500" /> 
      ): (
        <IoIosArrowDown className="w-5 h-5 text-gray-500" />
      )}
      </div>

      {/* Options List */}
      {open && !disabled && (
        <ul className="absolute bg-white w-full mt-1 shadow-lg border border-[#EDEDED] rounded-md z-10 max-h-60 overflow-auto">
          {options.map((opt) => {
          const optValue = typeof opt === "object" ? opt.name : String(opt);
          const optKey = typeof opt === "object" ? opt.id : optValue;

          return (
            <li
             key={optKey}
             className="px-3 py-2 flex items-center gap-2 hover:bg-[#EDEDED] cursor-pointer capitalize text-[#525252] text-[14px] font-[400] border-b border-[#EDEDED] last:border-b-0"
             onClick={(e) => {
             e.stopPropagation();
             handleToggleOption(optValue);
             }}
            >
            <input 
              type="checkbox"
              checked={value.includes(optValue)}
              onChange={() => handleToggleOption(optValue)}
              className="accent-[#174359] cursor-pointer"
            />
             <span>{optValue}</span>
            </li>
          )
          })}
        </ul>
      )}
     </div>
    )
}