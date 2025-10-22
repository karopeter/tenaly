"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Img from "@/app/components/Image";
import Button from "@/app/components/Button";
import api from "@/services/api";
import { SellerPhoneDisplay } from "../../components/features/sellerPhoneDisplay";
import {SellerInfo} from "../../components/features/SellerInfo";
import MessageSellerButton from "@/app/components/UI/messageSeller";
import { SellerImage } from "@/app/components/features/sellerImage";
import ReportListingModal from "@/app/components/ReportListingModal/reportListingModal";
import { toast } from "react-toastify";
import { sendOffer } from "@/app/utils/socket";
import { useAuth } from "@/app/context/AuthContext";


export default function HomeListDetails() {
 const [activeTab, setActiveTab] = useState("car");
  const [showInput, setShowInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { businessId, id } = useParams();
  const [zoomedImage, setZoomedImage] = useState(null);

  const [adData, setAdData] = useState(null);
  const [showDetails, setShowDetails] = useState(false); 
  const [userProfile, setUserProfile] = useState(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { openAuthModal, isLoggedIn, profile } = useAuth();

  // Placeholder image for when a real image fails to load
  const placeholderImage = "https://placehold.co/400x300/E5E7EB/4B5563?text=Image+Not+Available";

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

    if (isBookmarked) {
      // remove bookmark
      const res = await api.delete(`/bookmark/delete-bookmark/${id}`);
      if (res.data.success) {
        setIsBookmarked(false);
        toast.success("Removed from bookmarks!");
      }
    } else {
      // add bookmark
      const res = await api.post(`/bookmark/bookmarkAd/${id}`);
      if (res.data.success) {
        setIsBookmarked(true);
        toast.success("Added to bookmarks!");
      }
    }
  } catch (err) {
    console.error("Error bookmarking:", err);
    toast.error(err?.response?.data?.message || "Failed to update bookmark");
  } finally {
    setBookmarkLoading(false);
  }
};

const handleReportSubmit = async (reportData) => {
   console.log("Report submitted", reportData);
};

const handleShare = () => {
   if (!adData) return;

   const shareUrl =  `${window.location.origin}/HomeList/${id}`;
   const shareTitle = productTitle || "Check out this product!";
   const shareText = `Hey, I found this awesome product on our tenaly marketplace: ${shareTitle}. Take a look here: ${shareUrl}`;

   // Use web share API
   if (navigator.share) {
    navigator
     .share({
       title: shareTitle,
       text: shareText,
       url: shareUrl
     })
     .then(() => console.log("Shared successfully!"))
     .catch((err) => console.error("Share failed:", err));
   } else {
    // ❌ Fallback for desktop browsers
     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const tiktokUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(shareUrl)}`;
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`;

    // Open a modal or window with sharing options (simple alert fallback)
    const shareWindow = window.open(
       `
         <html>
        <body style="font-family:sans-serif;padding:20px">
          <h3>Share this product</h3>
          <ul style="list-style:none;padding:0;">
            <li><a href="${whatsappUrl}" target="_blank">WhatsApp</a></li>
            <li><a href="${facebookUrl}" target="_blank">Facebook</a></li>
            <li><a href="${twitterUrl}" target="_blank">X (Twitter)</a></li>
            <li><a href="${tiktokUrl}" target="_blank">TikTok</a></li>
            <li><a href="${instagramUrl}" target="_blank">Instagram</a></li>
          </ul>
        </body>
      </html>
       `,
       "Share",
       "width=400,height=500"
    );

    if (shareWindow) shareWindow.focus();
   }
};



const handleSendOffer = async () => {
  const offerMessage = encodeURIComponent(
      `Hi, I'm interested in "${productTitle}". I would like to make an offer of ₦${parseInt(offerAmount).toLocaleString()} for this product. Are you willing to negotiate?`
  );

  if (!isLoggedIn) {
    toast.error("You need to log in to make an offer");
    return;
  }

  if (!offerAmount) {
    return toast.error("Please enter an amount");
  }

  try {
    setLoading(true);
  
    const res = await api.post(`/offer/make-offer/${productId}`, { offerAmount });

    console.log(res)

    if (res.data.success) {
      const { offer, conversationId, chatMessage } = res.data.data;


      sendOffer({
        conversationId: conversationId,
        offerId: offer._id
      });
      
      console.log(offer, conversationId, chatMessage);

      toast.success(`Offer of ₦${offerAmount.toLocaleString()} sent successfully`);
      setOfferAmount("");
      setShowInput(false);
      
      setTimeout(() => {
        window.location.href = `/Message?sellerId=${chatMessage.to}&productId=${productId}&productTitle=${productTitle}&previewMessage=${offerMessage}`;
      }, 1500); 
      
    } else {
      toast.error(res.data.message || "Failed to send offer");
    }
  } catch (err) {
    console.error("Error sending offer:", err);
    toast.error(err?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  // Loading and Error States
  if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
         <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading Products details...</p>
        </div>
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
  const actualBusinessId = carAd?.businessCategory?._id || carAd?.businessCategory;
  const sellerId = business?.userId || carAd?.userId || vehicleAd?.userId || propertyAd?.userId;


  let mainAd = null; 
  let adDetails = null;
   if (carAd && vehicleAd) {
    mainAd = carAd;
    adDetails = vehicleAd;
  } else if (propertyAd) {
    mainAd = propertyAd;
    adDetails = propertyAd; 
  }

  const businessName = business?.businessName || "Unknown Seller";
  const aboutBusiness = business?.aboutBusiness || "No 'About' section provided.";
  const businessLocation = business?.location || "N/A";
  const businessAddresses = business?.addresses || []; 

  const businessProfileImage = business?.profileImage || business?.image;
  const isBusinessVerified = business?.isVerified;


 
const productTitle =
  propertyAd?.propertyName ||
  (vehicleAd ? `${vehicleAd.vehicleType} ${vehicleAd.model}` : "") ||
  (carAd ? `${carAd.vehicleType} ${carAd.model}` : "");

    const mainImageArray = carAd
    ? (carAd.propertyImage?.length > 0 ? carAd.propertyImage : carAd.vehicleImage || [])
    : [];

     const mainImage = mainImageArray[0];
    const smallImages = mainImageArray.slice(1, 5);

     const productId = mainAd?._id;

// Pick correct product image
const productImage =
  propertyAd?.propertyImage?.[0] ||
  vehicleAd?.vehicleImage?.[0] ||
  carAd?.vehicleImage?.[0];


  return (
    <>
       <div className="md:px-[104px] px-4 md:ml-10">
      <div className="mt-28 flex items-center gap-2 mb-4 text-[#868686] md:text-[14px] font-[400] font-inter flex-nowrap">
        <Link href="/Product-List" className="hover:text-[#000] transition-all whitespace-nowrap">
          Home&nbsp;&rsaquo;
        </Link>
        {mainAd?.category && (
          <span className="text-[#868686] text-[13px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
            {mainAd.category}
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
              {propertyAd.propertyName} 
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
        isBookmarked ? "saturate-150 brightness-110" : "grayscale" }`}
        onClick={handleBookmark}
        disabled={bookmarkLoading}
        title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}>
        <Img
          src={isBookmarked ? "/bookmark-filled.svg" : "/bookmark.svg"}
          alt="Bookmark"
          width={20}
         height={20}
        className="w-5 h-5 md:w-10 md:h-10"
        />
        </button>

          <button
            className="cursor-pointer"
            onClick={handleShare}
          >
            <Img src="/share.svg" alt="Share" width={44} height={44} className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]" />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col items-center md:items-start md:flex-row md:gap-0 mt-6">
        {/* Main Image */}
        <div className="md:w-2/3 w-full relative">
          {mainImage && (
           <button
             type="button"
             className="w-full"
             onClick={() => setZoomedImage(mainImage)}
             aria-label="Zoom main image"
           >
             <Img
              src={mainImage}
              alt={productTitle}
              width={686}
              height={354}
              className="w-full h-auto md:h-[354px] object-cover rounded transition-transform duration-200 hover:scale-105 cursor-zoom-in"
              onError={(e) => { e.target.src = placeholderImage; }}
            />
           </button>
          )}
           {!mainImage && (
            <Img
              src={placeholderImage}
              alt="Image not available"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Small Image Grid */}
        <div className="md:w-1/3 w-full grid grid-cols-2 grid-rows-2 gap-2 md:h-[354px] md:ml-1">
        {smallImages.map((img, idx) => (
           <button 
            key={idx} 
            type="button"
            className="w-full h-full overflow-hidden"
            onClick={() => setZoomedImage(img)}
            aria-label={`Zoom image ${idx + 2}`}
            >
           <Img
             src={img}
            alt={`${productTitle} image ${idx + 2}`}
             width={180}
             height={120}
             className="w-full h-full object-cover rounded"
             onError={(e) => { e.target.src = placeholderImage; }}
           />
        </button>
        ))}
         {smallImages.length === 0 && (
             <div className="col-span-2 row-span-2 w-full h-full relative overflow-hidden rounded">
              <Img
                src={placeholderImage}
                alt="Image not available"
                fill
                className="object-cover"
              />
            </div>
          )}
       </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <button
           type="button"
           className="absolute top-6 right-8 text-white text-3xl font-bold"
           onClick={() => setZoomedImage(null)}
           aria-label="Close zoom"
          >
            &times;
          </button>
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Img 
             src={zoomedImage}
             alt="Zoomed"
             width={900}
             height={600}
             className="max-w-full max-h-[80vh] rounded-lg shadow-lg object-contain"
             onError={(e) => { e.target.src = placeholderImage }}
            />
          </div>
        </div>
      )}

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
     {((vehicleAd?.negotiation === "Yes") || (propertyAd?.negotiation === "Yes")) && (
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
          className="w-full md:w-[300px] h-[44px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] bg-[#5555DD]">
         Make Offer
        </Button>
      )}
     </div>
     )}
   </div>
   </div>

   <div className="flex flex-col md:flex-row gap-x-[20px] md:mt-10">
    {/* Left Section */}
    <div className="flex-[1.5] pt-8">
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
                 {propertyAd.propertyName} 
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
                   <span className="text-[#8C8C8C] text-[12px] md:text-[14px] font-[400] font-inter">{carAd.location} {propertyAd?.propertyAddress}</span>
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
            <div className="bg-[#FAFAFA] w-full md:w-[650px] h-auto md:rounded-[12px] p-4 md:p-8 mt-4">
               {/* Header */}
             <div className="flex items-center justify-between">
             <span className="text-[#525252] text-[14px] md:text-[16px] font-inter font-[500]">Property Details</span>
            <div className="flex items-center space-x-2">
            <span className="text-[#000087] text-[14px] md:text-[16px] font-[400] font-inter">
             Show More
            </span>
            <button
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}>
            <Img
              src={showDetails ? "/dropup.svg" : "/dropdown.svg"}
              alt="Dropdown Icon"
              width={12}
              height={6}
              className="cursor-pointer"
           />
         </button>
        </div>
       </div> 
        {/* Details */}
        {showDetails && (
         <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-6">
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
            {label: "Number of Bedrooms", value: propertyAd?.numberOfBedrooms },
            {label: "Number of Toilets", value: propertyAd?.numberOfToilet },
            {label: "Number of Bathrooms", value: propertyAd?.numberOfBathroom },
            {label: "Title of Documents", value: propertyAd?.titleDocuments },
            {label: "Maximum Allowed Guests", value: propertyAd?.maximumAllowedGuest },
            {label: "Is Smoking Allowed", value: propertyAd?.isSmokingAllowed },
            {label: "Are Parties Allowed", value: propertyAd?.isPartiesAllowed },
            {label: "Service Fee", value: propertyAd?.serviceFee },
          ].map(
            (item, index) =>
              item.value && (
               <div key={index} className="flex flex-col">
                 <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                   {item.label}
                 </span>
                 {item.label === "Property Facilities" && Array.isArray(item.value) ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.value.map((facility, i) => (
                      <span 
                        key={i}
                        className="bg-[#F5F5F5] text-[#525252] text-[13px] md:text-[14px] font-medium font-inter px-2 py-1 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                 ): (
                  <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                    {item.value}
                  </span>
                 )}
               </div>
             )
          )}
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
                    <ul className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.carKeyFeatures?.map((feature, index) => (
                        <li key={index} className="list-disc ml-4">{feature}</li>
                       ))}
                     </ul>
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
           <p>This is the review section</p>
          </>
        )}
      </div>
    </div>

    {/* Central Auto Cars and Safety Tips for Mobile View */}
    <div  className="block md:hidden mt-4">
      {/* Central Auto Cars Section */}
     <div className="border-[1px] border-[#EDEDED] w-full rounded-[8px] p-4">
     <div className="flex gap-3">
      <SellerImage sellerId={sellerId} />
      <div className="flex flex-col">
         <Link href={`/seller-profile/${sellerId}`} className="underline">
            <span className="text-[#000000] text-[14px] font-[500] font-inter">
             {businessName}
          </span>
          </Link>
          <SellerInfo sellerId={sellerId} />
        {/* <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
          Last Seen 20h ago
        </span> */}
        <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter"> {userProfile?.createdAt ? ( `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` ) : ( "Joined Tenaly" )} </span>
      </div>
     </div>
     <div className="mt-5">
       <SellerPhoneDisplay sellerId={sellerId} />
    </div>
    <div className="mt-2">
    <MessageSellerButton
       sellerId={sellerId}
       productId={id}
        openAuthModal={openAuthModal} 
       productImage={productImage}
       productTitle={productTitle}
     />
      {!sellerId && <p className="text-red-500">Seller ID not found for this product.</p>}
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
       onClick={() => setShowReportModal(true)}
        className="flex items-center justify-center gap-2
         bg-[#F8EFEF] w-full h-[40px] rounded-[8px] t
         ext-[#CB0D0D] text-[12px] font-inter font-[400]"
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
    {((vehicleAd?.negotiation === "Yes") || (propertyAd?.negotiation === "Yes")) && (
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
    )}
   </div>
      </div>
       <div className="hidden md:block">
      {business && (
         <div 
        className="border-[1px] border-[#EDEDED] md:w-[330px] md:rounded-[8px] mt-5 p-4">
         <div className="flex  gap-3">
            <SellerImage sellerId={sellerId} />
             <div className="flex flex-col">
              <Link href={`/seller-profile/${sellerId}`} className="underline">
               <span className="text-[#000000] text-[14px] font-[500] font-inter">
                  {businessName}
              </span>
             </Link>
           <div className="">
          <SellerInfo sellerId={sellerId} />
        </div>
            {/* <span className="mt-1 text-[#868686] font-inter font-[400] md:text-[12px]">Last Seen 20h ago</span> */}
           <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter"> {userProfile?.createdAt ? ( `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` ) : ( "Joined Tenaly" )} </span>
            </div>
            </div>
            <div className="mt-5">
              <SellerPhoneDisplay sellerId={sellerId} />
            </div>
            <div className="mt-2">
             <MessageSellerButton
                sellerId={sellerId}
                productId={productId}
                productImage={getImageUrl(productImage)}
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
               onClick={() => setShowReportModal(true)}
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
     
     <ReportListingModal
      isOpen={showReportModal}
      onClose={() => setShowReportModal(false)}
      productId={id}
      onSubmit={handleReportSubmit}
     />
    </>
  );
}