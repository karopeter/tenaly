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
  const [isSharing, setIsSharing] = useState(false);
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
      
        // Only fetch profile if user is logged in 
        if (isLoggedIn) {
          try {
           const profileRes = await api.get("/profile");
           setUserProfile(profileRes.data);
          } catch (err) {
           console.error("Error fetching profile:", err);
          }
        }
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



const handleShare = async () => {
   if (!adData || isSharing) return;

   const shareUrl = `${window.location.origin}/HomeList/${id}`;
   const shareTitle = productTitle || "Check out this product!";
   const shareText = `Hey, I found this awesome product on our tenaly marketplace: ${shareTitle}. Take a look here: ${shareUrl}`;

   // Use Web share API 
   if (navigator.share) {
    try {
      setIsSharing(true);
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      console.log("Shared successfully!");
    } catch (err) {
      // User cancelled share on error occured 
      if (err.name !== 'AbortError') {
        console.error("Share failed:", err);
      }
    } finally {
      setIsSharing(false);
    }
   } else {
    // Fallback: Copy to clipboard for desktop 
    try {
     await navigator.clipboard.writeText(shareText);
     toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to share");
    }
   }
};

const handleSendOffer = async () => {
  if (!isLoggedIn) {
    openAuthModal();
    return;
  }
  
  if (!offerAmount || offerAmount <= 0) {
    return toast.error("Please enter a valid offer amount");
  }

  // Validate productId exists before making request
  if (!productId) {
    return toast.error("Product information not available");
  }

  try {
    setLoading(true);
  
    const res = await api.post(`/offer/make-offer/${productId}`, { 
      offerAmount: parseInt(offerAmount) 
    });
    
    console.log("Offer response:", res.data);

    if (res.data.success) {
      const { offer, conversationId, chatMessage } = res.data.data;

      // Send through socket
      sendOffer({
        conversationId: conversationId,
        offerId: offer._id,
      });
      
      toast.success(`Offer of ₦${parseInt(offerAmount).toLocaleString()} sent successfully`);
      setOfferAmount("");
      setShowInput(false);
      
      // Redirect with conversationId
      setTimeout(() => {
        window.location.href = `/Message?conversationId=${conversationId}`;
      }, 1000); 
    }
  } catch (err) {
    console.error("Error sending offer:", err);
    toast.error(err?.response?.data?.message || "Failed to send offer");
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


  const { 
     carAd, 
     vehicleAd, 
     propertyAd, 
     petAd, 
     agricultureAd, 
     kidsAd, 
     serviceAd,
     equipmentAd,
     gadgetAd,
     business
    } = adData;
  const actualBusinessId = carAd?.businessCategory?._id || carAd?.businessCategory;
  const sellerId = business?.userId || carAd?.userId || vehicleAd?.userId || propertyAd?.userId || petAd?.userId || agricultureAd?.userId || kidsAd?.userId || serviceAd?.userId || equipmentAd?.userId || gadgetAd?.userId;


  let mainAd = null; 
  let adDetails = null;
   if (carAd && vehicleAd) {
    mainAd = carAd;
    adDetails = vehicleAd;
  } else if (propertyAd) {
    mainAd = propertyAd;
    adDetails = propertyAd; 
  } else if (petAd) {
    mainAd = carAd,
    adDetails = petAd;
  } else if (agricultureAd) {
    mainAd = carAd;
    adDetails = agricultureAd;
  } else if (kidsAd) {
    adDetails = kidsAd;
  } else if (serviceAd) { 
      mainAd = carAd;
      adDetails = serviceAd;
   } else if (equipmentAd) {
      mainAd = carAd;
      adDetails = equipmentAd;
   } else if (gadgetAd) {
    mainAd = carAd;
    adDetails = gadgetAd;
   }
 
  const businessName = business?.businessName || "Unknown Seller";
  const aboutBusiness = business?.aboutBusiness || "No 'About' section provided.";
  const businessLocation = business?.location || "N/A";
  const businessAddresses = business?.addresses || []; 

  const businessProfileImage = business?.profileImage || business?.image;
  const isBusinessVerified = business?.isVerified;

  const isNegotiable = () => {
  const vehicleNeg = vehicleAd?.negotiation === "Yes";
  const propertyNeg = propertyAd?.negotiation === "Yes";
  const petNeg = petAd?.negotiation === "Yes" || 
                 petAd?.negotiation === "yes" || 
                 petAd?.negotiation === true;
  const agricultureNeg = agricultureAd?.negotiation === "Yes"; 
  const kidsNeg = kidsAd?.negotiation === "Yes";
  const serviceNeg = serviceAd?.negotiation === "Yes";
  const equipmentNeg = equipmentAd?.negotiation === "Yes";
  const gadgetNeg = gadgetAd?.negotiation === "Yes";

  
  return vehicleNeg || propertyNeg || petNeg || agricultureNeg || kidsNeg || serviceNeg || equipmentNeg || gadgetNeg;
};


 
const productTitle =
  propertyAd?.propertyName ||
  petAd?.breed ? `${petAd.breed} - ${petAd.petType}` : "" ||
  (agricultureAd?.title ? `${agricultureAd.title} ` : "") || 
  (kidsAd?.title ? `${kidsAd.title}` : "") ||
  (serviceAd?.serviceTitle ? `${serviceAd.serviceTitle}` : "") ||
  (equipmentAd?.equipmentTitle ? `${equipmentAd.equipmentTitle}` : "") ||
  (gadgetAd?.gadgetTitle ? `${gadgetAd.gadgetTitle}` : "") || 
  (vehicleAd ? `${vehicleAd.vehicleType} ${vehicleAd.model}` : "") ||
  (carAd ? `${carAd.vehicleType} ${carAd.model}` : "");

    const mainImageArray = carAd
    ? (carAd.propertyImage?.length > 0 ? carAd.propertyImage  :
      carAd.petsImage?.length > 0 ? carAd.petsImage : 
      carAd.agricultureImage?.length > 0 ? carAd.agricultureImage :
      carAd.kidsImage?.length > 0 ? carAd.kidsImage :
       carAd.serviceImage?.length > 0 ? carAd.serviceImage :
       carAd.equipmentImage?.length > 0 ? carAd.equipmentImage :
       carAd.gadgetImage?.length > 0 ? carAd.gadgetImage :
        carAd.vehicleImage || [])
    : [];

     const mainImage = mainImageArray[0];
    const smallImages = mainImageArray.slice(1, 5);

    // const productId = mainAd?._id;
    const productId = vehicleAd?._id || propertyAd?._id || petAd?._id || agricultureAd?._id || kidsAd?._id || serviceAd?._id || equipmentAd?._id || gadgetAd?._id;

// Pick correct product image
const productImage =
  propertyAd?.propertyImage?.[0] ||
  petAd?.petsImage?.[0] || 
  agricultureAd?.agricultureImage?.[0] || 
  kidsAd?.kidsImage?.[0] || 
   serviceAd?.serviceImage?.[0] ||
   equipmentAd?.equipmentImage?.[0] ||
   gadgetAd?.gadgetImage?.[0] || 
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
          <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
            {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.horsePower} {vehicleAd.trim} {vehicleAd.year}  {vehicleAd.color}
          </span>
        )}
        {petAd && (
         <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {petAd.petType} {petAd.breed} {petAd.gender}
          </span>
        )}
        {agricultureAd && (
         <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {agricultureAd.title} {agricultureAd.agricultureType} {agricultureAd.condition}
          </span>
        )}
        {kidsAd && (
          <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {kidsAd.title} {kidsAd.condition} {kidsAd.color}
          </span>
        )}
        {serviceAd && ( 
          <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {serviceAd.serviceTitle} {serviceAd.serviceExperience}
          </span>
        )}
        {equipmentAd && (
          <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {equipmentAd.equipmentTitle} {equipmentAd.condition}
          </span>
        )}
        {gadgetAd && (
           <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
             {gadgetAd.gadgetTitle} {gadgetAd.condition}
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
          {kidsAd && (
             <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {kidsAd.title}
            </h2>  
          )}
          {petAd && (
            <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {petAd.petType}
            </h2>  
          )}
          {agricultureAd && (
            <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {agricultureAd.title}
            </h2> 
          )}
           {serviceAd && ( 
             <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {serviceAd.serviceTitle}
            </h2>  
          )}
          {equipmentAd && (
              <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {equipmentAd.equipmentTitle}
            </h2>  
          )}
          {gadgetAd && (
              <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
               {gadgetAd.gadgetTitle}
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
            <Img 
             src="/share.svg" 
             alt="Share" 
             width={44}
            height={44} 
            className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]" 
          />
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
       {petAd?.amount && (
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{petAd.amount?.toLocaleString()}</span>
       )}
       {agricultureAd?.amount && (
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{agricultureAd.amount?.toLocaleString()}</span>
       )}
       {kidsAd?.amount && (
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{kidsAd.amount?.toLocaleString()}</span>
       )}
        {serviceAd?.amount && ( 
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{serviceAd.amount?.toLocaleString()}</span>
       )}
       {equipmentAd?.amount && (
        <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{equipmentAd.amount?.toLocaleString()}</span>
       )}
       {gadgetAd?.amount && (
        <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{gadgetAd.amount?.toLocaleString()}</span>
       )}
     </div>
     {isNegotiable() && (
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
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Img
            src="/offerImg.svg"
            width={17.9}
            height={18}
            className="w-[17.9px] h-[18px]"
            alt="Send Offer"
          />
        </button>
      </div>
    ) : (
      <Button 
        onClick={() => setShowInput(true)}
        className="w-full md:w-[300px] h-[44px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] bg-[#5555DD]"
      >
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
           {petAd && (
           <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}>
            Pet Details
           </Button>
         )}

         {agricultureAd && (
          <Button 
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}
          >
           Agriculture & Food Details
          </Button>
         )}
          {kidsAd && (  
          <Button 
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}
          >
           Kids Product Details
          </Button>
         )}
         {serviceAd && ( 
          <Button 
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}
          >
           Service Details
          </Button>
         )}
         {equipmentAd && (
           <Button 
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}
          >
          Work & Equipment Details
          </Button>
         )}

          {gadgetAd && (
           <Button 
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
            activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
           }`}
           onClick={() => setActiveTab("car")}
          >
          Gadet Details 
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
           {petAd && (
            <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
           {agricultureAd && (
              <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
            {kidsAd && (  
              <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
            {serviceAd && ( 
              <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
            {equipmentAd && ( 
              <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
              onClick={() => setActiveTab("review")}>
              Review 
           </Button>
           )}
           {gadgetAd && ( 
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
              {petAd && (
                 <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                   {petAd.breed} - {petAd.petType}
               </h2>
              )}
              {agricultureAd && (
                 <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                   {agricultureAd.title} - {agricultureAd.agricultureType}
               </h2>
              )}
              {kidsAd && (  
                 <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                   {kidsAd.title} - {kidsAd.ageGroup}
               </h2>
              )}
              {serviceAd && ( 
                 <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                   {serviceAd.serviceTitle}
               </h2>
              )}
               {equipmentAd && ( 
                 <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                   {equipmentAd.equipmentTitle}
               </h2>
              )}
              {gadgetAd && (
                <h2 className="text-[#525252] text-[14px] md:text-[18px] font-[500] font-inter">
                 {gadgetAd.gadgetTitle}
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
                  {petAd && (
                   <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {petAd.viewCount} Views
                   </span>
                  )}
                  {agricultureAd && (
                     <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {agricultureAd.viewCount} Views
                   </span>
                  )}
                   {kidsAd && (  
                     <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {kidsAd.viewCount} Views
                   </span>
                  )}
                    {serviceAd && ( 
                     <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {serviceAd.viewCount} Views
                   </span>
                  )}
                    {equipmentAd && ( 
                     <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {equipmentAd.viewCount} Views
                   </span>
                  )}
                  {gadgetAd && (
                    <span className="text-[#868686] text-[14px] md:text-[14px] font-[400] font-inter whitespace-nowrap">
                      {gadgetAd.viewCount} Views
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
                  {petAd && (
                     <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {petAd.plan}
                    </Button>
                  )}
                  {agricultureAd && (
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {agricultureAd.plan}
                    </Button>
                  )}
                   {kidsAd && ( 
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {kidsAd.plan}
                    </Button>
                  )}
                   {serviceAd && ( 
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {serviceAd.plan}
                    </Button>
                  )}
                  {equipmentAd && ( 
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {equipmentAd.plan}
                    </Button>
                  )}
                  {gadgetAd && (
                    <Button className="bg-[#DFDFF9] py-2 px-3 
                    text-[#000087] text-[10px] md:text-[12px] 
                    font-inter capitalize font-[500] rounded-[4px]">
                      {gadgetAd.plan}
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


             {petAd && (
              <>
               {/* PetAd Posted Text */}
               <div>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(petAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                  })}
               </span>
               </div>
              </>
             )}

              {agricultureAd && (
              <>
               {/* PetAd Posted Text */}
               <div className=''>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(agricultureAd.createdAt).toLocaleDateString("en-US", {
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

             {kidsAd && (  
              <>
               <div>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(kidsAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                  })}
               </span>
               </div>
              </>
             )}

             {serviceAd && ( 
              <>
               <div>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(serviceAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                  })}
               </span>
               </div>
              </>
             )}
             {equipmentAd && ( 
              <>
               <div>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(equipmentAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                  })}
               </span>
               </div>
              </>
             )}
             {gadgetAd && (
              <>
               <div>
                <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(gadgetAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                  })}
               </span>
               </div>
              </>
             )}
          </div>

                 {petAd && (
           <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                Pet Details
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
                      Animal Type
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {petAd?.petType}
                    </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Breed</span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium  font-inter">
                      {petAd?.breed}
                    </span>
                 </div>
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">
                      Age
                    </span>
                   <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                     {petAd.age}
                    </span>
                 </div>

                 {/* Row 2 */}
                 <div className="flex flex-col w-[48%] md:w-[30%]">
                   <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Gender</span>
                   <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {petAd?.gender}
                     </span>
                 </div>
      {petAd?.healthStatus && petAd.healthStatus.length > 0 && (
  <div className="flex flex-col w-[48%] md:w-[30%]">
    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">Health Status</span>
    <div className="mt-2">
      {petAd.healthStatus.map((status, idx) => (
        <span key={idx} className="text-[#525252] text-[14px] md:text-[16px] font-medium font-inter block">
          {status}
        </span>
      ))}
    </div>
  </div>
)}
                </div>
              </div>
            )}
           </div>
           )}


            {agricultureAd && (
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Agriculture & Food Details 
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
                   {agricultureAd?.condition && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Condition
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {agricultureAd.condition}
                    </span>
                  </div>
                   )}

                  {/* Bulk Pruce Section */}
                  {agricultureAd?.bulkPrice?.length > 0 && (
                    <div className="bg-[#EDEDED] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
                    <span className="text-[#000087] font-[600] text-[14px] md:text-[18px]">
                      Bulk Prices
                    </span>
                    <div className="mt-2 space-y-2">
                      {agricultureAd.bulkPrice.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                      <span className="text-[#525252] font-medium font-inter text-[14px]">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-[#000087] font-semibold text-[14px]">
                      ₦{item.amountPerUnit.toLocaleString()}
                    </span>
                        </div>
                      ))}
                    </div>
                    <div>
                    </div>
                  </div>
                  )}
                  </div>
                </div>
              )}
            </div>
           )}

           
           {kidsAd && (  
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Kids Product Details 
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
                   {kidsAd?.condition && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Condition
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {kidsAd.condition}
                    </span>
                  </div>
                   )}
                   {kidsAd?.color && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Color
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {kidsAd.color}
                    </span>
                  </div>
                   )}
                   {kidsAd?.gender && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Gender
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {kidsAd.gender}
                    </span>
                  </div>
                   )}
                   {kidsAd?.ageGroup && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Age Group
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {kidsAd.ageGroup}
                    </span>
                  </div>
                   )}
                  </div>
                </div>
              )}
            </div>
           )}


           
           {serviceAd && ( 
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Service Details 
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
                   {serviceAd?.serviceDuration && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Duration
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {serviceAd.serviceDuration}
                    </span>
                  </div>
                   )}
                   {serviceAd?.serviceExperience && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Experience Level
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {serviceAd.serviceExperience}
                    </span>
                  </div>
                   )}
                   {serviceAd?.serviceAvailability && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Availability
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {serviceAd.serviceAvailability}
                    </span>
                  </div>
                   )}
                   {serviceAd?.yearOfExperience && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Years of Experience
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {serviceAd.yearOfExperience}
                    </span>
                  </div>
                   )}
                   {serviceAd?.pricingType && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Pricing Type
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {serviceAd.pricingType}
                    </span>
                  </div>
                   )}
                   {serviceAd?.serviceLocation && serviceAd.serviceLocation.length > 0 && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Service Location
                    </span>
                    <div className="mt-2">
                      {serviceAd.serviceLocation.map((loc, idx) => (
                        <span key={idx} className="text-[#525252] text-[14px] md:text-[16px] font-medium font-inter block">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                   )}
                  </div>
                </div>
              )}
            </div>
           )}
           
             {equipmentAd && ( 
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Work & Equipment Details 
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
                   {equipmentAd?.condition && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Equipment Condition
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {equipmentAd.condition}
                    </span>
                  </div>
                   )}
                   {equipmentAd?.powerSource && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Equipment Power Source 
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {equipmentAd.powerSource}
                    </span>
                  </div>
                   )}
                   {equipmentAd?.brand && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Equipment Brand
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {equipmentAd.brand}
                    </span>
                  </div>
                   )}
                   {equipmentAd?.usageType && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Equipment Usage 
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {equipmentAd.usageType}
                    </span>
                  </div>
                   )}
                     {equipmentAd?.negotiation && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Negotiation
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {equipmentAd.negotiation}
                    </span>
                  </div>
                   )}
                  </div>
                </div>
              )}
            </div>
           )}


              {gadgetAd && ( 
            <div className="bg-[#FAFAFA] md:w-[650px] h-auto md:rounded-[12px] p-8 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Gadget Details 
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
                   {gadgetAd?.condition && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                       Gadget Condition
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.condition}
                    </span>
                  </div>
                   )}
                   {gadgetAd?.gadgetBrand && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Gadget Brand 
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.gadgetBrand}
                    </span>
                  </div>
                   )}
                   {gadgetAd?.storageCapacity && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Gadget Storage Capacity
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.storageCapacity}
                    </span>
                  </div>
                   )}
                   {gadgetAd?.ram && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                     Gadget Ram
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.ram}
                    </span>
                  </div>
                   )}
                     {gadgetAd?.operatingSystem && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Gadget Operating System
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.operatingSystem}
                    </span>
                  </div>
                   )}
                    {gadgetAd?.simType && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                     Sim Type 
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.simType}
                    </span>
                  </div>
                   )}
                     {gadgetAd?.network && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Network
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.network}
                    </span>
                  </div>
                   )}
                     {gadgetAd?.batteryHealth && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Battery Health
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.batteryHealth}
                    </span>
                  </div>
                   )}
                  {gadgetAd?.accessories && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Gadget Accessories 
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.accessories}
                    </span>
                  </div>
                   )}
                   {gadgetAd?.warranty && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Warranty
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.warranty}
                    </span>
                  </div>
                   )}
                    {gadgetAd?.negotiation && (
                    <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Negotiation
                    </span>
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                      {gadgetAd.negotiation}
                    </span>
                  </div>
                   )}
                  </div>
                </div>
              )}
            </div>
           )}
           


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
              {petAd && (
                 <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {petAd?.description}
                </p>
              )}
              {agricultureAd && (
               <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {agricultureAd?.description}
                </p>  
              )}
              {kidsAd && (  
               <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {kidsAd?.description}
                </p>  
              )}
               {serviceAd && ( 
               <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {serviceAd?.description}
                </p>  
              )}
              {equipmentAd && (
                 <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {equipmentAd?.description}
                </p>   
              )}
              {gadgetAd && (
                <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {gadgetAd?.description}
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
        {petAd && (
        <span className="text-[#525252] md:text-[24px] font-[500] font-inter">₦{petAd.amount?.toLocaleString()}</span>
       )}
       {agricultureAd && (
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{agricultureAd.amount?.toLocaleString()}</span>
       )}
       {kidsAd && (  
         <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{kidsAd.amount?.toLocaleString()}</span>
       )}
        {serviceAd && ( 
         <span className="text-[#525252] text-[24px] font-[500] font-inter">
           {serviceAd.amount ? `₦${serviceAd.amount.toLocaleString()}` : serviceAd.pricingType || "Contact for pricing"}
         </span>
       )}
       {equipmentAd && ( 
          <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{equipmentAd.amount?.toLocaleString()}</span>
       )}
       {gadgetAd && (
        <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{gadgetAd.amount?.toLocaleString()}</span>
       )}
     </div>
     {isNegotiable() && (
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
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Img
            src="/offerImg.svg"
            width={17.9}
            height={18}
            className="w-[17.9px] h-[18px]"
            alt="Send Offer"
          />
        </button>
      </div>
    ) : (
      <Button 
        onClick={() => setShowInput(true)}
        className="md:w-[300px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] bg-[#5555DD]"
      >
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