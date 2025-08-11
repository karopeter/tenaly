"use client";
import Img from "../Image";
import Button from "../Button";

export default function WalletPaymentModal({
  selectedPlan,
  planAmount,
  walletBalance,
  onWalletPayment,
  onPaystackPayment,
  onCancel,
  onClose,
}) {
  const hasInsufficientFunds = walletBalance < planAmount;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-[24px] shadow-lg max-w-md mx-4 w-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <div className="text-center">
          <h2 className="text-[#525252] font-[500] font-inter text-[18px] mb-2">
            Choose Payment Method
          </h2>
          <p className="text-[#767676] font-[400] font-inter text-[14px] mb-4">
            You selected {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan for ₦{planAmount.toLocaleString()}
          </p>

          {/* Wallet Balance Display */}
          <div className="bg-[#F7F7FF] border border-[#E5E7EB] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Img
                  src="/wallet.svg"
                  alt="Wallet"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="text-[#525252] font-[500] text-sm">Wallet Balance</span>
              </div>
              <span className="text-[#000087] font-[600] text-lg">
                ₦{walletBalance.toLocaleString()}
              </span>
            </div>
            {hasInsufficientFunds && (
              <p className="text-[#EF4444] text-sm mt-2">
                Insufficient funds. You need ₦{(planAmount - walletBalance).toLocaleString()} more.
              </p>
            )}
          </div>

          {/* Payment Options */}
          <div className="space-y-3 mb-6">
            {/* Wallet Payment Option */}
            <button
              onClick={onWalletPayment}
              disabled={hasInsufficientFunds}
              className={`w-full border rounded-lg p-4 flex items-center justify-between transition-all duration-300 ${
                hasInsufficientFunds
                  ? "border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed opacity-50"
                  : "border-[#000087] bg-[#F7F7FF] hover:bg-[#EEEEFF] cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#000087] rounded-full flex items-center justify-center">
                  <Img
                    src="/wallet-money.svg"
                    alt="Wallet"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[#525252] font-[500] text-sm block">
                    Pay from Wallet
                  </span>
                  <span className="text-[#767676] text-xs">
                    {hasInsufficientFunds ? "Insufficient balance" : "Instant payment"}
                  </span>
                </div>
              </div>
              <span className="text-[#000087] font-[500] text-sm">
                ₦{planAmount.toLocaleString()}
              </span>
            </button>

            {/* Paystack Payment Option */}
            <button
              onClick={onPaystackPayment}
              className="w-full border border-[#EDEDED] rounded-lg p-4 flex items-center justify-between hover:border-[#000087] hover:bg-[#F7F7FF] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00A8DF] rounded-full flex items-center justify-center">
                  <Img
                    src="/debitCard.png"
                    alt="Card"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </div>
                <div className="text-left">
                  <span className="text-[#525252] font-[500] text-sm block">
                    Pay with Card/Bank
                  </span>
                  <span className="text-[#767676] text-xs">
                    Secure payment via Paystack
                  </span>
                </div>
              </div>
              <span className="text-[#525252] font-[500] text-sm">
                ₦{planAmount.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              className="flex-1 h-[48px] rounded-[8px] border border-[#CDCDD7] font-[500] text-[14px] text-[#525252] bg-white hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}