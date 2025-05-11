"use client";
import Img from "../Image";

export default function TrendingSection() {
  return (
    <div className="mt-6 md:mt-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[#2E2E2E] font-inter text-[16px] md:text-[20px] font-[500]">
          Trending
        </h2>

        {/* Filter Icons */}
        <div className="flex items-center space-x-3">
          <button className="cursor-pointer">
            <Img
              src="/filter.svg"
              alt="Filter Icon 1"
              width={34}
              height={32}
              className="w-[24px] h-[24px] md:w-[34px] md:h-[24px]"
            />
          </button>
          <button className="cursor-pointer">
            <Img
              src="/filter2.svg"
              alt="Filter Icon 2"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
