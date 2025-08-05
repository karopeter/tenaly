"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Img from "@/app/components/Image";
import Button from "@/app/components/Button";
import api from "@/services/api";
import SignUpModal from "@/app/hooks/signup-modal";
import MessageSellerButton from "@/app/components/UI/messageSeller";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

export default function HomeListDetails() {
 const [activeTab, setActiveTab] = useState("car");
  const [showInput, setShowInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [adData, setAdData] = useState(null);
  const [showDetails, setShowDetails] = useState(false); 
  const [userProfile, setUserProfile] = useState(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { openAuthModal, isLoggedIn, profile } = useAuth();

   const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/${imagePath.replace(/\\/g, "/")}`;
  };

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

 
  useEffect(() => {
    if (id && userProfile) { 
      const checkBookmark = async () => {
        try {
          const res = await api.get(`/bookmark/bookmark-status/${id}/status`);
          if (res.data.success) {
            setIsBookmarked(res.data.bookmarked);
          }
        } catch (err) {
          console.error("Error checking bookmark status:", err);
        }
      };
      checkBookmark();
    }
  }, [id, userProfile]); 

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      setShowSignUpModal(true); 
      return;
    }

    try {
      setBookmarkLoading(true);
      const res = await api.post(`/bookmark/bookmarkAd/${id}`);
      if (res.data.success) {
        setIsBookmarked(true);
        toast.success("Added to bookmarks!");
      }
    } catch (err) {
      console.error("Error bookmarking:", err);
      toast.error(err?.response?.data?.message || "Failed to add bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSendOffer = () => {
    if (!offerAmount) return toast.error("Please enter an Amount");
    console.log("Offer sent:", offerAmount);
    setOfferAmount("");
  };

  // Loading and Error States
  if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-sm text-gray-500 font-inter">Loading ad details...</p>
      </section>
    );
  }

  if (error) {
    return <section className="px-4 md:px-10 mt-10 text-center text-red-500">{error}</section>;
  }

  if (!adData) {
   
    return <section className="px-4 md:px-10 mt-10 text-center">Ad not found.</section>;
  }

  const { carAd, vehicleAd, propertyAd, business } = adData;
  const sellerId = business?._id;
  const mainAd = vehicleAd || propertyAd; 
  const businessName = business?.businessName || "Unknown Seller";
  const aboutBusiness = business?.aboutBusiness || "No 'About' section provided.";
  const businessLocation = business?.location || "N/A";
  const businessAddresses = business?.addresses || []; 

  const businessProfileImage = business?.profileImage || business?.image;
  const isBusinessVerified = business?.isVerified;


 
  const productTitle = carAd 
    ? `${vehicleAd?.vehicleType || ""} ${vehicleAd?.model || ""} ${
        vehicleAd?.year || ""
      }`.trim()
    : propertyAd?.propertyName || "Product";

     const productImage = carAd?.vehicleImage?.[0]
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${carAd.vehicleImage[0].replace(/\\/g, "/")}`
    : propertyAd?.propertyImage?.[0]
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${propertyAd.propertyImage[0].replace(/\\/g, "/")}`
    : null;


  return (
    <div className="md:px-[104px] px-4 md:ml-10">
      <div className="mt-28 flex items-center gap-2 mb-4 text-[#868686] md:text-[14px] font-[400] font-inter flex-nowrap">
        <Link href="/Product-List" className="hover:text-[#000] transition-all whitespace-nowrap">
          Home&nbsp;&rsaquo;
        </Link>
        {carAd?.category && (
          <span className="text-[#868686] text-[13px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
            {carAd.category}
          </span>
        )}
        {vehicleAd && (
          <span href="/vehicles" className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
            {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.horsePower} {vehicleAd.trim} {vehicleAd.year}  {vehicleAd.color}
          </span>
        )}
      </div>

      <div className="mt-5 container mx-auto flex flex-wrap items-center justify-center gap-4">
        <div className="flex-1">
          {propertyAd && (
            <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
              {propertyAd.propertyName} {propertyAd.propertyAddress}
            </h2>
          )}
          {vehicleAd && (
            <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
              {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.year}
            </h2>
          )}
        </div>
        <div className="flex items-center space-x-3">
         <button
          className={`cursor-pointer transition duration-300 ${
            isBookmarked ? "filter saturate-150 brightness-110" : "filter grayscale"
          }`}
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          title={isBookmarked ? "Already Bookmarked" : "Add to Bookmarks"}
        >
          <Img
            src="/bookmark.svg"
            alt="Bookmark"
            width={44}
            height={44}
            className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
          />
        </button>
          <Link href="/Bookmarked">
            <span className="text-[13px] text-blue-500 underline">Go to Bookmarks</span>
          </Link>
          <button
            className="cursor-pointer"
            onClick={() => {
              const socialMediaSection = document.getElementById("social-media-section");
              if (socialMediaSection) {
                const offsettop = socialMediaSection.getBoundingClientRect().top + window.scrollY - 50;
                window.scrollTo({ top: offsettop, behavior: "smooth" });
              }
            }}
          >
            <Img src="/share.svg" alt="Share" width={44} height={44} className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 mt-6">
        {/* Main Image */}
        <div className="md:w-2/3 w-full relative">
          {carAd?.vehicleImage?.length > 0 && (
            <Img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${carAd.vehicleImage[0].replace(/\\/g, "/")}`}
              alt="Main Ad"
              width={686}
              height={354}
              className="w-full h-auto md:w-[686px] md:h-[354px] object-cover rounded"
            />
          )}
          {carAd?.propertyImage?.length > 0 && (
            <Img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${carAd.propertyImage[0].replace(/\\/g, "/")}`}
              alt="Main Property"
              width={686}
              height={354}
              className="w-full h-auto md:w-[686px] md:h-[354px] object-cover rounded"
            />
          )}
        </div>

        {/* Small Image Grid */}
        <div className="md:w-1/3 w-full grid grid-cols-2 grid-rows-2 gap-2">
         {(carAd?.propertyImage?.length > 0 ? carAd.propertyImage : carAd?.vehicleImage || [])
         .slice(1, 5)
         .map((img, idx) => (
        <div key={idx} className="w-full h-full overflow-hidden">
           <Img
             src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${img.replace(/\\/g, "/")}`}
             alt={`Image ${idx + 2}`}
             width={180}
             height={120}
             className="w-full h-full object-cover rounded"
           />
        </div>
       ))}
     </div>
      </div>

      {/* Price and Make Offer Section for Mobile View */ }
   <div className="block md:hidden mt-4">
   <div className="bg-[#FAFAFA] w-full rounded-[8px]">
     <div className="flex justify-between items-center p-4">
       <span className="text-[#525252] text-[15px] font-[400] font-inter">Price</span>
       {vehicleAd?.amount && (
        <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{vehicleAd.amount?.toLocaleString()}</span>
       )}
       {propertyAd?.amount && (
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{propertyAd.amount?.toLocaleString()}</span>
       )}
     </div>
     <div className="p-4">
      {showInput ? (
        <div className="relative w-full">
           <input
              type="number"
              placeholder="Enter your offer"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
               className="w-full h-[44px] rounded-[8px] px-4 pr-12 border-[1px] focus:outline-none border-[#868686] text-[16px] font-inter"
           />
           <button
             onClick={handleSendOffer}
             className="absolute right-3 top-1/2 transform -translate-y-1/2">
               <Img
                 src="/offerImg.svg"
                 width={17.9}
                 height={18}
                 className="w-[17.9px] h-[18px]"
               />
           </button>
        </div>
      ): (
       <Button 
         onClick={() => setShowInput(true)}
          className="md:w-[300px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] bg-[#5555DD]">
         Make Offer
        </Button>
      )}
     </div>
   </div>
   </div>

   <div className="flex flex-col md:flex-row gap-x-[20px] md:mt-10">
    {/* Left Section */}
    <div className="flex-[1.5] p-8">
      {/* Toogle Switch */}
      <div className="bg-[#FAFAFA] md:w-[650px] md:h-[44px] md:rounded-[4px]">
        <div className="flex space-x-4 mb-4">
           {propertyAd && (
            <Button
            className={`
             w-full sm:w-auto
             min-w-[200px]
              h-[44px]
             whitespace-nowrap
             rounded-tl-[4px] rounded-tr-[4px]
             text-center text-sm sm:text-base
             overflow-hidden 
            ${activeTab === "car"
           ? "bg-[#DFDFF9] text-[#000087]"
           : "bg-gray-200 text-gray-700"}`}
           onClick={() => setActiveTab("car")}>
            Commercial Property 
          </Button>

           )}
           {vehicleAd && (
            <Button
             className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
                  activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
                  }`}
                   onClick={() => setActiveTab("car")}>
              Car Details 
           </Button>
           )}
           {propertyAd && (
            <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
           {vehicleAd && (
            <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
        </div>
      </div>

      <div>
        {activeTab === "car" ? (
          <>
          <div className="bg-[#FAFAFA] w-full md:w-[650px] h-auto  rounded-[12px] p-4 md:p-6 mt-5">
             <div className="flex flex-row justify-between w-full">
               {propertyAd && (
                <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                 {propertyAd.propertyName} {propertyAd.propertyAddress}
               </h2>
              )}
             {vehicleAd && (
               <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                 {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.year}
               </h2>
              )}
              <div className="flex space-x-2">
                 <Img 
                   src="/eye.svg"
                   alt="Eye Icon"
                   width={16}
                   height={16}
                   className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                 />
                  {propertyAd && (
                   <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                     {propertyAd.priorityScore} Views
                   </span>
                  )}
                  {vehicleAd && (
                   <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                     {vehicleAd.priorityScore} Views
                  </span>
                  )}
              </div>
             </div>
             {/* Location and Promotion Button */}
             <div className="mt-4 flex flex-row items-center justify-between">
               <div className="flex items-center">
                 <Img 
                   src="/location-tick.svg"
                   alt="Location Icon"
                   width={11.5}
                   height={13.33}
                   className="mr-2"
                 />
                 {carAd && (
                   <span className="text-[#8C8C8C] text-[12px] md:text-[14px] font-[400] font-inter">{carAd.location}</span>
                  )}
               </div>
               <div className="mt-2 md:mt-0">
                  {propertyAd && (
                    <Button
                    className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {propertyAd.plan}
                    </Button>
                  )}
                  {vehicleAd && (
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {vehicleAd.plan}
                    </Button>
                  )}
               </div>
             </div>

             {/* Car Details */}
             {vehicleAd && (
              <>
              <div className="flex flex-row gap-4 mt-2">
               <div className="flex items-center gap-2">
                  <Img 
                   src="/car.svg" 
                   alt="Car"
                   width={24}
                   height={24}
                  />
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
                    {vehicleAd?.carType}
                 </span>
               </div>
               <div className="flex items-center gap-2">
                 <Img src="/automatic.svg" alt="Auto" width={24} height={24} />
                 {vehicleAd && (
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter">
                    {vehicleAd?.transmission}
                  </span>
                 )}
               </div>
               <div className="flex items-center gap-2">
                 <Img src="/meter.svg" alt="Meter" width={24} height={24} />
                 {vehicleAd && (
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter">
                    {vehicleAd?.horsePower}
                  </span>
                 )}
               </div>
             </div>
             {/* Posted Text */}
             <div className="mt-4">
                 <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(vehicleAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
             </span>
             </div>
             </>
             )}

             {propertyAd && (
               <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(propertyAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
             </span>
             )}
          </div>

           {propertyAd && (
            <>
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto  md:rounded-[12px] p-8 mt-4">
             <div className="flex items-center justify-between">
              <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Property Details
               </span>

               <div className="flex items-center space-x-2">
                  <span className="text-[#000087] text-[16px] font-[400] font-inter">
                    Show More
                  </span>
                  <button onClick={() => setShowDetails(!showDetails)} aria-expanded={showDetails}>
                    <Img
                     src={showDetails ? "/dropup.svg" : "/dropdown.svg"}
                     alt="Dropdown Icon"
                     width={8}
                     height={4}
                     className="mr-2 mt-[2px] cursor-pointer"
                    />
                 </button>
               </div>
             </div>
             {showDetails && (
              <div className="mt-4">
               <div className="flex flex-wrap justify-between gap-y-4 gap-x-[4%] max-w-[650px] mx-auto">
                 {[
                 { label: "Property Type", value: propertyAd?.propertyType },
                 { label: "Furnishing", value: propertyAd?.furnishing },
                 { label: "Parking Spaces", value: propertyAd?.parking },
                 { label: "Square Meter", value: propertyAd?.squareMeter },
                 { label: "Role", value: propertyAd?.ownershipStatus },
                 { label: "Payment Duration", value: propertyAd?.paymentDuration },
                 { label: "Service Charge", value: propertyAd?.serviceCharge },
                 { label: "Negotiation", value: propertyAd?.negotiation },
                 { label: "Property Condition", value: propertyAd?.propertyCondition },
                 { label: "Property Facilities", value: propertyAd?.propertyFacilities },
                ].map(
              (item, index) =>
                item.value && (
                 <div key={index} className="flex flex-col w-[48%] md:w-[30%]">
                <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                 {item.label}
               </span>
               <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                 {item.value}
               </span>
             </div>
            )
           )}
                </div>


                <div className="flex gap-2 mt-4">
                   <div className="flex flex-col w-[48%] md:w-[33%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter"></span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px]  font-medium font-inter"></span>
                   </div>
                   <div className="flex flex-col">

                   </div>
                </div>
              </div>  
             )}
             </div>
            </>
           )}

           {vehicleAd && (
           <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Car Details
               </span>

               <div className="flex items-center space-x-2">
                 <span className="text-[#000087] text-[16px] font-[400] font-inter">
                    Show More
                  </span>
                  <button 
                   onClick={() => setShowDetails(!showDetails)} 
                   aria-expanded={showDetails}>
                    <Img
                      src={showDetails ? "/dropup.svg" : "/dropdown.svg"}
                      alt="Dropdown Icon"
                      width={8}
                      height={4}
                      className="mr-2 mt-[2px] cursor-pointer"
                    />
                  </button>
               </div>
            </div>
            {showDetails && (
              <div className="mt-4">
                <div className="flex flex-wrap justify-between gap-y-4 gap-x-[4%] max-w-[650px] mx-auto">
                 {/* Row 1 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Make
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {vehicleAd?.vehicleType}
                    </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Model</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium  font-inter">
                      {vehicleAd?.model}
                    </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">
                      Manufacturing Year
                    </span>
                   <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                     {vehicleAd.year}
                    </span>
                 </div>

                 {/* Row 2 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Interior Color</span>
                   <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.interiorColor}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Condition</span>
                     <span  className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {vehicleAd.carType}
                    </span>
                 </div>
                 <div  className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Color</span>
                  <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {vehicleAd.color}
                   </span>
                 </div>

                 {/* Row 3 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Trim</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.trim}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Vin Chassis Number</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.vinChassisNumber}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Car Registered</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.carRegistered}
                     </span>
                 </div>

                 {/* Row 4 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Exchange Possible</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.exchangePossible}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Car Key Features</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.carKeyFeatures}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Car Type</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.carType}
                     </span>
                 </div>

                 {/* Row 5 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Car Body Type</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.carBody}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Fuel Type</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.fuel}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Seat Type</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.seat}
                     </span>
                 </div>

                 {/* Row 6 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Drive Train</span>
                    <span className="text-[#525252] mt-2 whitespace-nowrap text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.driveTrain}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Number of Cylinders</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.numberOfCylinders}
                     </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                  <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Engine Size</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.engineSizes}
                     </span>
                 </div>    
                </div>

                {/* Seventh Row */}
                <div className="flex gap-2 mt-4">
                  <div className="flex flex-col w-[48%] md:w-[33%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Horse Power</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.horsePower}
                     </span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">Negotiation</span>
                      <span className="text-[#525252] mt-2 text-[14px] md:text-[16px]  font-medium font-inter">
                        {vehicleAd.fuel}
                     </span>
                  </div>
                </div>
              </div>
            )}
           </div>
           )}
           
           {/* Description Information */}
           <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <h3 className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
                More Info
              </h3>
              {propertyAd && (
                <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {propertyAd?.description}
                </p>
              )}
              {vehicleAd && (
                 <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {vehicleAd?.description}
                </p>
              )}
           </div>
          </>
        ): (
          <>
          {/* <p>This is the review section</p> */}
          </>
        )}
      </div>
    </div>

    {/* Central Auto Cars and Safety Tips for Mobile View */}
    <div  className="block md:hidden mt-4">
      {/* Central Auto Cars Section */}
     <div className="border-[1px] border-[#EDEDED] w-full rounded-[8px] p-4">
     <div className="flex gap-3">
       <Img
        src={userProfile?.image || "/profile-placeholder.png"}
        alt="Profile Image"
        width={52}
        height={52}
        className="w-[40px] h-[40px] rounded-[30px]"
      />
      <div className="flex flex-col">
         <Link href="/seller-profile" className="underline">
            <span className="text-[#000000] text-[14px] font-[500] font-inter">
             {businessName}
          </span>
          </Link>
         {userProfile?.isVerified ? (
           <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] w-auto h-[16px] rounded-[2px] px-2">
          <Img
            src="/profile.svg"
            alt="Verified Icon"
            width={10}
            height={10}
            className="w-[10px] h-[10px]"
          />
          <span className="text-[#238E15] text-[10px] font-[500] font-inter">
            Verified User
          </span>
        </div>
         ): (
           <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] w-auto h-[16px] rounded-[2px] px-2">
          <Img
            src="/profile.svg"
            alt="Verified Icon"
            width={10}
            height={10}
            className="w-[10px] h-[10px]"
          />
          <span className="text-[#238E15] text-[10px] font-[500] font-inter">
            Unverified User
          </span>
        </div>
         )}
        <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
          Last Seen 20h ago
        </span>
        <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter"> {userProfile?.createdAt ? ( `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` ) : ( "Joined Tenaly" )} </span>
      </div>
     </div>
     <div className="mt-5">
      <Button
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] w-full h-[40px] rounded-[8px] text-[#FFFFFF] text-[12px] font-inter font-[500]"
      >
        <Img
          src="/call.svg"
          alt="Call Icon"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
         {userProfile?.phoneNumber 
          ? `Call ${userProfile.phoneNumber}`
         : "Call"}
      </Button>
    </div>
    <div className="mt-2">
    <MessageSellerButton
       sellerId={sellerId}
       productId={id}
        openAuthModal={openAuthModal} 
       productImage={productImage}
       productTitle={productTitle}
       //openAuthModal={() => setShowSignInModal(true)}
     />
      {!sellerId && <p className="text-red-500">Seller ID not found for this product.</p>}
     {/* {showSignInModal && (
       <SignUpModal 
         onClose={() => setShowSignInModal(false)}
         initialView="signin"
       />
     )}
     {showSignUpModal && (
       <SignUpModal 
         onClose={() => setShowSignUpModal(false)}
         initialView="signup"
       />
      )} */}
    </div>
     <div className="mt-2">
      
    </div>
     </div>
      {/* Safety Tips Section */}
  <div className="bg-[#F7F7FF] w-full rounded-[8px] border-[1px] border-[#DFDFF9] mt-5 p-4">
    <span className="text-[#525252] text-[14px] font-[500] font-inter">
      Safety Tips
    </span>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[5px] h-[5px] md:w-[6px] md:h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        Always meet the seller in a public, well-lit place area. Avoid secluded
        places.
      </span>
    </div>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        Inspect the vehicle thoroughly (the exterior, interior, engine, tires,
        and others) for any signs of damage.
      </span>
    </div>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        Ensure the seller provides valid registration papers, proof of
        ownership, and a roadworthiness certificate.
      </span>
    </div>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        Do not make full or partial payments before seeing the car and
        confirming its legitimacy.
      </span>
    </div>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        Bring a trusted mechanic to inspect the car for hidden issues before
        making a decision if you are unsure.
      </span>
    </div>
    <div className="flex items-start gap-2 mt-2">
      <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
      <span className="text-[#868686] text-[12px] font-[400] font-inter">
        If you think this listing is a fraud, kindly report it.
      </span>
    </div>
    <div className="mt-4">
      <Button
        className="flex items-center justify-center gap-2 bg-[#F8EFEF] w-full h-[40px] rounded-[8px] text-[#CB0D0D] text-[12px] font-inter font-[400]"
      >
        <Img
          src="/flag.svg"
          alt="Flag Icon"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
        Report this listing
      </Button>
    </div>
  </div>
    </div>   

     {/* Right Section */}
     <div className="flex-[1] p-8">
      <div className="hidden md:block">
        <div className="bg-[#FAFAFA] md:w-[330px] md:h-[141px] md:rounded-[8px]">
     <div className="flex justify-between items-center p-4">
       <span className="text-[#525252] md:text-[15px] font-[400] font-inter">Price</span>
       {propertyAd && (
        <span className="text-[#525252] md:text-[24px] font-[500] font-inter">₦{propertyAd.amount?.toLocaleString()}</span>
       )}
       {vehicleAd && (
        <span className="text-[#525252] md:text-[24px] font-[500] font-inter">₦{vehicleAd.amount?.toLocaleString()}</span>
       )}
     </div>
     <div className="p-4">
      {showInput ? (
        <div className="relative w-full">
           <input
              type="number"
              placeholder="Enter your offer"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
               className="w-full h-[44px] rounded-[8px] px-4 pr-12 border-[1px] focus:outline-none border-[#868686] text-[16px] font-inter"
           />
           <button
             onClick={handleSendOffer}
             className="absolute right-3 top-1/2 transform -translate-y-1/2">
               <Img
                 src="/offerImg.svg"
                 width={17.9}
                 height={18}
                 className="w-[17.9px] h-[18px]"
               />
           </button>
        </div>
      ): (
       <Button 
         onClick={() => setShowInput(true)}
          className="md:w-[300px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] bg-[#5555DD]">
         Make Offer
        </Button>
      )}
     </div>
   </div>
      </div>
       <div className="hidden md:block">
      {business && (
         <div 
        className="border-[1px] border-[#EDEDED] md:w-[330px]
         md:h-[276px] md:rounded-[8px] mt-5 p-4">
         <div className="flex  gap-3">
             {businessProfileImage && (
              <Img
                src={getImageUrl(businessProfileImage)}
                alt="Business Profile"
                width={52}
                height={52}
                className="w-[52px] h-[52px] rounded-full object-cover"
              />
            )}
             <div className="flex flex-col">
              <Link href="/seller-profile" className="underline">
               <span className="text-[#000000] text-[14px] font-[500] font-inter">
                  {businessName}
              </span>
             </Link>
             {isBusinessVerified && (
                <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] w-fit px-2 py-1 rounded-[2px]">
                  <Img
                    src="/profile.svg" 
                    alt="Verified Icon"
                    width={10}
                    height={10}
                    className="w-[10px] h-[10px]"
                  />
                  <span className="text-[#238E15] font-[500] text-[10px] font-inter">
                    Verified Business
                  </span>
                </div>
              )}
            <span className="mt-1 text-[#868686] font-inter font-[400] md:text-[12px]">Last Seen 20h ago</span>
           <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter"> {userProfile?.createdAt ? ( `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` ) : ( "Joined Tenaly" )} </span>
            </div>
            </div>
            <div className="mt-5">
              <Button 
               className="flex items-center justify-center 
               gap-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] md:w-[300px]
               md:h-[52px] md:rounded-[8px] text-[#FFFFFF] md:text-[16px] font-inter font-[500]">
               <Img 
                src="/call.svg"
                alt="Call Icon"
                width={19.97}
                height={20}
                className="w-[24px] h-[24px]" />
                 {userProfile?.phoneNumber
                  ? `Call ${userProfile.phoneNumber}`
                  : "Call"}
              </Button>
            </div>
            <div className="mt-2">
              <MessageSellerButton 
               sellerId={sellerId}
               productId={id}
               productImage={productImage}
               productTitle={productTitle}
                openAuthModal={openAuthModal} 
              />

             {/* {showSignInModal && (
             <SignUpModal 
              onClose={() => setShowSignInModal(false)}
              initialView="signin"
             />
            )}

           {showSignUpModal && (
            <SignUpModal 
             onClose={() => setShowSignUpModal(false)}
             initialView="signup"
            />
           )} */}
            </div>
      </div>
      )}

          <div className="hidden md:block">
          <div 
           className="bg-[#F7F7FF] md:w-[330px] h-auto
           md:rounded-[8px] border-[1px] border-[#DFDFF9] mt-5 p-4">
            <div>
               <span className="text-[#525252] md:text-[16px] font-[500] font-inter">
                 Safety Tips
              </span>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[10px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                  Always meet the seller in a public, well-lit place area.
                  Avoid secluded places.
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[14px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                  Inspect the vehicle&#39;s thoroughly (the exterior, interior, engine, tires
                  and others) for any signs of damage.
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[14px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                  Ensure the seller provides valid registration papers, proof
                  of ownership, and a roadworthiness certificate.
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[12px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                  Do not make full or partial payments before seeing the 
                  car and confirming its legitimacy.
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[18px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                  Bring a Mechanic if Unsure - Have a trusted mechanic
                  inspect the car for hidden issues before making a decison if you are unsure 
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 ml-4">
                <span className="w-[6px] h-[6px] bg-[#868686] rounded-full mt-[6px]"></span>
                <span className="text-[#868686] md:text-[14px] font-[400] font-inter">
                 If you think this listing is a fraud, kindly report it
                </span>
              </div>
              <div className="mt-4">
            <Button 
               className="flex items-center justify-center 
               gap-2 bg-[#F8EFEF] md:w-[300px]
               md:h-[52px] md:rounded-[8px] text-[#CB0D0D] md:text-[12px] font-inter font-[400]">
               <Img 
                 src="/flag.svg"
                 alt="Flag Icon"
                 width={24}
                 height={24}
                 className="w-[24px] h-[24px]" />
                 Report this listing
              </Button>
            </div>
            </div>
          </div>
          </div>
         </div>
     </div>
   </div>
    </div>
  );
}
