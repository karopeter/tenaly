"use client";
import React from "react";
import Button from "../components/Button";

export default function TransactionDetailsContent({ transaction, onBack }) {
  // Handle share receipt functionality
  const handleShareReceipt = async () => {
    const receiptText = `
Transaction Receipt
------------------
Amount: ₦${Number(transaction.amount).toLocaleString()}
Order Amount: ₦${Number(transaction.amount).toLocaleString()}
Fee: ₦0.00
Transaction Type: ${getTransactionType(transaction.type)}
Date: ${formatDate(transaction.paymentDate)}
Transaction ID: ${transaction.reference}
Status: Successful
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transaction Receipt',
          text: receiptText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(receiptText);
      }
    } else {
      fallbackShare(receiptText);
    }
  };

  // Fallback share method
  const fallbackShare = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Receipt copied to clipboard!');
    }).catch(() => {
      alert('Unable to share receipt');
    });
  };

  // Handle download receipt functionality
  const handleDownloadReceipt = () => {
    const receiptContent = `
Transaction Receipt
==================
Amount: ₦${Number(transaction.amount).toLocaleString()}
Order Amount: ₦${Number(transaction.amount).toLocaleString()}
Fee: ₦0.00
Transaction Type: ${getTransactionType(transaction.type)}
Date: ${formatDate(transaction.paymentDate)}
Transaction ID: ${transaction.reference}
Status: Successful
Time: ${formatDateTime(transaction.paymentDate)}

Thank you for your transaction!
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.reference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy transaction ID to clipboard
  const copyTransactionId = () => {
    navigator.clipboard.writeText(transaction.reference).then(() => {
      alert('Transaction ID copied to clipboard!');
    }).catch(() => {
      alert('Unable to copy transaction ID');
    });
  };

  // Get transaction type display text
  const getTransactionType = (type) => {
    return type === "credit" ? "Wallet Top up" : "Premium Service";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Format date and time for receipt
  const formatDateTime = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get transaction status
  const getTransactionStatus = () => {
    // Assuming successful transactions since they're in the wallet
    return "Successful";
  };

  if (!transaction) {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-4 md:p-8 w-full">
        <div className="text-center text-[#525252]">
          <p>Transaction not found</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-4 md:p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#525252] text-[14px] font-inter font-[400] hover:text-[#5555DD] transition-colors"
        >
          <span className="mr-2">←</span>
          Go back
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-[#525252] font-[500] text-[18px] font-inter">
          Transaction Details
        </h2>
        <p className="text-[#525252] font-[400] text-[12px] font-inter mt-2">
          You can top up your wallet and use it to subscribe for Premium Services.
        </p>
      </div>

      {/* Success Status and Icon */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-600 text-[12px] font-inter font-[500]">
            Successful
          </span>
        </div>
        
        {/* Transaction Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#5555DD] rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center">
              <span className="text-white text-lg">💳</span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <p className="text-[#525252] font-[600] text-[24px] font-inter">
          ₦{Number(transaction.amount).toLocaleString()}
        </p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4 mb-8">
        {/* Order Amount */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[#868686] text-[14px] font-inter font-[400]">
            Order Amount
          </span>
          <span className="text-[#525252] text-[14px] font-inter font-[500]">
            ₦{Number(transaction.amount).toLocaleString()}
          </span>
        </div>

        {/* Fee */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[#868686] text-[14px] font-inter font-[400]">
            Fee
          </span>
          <span className="text-[#525252] text-[14px] font-inter font-[500]">
            ₦0.00
          </span>
        </div>

        {/* Transaction Type */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[#868686] text-[14px] font-inter font-[400]">
            Transaction Type
          </span>
          <span className="text-[#525252] text-[14px] font-inter font-[500]">
            {getTransactionType(transaction.type)}
          </span>
        </div>

        {/* Date */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[#868686] text-[14px] font-inter font-[400]">
            Date
          </span>
          <span className="text-[#525252] text-[14px] font-inter font-[500]">
            {formatDateTime(transaction.paymentDate)}
          </span>
        </div>

        {/* Transaction ID */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-[#868686] text-[14px] font-inter font-[400]">
            Transaction ID
          </span>
          <div className="flex items-center">
            <span className="text-[#525252] text-[14px] font-inter font-[500] mr-2">
              {transaction.reference}
            </span>
            <button
              onClick={copyTransactionId}
              className="text-[#5555DD] hover:text-[#4444CC] transition-colors"
              title="Copy Transaction ID"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleShareReceipt}
          className="border border-[#5555DD] text-[#5555DD] bg-white rounded-[8px] 
                     text-[14px] font-[500] font-inter w-full h-[44px] hover:bg-[#5555DD] 
                     hover:text-white transition-colors flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
          </svg>
          Share Receipt
        </Button>

        <Button
          onClick={handleDownloadReceipt}
          className="bg-[#5555DD] text-white rounded-[8px] text-[14px] font-[500] 
                     font-inter w-full h-[44px] hover:bg-[#4444CC] transition-colors 
                     flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download Receipt
        </Button>
      </div>
    </div>
  );
}