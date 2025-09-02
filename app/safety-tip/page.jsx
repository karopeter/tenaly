"use client";
import BuyAnything from "../components/features/buy-anything";

export default function SafetyTip() {
    const buyerTips = [
        { text: "Meet in a Safe Location", desc: "Always arrange to meet sellers in public, well-lit places." },
        { text: "Verify the Item", desc: "Inspect the merchandise before you pay to ensure it meets your expectations." },
        { text: "Inspect Before Payment", desc: "Never pay for cars or properties you haven't thoroughly inspected." },
        { text: "Avoid Upfront Transfers", desc: "Do not send money without meeting the seller and seeing the item." },
        { text: "Bring a Trusted Person", desc: "It's best advised to always attend meetings with a trusted companion." },
        { text: "Test Drive / Property Tour", desc: "For cars, test drive and for apartments, tour the property before you buy. Don't let low offers tempt you." },
        { text: "🚨 Stay Safe, Stay Smart!" }
    ];

    const sellerTips = [
        { text: "Screen Buyers", desc: "Only deal with serious buyers, avoid wasting your time on fake offers." },
        { text: "Meet Safely", desc: "Arrange meetings in public spaces or offices where you'll feel secure." },
        { text: "Don't Hand Over Until Paid", desc: "For cars - don't transfer keys or documents until payment is confirmed and cleared." },
        { text: "Secure Payment Method", desc: "Prefer bank transfers or cash. For properties, long-term bank loans are best if pre-approved by banks first." },
        { text: "🚨 Stay Safe, Stay Smart!" }
    ];

    const generalSafetyTips = [
        { text: "Trust Your Instincts", desc: "If something feels wrong, walk away." },
        { text: "Use Tenaly's Verified Users", desc: "Look out for the \"Verified\" badge on profiles." },
        { text: "Report Suspicious Listings", desc: "If you spot unusual or fake ads, report them via the \"Report Listing\" button." },
        { text: "Keep Communications in Tenaly", desc: "Use in-app chat and calls to maintain your history and avoid being scammed." },
        { text: "Avoid Deals That Are Too Good to Be True", desc: "Fraudsters often lure victims with incredibly attractive offers. If it sounds unrealistic, it's probably a fraud." }
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

            {/* For Buyers and For Sellers - Side by Side */}
            <div className="w-full flex justify-center mt-10 px-4">
                <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-8">
                    
                    {/* For Buyers */}
                    <div className="flex-1 bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                        <h3 className="text-[#333333] font-inter font-[600] text-[18px] mb-6 text-center">
                            For Buyers
                        </h3>
                        <div className="space-y-4">
                            {buyerTips.map((tip, index) => (
                                <div key={index}>
                                    {tip.desc ? (
                                        <div>
                                            <div className="flex items-start">
                                                <span className="text-[#FF6B35] mr-2 font-bold">{index + 1}.</span>
                                                <div>
                                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">{tip.text}</span>
                                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – {tip.desc}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[#FF6B35] font-inter font-[500] text-[14px] text-center mt-4">
                                            {tip.text}
                                        </div>
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
                        <div className="space-y-4">
                            {sellerTips.map((tip, index) => (
                                <div key={index}>
                                    {tip.desc ? (
                                        <div>
                                            <div className="flex items-start">
                                                <span className="text-[#FF6B35] mr-2 font-bold">{index + 1}.</span>
                                                <div>
                                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">{tip.text}</span>
                                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – {tip.desc}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[#FF6B35] font-inter font-[500] text-[14px] text-center mt-4">
                                            {tip.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* General Safety Tips */}
            <div className="w-full flex justify-center mt-12 px-4">
                <div className="w-full max-w-[800px] bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                    <h3 className="text-[#333333] font-inter font-[600] text-[20px] mb-6 text-center">
                        General Safety Tips
                    </h3>
                    <div className="space-y-4">
                        {generalSafetyTips.map((tip, index) => (
                            <div key={index} className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">{tip.text}</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – {tip.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Safety Tips */}
            <div className="w-full flex justify-center mt-8 px-4">
                <div className="w-full max-w-[800px] bg-white border border-[#E5E5E5] rounded-[8px] p-6">
                    <h3 className="text-[#333333] font-inter font-[600] text-[20px] mb-6 text-center">
                        Additional Safety Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Trust Your Instincts</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – If something feels wrong, walk away.</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Use Tenaly's Verified Listings</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – Look out for the "Verified" badge on profiles.</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Report Suspicious Listings</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – Report suspected fake or unusual listings via the "Report" button.</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Keep Communications on Tenaly</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – Use in-app chat and calls to maintain your history and avoid being scammed.</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Beware Double-Check Documents</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – For cars and properties, always scrutinize all documents for authenticity before transactions.</span>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FF6B35] mr-3 font-bold">•</span>
                                <div>
                                    <span className="text-[#333333] font-inter font-[500] text-[14px]">Avoid Too-Good-to-be-True Deals</span>
                                    <span className="text-[#666666] font-inter font-[400] text-[14px]"> – Fraudsters often lure victims with unbelievably attractive offers.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BuyAnything />
        </section>
    );
}