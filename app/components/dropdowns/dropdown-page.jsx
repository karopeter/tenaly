"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
import Img from "../Image";

const categoryGroups = [
  {
    id: "agriculture",
    label: "Agriculture & Food",
    icon: "/agricultureIcon.svg",
    options: [
      { value: "Fresh Produce (fruits, vegetables, grains)", label: "Fresh Produce (fruits, vegetables, grains)" },
      { value: "Livestock (poultry, goats, cattle, pigs, etc.)", label: "Livestock (poultry, goats, cattle, pigs, etc.)" },
      { value: "Seeds & Seedlings", label: "Seeds & Seedlings" },
      { value: "Animal Feed", label: "Animal Feed" },
      { value: "Fertilizers", label: "Fertilizers" },
      { value: "Farm Tools & Equipment", label: "Farm Tools & Equipment" },
      { value: "Agro Chemicals (pesticides, herbicides)", label: "Agro Chemicals (pesticides, herbicides)" },
      { value: "Farm Services (plowing, irrigation, consultancy)", label: "Farm Services (plowing, irrigation, consultancy)" },
    ],
  },
  {
    id: "pets",
    label: "Animal & Pets",
    icon: "/petsIcon.svg",
    options: [
      { value: "Dogs", label: "Dogs" },
      { value: "Cats", label: "Cats" },
      { value: "Birds", label: "Birds" },
      { value: "Fish & Aquarium", label: "Fish & Aquarium" },
      { value: "Small Pets (rabbits, hamsters, guinea pigs)", label: "Small Pets (rabbits, hamsters, guinea pigs)" },
      { value: "Pet Accessories", label: "Pet Accessories" },
      { value: "Pet Food", label: "Pet Food" },
    ],
  },
  {
    id: "hire",
    label: "Available for Hire",
    icon: "/hireIcon.svg",
    options: [
      { value: "Hire Tech & IT", label: "Hire Tech & IT" },
      { value: "Hire Cleaners", label: "Hire Cleaners" },
      { value: "DJ Services", label: "DJ Services" },
      { value: "MC / Host Services", label: "MC / Host Services" },
      { value: "Event Planning for Hire", label: "Event Planning for Hire" },
      { value: "Lessons & Trainings", label: "Lessons & Trainings" },
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Health",
    icon: "/beauty.svg",
    options: [
      { value: "Skin Care", label: "Skin Care" },
      { value: "Hair Care", label: "Hair Care" },
      { value: "Makeup & Cosmetics", label: "Makeup & Cosmetics" },
      { value: "Fragrances (Perfume & Body Spray)", label: "Fragrances (Perfume & Body Spray)" },
      { value: "Personal Grooming Devices", label: "Personal Grooming Devices" },
      { value: "Bath & Body", label: "Bath & Body" },
      { value: "Oral Care", label: "Oral Care" },
      { value: "Men's Grooming", label: "Men's Grooming" },
    ],
  },
  {
    id: "construction",
    label: "Building & Construction",
    icon: "/construction.svg",
    options: [
      { value: "Building Material", label: "Building Material" },
      { value: "Paints & Finishes", label: "Paints & Finishes" },
      { value: "Hand Tools", label: "Hand Tools" },
      { value: "Roofing Materials", label: "Roofing Materials" },
      { value: "Flooring & Tiles", label: "Flooring & Tiles" },
      { value: "Plumbing Material & Fittings", label: "Plumbing Material & Fittings" },
      { value: "Safety Equipment & Workwear", label: "Safety Equipment & Workwear" },
    ],
  },
  {
    id: "equipment",
    label: "Equipments & Machineries",
    icon: "/equipmentIcon.svg",
    options: [
      { value: "Industrial Machines", label: "Industrial Machines" },
      { value: "Construction Equipment", label: "Construction Equipment" },
      { value: "Power Tools", label: "Power Tools" },
      { value: "Office Equipment", label: "Office Equipment" },
      { value: "Manufacturing Equipment", label: "Manufacturing Equipment" },
      { value: "Agricultural Machinery", label: "Agricultural Machinery" },
    ],
  },
  {
    id: "kids",
    label: "For Kids",
    icon: "/kidsIcon.svg",
    options: [
      { value: "Baby Clothes", label: "Baby Clothes" },
      { value: "Kids Clothes", label: "Kids Clothes" },
      { value: "Shoes", label: "Shoes" },
      { value: "Toys & Games", label: "Toys & Games" },
      { value: "Baby Gear (strollers, car seats, carriers)", label: "Baby Gear (strollers, car seats, carriers)" },
      { value: "Feeding (bottles, high chairs, breast pumps)", label: "Feeding (bottles, high chairs, breast pumps)" },
      { value: "School Supplies (bags, books, stationery)", label: "School Supplies (bags, books, stationery)" },
    ],
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: "/fashionIcon.svg",
    options: [
      { value: "Clothing", label: "Clothing" },
      { value: "Footwear", label: "Footwear" },
      { value: "Bags", label: "Bags" },
      { value: "Jewellery", label: "Jewellery" },
      { value: "Watches", label: "Watches" },
      { value: "Accessories", label: "Accessories" },
      { value: "Eyewear (Glasses & Sunglasses)", label: "Eyewear (Glasses & Sunglasses)" },
      { value: "Wedding & Event Wear", label: "Wedding & Event Wear" },
    ],
  },
  {
    id: "gadgets",
    label: "Gadgets",
    icon: "/gadgetIcon.svg",
    options: [
      { value: "Mobile Phones", label: "Mobile Phones" },
      { value: "Tablets", label: "Tablets" },
      { value: "Smartwatches", label: "Smartwatches" },
      { value: "Phone Accessories", label: "Phone Accessories" },
      { value: "Power Banks", label: "Power Banks" },
      { value: "Earphones / Headsets", label: "Earphones / Headsets" },
    ],
  },
  {
    id: "household",
    label: "Household Items",
    icon: "/householdIcon.svg",
    options: [
      { value: "Furniture", label: "Furniture" },
      { value: "Home Appliances", label: "Home Appliances" },
      { value: "Kitchen Appliances", label: "Kitchen Appliances" },
      { value: "Home Decor", label: "Home Decor" },
      { value: "Bedding & Linen", label: "Bedding & Linen" },
      { value: "Kitchenware & Cookware", label: "Kitchenware & Cookware" },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: "/jobIcon.svg",
    options: [
      { value: "Jobs", label: "All Jobs" },
      { value: "Jobs for Hire", label: "Jobs for Hire" },
      { value: "Jobs for sale", label: "Jobs for Sale" },
    ],
  },
  {
    id: "laptops",
    label: "Laptops & Computers",
    icon: "/laptopIcon.svg",
    options: [
      { value: "Laptops", label: "Laptops" },
      { value: "Desktop Computers", label: "Desktop Computers" },
      { value: "Computer Accessories", label: "Computer Accessories" },
      { value: "Monitors", label: "Monitors" },
      { value: "Printers & Scanners", label: "Printers & Scanners" },
      { value: "Storage Devices", label: "Storage Devices" },
    ],
  },
  {
    id: "property",
    label: "Property",
    icon: "/property.svg",
    options: [
      { value: "Commercial Property For Rent", label: "Commercial Property For Rent" },
      { value: "Commercial Property For Sale", label: "Commercial Property For Sale" },
      { value: "House and Apartment Property For Rent", label: "House/Apartment For Rent" },
      { value: "House and Apartment Property For Sale", label: "House/Apartment For Sale" },
      { value: "Land and Plot For Rent", label: "Land and Plot For Rent" },
      { value: "Land and Plot For Sale", label: "Land and Plot For Sale" },
      { value: "Short Let Property", label: "Short Let Property" },
      { value: "Event Center And Venues", label: "Event Center And Venues" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: "/servicesIcon.svg",
    options: [
      { value: "Tech & IT", label: "Tech & IT" },
      { value: "Lessons & Training", label: "Lessons & Training" },
      { value: "Cleaning", label: "Cleaning" },
      { value: "Repairs & Maintenance", label: "Repairs & Maintenance" },
      { value: "Plumbing", label: "Plumbing" },
      { value: "Electrical Wiring & Installation", label: "Electrical Wiring & Installation" },
      { value: "Beauty & Wellness", label: "Beauty & Wellness" },
    ],
  },
  {
    id: "vehicle",
    label: "Vehicles",
    icon: "/vehicle.svg",
    options: [
      { value: "car", label: "Cars" },
      { value: "bus", label: "Buses" },
      { value: "tricycle", label: "Tricycles" },
    ],
  },
];

// Top bar quick access categories (first 8 for better fit)
const topBarCategories = categoryGroups.slice(0, 8);

export default function DropdownPage({ onCategoryChange, selectedCategory }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(categoryGroups[0]);
  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    console.log("Category selected:", value); // Debug log
    setIsDropdownOpen(false);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  const clearCategory = () => {
    if (onCategoryChange) {
      onCategoryChange("");
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Selected Category Chip */}
      {selectedCategory && (
        <div className="flex justify-center py-2 bg-gray-50">
          <div className="flex items-center gap-2 bg-[#E8E8FF] px-4 py-1.5 rounded-full">
            <span className="text-[#525252] text-sm">{selectedCategory}</span>
            <button onClick={clearCategory} className="hover:bg-[#CDCDD7] rounded-full p-0.5">
              <FiX size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center px-4 py-2 gap-2 max-w-full">
        {/* All Categories Button */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all
              ${isDropdownOpen 
                ? "bg-[#000087] text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <span>All Categories</span>
            <FiChevronDown className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} size={16} />
          </button>

          {/* Mega Menu Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 flex bg-white rounded-lg shadow-xl border border-gray-200 min-w-[700px]">
              {/* Left Sidebar - Category Groups */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 py-2 max-h-[450px] overflow-y-auto">
                {categoryGroups.map((group) => (
                  <button
                    key={group.id}
                    onMouseEnter={() => setHoveredGroup(group)}
                    onClick={() => setHoveredGroup(group)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors
                      ${hoveredGroup?.id === group.id 
                        ? "bg-white text-[#000087] border-l-2 border-[#000087]" 
                        : "text-gray-700 hover:bg-gray-100 border-l-2 border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {group.icon && (
                        <Img src={group.icon} alt={group.label} width={20} height={20} className="opacity-70" />
                      )}
                      <span>{group.label}</span>
                    </div>
                    <FiChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Right Panel - Subcategories */}
              <div className="flex-1 p-4 max-h-[450px] overflow-y-auto">
                {hoveredGroup && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                      {hoveredGroup.label}
                    </h3>
                    <div className="space-y-1">
                      {hoveredGroup.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSelect(option.value)}
                          className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors
                            ${selectedCategory === option.value 
                              ? "bg-[#E8E8FF] text-[#000087] font-medium" 
                              : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Category Tabs */}
        <div className="flex-1 flex items-center gap-1 min-w-0">
          <button 
            onClick={scrollLeft}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded hidden md:flex items-center justify-center"
          >
            <FiChevronRight className="rotate-180" size={18} />
          </button>

          <div 
            ref={scrollRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto scroll-smooth min-w-0"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {topBarCategories.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setHoveredGroup(group);
                  setIsDropdownOpen(true);
                }}
                className={`flex-shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${hoveredGroup?.id === group.id && isDropdownOpen
                    ? "text-[#000087] bg-[#E8E8FF]" 
                    : "text-gray-600 hover:text-[#000087] hover:bg-gray-50"
                  }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <button 
            onClick={scrollRight}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded hidden md:flex items-center justify-center"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}