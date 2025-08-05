"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../components/navbar/sidebar";
import Img from "../components/Image";
import { useAuth } from "../context/AuthContext";
import api from "@/services/api";

export default function Bookmarked() {
  const router = useRouter();
  const [userAds, setUserAds] = useState([]);
  const [error, setError] = useState("");
    const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { openAuthModa, isLoggedIn, profile } = useAuth();
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

     const fetchSellerPhone = async () => {
      try {
        const res = await api.get("/profile");
        if (res?.data?.phoneNumber) {
          setSellerPhone(res.data.phoneNumber);
        }
      } catch (err) {
        console.error("Error fetching seller phone number:", err);
      }
    };

    fetchUserAds();
    fetchSellerPhone();
  }, []);

    useEffect(() => {
      const fetchAdAndProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          if (!id) {
            setLoading(false);
            return;
          }
  
          // Fetch the ad details (should now include the 'business' object)
          const adRes = await api.get(`/products/get-marketById/${id}`);
          if (adRes.data.success) {
            setAdData(adRes.data.data);
          } else {
            setError(adRes.data.message || "Failed to fetch ad details.");
          }
  
          // Fetch user profile (for bookmarking, etc.)
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
    }, [id]); // Re-fetch if 'id' changes
  

   if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      <p className="mt-2 text-sm text-gray-500 font-inter">Loading Bookmarks..</p>
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
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-auto">
            <Sidebar />
          </div>

          <main className="flex-1 mt-6 md:mt-0">
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
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-auto">
          <Sidebar />
        </div>

        {/* Main */}
        <main className="flex-1 mt-6 md:mt-0 space-y-6">
          {userAds.map(({ adId, carAd, vehicleAd, propertyAd }) => {
            // Determine images array and amount to display
            const images = carAd?.vehicleImage?.length
              ? carAd.vehicleImage
              : carAd?.propertyImage?.length
              ? carAd.propertyImage
              : [];

            const imageUrl =
              images.length > 0
                ? `${backendUrl}/${images[0].replace(/\\/g, "/")}`
                : "/placeholder-image.svg";

            // Determine product amount
            const amount =
              vehicleAd?.amount || propertyAd?.amount || "N/A";

            // Vehicle or Property main info text
            const mainInfo = vehicleAd
              ? `${vehicleAd.vehicleType} ${vehicleAd.model}`
              : propertyAd
              ? propertyAd.propertyType || propertyAd.propertyName
              : "";

            // Location
            const location = carAd?.location || "";

            // Details flex items:
            // For vehicleAd: trim, transmission, horsepower
            // For propertyAd: propertyName, propertyType, squareMeter

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

           // const sellerPhone = carAd?.userPhone || vehicleAd?.userPhone || propertyAd?.userPhone || "";

            return (
              <div
                key={adId}
                className="bg-white border border-[#EDEDED] rounded-[12px] flex flex-col md:flex-row h-auto max-w-[841px] overflow-hidden shadow-sm"
              >
                {/* Image on left */}
                <div className="relative w-full h-[200px] md:w-[300px] md:h-auto shrink-0 overflow-hidden">
                  <Img
                    src={imageUrl}
                    alt={carAd?.category || "Product Image"}
                     width={280}
                     height={200}
                    className="object-cover w-full h-full"/>

                    {/* Plan Badge */}
                    {(vehicleAd?.plan || propertyAd?.plan) && (
                      <div className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                       style={{
                         backgroundImage: `url(${machineImage})`,
                         backgroundSize: "cover",
                         backgroundPosition: "center",
                      }}>
                        <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                           <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                           <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                             {(vehicleAd?.plan || propertyAd?.plan) ?? ""}
                           </span>
                        </div>
                     </div>
                    )}
                </div>

                {/* Right content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
  {/* Top Row: mainInfo + bookmark (mobile), and amount */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-2">
    
    {/* mainInfo + bookmark icon (mobile only) */}
    <div className="flex items-center justify-between sm:block">
      <div className="text-[15px] sm:text-[20px] font-[500] font-inter text-[#525252]">
        {mainInfo}
      </div>
      {/* Bookmark icon - mobile only */}
      <Img 
        src="/bookmarkKnown.svg"
        alt="Bookmarked"
        width={24}
        height={24}
        className="w-[24px] h-[24px] ml-2 block md:hidden"
      />
    </div>

    {/* Amount */}
    <div className="text-[14px] sm:text-[18px] font-[500] font-inter text-[#000087]">
      ₦{amount.toLocaleString()}
    </div>
  </div>

  {/* Location */}
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

  {/* Detail Items */}
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

  {/* Buttons + Desktop Bookmark */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
    {/* Buttons group */}
    <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto">
      <button 
        className="border border-[#CDCDD7] text-[#525252] 
          h-[45px] flex-1 flex items-center whitespace-nowrap justify-center px-4 py-2 rounded-[4px] 
          font-inter font-[400] text-sm transition">
        Send Message
      </button>
      <a
        href={`tel:${sellerPhone}`}
        className="bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white 
          h-[45px] flex-1 flex items-center justify-center px-4 py-2 rounded-md 
          font-inter text-sm hover:bg-[#444444] transition"
      >
        {sellerPhone || "No Phone"}
      </a>
    </div>

    {/* Desktop Bookmark icon */}
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
        </main>
      </div>
    </div>
  );
}
