import Link from "next/link";
import Img from "../Image";
import Button from "../Button";

export default function CarSuggestion({ specs }) {
  return (
    <section className="mt-20">
      <p className="text-[#525252] md:text-[18px] font-[500] font-inter">
        {specs.suggestions}
      </p>

 <div className="mx-auto mt-4 px-4">
  <ul className="grid gap-x-5 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    {Array(4)
      .fill(specs)
      .map((item, index) => (
        <Link href="/" key={index}>
          <li
            className="bg-white rounded-[12px] border border-[#EDEDED] overflow-hidden w-full max-w-[398px] mx-auto"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            {/* Image */}
            <div className="relative w-full">
              <Img
                src={item.image}
                alt="Main"
                width={600}
                height={400}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute top-2 right-2 z-20">
                <Img src={item.sideImg} alt="Side Icon" width={50} height={34} />
              </div>
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
              <div className="text-[#000087] font-inter font-[500] text-[14px] md:text-[16px]">
                {item.price}
              </div>
              <h3 className="mt-1 text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
                {item.standard}
              </h3>

              <p className="text-[#8C8C8C] text-[10px] md:text-[12px] font-inter font-[400] mt-1 line-clamp-2">
                {item.descriptionHouse}
              </p>
              <p className="text-[#8C8C8C] text-[10px] md:text-[12px] font-inter font-[400] mt-1 line-clamp-2">
                {item.description}
              </p>

              <div className="flex flex-col mt-3 text-sm text-[#555] gap-[4px]">
                <span className="flex items-center gap-2 text-[#8C8C8C] text-[10px] md:text-[12px] font-inter font-[400]">
                  <Img src={item.locationImg} alt="Location Image" width={9.33} height={13.33} />
                  {specs.locationN}
                </span>

                <div className="flex items-center justify-between gap-2 mt-2">
                  <button
                    className="flex-1 h-[30px] flex items-center justify-center bg-[#E8E8FF] 
                    rounded-[4px] text-[10px] font-inter font-[400] text-center whitespace-nowrap"
                  >
                    {item.dUsed}
                  </button>
                  <button
                    className="flex-1 h-[30px] flex items-center justify-center bg-[#E8E8FF] 
                    rounded-[4px] text-[10px] font-inter font-[400] text-center"
                  >
                    {item.auto}
                  </button>
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