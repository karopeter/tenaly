"use client";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Img from "../Image";


export default function BusinessDetailsList({ businesses, onAddDeliveryClick }) {
   const router = useRouter();

   return (
     <ul className="flex flex-col gap-4 mt-5 text-center text-gray-700">
        {businesses.map((biz) => {
            const hasDelivery = biz.businessDetails && biz.businessDetails.length > 0;
          
          return (
         <li
         key={biz._id}
         className="flex flex-col md:flex-row md:justify-between gap-2 items-start md:items-center px-4 py-2 w-full overflow-hidden">
        <span className="font-[500] font-inter text-[14px] text-[#525252] break-words w-full md:w-[60%]">
        {biz.businessName}
      </span>

      <div
       className="flex items-center gap-2 bg-[#FAFAFA] p-2 md:h-[36px] md:w-[179px] md:rounded-[4px] cursor-pointer"
       onClick={() => {
        if (hasDelivery) {
        router.push(`/edit-delivery?businessId=${biz._id}`);
        } else {
         onAddDeliveryClick(biz);
       }
      }}
     >
    {hasDelivery ? (
      <PencilIcon className="w-4 h-4 text-[#000087]" />
    ) : (
      <Img
        src="/add-circle.svg"
        alt="Add-Circle"
        width={20}
        height={20}
        className="md:w-[20px] md:h-[20px]"
      />
    )}
       <span className="text-[#000087] font-inter font-[500] text-[14px] whitespace-nowrap">
         {hasDelivery ? "Edit delivery options" : "Add delivery options"}
       </span>
    </div>
    </li>
      )
    })}
     </ul>
   );
}