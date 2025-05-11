"use client";
import { useState, useEffect } from "react";
import Img from "../Image";

export default function LocationModal({ isOpen, onClose, onSelectLocation }) {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState(null);

  const baseURI = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await fetch(`${baseURI}/locations/getLocation`);
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    if (isOpen) getLocations();
  }, [isOpen]);

  const filteredItems = selectedState
    ? selectedState.lgas.filter((lga) =>
        lga.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : locations.filter((state) =>
        state.state.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSearchQuery("");
  };

  const handleLGASelect = (lga) => {
    onSelectLocation(lga);
    setSelectedState(null);
    setSearchQuery("");
    onClose();
  };

  const handleBack = () => {
    setSelectedState(null);
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center mt-20 bg-opacity-50">
      <div className="bg-white w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto rounded-[24px] p-6 relative shadow-lg">
        <button
          onClick={() => {
            onClose();
            setSelectedState(null);
          }}
          className="absolute top-4 right-4 text-[#525252] text-[20px] font-[500]"
        >
          &times;
        </button>

        <div className="mb-4 flex items-center justify-between">
          {selectedState && (
            <button
              onClick={handleBack}
              className="flex items-center text-[#5555DD] text-[14px] font-[500] font-inter"
            >
              <Img
                src="/goBack.svg"
                alt="Go Back"
                width={6}
                height={12}
                className="mr-2"
              />
              <span className="text-[#868686]">Go Back</span>
            </button>
          )}
          <h2 className="text-[#525252] md:text-[20px] font-[500] font-inter text-center flex-1">
            {selectedState ? "Select LGA" : "Choose Location"}
          </h2>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="relative w-full max-w-[400px]">
            <Img
              src="/search-normal.svg"
              alt="Search Icon"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CDCDD7]"
            />
            <input
              type="text"
              placeholder={`Search for a ${selectedState ? "LGA" : "state"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none py-2 px-10 w-full rounded-[8px] text-[14px] bg-[#E8E8FF] h-[44px] md:h-[52px] placeholder:text-[#CDCDD7]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                selectedState
                  ? handleLGASelect(item)
                  : handleStateSelect(item)
              }
              className="flex items-center justify-between w-full py-3 px-4 border border-[#EDEDED] rounded-[8px] bg-[#F7F7FF] text-left"
            >
              <span className="text-[#525252] text-[14px] font-[500] font-inter">
                {selectedState ? item : item.state}
              </span>
              {!selectedState && (
                <div className="flex items-center space-x-2">
                  <span className="text-[#868686] text-[12px] font-[400] whitespace-nowrap ml-1 font-inter">
                    {item.ads}
                  </span>
                  <Img
                    src="/rightarr.svg"
                    alt="Right Arrow"
                    width={6}
                    height={10}
                    className="flex-shrink-0"
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
