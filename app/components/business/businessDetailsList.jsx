"use client";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Img from "../Image";

export default function BusinessDetailsList({ businesses, onAddDeliveryClick }) {
    const router = useRouter();

    return (
        <div className="w-fulll overflow-x-hidden">
            <ul className="flex flex-col gap-4 mt-5 text-gray-700 w-full">
                {businesses.map((biz) => {
                    // Check if any address has delivery available
                    const hasDelivery = biz.addresses.some(
                        (addr) => addr.deliveryAvailable
                    );

                    return (
                        <li
                            key={biz._id}
                            className="flex flex-row justify-between items-center gap-2 px-2 py-2 w-full bg-white  overflow-hidden"
                        >
                            <span className="text-sm font-medium text-[#525252] font-inter truncate max-w-[60%]">
                                {biz.businessName}
                            </span>

                            <div
                                className="flex flex-row items-center gap-2 px-3 py-1 bg-[#FAFAFA] rounded-md cursor-pointer"
                                onClick={() => {
                                    if (hasDelivery) {
                                        // Directs to the page where EditDeliveryForm is rendered
                                        router.push(`/edit-delivery?businessId=${biz._id}`);
                                    } else {
                                        onAddDeliveryClick(biz);
                                    }
                                }}
                            >
                                {hasDelivery ? (
                                    <>
                                        <PencilIcon className="w-4 h-4 text-[#000087]" />
                                        <span className="text-[13px] text-[#000087] font-[500] font-inter whitespace-nowrap">
                                            Edit delivery options
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Img
                                            src="/add-circle.svg"
                                            alt="Add-Circle"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-[13px] text-[#000087] font-[500] font-inter whitespace-nowrap">
                                            Add delivery options
                                        </span>
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}