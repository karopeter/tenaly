"use client";

export default function KidsDropdown({ onSelect }) {
     const options = [
    "Baby Clothes",
    "Kids Clothes",
    "Shoes",
    "Toys & Games",
    "Baby Gear (strollers, car seats, carriers)",
    "Feeding (bottles, high chairs, breast pumps)",
    "Furniture (cribs, cots, wardrobes)",
    "Health & Safety (monitors, baby gates)",
    "School Supplies (bags, books, stationery)"
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