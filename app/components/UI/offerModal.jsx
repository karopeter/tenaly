"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/api";
import Button from "@/app/components/Button";
import Img from "@/app/components/Image";

const MakeOfferModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  productTitle, 
  originalPrice, 
  productImage, 
  sellerId,
  onOfferSent 
}) => {
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }

    if (parseFloat(offerAmount) >= originalPrice) {
      toast.error("Offer amount should be less than the original price");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/offers/make-offer/${productId}`, {
        offerAmount: parseFloat(offerAmount),
        message: message.trim()
      });

      if (response.data.success) {
        toast.success("Offer sent successfully!");
        onOfferSent?.(response.data.data);
        onClose();
        setOfferAmount("");
        setMessage("");
      }
    } catch (error) {
      console.error("Error making offer:", error);
      toast.error(error.response?.data?.message || "Failed to send offer");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const savings = originalPrice - parseFloat(offerAmount || 0);
  const savingsPercentage = originalPrice > 0 ? ((savings / originalPrice) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Make an Offer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Img
                src={productImage || "/placeholder-image.png"}
                alt={productTitle}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
                {productTitle}
              </h3>
              <p className="text-lg font-bold text-gray-900">
                ₦{originalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Offer Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Offer Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter your offer"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min="1"
                  required
                />
              </div>
              
              {/* Savings Display */}
              {offerAmount && parseFloat(offerAmount) > 0 && parseFloat(offerAmount) < originalPrice && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    💰 You'll save ₦{savings.toLocaleString()} ({savingsPercentage}%) if accepted
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Seller (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to strengthen your offer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">
                📋 Your offer will be sent directly to the seller and expires in 7 days. 
                The seller can accept, decline, or make a counter-offer.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading || !offerAmount || parseFloat(offerAmount) <= 0}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Offer"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeOfferModal;