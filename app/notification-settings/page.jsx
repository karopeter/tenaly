"use client";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Sidebar from "../components/navbar/sidebar";
import { useRouter } from "next/navigation";
import ToggleSwitch from "../components/UI/ToggleSwitch";

const notificationTypes = [
  "Transaction Notifications",
  "Message Notifications",
  "Listing Ads Notifications",
  "Promotions & Offers",
  "Review Notifications",
];


export default function NotificationSettings() {
    const router = useRouter();
    const [isOn, setIsOn] = useState(false);
    const [emailToggle, setEmailToggle] = useState(false);
    const [smsToggle, setSmsToggle] = useState(false);
    const [toggles, setToggles] = useState({
    transaction: false,
    message: false,
    listing: false,
    promotions: false,
    review: false,
  });

    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />
           <main className="flex-1">
            <div className="bg-white shadow-phenom md:rounded-[12px] p-8">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => router.back()} className="flex gap-4 items-center">
                  <ArrowLeftIcon className="h-5 w-5 text-[#141B34]" />
                  <span className="text-[#525252] font-inter text-[14px] font-[500]">
                   Go Back
                  </span>
                </button>
              </div>
              <h3 className="text-[#525252] font-inter font-[500] text-[18px] mb-5">Notification Settings</h3>
              <span className="text-[#525252] font-[500] font-inter text-[14px]">Select your notification preference</span>
              
              <div className="flex flex-col md:flex-row mt-8 gap-6 w-full">
                 {/* left Card */}
                 <div className="border-[1px] border-[#CDCDD7] bg-transparent rounded-[8px] flex-1 min-w-0 h-auto md:h-[243px] p-4 flex flex-col items-start justify-start">
                   <div className="flex items-center justify-between w-full mb-5">
                     <span className="text-[#767676] font-inter font-[400] text-[14px]">Transaction Notifications</span>
                     <ToggleSwitch checked={toggles.transaction} onChange={() => setToggles(t => ({ ...t, transaction: !t.transaction }))} />
                   </div>
                   <div className="flex items-center justify-between w-full mb-5">
                     <span className="text-[#767676] font-inter font-[400] text-[14px]">
                        Message Notifications
                      </span>
                     <ToggleSwitch  checked={toggles.message} onChange={() => setToggles(t => ({ ...t, message: !t.message }))} />
                   </div>
                   <div className="flex items-center justify-between w-full mb-5">
                     <span className="text-[#767676] font-inter font-[400] text-[14px]">
                       Listing Ads Notifications
                       </span>
                     <ToggleSwitch checked={toggles.listing} onChange={() => setToggles(t => ({ ...t, listing: !t.listing }))} />
                   </div>
                   <div className="flex items-center justify-between w-full mb-5">
                     <span className="text-[#767676] font-inter font-[400] text-[14px]">
                       Promotions & Offers
                     </span>
                     <ToggleSwitch  checked={toggles.promotions} onChange={() => setToggles(t => ({ ...t, promotions: !t.promotions }))} />
                   </div>
                   <div className="flex items-center justify-between w-full mb-5">
                     <span className="text-[#767676] font-inter font-[400] text-[14px]">
                        Review Notifications
                     </span>
                     <ToggleSwitch checked={toggles.review}
                       onChange={() => setToggles(t => ({ ...t, review: !t.review }))} />
                   </div>
                 </div>
                 {/* Right Column */ }
                 <div className="flex flex-col flex-1 min-w-0">
                   {/* Top Right Card (Shifted Up) */ }
                   <div className="border-[1px] border-[#CDCDD7] rounded-[8px] p-2 w-full h-auto md:h-[70px] -mt-6 flex flex-col items-start justify-start">
                     <div className="flex items-center justify-between w-full">
                       <h1 className="text-[#525252] font-[400] text-[14px] font-inter">
                         Get Notification on your email
                       </h1>
                       <ToggleSwitch
                         checked={emailToggle}
                         onChange={() => setEmailToggle((v) => !v)}
                       />
                     </div>
                      <span className="text-[#868686] text-[14px] font-[400] font-inter">
                         golibe.f@gmail.com
                      </span>
                   </div>
                   {/* Bottom Right Card */ }
                   <div className="border border-[#CDCDD7] rounded-[8px] w-full h-auto md:h-[117px] mt-4 p-2 flex flex-col gap-2 items-start justify-start">
                      <span 
                        className="bg-[#E8E8FF] p-1 w-fit md:w-[166px] 
                        md:h-[31px] rounded-[4px] 
                        text-[12px] font-[400] font-inter text-[#000087]">
                         Only for subscribed users
                      </span>
                    <div className="flex items-center justify-between w-full">
                    <span className="text-[#525252] font-inter font-[400] text-[14px]">
                      Get notifications on SMS
                    </span>
                   <ToggleSwitch
                     checked={smsToggle}
                     onChange={() => setSmsToggle((v) => !v)}
                  />
                 </div>
                 <span className="text-[#868686] font-inter font-[400] text-[14px]">
                  +234 801 234 5678
                  </span>
                  </div> 
                 </div>
              </div>
            </div>
           </main>
        </div>
      </div> 
    );
}