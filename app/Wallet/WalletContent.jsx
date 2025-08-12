"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import api from "@/services/api";
import Img from "../components/Image";

export default function WalletContent() {
  const { token } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [editingAmount, setEditingAmount] = useState(true); // controls input visibility
  const [walletTransactions, setWalletTransactions] = useState([]);

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
      const verifyRes = await api.get(`/wallet/top/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const verifyData = verifyRes.data;

      if (verifyRes.status === 200) {
        alert("Wallet topped up successfully!");
        setWalletBalance(verifyData.walletBalance);
        setAmount("");
        setEditingAmount(false); // Hide input after successful payment
        fetchProfile(); // Refresh transactions
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

  return (
    <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-4 md:p-8 w-full">
      <div>
        <h3 className="text-[#525252] font-[500] text-[18px] font-inter text-center">
          Wallet
        </h3>
        <p className="text-center mt-3 text-[#525252] font-[400] text-[12px] font-inter">
          You can top up your wallet and use it to subscribe for Premium Services.
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="bg-[#5555DD] rounded-[12px] w-full md:w-[441px] min-h-[200px] flex flex-col items-center p-4">
          <h2 className="text-[#F7F7FF] font-[400] font-inter text-[12px] text-center md:text-left">
            Wallet balance
          </h2>
          <p className="text-[#F7F7FF] font-[500] font-inter text-[24px]">
            ₦{walletBalance}
          </p>

          {editingAmount ? (
            <>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-3 rounded px-3 py-2 text-black focus:outline-none"
              />
              <Button
                onClick={handleAddMoney}
                disabled={loading}
                className="bg-[#5555DD] mt-4 border border-[#BABAF2] rounded-[8px] 
                           text-[#E8E8FF] text-[14px] font-[500] font-inter w-full h-[44px]"
              >
                {loading ? "Processing..." : "Add Money"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditingAmount(true)}
              className="bg-[#5555DD] mt-4 border border-[#BABAF2] rounded-[8px] 
                         text-[#E8E8FF] text-[14px] font-[500] font-inter w-full h-[44px]"
            >
              Update Amount
            </Button>
          )}
        </div>
      </div>

      {walletTransactions.length === 0 ? (
        <div className="mt-8">
          <h3 className="text-[#525252] font-[500] text-[14px] font-inter text-center">
            Transaction Details
          </h3>
          <div className="flex justify-center mt-4">
            <Img
              src="/wallet.svg"
              width={139.09}
              height={135}
              className="w-[139.09px] h-[135px]"
              alt="Wallet illustration"
            />
          </div>
          <p className="text-[#868686] text-[14px] font-inter text-center font-[500] mt-4">
            No transactions made yet
          </p>
        </div>
      ) : (
        <div className="mt-8 px-4 max-w-md mx-auto">
          <h3 className="text-[#525252] font-[500] text-[14px] font-inter text-center mb-4">
            Transaction Details
          </h3>
          <ul className="divide-y divide-gray-300">
           {walletTransactions
             .slice()
             .reverse()
             .map(({ amount, reference, paymentDate, type }) => (
            <li
              key={reference}
              className="py-2 flex justify-between font-inter text-sm text-gray-700">
             <span>{type === "credit" ? "+" : "-"} ₦{amount}</span>
             <span>{paymentDate ? new Date(paymentDate).toLocaleDateString() : "No Date"}</span>
           </li>
           ))}
          </ul>
        </div>
      )}
    </div>
  );
}
