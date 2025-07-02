"use client";
import BuyAnything from "../components/features/buy-anything";

export default function SafetyTip() {
    const buyerBenefits = [
        "✔Meet in a Safe Location – Always meet sellers in public, well-lit places",
         "✔Verify the Item – Inspect the car or property thoroughly before making payments.",
          "✔Avoid Upfront Payments – Never pay in advance before seeing the item.", 
           "✔Check Documentation – Ensure the necessary documents (car papers, property titles) are genuine.",
            "✔Beware of Unrealistic Deals – If an offer seems too good to be true, it probably is.",
            "🚨Stay Safe, Stay Smart!"
      ];
      
      const sellerBenefits = [
        "✔Screen Buyers Carefully – Verify buyer identity before sharing details.",
         "✔Meet in Public Places – Arrange meet-ups in secure locations.",
         "✔Use Secure Payment Methods – Prefer cash payments or verified bank transfers.",
         "✔Avoid Sharing Personal Details – Never share sensitive information like BVN or passwords.",
          "✔Report Suspicious Activities – If you suspect fraud, report it to Tenaly immediately.",
         "🚨Stay Safe, Stay Smart!"
      ];


    return (
      <section>
      <div
       className={`
         w-full 
         h-[305px] md:h-[275px]
         bg-no-repeat bg-center bg-cover
         bg-[url('/chisafe.svg')]
         md:bg-[url('/safetytip.svg')]
         flex items-center justify-center
       `}>
        <h1 className="text-[#FFFFFF] font-inter font-[500] text-[18px] md:text-[40px]">
        Safety Tips
        </h1>
      </div>

       <div className="w-full flex justify-center mt-10 px-4">
         <div className="border border-[#CDCDD7]  w-full max-w-[552px] h-auto rounded-[8px] pt-[20px] pb-[20px] pr-[40px] pl-[40px] flex flex-col items-center justify-center text-center">
           {/* Title */}
           <h3 className="text-[#525252] font-[500] mb-4 font-inter text-[16px] md:text-[24px]">
            For Buyers
          </h3>
         
           <div className="flex flex-col gap-3">
             {buyerBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start justify-start text-left">
              <span className="text-[#868686] font-inter font-[400] text-[14px] break-word">{benefit}</span>
            </div>
          ))}
           </div>
         </div>
       </div>

        <div className="w-full flex justify-center mt-10 px-4">
         <div className="border border-[#CDCDD7]  w-full max-w-[552px] h-auto rounded-[8px] pt-[20px] pb-[20px] pr-[40px] pl-[40px] flex flex-col items-center justify-center text-center">
           {/* Title */}
           <h3 className="text-[#525252] font-[500] mb-4 font-inter text-[16px] md:text-[24px]">
            For Sellers
          </h3>
         
           <div className="flex flex-col gap-3">
             {sellerBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start justify-start text-left">
              <span className="text-[#868686] font-inter font-[400] text-[14px] break-word">{benefit}</span>
            </div>
          ))}
           </div>
         </div>
       </div>

       <BuyAnything />
     </section>
    );
}