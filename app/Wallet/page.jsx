"use client";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import Img from "../components/Image";

export default function Wallet() {
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />

           <main className="flex-1">
            <div className="bg-white shadow-phenom md:rounded-[12px] h-[497px] md:h-[550px] p-8">
               <div>
                <h3 className="text-[#525252] font-[500] text-[18px] font-inter mx-auto md:ml-28">Wallet</h3>
                <p className="text-center mt-5 text-[#525252] font-[400] text-[12px] font-inter">
                  You can top up your wallet and use it to subscript for Premium 
                  <br className="hidden-xs" />
                  Services
                </p>
               </div>
               <div className="mt-5 flex justify-center">
                 <div className="bg-[#5555DD] rounded-[12px] md:w-[441px] md:h-[144px] flex flex-col items-center">
                 <h2 className="text-[#F7F7FF] font-[400] font-inter mt-5 mb-2 text-[12px]">
                    Wallet balance
                  </h2>
                 <p className="text-[#F7F7FF] font-[500] font-inter text-[18px]">₦0</p>
                 <Button 
                   className="bg-[#5555DD] mt-2  border border-[#BABAF2] rounded-[8px] 
                   text-[#E8E8FF] text-[14px] font-[500] 
                   font-inter md:w-[417px] md:h-[44px]">
                    Add Money
                 </Button>
               </div>
               </div>
                 <h3 className="text-[#525252] font-[500] text-[14px] mt-5 font-inter mx-auto md:ml-24">
                   Transaction Details
                  </h3>
                <div className="flex justify-center">
                  <Img 
                   src="/wallet.svg"
                   width={139.09}
                   height={135}
                   className="w-[139.09px] h-[135px]"
                   />
                </div>
                <p className="text-[#868686] text-[14px] font-inter text-center font-[500]">
                    No transactions made 
                    <br className="hidden-xs" />
                    yet
                   </p>
            </div>
           </main>
        </div>
      </div>
    );
}
