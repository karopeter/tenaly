"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Img from "../components/Image";
import { useAuth } from "../context/AuthContext";
import api from "@/services/api";
import { SellerPhoneNumberBookmarked } from "../components/features/bookmarkPhone";
import MessageSellerButton from "../components/UI/messageSeller";

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

    // const fetchSellerPhone = async () => {
    //   try {
    //     const res = await api.get("/profile");
    //     if (res?.data?.phoneNumber) {
    //       setSellerPhone(res.data.phoneNumber);
    //     }
    //   } catch (err) {
    //     console.error("Error fetching seller phone number:", err);
    //   }
    // };

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
      {userAds.map(({ adId, carAd, vehicleAd, propertyAd }) => {
        // Determine images array and amount to display
        const images = carAd?.vehicleImage?.length
          ? carAd.vehicleImage
          : carAd?.propertyImage?.length
          ? carAd.propertyImage
          : [];

        const imageUrl = images.length > 0
          ? images[0]
          : "/placeholder-image.svg";
        
        const amount = vehicleAd?.amount || propertyAd?.amount || "N/A";

        const mainInfo = vehicleAd
          ? `${vehicleAd.vehicleType} ${vehicleAd.model}`
          : propertyAd
          ? propertyAd.propertyType || propertyAd.propertyName
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

              {(vehicleAd?.plan || propertyAd?.plan) && (
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
                      {(vehicleAd?.plan || propertyAd?.plan) ?? ""}
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
                    className="w-[24px] h-[24px] ml-2 block md:hidden"
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <div>
                    {/* The MessageSellerButton now receives all the necessary props */}
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
                  className="w-[35px] h-[35px] self-end sm:self-auto hidden md:block"
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}