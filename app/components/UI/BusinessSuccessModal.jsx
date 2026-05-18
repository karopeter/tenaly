"use client";
import { useRouter } from "next/navigation";

export default function BusinessSuccessModal({ onClose }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-50">
      <div className="bg-white rounded-[24px] w-[90%] max-w-[460px] mx-4 p-8 flex flex-col items-center text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-[#525252] font-bold text-[16px] md:text-[24px] mb-3">
          Congratulations!
        </h2>
        <p className="text-[#767676] text-[15px] font-normal">
          Your business has been added successfully and is now live. Start posting ads to showcase your products or services and reach more customers.
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              onClose?.();
              router.push('/Add');
            }}
            className="w-full md:w-[300px] h-[52px] rounded-[8px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white font-[500] text-[14px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}