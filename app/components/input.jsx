// components/InputField.js
import React from 'react';

const InputField = ({ label, value, onChange, placeholder, className, type = "text", disabled = false }) => {
  return (
    <div className="flex flex-col w-full  mt-5">
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
        className={`w-full h-[52px] border border-[#CDCDD7] rounded-[4px] px-3 text-[#525252] bg-white focus:outline-none ${className}`}
      />
    </div>
  );
};

export default InputField;
