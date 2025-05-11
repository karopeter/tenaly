"use client";
import Img from "../Image";
import Button from "../Button";
import Link from "next/link";  // Import Link from Next.js
import { trends } from "../../lib/constants";

export default function MarketPlace() {
  return (
    <section className="px-4 md:px-10">
      <div className="container mx-auto px-4">
        <ul className="grid gap-[15px] grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trends.market.map((item, index) => (
            <Link href={`/HomeList/${item.id}`} key={index}> 
              <li
                className="bg-white text-left rounded-[12px] border border-[#EDEDED] overflow-hidden relative"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              >
                {/* Image Container */}
                <div className="relative w-full">
                  <Img
                    src={item.image}
                    alt="Main"
                    width={600}
                    height={400}
                    className="aspect-[1/0.65] w-full h-auto object-cover"
                  />

                  {/* Side Image Top Right */}
                  {item.sideImg && (
                    <div className="absolute top-2 right-2 z-20">
                      <Img src={item.sideImg} alt="Side Icon" width={65} height={44} />
                    </div>
                  )}

                  {/* VIP Image - Bottom Left INSIDE the top image */}
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

                {/* Card Body */}
                <div className="pt-6 pb-4 px-4"> 
                  <div className="flex items-center gap-1">
                    <span className="text-[#000087] font-inter font-[500] text-[16px] md:text-[18px]">{item.price}</span>
                    {item.dayPrice && (
                      <span className="text-[#5555DD] font-[400] text-[12px] md:text-[14px] font-inter">{item.dayPrice}</span>
                    )}
                  </div>
                  <h3 className="mt-1 text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
                    {item.standard}
                  </h3>
                  <p className="text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-[400] mt-1">
                    {item.descriptionHouse}</p>
                    <p className="text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-[400] mt-1">
                    {item.description}</p>


                  <div className="flex flex-col mt-3 text-sm text-[#555] gap-[4px]">
                    <span className="flex items-center justify-start gap-2 text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-[400]">
                      <Img 
                        src={item.locationImg}
                        alt="Location Image"
                        width={9.33}
                        height={13.33}
                      />
                      {item.location}
                    </span>
                    <div className="flex flex-row items-center justify-between gap-2 mt-2 text-gray-500 text-xs">
                     <Button 
                      className="flex-1 md:max-w-[50%]  w-[84px] h-[24px] py-[6px] px-[10px] bg-[#E8E8FF] 
                      rounded-[4px] text-[12px] font-inter font-[400] text-center">
                       {item.lUsed}
                     </Button>
                    <Button className="flex-1 md:max-w-[50%] py-[6px] 
                      px-[10px] bg-[#E8E8FF] rounded-[4px] text-[12px] font-inter font-[400] text-center">
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
