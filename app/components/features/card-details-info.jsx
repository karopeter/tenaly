export default function CarDetailsInfo({ specs }) {
    return (
      <>
        <div className="flex flex-wrap justify-between gap-y-4 gap-x-[4%] max-w-[650px] mx-auto">
          {/* Row 1 */}
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                {specs.make}
            </span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                {specs.makeName}
            </span>
          </div>
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.model}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium  font-inter">{specs.modelName}</span>
          </div>
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.manufacturing}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">{specs.factoryYear}</span>
          </div>
  
          {/* Row 2 */}
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.color}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">{specs.colorType}</span>
          </div>
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.interior}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium  font-inter">{specs.interiorColor}</span>
          </div>
          <div className="flex flex-col w-[48%] md:w-[30%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.condition}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">{specs.conditionTitle}</span>
          </div>
        </div>
  
        {/* Fifth Row */}
        <div className="flex gap-2 mt-4">
          <div className="flex flex-col w-[48%] md:w-[33%]">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">{specs.seatNo}</span>
            <span className="text-[#525252] mt-2text-[14px] md:text-[16px]  font-medium font-inter">{specs.seatCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">{specs.fuelType}</span>
            <span className="text-[#525252] mt-2 text-[14px] md:text-[16px]  font-medium font-inter">{specs.eletric}</span>
          </div>
        </div>
      </>
    );
  }