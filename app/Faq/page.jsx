"use client";
import { useState } from "react";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    heading: "General",
    faqs: [
      {
        question: "Who can use Tenaly?",
        answer:
          "Anyone looking to buy and sell vehicles and real estate can use Tenaly, including individuals, businesses, and real estate agents.",
      },
      {
        question: "How does Tenaly ensure the security of users?",
        answer:
          "We verify listings, provide user verification options, and offer security guidelines to help prevent scams.",
      },
      {
        question: "Is Tenaly a direct seller of cars and properties?",
        answer: 
          "No, Tenaly is a marketplace that connects buyers and sellers. We do not own or sell any listed properties or vehicles."
      }
    ],
  },
  {
    heading: "LISTING AND SELLING",
    faqs: [
      {
        question: "How do I post an ad on Tenaly?",
        answer:
          'Log into your account, click "Sell," select a category (Real Estate or  Vehicles), provide necessary details, and submit.',
      },
      {
       question: "What information do I need to provide when listing an ad?",
       answer: 
        "You'll need to add high-quality images, price description, location, contact details, and relevant documents if required."
      },
      {
       question: "How long does it take for my ad to be approved?",
       answer: "Ads typically go through a verification process and are approved within 24 hours."
      },
      {
       question: "What happens if my listing is rejected?",
       answer: "This happens when your ads doesn't meet our guidelines, we will notify you with the reason and suggest corrections"
      }
    ],
  },
  {
    heading: "BUYING",
    faqs: [
      {
        question: "How do I contact a seller?",
        answer:
          'Click the desired ad, you will see a contact button on the listing to call, or send a message to the seller.',
      },
      {
       question: "Does Tenaly offer buyer protection?",
       answer: 
        "No transaction are done directly between buyers and sellers. Always conduct due dilligence before making a payment."
      },
      {
       question: "Can I negotiate prices with sellers?",
       answer: "Yes, you can contact sellers to negotiate the price before making a purchase."
      },
      {
       question: "Can I report a fradulent seller?",
       answer: 'Yes, you can report suspicious activity using "Report" button on the listing or contact customer support.'
      }
    ],
  },
  {
    heading: "PREMIUM PACKAGE AND AD BOOSTING",
    faqs: [
      {
        question: "What are premium ad packages?",
        answer:
          "These are paid plans that increase your ad's visibility, placing it at the top of searches and attracting more buyers.",
      },
      {
       question: "How much do premium packages cost?",
       answer: 
        "Pricing varies based on type of boost. Check the pricing page for details. "
      },
      {
       question: "Can I negotiate prices with sellers?",
       answer: "Yes, you can contact sellers to negotiate the price before making a purchase."
      },
      {
       question: "Can I report a fradulent seller?",
       answer: 'Yes, you can report suspicious activity using "Report" button on the listing or contact customer support.'
      }
    ],
  },
  {
    heading: "ACCOUNT AND SECURITY",
    faqs: [
      {
        question: "How do I verify my account?",
        answer:
          "Submit a valid ID and subscribe for any premium package",
      },
      {
       question: "What are benefits of becoming a verified user?",
       answer: 
        "Verified users again trust, enjoy better visibility, and have access to exclusive features."
      },
      {
       question: "I forgot my password. How do I reset it?",
       answer: 'Click "Forgot Password" on the login page and follow the instructions to rest it, or go to the settings page, click on account actions, click on change password and follow the instructions to reset it'
      },
      {
       question: "Can I change my email or phone number?",
       answer: 'Yes, go to your personal profile, click on edit, click on change my email or phone number settings and follow the instructions to change it.'
      },
       {
       question: "Can I deactivate my account temporarily?",
       answer: 'Yes you can deactivate your account, if you wish to take a break. Go to settings > account actions > deactivate account and follow the instructions to deactivate it'
      },
       {
       question: "Can I delete my account?",
       answer: 'Yes you can deactivate your account, if you wish to take a break. Go to settings > account actions > deactivate account and follow the instructions to deactivate it'
      }
    ],
  },
  {
    heading: "CUSTOMER SUPPORT AND POLICIES",
    faqs: [
      {
        question: "Where can I find help for common issues?",
        answer:
          "Visit the FAQ, which has solutions for most user concerns",
      },
      {
       question: "How can I contact Tenaly's customer support?",
       answer: 
        "You can reach support via email, phone, or live chat on the website"
      },
      {
       question: "Can I request feature improvements?",
       answer: 'Yes, we welcome feedback and feature requests from our users'
      },
      {
       question: "How do I report a problem with my account?",
       answer: 'Contact customer support via email or live chats to resolve account-related issues.'
      },
    ],
  },
];


export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState({});

  const toggleFAQ = (section, index) => {
    setOpenIndex((prev) => ({
      ...prev,
      [section]: prev[section] === index ? null : index,
    }));
  };

    return (
     <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
       <div className="flex flex-col md:flex-row gap-10">
          <Sidebar />

          <main className="flex-1">
            <div className="bg-white shadow-phenom md:rounded-[12px] h-auto p-8">
               <div className="text-center">
                 <h2 className="text-[#525252] font-inter text-[24px] font-[500]">Frequently Questions</h2>
               </div>

               {/* FAQ Section */}
               <div className="space-y-6">
                 <div className="mt-5 mx-auto md:ml-28">
                    {faqData.map((section, sectionIndex) => (
                     <div key={sectionIndex}>
                     <h3 className="text-[#000087] text-[16px] font-[500] font-inter mb-2">
                       {section.heading}
                     </h3>
                     
                     {section.faqs.map((item, index) => (
                      <div key={index}>
                      <div 
                      className="flex justify-between items-center mb-4 cursor-pointer border-b border-[#ccc] py-3"
                      onClick={() => toggleFAQ(section.heading, index)}>
                     <span className="text-[#525252] font-[500] font-inter text-[14px]">
                      {item.question}
                    </span>
                    <ChevronDown
                       className={`h-5 w-5 text-[#525252] transition-transform duration-300 ${
                       openIndex[section.heading] === index ? "rotate-180" : ""
                    }`}
                   />
                   </div>
                    {openIndex[section.heading] === index && (
                     <div className="mt-3 text-[14px] font-[400] text-[#767676] font-inter">
                       {item.answer}
                     </div>
                     )}
                    </div>
                     ))}
                   </div>
                  ))}
                </div>
               </div>
            </div>
          </main>
       </div>
     </div>
    );
}