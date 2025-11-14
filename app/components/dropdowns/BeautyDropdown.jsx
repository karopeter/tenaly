"use client";


export default function  BeautyDropdown({ onSelect }) {
  const options = [ 
    'Skin Care',
    'Hair Care',
    'Makeup & Cosmetics',
    'Fragrances (Perfume & Body Spray)',
    'Bath & Body',
    'Nail Care',
    'Personal Grooming Devices', 
    'Oral Care',
    "Men's Grooming",
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