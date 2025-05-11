"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { trends } from "../../lib/constants";
import { notFound } from "next/navigation";
import Img from "../../components/Image";
import Button from "../../components/Button";
import CarDetailsPage from "../../components/features/car-details";
import ReviewsDetailsPage from "../../components/features/reviews-details";
import CarDetailsInfo from "../../components/features/card-details-info";
import MoreCarInfo from "../../components/features/more-car-info";
import CarSuggestion from "../../components/features/car-suggestion";
import MessageSellerButton from "@/app/components/UI/messageSeller";
import SignUpModal from "@/app/hooks/signup-modal";
import SignInModal from "@/app/hooks/signin-modal";

export default function CarProductDetails({ params, sellerId }) {
  const [activeTab, setActiveTab] = useState("car");
  const [product, setProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // State to toggle CarDetailsInfo visibility
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params; // Unwrap the params promise
      const { id } = resolvedParams;
      const foundProduct = trends.market.find((item) => item.id.toString() === id);
      setProduct(foundProduct);

      if (!foundProduct) {
        notFound();
      }
    }

    fetchParams();
  }, [params]);

  if (!product) {
    return <div>Loading...</div>; // Show a loading state while params are being resolved
  }

  return (
    <div className="md:px-[104px] px-4 md:ml-10">
      <div className="mt-28 flex items-center gap-2 mb-4 text-[#868686] md:text-[14px] font-[400] font-inter flex-nowrap">
       {(product.home || product.cars) && (
        <Link href="/" className="hover:text-[#000] transition-all whitespace-nowrap">
         {product.home}&nbsp;&rsaquo;
       </Link>
      )}
      {product.cars && (
        <Link href="/cars" className="hover:text-[#000] transition-all whitespace-nowrap">
         {product.cars}&nbsp;&rsaquo;
      </Link>
     )}
     <h4 className="text-[#000087] text-[13px] md:text-[14px] font-[500] font-inter whitespace-nowrap">
       {product.titleProduct}
     </h4>
    </div>
    <div className="mt-5 container mx-auto flex flex-wrap items-center justify-between gap-4">
  <div className="flex-1">
    <h2 className="text-[#525252] text-[14px] md:text-[24px] font-[500] font-inter">
      {product.titleProduct}
    </h2>
  </div>
  <div className="flex items-center space-x-3">
    {product.bookMark && (
      <button className="cursor-pointer">
        <Img
          src={product.bookMark}
          alt="BookMark"
          width={44}
          height={44}
          className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
        />
      </button>
    )}
    {product.shareIcon && (
      <button
        className="cursor-pointer"
        onClick={() => {
          const socialMediaSection = document.getElementById("social-media-section");
          if (socialMediaSection) {
            const offsettop = socialMediaSection.getBoundingClientRect().top + window.scrollY - 50;
            window.scrollTo({
              top: offsettop,
              behavior: "smooth",
            });
          }
        }}
      >
        <Img
          src={product.shareIcon}
          alt="ShareIcon"
          width={44}
          height={44}
          className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
        />
      </button>
      )}
    </div>
  </div>
      <div className="flex flex-col md:flex-row gap-2 mt-6">
        {/* Large Main Image */}
        <div className="md:w-2/3 w-full relative">
          {product.firstImg && (
            <>
            <Img
              src={product.firstImg}
              alt="Main"
              width={686}
              height={354}
              className="w-full h-auto md:w-[686px] md:h-[354px] object-cover rounded"
            />
            {/* Sold Badge */ }
            {product.isSold && (
            <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] transform -rotate-45 flex items-center justify-center">
             <Img src="/tick-circle.svg" alt="Tick Circle" width={16} height={16} className="mr-2" />
             <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
               Sold
             </span>
           </div>
            )}
            </>
          )}
        </div>

        {/* Smaller Image Grid */}
        <div className="md:w-1/3 w-full grid grid-cols-2 grid-rows-2 gap-2">
          {[product.secondImg, product.thirdImg, product.fourthImg, product.fifthImg].map((img, index) => (
            <div key={index} className="w-full h-full overflow-hidden">
              {product.secondImg && (
                <Img
                  src={img}
                  alt={`Image ${index + 2}`}
                  width={265}
                  height={177}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>

   {/* Price and Make Offer Section for Mobile View */}
   <div className="block md:hidden mt-4">
     <div className="bg-[#FAFAFA] w-full rounded-[8px]">
        <div className="flex justify-between items-center p-4">
        <span className="text-[#525252] text-[15px] font-[400] font-inter">Price</span>
       <span className="text-[#525252] text-[24px] font-[500] font-inter">₦8,000,000</span>
    </div>
    <div className="p-4">
      <Button
        disabled={product.isSold}
        className={`w-full py-3 rounded-[8px] text-[#FFFFFF] font-inter font-[500] text-[14px] ${
          product.isSold
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#5555DD]"
        }`}
      >
        Make Offer
      </Button>
    </div>
  </div>
</div>

      
      {product.hide && (
        <div className="flex flex-col md:flex-row gap-x-[20px]  md:mt-10">
        {/* Left Section */}
        <div className="flex-[1.5] p-8">
          {/* Toggle Switch */}
          <div className="bg-[#FAFAFA] md:w-[650px] md:h-[44px] md:rounded-[4px]">
            <div className="flex space-x-4 mb-4">
              {product.carDetails && (
                <Button
                  className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
                    activeTab === "car" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab("car")}
                >
                  {product.carDetails}
                </Button>
              )}
      
              {product.reviews && (
                <Button
                  className={`py-2 px-4 min-w-[120px] h-[40px] md:h-[44px] rounded-tl-[4px] whitespace-nowrap rounded-tr-[4px] text-center ${
                    activeTab === "review" ? "bg-[#DFDFF9] text-[#000087]" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveTab("review")}
                >
                  {product.reviews}
                </Button>
              )}
            </div>
          </div>
      
          <div>
            {activeTab === "car" ? (
              <>
                {/* Car Details Components */}
                <CarDetailsPage specs={product.specs} />
      
                {/* Show More Section */}
                <div className="bg-[#FAFAFA] md:w-[650px] md:h-[285px] md:rounded-[12px] p-8 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#525252] md:text-[16px] font-inter font-[500]">
                      {product.carDetails}
                    </span>
      
                    <div className="flex items-center space-x-2">
                      <span className="text-[#000087] text-[16px] font-[400] font-inter">
                        {product.more}
                      </span>
                      <button onClick={() => setShowDetails(!showDetails)} aria-expanded={showDetails}>
                      <Img
                        src={showDetails ? product.updropImg : product.dropImg}
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
                      <CarDetailsInfo specs={product.specs} />
                    </div>
                  )}
                </div>
      
                {/* More Car Info */}
                <div>
                  <MoreCarInfo specs={product.specs} />
                </div>
              </>
            ) : (
              <>
                {/* Reviews Components */}
                <ReviewsDetailsPage specs={product.specs} />
              </>
            )}
            {/* Car Suggestions */}
            <div className="hidden md:block">
            <CarSuggestion specs={product.specs} />
            </div>
          </div>
        </div>

     {/* Central Auto Cars and Safety Tips for Mobile View */}
    <div className="block md:hidden mt-4">
      {/* Central Auto Cars Section */}
     <div className="border-[1px] border-[#EDEDED] w-full rounded-[8px] p-4">
       <div className="flex gap-3">
       <Img
        src="/auto.svg"
        alt="Auto Img"
        width={52}
        height={52}
        className="w-[40px] h-[40px]"
      />
      <div className="flex flex-col">
        <span className="text-[#000000] text-[14px] font-[500] font-inter">
          Central Auto Cars
        </span>
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
        <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
          Last Seen 20h ago
        </span>
        <span className="mt-1 text-[#868686] text-[10px] font-[400] font-inter">
          Joined Tenaly on March 2020 (2y 4m)
        </span>
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
        Call 07062462468
      </Button>
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
       <span className="text-[#525252] md:text-[24px] font-[500] font-inter">₦8,000,000</span>
     </div>
     <div className="p-4">
        <Button
          disabled={product.isSold}
          className={`md:w-[300px] md:h-[53px] md:rounded-[8px] text-[#FFFFFF] font-inter font-[500] md:text-[16px] ${
           product.isSold
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#5555DD]"
         }`}>
         Make Offer
      </Button>
     </div>
   </div>
   </div>
      <div className="hidden md:block">
      <div 
        className="border-[1px] border-[#EDEDED] md:w-[330px]
         md:h-[276px] md:rounded-[8px] mt-5 p-4">
         <div className="flex  gap-3">
            <Img 
             src="/auto.svg"
             alt="Auto Img"
             width={52}
             height={52}
             className="md:w-[52px] md:h-[52px]"/>
             <div className="flex flex-col">
             <span className="text-[#000000] md:text-[18px] font-[500] font-inter">
               Central Auto Cars
             </span>
            <div className="mt-1 flex items-center gap-2 bg-[#E9F4E8]  md:w-[93px] md:h-[16px] md:rounded-[2px]">
              <Img 
                src="/profile.svg"
                alt="Verified Icon"
                width={10}
                height={10}
                className="w-[10px] h-[10px] ml-1"/>
                <span 
                  className="md:text-[#238E15] font-[500] md:text-[10px] font-inter">
                    Verified User
                 </span>
            </div>
            <span className="mt-1 text-[#868686] font-inter font-[400] md:text-[12px]">Last Seen 20h ago</span>
            <span className="mt-1 text-[#868686] font-[400] md:text-[12px] font-inter">Joined Tenaly on March 2020 (2y 4m)</span>
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
                  Call 07062462468
              </Button>
            </div>
            <div className="mt-2">
              <MessageSellerButton 
               sellerId={sellerId}
               openAuthModal={() => setShowSignInModal(true)}
              />

             {showSignInModal && (
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
           )}
            </div>
          </div>

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
         <div className="block md:hidden">
          <CarSuggestion specs={product.specs} />
        </div>
      </div>
      </div>
      )}
    </div>
  );
}