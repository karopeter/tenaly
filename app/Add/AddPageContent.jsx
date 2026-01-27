"use client";
import { useState, useEffect } from "react";
import { FiEye, FiTrash2, FiMoreHorizontal, FiCheck } from "react-icons/fi";
import Img from "../components/Image";
import Button from "../components/Button";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, Edit, Eye, Trash2, Check, AlertCircle } from "lucide-react";

export default function AddCarPostContent() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [vehicleAds, setVehicleAds] = useState([]);
  const [propertyAds, setPropertyAds] = useState([]);
  const [petAds, setPetAds] = useState([]);
  const [kidAds, setKidAds] = useState([]);
  const [agricultureAds, setAgricultureAds] = useState([]);
  const [serviceAds, setServiceAds] = useState([]);
  const [equipmentAds, setEquipmentAds] = useState([]);
  const [gadgetAds, setGadgetAds] = useState([]);
  const [laptopAds, setLaptopAds] = useState([]);
  const [fashionAds, setFashionAds] = useState([]);
  const [householdAds, setHouseholdAds] = useState([]);
  const [beautyAds, setBeautyAds] = useState([]);
  const [constructionAds, setConstructionAds] = useState([]);
  const [jobAds, setJobAds] = useState([]);
  const [hireAds, setHireAds] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { verificationStatus, role, profile  } = useAuth();
  const [activeTab, setActiveTab] = useState('vehicles'); 
  const [showMenu, setShowMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [businessesLoaded, setBusinessesLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [markingSold, setMarkingSold] = useState(null);
  const machineImage = "/machineGun.svg";

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        setBusinesses(res.data);
        if (res.data.length > 0) {
          setSelectedBusiness(res.data[0]._id);
        }
        setBusinessesLoaded(true);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setBusinesses([]);
        setBusinessesLoaded(true);
      }
    };
    fetchBusinesses();
  }, []);

    const fetchAllAds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authorized");
        setLoading(false);
        setAdsLoaded(true);
        return;
      }

      try {
        const vehicleRes = await api.get(
          `/vehicles/ads/combined-vehicle?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setVehicleAds(vehicleRes.data.data || []);

        const propertyRes = await api.get(
          `/property/ads/combined-property?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setPropertyAds(propertyRes.data.data || []);

        const petRes = await api.get(
          `/pets/ads/combined-pets?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setPetAds(petRes.data.data || []);

        const agricultureRes = await api.get(
          `/agriculture/ads/combined-agriculture?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setAgricultureAds(agricultureRes.data.data || []);

        const kidRes = await api.get(
          `/kids/ads/combined-kids?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setKidAds(kidRes.data.data || []);

        const serviceRes = await api.get(
          `/services/ads/combined-services?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setServiceAds(serviceRes.data.data || []);

        const equipmentRes = await api.get(
          `/equipments/ads/combined-equipment?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setEquipmentAds(equipmentRes.data.data || []);

        const gadgetRes = await api.get(
          `/gadget/ads/combined-gadget?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setGadgetAds(gadgetRes.data.data || []);

        const laptopRes = await api.get(
          `/laptops/ads/combined-laptop?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setLaptopAds(laptopRes.data.data || []);

        const fashionRes = await api.get(
          `/fashion/ads/combined-fashion?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setFashionAds(fashionRes.data.data || []);

        const householdRes = await api.get(
          `/household/ads/combined-household?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setHouseholdAds(householdRes.data.data || []);

        const beautyRes = await api.get(
          `/beauty/ads/combined-beauty?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setBeautyAds(beautyRes.data.data || []);

        const constructionRes = await api.get(
          `/construction/ads/combined-construction?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setConstructionAds(constructionRes.data.data || []);

        const jobRes = await api.get(
          `/jobs/ads/combined-job?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setJobAds(jobRes.data.data || []);

        const hireRes = await api.get(
          `/hire/ads/combined-hire?businessId=${selectedBusiness}&page=1&limit=10`
        );
        setHireAds(hireRes.data.data || []);


        setAdsLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ads:", err);
        if (err.response?.status === 401) {
          setError("Not authorized - please log in");
        } else {
          console.warn("API error, treating as no ads:", err.message);
        }
        setAdsLoaded(true);
        setLoading(false);
      }
    };

    // Add this new useEffect after your existing useEffects
useEffect(() => {
  // Refetch ads when component becomes visible (e.g., after navigating back)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      const wasUpdated = localStorage.getItem('adUpdated');
      if (wasUpdated === 'true') {
        localStorage.removeItem('adUpdated');
        fetchAllAds();
        toast.success('Ads refreshed');
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Also check on mount
  const wasUpdated = localStorage.getItem('adUpdated');
  if (wasUpdated === 'true') {
    localStorage.removeItem('adUpdated');
    fetchAllAds();
  }

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);

useEffect(() => {
  if (adsLoaded && availableTabs.length > 0) {
    const currentTabHasAds = availableTabs.some(tab => tab.id === activeTab);
    if (!currentTabHasAds) {
      setActiveTab(availableTabs[0].id);
    }
  }
}, [adsLoaded, vehicleAds.length, propertyAds.length, petAds.length, agricultureAds.length, kidAds.length, serviceAds.length, gadgetAds.length, laptopAds.length, fashionAds.length, householdAds.length + beautyAds.length + constructionAds.length + jobAds.length]);


  useEffect(() => {
    if (!businessesLoaded) return;
    
    if (businesses.length === 0 || !selectedBusiness) {
      setLoading(false);
      setAdsLoaded(true);
      return;
    }
    fetchAllAds();
  }, [selectedBusiness, businessesLoaded, businesses.length]);

  // Helper to check if ad is incomplete
  const isIncompleteAd = (carAd, detailedAd) => {
    return carAd && !detailedAd;
  };

  const handlePostAdClick = () => {
    if (role === "seller" && (!profile?.tierLevel || profile.tierLevel < 1)) {
      setShowVerificationModal(true);
    } else {
      router.push("/create-add");
    }
  };
  

const handleEditIncompleteAd = async (carAdId, category) => {
  try {
    const response = await api.get(`/carAdd/check-ad-completion/${carAdId}`);
    const { carAd, adType, isComplete } = response.data;

    if (isComplete) {
      toast.success("This ad is already complete");
      localStorage.removeItem("editingCarAdId");
      localStorage.removeItem("editingCarAdData");
      localStorage.removeItem("editingAdType");
      fetchAllAds();
      return;
    }

    const actualCarAdId = carAd._id;
    
    let mergedData = { ...carAd };

    if (adType === 'vehicle') {
      try {
        const vehicleResponse = await api.get(`/vehicles/draft/${actualCarAdId}`);
        if (vehicleResponse.data && vehicleResponse.data.vehicleAd) {
          const vehicleAd = vehicleResponse.data.vehicleAd;
          
          mergedData = {
            ...carAd,
            ...vehicleAd,
            businessCategory: carAd.businessCategory
          };
          
          console.log("✅ Merged vehicle draft data:", mergedData);
        }
      } catch (vehicleError) {
        console.log("⚠️ No VehicleAd draft found, using CarAd only");
      }
    } else if (adType === 'property') {
      try {
        const propertyResponse = await api.get(`/property/draft/${actualCarAdId}`);
        if (propertyResponse.data && propertyResponse.data.propertyAd) {
          const propertyAd = propertyResponse.data.propertyAd;
          
          mergedData = {
            ...carAd,
            ...propertyAd,
            businessCategory: carAd.businessCategory
          };
          
          console.log("✅ Merged property draft data:", mergedData);
        }
      } catch (propertyError) {
        console.log("⚠️ No PropertyAd draft found, using CarAd only");
      }
    } else if (adType === 'pet') {
       try {
         const petResponse = await api.get(`/pets/draft/${actualCarAdId}`);
         if (petResponse.data && petResponse.data.petsAd) {
            const petsAd = petResponse.data.petsAd;

            mergedData = {
              ...carAd,
              ...petsAd,
              businessCategory: carAd.businessCategory
            };

          console.log("✅ Merged pet draft data:", mergedData);
         }
       } catch (petError) {
          console.log("⚠️ No PetAd draft found, using CarAd only");
       }
    } 
    else if (adType === 'agriculture') {
       try {
         const agricultureResponse = await api.get(`/agriculture/draft/${actualCarAdId}`);
         if (agricultureResponse.data && agricultureResponse.data.agricultureAd) {
          const agricultureAd = agricultureResponse.data.agricultureAd;

          mergedData = {
            ...carAd,
            ...agricultureAd,
            businessCategory: carAd.businessCategory
          };

         console.log("✅ Merged agriculture draft data:", mergedData);
         }
       } catch (agricultureError) {
        console.log("⚠️ No AgricultureAd draft found, using CarAd only");
       }
    } else if (adType === 'service') {
       try {
         const serviceResponse = await api.get(`/services/draft/${actualCarAdId}`);
         if (serviceResponse.data && serviceResponse.data.serviceAd) {
          const serviceAd = serviceResponse.data.serviceAd;

          mergedData = {
            ...carAd,
            ...serviceAd,
            businessCategory: carAd.businessCategory
          };

         console.log("✅ Merged service draft data:", mergedData);
         }
       } catch (serviceError) {
        console.log("⚠️ No ServiceAd draft found, using CarAd only");
       }
      } else if (adType === 'kid') {
        try {
         const kidResponse = await api.get(`/kids/draft/${actualCarAdId}`);
         if (kidResponse.data && kidResponse.data.kidAd) {
          const kidAd = kidResponse.data.kidAd;

          mergedData = {
            ...carAd,
            ...kidAd,
            businessCategory: carAd.businessCategory
          };

         console.log("✅ Merged kid draft data:", mergedData);
         }
       } catch (kidError) {
        console.log("⚠️ No KidAd draft found, using CarAd only");
       }
    }   else if (adType === 'equipment') {
        try {
         const equipmentResponse = await api.get(`/equipments/draft/${actualCarAdId}`);
         if (equipmentResponse.data && equipmentResponse.data.equipmentAd) {
          const equipmentAd = equipmentResponse.data.equipmentAd;

          mergedData = {
            ...carAd,
            ...equipmentAd,
            businessCategory: carAd.businessCategory
          };

         console.log("✅ Merged equipment draft data:", mergedData);
         }
       } catch (equipmentError) {
        console.log("⚠️ No EquipmentAd draft found, using CarAd only");
       }
    } else if (adType === 'gadget') {
       try {
         const gadgetResponse = await api.get(`/gadget/draft/${actualCarAdId}`);
         if (gadgetResponse.data && gadgetResponse.data.gadgetAd) {
          const gadgetAd = gadgetResponse.data.gadgetAd;

          mergedData = {
            ...carAd,
            gadgetAd,
            businessCategory: carAd.businessCategory
          };

          console.log("✅ Merged gadget draft data:", mergedData);
         }
       } catch (gadgetError) {
         console.log("⚠️ No GadgetAd draft found, using CarAd only");
       }
    } else if (adType === 'laptop') {
       try {
         const laptopResponse = await api.get(`/laptops/draft/${actualCarAdId}`);
         if (laptopResponse.data && laptopResponse.data.laptopAd) {
          const laptopAd = laptopResponse.data.laptopAd;

          mergedData = {
            ...carAd,
            laptopAd,
            businessCategory: carAd.businessCategory
          };

          console.log("✅ Merged laptop draft data:", mergedData);
         }
       } catch (laptopError) {
         console.log("⚠️ No LaptopAd draft found, using CarAd Only");
       }
    } else if (adType === 'fashion') {
       try {
         const fashionResponse = await api.get(`/fashion/draft/${actualCarAdId}`);
         if (fashionResponse.data && fashionResponse.data.fashionAd) {
          const fashionAd = fashionResponse.data.fashionAd;

          mergedData = {
            ...carAd,
            fashionAd,
            businessCategory: carAd.businessCategory
          };

          console.log("Merged Fashion draft data:", mergedData);
         }
       } catch (fashionError) {
          console.log("⚠️ No FashionAd draft found, using CarAd Only");
       }
    } else if (adType === 'household') {
       try {
         const householdResponse = await api.get(`/household/draft/${actualCarAdId}`);
         if (householdResponse.data && householdResponse.data.householdAd) {
          const householdAd = householdResponse.data.householdAd;

          mergedData = {
            ...carAd,
            householdAd,
            businessCategory: carAd.businessCategory
          };

          console.log("Merged Household draft data:", mergedData);
         }
       } catch (householdError) {
          console.log("⚠️ No HouseholdAd draft found, using CarAd Only");
       }
    } else if (adType === 'beauty') {
      try {
        const beautyResponse = await api.get(`/beauty/draft/${actualCarAdId}`);
        if (beautyResponse.data && beautyResponse.data.beautyAd) {
          const beautyAd = beautyResponse.data.beautyAd;

          mergedData = {
            ...carAd,
            beautyAd,
            businessCategory: carAd.businessCategory
          };
          console.log("Merged Beauty draft data:", mergedData);
        }
      } catch (beautyError) {
        console.log("⚠️ No BeautyAd draft found, using CarAd Only");
      }
    } else if (adType === 'construction') {
       try {
        const constructionResponse = await api.get(`/construction/draft/${actualCarAdId}`);
        if (constructionResponse.data && constructionResponse.data.constructionAd) {
          const constructionAd = constructionResponse.data.constructionAd;

          mergedData = {
            ...carAd,
            constructionAd,
            businessCategory: carAd.businessCategory
          };
          console.log("Merged Construction draft data:", mergedData);
        }
       } catch (constructionError) {
          console.log("⚠️ No ConstructionAd draft found, using CarAd Only");
       }
    } else if (adType === 'job') {
       try {
        const jobResponse = await api.get(`/jobs/draft/${actualCarAdId}`);
        if (jobResponse.data && jobResponse.data.jobAd) {

          const jobAd = jobResponse.data.jobAd;

         mergedData = {
            ...carAd,
            jobAd,
            businessCategory: carAd.businessCategory
          };
          console.log("Merged Job Draft Data:", mergedData);
        }
       } catch (jobError) {
         console.log("⚠️ No JobAd draft found, using CarAd Only");
       }
    } else if (adType === 'hire') {
       try {
         const hireResponse = await api.get(`/hire/draft/${actualCarAdId}`);
         if (hireResponse.data && hireResponse.data.hireAd) {

          const hireAd = hireResponse.data.hireAd;

          mergedData = {
            ...carAd,
            hireAd,
            businessCategory: carAd.businessCategory
          };
          console.log("Merged Hire Draft Data:", mergedData);
         }
       } catch (hireError) {
        console.log("No HireAd draft found, using CarAd only");
       }
    }

    localStorage.setItem("editingCarAdId", actualCarAdId);
    localStorage.setItem("editingCarAdData", JSON.stringify(mergedData));
    localStorage.setItem("editingAdType", adType);

    // Route to appropriate form...
    const vehicleCategories = ["car", "bus", "tricycle"];
    const petCategories = [  
      "Dogs",
      "Cats",
      "Birds",
      "Fish & Aquarium",
      "Small Pets (rabbits, hamsters, guinea pigs)",
      "Pet Accessories",
      "Pet Food"
    ];
    const agricultureCategories = [
      'Fresh Produce (fruits, vegetables, grains)',
     'Livestock (poultry, goats, cattle, pigs, etc.)',
     'Seeds & Seedlings',
     'Animal Feed',
     'Fertilizers',
     'Farm Tools & Equipment',
     'Agro Chemicals (pesticides, herbicides)',
     'Farm Services (plowing, irrigation, consultancy)'
    ];
    const kidCategories = [
     'Baby Clothes',
     'Kids Clothes',
     'Shoes',
     'Toys & Games',
     'Baby Gear (strollers, car seats, carriers)',
     'Feeding (bottles, high chairs, breast pumps)',
    'Furniture (cribs, cots, wardrobes)',
    'Health & Safety (monitors, baby gates)',
     'School Supplies (bags, books, stationery)'
    ];
     const serviceCategories = [
        'Tech & IT',
        'Lessons & Training',
        'Cleaning',
        'Repairs & Maintenance',
        'Painting & Well Finishing',
        'Plumbing',
        'Electrical Wiring & Installation',
        'Furniture Assembly',
        'Beauty & Wellness',
        'Creative & Media',
        'Event Planning & Coordination',
        'Dj Services',
        'MC / Host Services'
        ];
          const equipmentCategories = [
            'Industrial Machines',
            'Construction Equipment',
            'Power Tools',
            'Manufacturing Equipment',
            'Medical & Laboratory Equipment',
            'Kitchen & Restaurant Equipment',
            'Printing & Packaging Machines',
            'Agricultural Machinery',
            'Cleaning & Laundry Equipment',
            'Office Equipment'
          ];
          const gadgetCategories = [
             'Mobile Phones',
            'Tablets',
            'Smartwatches',
            'Phone Accessories',
            'Tablet Accessories',
            'Power Banks',
            'Chargers & Cables',
            'Screen Protectors',
            'Pouch',
            'Covers',
            'Earphones / Headsets',
          ];

          const laptopCategories = [
            'Laptops',
            'Desktop Computers',
            'Computer Accessories',
            'Monitors',
            'Printers & Scanners',
            'Networking Equipment',
            'Storage Devices',
            'Software',
            'Others',
          ];

          const fashionCategories = [
            'Clothing',
           'Footwear',
           'Bags',
           'Jewellery',
           'Watches',
           'Accessories',
           'Eyewear (Glasses & Sunglasses)',
           'Wedding & Event Wear',
          ];

          const householdCategories = [
             'Furniture',
             'Home Appliances',
             'Kitchen Appliances',
             'Home Decor',
             'Lighting',
             'Bedding & Linen',
             'Curtains & Blinds',
             'Kitchenware & Cookware',
             'Cleaning Equipment',
             'Bathroom Accessories',
             'Garden & Outdoor',
             'Others',
          ];
          const beautyCategories = [
            'Skin Care',
            'Hair Care',
            'Makeup & Cosmetics',
            'Fragrances (Perfume & Body Spray)',
            'Bath & Body',
            'Nail Care',
            'Beauty Tools & Accessories',
            'Personal Grooming Devices', 
            'Oral Care',
            "Men's Grooming",
          ];
          const constructionCategories = [
             'Building Material',
             'Eletrical Equipment & Tools',
             'Plumbing Material & Fittings',
             'Paints & Finishes',
             'Hand Tools',
             'Safety Equipment & Workwear',
             'Repair & Maintenance Services',
             'Construction  Equipment',
             'Roofing Materials',
             'Flooring & Tiles',
          ];
          
      const jobCategories = [
       'Jobs',
     'Jobs for Hire',
     'Jobs for sale',
    ];

    const hireCategories = [
     'Hire Tech & IT',
     'Lessons & Trainings',
     'Hire Cleaners',
     'Repairs & Maintenance',
     'Painting & Wall Finishing',
     'Plumbing',
     'Eletrical Wiring & Installation',
     'Furniture Assembly',
     'Beauty & Wellness',
     'Creative & Media',
     'Event Planning & Coordination',
     'DJ Services',
     'MC / Host Services'
    ];
     const petRouteMap = {
       "Dogs": "/pets-dogs",
  "Cats": "/pets-cats",
  "Birds": "/pets-birds",
  "Fish & Aquarium": "/fish-aquarium",
  "Small Pets (rabbits, hamsters, guinea pigs)": "/pets-hamster",
  "Pet Accessories": "/pets-accessories",
  "Pet Food": "/pets-food",
    };
    const propertyRouteMap = {
      "Commercial Property For Rent": "/commercial-rent",
      "Commercial Property For Sale": "/commercial-sale",
      "House and Apartment Property For Rent": "/apartment-rent",
      "House and Apartment Property For Sale": "/apartment-sale",
      "Land and Plot For Rent": "/land-rent",
      "Land and Plot For Sale": "/land-sale",
      "Short Let Property": "/shortlet",
      "Event Center And Venues": "/event-center",
    };
    const agricultureRouteMap = {
      "Fresh Produce (fruits, vegetables, grains)": "/agriculture-produce",
      "Livestock (poultry, goats, cattle, pigs, etc.)": "/agriculture-livestock",
      "Seeds & Seedlings": "/seeds-seedlings",
      "Animal Feed": "/animal-feed",
      "Fertilizers": "/fertilizers",
      "Farm Tools & Equipment": "/farm-tool-equipment",
      "Agro Chemicals (pesticides, herbicides)": "/agro-chemical",
      "Farm Services (plowing, irrigation, consultancy)": "/farm-services",
    };

    const kidRouteMap = {
       "Baby Clothes": "/kids-baby-clothes",
      "Kids Clothes": "/kids-clothes",
      "Shoes": "/kids-shoes",
      "Toys & Games": "/kids-toys-games",
      "Baby Gear (strollers, car seats, carriers)": "/kids-baby-gear",
      "Feeding (bottles, high chairs, breast pumps)": "/kids-baby-feeding",
      "Furniture (cribs, cots, wardrobes)": "/kids-baby-furniture",
      "Health & Safety (monitors, baby gates)": "/kids-baby-health&safety",
     "School Supplies (bags, books, stationery)": "/kids-school-supplies",
    };
    
    const serviceRouteMap = {
      "Tech & IT": "/services-tech-it",
      "Lessons & Training": "/services-lessons-training",
      "Cleaning": "/services-cleaning",
      "Repairs & Maintenance": "/services-repairs-maintenance",
      "Painting & Well Finishing": "/services-painting",
      "Plumbing": "/services-plumbing",
      "Electrical Wiring & Installation": "/services-electrical",
      "Furniture Assembly": "/services-furniture-assembly",
      "Beauty & Wellness": "/services-beauty-wellness",
      "Creative & Media": "/services-creative-media",
      "Event Planning & Coordination": "/services-event-planning",
      "Dj Services": "/services-dj",
      "MC / Host Services": "/services-mc-host",
    };

    const equipmentRouteMap = {
       'Industrial Machines': '/industrial-machines',
      'Construction Equipment': '/construction-equipment',
      'Power Tools': '/power-tools',
      'Manufacturing Equipment': '/manufacturing-equipment',
      'Medical & Laboratory Equipment': '/medical-laboratory-equipment',
      'Kitchen & Resturant Equipment': '/kitchen-resturant-equipment',
      'Printing & Packaging Machines': '/printing-packaging',
      'Agricultural Machinery':'/agricultural-machinery',
      'Cleaning & Laundry Equipment': '/cleaning-laundry-equipment',
      'Office Equipment': '/office-equipment',
    };

    const gadgetRouteMap = {
    'Mobile Phones': '/gadget-mobile-phones',
    'Tablets': '/gadget-mobile-tablets',
    'Smartwatches': '/gadget-smart-watches',
    'Phone Accessories': '/gadget-phone-accessories',
    'Tablet Accessories': '/gadget-tablet-accessories',
    'Power Banks': '/gadget-power-banks',
    'Chargers & Cables': '/gadget-chargers-cables',
    'Screen Protectors': '/gadget-screen-protectors',
    'Pouch': '/gadget-pouch',
    'Covers': '/gadget-covers',
    'Earphones / Headsets': '/gadget-earphones-headsets',
    };

    const laptopRouteMap = {
       'Laptops': '/laptops',
      'Desktop Computers': '/desktop-computers',
      'Computer Accessories': '/desktop-accessories',
      'Monitors': '/monitors',
      'Printers & Scanners': '/printers-scanners',
      'Networking Equipment': '/networking-equipment',
       'Storage Devices': '/storage-devices',
      'Software': '/software',
      'Others': '/others',
    };

    const fashionRouteMap = {     
      'Clothing': '/fashion-clothing',
     'Footwear': '/fashion-footwear',
     'Bags': '/fashion-bags',
     'Jewellery': '/fashion-jewellery',
     'Watches': '/fashion-watches',
     'Accessories': '/fashion-accesories',
     'Eyewear (Glasses & Sunglasses)': '/fashion-eyewear',
     'Wedding & Event Wear': '/fashion-wedding-eventwear',
    };

    const householdRouteMap = {
      'Furniture': '/household-furniture',
      'Home Appliances': '/household-appliances',
      'Kitchen Appliances': '/kitchen-appliances',
      'Home Decor': '/household-home-decor',
      'Lighting': '/household-lighting',
      'Bedding & Linen': '/household-bedding-linen',
      'Curtains & Blinds': '/household-curtains',
      'Kitchenware & Cookware': '/household-kitchenware',
      'Cleaning Equipment': '/household-cleaning-equipment',
      'Bathroom Accessories': '/household-bathroom-accessories',
      'Garden & Outdoor': '/household-garden-outdoor',
      'Others': '/household-others',
    };

    const beautyRoutMap = {
      'Skin Care': '/beauty-skin-care',
      'Hair Care': '/beauty-hair-care',
      'Makeup & Cosmetics': '/beauty-makeup-cosmetics',
      'Fragrances (Perfume & Body Spray)': '/beauty-fragrances',
      'Bath & Body': '/beauty-bath-body',
      'Nail Care': '/beauty-nail-care',
      'Beauty Tools & Accessories': '/beauty-tool-accessories',
      'Personal Grooming Devices': '/beauty-personal-grooming', 
      'Oral Care': '/beauty-oral-care',
      "Men's Grooming": '/beauty-men-grooming',
    };

    const constructionRouteMap = {   
     'Building Material': '/construction-building-materials',
    'Eletrical Equipment & Tools': '/construction-eletrical-equipment',
    'Plumbing Material & Fittings': '/construction-plumbing-material',
    'Paints & Finishes': '/construction-paints-finishes',
    'Hand Tools': '/construction-hand-tools',
    'Safety Equipment & Workwear': '/construction-safety-equipments',
    'Repair & Maintenance Services': '/construction-repair-maintenance',
    'Construction  Equipment': '/construction-equipment-building',
    'Roofing Materials': '/construction-roofing',
    'Flooring & Tiles': '/construction-tiles',
    };

    const jobRouteMap = {
       'Jobs': '/jobs',
     'Jobs for Hire': '/jobs',
     'Jobs for sale': '/jobs',
    };

    const hireRouteMap = {
        'Hire Tech & IT': '/hire',
     'Lessons & Trainings': '/hire',
     'Hire Cleaners': '/hire',
     'Repairs & Maintenance': '/hire',
     'Painting & Wall Finishing': '/hire',
     'Plumbing': '/hire',
     'Eletrical Wiring & Installation': '/hire',
     'Furniture Assembly': '/hire',
     'Beauty & Wellness': '/hire',
     'Creative & Media': '/hire',
     'Event Planning & Coordination': '/hire',
     'DJ Services': '/hire',
     'MC / Host Services': '/hire'
    };
  
     let targetRoute = "";
    if (vehicleCategories.includes(category?.toLowerCase())) {
      targetRoute = `/more-post-vehicle?carAdId=${actualCarAdId}`;
    } else if (petCategories.includes(category)) { 
      targetRoute = petRouteMap[category];
    } else if (agricultureCategories.includes(category)) {
      targetRoute = agricultureRouteMap[category];
    }  else if (kidCategories.includes(category)) {
      targetRoute = kidRouteMap[category];
    } else if (serviceCategories.includes(category)) {
      targetRoute = serviceRouteMap[category];
    } else if (equipmentCategories.includes(category)) {
       targetRoute = equipmentRouteMap[category];
    }  else if (gadgetCategories.includes(category)) {
      targetRoute = gadgetRouteMap[category];
    } else if (laptopCategories.includes(category)) {
       targetRoute = laptopRouteMap[category];
    } else if (fashionCategories.includes(category)) {
       targetRoute = fashionRouteMap[category];
    } else if (householdCategories.includes(category)) {
      targetRoute = householdRouteMap[category];
    } else if (beautyCategories.includes(category)) {
      targetRoute = beautyRoutMap[category];
    } else if (constructionCategories.includes(category)) {
      targetRoute = constructionRouteMap[category];
    } else if (jobCategories.includes(category)) {
      targetRoute = jobRouteMap[category];
    } else if (hireCategories.includes(category)) {
      targetRoute = hireRouteMap[category];
    }
     else {
      targetRoute = propertyRouteMap[category] || `/more-property-post?carAdId=${actualCarAdId}`;
    }

    toast.info(`Complete your ${adType} ad details`);
    router.push(targetRoute);
  } catch (error) {
    console.error("Error preparing edit:", error);
    toast.error(error.response?.data?.message || "Failed to load ad for editing");
  }
};


const handleEditCarAd = async (carAdId, category) => {
   try {
   localStorage.removeItem('editingCarAdId');
   localStorage.removeItem('editingMode');

    localStorage.setItem('returnToBusinessId', selectedBusiness);
   
    router.push(`/create-add?edit=true&carAdId=${carAdId}`);
    toast.info("Loading ad for editing...");
   } catch (error) {
     console.error("Error preparing CarAd edit:", error);
     toast.error("Failed to edit ad");
   }
};

useEffect(() => {
  const returnBusinessId = localStorage.getItem('returnToBusinessId');
  if (returnBusinessId && selectedBusiness) {
    localStorage.removeItem('returnToBusinessId');
    // Refetch to get latest data
    fetchAllAds();
  }
}, [router.asPath]);


  const handleVehicleDelete = async (adId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/delete-vehicle/${adId}`);
      setVehicleAds((prev) =>
        prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
      );
      toast.success("Vehicle ad deleted successfully.");
    } catch (vehicleError) {
      console.warn("Vehicle ad delete failed, trying car ad...");
      try {
        await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setVehicleAds((prev) =>
          prev.filter(({ vehicleAd, carAd }) => (vehicleAd?._id || carAd?._id) !== adId)
        );
        toast.success("Car ad deleted successfully.");
      } catch (carError) {
        console.error("Delete error:", carError.message);
        toast.error("Failed to delete ad.");
      }
    }
  };

  const handlePropertyDelete = async (adId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmed) return;

    try {
      await api.delete(`/property/delete-property/${adId}`);
      setPropertyAds((prev) =>
        prev.filter(({ propertyAd, carAd }) => (propertyAd?._id || carAd?._id) !== adId)
      );
      toast.success("Property ad deleted successfully.");
    } catch (propertyError) {
      console.warn("Property ad delete failed, trying car ad...");
      try {
        await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setPropertyAds((prev) =>
          prev.filter(({ propertyAd, carAd }) => (propertyAd?._id || carAd?._id) !== adId)
        );
        toast.success("Car ad deleted successfully.");
      } catch (carError) {
        console.error("Delete error:", carError.message);
        toast.error("Failed to delete ad.");
      }
    }
  };

  const handlePetDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this Ad?");
     if (!confirmed) return;

     try {
     await api.delete(`/pets/delete-pet/${adId}`);
     setPetAds((prev) => 
       prev.filter(({ petAd, carAd }) => (petAd?._id || carAd?._id || carAd?._id) !== adId)
     );
     toast.success("Pet ad deleted successfully");
     } catch (petError) {
       console.warn("Pet ad delete failed, trying car ad...");
       try {
         await api.delete(`/carAdd/delete-car-ad/${adId}`);
         setPetAds((prev) => 
          prev.filter(({ petAd, carAd }) => (petAd?._id || carAd?._id) !== adId)
        );
        toast.success("Car ad deleted successfully");
       } catch (carError) {
        console.error("Delete Error:", carError.message);
        toast.error("Failed to delete ad.");
       }
     }
  };


  const handleAgricultureDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/agriculture/delete-agriculture/${adId}`);
      setAgricultureAds((prev) => 
        prev.filter(({ agricultureAd, carAd }) => (agricultureAd?._id || carAd?._id) !== adId)
      );
      toast.success("Agriculture ad deleted successfully.");
     } catch (agricultureError) {
       console.warn("Agriculture ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
       setAgricultureAds((prev) => 
          prev.filter(({ agricultureAd, carAd }) => (agricultureAd?._id || carAd?._id) !== adId)
       );
       toast.success("Agriculture Image Ad deleter successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


   const handleKidDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/kids/delete-kid/${adId}`);
      setKidAds((prev) => 
        prev.filter(({ kidAd, carAd }) => (kidAd?._id || carAd?._id) !== adId)
      );
      toast.success("Kid ad deleted successfully.");
     } catch (kidError) {
       console.warn("Kid ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
       setKidAds((prev) => 
          prev.filter(({ kidAd, carAd }) => (kidAd?._id || carAd?._id) !== adId)
       );
       toast.success("Kid Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };

    const handleServiceDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/services/delete-services/${adId}`);
      setServiceAds((prev) => 
        prev.filter(({ serviceAd, carAd }) => (serviceAd?._id || carAd?._id) !== adId)
      );
      toast.success("Service ad deleted successfully.");
     } catch (serviceError) {
       console.warn("Service ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
       setServiceAds((prev) => 
          prev.filter(({ serviceAd, carAd }) => (serviceAd?._id || carAd?._id) !== adId)
       );
       toast.success("Service Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };

 const handleEquipmentDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/equipments/delete-equipment/${adId}`);
      setEquipmentAds((prev) => 
        prev.filter(({ equipmentAd, carAd }) => (equipmentAd?._id || carAd?._id) !== adId)
      );
      toast.success("Equipment ad deleted successfully.");
     } catch (equipmentError) {
       console.warn("Equipment ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
       setEquipmentAds((prev) => 
          prev.filter(({ equipmentAd, carAd }) => (equipmentAd?._id || carAd?._id) !== adId)
       );
       toast.success("Equipment Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


   const handleGadgetDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/gadget/delete-gadget/${adId}`);
      setGadgetAds((prev) => 
        prev.filter(({ gadgetAd, carAd }) => (gadgetAd?._id || carAd?._id) !== adId)
      );
      toast.success("Gadget ad deleted successfully.");
     } catch (gadgetError) {
       console.warn("Gadget ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setGadgetAds((prev) => 
          prev.filter(({ gadgetAd, carAd }) => (gadgetAd?._id || carAd?._id) !== adId)
       );
       toast.success("Gadget Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


   const handleLaptopDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/laptops/delete-laptop/${adId}`);
      setLaptopAds((prev) => 
        prev.filter(({ laptopAd, carAd }) => (laptopAd?._id || carAd?._id) !== adId)
      );
      toast.success("Laptop ad deleted successfully.");
     } catch (laptopError) {
       console.warn("Laptop ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setLaptopAds((prev) => 
          prev.filter(({ laptopAd, carAd }) => (laptopAd?._id || carAd?._id) !== adId)
       );
       toast.success("Laptop Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


    const handleFashionDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/fashion/delete-fashion/${adId}`);
      setFashionAds((prev) => 
        prev.filter(({ fashionAd, carAd }) => (fashionAd?._id || carAd?._id) !== adId)
      );
      toast.success("Fashion ad deleted successfully.");
     } catch (fashionError) {
       console.warn("Fashion ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setFashionAds((prev) => 
          prev.filter(({ fashionAd, carAd }) => (fashionAd?._id || carAd?._id) !== adId)
       );
       toast.success("Fashion Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


    const handleHouseholdDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/household/delete-household/${adId}`);
      setHouseholdAds((prev) => 
        prev.filter(({ householdAd, carAd }) => (householdAd?._id || carAd?._id) !== adId)
      );
      toast.success("Household ad deleted successfully.");
     } catch (householdError) {
       console.warn("Household ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setHouseholdAds((prev) => 
          prev.filter(({ householdAd, carAd }) => (householdAd?._id || carAd?._id) !== adId)
       );
       toast.success("Household Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };

     const handleBeautyDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/beauty/delete-beauty/${adId}`);
      setBeautyAds((prev) => 
        prev.filter(({ beautyAd, carAd }) => (beautyAd?._id || carAd?._id) !== adId)
      );
      toast.success("Beauty & Health ad deleted successfully.");
     } catch (beautyError) {
       console.warn("Beauty ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setBeautyAds((prev) => 
          prev.filter(({ beautyAd, carAd }) => (beautyAd?._id || carAd?._id) !== adId)
       );
       toast.success(" Beauty Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };
  
  const handleConstructionDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/construction/delete-construction/${adId}`);
      setConstructionAds((prev) => 
        prev.filter(({ constructionAd, carAd }) => (constructionAd?._id || carAd?._id) !== adId)
      );
      toast.success("Building & Construction ad deleted successfully.");
     } catch (constructionError) {
       console.warn("Construction ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setConstructionAds((prev) => 
          prev.filter(({ constructionAd, carAd }) => (constructionAd?._id || carAd?._id) !== adId)
       );
       toast.success("Construction Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


  const handleJobDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/jobs/delete-job/${adId}`);
      setJobAds((prev) => 
        prev.filter(({ jobAd, carAd }) => (jobAd?._id || carAd?._id) !== adId)
      );
      toast.success("Job ad deleted successfully.");
     } catch (jobError) {
       console.warn("Job ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setJobAds((prev) => 
          prev.filter(({ jobAd, carAd }) => (jobAd?._id || carAd?._id) !== adId)
       );
       toast.success("Job Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };

     const handleHireDelete = async (adId) => {
     const confirmed = window.confirm("Are you sure you want to delete this ad?");
     if (!confirmed) return;

     try {
      await api.delete(`/hire/delete-hire/${adId}`);
      setHireAds((prev) => 
        prev.filter(({ hireAd, carAd }) => (hireAd?._id || carAd?._id) !== adId)
      );
      toast.success("Hire ad deleted successfully.");
     } catch (hireError) {
       console.warn("Hire ad delete failed, trying car ad...");
       try {
       await api.delete(`/carAdd/delete-car-ad/${adId}`);
        setHireAds((prev) => 
          prev.filter(({ hireAd, carAd }) => (hireAd?._id || carAd?._id) !== adId)
       );
       toast.success("Hire Ad Image Ad deleted successfully.");
       } catch (carError) {
         console.error("Delete error:", carError.message);
         toast.error("Failed to delete ad.");
       }
     }
  };


  const handleMarkVehicleAsSold = async (vehicleId, carAdId) => {
    const confirmed = window.confirm("Are you sure you want to mark this vehicle as sold?");
    if (!confirmed) return;

    try {
      setMarkingSold(vehicleId);
      setShowMenu(null);

      await api.patch(`/vehicles/mark-vehicle-as-sold/${vehicleId}`);

      setVehicleAds((prev) =>
        prev.map(({ adId, carAd, vehicleAd }) =>
          vehicleAd?._id === vehicleId
            ? { adId, carAd, vehicleAd: { ...vehicleAd, status: "sold" } }
            : { adId, carAd, vehicleAd }
        )
      );

      toast.success("Vehicle marked as sold.");
    } catch (error) {
      console.error("Error marking vehicle as sold:", error);
      const message =
        error?.response?.data?.message || error?.message || "Failed to mark vehicle as sold.";
      toast.error(message);
    } finally {
      setMarkingSold(null);
    }
  };

  const handleMarkPropertyAsSold = async (propertyId, carAdId) => {
    const confirmed = window.confirm("Are you sure you want to mark this property as sold?");
    if (!confirmed) return;

    setMarkingSold(propertyId);
    setShowMenu(null);

    try {
      await api.patch(`/property/mark-property-as-sold/${propertyId}`);

      setPropertyAds((prev) =>
        prev.map(({ adId, carAd, propertyAd }) =>
          propertyAd?._id === propertyId
            ? { adId, carAd, propertyAd: { ...propertyAd, status: "sold" } }
            : { adId, carAd, propertyAd }
        )
      );

      toast.success("Property marked as sold.");
    } catch (error) {
      console.error("Error marking property as sold:", error);
      const message =
        error?.response?.data?.message || error?.message || "Failed to mark property as sold.";
      toast.error(message);
    } finally {
      setMarkingSold(null);
    }
  };


  const handleMarkPetAsSold = async (petId, carAdId) => {
    const confirmed = window.confirm("Are you sure you want to mark this pet as sold?");
    if (!confirmed) return;

    try {
     setMarkingSold(petId);
     setShowMenu(null);

     await api.patch(`/pets/mark-pet-as-sold/${petId}`);

     setPetAds((prev) => 
       prev.map(({ adId, carAd, petAd }) => 
        petAd?._id === petId  
         ? { adId, carAd, petAd: { ...petAd, status: "sold" } }
         : { adId, carAd, petAd }
      )
    );
    toast.success("Pet marked as sold");
    } catch (error) {
      console.error("Error marking pet as sold:", error);
      const message = 
         error?.response?.data?.message || error?.message || "Failed to mark pet as sold.";
      toast.error(message);
    } finally {
      setMarkingSold(null);
    }
  }

  const handleMarkAgricultureAsSold = async (agricultureId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this agriculture ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(agricultureId);
       setShowMenu(null);

       await api.patch(`/agriculture/mark-agriculture-as-sold/${agricultureId}`);

       setAgricultureAds((prev) => 
        prev.map(({ adId, carAd, agricultureAd }) => 
           agricultureAd?._id === agricultureId 
             ? { adId, carAd, agricultureAd: { ...agricultureAd, status: "sold" } }
             : {adId, carAd, agricultureAd }
         )
      );
      toast.success("Agriculture marked as sold.");
     } catch (error) {
       console.error("Error marking agriculture as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark agriculture as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };

   const handleMarkKidAsSold = async (kidId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this kid ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(kidId);
       setShowMenu(null);

       await api.patch(`/kids/mark-kid-ad-as-sold/${kidId}`);

       setKidAds((prev) => 
        prev.map(({ adId, carAd, kidAd }) => 
           kidAd?._id === kidId 
             ? { adId, carAd, kidAd: { ...kidAd, status: "sold" } }
             : {adId, carAd, kidAd }
         )
      );
      toast.success("Kid Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Kid Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark kd as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };

  const handleMarkServiceAsSold = async (serviceId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this kid ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(serviceId);
       setShowMenu(null);

       await api.patch(`/services/mark-services-ad-as-sold/${serviceId}`);

       setServiceAds((prev) => 
        prev.map(({ adId, carAd, serviceAd }) => 
           serviceAd?._id === serviceId 
             ? { adId, carAd, serviceAd: { ...serviceAd, status: "sold" } }
             : {adId, carAd, serviceAd }
         )
      );
      toast.success("Service Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Service Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Service  as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };

 const handleMarkEquipmentAsSold = async (equipmentId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this equipment ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(equipmentId);
       setShowMenu(null);

       await api.patch(`/equipments/mark-equipment-ad-as-sold/${equipmentId}`);

       setEquipmentAds((prev) => 
        prev.map(({ adId, carAd, equipmentAd }) => 
           equipmentAd?._id === equipmentId 
             ? { adId, carAd, equipmentAd: { ...equipmentAd, status: "sold" } }
             : {adId, carAd, equipmentAd }
         )
      );
      toast.success("Equipment Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Equipment Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Equipment as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


   const handleMarkGadgetAsSold = async (gadgetId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this gadget ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(gadgetId);
       setShowMenu(null);

       await api.patch(`/gadget/mark-gadget-ad-as-sold/${gadgetId}`);

       setEquipmentAds((prev) => 
        prev.map(({ adId, carAd, gadgetAd }) => 
           gadgetAd?._id === gadgetId
             ? { adId, carAd, gadgetAd: { ...gadgetAd, status: "sold" } }
             : {adId, carAd, gadgetAd }
         )
      );
      toast.success("Gadget Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Gadget Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Gadget as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


   const handleMarkLaptopAsSold = async (laptopId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Laptop ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(laptopId);
       setShowMenu(null);

       await api.patch(`/laptops/mark-laptop-ad-as-sold/${laptopId}`);

       setLaptopAds((prev) => 
        prev.map(({ adId, carAd, laptopAd }) => 
          laptopAd?._id === laptopId
             ? { adId, carAd, laptopAd: { ...laptopAd, status: "sold" } }
             : {adId, carAd, laptopAd }
         )
      );
      toast.success("Laptop Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Laptop  Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Laptop as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


   const handleMarkFashionAsSold = async (fashionId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Fashion ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(fashionId);
       setShowMenu(null);

       await api.patch(`/fashion/mark-fashion-ad-as-sold/${fashionId}`);

       setFashionAds((prev) => 
        prev.map(({ adId, carAd, fashionAd }) => 
          fashionAd?._id === fashionId
             ? { adId, carAd, fashionAd: { ...fashionAd, status: "sold" } }
             : {adId, carAd, fashionAd }
         )
      );
      toast.success("Fashion Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Fashion  Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Fashion as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


    const handleMarkHouseholdAsSold = async (householdId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Household ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(householdId);
       setShowMenu(null);

       await api.patch(`/fashion/mark-household-ad-as-sold/${householdId}`);

       setHouseholdAds((prev) => 
        prev.map(({ adId, carAd, householdAd }) => 
          householdAd?._id === householdId
             ? { adId, carAd, householdAd: { ...householdAd, status: "sold" } }
             : {adId, carAd, householdAd }
         )
      );
      toast.success("Household Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Household Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Household as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };

 const handleMarkBeautyAsSold = async (beautyId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Beauty ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(beautyId);
       setShowMenu(null);

       await api.patch(`/beauty/mark-beauty-ad-as-sold/${beautyId}`);

       setHouseholdAds((prev) => 
        prev.map(({ adId, carAd, beautyAd }) => 
          beautyAd?._id === beautyId
             ? { adId, carAd, beautyAd: { ...beautyAd, status: "sold" } }
             : {adId, carAd, beautyAd }
         )
      );
      toast.success("Beauty Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Beauty Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Beauty as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


 const handleMarkConstructionAsSold = async (constructionId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Construction ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(constructionId);
       setShowMenu(null);

       await api.patch(`/construction/mark-construction-ad-as-sold/${constructionId}`);

       setHouseholdAds((prev) => 
        prev.map(({ adId, carAd, constructionAd }) => 
         constructionAd?._id === constructionId
             ? { adId, carAd, constructionAd: { ...constructionAd, status: "sold" } }
             : {adId, carAd, constructionAd }
         )
      );
      toast.success("Construction Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Construction Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Construction as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };
  
 const handleMarkJobAsSold = async (jobId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Job ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(jobId);
       setShowMenu(null);

       await api.patch(`/jobs/mark-job-ad-as-sold/${jobId}`);

       setHouseholdAds((prev) => 
        prev.map(({ adId, carAd, jobAd }) => 
         jobAd?._id === jobId
             ? { adId, carAd, jobAd: { ...jobAd, status: "sold" } }
             : {adId, carAd, jobAd }
         )
      );
      toast.success("Job Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Job Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Job as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };


   const handleMarkHireAsSold = async (hireId, carAdId) => {
     const confirmed = window.confirm("Are you sure you want to mark this Hire ad as sold?");
     if (!confirmed) return;

     try {
       setMarkingSold(hireId);
       setShowMenu(null);

       await api.patch(`/hire/mark-hire-ad-as-sold/${hireId}`);

       setHireAds((prev) => 
        prev.map(({ adId, carAd, hireAd }) => 
         hireAd?._id === hireId
             ? { adId, carAd, hireAd: { ...hireAd, status: "sold" } }
             : {adId, carAd, hireAd }
         )
      );
      toast.success("Hire Ad marked as sold.");
     } catch (error) {
       console.error("Error marking Hire Ad as sold:", error);
       const message = 
          error?.response?.data?.message || error?.message || "Failed to mark Hire Ad  as sold.";
      toast.error(message);
     } finally {
      setMarkingSold(null);
     }
  };



  const handleResubmitAd = async (carAdId, adType) => {
    try {
      // Store the carAdId for editing 
      localStorage.setItem('editingCarAdId', carAdId);
      localStorage.setItem('resubmitting', 'true');
      localStorage.setItem('returnToBusinessId', selectedBusiness);

      setShowMenu(null);

      // Redirect to carAd image page for resubmission 
      router.push(`/create-add?edit=true&carAdId=${carAdId}&resubmit=true`);
      toast.info("Resubmitting ad - update as needed");
    } catch (error) {
      console.error("Error preparing resubmitting:", error);
      toast.error("Failed to load ad for resubmitting");
    }
  }

  const totalAds = vehicleAds.length + propertyAds.length + petAds.length + agricultureAds.length + kidAds.length + serviceAds.length + equipmentAds.length + gadgetAds.length + fashionAds.length + householdAds.length + beautyAds.length + constructionAds.length + jobAds.length + hireAds.length;

  const getAvailableTabs = () => {
    const tabs = [];
    if (vehicleAds.length > 0) tabs.push({ id: 'vehicles', label: 'Vehicle', count: vehicleAds.length });
    if (propertyAds.length > 0) tabs.push({ id: 'properties', label: 'Property', count: propertyAds.length });
    if (petAds.length > 0) tabs.push({ id: 'pets', label: 'Pet', count: petAds.length });
    if (agricultureAds.length > 0) tabs.push({ id: 'agriculture', label: 'Agriculture', count: agricultureAds.length });
    if (kidAds.length > 0) tabs.push({ id: 'kid', label: 'Kid', count: kidAds.length });
    if (serviceAds.length > 0) tabs.push({ id: 'service', label: 'Service', count: serviceAds.length });
    if (equipmentAds.length > 0) tabs.push({ id: 'equipment', label: 'Equipment', count: equipmentAds.length });
    if (gadgetAds.length > 0) tabs.push({ id: 'gadget', label: 'Gadget', count: gadgetAds.length  });
    if (laptopAds.length > 0) tabs.push({ id: 'laptop', label: 'Laptop', count: laptopAds.length });
    if (fashionAds.length > 0) tabs.push({ id: 'fashion', label: 'Fashion', count: fashionAds.length });
    if (householdAds.length > 0) tabs.push({ id: 'household', label: 'Household', count: householdAds.length });
    if (beautyAds.length > 0) tabs.push({ id: 'beauty', label: 'Beauty & Health', count: beautyAds.length });
    if (constructionAds.length > 0) tabs.push({ id: 'construction', label: 'Construction & Building', count: constructionAds.length});
    if (jobAds.length > 0) tabs.push({ id: 'job', label: 'Jobs', count: jobAds.length });
    if (hireAds.length > 0) tabs.push({ id: 'hire', label: 'Hire', count: hireAds.length });
    return tabs;
  }

  const availableTabs = getAvailableTabs();

  const StatusBadge = ({ status, isDraft,  rejectionReason }) => {
    const statusConfig = {
      draft: {
       icon: <Edit size={14}  />,
       text: "Draft",
       bgColor: "bg-gray-50",
       textColor: "text-gray-600",
       borderColor: "border-gray-300"
      },
      pending: {
      icon: <AlertCircle size={14} />,
      text: "Awaiting Approval",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200"
    },
    approved: {
      icon: <Check size={14} />,
      text: "Approved",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200"
    },
     rejected: {
      icon: <AlertCircle size={14} />,
      text: "Rejected",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200"
    },
    sold: {
      icon: <Check size={14} />,
      text: "SOLD",
      bgColor: "bg-[#F8EFEF]",
      textColor: "text-red-700",
      borderColor: "border-gray-200"
    }
    };

    const displayStatus = isDraft ? 'draft' : status;
    const config = statusConfig[displayStatus] || statusConfig.pending;

    return (
      <div className="space-y-2">
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1.5 mt-2 rounded-md border 
          ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
          {config.icon}
          <span className="text-sm font-medium">{config.text}</span>
        </div>
        {/* ✅ CRITICAL: Show rejection reason */}
        {status === 'rejected' && !isDraft &&  rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
          <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
          <p className="text-sm text-red-600">{rejectionReason}</p>
        </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 rounded-[12px] bg-white shadow-phenom">
      {loading && !adsLoaded && (
        <section className="px-4 md:px-10 mt-10 flex flex-col items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-inter">Loading Ads..</p>
          </div>
        </section>
      )}

      {error && !loading && (
        <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
          <p className="text-red-500 text-sm md:text-base mb-4">{error}</p>
          <div className="mt-4">
            <Link href="/create-add" passHref>
              <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px]">
                <Plus size={20} /> Post an Ad
              </Button>
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && businessesLoaded && businesses.length === 0 && (
         <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
    <Img
      src="/postAds.svg"
      width={158}
      height={158}
      className="mx-auto mb-4"
      alt="No Posts"
    />
    <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
      You don't have a business to post an Ad, create a business
    </p>
    <div className="flex justify-center">
      {/* Assuming /create-business is your business creation route */}
      <Link href="/create-business" passHref> 
        <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
          <Plus size={20} /> Create a Business
        </Button>
      </Link>
    </div>
  </div>
      )}

      {!loading && !error && adsLoaded && businesses.length > 0 && 
        <div>
          <div className="flex flex-row justify-between items-center mb-4">
            <h3 className="text-[#525252] font-[500] font-inter text-[16px] md:text-[24px]">
              My Ads
            </h3>
            <Button
              onClick={handlePostAdClick}
              className="w-[115px] md:w-[197px] flex items-center justify-center whitespace-nowrap h-[44px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] rounded-[8px] text-white"
            >
              Post an Ad
            </Button>
          </div>

          <div className="bg-[#FAFAFA] w-full h-auto md:h-[44px] mt-4 flex gap-4 items-center px-4 overflow-x-auto rounded scrollbar-hide pb-1">
            {businesses.map((b) => (
              <div
                key={b._id}
                className={`cursor-pointer px-4 py-2 whitespace-nowrap rounded-md text-[14px] font-inter font-[500] ${
                  selectedBusiness === b._id
                    ? "bg-[#CDCDD7] text-[#525252] border border-[#EDEDED]"
                    : "bg-transparent text-[#525252]"
                }`}
                onClick={() => setSelectedBusiness(b._id)}
              >
                {b.businessName}
              </div>
            ))}
          </div>

          <div className="relative mt-4 w-full overflow-x-hidden">
  {/* Left gradient overlay for scroll fade */}
  {availableTabs.length > 4 && (
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden" />
  )}

  {/* ✅ Tabs container - isolated horizontal scroll */}
  <div
    className="
      flex gap-2 md:gap-4 border-b border-[#EDEDED]
      overflow-x-auto overflow-y-hidden pb-2
      snap-x snap-mandatory scrollbar-hide
      w-full box-border
    "
    style={{
      WebkitOverflowScrolling: "touch",
      overscrollBehaviorX: "contain",
      paddingInline: "0.5rem", // keeps buttons inside width
    }}
  >
    {availableTabs.map((tab) => (
      <button
        key={tab.id}
        className={`px-4 py-2.5 font-inter font-[500] text-[13px] md:text-[14px]
          border-b-2 transition-all flex-shrink-0 snap-start
          ${
            activeTab === tab.id
              ? "border-[#00A8DF] text-[#00A8DF]"
              : "border-transparent text-[#525252] hover:text-[#00A8DF] hover:border-gray-200"
          }`}
        onClick={() => setActiveTab(tab.id)}
      >
        {tab.label} Ads ({tab.count})
      </button>
    ))}
  </div>

  {/* Right gradient overlay for scroll fade */}
  {availableTabs.length > 4 && (
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />
  )}
</div>



          {/* Vehicle Ads */}
          {activeTab === 'vehicles' && (
            <div className="mt-5">
              {vehicleAds.length === 0 ? (
                <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
                  <Img 
                   src="/postAds.svg"
                   width={158}
                   height={158}
                   className="mx-auto mb-4"
                   alt="No Posts"
                  />
                  <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
                   No Vehicle Ads for this business
                  </p>
                  <div className="flex justify-center">
                    <Link href="/create-add" passHref>
                      <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
                        <Plus size={20} /> Post an Ad
                      </Button>
                    </Link>
                  </div>
                </div>
              ): (
                  <div className="flex flex-col gap-4">
                  {vehicleAds.map(({ adId, carAd, vehicleAd }) => {
                    const businessId = carAd?.businessCategory?._id || vehicleAd?.businessCategory;
                    const vehicleId = vehicleAd?._id;
                    const isIncomplete = isIncompleteAd(carAd, vehicleAd);

                    return (
                      <div
                        key={adId}
                        className="flex flex-col md:flex-row justify-between gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
                      >
                        <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                          {carAd?.vehicleImage?.length > 0 && (
                            <>
                              <Img
                                src={carAd.vehicleImage[0]}
                                alt="Ad"
                                width={340}
                                height={210}
                                className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                              />
                              
                              {/* Incomplete Badge */}
                              {isIncomplete && (
                                <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                                  Incomplete
                                </div>
                              )}

                              {/* SOLD Badge */}
                              {vehicleAd?.status === "sold" && (
                                <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] transform -rotate-45 flex items-center justify-center shadow-md z-40">
                                  <Img 
                                    src="/tick-circle.svg"
                                    alt="Tick Circle"
                                    width={16}
                                    height={16}
                                    className="mr-2"
                                  />
                                  <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                                    SOLD
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                          {vehicleAd?.plan && !isIncomplete && (
                            <div
                              className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                              style={{
                                backgroundImage: `url(${machineImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                                <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                                <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                                  {vehicleAd.plan}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col p-2">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex-1">
                              {isIncomplete ? (
                                <>
                                  <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                    {carAd?.category} - Incomplete Ad
                                  </h4>
                                  <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                                    Please complete your ad details to publish
                                  </p>
                                </>
                              ) : (
                                <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                  {vehicleAd?.vehicleType} {vehicleAd?.model} {vehicleAd?.trim}{" "}
                                  {vehicleAd?.year} {vehicleAd?.color}
                                </h4>
                              )}
                            </div>
                            {!isIncomplete && vehicleAd?.amount && (
                              <div className="flex items-start gap-4">
                                <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                                  ₦{vehicleAd.amount.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isIncomplete ? (
                            <>
                              <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                                {vehicleAd?.description || "No description provided"}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <Img src="/location.svg" alt="Location" width={10} height={13} />
                                <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                                  {carAd?.location || "Location not specified"}
                                </span>
                              </div>

                              <div className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                                <div className="flex flex-wrap gap-3 mt-2">
                                  {vehicleAd?.carType && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/car.svg" width={24} height={24} />
                                      <span className="text-[#868686] text-[12px] font-inter">
                                        {vehicleAd.carType}
                                      </span>
                                    </div>
                                  )}
                                  {vehicleAd?.transmission && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/automatic.svg" width={24} height={24} />
                                      <span className="text-[#868686] text-[12px] font-inter">
                                        {vehicleAd.transmission}
                                      </span>
                                    </div>
                                  )}
                                  {vehicleAd?.horsePower && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/meter.svg" width={24} height={24} />
                                      <span className="text-[#868686] text-[12px] font-inter">
                                        {vehicleAd.horsePower}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="relative">
                                  <button
                                    className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                                    onClick={() =>
                                      setShowMenu((prev) => (prev === adId ? null : adId))
                                    }
                                  >
                                    <FiMoreHorizontal size={20} color="#767676" />
                                  </button>

                                  {showMenu === adId && (
                                    <div className="absolute right-0 top-full mt-2 w-40 z-50 bg-white border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                                      <button
                                        className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                        onClick={() => {
                                          setShowMenu(null);
                                          if (businessId && adId && vehicleId) {
                                            router.push(`/ads/Vehicles/${businessId}/${adId}/${vehicleId}`);
                                          }
                                        }}
                                      >
                                        <FiEye className="mr-2" size={16} /> 
                                        View Details
                                      </button>

                                      {/* Resubmit - Only for rejected ads */}
                                      {vehicleAd?.isDraft ? (
                                       <button
                                        className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}>
                                         <Edit className="mr-2 flex-shrink-0" size={16} />
                                         <span className="whitespace-nowrap">Complete Draft</span>
                                     </button>
                                   ) : (
                                   <>
                                   {/* Resubmit - Only for rejected ads */}
                                   {vehicleAd?.status === 'rejected' && (
                                   <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                     onClick={() => handleResubmitAd(carAd._id, 'vehicle')}>
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                              {/* Mark as sold - Only for approved (not sold/rejected/pending/draft) */}
                              {vehicleAd?.status === 'approved' && (
                               <button
                                className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap 
                                font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                onClick={() => handleMarkVehicleAsSold(vehicleAd?._id, carAd?._id)}>
                                  <FiCheck className="mr-3" size={16} />
                                 Mark As Sold
                               </button>
                               )}
                               </>
                               )}


                                      {/* Delete - Show for all except sold */ }
                                      {vehicleAd?.status !== 'sold' && (
                                        <button
                                        className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                        onClick={() => {
                                          setShowMenu(null);
                                          handleVehicleDelete(vehicleAd?._id || carAd?._id);
                                        }}
                                      >
                                        <FiTrash2 className="mr-2" /> Delete
                                      </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <StatusBadge
                                status={vehicleAd?.status}
                                isDraft={vehicleAd?.isDraft}
                                rejectionReason={vehicleAd?.rejectionReason}
                              />
                            </>
                          ) : (
                            /* Show Edit button and images preview for incomplete ads */
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-3">
                                <Img src="/location.svg" alt="Location" width={10} height={13} />
                                <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                                  {carAd?.location || "Location not specified"}
                                </span>
                              </div>
                              
                              <div className="flex gap-2 mb-3 overflow-x-auto">
                                {carAd?.vehicleImage?.slice(0, 4).map((img, idx) => (
                                  <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Preview ${idx + 1}`} 
                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                  />
                                ))}
                                {carAd?.vehicleImage?.length > 4 && (
                                  <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                    +{carAd.vehicleImage.length - 4}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                                >
                                  <Edit size={16} /> Complete Ad
                                </Button>

                                 <button 
                                 className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                                 onClick={() => {
                                   setShowMenu(null);
                                   handleEditCarAd(carAd._id, carAd.category);
                                 }}>
                                  Edit
                                </button>
                            
                                <button
                                  onClick={() => handleVehicleDelete(carAd._id)}
                                  className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Property Ads */}
          {activeTab === 'properties' && (
            <div className="mt-5">
             {propertyAds.length === 0 ? (
               <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
                 <Img
                   src="/postAds.svg"
                   width={158}
                   height={158}
                   className="mx-auto mb-4"
                   alt="No Posts"
                 />
                 <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
                   No property ads for this business 
                 </p>
                 <div className="flex justify-center">
                  <Link href="/create-add" passHref>
                    <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
                      <Plus /> Post an Ad
                    </Button>
                  </Link>
                </div>
               </div>
             ):(
               <div className="flex flex-col gap-4">
                  {propertyAds.map(({ adId, carAd, propertyAd }) => {
                    const businessId = carAd?.businessCategory?._id || propertyAd?.businessCategory;
                    const propertyId = propertyAd?._id;
                    const isIncomplete = isIncompleteAd(carAd, propertyAd);

                    return (
                      <div
                        key={adId}
                        className="flex flex-col md:flex-row justify-between gap-2 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
                      >
                        <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                          {carAd?.propertyImage?.length > 0 && (
                            <>
                              <Img
                                src={carAd.propertyImage[0]}
                                alt="Ad"
                                width={340}
                                height={210}
                                className="w-full h-[160px] md:h-[210px] object-cover rounded-[8px]"
                              />

                              {/* Incomplete Badge */}
                              {isIncomplete && (
                                <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                                  Incomplete
                                </div>
                              )}

                              {/* SOLD Badge */}
                              {propertyAd?.status === "sold" && (
                                <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] transform -rotate-45 flex items-center justify-center shadow-md z-40">
                                  <Img 
                                    src="/tick-circle.svg"
                                    alt="Tick Circle"
                                    width={16}
                                    height={16}
                                    className="mr-2"
                                  />
                                  <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                                    SOLD
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                          {propertyAd?.plan && !isIncomplete && (
                            <div
                              className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                              style={{
                                backgroundImage: `url(${machineImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                                <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                                <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                                  {propertyAd.plan}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col p-2">
                          <div className="flex justify-between items-start w-full">
                            <div className="flex-1">
                              {isIncomplete ? (
                                <>
                                  <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                    {carAd?.category} - Incomplete Ad
                                  </h4>
                                  <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                                    Please complete your ad details to publish
                                  </p>
                                </>
                              ) : (
                                <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                                  {propertyAd?.propertyName || "N/A"} - {propertyAd?.propertyType || "N/A"}
                                </h4>
                              )}
                            </div>
                            {!isIncomplete && propertyAd?.amount && (
                              <div className="flex items-start gap-4">
                                <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                                  ₦{propertyAd.amount.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>

                          {!isIncomplete ? (
                            <>
                              <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words line-clamp-2">
                                {propertyAd?.description || "No description provided"}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <Img src="/location.svg" alt="Location" width={10} height={13} />
                                <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                                  {carAd?.location || "Location not specified"}
                                </span>
                              </div>

                              <div className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                                <div className="flex flex-wrap gap-3 mt-2">
                                  {propertyAd?.furnishing && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                      <span className="text-[#868686] text-[12px] font-inter">
                                        {propertyAd?.furnishing}
                                      </span>
                                    </div>
                                  )}
                                  {propertyAd?.squareMeter && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                      <span className="whitespace-nowrap text-[#868686] text-[12px] font-inter">
                                        {propertyAd?.squareMeter}(sqm)
                                      </span>
                                    </div>
                                  )}
                                  {propertyAd?.propertyType && (
                                    <div className="flex items-center gap-2">
                                      <Img src="/cross-props.svg" width={10.67} height={7.33} />
                                      <span className="text-[#868686] text-[12px] font-inter whitespace-nowrap">
                                        {propertyAd?.propertyType}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="relative">
                                  <button
                                    className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                                    onClick={() =>
                                      setShowMenu((prev) => (prev === adId ? null : adId))
                                    }
                                  >
                                    <FiMoreHorizontal size={20} color="#767676" />
                                  </button>

                                  {showMenu === adId && (
                                    <div className="absolute right-0 top-full mt-2 w-40 z-50 bg-white border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                        onClick={() => {
                                          setShowMenu(null);
                                          if (businessId && adId && propertyId) {
                                            router.push(`/ads/Property/${businessId}/${adId}/${propertyId}`);
                                          }
                                        }}
                                      >
                                        <FiEye className="mr-2" /> View Details
                                      </button>

                                      {propertyAd?.isDraft ? (
                                        <button
                                          className="flex items-center w-full px-4 py-3 text-[16px]  font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                         onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}>
                                           <Edit className="mr-2 flex-shrink-0" size={16} />
                                           <span className="whitespace-nowrap">Complete Draft</span>
                                        </button>
                                      ): (
                                     <>
                                      {/* Resubmit - Only for rejected ads */ }
                                       {propertyAd?.status === 'rejected' && (
                                        <button
                                          className="flex items-center w-full px-4 py-2 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                          onClick={() => handleResubmitAd(carAd._id, 'property')}
                                        >
                                          <Edit className="mr-3" size={16} />
                                          Resubmit
                                        </button>
                                      )} 

                                    {/* Mark As Sold - Only for approved */ }
                                      {propertyAd?.status === 'approved' && (
                                        <button 
                                         className="flex items-center w-full px-4 py-2 text-[16px] font-inter whitespace-nowrap font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                         onClick={() => handleMarkPropertyAsSold(propertyAd._id, carAd._id)}
                                         disabled={markingSold === adId}
                                         >
                                         <FiCheck className="mr-3" size={16} />
                                         {markingSold === adId ? "Loading..." : "Mark As Sold"}
                                        </button>
                                      )} 
                                     </>
                                      )}
                                       
                                      {propertyAd?.status !== 'sold' && (
                                        <button
                                        className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                        onClick={() => {
                                          setShowMenu(null);
                                          handlePropertyDelete(propertyAd?._id || carAd?._id);
                                        }}
                                      >
                                        <FiTrash2 className="mr-2" /> Delete
                                      </button>
                                      )}

                                    </div>
                                  )}
                                </div>
                              </div>

                              <StatusBadge 
                                status={propertyAd?.status}
                                isDraft={propertyAd?.isDraft}
                                rejectionReason={propertyAd?.rejectionReason}
                              />
                            </>
                          ) : (
                            /* Show Edit button and images preview for incomplete ads */
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-3">
                                <Img src="/location.svg" alt="Location" width={10} height={13} />
                                <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                                  {carAd?.location || "Location not specified"}
                                </span>
                              </div>
                              
                              <div className="flex gap-2 mb-3 overflow-x-auto">
                                {carAd?.propertyImage?.slice(0, 4).map((img, idx) => (
                                  <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Preview ${idx + 1}`} 
                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                  />
                                ))}
                                {carAd?.propertyImage?.length > 4 && (
                                  <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                    +{carAd.propertyImage.length - 4}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                                >
                                  <Edit size={16} /> Complete Ad
                                </Button>

                                <button 
                                 className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                                 onClick={() => {
                                   setShowMenu(null);
                                   handleEditCarAd(carAd._id, carAd.category);
                                 }}>
                                  Edit
                                </button>
                                
                                <button
                                  onClick={() => handlePropertyDelete(carAd._id)}
                                  className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
             )}
            </div>
          )}
        </div>
      }

      {activeTab === 'pets' && (
  <div className="mt-5">
    {petAds.length === 0 ? (
      <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Pet Ads for this business
        </p>
        <div className="flex justify-center">
          <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {petAds.map(({ adId, carAd, petAd }) => {
          const businessId = carAd?.businessCategory?._id || petAd?.businessCategory;
          const petId = petAd?._id;
          const isIncomplete = isIncompleteAd(carAd, petAd);

          return (
            <div
              key={adId}
              className="flex flex-col md:flex-row justify-between gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
              <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
                {carAd?.petsImage?.length > 0 && (
                  <>
                    <Img
                      src={carAd.petsImage[0]}
                      alt="Pet Ad"
                      width={340}
                      height={210}
                      className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                    />
                    
                    {isIncomplete && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                        Incomplete
                      </div>
                    )}

                    {petAd?.status === "sold" && (
                      <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] transform -rotate-45 flex items-center justify-center shadow-md z-40">
                        <Img 
                          src="/tick-circle.svg"
                          alt="Tick Circle"
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                          SOLD
                        </span>
                      </div>
                    )}
                  </>
                )}

                {petAd?.plan && !isIncomplete && (
                  <div
                    className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                    style={{
                      backgroundImage: `url(${machineImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                      <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                      <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {petAd.plan}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col p-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    {isIncomplete ? (
                      <>
                        <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                          {carAd?.category} - Incomplete Ad
                        </h4>
                        <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                          Please complete your ad details to publish
                        </p>
                      </>
                    ) : (
                      <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {petAd?.petType} - {petAd?.breed}
                      </h4>
                    )}
                  </div>
                  {!isIncomplete && petAd?.amount && (
                    <div className="flex items-start gap-4">
                      <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{petAd.amount.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {!isIncomplete ? (
                  <>
                    <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                      {petAd?.description || "No description provided"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                      <div className="flex flex-wrap gap-3 mt-2">
                        {petAd?.age && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Age: {petAd.age}
                            </span>
                          </div>
                        )}
                        {petAd?.gender && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {petAd.gender}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                          onClick={() =>
                            setShowMenu((prev) => (prev === adId ? null : adId))
                          }
                        >
                          <FiMoreHorizontal size={20} color="#767676" />
                        </button>

                        {showMenu === adId && (
                          <div className="absolute right-0 top-full mt-2 w-40 z-50 bg-white border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                              className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                              onClick={() => {
                                setShowMenu(null);
                                if (businessId && adId && petId) {
                                  router.push(`/ads/Pets/${businessId}/${adId}/${petId}`);
                                }
                              }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details
                            </button>

                            {petAd?.isDraft ? (
                              <button
                                className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                              >
                                <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ) : (
                              <>
                                {petAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'pet')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                {petAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkPetAsSold(petAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                              </>
                            )}

                            {petAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                  handlePetDelete(petAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <StatusBadge
                      status={petAd?.status}
                      isDraft={petAd?.isDraft}
                      rejectionReason={petAd?.rejectionReason}
                    />
                  </>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mb-3 overflow-x-auto">
                      {carAd?.petsImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                      {carAd?.petsImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.petsImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>
                  
                      <button
                        onClick={() => handlePetDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

 {activeTab === 'agriculture' && (
   <div className="mt-5">
    {agricultureAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Agriculture & Food Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {agricultureAds.map(({adId, carAd, agricultureAd}) => {
          const businessId = carAd?.businessCategory?._id || agricultureAd?.businessCategory;
          const agricultureId = agricultureAd?._id;
          const isIncomplete = isIncompleteAd(carAd, agricultureAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.agricultureImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.agricultureImage[0]}
                   alt="Agriculture Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {agricultureAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {agricultureAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {agricultureAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {agricultureAd?.title} - {agricultureAd?.agricultureType}
                      </h4>
                  )}
                </div>
                {!isIncomplete && agricultureAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{agricultureAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {agricultureAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {agricultureAd?.unit && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Unit: {agricultureAd.unit}
                            </span>
                          </div>
                        )}
                         {agricultureAd?.bulkPrice?.[0] && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Bulk:  {agricultureAd.bulkPrice[0].quantity} {agricultureAd.bulkPrice[0].unit} @ ₦{agricultureAd.bulkPrice[0].amountPerUnit.toLocaleString()}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && agricultureId) {
                                  router.push(`/ads/Agriculture/${businessId}/${adId}/${agricultureId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {agricultureAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {agricultureAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'agriculture')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {agricultureAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkAgricultureAsSold(agricultureAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {agricultureAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                  handleAgricultureDelete(agricultureAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={agricultureAd?.status}
                    isDraft={agricultureAd?.isDraft}
                    rejectionReason={agricultureAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.agricultureImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.agricultureImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.agricultureImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleAgricultureDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

     {activeTab === 'kid' && (
   <div className="mt-5">
    {kidAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Baby & Kids Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {kidAds.map(({adId, carAd, kidAd}) => {
          const businessId = carAd?.businessCategory?._id || kidAd?.businessCategory;
          const kidId = kidAd?._id;
          const isIncomplete = isIncompleteAd(carAd, kidAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.kidsImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.kidsImage[0]}
                   alt="Kids Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {kidAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {kidAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {kidAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {kidAd?.title} - {kidAd?.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && kidAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{kidAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {kidAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {kidAd?.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Color: {kidAd.color}
                            </span>
                          </div>
                        )}
                         {kidAd?.gender  && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {kidAd.gender}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && kidId) {
                                  router.push(`/ads/Kid/${businessId}/${adId}/${kidId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {kidAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {kidAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'kid')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {kidAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkKidAsSold(kidAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {kidAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                  handleKidDelete(kidAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={kidAd?.status}
                    isDraft={kidAd?.isDraft}
                    rejectionReason={kidAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.kidsImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.kidsImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.kidsImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleAgricultureDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}
   {activeTab === 'service' && (
   <div className="mt-5">
    {serviceAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Service Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {serviceAds.map(({adId, carAd, serviceAd}) => {
          const businessId = carAd?.businessCategory?._id || serviceAd?.businessCategory;
          const serviceId = serviceAd?._id;
          const isIncomplete = isIncompleteAd(carAd, serviceAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.serviceImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.serviceImage[0]}
                   alt="Service Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {serviceAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {serviceAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {serviceAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {serviceAd?.serviceTitle} - {serviceAd?.serviceDuration}
                      </h4>
                  )}
                </div>
                {!isIncomplete && serviceAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{serviceAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {serviceAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {serviceAd?.serviceAvailability && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Availability: {serviceAd.serviceAvailability}
                            </span>
                          </div>
                        )}
                         {serviceAd?.serviceExperience  && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {serviceAd.serviceExperience}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && serviceId) {
                                  router.push(`/ads/Service/${businessId}/${adId}/${serviceId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {serviceAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {serviceAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'service')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {serviceAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkServiceAsSold(serviceAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {serviceAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                  handleServiceDelete(serviceAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={serviceAd?.status}
                    isDraft={serviceAd?.isDraft}
                    rejectionReason={serviceAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.serviceImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.serviceImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.serviceImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleAgricultureDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
    )}


  {activeTab === 'equipment' && (
   <div className="mt-5">
    {equipmentAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Equipment Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {equipmentAds.map(({adId, carAd, equipmentAd}) => {
          const businessId = carAd?.businessCategory?._id || equipmentAd?.businessCategory;
          const equipmentId = equipmentAd?._id;
          const isIncomplete = isIncompleteAd(carAd, equipmentAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.equipmentImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.equipmentImage[0]}
                   alt="Equipment Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {equipmentAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {equipmentAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {equipmentAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {equipmentAd?.equipmentTitle} - {equipmentAd?.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && equipmentAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{equipmentAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {equipmentAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {equipmentAd?.powerSource && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Power Sourcce: {equipmentAd.powerSource}
                            </span>
                          </div>
                        )}
                         {equipmentAd?.usageType  && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {equipmentAd.usageType}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && equipmentId) {
                                  router.push(`/ads/Equipment/${businessId}/${adId}/${equipmentId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {equipmentAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {equipmentAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'equipment')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {equipmentAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] whitespace-nowrap font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkEquipmentAsSold(equipmentAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {equipmentAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleEquipmentDelete(equipmentAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={equipmentAd?.status}
                    isDraft={equipmentAd?.isDraft}
                    rejectionReason={equipmentAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.equipmentImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.equipmentImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.equipmentImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleEquipmentDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

   
     {activeTab === 'gadget' && (
   <div className="mt-5">
    {gadgetAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Gadget Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {gadgetAds.map(({adId, carAd, gadgetAd}) => {
          const businessId = carAd?.businessCategory?._id || gadgetAd?.businessCategory;
          const gadgetId = gadgetAd?._id;
          const isIncomplete = isIncompleteAd(carAd, gadgetAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.gadgetImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.gadgetImage[0]}
                   alt="Gadget Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {gadgetAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {gadgetAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {gadgetAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {gadgetAd.gadgetTitle} - {gadgetAd.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && gadgetAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{gadgetAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {gadgetAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {gadgetAd?.gadgetBrand && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Gadget Brand: {gadgetAd.gadgetBrand}
                            </span>
                          </div>
                        )}
                         {gadgetAd?.storageCapacity && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {gadgetAd.storageCapacity}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && gadgetId) {
                                  router.push(`/ads/Gadget/${businessId}/${adId}/${gadgetId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {gadgetAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {gadgetAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'gadget')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {gadgetAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkGadgetAsSold(gadgetAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {gadgetAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleGadgetDelete(gadgetAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={gadgetAd?.status}
                    isDraft={gadgetAd?.isDraft}
                    rejectionReason={gadgetAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.gadgetImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.gadgetImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.gadgetImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleGadgetDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}


 {activeTab === 'laptop' && (
   <div className="mt-5">
    {laptopAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Laptop Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {laptopAds.map(({adId, carAd, laptopAd}) => {
          const businessId = carAd?.businessCategory?._id || laptopAd?.businessCategory;
          const laptopId = laptopAd?._id;
          const isIncomplete = isIncompleteAd(carAd, laptopAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.laptopImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.laptopImage[0]}
                   alt="Gadget Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {laptopAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {laptopAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {laptopAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {laptopAd.laptopTitle} - {laptopAd.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && laptopAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{laptopAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {laptopAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {laptopAd?.laptopBrand && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Laptop & Computer: {laptopAd.laptopBrand}
                            </span>
                          </div>
                        )}
                         {laptopAd?.laptopStorage && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {laptopAd.laptopStorage}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && laptopId) {
                                  router.push(`/ads/Laptop/${businessId}/${adId}/${laptopId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {laptopAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {laptopAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'laptop')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {laptopAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkLaptopAsSold(laptopAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {laptopAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleLaptopDelete(laptopAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={laptopAd?.status}
                    isDraft={laptopAd?.isDraft}
                    rejectionReason={laptopAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.laptopImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.laptopImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.laptopImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleLaptopDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

   {activeTab === 'fashion' && (
   <div className="mt-5">
    {fashionAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Fashion Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {fashionAds.map(({adId, carAd, fashionAd}) => {
          const businessId = carAd?.businessCategory?._id || fashionAd?.businessCategory;
          const fashionId = fashionAd?._id;
          const isIncomplete = isIncompleteAd(carAd, fashionAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.fashionImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.fashionImage[0]}
                   alt="Fashion Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {fashionAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {fashionAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div className="bg-[#DFDFF9] w-[100px] h-[24px] rounded-[4px] border flex justify-center items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                        {fashionAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {fashionAd.fashionTitle} - {fashionAd.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && fashionAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{fashionAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {fashionAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {fashionAd?.fashionBrand && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Fashion Brand: {fashionAd.fashionBrand}
                            </span>
                          </div>
                        )}
                         {fashionAd?.fashionMaterial && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {fashionAd.fashionMaterial}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && fashionId) {
                                  router.push(`/ads/Fashion/${businessId}/${adId}/${fashionId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {fashionAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {fashionAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'fashion')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {fashionAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkFashionAsSold(fashionAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {fashionAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleFashionDelete(fashionAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={fashionAd?.status}
                    isDraft={fashionAd?.isDraft}
                    rejectionReason={fashionAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.fashionImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.fashionImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.fashionImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleFashionDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

   {activeTab === 'household' && (
   <div className="mt-5">
    {householdAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Household Item Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {householdAds.map(({adId, carAd, householdAd}) => {
          const businessId = carAd?.businessCategory?._id || householdAd?.businessCategory;
          const householdId = householdAd?._id;
          const isIncomplete = isIncompleteAd(carAd, householdAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.householdImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.householdImage[0]}
                   alt="Household Image Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {householdAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {householdAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div 
                  className="bg-[#DFDFF9] w-[100px] h-[24px] 
                  rounded-[4px] border flex justify-center 
                  items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {householdAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {householdAd.householdTitle} - {householdAd.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && householdAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{householdAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {householdAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {householdAd?.householdMaterial && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              Brand: {householdAd.householdMaterial}
                            </span>
                          </div>
                        )}
                         {householdAd?.householdBrand && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {householdAd.householdBrand}
                            </span>
                          </div>
                        )}

                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && householdId) {
                                  router.push(`/ads/Household/${businessId}/${adId}/${householdId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {householdAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {householdAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'household')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {householdAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkHouseholdAsSold(householdAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {householdAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleHouseholdDelete(householdAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={householdAd?.status}
                    isDraft={householdAd?.isDraft}
                    rejectionReason={householdAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.householdImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.householdImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.householdImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleHouseholdDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

   {activeTab === 'beauty' && (
   <div className="mt-5">
    {beautyAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Beauty & Health Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {beautyAds.map(({adId, carAd, beautyAd}) => {
          const businessId = carAd?.businessCategory?._id || beautyAd?.businessCategory;
          const beautyId = beautyAd?._id;
          const isIncomplete = isIncompleteAd(carAd, beautyAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.beautyImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.beautyImage[0]}
                   alt="Beauty Images Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {beautyAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {beautyAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div 
                  className="bg-[#DFDFF9] w-[100px] h-[24px] 
                  rounded-[4px] border flex justify-center 
                  items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {beautyAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {beautyAd.beautyTitle} - { beautyAd.condition}
                      </h4>
                  )}
                </div>
                {!isIncomplete && beautyAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{beautyAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {beautyAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {beautyAd?.beautyType && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                            {beautyAd.beautyType}
                            </span>
                          </div>
                        )}
                         {beautyAd?.beautyBrand && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {beautyAd.beautyBrand}
                            </span>
                          </div>
                        )}

                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] 
                               hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && beautyId) {
                                  router.push(`/ads/Beauty/${businessId}/${adId}/${beautyId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {beautyAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {beautyAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'beauty')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {beautyAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkBeautyAsSold(beautyAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {beautyAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleBeautyDelete(beautyAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={beautyAd?.status}
                    isDraft={beautyAd?.isDraft}
                    rejectionReason={beautyAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.beautyImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.beautyImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.beautyImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleBeautyDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}


   {activeTab === 'construction' && (
   <div className="mt-5">
    {constructionAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Building & Construction Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {constructionAds.map(({adId, carAd, constructionAd}) => {
          const businessId = carAd?.businessCategory?._id || constructionAd?.businessCategory;
          const constructionId = constructionAd?._id;
          const isIncomplete = isIncompleteAd(carAd, constructionAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.constructionImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.constructionImage[0]}
                   alt="Beauty Images Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {constructionAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {constructionAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div 
                  className="bg-[#DFDFF9] w-[100px] h-[24px] 
                  rounded-[4px] border flex justify-center 
                  items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {constructionAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {constructionAd.constructionTitle} - {constructionAd.constructionType}
                      </h4>
                  )}
                </div>
                {!isIncomplete && constructionAd?.amount && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{constructionAd.amount.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {constructionAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {constructionAd?.constructionMaterial && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                            {constructionAd.constructionMaterial}
                            </span>
                          </div>
                        )}
                         {constructionAd?.constructionUnit && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {constructionAd.constructionUnit}
                            </span>
                          </div>
                        )}

                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] 
                               hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && constructionId) {
                                  router.push(`/ads/Construction/${businessId}/${adId}/${constructionId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {constructionAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {constructionAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'construction')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {constructionAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkConstructionAsSold(constructionAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {constructionAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleConstructionDelete(constructionAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={constructionAd?.status}
                    isDraft={constructionAd?.isDraft}
                    rejectionReason={constructionAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.constructionImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.constructionImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.constructionImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleConstructionDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}



    {activeTab === 'job' && (
   <div className="mt-5">
    {jobAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Job Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {jobAds.map(({adId, carAd, jobAd}) => {
          const businessId = carAd?.businessCategory?._id || jobAd?.businessCategory;
          const jobId = jobAd?._id;
          const isIncomplete = isIncompleteAd(carAd, jobAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.jobImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.jobImage[0]}
                   alt="Beauty Images Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {jobAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {jobAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div 
                  className="bg-[#DFDFF9] w-[100px] h-[24px] 
                  rounded-[4px] border flex justify-center 
                  items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {jobAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {jobAd.jobTitle} - {jobAd.companyEmployerName}
                      </h4>
                  )}
                </div>
                {!isIncomplete && jobAd?.salaryRange && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{jobAd.salaryRange.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {jobAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {jobAd?.jobLocationType && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                            {jobAd.jobLocationType}
                            </span>
                          </div>
                        )}
                         {jobAd?.yearOfExperience && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {jobAd.yearOfExperience}
                            </span>
                          </div>
                        )}

                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] 
                               hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && jobId) {
                                  router.push(`/ads/Job/${businessId}/${adId}/${jobId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {jobAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {jobAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'job')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {jobAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkJobAsSold(jobAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {jobAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleJobDelete(jobAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={jobAd?.status}
                    isDraft={jobAd?.isDraft}
                    rejectionReason={jobAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.jobImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.jobImage?.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.jobImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleJobDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}


       {activeTab === 'hire' && (
   <div className="mt-5">
    {hireAds.length === 0 ? (
       <div className="w-full h-[490px] p-6 md:p-10 text-center flex flex-col justify-center items-center">
        <Img 
          src="/postAds.svg"
          width={158}
          height={158}
          className="mx-auto mb-4"
          alt="No Posts"
        />
        <p className="font-[500] text-[#868686] text-sm md:text-[14px] font-inter mb-4">
          No Hire Ads for this business
        </p>
        <div className="flex justify-center">
           <Link href="/create-add" passHref>
            <Button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] transition-all hover:scale-105">
              <Plus size={20} /> Post an Ad
            </Button>
          </Link>
        </div>
       </div>  
     ): (
      <div className="flex flex-col gap-4">
        {hireAds.map(({adId, carAd, hireAd}) => {
          const businessId = carAd?.businessCategory?._id || hireAd?.businessCategory;
          const hireId = hireAd?._id;
          const isIncomplete = isIncompleteAd(carAd, hireAd);

          return (
            <div
             key={adId}
             className="flex flex-col md:flex-row justify-between 
             gap-4 w-full border border-[#EDEDED] rounded-[12px] overflow-visible relative"
            >
            <div className="relative w-full md:w-[300px] shrink-0 overflow-hidden">
              {carAd?.hireImage?.length > 0 && (
                <>
                 <Img 
                   src={carAd.hireImage[0]}
                   alt="Beauty Images Ad"
                   width={340}
                   height={210}
                   className="w-full h-[160px] md:h-full object-cover rounded-[8px]"
                 />

                 {isIncomplete && (
                  <div className="absolute top-2 right-2 bg-orange-500 
                  text-white px-3 py-1 rounded-md text-xs font-semibold z-30 shadow-md">
                    Incomplete
                  </div>
                 )}

                 {hireAd?.status === "sold" && (
                  <div className="absolute top-5 left-[-10px] bg-[#F8EFEF] w-[100px] 
                  md:w-[120px] h-[40px] md:rounded-[8px] rounded-[4px] 
                  transform -rotate-45 flex items-center justify-center shadow-md z-40">
                    <Img 
                      src="/tick-circle.svg"
                      alt="Tick Circle"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="text-[#CB0D0D] text-[12px] md:text-[14px] font-[500] font-inter">
                     SOLD
                    </span>
                  </div>
                 )}
                </>
              )}

              {hireAd?.plan && !isIncomplete && (
                <div
                  className="absolute bottom-0 left-0 z-30 w-[139px] h-[35px] flex items-center px-4"
                  style={{
                     backgroundImage: `url(${machineImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                 }}
                >
                 <div 
                  className="bg-[#DFDFF9] w-[100px] h-[24px] 
                  rounded-[4px] border flex justify-center 
                  items-center gap-2 border-[#2C2CCD]">
                   <Img src="/medal-star1.svg" alt="Plan" width={24} height={24} />
                   <span className="text-[#000087] text-[12px] font-[400] font-inter uppercase">
                      {hireAd.plan}
                   </span>
                  </div>
                </div>
              )}
              </div>

              <div className="flex-1 flex flex-col p-2">
               <div className="flex justify-between items-start w-full">
                <div className='flex-1'>
                  {isIncomplete ? (
                    <>
                     <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                      {carAd?.category} - Incomplete Ad
                    </h4>
                     <p className="text-orange-600 text-[14px] font-[400] font-inter mt-1">
                      Please complete your ad details to publish
                    </p>
                    </>
                  ): (
                    <h4 className="text-[#525252] text-[18px] font-[500] font-inter line-clamp-1">
                        {hireAd.hireTitle} - {hireAd.workMode}
                      </h4>
                  )}
                </div>
                {!isIncomplete && hireAd?.salaryRange && (
                  <div className="flex items-start gap-4">
                   <div className="text-[#000087] text-[16px] font-[600] font-inter whitespace-nowrap">
                        ₦{hireAd.salaryRange.toLocaleString()}
                      </div>
                  </div>
                )}
              </div>

              {!isIncomplete ? (
              <>
                <p className="text-[#8C8C8C] text-[14px] font-[400] font-inter break-words">
                {hireAd?.description || "No description provided"}
                </p>
                 <div className="flex items-center gap-2 mt-2">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                  </div>

                  <div  className="flex flex-col md:flex-row gap-x-3 items-center justify-between">
                     <div className='flex flex-wrap gap-3 mt-2'>
                       {hireAd?.jobType && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                            {hireAd.jobType}
                            </span>
                          </div>
                        )}
                         {hireAd?.experienceLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#868686] text-[12px] font-inter">
                              {hireAd.experienceLevel}
                            </span>
                          </div>
                        )}

                     </div>
                     <div className="relative">
                      <button 
                        className="p-2 rounded-full hover:bg-[#F7F7FF] transition"
                         onClick={() => 
                          setShowMenu((prev) => (prev === adId ? null : adId))
                         }
                        >
                        <FiMoreHorizontal size={20} color="#767676" />
                      </button>

                      {showMenu === adId && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-40 z-50 bg-white 
                          border border-[#EDEDED] rounded-lg shadow-lg overflow-hidden">
                            <button
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] 
                               hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => {
                                 setShowMenu(null);
                                 if (businessId && adId && hireId) {
                                  router.push(`/ads/Hire/${businessId}/${adId}/${hireId}`);
                                 }
                               }}
                            >
                              <FiEye className="mr-2" size={16} /> 
                              View Details 
                            </button>

                            {hireAd.isDraft ? (
                              <button  
                               className="flex items-center w-full px-4 py-3 text-[16px] 
                               font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                               onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                               >
                                 <Edit className="mr-2 flex-shrink-0" size={16} />
                                <span className="whitespace-nowrap">Complete Draft</span>
                              </button>
                            ): (
                             <>
                              {hireAd?.status === 'rejected' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] font-inter font-[400] text-[#525252] hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleResubmitAd(carAd._id, 'hire')}
                                  >
                                    <Edit className="mr-3" size={16} />
                                    Resubmit 
                                  </button>
                                )}
                                  {hireAd?.status === 'approved' && (
                                  <button
                                    className="flex items-center w-full px-4 py-3 text-[16px] 
                                    whitespace-nowrap font-inter font-[400] text-[#525252]
                                     hover:bg-[#F7F7FF] transition-colors"
                                    onClick={() => handleMarkHireAsSold(hireAd?._id, carAd?._id)}
                                  >
                                    <FiCheck className="mr-3" size={16} />
                                    Mark As Sold
                                  </button>
                                )}
                             </>
                            )}

                               {hireAd?.status !== 'sold' && (
                              <button
                                className="flex items-center w-full px-4 py-2 text-[#CB0D0D] text-[16px] font-[400] 
                                font-inter hover:bg-[#F7F7FF] border-t border-[#EDEDED]"
                                onClick={() => {
                                  setShowMenu(null);
                                 handleHireDelete(hireAd?._id || carAd?._id);
                                }}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </button>
                            )}
                        </div>
                      )}
                     </div>
                  </div>
                  <StatusBadge
                    status={hireAd?.status}
                    isDraft={hireAd?.isDraft}
                    rejectionReason={hireAd?.rejectionReason}
                  />
              </>
              ): (
                <div className="mt-3">
                   <div className="flex items-center gap-2 mb-3">
                      <Img src="/location.svg" alt="Location" width={10} height={13} />
                      <span className="text-[#8C8C8C] text-[14px] font-[400] font-inter">
                        {carAd?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flexgap-2 mb-3 overflow-x-auto">
                        {carAd?.hireImage?.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                       {carAd?.hireImage.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-600 text-xs">
                          +{carAd.hireImage.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                       <Button
                        onClick={() => handleEditIncompleteAd(carAd._id, carAd.category)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] transition-all text-[14px]"
                      >
                        <Edit size={16} /> Complete Ad
                      </Button>

                      <button 
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                        onClick={() => {
                          setShowMenu(null);
                          handleEditCarAd(carAd._id, carAd.category);
                        }}
                      >
                        Edit
                      </button>

                       <button
                        onClick={() => handleJobDelete(carAd._id)}
                        className="text-[#CB0D0D] text-[14px] font-[400] font-inter hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>
     )}
   </div>
 )}

  {/* Verification Modal */}
  {showVerificationModal && 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] p-6 max-w-md mx-4">
        <h3 className="text-[#525252] font-[600] font-inter text-[18px] mb-3">
          Complete your verification
        </h3>
        <p className="text-[#868686] font-[400] font-inter text-[14px] mb-6">
           You need to complete your seller verification before you can post listings on Tenaly. This helps build trust with buyers and increases your chances of making successful sales.
        </p>
        <div className='flex gap-3 justify-end'>
          <Button
           onClick={() => setShowVerificationModal(false)}
           className="px-6 py-2 bg-gray-200 text-[#525252] rounded-[8px] font-inter font-[500]"
          >
             Cancel
          </Button>
          <Button
          onClick={() => router.push("/Settings?tab=tier-verification")} // Navigate to tier tab
          className="px-6 py-2 bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white rounded-[8px] font-inter font-[500]"
        >
          Proceed to Verification
        </Button>
        </div>
      </div>
    </div>
  }
  </div>
  );
}