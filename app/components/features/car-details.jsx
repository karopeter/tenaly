import Img from "../Image";
import Button from "../Button";

export default function CarDetailsPage({ specs }) {
  if (!specs) {
    return (
      <div className="bg-[#FAFAFA] w-full md:w-[650px] h-auto md:h-[185px] rounded-[12px] p-4 md:p-6 mt-5">
        <h2 className="text-lg font-semibold text-center">No specifications available</h2>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FAFAFA] w-full md:w-[650px] h-auto  rounded-[12px] p-4 md:p-6 mt-5">
        {/* Title and Eye Icon */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-row items-center justify-between w-full">
            <h2 className="text-[#525252] text-[14px] md:text-[24px] font-[500] font-inter">
              {specs.titleProduct}
            </h2>

            <div className="flex items-center space-x-2">
              <Img
                src={specs.eyeImg}
                alt="Eye Icon"
                width={16}
                height={16}
                className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
              />
              <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                {specs.eyeText}
              </span>
            </div>
          </div>
        </div>

        {/* Location and Promote Button */}
        <div className="mt-4 flex flex-row items-center  justify-between">
          <div className="flex items-center">
            <Img
              src={specs.locationIcon}
              alt="Location Icon"
              width={11.5}
              height={13.33}
              className="mr-2"
            />
            <span className="text-[#8C8C8C] text-[12px] md:text-[14px] font-[400] font-inter">
              {specs.location}
            </span>
          </div>

          <div className="mt-2 md:mt-0">
            <Button
              className="bg-[#DFDFF9] py-2 px-3 
              text-[#000087] text-[10px] md:text-[12px] font-inter font-[500] rounded-[4px]"
            >
              {specs.promoteButton}
            </Button>
          </div>
        </div>

        {/* Car Details */}
        <div className="flex flex-row gap-4 mt-4">
          <div className="flex items-center">
            <Img
              src={specs.carImg}
              alt="Car Icon"
              width={29}
              height={29}
              className="mr-1"
            />
            <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
              {specs.dUsed}
            </span>
          </div>
          <div className="flex items-center">
            <Img
              src={specs.autoImg}
              alt="Auto Icon"
              width={29}
              height={29}
              className="mr-1"
            />
            <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter">
              {specs.dAuto}
            </span>
          </div>
          <div className="flex items-center">
            <Img
              src={specs.meterImg}
              alt="Meter Icon"
              width={29}
              height={29}
              className="mr-1"
            />
            <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter">
              {specs.meterText}
            </span>
          </div>
        </div>

        {/* Posted Text */}
        <div className="mt-4">
          <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
            {specs.postedText}
          </span>
        </div>
      </div>
    </>
  );
}