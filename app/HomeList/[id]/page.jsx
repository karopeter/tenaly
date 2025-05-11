import { trends } from "../../lib/constants";
import HeroSection from "../../components/features/hero-section";
import DropdownPage from "../../components/dropdowns/dropdown-page";
import TrendingSection from "../../components/features/trending-section";
import BuyAnything from "../../components/features/buy-anything";
import Img from "../../components/Image";
import { notFound } from "next/navigation";
import Link from "next/link"; // Import Link

// Dynamic SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = params;
  const item = trends.market.find((item) => item.id.toString() === id);

  if (!item) {
    return {
      title: "Item Not Found",
      description: "The item you're looking for could not be found.",
    };
  }

  return {
    title: `${item.standard} | Home Listing`,
    description: item.description?.slice(0, 160) || "View details of this listing on our platform.",
    openGraph: {
      title: `${item.standard} | Home Listing`,
      description: item.description?.slice(0, 160),
      images: [
        {
          url: item.image,
          width: 800,
          height: 600,
          alt: item.standard,
        },
      ],
    },
    alternates: {
      canonical: `https://yourdomain.com/HomeList/${item.id}`,
    },
    keywords: [item.standard, item.location, "real estate", "listing"],
  };
}

export default function HomeListDetail({ params }) {
  const { id } = params;
  const item = trends.market.find((item) => item.id.toString() === id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <HeroSection />
      <DropdownPage />

      <div className="md:px-[104px] px-4">
        <TrendingSection />

        {/* Detail Card */}
        <Link href={`/CarProducts/${item.id}`}> 
        <div className="flex flex-col md:flex-row w-full bg-white border rounded-[12px] overflow-hidden">
          {/* Left: Main Image */}
          <div className="relative w-full md:w-[40%] h-[200px] md:h-auto shrink-0 overflow-hidden">
         
              <Img
                src={item.image}
                alt={item.standard}
                width={340}
                height={210}
                className="w-full h-full object-cover aspect-[1/0.65]"
              />

            {/* Side Image - Top Right */}
            {item.sideImg && (
              <div className="absolute top-2 right-2 z-10">
                <Img src={item.sideImg} alt="Side Icon" width={65} height={44} />
              </div>
            )}

            {/* VIP Image - Bottom Left */}
            {item.vipImg && (
              <div className="absolute bottom-0 left-0 z-30">
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

          {/* Right: Info Section */}
          <div className="p-4 md:p-6 flex flex-col justify-between">
            {/* Top Row: Title and Price */}
            <div className="flex justify-between items-center gap-x-4">
              <h2 className="text-[#525252] text-[14px] md:text-[20px] font-[500] font-inter">
                {item.standard}
              </h2>
              <div className="text-right">
                <p className="text-[#000087] text-[14px] md:text-[18px] font-[500] font-inter">
                  {item.price}
                </p>
                {item.dayPrice && (
                  <p className="text-[#5555DD] text-sm">{item.dayPrice}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-2">
              <p className="text-[#8C8C8C] text-[13px] md:text-[14px] font-[400] font-inter mt-1">
                {item.descriptionHouse}
              </p>
              <p className="text-[#8C8C8C] text-[13px] md:text-[14px] font-[400] font-inter mt-2">
                {item.descriptionTwo}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mt-3">
              <Img
                src={item.locationImg}
                alt="Location Icon"
                width={10}
                height={13}
                className="inline-block"
              />
              <span className="text-[#8C8C8C] text-[13px] md:text-[14px] font-[400] font-inter">
                {item.location}
              </span>
            </div>

            {/* Icons Row */}
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2 mt-3">
              {/* Car */}
              {(item.carImg || item.dUsed) && (
                <div className="flex items-center gap-2">
                  {item.carImg && (
                    <Img
                      src={item.carImg}
                      alt="LocalUsed"
                      width={24}
                      height={24}
                      className="inline-block"
                    />
                  )}
                  {item.dUsed && (
                    <span className="text-[#868686] text-[12px] font-[400] font-inter">
                      {item.dUsed}
                    </span>
                  )}
                </div>
              )}

              {/* Auto */}
              {(item.autoImg || item.aAuto) && (
                <div className="flex items-center gap-2">
                  {item.autoImg && (
                    <Img
                      src={item.autoImg}
                      alt="Auto"
                      width={24}
                      height={24}
                      className="inline-block"
                    />
                  )}
                  {item.dAuto && (
                    <span className="text-[#868686] text-[12px] font-[400] font-inter">
                      {item.dAuto}
                    </span>
                  )}
                </div>
              )}

              {/* Meter */}
              {(item.meterImg || item.meterText) && (
                <div className="flex items-center gap-2">
                  {item.meterImg && (
                    <Img
                      src={item.meterImg}
                      alt="Meter"
                      width={24}
                      height={24}
                      className="inline-block"
                    />
                  )}
                  {item.meterText && (
                    <span className="text-[#868686] text-[12px] font-[400] font-inter">
                      {item.meterText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        </Link>

        <BuyAnything />
      </div>
    </div>
  );
}
