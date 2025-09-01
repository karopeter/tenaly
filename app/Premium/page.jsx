"use client";

import { Check, X, Crown, Users, Building } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import PremiumWalletModal from "../components/WalletModal/premuimWalletModal";
import Img from "../components/Image";

export default function PremiumService() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "per month",
      icon: "/freeIcon.svg",
      color: "bg-blue-600",
      textColor: "text-white",
      features: [
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur"
      ],
      popular: false
    },
    {
      name: "Basic",
      price: 15000,
      period: "per month",
      icon: "/basic1.svg",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      features: [
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur", 
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: 30000,
      period: "per month",
      icon: "/pro1.svg",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      features: [
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur", 
        "Lorem ipsum dolor sit amet, consectetur"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: 100000,
      period: "per month",
      icon: "/crowns3.svg",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      features: [
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur",
        "Lorem ipsum dolor sit amet, consectetur"
      ],
      popular: false
    }
  ];

  const comparisonFeatures = [
    { name: "Auto Listings", free: "Up to 3", basic: "Up to 5", pro: "Up to 10", enterprise: "Unlimited" },
    { name: "Listing Scan", free: "Up to 3", basic: "Up to 5", pro: "Up to 10", enterprise: "Unlimited" },
    { name: "Insight Reports", free: false, basic: true, pro: true, enterprise: true },
    { name: "Insight Reports", free: false, basic: false, pro: true, enterprise: true },
    { name: "Insight Reports", free: false, basic: false, pro: false, enterprise: true },
    { name: "Insight Reports", free: true, basic: true, pro: true, enterprise: true },
    { name: "Insight Reports", free: false, basic: true, pro: true, enterprise: true }
  ];


  // Fetch user profile and wallet balance 
const fetchUserProfile = async () => {
  try {
    setLoading(true);
    const response = await api.get('/profile'); 

    const data = response.data;
    setUserProfile(data);
    setWalletBalance(data.walletBalance || 0);
  } catch (error) {
    console.error('Error fetching profile:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle plan selection 
  const handlePlanSelect = (planIndex) => {
    setSelectedPlan(planIndex); 
    const plan = plans[planIndex];
    const planAmount = plan.price;
    

    // If free plan, handle immediately 
    if (plan.price === 0) {
      handleFreePlan();
      return;
    }

    if (planAmount === 0) {
      handleFreePlan();
      return;
    }
    
    // Show payment model for paid plans 
    setShowPaymentModal(true);
  };

  // Handle free plan selection 
  const handleFreePlan = () => {
    toast.success("Free plan selected successfully!");
  }

  // Handle wallet payment 
 const handleWalletPayment = async () => {
  if (selectedPlan === null) return;

  const plan = plans[selectedPlan];
  const planName = plan.name.toLowerCase();
  const planAmount = plan.price;

  if (walletBalance < planAmount) {
    toast.error('Insufficient wallet balance');
    return;
  }

  try {
    setLoading(true);

    const response = await api.post('/subscription/subscribe-plan', {
      planType: planName,
      amount: planAmount,
      useWalletBalance: true
    });

    const result = response.data;

    setWalletBalance(result.data?.remainingWallet || 0);
    toast.success(`Successfully subscribed to ${plan.name} plan!`);
    setShowPaymentModal(false);

    fetchUserProfile();
  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.response?.data?.error || 'Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Handle Paystack payment 
 const handlePaystackPayment = async () => {
  if (selectedPlan === null) return;

  const plan = plans[selectedPlan];
  const planName = plan.name.toLowerCase();
  const planAmount = plan.price;

  try {
    const response = await api.post('/subscription/subscribe-plan', { 
      planType: planName,
      amount: planAmount,
      useWalletBalance: false
    });

    const result = response.data;

    if (result.data?.paymentUrl) {
      window.location.href = result.data.paymentUrl;
    } else {
      toast.error(result.error || 'Failed to initialize payment');
    }
  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.response?.data?.error || 'Failed to initialize payment');
  } finally {
    setLoading(false);
  }
};



  return (
    <>
   <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 mt-20 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[14px] md:text-[28px] font-[500] font-inter font-bold text-[#525252] mb-2">
            Premium Service - Get Seen First. Sell Faster.
          </h1>
          <p className="text-gray-600 mb-8">
            Move your car with Premium plans that will give ahead of the competition.
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button className="px-4 py-2 text-gray-600 rounded-md">Monthly</button>
              <button className="px-4 py-2 bg-[#5555DD] text-white rounded-md flex items-center gap-2">
                Annual Save!
                <span className="bg-[#DFDFF9] px-2 py-1 rounded-[6px] text-[#000087] text-[10px] font-medium">
                  15% off
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`rounded-xl p-6 relative transition-colors cursor-pointer ${
                selectedPlan === index 
                  ? 'bg-[#000087] text-white' 
                  : 'bg-white border border-[#DFDFF9] text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-[500] font-inter text-[14px] md:text-[24px] ${selectedPlan === index ? 'text-white' : 'text-[#525252]'}`}>
                  {plan.name}
                </h3>
                <div className={`p-2 rounded-full ${selectedPlan === index ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Img
                    src={plan.icon}
                    alt={`${plan.name} icon`}
                    width={36}
                    height={36}
                    className={`w-5 h-5 ${
                      selectedPlan === index ? "brightness-200 invert" : null
                    }`}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <span className={`font-inter font-[500] text-[20px] 
                     md:text-[32px] font-normal 
                     ${selectedPlan === index ? 'text-white' : 'text-[#525252]'}`}>
                  ₦{plan.price.toLocaleString()}
                </span>
                <span className={`font-[500] font-inter text-[12px] font-normal ml-2 ${selectedPlan === index ? 'text-white/80' : 'text-[#525252]'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className={`w-4 h-4 mr-3 mt-0.5 flex-shrink-0 ${
                      selectedPlan === index ? 'text-white' : 'text-green-500'
                    }`} />
                    <span className={`font-[400] font-inter text-[14px] font-normal ${selectedPlan === index ? 'text-white/90' : 'text-[#525252]'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors border border-[#CDCDD7] ${
                  selectedPlan === index
                    ? "bg-[#000087] text-white"
                    : "bg-white text-[#525252]"
                }`}
                onClick={() => handlePlanSelect(index)}
                disabled={loading}
              >
                {loading && selectedPlan === index ? "Processing..." : "Choose this plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 mt-10">
            <h2 className="text-[24px] md:text-[32px] font-medium font-[500] text-[#000000] text-center">Compare Plans</h2>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden">
            {plans.map((plan, planIndex) => (
              <div key={plan.name} className="border-b border-gray-200 last:border-b-0">
                <div className={`px-6 py-4 ${planIndex === selectedPlan ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <span className="text-2xl font-bold">₦{plan.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="space-y-3">
                    {comparisonFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700">{feature.name}</span>
                        <div className="text-right">
                          {planIndex === 0 && (
                            typeof feature.free === 'boolean' ? (
                              feature.free ? (
                                <Check className="w-5 h-5 text-[#46C568]" />
                              ) : (
                                <X className="w-5 h-5 text-[#CB0D0D]" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.free}</span>
                            )
                          )}
                          {planIndex === 1 && (
                            typeof feature.basic === 'boolean' ? (
                              feature.basic ? (
                                <Check className="w-5 h-5 text-[#46C568]" />
                              ) : (
                                <X className="w-5 h-5 text-[#CB0D0D]" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.basic}</span>
                            )
                          )}
                          {planIndex === 2 && (
                            typeof feature.pro === 'boolean' ? (
                              feature.pro ? (
                                <Check className="w-5 h-5 text-[#46C568]" />
                              ) : (
                                <X className="w-5 h-5 text-[#CB0D0D]" />
                              )
                            ) : (
                            <span className="text-sm text-gray-600">{feature.pro}</span>
                            )
                          )}
                          {planIndex === 3 && (
                            typeof feature.enterprise === 'boolean' ? (
                              feature.enterprise ? (
                                <Check className="w-5 h-5 text-[#46C568]" />
                              ) : (
                                <X className="w-5 h-5 text-[#CB0D0D]" />
                              )
                            ) : (
                              <span className="text-sm text-gray-600">{feature.enterprise}</span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto w-full max-w-5xl rounded-lg">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-[#CDCDD7]">
                  <th className="w-1/5 text-left py-4 px-6 font-medium text-gray-500 align-top">
                    <div className="flex items-center gap-2">
                       <span className="text-[12px] font-medium text-gray-500 mb-2">Features</span>
                    </div>
                  </th>
                  {plans.map((plan, planIndex) => (
                    <th 
                     key={plan.name} className="text-center py-4 px-6">
                       <div className="flex items-center justify-center gap-2">
                           <Img
                            src={plan.icon}
                            alt={`${plan.name} icon`}
                            width={36}
                            height={36}
                            className={`w-5 h-5 ${
                            selectedPlan === planIndex ? "brightness-200 invert" : null
                           }`}
                          />
                           <span className="font-semibold">{plan.name}</span>
                        </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                    <td 
                      className="py-4 px-6 text-[#525252] font-[500] 
                      text-[14px] md:text-[16px]  
                      font-inter font-medium">
                        {feature.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-[#46C568] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#CB0D0D] mx-auto" />
                        )
                      ) : (
                        <span className="text-[#525252]">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.basic === 'boolean' ? (
                        feature.basic ? (
                          <Check className="w-5 h-5 text-[#46C568] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#CB0D0D] mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{feature.basic}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-[#46C568] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#CB0D0D]  mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="w-5 h-5 text-[#46C568] mx-auto" />
                        ) : (
                          <X className="w-5 h-5  text-[#CB0D0D] mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan !== null && (
        <PremiumWalletModal
          selectedPlan={plans[selectedPlan].name}
          planAmount={plans[selectedPlan].price}
          walletBalance={walletBalance}
          onWalletPayment={handleWalletPayment}
          onPaystackPayment={handlePaystackPayment}
          onCancel={() => setShowPaymentModal(false)}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
    </>
  );
}