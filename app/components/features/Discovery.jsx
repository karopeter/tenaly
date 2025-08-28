import Button from "../Button";
import Img from "../Image";
import ComingSoonSection from "./comingSoon";

export default function TenalyDiscovery() {
    const backgroundImageUrl = "/wait.svg";
    const mobileBackgroundImageUrl = '/mobileWait.svg';
  return (
   <>
    <div className="px-4 md:px-0 mt-10">
      <div className="flex flex-col items-center gap-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-center w-full gap-2 mt-5">
          <Img
            src="/startNg.svg"
            alt="Star Icon"
            width={24}
            height={24}
            className="w-[24px] h-[24px] flex-shrink-0"
          />
          <span className="text-[15px] font-[400] text-[#000087] font-inter">
            Explore Tenaly amazing features
          </span>
        </div>

        {/* H2 Heading */}
        <h2 className="text-[#1F1F1F] font-[500] font-inter text-[32px]
          sm:text-[40px] text-center leading-tight">
          Discover Tenaly Advantage
        </h2>

        {/* Description Paragraph */}
        <p className="text-[#868686] text-[15px] font-[400] font-inter mt-1 text-center">
          Experience a smarter way to buy and sell — fast listings, verified users, and seamless transactions, all in one trusted platform.
        </p>
      </div>
    </div>
   {/* Verified Listing */}
   <div className="flex flex-col md:flex-row md:justify-center gap-8 mt-10 px-4 md:px-0">
     <div className="w-full h-auto md:w-[420px] rounded-[8px] p-[2px] border border-[#000087] md:h-[148px]">
      <div className="flex flex-col md:flex-row items-center gap-1 w-full h-full p-4 rounded-[8px]">
         <Img 
           src="/searchList.svg"
           alt="SearchList"
           width={100}
           height={100}
           className="w-[70px] h-[70px] object-contain" />
           {/* Text Section */ }
           <div className="text-center md:text-left w-full mt-5">
              <h1 className="text-[#1F1F1F] text-[18px] md:text-[24px] font-[500] font-inter">Verified Listings</h1>
              <p className="text-[#525252] text-[14px] font-[400] font-inter mt-2 break-words">
                Every listing is verified for authenticity. Buy and Sell with complete peace of mind.
              </p>
           </div>
      </div>
     </div>
      <div className="w-full h-auto md:w-[420px] rounded-[8px] p-[2px] border border-[#000087] md:h-[148px]">
      <div className="flex flex-col md:flex-row items-center gap-1 w-full h-full p-4 rounded-[8px]">
         <Img 
           src="/smart.svg"
           alt="SmartImg"
           width={100}
           height={100}
           className="w-[70px] h-[70px] object-contain" />
           {/* Text Section */ }
           <div className="text-center md:text-left w-full mt-5">
              <h1 className="text-[#1F1F1F] text-[18px] md:text-[24px] font-[500] font-inter">Smart Search</h1>
              <p className="text-[#525252] text-[14px] font-[400] font-inter mt-2 break-words">
               Advanced filters and recommendations help you find exactly what you are looking for.
              </p>
           </div>
      </div>
     </div>
   </div>

   <div className="flex flex-col md:flex-row md:justify-center gap-8 mt-5 px-4 md:px-0">
     <div className="w-full h-auto md:w-[420px] rounded-[8px] p-[2px] border border-[#000087] md:h-[148px]">
      <div className="flex flex-col md:flex-row items-center gap-1 w-full h-full p-4 rounded-[8px]">
         <Img 
           src="/direct.svg"
           alt="DirectImg"
           width={100}
           height={100}
           className="w-[70px] h-[70px] object-contain" />
           {/* Text Section */ }
           <div className="text-center md:text-left w-full mt-5">
              <h1 className="text-[#1F1F1F] text-[18px] md:text-[24px] font-[500] font-inter">Direct Communication</h1>
              <p className="text-[#525252] text-[14px] font-[400] font-inter mt-2 break-words">
                Connect directly with buyers and sellers through our secure messaging platform.
              </p>
           </div>
      </div>
     </div>
      <div className="w-full h-auto md:w-[420px] rounded-[8px] p-[2px] border border-[#000087] md:h-[148px]">
      <div className="flex flex-col md:flex-row items-center gap-1 w-full h-full p-4 rounded-[8px]">
         <Img 
           src="/musical.svg"
           alt="Muscial Image"
           width={100}
           height={100}
           className="w-[70px] h-[70px] object-contain" />
           {/* Text Section */ }
           <div className="text-center md:text-left w-full mt-5">
              <h1 className="text-[#1F1F1F] text-[18px] md:text-[24px] font-[500] font-inter">Expert Support</h1>
              <p className="text-[#525252] text-[14px] font-[400] font-inter mt-2 break-words">
               Our team of experts is here to help you every step of the way 24/7
              </p>
           </div>
      </div>
     </div>
   </div>

  <section className="bg-[#F7F7FF] w-full h-auto md:h-[800px] px-4 sm:px-6 md:px-8 mt-20 pt-20">
  <div className="text-center flex flex-col items-center">
    <h2 className="text-[#1F1F1F] font-inter font-[500] text-[18px] md:text-[40px]">
      Coming Soon to More Countries!!!
    </h2>
    <p className="text-[#868686] font-[400] text-[14px] md:text-[15px] font-inter mt-2 max-w-2xl">
      We're expanding beyond Nigeria to connect even more buyers and sellers across Africa beyond. Stay tuned as Tenaly goes global.
    </p>
  </div>

  <div className="flex justify-center">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
      {[
        { src: "/ghana.svg", label: "Ghana" },
        { src: "/cameroon.svg", label: "Cameroon" },
        { src: "/southAfrica.svg", label: "South Africa" },
        { src: "/kenya.svg", label: "Kenya" },
        { src: "/rawanda.svg", label: "Rwanda" },
        { src: "/egypt.svg", label: "Egypt" },
        { src: "/morroco.svg", label: "Morroco" },
      ].map((country, index) => (
        <div key={index} className="flex flex-col items-center">
          <Img
            src={country.src}
            alt={country.label}
            width={290}
            height={268}
            className="w-[168.5px] h-[140px] md:w-[245px] md:h-[200px] rounded-[8px] object-cover"
          />
          <h3 className="text-center mt-2 text-[#525252] font-[500] text-sm md:text-[18px] font-inter">
            {country.label}
          </h3>
        </div>
        ))}
      </div>
     </div>
   </section>


    <section 
      className="relative w-full flex items-center justify-center bg-cover 
      bg-no-repeat bg-center md:mt-0 
      min-h-[591px] md:min-h-[662px] px-4 sm:px-6 md:px-8"
      style={{ 
        backgroundImage: `url(${mobileBackgroundImageUrl})` 
      }}>
     {/* This will override the background on md and up */}
    <div 
      className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center"
      style={{ 
       backgroundImage: `url(${backgroundImageUrl})` 
      }}></div>
     <div className="relative z-10">
      <ComingSoonSection />
    </div>
   </section>

    <section
      className={`
       w-full flex items-center justify-center bg-cover bg-no-repeat bg-center
       px-4 sm:px-6 md:px-8
       min-h-[227px]
       bg-[url('/footerMobile.svg')] md:bg-[url('/footerDesk.svg')]
     `}>
    </section>
    </>
  );
}
