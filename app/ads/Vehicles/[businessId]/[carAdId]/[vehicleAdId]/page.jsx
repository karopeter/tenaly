"use client";
import { useEffect, useState } from 'react';
import { useParams  } from 'next/navigation';
import api from '@/services/api';
import Img from '@/app/components/Image';
import Link from "next/link";
import { carColors } from '@/app/lib/carData';
import Button from '@/app/components/Button';
import ReviewsDetailsPage from '@/app/components/features/reviews-details';
import SignUpModal from '@/app/hooks/signup-modal';
import { toast } from 'react-toastify';

export default function CarAdDetails() {
  const [activeTab, setActiveTab] = useState("car");
  const [showInput, setShowInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
    const { businessId, carAdId, vehicleAdId } = useParams();
    const [carAd, setCarAd] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [vehicleAd, setVehicleAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [business, setBusiness] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);


    useEffect(() => {
      const fetchAds = async  () => {
        setLoading(true);
        try {
         if (carAdId && carAdId !== "null") {
          const carRes = await api.get(`/carAdd/get-car-byId/${carAdId}`);
          setCarAd(carRes.data.ad || null);
         }
         if (vehicleAdId && vehicleAdId !== "null") {
          const vehicleRes = await api.get(`/vehicles/get-vehicle/${vehicleAdId}`);
          setVehicleAd(vehicleRes.data.data || null);
        }
        } catch (error) {
          setCarAd(null);
          setVehicleAd(null);
        } finally {
          setLoading(false);
        }
      };

      const fetchBusiness = async  () => {
        try {
          const res = await api.get('/business/my-businesses');
          const found = res.data.find(b => b._id === businessId);
          setBusiness(found || null);
        } catch (err) {
          setBusiness(null);
        }
      };

      const fetchProfile = async () => {
        try {
          const res = await api.get("/profile");
          setUserProfile(res.data);
        } catch {
           setUserProfile(null);
        }
      }


      fetchBusiness();
      fetchAds();
      fetchProfile();
    }, [carColors, vehicleAdId, businessId]);

    const handleSendOffer = () => {
      if (!offerAmount) return toast.error("Please enter an Amount");
      console.log("Offer sent:", offerAmount);
      setOfferAmount("");
    }


     if (loading) {
    return (
      <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
         <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading Vehicle Ads Details...</p>
        </div>
      </section>
    );
  }
   if (!carAd && !vehicleAd) return <div>Ad not found.</div>;

    return  (
      <div className="md:px-[104px] px-4 md:ml-10">
         <div className="mt-28 flex items-center gap-2 mb-4 text-[#868686] md:text-[14px] font-[400] font-inter flex-nowrap">
           <Link href="/Product-List" className="hover:text-[#000] transition-all whitespace-nowrap">
              Home&nbsp;&rsaquo;
           </Link>
         {carAd && (
           <span  className="text-[#000087] text-[14px] font-[500] font-inter whitespace-nowrap">
             {carAd.category}
           </span>
         )}
         {vehicleAd && (
          <span className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
            {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.horsePower} {vehicleAd.trim} {vehicleAd.year}  {vehicleAd.color}
          </span>
        )}
         </div>

         <div className="mt-5 container mx-auto flex flex-wrap items-center justify-center gap-4">
          <div className="flex-1">
            {vehicleAd && (
              <h2 className="text-[#525252] text-[14px] md:text-[24px] font-[500] font-inter">
                {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.horsePower} {vehicleAd.trim} {vehicleAd.year}  {vehicleAd.color}
              </h2>
            )}
          </div>
          <div className="flex items-center space-x-3">
         {/* <button className="cursor-pointer">
               <Img 
                 src="/bookmark.svg"
                 alt="BookMark"
                 width={44}
                 height={44}
                 className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
              />
            </button> */}
            <button 
             className="cursor-pointer"
             onClick={() => {
               const socialMediaSection = document.getElementById("social-media-section");
               if (socialMediaSection) {
                const offsettop = socialMediaSection.getBoundingClientRect().top + window.scrollY - 50;
                window.scrollTo({
                  top: offsettop,
                  behavior: "smooth"
                });
               }
             }}>
               <Img 
                src="/share.svg"
                alt="ShareIcon"
                width={44}
                height={44}
                className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"   
              />
            </button>
          </div>
         </div>
         <div className="flex flex-col md:flex-row gap-2 mt-6">
          {/* Large Main Image */}
          <div className="md:w-2/3 w-full relative">
           {carAd?.vehicleImage?.length > 0 && (
           <Img
            src={carAd?.vehicleImage[0]}
            alt="Car Ad Main"
            width={686}
            height={354}
           className="w-full h-auto md:w-[686px] md:h-[354px] object-cover rounded"
          />
          )}
          {/* Preparing for the admin side to know if it is sold or not */}
          {/* <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] transform -rotate-45 flex items-center justify-center">
            <Img src="/tick-circle.svg" alt="Tick Circle" width={16} height={16} className="mr-2" />
             <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
               Sold
             </span>
          </div> */}
        </div>
       {/* Smaller Image Grid */}
      <div className="md:w-1/3 w-full grid grid-cols-2 grid-rows-2 gap-2">
       {carAd.vehicleImage &&
         carAd.vehicleImage.slice(1, 5).map((img, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden">
          <Img
            src={img}
            alt={`Car Ad Small ${idx + 2}`}
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
       {vehicleAd && (
        <span className="text-[#525252] text-[24px] font-[500] font-inter">₦{vehicleAd.amount?.toLocaleString()}</span>
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
      <>
      </>
      )}
     </div>
   </div>
   </div>

   <div className="flex flex-col md:flex-row gap-x-[20px] md:mt-10">
     {/* Left Section */}
     <div className="flex-[1.5] pt-8">
      {/* Toggle Switch */}
      <div className="bg-[#FAFAFA] md:w-[650px] md:h-[44px] md:rounded-[4px]">
        <div className="flex space-x-4 mb-4">
          <Button
            className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
                  activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab("car")}>
             Car Details
          </Button>
          <Button
           className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
               activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
             }`}
            onClick={() => setActiveTab("review")}>
             Review
          </Button>
        </div>
      </div>

      <div>
         {activeTab === "car" ? (
          <>
           <div className="bg-[#FAFAFA] w-full md:w-[650px] h-auto  rounded-[12px] p-4 md:p-6 mt-5">
             <div className="flex flex-row justify-between w-full">
               {vehicleAd && (
               <h2 className="text-[#525252] text-[14px] md:text-[24px] font-[500] font-inter">
                {vehicleAd.vehicleType} {vehicleAd.model} {vehicleAd.horsePower} {vehicleAd.year}  {vehicleAd.color}
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
                 {vehicleAd && (
                   <Button
                 className="bg-[#DFDFF9] py-2 px-3 
                 text-[#000087] text-[10px] md:text-[12px] font-inter capitalize font-[500] rounded-[4px]">
                    {vehicleAd.plan}
               </Button>
                 )}
               </div>
             </div>

             {/* Car Details */ }
             <div className="flex flex-row gap-4 mt-2">
               <div className="flex items-center gap-2">
                <Img 
                  src="/car.svg" 
                  alt="Car" 
                  width={24} height={24} />
                {vehicleAd && (
                 <span className="text-[#868686] text-[12px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
                    {vehicleAd?.carType}
                 </span>
                 )}
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
                {vehicleAd && (
                 <span className="text-[#868686] text-[10px] md:text-[12px] font-[400] font-inter">
                  Posted on {new Date(vehicleAd.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
             </span>
                )}
             </div>
           </div>

           <div 
            className={`bg-[#FAFAFA] md:w-[650px] md:rounded-[12px] p-8 mt-4 transition-all duration-300 ${
              showDetails ? "h-auto" : "h-[70px] overflow-hidden"
             }`}>
             <div className="flex items-center justify-between">
               <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                 Car Details
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
                  {/* Row 1 */}
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">
                      Make
                    </span>
                    {vehicleAd && (
                    <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {vehicleAd?.vehicleType}
                    </span>
                    )}
                  </div>
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Model</span>
                    {vehicleAd && (
                      <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium  font-inter">
                      {vehicleAd?.model}
                    </span>
                    )}
                  </div>
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">
                      Manufacturing Year
                    </span>
                    {vehicleAd && (
                     <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {vehicleAd.year}
                     </span>
                    )}
                  </div>

                  {/* Row 2 */}
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Interior Color</span>
                    {vehicleAd && (
                     <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                       {vehicleAd?.interiorColor}
                     </span>
                    )}
                  </div>
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                    <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Condition</span>
                    {vehicleAd && (
                      <span  className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {vehicleAd.carType}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-[48%] md:w-[30%]">
                     <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">Color</span>
                     {vehicleAd && (
                      <span className="text-[#525252] mt-2 text-[14px] md:text-[16px] font-medium font-inter">
                        {vehicleAd.color}
                      </span>
                     )}
                  </div>
                </div>

                {/* Fifth Row */}
                <div className="flex gap-2 mt-4">
                   <div className="flex flex-col w-[48%] md:w-[33%]">
                     <span className="text-[#868686] text-[12px] md:text-[14px] font-medium  font-inter">
                        No of seats
                     </span>
                     {vehicleAd && (
                      <span className="text-[#525252] mt-2text-[14px] md:text-[16px]  font-medium font-inter">
                         {vehicleAd?.seat}
                      </span>
                     )}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[#868686] text-[12px] md:text-[14px] font-medium font-inter">Fuel Type</span>
                     {vehicleAd && (
                       <span className="text-[#525252] mt-2 text-[14px] md:text-[16px]  font-medium font-inter">
                           {vehicleAd.fuel}
                       </span>
                     )}
                   </div>
                </div>
              </div>
             )}
           </div>

            {/* Description Information */}
           <div className="bg-[#FAFAFA] w-full max-w-[650px] h-auto rounded-[12px] p-4 md:p-8 mt-4 mx-auto">
              <h3 className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
                More Info
              </h3>
              {vehicleAd && (
                <p className="text-[#868686] mt-2 text-[12px] md:text-[14px] font-[400] font-inter">
                  {vehicleAd?.description}
                </p>
              )}
           </div>
           
           {/* Business Store Address Section And business hour and time */}
      <div className="bg-[#FAFAFA] w-full max-w-[650px] h-auto rounded-[12px] p-4 md:p-8 mt-4 mx-auto">
       <h3 className="text-[#525252] text-[14px] md:text-[16px] font-[500] font-inter">
        Store Address
       </h3>
      {business ? (
    <div>
      {business.addresses && business.addresses.length > 0 ? (
        business.addresses.map((addr, idx) => {
          const hours = business.businessHours?.find(h => {
            const match = h.address.match(/address:\s*'([^']+)'/);
            return match && match[1] === addr.address;
          });
          return (
            <div key={addr._id}>
              {idx > 0 && <hr className="my-4 border-[#EDEDED]" />}
              <div className="">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                    <Img
                      src="/location.svg"
                      alt="Location Icon"
                      width={11.67}
                      height={16.67}
                      className="mr-2"
                    />
                    <span className="text-[#525252] text-[14px] font-inter font-[500]">{addr.address}</span>
                  </div>
                  </div>
                  <div className="hidden md:block mt-4 md:mt-0">
                     <Button
                    className="flex flex-col bg-[#F7F7FF] border border-[#DFDFF9] justify-center px-3 py-2 rounded-[4px] mt-2 md:mt-0 min-w-[120px]">
                    <div className="flex items-center">
                      <Img
                        src="/truck.svg"
                        alt="Truck Icon"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      {!addr.deliveryAvailable ? (
                        <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">No Delivery</span>
                      ) : (
                        <>
                          <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">Delivery Available</span>
                          {addr.deliverySettings && (
                            <span className="text-[12px] font-[400] font-inter text-[#000087] ml-2">
                              ({addr.deliverySettings.dayFrom} - {addr.deliverySettings.daysTo} days)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {addr.deliveryAvailable && addr.deliverySettings && (
                      <span className="text-[12px] font-[400] font-inter text-[#000087]">
                        ₦{addr.deliverySettings.feeFrom?.toLocaleString()} - ₦{addr.deliverySettings.feeTo?.toLocaleString()}
                      </span>
                    )}
                  </Button>
                  </div>
                </div>
              </div>
              <div className="mt-2 mb-2">
                <span className="text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">Working Hours</span>
                {hours ? (
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      {hours.days.map(day => (
                        <span 
                        key={day}
                        className="bg-[#F7F7FF] text-[#000087] text-[10px] md:text-[12px] font-[500] font-inter w-auto h-auto rounded-[4px] px-2 py-1">
                           {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Img
                        src="/clock.svg"
                        alt="Clock Icon"
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span className="text-[#525252] text-[12px] md:text-[14px] font-[500] font-inter">
                         {hours.openingTime} - {hours.closingTime}
                      </span>
                       <div className="flex items-center bg-[#E9F4E8] px-3 py-2 rounded-md">
                         <div className="w-[6px] h-[6px] bg-[#238E15] rounded-full mr-2"></div>
                        <span className="text-[#238E15] text-[12px] font-[500] font-inter">
                          Opened
                        </span>
                       </div>
                    </div>
                    
                    {/* Delivery Button (Mobile View) */ }
                    <div className="block md:hidden mt-4">
                     <Button
                       className="flex flex-col bg-[#F7F7FF] whitespace-nowrap border border-[#DFDFF9] justify-center px-3 py-2 rounded-[4px] mt-2 md:mt-0 min-w-[120px]">
                    <div className="flex items-center">
                      <Img
                        src="/truck.svg"
                        alt="Truck Icon"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      {!addr.deliveryAvailable ? (
                        <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">No Delivery</span>
                      ) : (
                        <>
                          <span className="text-[#000087] text-[12px] font-[500] font-inter whitespace-nowrap">Delivery Available</span>
                          {addr.deliverySettings && (
                            <span className="text-[12px] font-[400] font-inter text-[#000087] ml-2">
                              ({addr.deliverySettings.dayFrom} - {addr.deliverySettings.daysTo} days)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {addr.deliveryAvailable && addr.deliverySettings && (
                      <span className="text-[12px] font-[400] font-inter text-[#000087]">
                        ₦{addr.deliverySettings.feeFrom?.toLocaleString()} - ₦{addr.deliverySettings.feeTo?.toLocaleString()}
                      </span>
                    )}
                   </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">No working hours found for this address.</div>
                )}
              </div>
              {addr.deliverySettings?.explanation && (
                <strong className="text-[#868686] font-[700] text-[12px] font-inter">
                  Delivery Info: <span className="font-[400]">{addr.deliverySettings.explanation}</span>
                </strong>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-gray-400 text-sm">No address found.</div>
      )}
     </div>
     ) : (
    <div className="text-gray-400 text-sm">No business info found.</div>
    )}
    </div>
     </>
     ): (
     <>
     </>
     // <ReviewsDetailsPage />
     )}
    </div>
    </div>

     {/* Central Auto Cars and Safety Tips for Mobile View */}
    <div className="block md:hidden mt-4">
      {/* Central Auto Cars Section */}
     <div className="border-[1px] border-[#EDEDED] w-full rounded-[8px] p-4">
  <div className="flex gap-3 items-center">
    <Img
      src={userProfile?.image || "/profile-placeholder.png"}
      alt="Profile Image"
      width={52}
      height={52}
      className="w-[40px] h-[40px] rounded-full"
    />
    <div className="flex flex-col justify-center">
      <Link href="/" className="underline">
        <span className="text-[#000000] text-[14px] font-[500] font-inter">
          {business?.businessName || "Business Name"}
        </span>
      </Link>
      <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] h-[16px] rounded-[2px] px-2 w-fit">
        <Img
          src="/profile.svg"
          alt="Verified Icon"
          width={10}
          height={10}
          className="w-[10px] h-[10px]"
        />
        <span className="text-[#238E15] text-[10px] font-[500] font-inter">
          {userProfile?.isVerified ? "Verified" : "Unverified"}
        </span>
      </div>
      <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
        Last Seen 20h ago
      </span>
      <span className="text-[#868686] text-[10px] font-[400] font-inter">
        {userProfile?.createdAt
          ? `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}`
          : "Joined Tenaly"}
      </span>
    </div>
  </div>
  <div className="mt-4">
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
</div>
</div>

   {/* Right Section */}
     <div className="flex-[1] p-8">
      <div className="hidden md:block">
        <div className="bg-[#FAFAFA] md:w-[330px] md:h-[141px] md:rounded-[8px]">
     <div className="flex justify-between items-center p-4">
       <span className="text-[#525252] md:text-[15px] font-[400] font-inter">Price</span>
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
      <>
      </>
      )}
     </div>
   </div>
      </div>
       <div className="hidden md:block">
       <div 
  className="border-[1px] border-[#EDEDED] md:w-[330px] md:rounded-[8px] mt-5 p-4"
>
  <div className="flex gap-3 items-center">
    <Img
      src={userProfile?.image || "/profile-placeholder.png"}
      alt="Profile Image"
      width={52}
      height={52}
      className="md:w-[52px] md:h-[52px] rounded-full"
    />
    <div className="flex flex-col justify-center">
      <Link href="/" className="underline">
        <span className="text-[#000000] whitespace-nowrap md:text-[18px] font-[500] font-inter">
          {business?.businessName || "Business Name"}
        </span>
      </Link>
      <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8] h-[16px] rounded-[2px] px-2 w-fit">
        <Img
          src="/profile.svg"
          alt="Verified Icon"
          width={10}
          height={10}
          className="w-[10px] h-[10px]"
        />
        <span className="text-[#238E15] text-[10px] font-[500] font-inter">
          {userProfile?.isVerified ? "Verified" : "Unverified"}
        </span>
      </div>
      <span className="mt-1 text-[#868686] font-inter font-[400] md:text-[12px]">
        Last Seen 20h ago
      </span>
      <span className="text-[#868686] text-[10px] font-[400] font-inter">
        {userProfile?.createdAt
          ? `Joined Tenaly on ${new Date(userProfile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}`
          : "Joined Tenaly"}
      </span>
    </div>
  </div>
  <div className="mt-4">
    <Button
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] w-full md:w-[300px] h-[40px] md:h-[52px] md:rounded-[8px] text-[#FFFFFF] md:text-[16px] font-inter font-[500]"
    >
      <Img
        src="/call.svg"
        alt="Call Icon"
        width={20}
        height={20}
        className="w-[24px] h-[24px]"
      />
      {userProfile?.phoneNumber
        ? `Call ${userProfile.phoneNumber}`
        : "Call"}
    </Button>
  </div>
</div>
</div>
</div>
</div>
</div>
);
}