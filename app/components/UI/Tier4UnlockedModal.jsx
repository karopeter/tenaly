"use client";
import { useEffect, useRef, useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Tier4UnlockedModal({ visible, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (visible) {
         setMounted(true);
         // Double rAF to ensure DOM is painted before trigerring transition 
         requestAnimationFrame(() => 
          requestAnimationFrame(() => setAnimateIn(true))
        );
        } else {
          setAnimateIn(false);
          const t = setTimeout(() => setMounted(false), 300);
          return () => clearTimeout(t);
        }
    }, [visible]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
             await navigator.share({
               title: "Elite Seller Status Unlocked!",
               text: "🎉 I just unlocked Elite Seller (Tier 4) status on Tenaly! My consistent performance earned me this achievement.",
               url: window.location.origin,
             });
            } catch (_) {}
        } else {
            await navigator.clipboard?.writeText(
             "🎉 I just unlocked Elite Seller (Tier 4) status on Tenaly! " +
              window.location.origin
            );
            toast.success("Link copied to clipboard");
        }
    };

    const handleDownload = () => {
        // TODO: implement badge/certificate download 
        console.log("Download badge");
    };

    if (!mounted) return null;

    return (
      <>
       <style>{`
          @keyframes t4-crown-drop {
          0%   { transform: translateY(-18px); opacity: 0; }
          55%  { transform: translateY(5px);   opacity: 1; }
          75%  { transform: translateY(-3px); }
          100% { transform: translateY(0);     opacity: 1; }
        }
        @keyframes t4-glow-pulse {
         0%,100% { transform: scale(1);    opacity: 0.28; }
         50%     { transform: scale(1.09); opacity: 0.42; }
        }
         .t4-crown { animation: t4-crown-drop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.25s both; }
        .t4-glow  { animation: t4-glow-pulse 3s ease-in-out infinite; }

        .t4-overlay {
          transition: opacity 0.28s ease;
          opacity: 0;
        }
        .t4-overlay.in { opacity: 1; }

        .t4-card {
          transition: opacity 0.3s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
          opacity: 0;
          transform: scale(0.86) translateY(16px);
        }
        .t4-card.in {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
       `}</style>

       {/* Backdrop */}
       <div 
         className={`t4-overlay ${animateIn ? "in" : ""} fixed inset-0 
         z-[9999] flex items-center justify-center px-4`}
         style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
         onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
         }}
         >
         {/* Card */}
         <div
          className={`t4-card ${animateIn ? "in" : ""} relative bg-white rounded-[18px] w-full 
           max-w-[400px] pt-9 pb-7 px-7 flex flex-col items-center`}
           style={{
            boxShadow: "0 20px 56px rgba(16,49,170,0.16), 0 4px 14px rgba(0,0,0,0.07)"
           }}
         >
         {/* Close */}
         <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full 
          bg-[#F3F3F8] flex items-center justify-center hover:bg-[#EAEAF2] transition-colors"
          aria-label="Close"
         >
         <X size={15} className="text-[#9A9AB0]" />
         </button>

          {/* Badge area */}
           <div
             className="relative flex flex-col items-center mb-4"
             style={{ height: 104 }}
           >
           {/* Soft glow blob - matches the lavender/periwinkle halo in designs */}
           <div 
             className="t4-glow absolute rounded-full pointer-events-none"
             style={{
               width: 230,
               height: 150,
               top: -16,
               background: "radial-gradient(ellipse at center, rgba(180,200,255,0.45) 0%, transparent 72%)"
             }}
             />

             {/* Crown */}
             <div
              className="t4-crown absolute top-0 z-10 select-none leading-none"
              style={{ fontSize: 34 }}
             >
              👑
             </div>

             {/* Tier 4 pill */}
             <div 
               className="absolute bottom-0 flex items-center gap-2 px-5 py-2.5 rounded-full"
               style={{
                background: "linear-gradient(135deg, #1A3BC4 0%, #0E24A8 100%)",
                boxShadow: "0 6px 18px rgba(16,49,170,0.44)"
               }}
               >
               <span className="text-white font-semibold text-[17px] tracking-wide">
                Tier
              </span>
              <span
               className="flex items-center justify-center text-white text-[13px] font-bold"
               style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: "rgba(188,215,246,0.36)",
               }}
              >
             4
              </span>
             </div>
           </div>

           {/* New badge unlocked */}
           <p className="text-[13px] text-[#9A9AB0] mb-3">New Badge unlocked</p>

           {/* Congrats */}
           <h2>
             Congratulations, You're now an{" "}
             <span className="text-[#1031AA]">Elite Seller</span>
           </h2>

           {/* Subtitle */}
           <p className="text-center text-[13px] text-[#6B6B85] leading-relaxed mb-7">
            Your consistent performance has earned you
            <br />
            Elite Seller status.
           </p>

           {/* Buttons */}
           <div className="flex gap-3 w-full">
            <button
             onClick={handleDownload}
             className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[10px] border-[1.5px] border-[#1031AA] text-[#1031AA] text-[14px] font-semibold hover:bg-[#EEF2FF] transition-colors"
            >
            <Download size={15} />
            Download 
            </button>
             <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 h-[46px] rounded-[10px] bg-[#1031AA] text-white text-[14px] font-semibold hover:bg-[#0D27A0] transition-colors"
            >
              <Share2 size={15} />
              Share
            </button>
           </div>
         </div>
       </div>
      </>
    );
}