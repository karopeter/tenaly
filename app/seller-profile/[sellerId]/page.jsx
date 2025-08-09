"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Link from "next/link";
import MessageSellerButton from "@/app/components/UI/messageSeller";
import Img from "@/app/components/Image";
import Button from "@/app/components/Button";
import { useParams } from "next/navigation";

export default function SellerProfile() {
  const params = useParams();
  const sellerId = params?.sellerId || params?.id;
  
  const [businessData, setBusinessData] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

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

  const fetchBusinessProducts = async (targetSellerId, pageNum = 1) => {
    if (!targetSellerId) return;

    try {
      setLoading(true);
      const response = await api.get(`/products/get-marketproduct-seller/${targetSellerId}/product?page=${pageNum}&limit=12`);

      if (response.data.success) {
        setMarketProducts(response.data.data);
        setPagination(response.data.pagination);

        if (response.data.data.length > 0) {
          setBusinessData(response.data.data[0].business);
        }
      } else {
        setError(response.data.message || "Failed to fetch business products");
      }
    } catch (err) {
      console.error("Error fetching business products:", err);
      setError("Error fetching business products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);

      try {
        const profileRes = await api.get("/profile");
        setUserProfile(profileRes.data);

        const actualSellerId = params?.sellerId || params?.id || sellerId;

        if (!actualSellerId) {
          setError("No seller ID provided");
          setLoading(false);
          return;
        }

        await fetchBusinessProducts(actualSellerId, 1);
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setError("Error fetching seller data. Please try again.");
        setLoading(false);
      }
    };

    if (params) {
      fetchSellerData();
    } else {
      setError("No URL parameters found");
      setLoading(false);
    }
  }, [params, sellerId]);

  const handlePageChange = async (newPage) => {
    const actualSellerId = params?.sellerId || params?.id || sellerId;
    setPage(newPage);
    await fetchBusinessProducts(actualSellerId, newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No business data found for this seller.</p>
        </div>
      </div>
    );
  }

  const businessProfileImage = businessData?.profileImage || businessData?.image;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {businessProfileImage ? (
                <Img
                  src={businessProfileImage}
                  alt="Business Profile"
                  width={120}
                  height={120}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">📦</span>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#000000] font-inter mb-2">
                    {businessData?.businessName || "Business Name"}
                  </h1>
                  
                  {businessData?.isVerified ? (
                   <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                       <path
                         fillRule="evenodd"
                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                         clipRule="evenodd"
                       />
                     </svg>
                     Verified Seller
                  </div>
                  ): (
                 <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM9 4a1 1 0 012 0v4a1 1 0 01-2 0V4zm0 8a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                   </svg>
                    Unverified Seller
                   </div>
                  )}

                  <div className="flex items-center gap-4 text-[#868686] font-[400]  font-inter mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{businessData?.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {businessData?.createdAt
                          ? `Joined ${new Date(businessData.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}`
                          : "Member since"}
                      </span>
                    </div>
                  </div>

                  {businessData?.aboutBusiness && (
                    <p className="text-[#868686]   max-w-2xl">
                      {businessData.aboutBusiness}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button className="bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </Button>
                  <MessageSellerButton sellerId={businessData?.userId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Business Details */}
          <div className="lg:w-80 space-y-6">
            {/* Business Hours & Address */}
            {businessData?.addresses?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 font-inter mb-4">Business Information</h3>
                <div className="space-y-4">
                  {businessData.addresses.map((addr) => {
                    const relatedHours = businessData.businessHours?.find((hour) => {
                      const parsedHourAddress = parseBusinessHoursAddress(hour.address);
                      return parsedHourAddress === addr.address;
                    });

                    return (
                      <div key={addr._id} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="font-medium text-[#525252] font-inter">{addr.address}</p>
                          </div>
                        </div>

                        {relatedHours && (
                          <div className="ml-8 space-y-2">
                            <h4 className="font-medium text-[#525252] font-inter text-sm">Working Hours</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {relatedHours.days.map((day, idx) => (
                                <span key={idx} className="bg-[#F7F7FF] text-[#000087] font-inter text-xs px-2 py-1 rounded-full">
                                  {day.slice(0, 3)}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#238E15]">
                              <Img 
                                src="/clock.svg"
                                alt="Opening clock"
                                width={16}
                                height={16}
                              />
                              {relatedHours.openingTime} - {relatedHours.closingTime}
                            </div>
                          </div>
                        )}

                        {/* Delivery Information */}
                        <div className="ml-8">
                          <div className="inline-flex items-center gap-2 bg-[#F7F7FF] text-[#000087] border border-[#DFDFF9] px-3 py-1.5 rounded-lg text-sm">
                             <Img 
                               src="/truck.svg"
                               alt="Delivery Truck"
                               width={16} 
                               height={16}
                               />
                            <span>{addr.deliveryAvailable ? 'Delivery Available' : 'No Delivery'}</span>
                          </div>
                          
                          {addr.deliveryAvailable && addr.deliverySettings && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Delivery: {addr.deliverySettings.dayFrom}-{addr.deliverySettings.daysTo} days</p>
                              <p>Fee: ₦{addr.deliverySettings.feeFrom?.toLocaleString()} - ₦{addr.deliverySettings.feeTo?.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Products */}
          <div className="flex-1">
            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-600">{marketProducts.length} products available</p>
              </div>
            </div>

            {/* Products Grid */}
            {marketProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketProducts.map((item) => {
                  const isCarAd = item.carAd && item.vehicleAd;
                  const isPropertyAd = item.carAd && item.propertyAd;

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
                    : adData.propertyName || "Property";
                  
                  const description = adData.description || "No description available";
                  const price = adData.amount ? `₦${adData.amount.toLocaleString()}` : "Price not set";
                  
                  const displayImage = isCarAd
                    ? displayAd.vehicleImage?.[0]
                    : displayAd.propertyImage?.[0];
                  const imageUrl = displayImage
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${displayImage.replace(/\\/g, "/")}`
                    : null;

                  const location = displayAd.location || "Location not specified";
                  const plan = adData.plan;

                  return (
                    <Link href={`/Product-List/${adId}`} key={adId}>
                      <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {imageUrl ? (
                            <Img
                              src={imageUrl}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-4xl text-gray-400">📷</span>
                            </div>
                          )}
                          
                          {/* Plan Badge */}
                          {plan && (
                            <div className="absolute top-3 left-3">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {plan}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                           <p className="text-2xl font-bold text-[#000087] font-inter mb-1">
                            {price}
                          </p>
                          </div>
                           <h3 className="font-semibold text-[#525252] font-inter text-lg line-clamp-1">
                              {title}
                            </h3>
                        

                          <p className="text-[#8C8C8C] font-inter text-sm line-clamp-2 mb-4">
                            {description}
                          </p>

                          <div className="flex items-center gap-1 text-[#8C8C8C] font-inter text-sm mb-4">
                             <Img src="/location.svg" alt="Location" width={10} height={14} />
                            <span>{location}</span>
                          </div>

                          {/* Tags */}
                          <div className="flex gap-2 flex-wrap">
                            {isCarAd && adData.carType && (
                              <span className="bg-[#E8E8FF]  font-inter text-[#525252] px-2 py-1 rounded text-xs">
                                {adData.carType}
                              </span>
                            )}
                            {isCarAd && adData.transmission && (
                              <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                                {adData.transmission}
                              </span>
                            )}
                            {isPropertyAd && adData.propertyType && (
                              <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                                {adData.propertyType}
                              </span>
                            )}
                            {isPropertyAd && adData.ownershipStatus && (
                              <span className="bg-[#E8E8FF]  font-inter text-[#525252] px-2 py-1 rounded text-xs">
                                {adData.ownershipStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-xl text-gray-600">No products found</p>
                <p className="text-gray-500">This seller hasn't listed any products yet.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !pagination.hasPrevPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border shadow-sm"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        page === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border shadow-sm"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !pagination.hasNextPage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border shadow-sm"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}