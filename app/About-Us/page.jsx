"use client";
import BuyAnything from "../components/features/buy-anything";
import Img from "../components/Image";

export default function AboutUsPage() {
     return (
       <div className="mt-28 px-4 md:px-0">
        <div className="text-center mb-8">
          <h2 className="text-[#525252] font-inter font-[500] text-[18px] md:text-[32px]">Connecting Buyers and Sellers Seamlessly</h2>
          <span className="text-[#767676] font-[400] font-inter text-[14px]">
             Tenaly is a trusted online marketplace for buying and selling vehicles 
             <br className="hidden-xs" />
             and real estate with ease, security and convenience.
          </span>
        </div>
       
        <div
        className={`
          w-full 
          h-[250px] rounded-[12px] md:h-[384px] 
          bg-no-repeat bg-center bg-contain md:bg-cover 
          bg-[url('/mobile-connects.svg')] 
          md:bg-[url('/connectBuyers.svg')] 
          max-w-[1000px] mx-auto
        `}
      ></div>

      {/* Flex Section: Who We Are */}
       <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-12 max-w-[1000px] mx-auto mt-10 px-4 md:px-0">
          {/* Left side - Title */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-#000000] font-[500] font-inter text-[18px] md:text-[32px]">
              Who we are?
            </h1>
          </div>

          {/* Right side - Description */}
          <div className="w-full md:w-1/2 text-left">
           <p className="text-[#767676] font-[400] text-[12px] font-inter">
            At Tenaly, we believe in simplifying the buying and selling experience for Cars
            <br className="hidden-xs" />
            and real estate. Our platform is designed to connect sellers with potential
            <br className="hidden-xs" />
            buyers efficiently, providing a secure and user-friendly experience.
           </p>
          </div>
       </div>

       {/* Image Pair Section */}
       <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mt-6 md:mt-10 max-w-[1000px] mx-auto px-4 md:px-0">
         <Img 
           src="/mission.svg"
           width={521.5}
           height={242}
           className="rounded-[24px] md:w-[521px] md:h-[242px] w-[361px] object-cover h-[206px]"
         />
         <Img 
           src="/vision.svg"
           width={521.5}
           height={242}
           className="rounded-[24px] md:w-[521px] md:h-[242px] w-[361px] object-cover h-[206px]"
         />
       </div>

        {/* Tenaly Advantage */}
       <div
        className={`
           w-full 
           h-[1114px] md:h-[500px] 
           mt-10
           md:mt-20
           bg-no-repeat bg-center bg-cover 
           bg-[url('/mobileAdvantage.svg')] 
           md:bg-[url('/desktopAdvantage.svg')]
        `}>
       {/* Add your content here (like text, images, etc.) */}
     </div>

     <div className="mt-10">
         <h2 className="text-center text-[#000000] font-inter font-[500] text-[18px] md:text-[32px]">Customers success stories</h2>
     </div>
      <div className="mt-20">
        <BuyAnything />
      </div>
    </div>
    );
}