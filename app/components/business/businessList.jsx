"use client";
import Img from "../Image";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function BusinessList({ businesses, onAddHourClick }) {
    const router = useRouter();
    
  return (
   <div className="w-full overflow-x-hidden">
    <ul className="flex flex-col gap-4 mt-5 text-gray-700 w-full">
     {businesses.map((biz) => {
      const hasHours = biz.businessHours && biz.businessHours.length > 0;

    return (
      <li
        key={biz._id}
        className="flex flex-row justify-between items-center gap-2 px-2 py-2 w-full bg-white overflow-hidden"
      >
        <span className="text-sm font-medium text-[#525252] font-inter truncate max-w-[60%]">
          {biz.businessName}
        </span>

        <div
          className="flex flex-row items-center gap-2 px-3 py-1 bg-[#FAFAFA] rounded-md cursor-pointer"
          onClick={() => {
            if (hasHours) {
              router.push(`/EditBusinessHour?businessId=${biz._id}`);
            } else {
              onAddHourClick(biz);
            }
          }}
        >
          {hasHours ? (
            <PencilIcon className="w-4 h-4 text-[#000087]" />
          ) : (
            <Img
              src="/add-circle.svg"
              alt="Add-Circle"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          )}
          <span className="text-[13px] text-[#000087] font-[500] font-inter whitespace-nowrap">
            {hasHours ? "Edit business hour" : "Add business hour"}
          </span>
        </div>
      </li>
    );
  })}
</ul>

   </div>
  );
}
