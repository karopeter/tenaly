"use client";


export default function  FashionDropdown({ onSelect }) {
    const options = [
     'Clothing',
     'Footwear',
     'Bags',
     'Jewellery',
     'Watches',
     'Accessories',
    'Eyewear (Glasses & Sunglasses)',
    'Wedding & Event Wear',
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