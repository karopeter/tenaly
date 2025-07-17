"use client";
import Link from "next/link";
import Img from "../components/Image";


export default function NotificationPage() {
    return (
      <div className="md:px-[104px] px-4 md:ml-10">
         <div className="mt-28 flex items-center gap-2 mb-4 font-[400] font-inter flex-nowrap">
        <Link href="/" className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap">
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/" className="text-[#000087] md:text-[14px] font-[500]">
           Notifications
        </Link>
      </div>
       <div className="bg-white shadow-md rounded-[12px] w-full h-[409px] flex items-center justify-center">
          <Img 
            src="/notification1.svg"
            alt="Notification"
            width={158}
            height={158}
            className="mx-auto"
          />
       </div>
      </div>
    );
}