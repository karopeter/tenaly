"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Img from "../components/Image";
import { useAuth } from "../context/AuthContext";
import api from "@/services/api";
import { SellerPhoneNumberBookmarked } from "../components/features/bookmarkPhone";
import MessageSellerButton from "../components/UI/messageSeller";
import { toast } from "react-toastify";

export default function BookMarkedContent({sellerId}) {
  const router = useRouter();
  const [userAds, setUserAds] = useState([]);
  const [error, setError] = useState("");
  const [adData, setAdData] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { openAuthModal, isLoggedIn, profile } = useAuth();
  const [sellerPhone, setSellerPhone] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const machineImage = "/machineGun.svg";

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const res = await api.get("/bookmark/get-all-bookmark");
        if (res.data.success) {
          setUserAds(res.data.data);
          setError("");
        } else {
          setError("Failed to load bookmarked ads.");
        }
      } catch (err) {
        setError("Error fetching bookmarked ads.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, []);

  useEffect(() => {
    if (!sellerId) return;

    const fetchSellerDetails = async () => {
      setLoading(true);
      setError(null);

       try {
         const response = await api.get(`/profile/seller/${sellerId}`);
         setSellerDetails(response.data);
       } catch(err) {
         console.error("Error fetching seller details:", err);
         setError(err.response?.data?.message || 'Failed to fetch seller details');
       } finally {
        setLoading(false);
       }
    };

    fetchSellerDetails();
  }, [sellerId]);

  useEffect(() => {
    const fetchAdAndProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const adRes = await api.get(`/products/get-marketById/${id}`);
        if (adRes.data.success) {
          setAdData(adRes.data.data);
        } else {
          setError(adRes.data.message || "Failed to fetch ad details.");
        }

        const profileRes = await api.get("/profile");
        setUserProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching ad or profile:", err);
        setError("Error loading ad details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdAndProfile();
  }, [id]);


  const handleUnbookmark = async (adId) => {
    try {
       const res = await api.delete(`/bookmark/delete-bookmark/${adId}`);
     if (res.data.success) {
       // Remove unbookmarked ad from state 
       setUserAds((prev) => prev.filter((ad) => ad.adId !== adId));
       toast.success("Ad unbookmarked successfully and deleted from bookmarked");
     } else {
      setError(res.data.message || "Failed to unbookmark ad");
     } 
    } catch (err) {
      console.error("Error unbookmarking ad:", err);
      toast.error("Error unbookmarking ad");
      setError("Server error while unbookmarking Ad.");
    }
  }

  if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading Bookmarks..</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!userAds.length) {
    return (
      <div className="bg-white w-full h-[490px] p-6 md:p-10 text-center shadow-phenom rounded-lg flex flex-col justify-center items-center">
        <Img
          src="/nonbookmarked.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No bookmarked"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No ads bookmarked yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {userAds.map(({ adId, carAd, vehicleAd, propertyAd, petAd, agricultureAd, kidAd, serviceAd, equipmentAd, gadgetAd, laptopAd, fashionAd, householdAd, beautyAd, isSold }) => {
        // Determine images array and amount to display
        const images = carAd?.vehicleImage?.length
          ? carAd.vehicleImage
          : carAd?.propertyImage?.length
          ? carAd.propertyImage
          : carAd?.petsImage?.length
          ? carAd.petsImage 
          : carAd?.agricultureImage?.length
          ? carAd.agricultureImage
          : carAd?.kidsImage?.length 
          ? carAd.kidsImage 
          : carAd?.serviceImage?.length
          ? carAd?.serviceImage
          : carAd?.equipmentImage?.length 
          ? carAd?.equipmentImage
          : carAd?.gadgetImage?.length
          ? carAd?.gadgetImage
          : carAd?.laptopImage?.length 
          ? carAd?.laptopImage
          : carAd?.fashionImage?.length 
          ? carAd?.fashionImage
          : carAd?.householdImage?.length 
          ? carAd?.householdImage
          : carAd?.beautyImage?.length 
          ? carAd?.beautyImage
          : [];

        const imageUrl = images.length > 0
          ? images[0]
          : "/placeholder-image.svg";
        
        const amount = vehicleAd?.amount || propertyAd?.amount || petAd?.amount || agricultureAd?.amount || kidAd?.amount || serviceAd?.amount || equipmentAd?.amount || gadgetAd?.amount ||  laptopAd?.amount || fashionAd?.amount || householdAd?.amount || beautyAd?.amount ||  "N/A";

        const mainInfo = vehicleAd
          ? `${vehicleAd.vehicleType} ${vehicleAd.model}`
          : propertyAd
          ? propertyAd.propertyType || propertyAd.propertyName
          : petAd
          ? `${petAd.petType} - ${petAd.breed}`
          : agricultureAd
          ? agricultureAd.title || agricultureAd.agricultureType?.[0]
          : kidAd
          ? kidAd.title || `${kidAd.gender} - ${kidAd.ageGroup}`
          : serviceAd 
          ? serviceAd.serviceTitle || serviceAd.serviceExperience
          : equipmentAd 
          ? equipmentAd.equipmentTitle || equipmentAd.powerSource
          : gadgetAd
          ? gadgetAd.gadgetTitle || gadgetAd.gadgetBrand
          : laptopAd 
          ? laptopAd.laptopTitle || laptopAd.laptopBrand
          : fashionAd
          ? fashionAd.fashionTitle || fashionAd.fashionType
          : householdAd
          ? householdAd.householdTitle || householdAd.householdType
          : beautyAd
          ? beautyAd.beautyTitle || beautyAd.beautyType
          : "";

        const location = carAd?.location || "";

        const detailItems = vehicleAd
          ? [
              {
                iconSrc: "/car.svg",
                text: vehicleAd.trim || "N/A",
              },
              {
                iconSrc: "/automatic.svg",
                text: vehicleAd.transmission || "N/A",
              },
              {
                iconSrc: "/meter.svg",
                text: vehicleAd.horsePower || "N/A",
              },
            ]
          : propertyAd
          ? [
              {
                iconSrc: "/cross-props.svg",
                text: propertyAd.propertyName || "N/A",
              },
              {
                iconSrc: "/cross-props.svg",
                text: propertyAd.propertyType || "N/A",
              },
              {
                iconSrc: "/cross-props.svg",
                text: propertyAd.squareMeter
                  ? `${propertyAd.squareMeter} sqm`
                  : "N/A",
              },
            ]
          : petAd 
           ? [
              { iconSrc: "/cross-props.svg", text: petAd.age || "N/A" },
              { iconSrc: "/cross-props.svg", text: petAd.breed || "N/A"},
              { iconSrc: "/cross-props.svg", text: petAd.gender || "N/A" }
           ]
           : agricultureAd 
           ? [
            { iconSrc: "/cross-props.svg", text: agricultureAd.unit || "N/A"},
            { iconSrc: "/cross-props.svg", text: agricultureAd.condition || "N/A"},
            { iconSrc: "/cross-props.svg", text: agricultureAd.agricultureType || "N/A" },
           ]
           : kidAd 
           ? [
            { iconSrc: "/cross-props.svg", text: kidAd.condition || "N/A" },
            { iconSrc: "/cross-props.svg", text: kidAd.color || "N/A" },
            { iconSrc: "/cross-props.svg", text: kidAd.ageGroup || "N/A" },
           ]
           : serviceAd
           ? [
              { iconSrc: "/cross-props.svg", text: serviceAd.serviceExperience || "N/A" },
              { iconSrc: "/cross-props.svg", text: serviceAd.serviceDuration || "N/A" },
               { iconSrc: "/cross-props.svg", text: serviceAd.pricingType || "N/A" },
            ]
          : equipmentAd 
          ? [
             { iconSrc: "/cross-props.svg", text: equipmentAd.equipmentTitle || "N/A" },
             { iconSrc: "/cross-props.svg", text: equipmentAd.powerSource || "N/A" },
             { iconSrc: "/cross-props.svg", text: equipmentAd.usageType || "N/A" },
          ]
          : gadgetAd 
          ? [
            { iconSrc: "/cross-props.svg", text: gadgetAd.gadgetTitle || "N/A" },
            { iconSrc: "/cross-props.svg", text: gadgetAd.gadgetBrand || "N/A" },
            { iconSrc: "/cross-props.svg", text: gadgetAd.storageCapacity || "N/A" }, 
          ]
          : laptopAd
          ? [
            { iconSrc: "/cross-props.svg", text: laptopAd.laptopTitle || "N/A" },
            { iconSrc: "/cross-props.svg", text: laptopAd.laptopBrand || "N/A" },
            { iconSrc: "/cross-props.svg", text: laptopAd.laptopOperating || "N/A" },
          ]
          : fashionAd 
          ? [
            { iconSrc: "/cross-props.svg", text: fashionAd.fashionTitle || "N/A" },
            { iconSrc: "/cross-props.svg", text: fashionAd.fashionType || "N/A" },
            { iconSrc: "/cross-props.svg", text: fashionAd.fashionBrand || "N/A" }
          ]
          : householdAd 
           ? [
            { iconSrc: "/cross-props.svg", text: householdAd.householdTitle || "N/A" },
            { iconSrc: "/cross-props.svg", text:  householdAd.householdType || "N/A" },
            { iconSrc: "/cross-props.svg", text: householdAd.householdBrand || "N/A" } 
           ]
           : beautyAd 
           ? [
             { iconSrc: "/cross-props.svg", text: beautyAd.beautyTitle || "N/A" },
            { iconSrc: "/cross-props.svg", text:  beautyAd.beautyType || "N/A" },
            { iconSrc: "/cross-props.svg", text:  beautyAd.beautyBrand || "N/A" } 
           ]
          : [];

        return (
          <div
            key={adId}
            className="bg-white border border-[#EDEDED] rounded-[12px] mb-5 
            flex flex-col md:flex-row h-auto w-full 
            max-w-[841px] overflow-hidden shadow-sm mt-20 md:mt-0"
          >
            <div className="relative w-full h-[200px] md:w-[300px] md:h-auto shrink-0 overflow-hidden">
              <Img
                src={imageUrl}
                alt={carAd?.category || "Product Image"}
                width={280}
                height={200}
                className="object-cover w-full h-full"
              />

              {/* Show SOLD badge if ad is sold */}
              {isSold && (
                <div className="absolute top-4 right-4 z-30">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                    SOLD
                  </div>
                </div>
              )}

              {/* Show plan badge if not sold */}
              {!isSold && (vehicleAd?.plan || propertyAd?.plan || petAd?.plan || agricultureAd?.plan || kidAd?.plan || serviceAd?.plan || equipmentAd?.plan || gadgetAd?.plan || laptopAd?.plan || fashionAd?.plan || householdAd?.plan || beautyAd?.plan) && (
                <div className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                    backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                    <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                    <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {vehicleAd?.plan || 
                       propertyAd?.plan || 
                       petAd?.plan || 
                       agricultureAd?.plan ||
                       kidAd?.plan ||  
                       serviceAd?.plan || 
                       equipmentAd?.plan ||
                       gadgetAd?.plan || 
                       laptopAd?.plan || 
                       fashionAd?.plan || 
                       householdAd?.plan ||
                       beautyAd?.plan || 
                      ""}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-2">
                <div className="flex items-center justify-between sm:block">
                  <div className="text-[15px] sm:text-[20px] font-[500] font-inter text-[#525252] leading-snug">
                    {mainInfo}
                  </div>
                  <Img
                    src="/bookmarkKnown.svg"
                    alt="Bookmarked"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px] cursor-pointer ml-2 block md:hidden"
                    onClick={() => handleUnbookmark(adId)}
                  />
                </div>
                <div className="text-[14px] sm:text-[18px] font-[500] font-inter text-[#000087]">
                  ₦{amount.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Img
                  src="/location.svg"
                  alt="Location icon"
                  width={10}
                  height={14}
                  className="w-[10px] h-[14px]"
                />
                <span className="text-[#8C8C8C] font-inter text-sm font-normal">
                  {location}
                </span>
              </div>

              <div className="flex gap-6 mb-3 flex-wrap">
                {detailItems.map(({ iconSrc, text }, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Img
                      src={iconSrc}
                      alt="icon"
                      width={24}
                      height={24}
                      className="w-[24px] h-[24px]"
                    />
                    <span className="text-[#525252] text-sm font-inter">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Conditional rendering based on isSold status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                {!isSold ? (
                  // Show contact buttons if NOT sold
                  <>
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                      <div>
                        <MessageSellerButton
                          sellerId={carAd?.userId}
                          productId={adId}
                          openAuthModal={openAuthModal}
                          productImage={imageUrl}
                          productTitle={mainInfo}
                        />
                      </div>
                      <SellerPhoneNumberBookmarked sellerId={carAd.userId} />
                    </div>

                    <Img
                      src="/bookmarkKnown.svg"
                      alt="Bookmarked"
                      width={35}
                      height={35}
                      className="w-[35px] h-[35px] self-end cursor-pointer sm:self-auto hidden md:block"
                      onClick={() => handleUnbookmark(adId)}
                    />
                  </>
                ) : (
                  // Show sold message and unbookmark only if SOLD
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex-1">
                      <p className="text-red-700 font-inter text-sm font-medium">
                        This item has been sold and is no longer available.
                      </p>
                    </div>

                    <Img
                      src="/bookmarkKnown.svg"
                      alt="Bookmarked"
                      width={35}
                      height={35}
                      className="w-[35px] h-[35px] self-end cursor-pointer sm:self-auto"
                      onClick={() => handleUnbookmark(adId)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}