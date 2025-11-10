"use client";

export default function GadgetDropdown({ onSelect }) {
  const options = [
     'Mobile Phones',
    'Tablets',
    'Smartwatches',
    'Phone Accessories',
    'Tablet Accessories',
    'Power Banks',
    'Chargers & Cables',
    'Screen Protectors',
    'Pouch',
    'Covers',
    'Earphones / Headsets',
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