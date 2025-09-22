"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Img from "../components/Image";

export default function WalletContent() {
  const { token } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [editingAmount, setEditingAmount] = useState(true);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const router = useRouter();

  // Load Paystack script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch user profile with wallet balance, email, and transactions
  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.walletBalance !== undefined) {
        setWalletBalance(res.data.walletBalance);
      }
      if (res.data.email) {
        setUserEmail(res.data.email);
      }
      if (res.data.walletTransactions) {
        setWalletTransactions(res.data.walletTransactions);
      }

      // If user has wallet balance, hide input by default, else show input
      setEditingAmount(res.data.walletBalance === 0);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Handle wallet top-up payment
  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }
    if (!token) {
      alert("You must be logged in to add money");
      return;
    }
    if (!userEmail) {
      alert("User email not found. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      const initRes = await api.post(
        "/wallet/topup/initialize",
        { amount: Number(amount) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { authorization_url, reference } = initRes.data;
      if (!authorization_url) {
        alert("Payment initialization failed");
        setLoading(false);
        return;
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: Number(amount) * 100,
        ref: reference,
        callback: function (response) {
          alert(`Payment complete! Reference: ${response.reference}`);
          verifyPayment(response.reference);
        },
        onClose: function () {
          alert("Payment window closed.");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      alert("Payment failed to initialize.");
      setLoading(false);
    }
  };

  // Verify payment and refresh wallet info
  const verifyPayment = async (reference) => {
    try {
      // Fixed endpoint URL
      const verifyRes = await api.get(`/wallet/top/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verifyData = verifyRes.data;

      // Check for successful verification
      if (verifyData.status === 200 || verifyRes.status === 200) {
        alert("Wallet topped up successfully!");
        setWalletBalance(verifyData.walletBalance);
        setAmount("");
        setEditingAmount(false); 
        fetchProfile();
      } else {
        alert(verifyData.message || "Payment verification failed");
      }
    } catch (err) {
      alert("Error verifying payment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle transaction click - Fixed navigation
  const handleTransactionClick = (transaction) => {
    console.log("Navigate to transaction:", transaction);
    router.push(`/wallet-transaction-details/${transaction.reference}`, {
      state: { transaction }
    });
  };

  // Get transaction icon based on type
 const getTransactionIcon = (type) => {
  if (type === "credit") {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-bold">↑</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-bold">↓</span>
        </div>
      </div>
    );
  }
};
  // Get transaction description based on type
  const getTransactionDescription = (transaction) => {
    if (transaction.transactionType === "credit") {
      return transaction.description || "Wallet Top-up";
    } else {
      return transaction.description || "Wallet Withdrawal";
    }
  };

  // Get transaction status display
  const getTransactionStatus = (transaction) => {
    const statusText = transaction.transactionType === "credit" ? "Credit" : "Debit";
    const statusColor = transaction.transactionType === "credit" ? "text-green-600" : "text-red-600";
    const amountPrefix = transaction.transactionType === "credit" ? "+" : "-";
    
    return {
      statusText,
      statusColor,
      amountPrefix
    };
  };

  return (
    <div className="bg-white md:shadow-phenom md:rounded-[12px] min-h-screen h-auto p-0  md:p-8 w-full overflow-hidden">
      {/* Header */}
      <div className="md:mb-6 px-4 pt-2">
        <h3 className="text-[#525252] font-[500] text-[16px] sm:text-[18px] font-inter text-center">
          Wallet
        </h3>
        <p className="text-center mt-2 text-[#525252] font-[400] text-[11px] sm:text-[12px] font-inter px-0 sm:px-2">
          You can top up your wallet and use it to subscribe for Premium Services.
        </p>
      </div>

      {/* Wallet Card */}
      <div className="md:px-4 mb-6">
        <div className="bg-[#5555DD] rounded-xl w-full p-6 flex flex-col items-center mt-4">
          <h2 className="text-[#F7F7FF] font-[400] font-inter text-[11px] sm:text-[12px] text-center">
            Wallet balance
          </h2>
          <p className="text-[#F7F7FF] font-[500] font-inter text-[20px] md:text-[24px] mt-2">
            ₦{walletBalance.toLocaleString()}
          </p>

          {editingAmount ? (
            <div className="w-full mt-6 space-y-3">
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-[6px] px-3 py-2.5 sm:py-3 text-black focus:outline-none text-[14px] sm:text-[16px]"
              />
              <Button
                onClick={handleAddMoney}
                disabled={loading}
                className="bg-[#5555DD] border border-[#BABAF2] rounded-[8px] 
                           text-[#E8E8FF] text-[13px] sm:text-[14px] font-[500] font-inter w-full h-[42px] sm:h-[44px]
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Add Money"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setEditingAmount(true)}
              className="bg-[#5555DD] mt-4 border border-[#BABAF2] rounded-[8px] 
                         text-[#E8E8FF] text-[13px] sm:text-[14px] font-[500] font-inter w-full h-[42px] sm:h-[44px]"
            >
              Update Amount
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-4 md:mt-8 md:px-4">
        <h3 className="text-[#525252] font-[500] text-[13px] sm:text-[14px] font-inter text-left md:text-center mb-3 sm:mb-6">
          Transaction Details
        </h3>
        
        {walletTransactions.length === 0 ? (
          <div className="px-4">
            <div className="flex justify-center mt-4">
              <Img
                src="/wallet.svg"
                width={120}
                height={115}
                className="w-[120px] h-[115px] sm:w-[139.09px] sm:h-[135px]"
                alt="Wallet illustration"
              />
            </div>
            <p className="text-[#868686] text-[13px] sm:text-[14px] font-inter text-center font-[500] mt-4">
              No transactions made yet
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto space-y-3">
            {walletTransactions
              .slice()
              .reverse()
              .map((transaction) => {
                const { statusText, statusColor, amountPrefix } = getTransactionStatus(transaction);
                
                return (
                  <div
                    key={transaction.reference}
                    onClick={() => handleTransactionClick(transaction)}
                    className="bg-white border border-[#140C291A] rounded-[12px] p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      {getTransactionIcon(transaction.transactionType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#525252] font-[500] text-[13px] sm:text-[14px] font-inter truncate">
                          {getTransactionDescription(transaction)}
                        </p>
                        <p className="text-[#868686] text-[11px] sm:text-[12px] font-inter">
                          {transaction.paymentDate 
                            ? new Date(transaction.paymentDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "No Date"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-[500] text-[13px] sm:text-[14px] font-inter ${statusColor}`}>
                        {statusText} • {amountPrefix}₦{Number(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}