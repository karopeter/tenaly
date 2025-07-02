import React from "react";

export default function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-block w-11 h-6 align-middle select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <span
        className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full transition peer-checked:bg-[#5555DD]"
      ></span>
      <span
        className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"
      ></span>
    </label>
  );
}