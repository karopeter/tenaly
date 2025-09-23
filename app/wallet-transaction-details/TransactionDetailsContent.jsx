"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import api from "@/services/api";
import { ArrowLeft } from "lucide-react";
import Img from "../components/Image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TransactionDetails() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const transactionRef = params.reference;

  useEffect(() => {
    fetchTransactionDetails();
  }, [transactionRef, token]);

  const fetchTransactionDetails = async () => {
    if (!token || !transactionRef) {
      setLoading(false);
      return;
    }

    try {
      const profileRes = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const walletTransactions = profileRes.data.walletTransactions || [];
      const foundTransaction = walletTransactions.find(
        (txn) => txn.reference === transactionRef
      );

      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        console.error("Transaction not found");
      }
    } catch (err) {
      console.error("Error fetching transaction details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleShareReceipt = () => {
    if (navigator.share && transaction) {
      navigator.share({
        title: "Transaction Receipt",
        text: `Transaction Receipt - ₦${Number(transaction.amount).toLocaleString()}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Receipt link copied to clipboard!");
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transaction) return;

    // Create a temporary receipt container
    const receiptContainer = document.createElement('div');
    receiptContainer.id = 'receipt-container';
    receiptContainer.style.position = 'absolute';
    receiptContainer.style.left = '-9999px';
    receiptContainer.style.top = '-9999px';
    receiptContainer.style.width = '400px';
    receiptContainer.style.backgroundColor = 'white';
    receiptContainer.style.fontFamily = 'Arial, sans-serif';

    receiptContainer.innerHTML = `
      <div style="padding: 24px; background: white; border-radius: 12px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; color: #6B7280; margin: 0; margin-bottom: 8px;">Transaction Receipt</h2>
        </div>

        <!-- Logo -->
        <div style="text-align: left; margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: left; gap: 8px;">
              <img src="/tenalyLogo.svg" alt="TenalyLogo" style="width: 123px; height: 60px;"  />
          </div>
        </div>

        <!-- Amount -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 32px; font-weight: bold; color: #1F2937; margin-bottom: 8px;">
            ₦${Number(transaction.amount).toLocaleString()}
          </div>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <div style="width: 8px; height: 8px; background: #10B981; border-radius: 50%;"></div>
            <span style="font-size: 14px; color: #10B981; font-weight: 500;">Successful</span>
          </div>
        </div>

        <!-- Details Table -->
        <div style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
          <!-- Order Amount -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB;">
            <span style="font-size: 14px; color: #6B7280;">Order Amount</span>
            <span style="font-size: 14px; color: #1F2937; font-weight: 500;">₦${Number(transaction.amount).toLocaleString()}</span>
          </div>

          <!-- Fee -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB;">
            <span style="font-size: 14px; color: #6B7280;">Fee</span>
            <span style="font-size: 14px; color: #1F2937; font-weight: 500;">₦100</span>
          </div>

          <!-- Transaction Type -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">
            <span style="font-size: 14px; color: #6B7280;">Transaction Type</span>
            <span style="font-size: 14px; color: #1F2937; font-weight: 500;">Wallet Top up</span>
          </div>

          <!-- Date -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">
            <span style="font-size: 14px; color: #6B7280;">Date</span>
            <span style="font-size: 14px; color: #1F2937; font-weight: 500;">${formatDate(transaction.paymentDate)}</span>
          </div>

          <!-- Transaction ID -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;">
            <span style="font-size: 14px; color: #6B7280;">Transaction ID</span>
            <span style="font-size: 12px; color: #1F2937; font-weight: 500; font-family: monospace;">${transaction.reference}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="font-size: 12px; color: #6B7280; margin: 0;">Thank you for choosing Tenaly</p>
        </div>
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(receiptContainer);

    try {
      // Wait a moment for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture as Canvas
      const canvas = await html2canvas(receiptContainer, { 
        scale: 2,
        useCORS: true,
        backgroundColor: 'white'
      });
      
      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${transaction.reference}.pdf`);
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error generating receipt. Please try again.");
    } finally {
      // Clean up - remove the temporary element
      document.body.removeChild(receiptContainer);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5555DD] mx-auto"></div>
          <p className="mt-4 text-[#525252] text-sm">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-3 sm:p-8 w-full max-w-full">
        <div className="text-center">
          <Img src="/wallet.svg" width={100} height={100} alt="No transaction" className="mx-auto mb-4" />
          <h2 className="text-[#525252] font-[500] text-[18px] mb-2">Transaction Not Found</h2>
          <p className="text-[#868686] text-[14px] mb-6">The requested transaction could not be found.</p>
          <Button
            onClick={handleGoBack}
            className="bg-[#5555DD] text-white px-6 py-2 rounded-[8px] text-[14px] font-[500]"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white md:shadow-phenom md:rounded-[12px] h-auto md:p-8 w-full overflow-hidden">
      {/* Header */}
      <button
         onClick={handleGoBack}
          className="hidden md:flex items-center space-x-2 text-[#525252] hover:text-[#5555DD] transition-colors">
         <ArrowLeft className="w-5 h-5 text-[#141B34]" />
         <span className="text-[14px] font-[500]">Go back</span>
      </button>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-md mx-auto"> 
          <div className="text-center py-6 px-6">
              <h1 className="text-[#525252] font-[600] text-[18px] font-inter mb-2">
                Transaction Details
              </h1>
            </div>
      
          <div className="bg-[#FAFAFA] w-full rounded-none sm:rounded-[8px] overflow-hidden">
            {/* Success Icon */}
            <div className="flex justify-center mb-6 mt-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center mb-8 px-4 sm:px-0">
              <p className="text-[#525252] font-[700] text-[28px] sm:text-[32px] font-inter">
                ₦{Number(transaction.amount).toLocaleString()}
              </p>
              <p className="text-[#868686] text-[13px] sm:text-[14px] font-inter mt-1">
                {transaction.type === "credit" ? "Wallet Topup" : ""}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="px-4 sm:px-6 pb-6 space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[#868686] text-[13px] sm:text-[14px] font-inter">Status</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[12px] font-[500]">
                  Successful
                </span>
              </div>

              {/* Paid Amount */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[#868686] text-[13px] sm:text-[14px] font-inter">Paid Amount</span>
                <span className="text-[#525252] text-[14px] sm:text-[14px] font-[500] font-inter">
                  ₦{Number(transaction.amount).toLocaleString()}
                </span>
              </div>

              {/* Payment Date */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[#868686] text-[14px] sm:text-[14px] font-inter">Payment Date</span>
                <span className="text-[#525252] text-[13px] sm:text-[14px] font-[500] font-inter">
                  {formatDate(transaction.paymentDate)}
                </span>
              </div>

              {/* Payment Type */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[#868686] text-[13px] sm:text-[14px] font-inter">Payment Type</span>
                <span className="text-[#525252] text-[13px] sm:text-[14px] font-[500] font-inter">
                 {transaction.description || (transaction.type === "credit" ? "Wallet Topup" : "Withdrawal")}
                </span>
              </div>

              {/* Transaction ID */}
               <div className="flex flex-col md:justify-between md:items-center py-3">
      <span className="text-[#868686] text-[13px] sm:text-[14px] font-inter">Transaction ID</span>
      <div className="flex items-center">
        <span className="text-[#525252] text-[12px] sm:text-[13px] font-[500] font-inter mr-2">
          {transaction.reference}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(transaction.reference);
            alert("Transaction ID copied!");
          }}
          className="text-[#5555DD] hover:text-[#4444CC] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3 mt-6">
            <Button
              onClick={handleShareReceipt}
              className="flex-1 whitespace-nowrap bg-white border border-[#5555DD] text-[#5555DD] rounded-[8px] 
                         text-[14px] font-[500] font-inter h-[44px] flex items-center justify-center
                         hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Receipt
            </Button>
            <Button
              onClick={handleDownloadReceipt}
              className="flex-1 whitespace-nowrap  bg-[#5555DD] text-white rounded-[8px] 
                         text-[14px] font-[500] font-inter h-[44px] flex items-center justify-center
                         hover:bg-[#4444CC] transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}