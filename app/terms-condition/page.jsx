"use client";
import BuyAnything from "../components/features/buy-anything";

export default function TermsConditions() {
    const buyersTerms = [
        "Meet in a Safe Location - Always meet sellers in public, well-lit places.",
        "Verify the Item - Inspect the car or property thoroughly before making payments.",
        "Aviod Upfront Payments - Never pay in advance before seeing the item.",
        "Check Documentation - Ensure the neccessary documents (car papers, property titles) are genuine.",
        "Beware of Unrealistic Deals - If an offer seems too good to be true, it probably is.",
        "🚨 Stay Safe, Stay Smart!"
    ];

    const sellersTerms = [
        "Screen Buyers Carefully - Verify buyer identity before sharing details.",
        "Meet in Public Places - Arrange meet-ups in secure locations.",
        "Use Secure Payment Methods - Prefer cash payments or verified bank transfers.",
        "Avios Sharing Personal Details - Never share sensitive information like BVN or passwords.",
        "Report Suspicious Activities - If you suspect fraud, report it to Tenaly immediately",
        "🚨 Stay Safe, Stay Smart!"
    ];

    const additionalTerms = [
        "Meet in a Safe Location - Always meet sellers in public, well-lit places.",
        "Verify the Item - Inspect the car or property thoroughly before meaking payments.",
        "Avoid Upfront Payments - Never pay in advance before seeing the item.",
        "Check Documentation - Ensure the neccassry documents (car papers, property titles) are genuine.",
        "Beware of Unrealistic Deals - If an offer seems to good to be true, it probably is.",
        "🚨 Stay Safe, Stay Smart!"
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
                    Terms & Conditions
                </h1>
            </div>

            {/* For Buyers and For Sellers - Side by Side */}
            <div className="w-full flex justify-center mt-10 px-4">
                <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-8">
                    
                    {/* For Buyers */}
                    <div className="flex-1 bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                        <h3 className="text-[#333333] font-inter font-[600] text-[18px] mb-6 text-center">
                            For Buyers
                        </h3>
                        <div className="space-y-3">
                            {buyersTerms.map((term, index) => (
                                <div key={index} className="flex items-start">
                                    {term.startsWith("🚨") ? (
                                        <div className="text-[#FF6B35] font-inter font-[500] text-[14px] w-full text-center mt-2">
                                            {term}
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-[#868686] mr-3 font-bold text-[16px]">✓</span>
                                            <span className="text-[#666666] font-inter font-[400] text-[14px] leading-relaxed">
                                                {term}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* For Sellers */}
                    <div className="flex-1 bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                        <h3 className="text-[#333333] font-inter font-[600] text-[18px] mb-6 text-center">
                            For Sellers
                        </h3>
                        <div className="space-y-3">
                            {sellersTerms.map((term, index) => (
                                <div key={index} className="flex items-start">
                                    {term.startsWith("🚨") ? (
                                        <div className="text-[#FF6B35] font-inter font-[500] text-[14px] w-full text-center mt-2">
                                            {term}
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-[#868686] mr-3 font-bold text-[16px]">✓</span>
                                            <span className="text-[#666666] font-inter font-[400] text-[14px] leading-relaxed">
                                                {term}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* For Buyers - Additional Section */}
            <div className="w-full flex justify-center mt-12 px-4">
                <div className="w-full max-w-[800px] bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                    <h3 className="text-[#333333] font-inter font-[600] text-[18px] mb-6 text-center">
                        For Buyers
                    </h3>
                    <div className="space-y-3">
                        {additionalTerms.map((term, index) => (
                            <div key={index} className="flex items-start">
                                {term.startsWith("🚨") ? (
                                    <div className="text-[#FF6B35] font-inter font-[500] text-[14px] w-full text-center mt-2">
                                        {term}
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-[#868686] mr-3 font-bold text-[16px]">✓</span>
                                        <span className="text-[#666666] font-inter font-[400] text-[14px] leading-relaxed">
                                            {term}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BuyAnything />
        </section>
    );
}