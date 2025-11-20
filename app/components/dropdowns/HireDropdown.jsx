"use client";


export default function  HireDropdown({ onSelect }) {
    const options = [
    'Hire Tech & IT',
     'Lessons & Trainings',
     'Hire Cleaners',
     'Repairs & Maintenance',
     'Painting & Wall Finishing',
     'Plumbing',
     'Eletrical Wiring & Installation',
     'Furniture Assembly',
     'Beauty & Wellness',
     'Creative & Media',
     'Event Planning for Hire',
     'DJ Services',
     'MC / Host Services'
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