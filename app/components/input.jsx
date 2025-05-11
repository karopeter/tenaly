// components/InputField.js
import React from 'react';

const InputField = ({ label, value, onChange, placeholder, className, type = "text", disabled = false }) => {
  return (
    <div className="flex flex-col mt-5">
      {label && (
        <label className="block text-left mb-1 text-[#525252] md:text-[12px] font-[500] font-inter">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-[1px] border-[#CDCDD7] md:h-[52px] rounded-[4px] md:pt-[4px] md:pr-[12px] md:pb-[4px] md:pl-[12px] mb-2 px-3 text-[#525252]  flex justify-between items-center bg-white focus:outline-none ${className}`}
      />
    </div>
  );
};

export default InputField;
