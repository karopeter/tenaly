"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Img from "../components/Image";
import { toast } from "react-toastify";


export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

   useEffect(() => {
       const fetchNotifications = async () => {
    try {
      const res = await api.get("/notification");
      const notificationList = res.data?.notifications || [];

      const count = notificationList.filter((n) => !n.isRead).length;
      setUnreadCount(count);

      const withImages = await Promise.all(
        notificationList.map(async (notif) => {
          try {
            const adRes = await api.get(`/vehicles/vehicle-ad/${notif.adId}/details`);
            return {
              ...notif,
              carAdImage: adRes.data?.carAd?.images?.[0] || null,
              carModel: adRes.data?.vehicleAd?.model || "",
            };
          } catch (err) {
            return { ...notif, carAdImage: null };
          }
        })
      );

      setNotifications(withImages.reverse());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
     fetchNotifications();
   }, []);

   const handleMarkAllAsRead = async () => {
      try {
        await api.patch("/notification/mark-all-read");
        const updated = notifications.map((n) =>  ({ ...n, isRead: true }));
        setNotifications(updated);
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      } catch (error) {
       console.error("Error marking all as read:", error);
       toast.error("Could not mark notifications as read.");
      }
   };

    return (
      <div className="md:px-[104px] px-4 md:ml-10">
        {/* Breakcrumbs */ }
         <div className="mt-28 flex items-center gap-2 mb-4 font-[400] font-inter flex-nowrap">
        <Link href="/" className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap">
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/" className="text-[#000087] md:text-[14px] font-[500]">
           Notifications
        </Link>
      </div>

      {/* Notification Card */ }
       <div className="bg-white shadow-md rounded-[12px] w-full h-auto p-4">
         {/* Top Heade Row */ }
         <div className="flex items-center justify-between mb-6">
           <div className="flex flex-row md:items-center gap-1">
            <h2 className="text-[14px] md:text-[18px] font-[500] font-inter text-[#525252]">My Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-[#525252] text-[#F7F7FF] flex justify-center  text-[12px] font-inter font-[500] rounded-full w-[27px] h-[20px] font-medium">
                 {unreadCount}
              </span>
            )}
           </div>
           {notifications.length > 0 && (
             <button 
               onClick={handleMarkAllAsRead}
               className="text-[#5555DD] font-[400] font-inter text-[14px]">
                Mark all as read
             </button>
           )}
         </div>


         {/* Notification List */}
         {notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[300px]">
             <Img 
               src="/notification1.svg"
               alt="Notification"
               width={158}
               height={158}
               className="mx-auto"
            />
            <p className="mt-4 text-gray-500 text-sm">No notifications yet.</p>
          </div>
         ): (
          <ul className="space-y-4">
            {notifications.map((notif) => {
              const carAd = notif.carAd; 
              const displayImage = carAd?.vehicleImage?.[0] || carAd?.propertyImage?.[0];
              const imageUrl = displayImage
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${displayImage.replace(/\\/g, "/")}`
              : null;
            return (
           <li
             key={notif._id}
             className="flex justify-between items-center hover:bg-[#EDEDED] rounded-lg p-4">
           {/* Left: Image + Message */}
            <div className="flex items-center gap-3">
              {imageUrl ? (
               <img
                src={imageUrl}
                alt="Ad"
                className="w-16 h-16 rounded-md object-cover"
             />
            ) : (
             <div className="w-16 h-16 bg-gray-300 rounded-md" />
           )}
           <p className="text-[#525252] font-[400] font-inter text-[12px] md:text-[14px] break-words leading-snug">
              {notif.message}
             <span>
              <Link href="/" className="underline block md:inline">View ad</Link>
            </span>
             </p>
           </div>

         {/* Right: Date */}
         <p className="text-xs text-[#868686] font-[400] text-[14px] whitespace-nowrap font-inter">
            {new Date(notif.createdAt).toLocaleDateString("en-US", {
             year: "numeric",
             month: "long",
             day: "2-digit",
            })}
          </p>
        </li>
       );
      })}
    </ul>
    )}
   </div>
   </div>
    );
   }