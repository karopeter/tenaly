"use client";


export default function ConstructionDropdown({ onSelect }) {
  const options = [ 
   'Building Material',
    'Eletrical Equipment & Tools',
    'Plumbing Material & Fittings',
    'Paints & Finishes',
    'Hand Tools',
    'Safety Equipment & Workwear',
    'Repair & Maintenance Services',
    'Construction  Equipment',
    'Roofing Materials',
    'Flooring & Tiles',
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