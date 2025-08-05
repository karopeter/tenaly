"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Link from "next/link";
import MessageSellerButton from "../components/UI/messageSeller";
import Img from "../components/Image";
import Button from "../components/Button";

export default function SellerProfile({ sellerId, userId }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const machineImage = "/machineGun.svg"; 

  
  const parseBusinessHoursAddress = (addressString) => {
    try {
      const cleanedString = addressString
        .replace(/new ObjectId\('[^']+'\)/g, "") 
        .replace(/'/g, '"'); 

      let jsonParsed;
      if (cleanedString.startsWith("{") && cleanedString.endsWith("}")) {
        jsonParsed = JSON.parse(cleanedString);
      } else {
        try {
          jsonParsed = JSON.parse(
            `{ "address": "${cleanedString.replace(/"/g, '\\"')}" }`
          );
        } catch (innerError) {
          return cleanedString.replace(/\\n/g, "").trim(); 
        }
      }

      return jsonParsed.address || "Address not specified";
    } catch (error) {
      console.warn("Could not parse business hours address string:", addressString, error);
      const match = addressString.match(/address:\s*'([^']+)'/);
      if (match && match[1]) {
        return match[1];
      }
      return "Invalid Address Format";
    }
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await api.get("/profile");
        setUserProfile(profileRes.data);

        const productsRes = await api.get("/products/get-all-marketproducts");

        if (productsRes.data.success && Array.isArray(productsRes.data.data)) {
          setMarketProducts(productsRes.data.data);

          const uniqueBusinessesMap = new Map();
          productsRes.data.data.forEach((item) => {
            const businessInfo = item.business;
            const validBusiness = businessInfo || item.carAd?.businessCategory;

            if (validBusiness && validBusiness._id) {
              uniqueBusinessesMap.set(validBusiness._id, validBusiness);
            }
          });
          const extractedBusinesses = Array.from(uniqueBusinessesMap.values());
          setBusinesses(extractedBusinesses);

          if (extractedBusinesses.length > 0) {
            setSelectedBusiness(extractedBusinesses[0]._id);
          }
        } else {
          setError(
            productsRes.data.message || "Failed to fetch market products."
          );
        }
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setError("Error fetching seller data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  const filteredProducts = selectedBusiness
    ? marketProducts.filter((item) => {
        const businessIdFromItem = item.business?._id; 
        const carAdBusinessId =
          item.carAd?.businessCategory?._id || item.carAd?.businessCategory;
        const propertyAdBusinessId =
          item.propertyAd?.businessCategory?._id ||
          item.propertyAd?.businessCategory;

        return (
          businessIdFromItem === selectedBusiness ||
          carAdBusinessId === selectedBusiness ||
          propertyAdBusinessId === selectedBusiness
        );
      })
    : marketProducts;

  const productsPerPage = 4;
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );
  const currentTotalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setTotalPages(currentTotalPages);
  }, [filteredProducts, currentTotalPages]);

  

  if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-sm text-gray-500 font-inter">
          Loading seller business profile...
        </p>
      </section>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  const selectedBusinessData = businesses.find(
    (b) => b._id === selectedBusiness
  );

  const businessProfileImage =  selectedBusinessData?.profileImage || selectedBusinessData?.image;
    const profileImageUrl = businessProfileImage || null;
    const getProductImageUrl = (imagePath) => {
      if (!imagePath) return null;

      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          return imagePath;
      }
      const IMAGE_BASE_PATH_FOR_PRODUCTS = 'upload'; 
      return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${IMAGE_BASE_PATH_FOR_PRODUCTS}/${imagePath.replace(/\\/g, "/")}`;
    }

  console.log("Derived Profile Image URL for display:", profileImageUrl);
  console.log("Business Profile Image value from data:", businessProfileImage);

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-6 md:px-20 mt-20 md:mt-40">
      {/* Left Side */}
      <div className="flex flex-col gap-6 w-full md:w-[428px]">
        {/* Top Box */}
        <div className="bg-[#F7F7FF] border border-[#DFDFF9] rounded-[8px] p-4 h-[276px] w-full">
          <div className="flex gap-4">
            {/* Display Profile Image */}
             {profileImageUrl && (
              <Img
                src={profileImageUrl}
                alt="Business Profile"
                width={52}
                height={52}
                className="md:w-[52px] md:h-[52px] rounded-[30px] object-cover"
              />
            )}
            <div>
              <h2 className="text-[#000000] md:text-[18px] font-[500] font-inter">
                {selectedBusinessData?.businessName ||
                  (businesses.length > 0
                    ? businesses[0].businessName
                    : "No Business Name")}
              </h2>
              {/* Display Verification Status */}
              {selectedBusinessData?.isVerified && (
                <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] md:w-[93px] md:h-[16px] md:rounded-[2px]">
                  <Img
                    src="/profile.svg"
                    alt="Verified Icon"
                    width={10}
                    height={10}
                    className="w-[10px] h-[10px]"
                  />
                  <span className="md:text-[#238E15] font-[500] md:text-[10px] font-inter">
                    Verified User
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="mt-1 text-[#868686] font-inter font-[400] md:text-[12px]">
                  Last Seen 20h ago
                </span>
                <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
                  {" "}
                  {userProfile?.createdAt
                    ? `Joined Tenaly on ${new Date(
                        userProfile.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`
                    : "Joined Tenaly"}{" "}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              className="flex items-center justify-center
                gap-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] md:w-[404px]
                h-[52px] md:rounded-[8px] text-[#FFFFFF] md:text-[16px] font-inter font-[500]"
            >
              <Img
                src="/call.svg"
                alt="Call Icon"
                width={19.97}
                height={20}
                className="w-[24px] h-[24px]"
              />
              {userProfile?.phoneNumber ? `Call ${userProfile.phoneNumber}` : "Call"}
            </Button>
            <div className="mt-2">
              <MessageSellerButton sellerId={sellerId} />
            </div>
          </div>
        </div>

        {/* Bottom Box - Business Details */}
        <div className="bg-white border border-[#EDEDED] rounded-[8px] w-full h-auto p-4 space-y-6">
          {selectedBusinessData ? (
            <>
              {/* About Business */}
              {selectedBusinessData.aboutBusiness && (
                <div>
                  <p className="text-[#868686] text-[14px] font-[400] font-inter">
                    {selectedBusinessData.aboutBusiness}
                  </p>
                </div>
              )}

              {/* Addresses */}
              {selectedBusinessData.addresses?.length > 0 && (
                <div>
                  <ul className="space-y-6">
                    {selectedBusinessData.addresses.map((addr) => {
                      const relatedHours =
                        selectedBusinessData.businessHours?.find((hour) => {
                          const parsedHourAddress = parseBusinessHoursAddress(
                            hour.address
                          );
                          return parsedHourAddress === addr.address;
                        });

                      return (
                        <li
                          key={addr._id}
                          className="text-[#525252] text-sm space-y-2"
                        >
                          {/* Address Info */}
                          <div className="flex items-start gap-2">
                            <Img
                              src="/location.svg"
                              alt="Location Icon"
                              width={11.67}
                              height={16.67}
                              className="mt-1 w-[11.67px] h-[16.67px]"
                            />
                            <p className="text-[#525252] font-inter font-[500] text-[14px]">
                              {addr.address}
                            </p>
                          </div>

                          {/* Business Hours */}
                          {relatedHours && (
                            <div className="ml-5 space-y-1">
                              <h3 className="text-[#525252] font-medium font-[500] text-[12px] font-inter mb-1">
                                Working Hours
                              </h3>
                              <ul className="space-y-1">
                                <li className="flex justify-between text-sm text-[#525252]">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {relatedHours.days.map((day, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-[#F7F7FF] text-[#000087] text-[10px] md:text-[12px] font-[500] font-inter rounded-[4px] px-2 py-1"
                                      >
                                        {day.slice(0, 3)}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Img
                                      src="/greenClock.svg"
                                      alt="Clock Icon"
                                      width={16}
                                      height={16}
                                      className="mr-1"
                                    />
                                    <span className="text-[#238E15] text-[10px] font-[500] font-inter whitespace-nowrap">
                                      {relatedHours.openingTime} -{" "}
                                      {relatedHours.closingTime}
                                    </span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          )}
                          {/* Delivery Info */}
                          <div className="ml-5 mt-2 space-y-2">
                            {/* Delivery status box */}
                            {!addr.deliverySettings && (
                              <div className="flex items-center justify-center gap-2 bg-[#F7F7FF] border border-[#DFDFF9] w-[107px] h-[36px] rounded-[4px]">
                                <Img
                                  src="/truck.svg"
                                  alt="Delivery Icon"
                                  width={16}
                                  height={16}
                                  className="w-[16px] h-[16px]"
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    addr.deliveryAvailable
                                      ? "text-[#000087]"
                                      : "text-[#000087]"
                                  }`}
                                >
                                  {addr.deliveryAvailable
                                    ? "Available"
                                    : "No Delivery"}
                                </span>
                              </div>
                            )}

                            {/* Delivery settings box */}
                            {addr.deliveryAvailable &&
                              addr.deliverySettings && (
                                <div className="bg-[#F7F7FF] border border-[#DFDFF9] w-[204px] h-[50px] rounded-[4px] p-2 flex flex-col justify-center">
                                  <div className="text-[12px] font-[500] text-[#000087] font-inter">
                                    Delivery Available (
                                    {addr.deliverySettings.dayFrom} -{" "}
                                    {addr.deliverySettings.daysTo} days)
                                  </div>
                                  <div className="text-[12px] font-[400] text-[#000087] font-inter">
                                    Fee: ₦
                                    {addr.deliverySettings.feeFrom.toLocaleString()}{" "}
                                    - ₦
                                    {addr.deliverySettings.feeTo.toLocaleString()}
                                  </div>
                                </div>
                              )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              Select a business to see its details or no business found.
            </p>
          )}
        </div>
      </div>

      {/* Right Content - Products */}
      <div className="flex-1">
        <div className="flex gap-4 items-center px-4 overflow-x-auto rounded scrollbar-hide">
          {businesses.map((b) => (
            <div
              key={b._id}
              className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-md text-[14px] font-inter font-[500] ${
                selectedBusiness === b._id
                  ? "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                  : "bg-[#EDEDED] text-[#525252]"
              }`}
              onClick={() => {
                setSelectedBusiness(b._id);
                setPage(1); 
              }}
            >
              {b.businessName}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-0 sm:px-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mt-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item) => {
                const isCarAd = item.carAd && item.vehicleAd;
                const isPropertyAd = item.propertyAd;

                let adData = null;
                let displayAd = null;

                if (isCarAd) {
                  adData = item.vehicleAd;
                  displayAd = item.carAd;
                } else if (isPropertyAd) {
                  adData = item.propertyAd;
                  displayAd = item.carAd; 
                }

                if (!adData || !displayAd) return null;

                const adId = item.adId || displayAd._id;
                const title = isCarAd
                  ? `${adData.vehicleType || ""} ${adData.model || ""} ${adData.trim || ""} ${adData.year || ""}`.trim()
                  : adData.propertyName || "Untitled Property";
                const description = adData.description || "No description available";
                const price = adData.amount
                  ? `₦${adData.amount.toLocaleString()}`
                  : "Price not set";

                const displayImage = isCarAd
                  ? displayAd.vehicleImage?.[0]
                  : displayAd.propertyImage?.[0];
                const imageUrl = displayImage
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${displayImage.replace(/\\/g, "/")}`
                  : null;

                const location = displayAd.location || "Unknown";
                const plan = adData.plan;

                return (
                  <Link href="/Product-List" key={adId}>
                    <li className="bg-white text-left rounded-[12px] border border-[#EDEDED] overflow-hidden shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
                      {/* Image */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        {imageUrl && (
                          <Img
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-opacity duration-200"
                          />
                        )}

                        {plan && (
                          <div
                            className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                            style={{
                              backgroundImage: `url(${machineImage})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                              <Img
                                src="/medal-star1.svg"
                                alt="Plan"
                                width={24}
                                height={24}
                              />
                              <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase truncate">
                                {plan}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <span className="text-[#000087] font-inter font-semibold text-[16px] truncate block">
                          {price}
                        </span>

                        <h3 className="mt-1 text-[#525252] text-[14px] font-medium font-inter whitespace-nowrap overflow-hidden text-ellipsis">
                          {title}
                        </h3>

                        <p className="text-[#8C8C8C] text-[13px] font-inter mt-1 line-clamp-2 leading-snug">
                          {description}
                        </p>

                        <div className="flex flex-col mt-4 text-sm text-[#555] gap-[4px]">
                          <span className="flex items-center gap-2 text-[#8C8C8C] text-[13px] font-inter">
                            <Img
                              src="/location.svg"
                              alt="Location"
                              width={10}
                              height={14}
                            />
                            {location}
                          </span>

                          <div className="flex gap-2 mt-3 flex-wrap">
                            {/* Display car specific tags */}
                            {isCarAd && adData.carType && (
                              <Button className="bg-[#E8E8FF] rounded-[4px] text-[12px] py-1 px-2">
                                {adData.carType}
                              </Button>
                            )}
                            {isCarAd && adData.transmission && (
                              <Button className="bg-[#E8E8FF] rounded-[4px] text-[12px] py-1 px-2">
                                {adData.transmission}
                              </Button>
                            )}
                            {/* Display property specific tags */}
                            {!isCarAd && adData.propertyType && (
                              <Button className="bg-[#E8E8FF] rounded-[4px] text-[12px] py-1 px-2">
                                {adData.propertyType}
                              </Button>
                            )}
                            {!isCarAd && adData.propertyCondition && (
                              <Button className="bg-[#E8E8FF] rounded-[4px] text-[12px] py-1 px-2">
                                {adData.propertyCondition}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found for this business.
              </p>
            )}
          </ul>

          {/* Pagination controls */}
          <div className="mt-6 flex justify-end items-end gap-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm border ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#000087] border-[#000087] hover:bg-[#000087] hover:text-white"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: currentTotalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded-md text-sm border ${
                  page === i + 1
                    ? "bg-[#000087] text-white border-[#000087]"
                    : "bg-white text-[#000087] border-[#000087] hover:bg-[#000087] hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, currentTotalPages))
              }
              disabled={page === currentTotalPages}
              className={`px-4 py-2 rounded-md text-sm border ${
                page === currentTotalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#000087] border-[#000087] hover:bg-[#000087] hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}