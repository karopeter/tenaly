"use client";

export default function EquipmentDropdown({ onSelect }) {
  const options = [
    'Industrial Machines',
    'Construction Equipment',
    'Power Tools',
    'Manufacturing Equipment',
    'Medical & Laboratory Equipment',
    'Kitchen & Restaurant Equipment',
    'Printing & Packaging Machines',
    'Agricultural Machinery',
    'Cleaning & Laundry Equipment',
    'Office Equipment',
    ];
 return (
   <div className="bg-white">
      <ul>
        {options.map(opt => (
          <li
            key={opt}
            className="px-3 py-2 hover:bg-[#EDEDED] cursor-pointer text-[#525252] text-[14px] font-[400] font-inter text-left border-b border-[#EDEDED] last:border-b-0"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
    </div> 
  );
}