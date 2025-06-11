"use client";
import Img from "../Image";
import Button from "../Button";
import Link from "next/link";  // Import Link from Next.js
import { trends } from "../../lib/constants";

export default function MarketPlace() {
  return (
    <section className="px-4 md:px-10">
    <div className="container mx-auto px-4">
    <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {trends.market.map((item, index) => (
    <Link href={`/HomeList/${item.id}`} key={index}>
      <li
        className="bg-white text-left rounded-[12px] border border-[#EDEDED] overflow-hidden relative shadow-md transition-transform hover:scale-[1.02]"
      >
        {/* Image Section */}
        <div className="relative w-full">
          <Img
            src={item.image}
            alt="Main"
            width={600}
            height={400}
            className="aspect-[1/0.75] w-full h-auto object-cover"
          />
          {item.sideImg && (
            <div className="absolute top-2 right-2 z-20">
              <Img src={item.sideImg} alt="Side Icon" width={65} height={44} />
            </div>
          )}
          {item.vipImg && (
            <div className="absolute bottom-0 -left-4 z-30 translate-y-1/2 pl-4">
              <Img
                src={item.vipImg}
                alt="VIP Icon"
                width={139}
                height={38}
                className="w-[65px] h-[44px] md:w-[139px] md:h-[38px]"
              />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="pt-6 pb-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-[#000087] font-inter font-semibold text-[16px] md:text-[18px]">{item.price}</span>
            {item.dayPrice && (
              <span className="text-[#5555DD] font-normal text-[12px] md:text-[14px] font-inter">{item.dayPrice}</span>
            )}
          </div>

          <h3 className="mt-1 text-[#525252] text-[14px] md:text-[16px] font-medium font-inter whitespace-nowrap">{item.standard}</h3>

          <p 
           className="text-[#8C8C8C] text-[12px] md:text-[14px] 
           font-inter font-normal mt-1 truncate overflow-hidden whitespace-nowrap">
            {item.descriptionHouse}
          </p>
          <p className="text-[#8C8C8C] text-[12px] md:text-[14px] 
          font-inter font-normal mt-1 truncate
           overflow-hidden whitespace-nowrap">
            {item.description}
          </p>

          <div className="flex flex-col mt-4 text-sm text-[#555] gap-[4px]">
            <span className="flex items-center gap-2 text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-normal">
              <Img src={item.locationImg} alt="Location" width={9.33} height={13.33} />
              {item.location}
            </span>

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              <Button className="flex items-center justify-center flex-1 bg-[#E8E8FF] rounded-[4px] text-[12px] font-inter font-normal py-1 px-2 whitespace-nowrap">
                {item.lUsed}
              </Button>
              <Button className="flex items-center justify-center flex-1 bg-[#E8E8FF] rounded-[4px] text-[12px] font-inter font-normal py-1 px-2">
                {item.auto}
              </Button>
            </div>
          </div>
        </div>
      </li>
    </Link>
     ))}
  </ul>
    </div>
  </section>
  );
}
