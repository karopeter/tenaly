"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Img from "../components/Image";
import { toast } from "react-toastify";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hideRead, setHideRead] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notification");
        const notificationList = res.data?.notifications || [];

        const count = notificationList.filter((n) => !n.isRead).length;
        setUnreadCount(count);

        const withImages = await Promise.all(
          notificationList.map(async (notif) => {
            let adId = notif.propertyAdId || notif.vehicleAdId || notif.carAdId || notif.adId || notif.ad;
            let adType = notif.adType || "unknown";
            let adName = "";
            let displayImage = null;

            if (!adId) {
              console.warn("❌ No valid adId found in notification:", notif);
              return { ...notif, carAdImage: null, adName: "", adType: "unknown" };
            }

            // Determine adType based on notification object if possible
            if (notif.propertyAdId) adType = "property";
            else if (notif.vehicleAdId) adType = "vehicle";

            console.log(`🎯 Processing adId: ${adId} as initial type: ${adType}`);

            try {
              let adData = {};
              if (adType === "property") {
                const propertyRes = await api.get(`/property/property-ad/${adId}/details`);
                adData = propertyRes.data;
              } else if (adType === "vehicle") {
                const vehicleRes = await api.get(`/vehicles/vehicle-ad/${adId}/details`);
                adData = vehicleRes.data;
              } else {
                // If type is unknown, try both endpoints to be safe
                try {
                  const res = await api.get(`/property/property-ad/${adId}/details`);
                  if (res.data?.propertyAd || res.data?.carAd) {
                    adData = res.data;
                    adType = "property";
                  }
                } catch (e) {
                  const res = await api.get(`/vehicles/vehicle-ad/${adId}/details`);
                  if (res.data?.carAd) {
                    adData = res.data;
                    adType = "vehicle";
                  }
                }
              }

              // Now, process the adData based on the determined type
              if (adType === "property") {
                const propertyAd = adData.propertyAd || {};
                const carAd = adData.carAd || {};
                adName = propertyAd.propertyName || carAd.category || "Property Ad";

                // Prioritize property images from the carAd, then the propertyAd
                if (Array.isArray(carAd.propertyImage) && carAd.propertyImage.length > 0) {
                  displayImage = carAd.propertyImage[0];
                } else if (Array.isArray(propertyAd.propertyImage) && propertyAd.propertyImage.length > 0) {
                  displayImage = propertyAd.propertyImage[0];
                }
              } else if (adType === "vehicle") {
                const carAd = adData.carAd || {};
                adName = carAd.model || carAd.category || "Vehicle Ad";

                // Prioritize vehicle images
                if (Array.isArray(carAd.vehicleImage) && carAd.vehicleImage.length > 0) {
                  displayImage = carAd.vehicleImage[0];
                }
              }
            } catch (fetchErr) {
              console.error(
                `❌ Failed to fetch ad (${adId}) for type ${adType}:`,
                fetchErr?.response?.data?.message || fetchErr.message
              );
            }

            return {
              ...notif,
              carAdImage: displayImage, // This is the image we will render
              carModel: adName, // This is the name we will render
              adType,
            };
          })
        );

        setNotifications(withImages.reverse());
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        toast.error("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkOneAsRead = async (id) => {
    try {
      await api.patch(`/notification/${id}/read`);
      const updated = notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      setNotifications(updated);
      const newUnreadCount = updated.filter((n) => !n.isRead).length;
      setUnreadCount(newUnreadCount);
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking one as read:", error);
      toast.error("Could not mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notification/mark-all-read");
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Could not mark notifications as read.");
    }
  };

  const visibleNotifications = hideRead ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="md:px-[104px] px-4 md:ml-10">
      {/* Breadcrumbs */}
      <div className="mt-28 flex items-center gap-2 mb-4 font-[400] font-inter flex-nowrap">
        <Link
          href="/Product-List"
          className="text-[#868686] md:text-[14px] hover:text-[#000] transition-all whitespace-nowrap"
        >
          Home &nbsp;&rsaquo;
        </Link>
        <Link href="/Notification" className="text-[#000087] md:text-[14px] font-[500]">
          Notifications
        </Link>
      </div>

      {/* Notification Card */}
      <div className="bg-white shadow-md rounded-[12px] w-full h-auto p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-row md:items-center gap-1">
            <h2 className="text-[14px] md:text-[18px] font-[500] font-inter text-[#525252]">My Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-[#525252] text-[#F7F7FF] flex justify-center text-[12px] font-inter font-[500] rounded-full w-[27px] h-[20px] font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-[#5555DD] font-[400] font-inter text-[14px]">
              Mark all as read
            </button>
          )}

          {/* Hide and Read checkbox */}
          {notifications.length > 0 && (
            <label htmlFor="" className="text-xs gap-1 items-center text-gray-600">
              <input
                type="checkbox"
                checked={hideRead}
                onChange={() => setHideRead(!hideRead)}
                className="accent-[#5555DD]"
              />
              Hide read
            </label>
          )}
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Img src="/notification1.svg" alt="Notification" width={158} height={158} className="mx-auto" />
            <p className="mt-4 text-gray-500 text-sm">No notifications yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {visibleNotifications.map((notif) => {
              const displayImage = notif.carAdImage;

              const imageUrl = displayImage
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${displayImage.replace(/\\/g, "/")}`
                : `https://placehold.co/64x64/E0E0E0/333333?text=No+Image`; // Placeholder URL

              return (
                <li
                  key={notif._id}
                  className={`flex justify-between items-center rounded-lg p-4 ${
                    notif.isRead ? "bg-transparent text-gray-500" : "hover:bg-[#EDEDED] text-black"
                  }`}
                >
                  {/* Left: Image + Message */}
                  <div className="flex items-center gap-3">
                    <Img
                      src={imageUrl}
                      alt="Ad"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-[#525252] font-[400] font-inter text-[12px] md:text-[14px] break-words leading-snug">
                        {notif.message}
                        <span>
                          <Link href="/view-vehicle-add" className="underline block md:inline">
                            View ad
                          </Link>
                        </span>
                      </p>

                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkOneAsRead(notif._id)}
                          className="text-[#5555DD] text-[12px] underline mt-1 text-left"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
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