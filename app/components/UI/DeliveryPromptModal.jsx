"use client";

export default function DeliveryPromptModal({ onYes, onNo }) {
    return (
      <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
       <div className="bg-white rounded-[24px] w-[90%] max-w-[460px] mx-4 p-8 flex flex-col items-center text-center">
         <div className="text-6xl mb-4">🚚</div> 
         <h2 className="text-[#525252] font-bold text-[16px] md:text-[22px] mb-3">
          Does your business offer delivery?
         </h2>
         <p className="text-[#767676] text-[14px] font-normal mb-6">
          Let your customer know if you can delivery products or services to them.
         </p>
         <div className="flex gap-3 w-full">
           <button
            onClick={onNo}
            className="flex-1 h-[52px] rounded-[8px] border border-[#CDCDD7] text-[#525252] font-[500] text-[14px]"
           >
             No 
           </button>
            <button
            onClick={onYes}
            className="flex-1 h-[52px] rounded-[8px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white font-[500] text-[14px]"
          >
            Yes
          </button>
         </div> 
       </div>
      </div>
    )
}