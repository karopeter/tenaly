"use client";
import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { FiEye, FiTrash2, FiMoreHorizontal, FiCheck } from "react-icons/fi";
import Img from "../components/Image";
import Button from "../components/Button";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AddCarPostContent() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [vehicleAds, setVehicleAds] = useState([]);
  const [propertyAds, setPropertyAds] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles'); 
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessesLoaded, setBusinessesLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [markingSold, setMarkingSold] = useState(null);
  const machineImage = "/machineGun.svg";

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        setBusinesses(res.data);
        if (res.data.length > 0) {
          setSelectedBusiness(res.data[0]._id);
        }
        setBusinessesLoaded(true);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        // Don't set error for business fetch failure - just treat as no businesses
        setBusinesses([]);
        setBusinessesLoaded(true);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!businessesLoaded) return;
    
    // If no businesses or no selected business, stop loading
    if (businesses.length === 0 || !selectedBusiness) {
      setLoading(false);
      setAdsLoaded(true);
      return;
    }
    
    const fetchAllAds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized");
        setLoading(false);
        setAdsLoaded(true);
        return;
      }

      try {
        // Fetch vehicle ads
        const vehicleRes = await api.get(
          `/vehicles/ads/combined-vehicle?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setVehicleAds(vehicleRes.data.data || []);

        // Fetch property ads
        const propertyRes = await api.get(
          `/property/ads/combined-property?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setPropertyAds(propertyRes.data.data || []);

        setAdsLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ads:", err);
        // Only set error for critical auth issues
        if (err.response?.status === 401) {
          setError("Not authorized - please log in");
        } else {
          // For other API errors, just treat as no ads available
          console.warn("API error, treating as no ads:", err.message);
        }
        setAdsLoaded(true);
        setLoading(false);
      }
    };

    fetchAllAds();
  }, [selectedBusiness, businessesLoaded, businesses.length]);

  const handleVehicleDelete = async (adId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/delete-vehicle/${adId}`);
      setVehicleAds((prev) =>
        prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
      );
      toast.success("Vehicle ad deleted successfully.");
    } catch (vehicleError) {
      console.warn("Vehicle ad delete failed, trying car ad...");
      try {
        await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setVehicleAds((prev) =>
          prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
        );
        toast.success("Car ad deleted successfully.");
      } catch (carError) {
        console.error("Delete error:", carError.message);
        toast.error("Failed to delete ad.");
      }
    }
  };

  const handlePropertyDelete = async (adId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmed) return;

    try {
      await api.delete(`/property/delete-property/${adId}`);
      setPropertyAds((prev) =>
        prev.filter(({ propertyAd, carAd }) => (propertyAd?._id || carAd?._id) !== adId)
      );
      toast.success("Property ad deleted successfully.");
    } catch (propertyError) {
      console.warn("Property ad delete failed, trying car ad...");
      try {
        await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setPropertyAds((prev) =>
          prev.filter(({ propertyAd, carAd }) => (propertyAd?._id || carAd?._id) !== adId)
        );
        toast.success("Car ad deleted successfully.");
      } catch (carError) {
        console.error("Delete error:", carError.message);
        toast.error("Failed to delete ad.");
      }
    }
  };

const handleMarkVehicleAsSold = async (vehicleId, carAdId) => {
  const confirmed = window.confirm("Are you sure you want to mark this vehicle as sold?");
  if (!confirmed) return;

  try {
    setMarkingSold(vehicleId);
    setShowMenu(null);

    await api.patch(`/vehicles/mark-vehicle-as-sold/${vehicleId}`);

    if (carAdId) {
      try {
        await api.delete(`/carAdd/delete-car-ad/${carAdId}`);
      } catch (delErr) {
        console.warn("Failed to delete linked carAd:", delErr);
      }
    }

    setVehicleAds((prev) =>
      prev.map(({ adId, carAd, vehicleAd }) =>
        vehicleAd?._id === vehicleId
          ? { adId, carAd: null, vehicleAd: { ...vehicleAd, status: "sold" } }
          : { adId, carAd, vehicleAd }
      )
    );

    toast.success("Vehicle marked as sold.");
  } catch (error) {
    console.error("Error marking vehicle as sold:", error);
    const message =
      error?.response?.data?.message || error?.message || "Failed to mark vehicle as sold.";
    toast.error(message);
  } finally {
    setMarkingSold(null);
  }
};

  const handleMarkPropertyAsSold = async (propertyId, carAdId) => {
  const confirmed = window.confirm("Are you sure you want to mark this property as sold?");
  if (!confirmed) return;

  setMarkingSold(propertyId);
  setShowMenu(null);

  try {
    console.log("Marking property as sold with propertyId:", propertyId);

    // call API to mark property as sold
    const response = await api.patch(`/property/mark-property-as-sold/${propertyId}`);

    // if there is a linked carAd, delete it (optional - remove if not desired)
    if (carAdId) {
      try {
        await api.delete(`/carAdd/delete-car-ad/${carAdId}`);
      } catch (delErr) {
        console.warn("Failed to delete linked carAd:", delErr);
        // not fatal — continue
      }
    }

    // update local state so UI reflects "sold"
    setPropertyAds((prev) =>
      prev.map(({ adId, carAd, propertyAd }) =>
        propertyAd?._id === propertyId
          ? { adId, carAd: null, propertyAd: { ...propertyAd, status: "sold" } }
          : { adId, carAd, propertyAd }
      )
    );

    toast.success("Property marked as sold.");
  } catch (error) {
    console.error("Error marking property as sold:", error);
    const message =
      error?.response?.data?.message || error?.message || "Failed to mark property as sold.";
    toast.error(message);
  } finally {
    setMarkingSold(null);
  }
};

  const totalAds = vehicleAds.length + propertyAds.length;

  return (
    <div className="p-4 md:p-8 rounded-[12px] bg-white shadow-phenom">
      {/* Loading state - only show when actually loading */}
      {loading && !adsLoaded && (
         <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading Ads..</p>
        </div>
      </section>
      )}

      {/* Error state - only for critical errors like auth issues */}
      {error && !loading && (
        <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
          <p className="text-red-500 text-sm md:text-base mb-4">{error}</p>
          <div className="mt-4">
            <Link href="/create-add" passHref>
              <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]">
                <Plus size={20} /> Post an Ad
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* No ads state - show when not loading, no error, and no total ads */}
      {!loading && !error && adsLoaded && totalAds === 0 && (
        <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
          <Img
            src="/postAds.svg"
            width={158}
            height={158}
            className="mx-auto mb-4"
            alt="No Posts"
          />
          <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
            No ads posted yet
          </p>
          <div className="flex justify-center">
            <Link href="/create-add" passHref>
              <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
                <Plus size={20} /> Post an Ad
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Existing ads state - display actual ads */}
      {!loading && !error && adsLoaded && totalAds > 0 && (
        <div>
          {/* Header */}
          <div className="flex flex-row justify-between items-center mb-4">
            <h3 className="text-[#525252] font-[500] font-inter text-[16px] md:text-[24px]">
              My Ads
            </h3>
            <Button
              onClick={() => router.push("/create-add")}
              className="w-[115px] md:w-[197px] flex items-center justify-center whitespace-nowrap h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] rounded-[8px] text-white"
            >
              Post an Ad
            </Button>
          </div>

          {/* Business selector */}
          <div className="bg-[#FAFAFA] w-full h-auto md:h-[44px] mt-4 flex gap-4 items-center px-4 overflow-x-auto rounded scrollbar-hide">
            {businesses.map((b) => (
              <div
                key={b._id}
                className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-md text-[14px] font-inter font-[500] ${
                  selectedBusiness === b._id
                    ? "bg-[#CDCDD7] text-[#525252] border border-[#EDEDED]"
                    : "bg-transparent text-[#525252]"
                }`}
                onClick={() => setSelectedBusiness(b._id)}
              >
                {b.businessName}
              </div>
            ))}
          </div>

          {/* Tab selector */}
          <div className="flex gap-4 mt-4 border-b border-[#EDEDED]">
            <button
              className={`px-4 py-2 font-inter font-[500] text-[14px] border-b-2 transition-colors ${
                activeTab === 'vehicles'
                  ? "border-[#00A8DF] text-[#00A8DF]"
                  : "border-transparent text-[#525252] hover:text-[#00A8DF]"
              }`}
              onClick={() => setActiveTab('vehicles')}
            >
              Vehicle Ads ({vehicleAds.length})
            </button>
            <button
              className={`px-4 py-2 font-inter font-[500] text-[14px] border-b-2 transition-colors ${
                activeTab === 'properties'
                  ? "border-[#00A8DF] text-[#00A8DF]"
                  : "border-transparent text-[#525252] hover:text-[#00A8DF]"
              }`}
              onClick={() => setActiveTab('properties')}
            >
              Property Ads ({propertyAds.length})
            </button>
          </div>

          {/* Vehicle Ads */}
          {activeTab === 'vehicles' && (
            <div className="mt-5">
              {vehicleAds.length === 0 ? (
                <p className="text-gray-500">No vehicle ads for this business</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {vehicleAds.map(({ adId, carAd, vehicleAd }) => {
                    const businessId = carAd?.businessCategory?._id || vehicleAd?.businessCategory;
                    const vehicleId = vehicleAd?._id;

                    return (
                      <div
                        key={adId}
                        className="flex flex-col md:flex-row justify-between gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
                      >
                        <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                          {carAd?.vehicleImage?.length > 0 && (
                            <Img
                              src={carAd.vehicleImage[0]}
                              alt="Ad"
                              width={340}
                              height={210}
                              className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                            />
                          )}

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
                        </div>

                        <div className="flex-1 flex flex-col p-2">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex-1">
                              <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                {vehicleAd?.vehicleType} {vehicleAd?.model} {vehicleAd?.trim}{" "}
                                {vehicleAd?.year} {vehicleAd?.color}
                              </h4>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                                ₦{vehicleAd?.amount ? vehicleAd.amount.toLocaleString() : "Amount not set"}
                              </div>
                            </div>
                          </div>

                          <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                            {vehicleAd?.description || "No description provided"}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <Img src="/location.svg" alt="Location" width={10} height={13} />
                            <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                              {carAd?.location || "Location not specified"}
                            </span>
                          </div>

                          <div className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                            <div className="flex flex-wrap gap-3 mt-2">
                              {vehicleAd?.carType && (
                                <div className="flex items-center gap-2">
                                  <Img src="/car.svg" width={24} height={24} />
                                  <span className="text-[#868686] text-[12px] font-inter">
                                    {vehicleAd.carType}
                                  </span>
                                </div>
                              )}
                              {vehicleAd?.transmission && (
                                <div className="flex items-center gap-2">
                                  <Img src="/automatic.svg" width={24} height={24} />
                                  <span className="text-[#868686] text-[12px] font-inter">
                                    {vehicleAd.transmission}
                                  </span>
                                </div>
                              )}
                              {vehicleAd?.horsePower && (
                                <div className="flex items-center gap-2">
                                  <Img src="/meter.svg" width={24} height={24} />
                                  <span className="text-[#868686] text-[12px] font-inter">
                                    {vehicleAd.horsePower}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <button
                                className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                                onClick={() =>
                                  setShowMenu((prev) => (prev === adId ? null : adId))
                                }
                              >
                                <FiMoreHorizontal size={20} />
                              </button>

                              {showMenu === adId && (
                                <div className="absolute right-0 top-full mt-2 w-40 z-50 bg-white border border-[#EDEDED] rounded shadow-lg">
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF]"
                                    onClick={() => {
                                      setShowMenu(null);
                                      if (businessId && adId && vehicleId) {
                                        router.push(`/ads/Vehicles/${businessId}/${adId}/${vehicleId}`);
                                      }
                                    }}
                                  >
                                    <FiEye className="mr-2" /> View Details
                                  </button>

                                  {vehicleAd?.status !== 'sold' && (
                                    <button
                                      className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF]"
                                      onClick={() => handleMarkVehicleAsSold(vehicleAd?._id, carAd?._id)}
                                    >
                                      <FiCheck className="mr-2" /> Mark As Sold
                                    </button>
                                  )}

                                  <button
                                    className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                    onClick={() => {
                                      setShowMenu(null);
                                      handleVehicleDelete(vehicleAd?._id || carAd?._id);
                                    }}
                                  >
                                    <FiTrash2 className="mr-2" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Img src="/approval.svg" alt="Approval" width={18} height={21} />
                            <span
                              className={`text-[14px] font-[500] font-inter ${
                              vehicleAd?.status === "sold"
                                ? "text-[#10B981]" 
                                : vehicleAd?.status === "rejected"
                                ? "text-[#EF4444]" 
                                : "text-[#FDBA40]" 
                              }`}>
                            {vehicleAd?.status === "sold"
                              ? "SOLD"
                               : vehicleAd?.status === "pending"
                               ? "Awaiting approval"
                               : vehicleAd?.status === "rejected"
                               ? "Rejected"
                               : "Unknown"}
                             </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Property Ads */}
          {activeTab === 'properties' && (
            <div className="mt-5">
              {propertyAds.length === 0 ? (
                <p className="text-gray-500">No property ads for this business</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {propertyAds.map(({ adId, carAd, propertyAd }) => {
                    const businessId = carAd?.businessCategory?._id || propertyAd?.businessCategory;
                    const propertyId = propertyAd?._id;
                    const isMarkingSold = markingSold === adId;

                    return (
                      <div
                        key={adId}
                        className="flex flex-col md:flex-row justify-between gap-2 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
                      >
                        <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                          {carAd?.propertyImage?.length > 0 && (
                            <Img
                              src={carAd.propertyImage[0]}
                              alt="Ad"
                              width={340}
                              height={210}
                              className="w-full h-[160px] md:h-[210px] object-cover rounded-[8px]"
                            />
                          )}

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

                        <div className="flex-1 flex flex-col p-2">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex-1">
                              <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                {propertyAd?.propertyName || "N/A"} - {propertyAd?.propertyType || "N/A"}
                              </h4>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                                ₦{propertyAd?.amount ? propertyAd.amount.toLocaleString() : "Amount not set"}
                              </div>
                            </div>
                          </div>

                          <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words line-clamp-2">
                            {propertyAd?.description || "No description provided"}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <Img src="/location.svg" alt="Location" width={10} height={13} />
                            <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                              {carAd?.location || "Location not specified"}
                            </span>
                          </div>

                          <div className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                            <div className="flex flex-wrap gap-3 mt-2">
                              {propertyAd?.furnishing && (
                                <div className="flex items-center gap-2">
                                  <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                  <span className="text-[#868686] text-[12px] font-inter">
                                    {propertyAd?.furnishing}
                                  </span>
                                </div>
                              )}
                              {propertyAd?.squareMeter && (
                                <div className="flex items-center gap-2">
                                  <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                  <span className="whitespace-nowrap text-[#868686] text-[12px] font-inter">
                                    {propertyAd?.squareMeter}(sqm)
                                  </span>
                                </div>
                              )}
                              {propertyAd?.propertyType && (
                                <div className="flex items-center gap-2">
                                  <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                  <span className="text-[#868686] text-[12px] font-inter whitespace-nowrap">
                                    {propertyAd?.propertyType}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <button
                                className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                                onClick={() =>
                                  setShowMenu((prev) => (prev === adId ? null : adId))
                                }
                              >
                                <FiMoreHorizontal size={20} />
                              </button>

                              {showMenu === adId && (
                                <div className="absolute right-0 top-full mt-2 w-40 z-50 bg-white border border-[#EDEDED] rounded shadow-lg">
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF]"
                                    onClick={() => {
                                      setShowMenu(null);
                                      if (businessId && adId && propertyId) {
                                        router.push(`/ads/Property/${businessId}/${adId}/${propertyId}`);
                                      }
                                    }}
                                  >
                                    <FiEye className="mr-2" /> View Details
                                  </button>

                                  {propertyAd?.status !== 'sold' && (
                                    <button
                                    className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF]"
                                      onClick={() => handleMarkPropertyAsSold(propertyAd?._id, carAd?._id)}
                                      disabled={markingSold === adId}  
                                      >
                                      {markingSold === adId ? <Spinner/> : <><FiCheck className="mr-2" /> Mark As Sold</>}
                                    </button>
                                  )}

                                  <button
                                    className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                    onClick={() => {
                                      setShowMenu(null);
                                      handlePropertyDelete(propertyAd?._id || carAd?._id);
                                    }}
                                  >
                                    <FiTrash2 className="mr-2" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <Img src="/approval.svg" alt="Approval" width={18} height={21} />
                            <span className={`text-[14px] font-[500] font-inter ${
                              propertyAd?.status === 'sold' 
                              ? 'text-[#10B981]' 
                              : propertyAd?.status === 'rejected'
                              ? 'text-[#EF4444]'
                              :  'text-[#FDBA40]'
                            }`}>
                              {propertyAd?.status === "sold" 
                              ? "SOLD" 
                              : propertyAd?.status === "pending"
                              ? "Awaiting Approval"
                              : propertyAd?.status === "rejected"
                              ? "Rejected"
                              : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
