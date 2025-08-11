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
        if (category) params.category = category;
        if (search) params.search = search;
        if (location) params.location = location;

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
    return (
      <div className="min-h-screen flex  justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market products...</p>
        </div>
      </div>
    );
  }

   if (error) {
    return <section className="px-4 md:px-10 mt-10 text-center text-red-500">{error}</section>;
  }

  if (ads.length === 0) {
    return <section className="px-4 md:px-10 mt-10 text-center">No marketplace ads found.</section>;
  }

  return (
    <section className="px-4 md:px-10 mt-10">
      <div className="container mx-auto px-0 sm:px-4">
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
                <li className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {imageUrl && (
                      <Img
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {(vehicleAd?.plan || propertyAd?.plan) && (
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
                          <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase truncate">
                            {vehicleAd?.plan || propertyAd?.plan}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[#000087] font-inter font-semibold text-[14px] sm:text-[16px] md:text-[18px] truncate">
                        {price}
                      </span>
                    </div>

                    <h3 className="mt-1 text-[#525252] font-inter text-lg line-clamp-1">
                      {title}
                    </h3>

                    <p className="text-[#8C8C8C] font-inter text-sm line-clamp-2 mb-4">
                      {description}
                    </p>

                    <div className="flex items-center gap-1 text-[#8C8C8C] font-inter text-sm mb-4">   
                        <Img src="/location.svg" alt="Location" width={10} height={14} />
                        <span>{location}</span>
                    </div>
                     <div className="flex gap-2">
                        {vehicleAd?.carType && (
                          <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                            {vehicleAd.carType}
                          </span>
                        )}
                        {vehicleAd?.transmission && (
                          <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                            {vehicleAd.transmission}
                          </span>
                        )}
                        {propertyAd?.propertyType && (
                          <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                            {propertyAd.propertyType}
                          </span>
                        )}
                        {propertyAd?.propertyCondition && (
                          <span className="bg-[#E8E8FF]  font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                            {propertyAd.propertyCondition}
                          </span>
                        )}
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
