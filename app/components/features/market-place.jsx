"use client";
import { useEffect, useState } from "react";
import Img from "../Image";
import Link from "next/link";
import api from "@/services/api";

export default function MarketPlace({ category, search, location }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const machineImage = "/machineGun.svg";
  const placeholderImage =
    "https://placehold.co/400x300/E5E7EB/4B5563?text=Image+Not+Available";

  const enhanceFrontendSorting = (adsArray) => {
    const planPriority = {
      enterprise: 6,
      diamond: 5,
      vip: 4,
      premium: 3,
      basic: 2,
      free: 1,
    };

    const paymentStatusPriority = {
      success: 3,
      pending: 2,
      failed: 1,
      free: 0,
    };

    return adsArray.sort((a, b) => {
      const adA = a.vehicleAd || a.propertyAd || a.petAd || a.agricultureAd || a.kidsAd || a.serviceAd || a.equipmentAd || a.gadgetAd || a.laptopAd || a.fashionAd || a.householdAd || a.beautyAd || a.constructionAd || a.jobAd;
      const adB = b.vehicleAd || b.propertyAd || b.petAd || b.agricultureAd || b.kidsAd || b.serviceAd || b.equipmentAd || b.gadgetAd || b.laptopAd || b.fashionAd || b.householdAd || b.beautyAd || b.constructionAd || b.jobAd;

      if (!adA && !adB) return 0;
      if (!adA) return -1;
      if (!adB) return -1;

      const paymentA = paymentStatusPriority[adA.paymentStatus] || 0;
      const paymentB = paymentStatusPriority[adB.paymentStatus] || 0;
      if (paymentA !== paymentB) return paymentB - paymentA;

      const planA = planPriority[adA.plan] || 1;
      const planB = planPriority[adB.plan] || 1;
      if (planA !== planB) return planB - planA;

      const priorityA = adA.priorityScore || 1;
      const priorityB = adB.priorityScore || 1;
      if (priorityA !== priorityB) return priorityB - priorityA;

      return new Date(adB.createdAt) - new Date(adA.createdAt);
    });
  };

  const isPremiumAd = (item) => {
    const ad = item.vehicleAd || item.propertyAd || item.petAd || item.agricultureAd || item.kidsAd || item.serviceAd || item.equipmentAd || item.gadgetAd || item.laptopAd || item.fashionAd || item.householdAd || item.beautyAd || item.constructionAd || item.jobAd;
    if (!ad) return false;
    const premiumPlans = ["premium", "vip", "diamond", "enterprise"];
    return ad.paymentStatus === "success" && premiumPlans.includes(ad.plan);
  };

  useEffect(() => {
    const fetchAllAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        if (location) params.location = location;

        const res = await api.get("/products/get-all-marketproducts", {
          params,
        });

        if (res.data.success) {
        let  adsArray = Array.isArray(res.data.data) ? res.data.data : [];

         // Client-side location fallback filter
         if (location) {
          const loc = location.toLowerCase();
          adsArray = adsArray.filter(item => {
            const carLoc = item.carAd?.location?.toLowerCase?.() || "";
            const propertyLoc = item.propertyAd?.location?.toLowerCase?.() || "";
            const businessLoc = item.business?.location?.toLowerCase?.() || "";
            return (
               carLoc.includes(loc) ||
               propertyLoc.includes(loc) ||
              businessLoc.includes(loc)
            );
          });
         }

         if (adsArray.length > 0) {
          const sortedAds = enhanceFrontendSorting(adsArray);
          setAds(sortedAds);
         } else {
          setAds([]);
         }
        } else {
          setError(res.data.message || "Failed to fetch ads.");
        }
      } catch (err) {
        console.error("Error fetching marketplace ads:", err);
        setError("Error fetching marketplace ads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAds();
  }, [category, search, location]);

  const trendingAds = ads.filter((item) => isPremiumAd(item));

  const vehicleNewlyPosted = ads.filter((item) => {
    const ad = item.vehicleAd;
    if (!ad) return false;
    const createdAt = new Date(ad.createdAt);
    const now = new Date();
    const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
    return diffDays <= 7; 
  });

  const propertyNewlyPosted = ads.filter((item) => {
     const ad = item.propertyAd;
     if (!ad) return false;
     const createdAt = new Date(ad.createdAt);
     const now = new Date();
     const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
     return diffDays <= 7;
  });

  const petNewlyPosted = ads.filter((item) => {
  const ad = item.petAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const agricultureNewlyPosted = ads.filter((item) => {
  const ad = item.agricultureAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const kidsNewlyPosted = ads.filter((item) => {
  const ad = item.kidsAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const serviceNewlyPosted = ads.filter((item) => {
  const ad = item.serviceAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const equipmentNewlyPosted = ads.filter((item) => {
  const ad = item.equipmentAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const gadgetNewlyPosted = ads.filter((item) => {
  const ad = item.gadgetAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const laptopNewlyPosted = ads.filter((item) => {
  const ad = item.laptopAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const fashionNewlyPosted = ads.filter((item) => {
  const ad = item.fashionAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const householdNewlyPosted = ads.filter((item) => {
   const ad = item.householdAd;
   if (!ad) return false;
   const createdAt = new Date(ad.createdAt);
   const now = new Date();
   const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
   return diffDays <= 7;
});

const beautyNewlyPosted = ads.filter((item) => {
  const ad = item.beautyAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const constructionNewlyPosted = ads.filter((item) => {
  const ad = item.constructionAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
});

const jobNewlyPosted = ads.filter((item) => {
  const ad = item.jobAd;
  if (!ad) return false;
  const createdAt = new Date(ad.createdAt);
  const now = new Date();
  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
})

  const recommendedAds = ads.filter((item) => {
    const ad = item.vehicleAd || item.propertyAd || item.petAd || item.agricultureAd || item.serviceAd || item.equipmentAd || item.gadgetAd || item.laptopAd || item.fashionAd || item.householdAd || item.beautyAd || item.constructionAd || item.jobAd;
    if (!ad) return false;
    return ["free", "basic"].includes(ad.plan);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-10 mt-10 text-center text-red-500">
        {error}
      </section>
    );
  }

  if (ads.length === 0) {
    return (
      <section className="px-4 md:px-10 mt-10 text-center">
        No marketplace ads found.
      </section>
    );
  }

  const renderAdCard = (item, index) => {
    const adId = item?.adId || index;
    const isCarAd = !!item.carAd && !!item.vehicleAd;
    const isPropertyAd = !!item.propertyAd;
    const isPetAd = !!item.petAd;
    const isAgricultureAd = !!item.agricultureAd;
    const isKidsAd = !!item.kidsAd;
    const isServiceAd = !!item.serviceAd;
    const isEquipmentAd = !!item.equipmentAd;
    const isGadgetAd = !!item.gadgetAd;
    const isLaptopAd = !!item.laptopAd;
    const isFashionAd = !!item.fashionAd;
    const isHouseholdAd = !!item.householdAd;
    const isBeautyAd  = !!item.beautyAd;
    const isConstructionAd = !!item.constructionAd;
    const isJobAd = !!item.jobAd;

    let imageUrl = null;
    let title = "Untitled Ad";
    let description = "No description available.";
    let price = "Price not set.";
    let adLocation = "Unknown";
    let plan = null;
    let carType = null;
    let transmission = null;
    let propertyType = null;
    let propertyCondition = null;
    let petBreed = null;
    let petAge = null;
    let agricultureType = null;
    let unit = null;
    let kidsTitle = null;
    let kidsGender = null;
    let kidsAgeGroup = null;
    let serviceTitle = null; 
    let servicePricing = null;
    let serviceExperience = null;
    let equipmentTitle = null;
    let gadgetTitle = null;
   let equipmentCondition = null;
   let equipmentBrand = null;
   let gadgetCondition = null;
   let gadgetBrand = null;
   let laptopTitle = null;
   let laptopCondition = null;
   let laptopBrand = null;
   let fashionTitle = null;
   let fashionType = null;
   let fashionCondition = null;
   let fashionMaterial = null;
   let fashionBrand = null;
   let householdTitle = null;
   let householdCondition = null;
   let householdType = null;
   let beautyType = null;
   let beautyCondition = null;
   let constructionTitle = null;
   let constructionType = null;
   let constructionMaterial = null;
   let constructionBrand = null;
   let jobTitle = null;
   let jobType = null;
   let jobLocationType = null;

    if (isCarAd) {
      imageUrl = item.carAd.vehicleImage?.[0];
      title = `${item.vehicleAd?.vehicleType || ""} ${
        item.vehicleAd?.model || ""
      } ${item.vehicleAd?.trim || ""} ${
        item.vehicleAd?.year || ""
      }`.trim();
      description =
        item.vehicleAd?.description || "No description available.";
      price = item.vehicleAd?.amount
        ? `₦${item.vehicleAd.amount.toLocaleString()}`
        : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
      plan = item.vehicleAd?.plan;
      carType = item.vehicleAd?.carType;
      transmission = item.vehicleAd?.transmission;
    } else if (isPropertyAd) {
      imageUrl = item.carAd?.propertyImage?.[0];
      title = item.propertyAd?.propertyName || "Untitled Property";
      description =
        item.propertyAd?.description || "No description available.";
      price = item.propertyAd?.amount
        ? `₦${item.propertyAd.amount.toLocaleString()}`
        : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
      plan = item.propertyAd?.plan;
      propertyType = item.propertyAd?.propertyType;
      propertyCondition = item.propertyAd?.propertyCondition;
    } else if (isPetAd) {
      imageUrl = item.carAd?.petsImage?.[0];
      title = `${item.petAd?.breed || ""} ${item.petAd?.petType || ""}`.trim();
      description = item.petAd?.description || "No description available.";
      price = item.petAd?.amount
         ? `₦${item.petAd.amount.toLocaleString()}`
         : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
     plan = item.petAd?.plan;
     petBreed = item.petAd?.breed;
     petAge = item.petAd?.age;
    } else if (isAgricultureAd) {
      imageUrl = item.carAd?.agricultureImage?.[0];
      title = `${item.agricultureAd?.title || ""} ${item.agricultureAd?.agricultureType || ""}`.trim();
      description = item.agricultureAd?.description || "No description available.";
      price = item.agricultureAd?.amount
        ? `₦${item.agricultureAd.amount.toLocaleString()}`
        : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
      plan = item.agricultureAd?.plan;
      agricultureType = item?.agricultureAd?.agricultureType?.[0] || 
                        item?.agricultureAd?.brand || 
                        item?.agricultureAd.feedType?.[0] || 
                        null;
      unit = item.agricultureAd?.unit;
    } else if (isKidsAd) {
        imageUrl = item.carAd?.kidsImage?.[0];
       title = item.kidsAd?.title || "Kids Item";
      description = item.kidsAd?.description || "No description available.";
      price = item.kidsAd?.amount
      ? `₦${item.kidsAd.amount.toLocaleString()}`
      : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
      plan = item.kidsAd?.plan;
      kidsGender = item.kidsAd?.gender;
      kidsAgeGroup = item.kidsAd?.ageGroup;
    } else if (isServiceAd) {
      imageUrl = item.carAd?.serviceImage?.[0];
      title = item.serviceAd?.serviceTitle || "Service";
      description = item.serviceAd?.description || "No description available.";
     price = item.serviceAd?.amount
        ? `₦${item.serviceAd.amount.toLocaleString()}`
       : item.serviceAd?.pricingType || "Contact for pricing";
       adLocation = item.carAd?.location || "Unknown";
       plan = item.serviceAd?.plan;
      serviceExperience = item.serviceAd?.serviceExperience;
     servicePricing = item.serviceAd?.pricingType;
  } else if (isEquipmentAd) {
      imageUrl = item.carAd?.equipmentImage?.[0];
      title = item.equipmentAd?.equipmentTitle || "Equipment";
     description = item.equipmentAd?.description || "No description available.";
      price = item.equipmentAd?.amount
       ? `₦${item.equipmentAd.amount.toLocaleString()}`
       : "Price not set.";
      adLocation = item.carAd?.location || "Unknown";
     plan = item.equipmentAd?.plan;
     equipmentTitle = item.equipmentAd?.equipmentTitle;
     equipmentCondition = item.equipmentAd?.condition;
    equipmentBrand = item.equipmentAd?.brand;
} else if (isGadgetAd) {
  imageUrl = item.carAd?.gadgetImage?.[0];
  title = item.gadgetAd?.gadgetTitle || "Gadget";
  description = item.gadgetAd?.description || "No description available";
  price = item.gadgetAd?.amount
    ? `₦${item.gadgetAd.amount.toLocaleString()}`
    : "Price not set.";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.gadgetAd?.plan;
  gadgetTitle = item.gadgetAd?.gadgetTitle;
  gadgetCondition = item.gadgetAd?.condition;
  gadgetBrand = item.gadgetAd?.gadgetBrand;
} else if (isLaptopAd) {
  imageUrl = item.carAd?.laptopImage?.[0];
  title  = item.laptopAd?.laptopTitle || "Laptop";
  description = item.laptopAd?.description || "No description available";
  price = item.laptopAd?.amount 
    ? `₦${item.laptopAd.amount.toLocaleString()}`
    : "Price not set.";
    adLocation = item.carAd?.location || "Unknown";
    plan = item.laptopAd?.plan;
    laptopTitle = item.laptopAd?.laptopTitle;
    laptopCondition = item.laptopAd?.condition;
    laptopBrand = item.laptopAd?.laptopBrand;
} else if (isFashionAd) {
  imageUrl = item.carAd?.fashionImage?.[0];
  title = item.fashionAd?.fashionTitle || "Fashion";
  description = item.fashionAd?.description || "No description available";
  price = item.fashionAd?.amount 
     ? `₦${item.fashionAd.amount.toLocaleString()}`
     : "Price not set.";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.fashionAd?.plan;
  fashionType = item.fashionAd?.fashionType;
  fashionCondition = item.fashionAd?.condition;
} else if (isHouseholdAd) {
  imageUrl = item.carAd?.householdImage?.[0];
  title = item.householdAd?.householdTitle || "Household";
  description = item.householdAd?.description || "No description available";
  price = item.householdAd?.amount 
     ? `₦${item.householdAd.amount.toLocaleString()}`
     : "Price not set.";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.householdAd?.plan;
  householdType = item.householdAd?.householdType;
  householdCondition = item.householdAd?.condition;
} else if (isBeautyAd) {
  imageUrl = item.carAd?.beautyImage?.[0];
  title = item.beautyAd?.beautyTitle || "Beauty";
  description = item.beautyAd?.description || "No description available";
  price = item.beautyAd?.amount 
    ? `₦${item.beautyAd.amount.toLocaleString()}`
    : "Price not set.";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.beautyAd?.plan;
  beautyType = item.beautyAd?.beautyType;
  beautyCondition = item.beautyAd?.condition;
} else if (isConstructionAd) {
  imageUrl = item.carAd?.constructionImage?.[0];
  title = item.constructionAd?.constructionTitle || "Construction";
  description = item.constructionAd?.description || "No description available";
  price = item.constructionAd?.amount
      ? `₦${item.constructionAd.amount.toLocaleString()}`
      : "Price not set.";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.constructionAd?.plan;
  constructionType = item.constructionAd?.constructionType;
  constructionBrand = item.constructionAd?.constructionBrand;
} else if (isJobAd) {
  imageUrl = item.carAd?.jobImage?.[0];
  title = item.jobAd?.jobTitle || "Job";
  description = item.jobAd?.description || "No description available";
  price = item.jobAd?.salaryRange
  ? `₦${Number(item.jobAd.salaryRange).toLocaleString()}`
  : "Salary Not set.";
  // price = item.jobAd?.salaryRange
  //     ? `₦${item.jobAd.salaryRange.toLocaleString()}`
  //     : "Salary Range not Set";
  adLocation = item.carAd?.location || "Unknown";
  plan = item.jobAd?.plan;
  jobType = item.jobAd?.jobType;
  jobLocationType = item.jobAd?.jobLocationType;
}

    return (
      <Link href={`/HomeList/${adId}`} key={adId}>
        <li className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="relative aspect-[4/3] overflow-hidden">
            {imageUrl ? (
              <Img
                src={imageUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
            ) : (
              <Img
                src={placeholderImage}
                alt="Image not available"
                fill
                className="object-cover"
              />
            )}

            {plan && (
              <div
                className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                style={{
                  backgroundImage: `url(${machineImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                  <Img
                    src="/medal-star1.svg"
                    alt="Plan"
                    width={24}
                    height={24}
                  />
                  <span className="text-[#000087] text-[10px] font-[400] font-inter uppercase">
                    {plan}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[#000087] font-inter font-semibold text-[14px] sm:text-[16px] md:text-[18px] truncate">
                {price}
              </span>
            </div>

            <h3 className="mt-1 text-[#525252] font-inter text-lg line-clamp-1">
              {title}
            </h3>

            <p className="text-[#8C8C8C] font-inter text-sm line-clamp-2 mb-4">
              {description}
            </p>

            <div className="flex items-center gap-1 text-[#8C8C8C] font-inter text-sm mb-4">
              <Img src="/location.svg" alt="Location" width={10} height={14} />
              <span>{adLocation}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {isCarAd && (
                <>
                  {carType && (
                    <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                      {carType}
                    </span>
                  )}
                  {transmission && (
                    <span className="bg-[#E8E8FF] font-inter text-[#525252] px-2 py-1 rounded text-xs">
                      {transmission}
                    </span>
                  )}
                </>
              )}

              {isPropertyAd && (
                <>
                  {propertyType && (
                    <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                      {propertyType}
                    </span>
                  )}
                  {propertyCondition && (
                    <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                      {propertyCondition}
                    </span>
                  )}
                </>
              )}

              {/* ADD THIS ENTIRE BLOCK */}
              {isPetAd && (
                <>
                 {petBreed && (
                   <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                   {petBreed}
                   </span> 
                 )}
                 {petAge && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                   {petAge}
                  </span>
                 )}
                </>
              )}
              {isAgricultureAd && (
                <>
                 {agricultureType && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {agricultureType}
                  </span>
                 )}
                 {unit && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {unit}
                  </span>
                 )}
                </>
              )}
               {isKidsAd && (
                <>
                 {kidsAgeGroup && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {kidsAgeGroup}
                  </span>
                 )}
                 {kidsGender && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {kidsGender}
                  </span>
                 )}
                </>
              )}
                {isServiceAd && (
                <>
                 {serviceExperience && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {serviceExperience}
                  </span>
                 )}
                 {servicePricing && (
                  <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
                     {servicePricing}
                  </span>
                 )}
                </>
              )}

          {isEquipmentAd && (
                <>
                {equipmentCondition && (
           <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
            {equipmentCondition}
          </span>
         )}
        {equipmentBrand && (
         <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {equipmentBrand}
         </span>
       )}
      </>
      )}

      {isGadgetAd && (
        <>
           {gadgetCondition && (
             <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {gadgetCondition}
            </span>
           )}
           {gadgetBrand && (
             <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {gadgetBrand}
            </span>
           )}
        </>
      )}

      {isLaptopAd && (
        <>
         {laptopCondition && (
         <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {laptopCondition}
         </span>
         )}
         {laptopBrand && (
           <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {laptopBrand}
            </span>
         )}
        </>
      )}

      {isFashionAd && (
        <>
         {fashionCondition && (
         <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {fashionCondition}
         </span>
         )}
         {fashionType && (
           <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {fashionType}
            </span>
         )}
        </>
      )}

      {isHouseholdAd && (
        <>
          {householdCondition && (
         <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {householdCondition}
         </span>
         )} 
          {householdType && (
           <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {householdType}
            </span>
         )}
        </>
      )}

      {isBeautyAd && (
        <>
          {beautyCondition && (
         <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {beautyCondition}
         </span>
         )} 
          {beautyType && (
           <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
              {beautyType}
            </span>
         )}
        </>
      )}

       {isConstructionAd && (
        <>
         {constructionType && (
        <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {constructionType}
         </span>
         )}
         {constructionBrand && (
          <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
           {constructionBrand}
          </span>
         )}
        </>
       )}

        {isJobAd && (
        <>
         {jobType && (
        <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
          {jobType}
         </span>
         )}
         {jobLocationType && (
          <span className="bg-[#E8E8FF] font-inter whitespace-nowrap text-[#525252] px-2 py-1 rounded text-xs">
           {jobLocationType}
          </span>
         )}
        </>
       )}
     </div>
      </div>
    </li>
    </Link>
    );
  };

  return (
    <section className="px-4 md:px-10 mt-10">
      <div className="container mx-auto px-0 sm:px-4 space-y-10">
        {trendingAds.length > 0 && (
          <div>
            <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">Trending</h2>
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {trendingAds.map((item, index) => renderAdCard(item, index))}
            </ul>
          </div>
        )}

        {vehicleNewlyPosted.length > 0 && (
          <div>
            <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4 mb-4">
              Vehicles Newly Posted 
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {vehicleNewlyPosted.map((item, index) =>
                renderAdCard(item, index)
              )}
            </ul>
          </div>
        )}

        {propertyNewlyPosted.length > 0 && (
          <div>
            <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E]  mb-4">
              Property Newly Posted
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {propertyNewlyPosted.map((item, index) =>
                renderAdCard(item, index)
              )}
            </ul>
          </div>
        )}

        {petNewlyPosted.length > 0 && (
          <div>
         <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Pets Newly Posted
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         {petNewlyPosted.map((item, index) =>
           renderAdCard(item, index)
        )}
       </ul>
     </div>
     )}

      {agricultureNewlyPosted.length > 0 && (
          <div>
             <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Agriculture & Foods Newly Posted
        </h2>
         <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         {agricultureNewlyPosted.map((item, index) =>
           renderAdCard(item, index)
        )}
       </ul>
          </div>
        )}

         {kidsNewlyPosted.length > 0 && (
                <div>
                <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
               Kids & Baby Products Newly Posted
               </h2>
             <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {kidsNewlyPosted.map((item, index) =>
               renderAdCard(item, index)
               )}
             </ul>
              </div>
              )}

          {serviceNewlyPosted.length > 0 && (
            <div>
             <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
               Services Newly Posted
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             {serviceNewlyPosted.map((item, index) =>
              renderAdCard(item, index)
             )}
            </ul>
          </div>
          )}

          {equipmentNewlyPosted.length > 0 && (
         <div>
         <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
         Work Tools Equipment Newly Posted
       </h2>
      <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {equipmentNewlyPosted.map((item, index) =>
        renderAdCard(item, index)
      )}
    </ul>
  </div>
   )}

    {gadgetNewlyPosted.length > 0 && (
        <div>
         <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Gadget Newly Posted
         </h2>
         <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gadgetNewlyPosted.map((item, index) => 
             renderAdCard(item, index)
          )}
         </ul>
        </div>
      )}

      {laptopNewlyPosted.length > 0 && (
        <div>
          <h2  className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
             Laptop Newlty Posted
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {laptopNewlyPosted.map((item, index) => 
              renderAdCard(item, index)
            )}
          </ul>
        </div>
      )}

      {fashionNewlyPosted.length > 0 && (
        <div>
        <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Fashion Newly Posted 
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {fashionNewlyPosted.map((item, index) => 
            renderAdCard(item, index)
          )}
        </ul>
        </div>
      )}

        {householdNewlyPosted.length > 0 && (
        <div>
        <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Household Items  Newly Posted
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {householdNewlyPosted.map((item, index) => 
            renderAdCard(item, index)
          )}
        </ul>
        </div>
      )}

      {beautyNewlyPosted.length > 0 && (
         <div>
        <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
           Health & Beauty Newly Posted
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {beautyNewlyPosted.map((item, index) => 
            renderAdCard(item, index)
          )}
        </ul>
        </div>
      )}

      {constructionNewlyPosted.length > 0 && (
         <div>
        <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
          Building & Construction Newly Posted
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {constructionNewlyPosted.map((item, index) => 
            renderAdCard(item, index)
          )}
        </ul>
        </div>
      )}

        {jobNewlyPosted.length > 0 && (
         <div>
        <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
          Jobs Newly Posted
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {jobNewlyPosted.map((item, index) => 
            renderAdCard(item, index)
          )}
        </ul>
        </div>
      )}

        {recommendedAds.length > 0 && (
          <div>
            <h2 className="text-[14px] md:text-[20px] font-inter font-[500] font-normal text-[#2E2E2E] mb-4">
              Recommended for You
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommendedAds.map((item, index) =>
                renderAdCard(item, index)
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}