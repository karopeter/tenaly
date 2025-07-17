"use client";
import { useEffect, useState } from "react";
import Img from "../Image";
import Button from "../Button"; 
import Link from "next/link";
import api from "@/services/api";

export default function MarketPlace({ category, search, location }) { 
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const machineImage = "/machineGun.svg"; 

  useEffect(() => {
    const fetchAllAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        
        if (category) {
            params.category = category;
        }

        if (search) {
          params.search = search;
        }
        
        if (location) {
          params.location = location;
        }

        // Use your existing API service
        const res = await api.get("/products/get-all-marketproducts", { params });
        
        if (res.data.success) {
          setAds(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch ads.");
        }
      } catch (err) {
        console.error("Error fetching marketplace ads:", err);
        setError("Error fetching marketplace ads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAds();
  }, [category, search, location]);

  if (loading) {
    return <section className="px-4 md:px-10 mt-10 text-center">Loading marketplace ads...</section>;
  }

  if (error) {
    return <section className="px-4 md:px-10 mt-10 text-center text-red-500">{error}</section>;
  }

  if (ads.length === 0) {
    return <section className="px-4 md:px-10 mt-10 text-center">No marketplace ads found.</section>;
  }

  return (
    <section className="px-4 md:px-10 mt-10">
      <div className="container mx-auto px-4">
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ads.map((item, index) => {
            const adId = item?.adId || index;
            const { carAd, vehicleAd, propertyAd } = item;

            const mainAd = vehicleAd || propertyAd || {};
            const title = vehicleAd
              ? `${vehicleAd.vehicleType || ""} ${vehicleAd.model || ""} ${vehicleAd.trim || ""} ${vehicleAd.year || ""}`.trim()
              : propertyAd?.propertyName || "Untitled Property";

            const description = mainAd.description || "No description available";
            const price = mainAd.amount ? `₦${mainAd.amount.toLocaleString()}` : "Price not set";

            const displayImage = carAd?.vehicleImage?.[0] || carAd?.propertyImage?.[0];
            const imageUrl = displayImage 
                             ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${displayImage.replace(/\\/g, "/")}`
                             : null;

            const location = carAd?.location || "Unknown";

            return (
              <Link href={`/HomeList/${adId}`} key={adId}>
                <li className="bg-white text-left rounded-[12px] border border-[#EDEDED] overflow-hidden relative shadow-md transition-transform hover:scale-[1.02]">
                  <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                    {imageUrl && (
                      <Img
                        src={imageUrl}
                        alt={title}
                        width={340} 
                        height={210}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Plan badge for vehicleAd */}
                    {vehicleAd?.plan && (
                      <div
                        className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                        style={{
                          backgroundImage: `url(${machineImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                          <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                          <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                            {vehicleAd.plan}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Plan badge for propertyAd */}
                    {propertyAd?.plan && (
                      <div
                        className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                        style={{
                          backgroundImage: `url(${machineImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                          <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                          <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                            {propertyAd.plan}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 pb-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#000087] font-inter font-semibold text-[16px] md:text-[18px]">
                        {price}
                      </span>
                    </div>

                    <h3 className="mt-1 text-[#525252] text-[14px] md:text-[16px] font-medium font-inter whitespace-nowrap overflow-hidden text-ellipsis">
                      {title}
                    </h3>

                    <p className="text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-normal mt-1 truncate">
                      {description}
                    </p>

                    <div className="flex flex-col mt-4 text-sm text-[#555] gap-[4px]">
                      <span className="flex items-center gap-2 text-[#8C8C8C] text-[12px] md:text-[14px] font-inter font-normal">
                        <Img src="/location.svg" alt="Location" width={10} height={14} />
                        {location}
                      </span>

                      <div className="flex gap-2 mt-3 flex-wrap"> {/* Added flex-wrap for buttons */}
                        {vehicleAd?.carType && (
                          <Button className="flex items-center justify-center flex-1 bg-[#E8E8FF] rounded-[4px] text-[12px] font-inter font-normal py-1 px-2">
                            {vehicleAd.carType}
                          </Button>
                        )}
                        {vehicleAd?.transmission && (
                          <Button className="flex items-center justify-center flex-1 bg-[#E8E8FF] rounded-[4px] text-[12px] font-inter font-normal py-1 px-2">
                            {vehicleAd.transmission}
                          </Button>
                        )}
                        {propertyAd?.propertyType && (
                          <Button className="inline-flex items-center justify-center bg-[#E8E8FF] rounded-[4px] text-[12px] break-words font-inter font-normal py-1 px-3 max-w-full">
                            {propertyAd.propertyType}
                          </Button>
                        )}
                        {propertyAd?.propertyCondition && (
                          <Button
                            className="inline-flex items-center justify-center bg-[#E8E8FF]
                            rounded-[4px] text-[12px] font-inter font-normal py-1 px-3 max-w-full"
                          >
                            {propertyAd.propertyCondition}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </section>
  );
}