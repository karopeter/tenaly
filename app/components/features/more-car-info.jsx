import Img from "../Image";
import Button from "../Button";

export default function MoreCarInfo({ specs }) {
  return (
    <>
      {/* More Info Section */}
      <div className="bg-[#FAFAFA] w-full max-w-[650px] h-auto rounded-[12px] p-4 md:p-8 mt-4 mx-auto">
        <h3 className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
          {specs.moreInfo}
        </h3>
        <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
          {specs.infoDescription}
        </p>
      </div>

      {/* Store Address Section */}
      <div className="bg-[#FAFAFA] w-full max-w-[650px] h-auto rounded-[12px] p-4 md:p-8 mt-4 mx-auto">
        <h3 className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
          {specs.storeAdd}
        </h3>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
          {/* Location Section */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <Img
                src={specs.locationImg}
                alt="Location Icon"
                width={11.67}
                height={16.67}
                className="mr-2"
              />
              <span className="text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
                {specs.location}
              </span>
            </div>
            <span className="text-[#868686] mt-1 text-[10px] md:text-[12px] font-[400] font-inter">
              {specs.locationDetails}
            </span>
          </div>

          {/* Delivery Button */}
          <div className="hidden md:block mt-4 md:mt-0">
            <Button
              className="flex items-center bg-[#F7F7FF] border border-[#DFDFF9] justify-center px-3 py-2 rounded-[4px]"
            >
              <Img
                src={specs.deliveryImg}
                alt="Truck Icon"
                width={16}
                height={16}
                className="mr-2"
              />
              <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">
                {specs.deliveryBtn}
              </span>
            </Button>
          </div>
        </div>

        {/* Working Hours Section */}
        <div className="mt-4">
          <h4 className="text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
            {specs.workingHour}
          </h4>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {specs.days.map((day, index) => (
                <div
                  key={index}
                  className="bg-[#F7F7FF] text-[#000087] text-[10px] md:text-[12px] font-[500] font-inter w-auto h-auto rounded-[4px] px-2 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Img
                src={specs.clockImg}
                alt="Clock Icon"
                width={18}
                height={18}
                className="mr-1"
              />
              <span className="text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
                {specs.openingHours}
              </span>
            </div>

            {/* Opened Status */}
            <div className="flex items-center bg-[#E9F4E8] px-3 py-2 rounded-md">
              <div className="w-[6px] h-[6px] bg-[#238E15] rounded-full mr-2"></div>
              <span className="text-[#238E15] text-[12px] font-[500] font-inter">
                {specs.availability}
              </span>
            </div>
          </div>

          {/* Delivery Button (Mobile View) */}
          <div className="block md:hidden mt-4">
            <Button
              className="flex items-center bg-[#F7F7FF] border border-[#DFDFF9] justify-center px-3 py-2 rounded-[4px]"
            >
              <Img
                src={specs.deliveryImg}
                alt="Truck Icon"
                width={16}
                height={16}
                className="mr-2"
              />
              <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">
                {specs.deliveryBtn}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div
        id="social-media-section"
        className="bg-[#FAFAFA] w-full max-w-[650px] h-auto rounded-[12px] p-4 md:p-8 mt-4 mx-auto"
      >
        <div className="flex  items-center justify-between gap-4">
          <span className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
            {specs.share}
          </span>

          <div className="flex items-center gap-2">
            {[specs.whatappImg, specs.linkedlnImg, specs.facebookImg, specs.instaImg, specs.tiktokImg, specs.twitterImg].map(
              (icon, index) => (
                <Img
                  key={index}
                  src={icon}
                  alt={`Social Icon ${index + 1}`}
                  width={35}
                  height={35}
                  className="w-[25px] h-[25px] md:w-[35px] md:h-[35px] rounded-full"
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}