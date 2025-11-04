"use client";


export default function AgricultureDropdown({ onSelect }) {
    const options = [
    "Fresh Produce (fruits, vegetables, grains)",
    "Livestock (poultry, goats, cattle, pigs, etc.)",
    "Seeds & Seedlings",
    "Animal Feed",
    "Fertilizers",
    "Farm Tools & Equipment",
    "Agro Chemicals (pesticides, herbicides)",
    "Farm Services (plowing, irrigation, consultancy)"
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