"use client";
import Img from "../Image";
import Button from "../Button";

export default function PromoteAdModal({
  selectedPlan,
  onPlanSelect,
  onCancel,
  onConfirm,
  onClose,
  walletBalance = 0,
  isLoading = false, 
}) {
  const planDetails = {
    basic: { name: "Basic", amount: 15000, image: "/basic.svg" },
    premium: { name: "Premium", amount: 30000, image: "/premium-plan.svg" },
    vip: { name: "VIP", amount: 45000, image: "/medal-star.svg" },
    diamond: { name: "Diamond", amount: 60000, image: "/diamonds.svg" },
    enterprise: { name: "Enterprise", amount: 100000, image: "/crown3.svg" },
  };

  const selectedPlanCost = planDetails[selectedPlan]?.amount || 0;
  const hasWalletFunds = walletBalance >= selectedPlanCost;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="relative bg-white rounded-[24px] shadow-lg max-w-md w-full mx-4 flex flex-col md:h-[600px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex-1 overflow-y-auto p-6 pt-10 flex flex-col">
          <h2 className="text-[#525252] text-center font-[500] font-inter text-[18px] mb-2">
            Boost Your Ad for More Views
          </h2>
          <p className="text-[#767676] font-[400] font-inter text-[14px] mb-4 text-center">
            Get up to 5x more visibility by promoting your ad.
            <br className="hidden-xs" />
            Choose from our affordable plans.
          </p>

          {/* Wallet Balance Display */}
          {walletBalance > 0 && (
            <div className="bg-[#F0F9FF] border border-[#00A8DF] rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[#525252] font-[500] text-sm">Wallet Balance:</span>
                <span className="text-[#000087] font-[600] text-lg">
                  ₦{walletBalance.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="text-center">
            <h4 className="text-[#525252] text-[16px] font-[500] font-inter mb-4">
              Promote your Ad
            </h4>
            <p className="text-[#767676] text-[12px] font-[400] font-inter mb-6">
              You have reached your limit of free ad posting in vehicles
            </p>

            {Object.keys(planDetails).map((plan) => {
              const isSelected = selectedPlan === plan;
              const canAffordWithWallet = walletBalance >= planDetails[plan].amount;

              return (
                <div
                  key={plan}
                  onClick={() => onPlanSelect(plan)}
                  className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 mb-3 ${
                    isSelected
                      ? "border-[#000087] bg-[#F7F7FF]"
                      : "border-[#EDEDED] hover:border-[#000087] hover:bg-gray-50"
                  }`}
                >
                  <label htmlFor={plan} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <div
                      id={plan}
                      className={`w-5 h-5 border rounded flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-[#000087]" : "border-[#EDEDED]"
                      }`}
                    >
                      {isSelected && (
                        <Img
                          src="/icon-check.svg"
                          alt="Check"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      )}
                    </div>

                    <div className="w-8 h-8 flex-shrink-0">
                      <Img
                        src={planDetails[plan].image}
                        width={32}
                        height={32}
                        alt={`${plan} plan`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-left flex-1">
                      <span className="text-[#525252] font-inter font-[500] text-sm block">
                        {planDetails[plan].name}
                      </span>
                      {canAffordWithWallet && isSelected && (
                        <span className="text-[#00A8DF] text-xs">
                          Can pay from wallet
                        </span>
                      )}
                    </div>
                  </label>

                  <div className="text-right ml-4">
                    <span className="text-[#525252] font-inter font-[500] text-sm">
                      ₦{planDetails[plan].amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 flex justify-center gap-2 items-center border-t border-[#F0F0F0] bg-white rounded-b-[24px]">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center justify-center w-full md:w-[150px] 
            h-[44px] md:h-[52px] rounded-[8px] border border-[#CDCDD7] font-[500] 
            text-[14px] text-[#525252] whitespace-nowrap bg-white hover:bg-gray-50 px-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
               <svg className="animate-spin h-4 w-4 text-[#525252]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
               </svg>
               Processing...
              </span>
            ): "No, Post for free"}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="md:w-[280px] md:h-[52px] md:rounded-[8px] font-[500] md:text-[14px] whitespace-nowrap bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white hover:opacity-90"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                 </svg>
                 Processing...
              </span>
            ) : (hasWalletFunds ? "Continue to Payment" : "Yes, promote my ad")}
          </Button>
        </div>
      </div>
    </div>
  );
}