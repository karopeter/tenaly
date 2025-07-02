"use client";
import Img from "../Image";
import Button from "../Button";

export default function PromoteCommercialRentPropertyAdModal({ selectedPlan, handlePlanSelect, onPlanSelect, onCancel, onConfirm}) {
  const planDetails = {
  basic: { name: "Basic", amount: 15000, image: "/basic.svg" },
  premium: { name: "Premium", amount: 30000, image: "/premium-plan.svg" },
  vip: { name: "VIP", amount: 45000, image: "/medal-star.svg" },
  diamond: { name: "Diamond", amount: 60000, image: "/diamonds.svg" },
  enterprise: { name: "Enterprise", amount: 100000, image: "/crown3.svg" }
 };

 return (
  <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-[24px] shadow-lg max-w-md mx-4 p-6 w-full md:h-[600px]">
      <h2 className="text-[#525252] text-center font-[500] font-inter text-[18px]">Boost Your Ad for More Views</h2>
      <p className="text-[#767676] font-[400] font-inter text-[14px]">
        Get up to 5x more visibility by promoting your ad.
        <br className="hidden-xs" />
        Choose from our affordable plans.
      </p>

        <div className="text-center mt-4">
                <h4 className="text-[#525252] text-[16px] font-[500] font-inter mb-4">Promote your Ad</h4>
                <p className="text-[#767676] text-[12px] font-[400] font-inter mb-6">
                  You have reached your limit of free ad posting in vehicles
                </p>

                {Object.keys(planDetails).map((plan) => (
                <div
                  key={plan}
                 onClick={() => handlePlanSelect(plan)}
                className={`max-w-md mx-auto border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                selectedPlan === plan
                 ? "border-[#000087] bg-[#F7F7FF]"
                 : "border-[#EDEDED] hover:border-[#000087] hover:bg-gray-50"
               }`}>
              <label htmlFor={plan} className="flex items-center gap-3 flex-1 cursor-pointer">
                <div
                  id={plan}
                  className={`w-5 h-5 border rounded flex items-center justify-center flex-shrink-0 ${
                  selectedPlan === plan ? "border-[#000087]" : "border-[#EDEDED]"
                 }`}>
                {selectedPlan === plan && (
                  <Img
                   src="/icon-check.svg"
                   alt="Check"
                   width={4}
                   height={4}
                   className="w-4 h-4"
                 />
                )}
              </div>

            <div className="w-8 h-8 flex-shrink-0">
              <Img
                src={planDetails[plan].image}
                width={67}
                height={67}
                alt={`${plan} plan`}
                className="w-full h-full object-contain"
              />
            </div>

             <span className="text-[#525252] font-inter font-[500] text-sm truncate">
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </span>
            </label>

          <div className="text-right ml-4">
            <span className="text-[#525252] font-inter font-[500] text-sm">
              ₦{planDetails[plan].amount.toLocaleString()}
            </span>
             </div>
            </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2 items-center">
             <Button 
                onClick={onCancel} className="md:w-[121px] md:h-[52px] md:rounded-[8px] 
                  md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] border border-[#CDCDD7]
                  font-[500] md:text-[14px] text-[#525252]">
                No, Post for free
             </Button>
             <Button 
               onClick={onConfirm} className="md:w-[241px] md:h-[52px] md:rounded-[8px] 
                  md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
                  font-[500] md:text-[14px]  text-[#CDCDD7] 
                  bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                Yes, promote my ad
            </Button>
          </div>
    </div>
  </div>
 );
}