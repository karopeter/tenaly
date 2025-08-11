"use client";
import { useState } from "react";
import DropdownPage from "../components/dropdowns/dropdown-page"; // Ensure correct import path
import TrendingSection from "../components/features/trending-section";
import MarketPlace from "../components/features/market-place";
import BuyAnything from "../components/features/buy-anything";
import LocationSearch from "../components/UI/location-item";

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = (location) => {
    console.log("Selected Location in ProductList:", location);
  };

  return (
    <>
      <section className="w-full h-[300px] md:h-[350px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] pt-[80px] md:pt-[100px] px-4">
           <div className="flex justify-center items-center mt-10">
             <h1 className="text-white text-center font-inter text-[18px] md:text-[28px] font-[500] leading-snug">
               Discover what you need
             </h1>
           </div>
     
           {/* Responsive Search Component */}
           <div className="mt-6 md:mt-10 px-2 md:px-0">
              <LocationSearch
               onSearchChange={handleSearchChange}
               onLocationSelect={handleLocationSelect}
             />
           </div>
         </section>
      {/* THIS IS THE CRUCIAL PART: Pass onCategoryChange prop */}
      <DropdownPage
        onCategoryChange={handleCategoryChange} // Make sure this line exists and is correct
      />
      <div className="md:pr-[104px] md:pl-[104px]">
        <TrendingSection />
        <MarketPlace
          category={selectedCategory}
          search={searchQuery}
        />
        <BuyAnything />
      </div>
    </>
  );
}