"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { FiEye, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import api from "@/services/api";
import Img from "../components/Image";
import { toast } from "react-toastify";

export default function ViewVehicleAdd() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [ads, setAds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMenu, setShowMenu] = useState(null);
  const machineImage = "/machineGun.svg";

  useEffect(() => {
    const fetchBusinesses = async () => {
      const res = await api.get("/business/my-businesses");
      setBusinesses(res.data);
      if (res.data.length > 0) {
        setSelectedBusiness(res.data[0]._id);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!selectedBusiness) return;
    const fetchAds = async () => {
      const res = await api.get(
        `/vehicles/ads/combined-vehicle?businessId=${selectedBusiness}&page=${page}&limit=4`
      );
      setAds(res.data.data);
      setTotalPages(res.data.totalPages);
    };
    fetchAds();
  }, [selectedBusiness, page]);

  // const handleDelete = async (vehicleId) => {
  //   const confirmed = window.confirm("Are you sure you want to delete this vehicle ad?");
  //   if (!confirmed) return;

  //   try {
  //     await api.delete(`/vehicles/delete-vehicle/${vehicleId}`);
  //     setAds((prev) => prev.filter(({ vehicleAd }) => vehicleAd._id !== vehicleId));
  //     toast.success("Vehicle ad deleted successfully.");
  //   } catch (error) {
  //     console.error("Delete error:", error.message);
  //     toast.error("Failed to delete ad.");
  //   }
  // };

const handleDelete = async (adId) => {
  const confirmed = window.confirm("Are you sure you want to delete this ad?");
  if (!confirmed) return;

  try {
    await api.delete(`/vehicles/delete-vehicle/${adId}`);
    setAds((prev) =>
      prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
    );
    toast.success("Vehicle ad deleted successfully.");
  } catch (vehicleError) {
    console.warn("Vehicle ad delete failed, trying car ad...");

    try {
      await api.delete(`/carAdd/delete-car-ad/${adId}`);
      setAds((prev) =>
        prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
      );
      toast.success("Car ad deleted successfully.");
    } catch (carError) {
      console.error("Delete error:", carError.message);
      toast.error("Failed to delete ad.");
    }
  }
};


  return (
    <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
      <div className="flex flex-col md:flex-row gap-10">
        <Sidebar />
        <main className="flex-1">
          <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-8">
            <div className="flex flex-row justify-between  items-center">
              <h3 className="text-[#525252] font-[500] font-inter text-[16px] md:text-[24px]">
                My Vehicle Ads
              </h3>
              <Button
                onClick={() => router.push("/Add")}
                className="w-[115px] md:w-[197px] flex items-center justify-center whitespace-nowrap h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] rounded-[8px] text-white"
              >
                Post an Ad
              </Button>
            </div>

            <div className="bg-[#FAFAFA] w-full h-auto md:h-[44px] mt-4 flex gap-4 items-center px-4 overflow-x-auto rounded scrollbar-hide">
              {businesses.map((b) => (
                <div
                  key={b._id}
                  className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-md text-[14px] font-inter font-[500] ${
                    selectedBusiness === b._id
                      ? "bg-[#CDCDD7] text-[#525252] border border-[#EDEDED]"
                      : "bg-transparent text-[#525252]"
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

            <div className="mt-5">
              {ads.length === 0 ? (
                <p className="text-gray-500">No vehicle ads for this business</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {ads.map(({ adId, carAd, vehicleAd }) => {
                      const businessId =
                      carAd?.businessCategory?._id || vehicleAd?.businessCategory;
                    const vehicleId = vehicleAd?._id;

                    return (
                      <div
                        key={adId}
                        className="flex flex-col md:flex-row justify-between gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
                      >
                        <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                          {carAd?.vehicleImage?.length > 0 && (
                            <Img
                              src={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/" +
                                carAd.vehicleImage[0].replace(/\\/g, "/")
                              }
                              alt="Ad"
                              width={340}
                              height={210}
                              className="w-full h-full object-cover"
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
                                ₦
                                {vehicleAd?.amount
                                  ? vehicleAd.amount.toLocaleString()
                                  : "Amount not set"}
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
                                        router.push(
                                          `/ads/Vehicles/${businessId}/${adId}/${vehicleId}`
                                        );
                                      }
                                    }}
                                  >
                                    <FiEye className="mr-2" /> View Details
                                  </button>

                                  <button
                                    className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                    onClick={() => {
                                      setShowMenu(null);
                                      handleDelete(vehicleAd?._id || carAd?._id);
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
                            <span className="text-[#FDBA40] text-[14px] font-[500] font-inter">
                              Awaiting approval
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

        <div className="flex flex-row justify-between items-center gap-4 mt-6">
         <Button
           disabled={page === 1}
           onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border flex justify-center items-center border-gray-300 rounded w-full sm:w-auto">
          Previous
        </Button>
        <span className="text-sm sm:text-base whitespace-nowrap">
          Page {page} of {totalPages}
       </span>
       <Button
         disabled={page === totalPages}
         onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto">
        Next
      </Button>
      </div>
      </div>
      </main>
      </div>
    </div>
  );
}
