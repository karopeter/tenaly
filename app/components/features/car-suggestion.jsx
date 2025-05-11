import Link from "next/link";
import Img from "../Image";
import Button from "../Button";

export default function CarSuggestion({ specs }) {
  return (
    <section className="mt-20">
      <p className="text-[#525252] md:text-[18px] font-[500] font-inter">
        {specs.suggestions}
      </p>

      <div className="mx-auto mt-4">
        {/* Grid Container */}
        <ul className="grid gap-x-[20px] gap-y-[30px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {Array(4) // Assuming you want to display 4 items
            .fill(specs)
            .map((item, index) => (
              <Link href="/" key={index}>
                <li
                  className="bg-white text-left rounded-[12px] border border-[#EDEDED] overflow-hidden relative md:max-w-[389px] mx-auto"
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Image Container */}
                  <div className="relative w-full">
                    <Img
                      src={item.image}
                      alt="Main"
                      width={600}
                      height={400}
                      className="aspect-[1/0.75] w-full h-auto object-cover"
                    />

                    {/* Side Image Top Right */}
                    <div className="absolute top-2 right-2 z-20">
                      <Img
                        src={item.sideImg}
                        alt="Side Icon"
                        width={50}
                        height={34}
                      />
                    </div>

                    {/* VIP Image - Bottom Left INSIDE the top image */}
                    <div className="absolute bottom-0 -left-4 z-30 translate-y-1/2 pl-4">
                      <Img
                        src={item.vipImg}
                        alt="VIP Icon"
                        width={100}
                        height={30}
                        className="w-[65px] h-[30px] md:w-[100px] md:h-[30px]"
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-4 pb-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[#000087] font-inter font-[500] text-[14px] md:text-[16px]">
                        {item.price}
                      </span>
                    </div>
                    <h3 className="mt-1 text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
                      {item.standard}
                    </h3>
                    <p className="text-[#8C8C8C] text-[10px] md:text-[12px] font-inter font-[400] mt-1">
                      {item.descriptionHouse}
                    </p>
                    <p className="text-[#8C8C8C] text-[10px] md:text-[12px] font-inter font-[400] mt-1">
                      {item.description}
                    </p>

                    <div className="flex flex-col mt-3 text-sm text-[#555] gap-[4px]">
                      <span
                        className="flex items-center justify-start 
                         gap-2 text-[#8C8C8C] text-[10px]
                          md:text-[12px] font-inter font-[400]"
                      >
                        <Img
                          src={item.locationImg}
                          alt="Location Image"
                          width={9.33}
                          height={13.33}
                        />
                        {specs.locationN}
                      </span>
                      <div className="flex flex-row items-center justify-between gap-2 mt-2 text-gray-500 text-xs">
                        <Button
                          className="flex-1 md:max-w-[50%] w-[70px] h-[24px] py-[4px] px-[8px] bg-[#E8E8FF] 
                          rounded-[4px] text-[10px] font-inter font-[400] text-center"
                        >
                          {item.dUsed}
                        </Button>
                        <Button
                          className="flex-1 md:max-w-[50%] py-[4px] 
                          px-[8px] bg-[#E8E8FF] rounded-[4px] text-[10px] font-inter font-[400] text-center"
                        >
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