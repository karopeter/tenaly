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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get("/notification");
        console.log("📊 Notification API Response:", res.data);
        
        const notificationList = res.data?.notifications || [];
        
        // Count unread notifications
        const count = notificationList.filter((n) => !n.isRead).length;
        setUnreadCount(count);

        // Process notifications
        const processedNotifications = notificationList.map((notif) => {
          console.log("🔍 Processing notification:", {
            id: notif._id,
            hasImages: notif.hasImages,
            imagesCount: notif.images?.length || 0,
            previewImage: notif.previewImage,
            adType: notif.adType
          });

          // Get display name based on ad type and details
          let displayName = "Your Ad";
          if (notif.adDetails) {
            if (notif.adDetails.model && notif.adDetails.year) {
              displayName = `${notif.adDetails.vehicleType || ''} ${notif.adDetails.model} (${notif.adDetails.year})`.trim();
            } else if (notif.adDetails.propertyName) {
              displayName = notif.adDetails.propertyName;
            } else if (notif.adDetails.propertyType) {
              displayName = notif.adDetails.propertyType;
            } else if (notif.adDetails.category) {
              displayName = notif.adDetails.category;
            } else if (notif.adDetails.petType && notif.adDetails.breed) {
              displayName = `${notif.adDetails.petType} - ${notif.adDetails.breed}`;
            } else if (notif.adDetails.title) {
               displayName = notif.adDetails.title;
            } else if (notif.adDetails.agricultyreType) {
                displayName = Array.isArray(notif.adDetails.agricultureType) 
                 ? notif.adDetails.agricultureType[0] 
                 : notif.adDetails.agricultureType;
            } else if (notif.adDetails.title && notif.adType === 'kids') {
              displayName = notif.adDetails.title;
            } else if (notif.adDetails.gender && notif.adDetails.ageGroup) {
              displayName = `${notif.adDetails.gender} - ${notif.adDetails.ageGroup}`;
            } else if (notif.adDetails.serviceTitle && notif.adType === 'service') {
              displayName = notif.adDetails.serviceTitle;
            } else if (notif.adDetails.serviceExperience && notif.adDetails.serviceDuration) {
              displayName = `${notif.adDetails.serviceExperience} - ${notif.adDetails.serviceDuration}`;
            } else if (notif.adDetails.equipmentTitle && notif.adType === 'equipment') {
               displayName = notif.adDetails.equipmentTitle;
            } else if (notif.adDetails.brand && notif.adDetails.usageType) {
              displayName = `${notif.adDetails.brand} - ${notif.adDetails.usageType}`;
            } else if (notif.adDetails.gadgetBrand && notif.adDetails.operatingSystem) {
              displayName = `${notif.adDetails.gadgetBrand} - ${notif.adDetails.operatingSystem}`;
            } else if (notif.adDetails.laptopTitle && notif.adType === 'laptop') {
              displayName = notif.adDetails.laptopTitle;
            } else if (notif.adDetails.condition && notif.adDetails.laptopBrand) {
              displayName = `${notif.adDetails.condition} - ${notif.adDetails.laptopBrand}`;
            } else if (notif.adDetails.condition && notif.adDetails.householdType) {
              displayName  = `${notif.adDetails.condition} - ${notif.adDetails.householdType}`;
            } else if (notif.adDetails.condition && notif.adDetails.beautyType) {
              displayName = `${notif.adDetails.condition} - ${notif.adDetails.beautyType}`;
            } else if (notif.adDetails.condition && notif.adDetails.constructionType) {
              displayName = `${notif.adDetails.condition} - ${notif.adDetails.constructionType}`;
            } else if (notif.adDetails.companyEmployerName && notif.adDetails.location) {
               displayName = `${notif.adDetails.companyEmployerName} - ${notif.adDetails.location}`;
            } else if (notif.adDetails.jobType && notif.adDetails.experienceLevel) {
              displayName = `${notif.adDetails.jobType} - ${notif.adDetails.experienceLevel}`;
            }
          }

          // Get the primary image for display - images come directly from CarAd
          const primaryImage = notif.previewImage || (notif.images && notif.images[0]) || null;
          
          console.log(`📸 Image for notification ${notif._id}:`, primaryImage ? 'Found' : 'Not found');
          
          return {
            ...notif,
            displayName,
            primaryImage,
            adType: notif.adType || 'unknown'
          };
        });

        setNotifications(processedNotifications);
        
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        toast.error("Failed to fetch notifications.");
      } finally {
        setLoading(false);
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

  const getViewAdLink = (notification) => {
    // Get the businessId and adId from the notification data
    const businessId = notification.adDetails?.businessCategory;
    const carAdId = notification.relatedCarAdId?._id || notification.relatedCarAdId;
    const vehicleAdId = notification.vehicleAd?._id;
    const propertyAdId = notification.propertyAd?._id;
    const petAdId = notification.petAd?._id;
    const agricultureAdId = notification.agricultureAd?._id;
    const kidAdId = notification.kidAd?._id;
    const serviceAdId = notification.serviceAd?._id;
    const equipmentAdId = notification.equipmentAd?._id;
    const gadgetAdId = notification.gadgetAd?._id;
    const laptopAdId = notification.laptopAd?._id;
    const fashionAdId = notification.fashionAd?._id;
    const householdAdId = notification.householdAd?._id;
    const beautyAdId = notification.beautyAd?._id;
    const constructionAdId = notification.constructionAd?._id;
    const jobAdId = notification.jobAd?._id;
    const hireAdId = notification.hireAd?._id;

    if (notification.adType === 'vehicle' && businessId && carAdId && vehicleAdId) {
      return `/ads/Vehicles/${businessId}/${carAdId}/${vehicleAdId}`;
    } else if (notification.adType === 'property' && businessId && carAdId && propertyAdId) {
      return `/ads/Property/${businessId}/${carAdId}/${propertyAdId}`;
    } else if (notification.adType === 'pet' && businessId && carAdId && petAdId) {
        return `/ads/Pets/${businessId}/${carAdId}/${petAdId}`;
    } else if (notification.adType === 'agriculture' && businessId && carAdId && agricultureAdId) {
        return `/ads/Agriculture/${businessId}/${carAdId}/${agricultureAdId}`;
    } else if (notification.adType === 'kids' && businessId && carAdId && kidAdId) {
      return `/ads/Kids/${businessId}/${carAdId}/${kidAdId}`;
    } else if (notification.adType === 'service' && businessId && carAdId && serviceAdId) {
       return `/ads/Service/${businessId}/${carAdId}/${serviceAdId}`;
    } else if (notification.adType === 'equipment' && businessId && carAdId && equipmentAdId) {
      return `/ads/Equipment/${businessId}/${carAdId}/${equipmentAdId}`;
    } else if (notification.adType === 'gadget' && businessId && carAdId && gadgetAdId) {
      return `/ads/Gadget/${businessId}/${carAdId}/${gadgetAdId}`;
    } else if (notification.adType === 'laptop' && businessId && carAdId && laptopAdId) {
      return `/ads/Laptop/${businessId}/${carAdId}/${laptopAdId}`;
    } else if (notification.adType === 'fashion' && businessId && carAdId && fashionAdId) {
      return `/ads/Fashion/${businessId}/${carAdId}/${fashionAdId}`;
    } else if (notification.adType === 'household' && businessId && carAdId && householdAdId) {
      return `/ads/Household/${businessId}/${carAdId}/${householdAdId}`;
    } else if (notification.adType === 'beauty' && businessId && carAdId && beautyAdId) {
      return `/ads/Beauty/${businessId}/${carAdId}/${beautyAdId}`;
    } else if (notification.adType === 'construction' && businessId && carAdId && constructionAdId) {
      return `/ads/Construction/${businessId}/${carAdId}/${constructionAdId}`;
    } else if (notification.adType === 'job' && businessId && carAdId && jobAdId) {
      return `/ads/Job/${businessId}/${carAdId}/${jobAdId}`;
    } else if (notification.adType === 'hire' && businessId && carAdId && hireAdId) {
      return `/ads/Hire/${businessId}/${carAdId}/${hireAdId}`;
    }
     
    // Fallback
    return "/my-ads";
  };

  const visibleNotifications = hideRead ? notifications.filter((n) => !n.isRead) : notifications;

  if (loading) {
    return (
      <div className="md:px-[104px] px-4 md:ml-10">
        <div className="mt-28 flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5555DD]"></div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-[14px] md:text-[18px] font-[500] font-inter text-[#525252]">
              My Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-[#525252] text-[#F7F7FF] flex justify-center text-[12px] font-inter font-[500] rounded-full w-[27px] h-[20px] font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {notifications.length > 0 && (
              <button 
                onClick={handleMarkAllAsRead} 
                className="text-[#5555DD] font-[400] font-inter text-[14px] hover:underline"
              >
                Mark all as read
              </button>
            )}

            {/* Hide read checkbox */}
            {notifications.length > 0 && (
              <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
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
        ) : (
          <ul className="space-y-4">
            {visibleNotifications.map((notif) => {
              // Use the image from CarAd (already provided by backend)
              const imageUrl = notif.primaryImage;
              const hasRealImage = !!imageUrl;

              return (
                <li
                  key={notif._id}
                  className={`flex justify-between items-center rounded-lg p-4 transition-all duration-200 ${
                    notif.isRead 
                      ? "bg-transparent text-gray-500" 
                      : "hover:bg-[#EDEDED] text-black"
                  }`}
                >
                  {/* Left: Image + Message */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Img
                        src={hasRealImage ? imageUrl : "/notifUpdate.png"}
                        alt={`${notif.displayName} image`}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-md object-cover border border-gray-200"
                        onError={(e) => {
                          console.log("🖼️ Image failed to load, using placeholder");
                          e.target.src = "/notifUpdate.png";
                        }}
                      />
                      
                      {/* Visual indicator for ad type */}
                      {notif.adType && notif.adType !== 'unknown' && (
                        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                          notif.adType === 'vehicle' ? 'bg-blue-500' : 
                          notif.adType === 'property' ? 'bg-green-500' :  
                          notif.adType === 'pet' ? 'bg-purple-500' : 
                          notif.adType === 'agriculture' ? 'bg-orange-500' : 
                          notif.adType === 'kids' ? 'bg-pink-500' :
                          notif.adType === 'service' ? 'bg-orange-500' : 
                          notif.adType === 'equipment' ? 'bg-yellow-500' :
                          notif.adType === 'gadget' ? 'bg-blue-500' :
                          notif.adType === 'laptop' ? 'bg-green-500' :
                          notif.adType === 'fashion' ? 'bg-red-500' :
                          notif.adType === 'household' ? 'bg-orange-500' : 
                          notif.adType === 'beauty' ? 'bg-pink-600' :
                          notif.adType === 'construction' ? 'bg-orange-500' : 
                          notif.adType === 'job' ? 'bg-red-500' :
                          notif.adType === 'hire' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`} title={`${notif.adType} ad`}></span>
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex flex-col gap-1">
                        {/* Ad name/title if available */}
                        {notif.displayName && notif.displayName !== "Your Ad" && (
                          <p className="text-[13px] font-[500] text-[#333] truncate">
                            {notif.displayName}
                          </p>
                        )}
                        
                        {/* Notification message */}
                        <p className="text-[#525252] font-[400] font-inter text-[12px] md:text-[14px] break-words leading-snug">
                          {notif.message}
                          {notif.adDetails && (notif.vehicleAd || notif.propertyAd || notif.petAd || notif.agricultureAd || notif.kidAd || notif.serviceAd || notif.equipmentAd || notif.gadgetAd || notif.laptopAd || notif.fashionAd || notif.householdAd || notif.beautyAd || notif.constructionAd || notif.jobAd || notif.hireAd

                          ) && (
                            <span className="ml-1">
                              <Link 
                                href={getViewAdLink(notif)} 
                                className="text-[#5555DD] underline hover:no-underline transition-all"
                              >
                                View ad
                              </Link>
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Mark as read button for unread notifications */}
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkOneAsRead(notif._id)}
                          className="text-[#5555DD] text-[12px] underline hover:no-underline mt-1 text-left self-start transition-all"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Date and status */}
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs text-[#868686] font-[400] text-[14px] whitespace-nowrap font-inter">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    
                    {/* Visual indicator for unread */}
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-[#5555DD] rounded-full"></div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}