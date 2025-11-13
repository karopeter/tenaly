"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Img from "../components/Image";
import MainCategoryDropdown from "../components/dropdowns/category-dropdown";
import LocationModal from "../components/UI/locationModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Button from "../components/Button";
import { toast } from "react-toastify";
import api from "@/services/api";

const routeMap = {
  "Commercial Property For Rent": "/commercial-rent",
  "Commercial Property For Sale": "/commercial-sale",
  "House and Apartment Property For Rent": "/apartment-rent",
  "House and Apartment Property For Sale": "/apartment-sale",
  "Land and Plot For Rent": "/land-rent",
  "Land and Plot For Sale": "/land-sale",
  "Short Let Property": "/shortlet",
  "Event Center And Venues": "/event-center",

  // Agriculture category routes 
  "Fresh Produce (fruits, vegetables, grains)": "/agriculture-produce",
  "Livestock (poultry, goats, cattle, pigs, etc.)": "/agriculture-livestock",
  "Seeds & Seedlings": "/seeds-seedlings",
  "Animal Feed": "/animal-feed",
  "Fertilizers": "/fertilizers",
  "Farm Tools & Equipment": "/farm-tool-equipment",
  "Agro Chemicals (pesticides, herbicides)": "/agro-chemical",
  "Farm Services (plowing, irrigation, consultancy)": "/farm-services",

  // Kids routes 
  "Baby Clothes": "/kids-baby-clothes",
  "Kids Clothes": "/kids-clothes",
  "Shoes": "/kids-shoes",
  "Toys & Games": "/kids-toys-games",
  "Baby Gear (strollers, car seats, carriers)": "/kids-baby-gear",
  "Feeding (bottles, high chairs, breast pumps)": "/kids-baby-feeding",
  "Furniture (cribs, cots, wardrobes)": "/kids-baby-furniture",
  "Health & Safety (monitors, baby gates)": "/kids-baby-health&safety",
  "School Supplies (bags, books, stationery)": "/kids-school-supplies",

  //Animal & pets routes 
  "Dogs": "/pets-dogs",
  "Cats": "/pets-cats",
  "Birds": "/pets-birds",
  "Fish & Aquarium": "/fish-aquarium",
  "Small Pets (rabbits, hamsters, guinea pigs)": "/pets-hamster",
  "Pet Accessories": "/pets-accessories",
  "Pet Food": "/pets-food",
  

  // Services 
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

  // Equipments 
   'Industrial Machines': '/industrial-machines',
   'Construction Equipment': '/construction-equipment',
   'Power Tools': '/power-tools',
   'Manufacturing Equipment': '/manufacturing-equipment',
   'Medical & Laboratory Equipment': '/medical-laboratory-equipment',
  'Kitchen & Restaurant Equipment': '/kitchen-resturant-equipment',
   'Printing & Packaging Machines': '/printing-packaging',
   'Agricultural Machinery':'/agricultural-machinery',
   'Cleaning & Laundry Equipment': '/cleaning-laundry-equipment',
   'Office Equipment': '/office-equipment',

   // Gadgets 
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

    // Laptops & Computers
     'Laptops': '/laptops',
    'Desktop Computers': '/desktop-computers',
    'Computer Accessories': '/desktop-accessories',
    'Monitors': '/monitors',
    'Printers & Scanners': '/printers-scanners',
    'Networking Equipment': '/networking-equipment',
    'Storage Devices': '/storage-devices',
    'Software': '/software',
    'Others': '/others',

     'Clothing': '/fashion-clothing',
     'Footwear': '/fashion-footwear',
     'Bags': '/fashion-bags',
     'Jewellery': '/fashion-jewellery',
     'Watches': '/fashion-watches',
     'Accessories': '/fashion-accesories',
     'Eyewear (Glasses & Sunglasses)': '/fashion-eyewear',
     'Wedding & Event Wear': '/fashion-wedding-eventwear',

     // Household 
     
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


  // Standalone categories 
  "Job": "/jobs",
  "Available for hire": "/available-for-hire"
};

  // Helper to reorder array 
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }


export default function CreateCarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCarAdId, setEditingCarAdId] = useState(null);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("Choose location");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [link, setLink] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempPhone, setTempPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");


  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;
    setUploadedImages((prev) => reorder(prev, result.source.index, result.destination.index));
  };

  // useEffect(() => {
  //   const isEdit = searchParams.get('edit');
  //   const carAdId = searchParams.get('carAdId');
  //   const isResubmit = searchParams.get('resubmit');

  //   if (isEdit === 'true' && carAdId) {
  //     loadCarAdForEditing(carAdId, isResubmit === 'true'); // Pass resubmit flag 
  //   }
  // }, [searchParams]);


  useEffect(() => {
     const isEdit = searchParams.get('edit');
     const carAdId = searchParams.get('carAdId');
     const isResubmit = searchParams.get('resubmit');

     if (isEdit === 'true' && carAdId) {
      loadCarAdForEditing(carAdId, isResubmit === 'true');
     } else if (!isEdit && !carAdId) {
      // user is creating a New Ad, clear any old draft data 
      localStorage.removeItem('editingCarAdId');
      localStorage.removeItem('editingCarAdData');
      localStorage.removeItem('editingAdType');

      // Alos reset the editing state 
      setIsEditing(false);
      setEditingCarAdId(null);
     }
  }, [searchParams]);


  const loadCarAdForEditing = async (carAdId, isResubmitting = false) => {
     try {
      const response = await api.get(`/carAdd/get-car-byId/${carAdId}`);
      const carAdData = response.data.ad;

      setIsEditing(true);
      setEditingCarAdId(carAdId);
      setCategory(carAdData.category);
      setLocation(carAdData.location);
      setLink(carAdData.link || "");
      
      const bizId = carAdData.business?.businessId || carAdData.businessCategory?._id || carAdData.businessCategory;
      setBusinessId(bizId);


      const imageUrls = carAdData.images || [];



       // Create proper image object  with isExisting flag
       const existingImages = imageUrls.map((url, index) => ({
         url: url,
         isExisting: true,
         name: `existing-image-${index}` // Add a name property for consistency
       }));

       setUploadedImages(existingImages);

       // Differentiating message for resubmission 
       if (isResubmitting) {
        toast.info("Resubmitting rejected ad - Make neccessary changes");
       } else {
         toast.info("Editing CarAd - Update images or Details");
       }
     } catch (error) {
       console.error("Error loading CarAd:", error);
       toast.error("Failed to load ad for editing");
     }
  };


  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get("/business/my-businesses");
        const options = res.data.map((b) => ({
          label: b.businessName,
          value: b._id,
        }));
        setBusinesses(options);
        if (options.length === 1) setBusinessId(options[0].value);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
      }
    };
    fetchBusinesses();
  }, []);

  // const getCategoryDetails = () => {
  //   if (category.includes(" - ")) {
  //     const [base, value] = category.split(" - ");
  //     return {
  //       baseCategory: base,
  //       categoryValue: value.trim(),
  //     };
  //   }
  //   const value = category.trim();
  //   return {
  //     baseCategory: ["car", "bus", "tricycle"].includes(value) ? "Vehicle" : "Property",
  //     categoryValue: value,
  //   };
  // };

  const getCategoryDetails = () => {
  if (category.includes(" - ")) {
    const [base, value] = category.split(" - ");
    return {
      baseCategory: base,
      categoryValue: value.trim(),
    };
  }
  
  const value = category.trim();
  
  // Determine base category based on type
  const vehicleCategories = ['car', 'bus', 'tricycle'];
  
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
  
  const kidsCategories = [
    'Baby Clothes', 'Kids Clothes', 'Shoes', 'Toys & Games',
    'Baby Gear (strollers, car seats, carriers)',
    'Feeding (bottles, high chairs, breast pumps)',
    'Furniture (cribs, cots, wardrobes)',
    'Health & Safety (monitors, baby gates)',
    'School Supplies (bags, books, stationery)'
  ];
  
  const petsCategories = [
    'Dogs', 'Cats', 'Birds', 'Fish & Aquarium',
    'Small Pets (rabbits, hamsters, guinea pigs)',
    'Pet Accessories', 'Pet Food'
  ];
  
  const propertyCategories = [
    'Commercial Property For Rent',
    'Commercial Property For Sale',
    'House and Apartment Property For Rent',
    'House and Apartment Property For Sale',
    'Land and Plot For Rent',
    'Land and Plot For Sale',
    'Short Let Property',
    'Event Center And Venues'
  ];

  const servicesCategories = [
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

  const equipmentsCategories = [
     'Industrial Machines',
     'Construction Equipment',
     'Power Tools',
     'Manufacturing Equipment',
     'Medical & Laboratory Equipment',
     'Kitchen & Restaurant Equipment',
     'Printing & Packaging Machines',
     'Agricultural Machinery',
     'Cleaning & Laundry Equipment',
     'Office Equipment',
  ];

  const gadgetsCategories = [
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
  ]

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
  

  
  if (vehicleCategories.includes(value)) {
    return { baseCategory: "Vehicle", categoryValue: value };
  } else if (propertyCategories.includes(value)) {
    return { baseCategory: "Property", categoryValue: value };
  } else if (agricultureCategories.includes(value)) {
    return { baseCategory: "Agriculture", categoryValue: value };
  } else if (kidsCategories.includes(value)) {
    return { baseCategory: "Kids", categoryValue: value };
  } else if (petsCategories.includes(value)) {
    return { baseCategory: "Pets", categoryValue: value };
  } else if (equipmentsCategories.includes(value))  {
    return { baseCategory: "Equipment", categoryValue: value };
  } else if (gadgetsCategories.includes(value)) {
    return { baseCategory: "Gadgets", categoryValue: value };
  } else if (fashionCategories.includes(value)) {
    return { baseCategory: "Fashion", categoryValue: value };
  } else if (laptopCategories.includes(value)) {
    return { baseCategory: "Laptops", categoryValue: value };
  } else if (householdCategories.includes(value)) {
    return { baseCategory: "Household", categoryValue: value };
  } else if (value === 'Job') {
    return { baseCategory: "Job", categoryValue: value };
  } else if (servicesCategories.includes(value)) {
      return { baseCategory: "Services", categoryValue: value };
  } else if (value === 'Available for hire') {
    return { baseCategory: "Hire", categoryValue: value };
  }
  
  return { baseCategory: "Property", categoryValue: value };
};


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const uniqueFiles = files.filter(
      (file) => !uploadedImages.some((img) => !img.isExisting && img.name === file.name)
    );


    if (uniqueFiles.length < files.length) {
      setError("Some images were already selected and skipped");
    }
    setUploadedImages((prev) => [...prev, ...uniqueFiles]);
    setError("");
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // The isFormValid check has been updated to remove the requirement for the 'link' field.
  const isFormValid =
    category !== "" &&
    location !== "Choose location" &&
    uploadedImages.length >= 5 &&
    businessId !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The form now checks for validity without requiring the link.
    if (!isFormValid) {
      setError("Please complete all required fields and upload at least 5 images.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const userRes = await api.get("/profile");
      const user = userRes.data;

      if (!user.phoneNumber) {
        setShowPhoneModal(true);
        setLoading(false);
        return;
      }

      const { baseCategory, categoryValue } = getCategoryDetails();
      const formData = new FormData();
      
      formData.append("category", categoryValue);
      formData.append("location", location);
      if (link.trim() !== "") {
        formData.append("link", link);
      }

      // uploadedImages.forEach((img) => {
      //   if (!img.isExisting) {
      //     // This is a new file upload 
      //     formData.append("images", img);
      //   }
      // });

      if (isEditing && editingCarAdId) {
        const newFiles = uploadedImages.filter(img => !img.isExisting);
        const existingUrls = uploadedImages.filter(img => img.isExisting).map(img => img.url);

        // Append new files 
        newFiles.forEach((img) => {
          formData.append("images", img);
        });

        // Send existing image URLS to keep 
        if (existingUrls.length > 0) {
          formData.append("existingImages", JSON.stringify(existingUrls));
        }
      } else {
        // For NEW AD: all images are new files 
        uploadedImages.forEach((img) => {
          formData.append("images", img);
        });
      }

      let res;
      if (isEditing && editingCarAdId) {
        // Update existing CarAd
        res = await api.put(`/carAdd/update/${editingCarAdId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        localStorage.setItem('adUpdated', 'true');
        toast.success("CarAd updated successfully");
      } else {
        // Create new CarAd 
        res = await api.post(`/carAdd/${businessId}`, formData, {
           headers: {
            "Content-Type": "multipart/form-data",
           },
        });
         console.log("Post ad created successfully");
      }

      const data = res.data;
      setMessage(`✅ ${data.message}`);

      // Reset form 
      setCategory("");
      setLocation("Choose location");
      setLink("");
      setUploadedImages([]);
      setBusinessId("");
      setIsEditing(false);
      setEditingCarAdId(null);

       // Navigate to appropriate route
    const route = routeMap[categoryValue.trim()] || routeMap[categoryValue] || "";
    if (route) {
      router.push(route);
    } else if (baseCategory === "Vehicle") {
      router.push("/more-post-vehicle");
    } else if (baseCategory === "Property") {
      router.push("/more-property-post");
    } else {
      throw new Error("Unknown category selected.");
    }
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = ({ state: selectedState, lga }) => {
    setState(selectedState);
    setLga(lga);
    setLocation(`${selectedState}, ${lga}`);
    setShowLocationModal(false);
  };

  return (
    <div className="">
      <div className="bg-white md:shadow-phenom md:rounded-[12px] p-10 text-center">
        <h2 className="text-[#525252] font-[500] md:text-[16px] mb-6">Post your Ad</h2>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="mb-4 flex justify-center">
            <div className="w-full md:w-[481px]">
              <MainCategoryDropdown value={category} onChange={setCategory} />
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 flex justify-center">
            <div
              onClick={() => setShowLocationModal(true)}
              className="w-full md:w-[481px] h-[52px] border border-[#CDCDD7] rounded-[4px] flex justify-between items-center px-3 cursor-pointer"
            >
              <span className="text-[#525252]">
                {state && lga ? `${state}, ${lga}` : "Choose location"}
              </span>
              <Plus className="w-5 h-5 text-[#525252]" />
            </div>
          </div>

          {/* Link */}
          <div className="mb-6 flex justify-center">
            <input
              type="url"
              placeholder="Link (e.g. YouTube, Facebook…) (Optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full md:w-[481px] h-[52px] border border-[#CDCDD7] rounded-[4px] px-3 focus:outline-none"
            />
          </div>

          {/* Business selection */}
          <div className="mb-4 flex justify-center">
            <div className="w-full md:w-[481px]">
              <select
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full h-[52px] border border-[#CDCDD7] rounded-[4px] px-3 focus:outline-none"
                required
              >
                <option value="">Select Business</option>
                {businesses.map((biz) => (
                  <option key={biz.value} value={biz.value}>
                    {biz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div className="text-left md:ml-20 mb-4">
            {/* <p className="text-[#525252] font-[500] md:text-[14px]">
              {["car", "bus", "tricycle"].includes(category.toLowerCase())
                ? "Upload Vehicle Images"
                : "Upload Property Images"}
            </p> */}
            <p className="text-[#525252] font-[500] md:text-[14px]">
  {category && (() => {
    const cat = category.toLowerCase();
    if (["car", "bus", "tricycle"].includes(cat)) return "Upload Vehicle Images";
    if (category.includes("Property") || category.includes("Land") || category.includes("Short Let") || category.includes("Event Center")) return "Upload Property Images";
    if (category.includes("Produce") || category.includes("Livestock") || category.includes("Farm") || category.includes("Feed") || category.includes("Fertilizers") || category.includes("Agro")) return "Upload Product Images";
    if (category.includes("Baby") || category.includes("Kids") || category.includes("Toys") || category.includes("School")) return "Upload Product Images";
    if (category.includes("Dog") || category.includes("Cat") || category.includes("Bird") || category.includes("Pet") || category.includes("Fish")) return "Upload Pet/Product Images";
    if (category === "Equipments & Machineries") return "Upload Equipment Images";
    if (category === "Gadgets") return "Upload Gadget Images";
    if (category === "Fashion") return "Upload Fashion Images";
    if (category === "Laptops & Computers") return "Upload Product Images";
    if (category === "Household Items") return "Upload Product Images";
    if (category === "Job") return "Upload Job Images";
    if (category === "Services") return "Upload Service Images";
    if (category === "Available for hire") return "Upload Images";
    return "Upload Images";
  })()}
</p>
            <p className="text-[#4C4C4C] md:text-[14px] font-[400]">
              At least 5 images. First is your title image. You can drag to reorder.
            </p>
            <span className="mt-2 text-[#767676] md:text-[12px] font-[400]">
              PNG or JPEG. Min width 600px.
            </span>
          </div>

          <div className="mt-2 md:ml-20 flex items-start gap-4">
            <div className="w-[80px] h-[80px] bg-[#E8E8FF] border border-[#EDEDED] rounded-[8px] flex items-center justify-center relative cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <Img src="/upload.svg" alt="Upload" width={24} height={24} />
            </div>
           <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div className="flex flex-wrap gap-4"
                 ref={provided.innerRef}
                 {...provided.droppableProps}
                >
                 {uploadedImages.map((img, i) => {
                   // Generate unique key 
                   const itemKey = img.isExisting
                    ? `existing-${img.url}-${i}`
                    : `${img.name}-${i}`;

                    return (
                      <Draggable
                       key={itemKey}
                       draggableId={itemKey}
                       index={i}>
                       {(dragProvided, snapshot) => (
                        <div
                        className={`w-24 h-24 rounded-md overflow-hidden relative border border-[#EDEDED] bg-white ${snapshot.isDragging ? "dragging" : ""}`}
                       ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}>
                        <img 
                          src={img.isExisting ? img.url : URL.createObjectURL(img)}
                          alt={`Preview ${i}`}
                          className="w-full h-full object-cover"
                        /> 
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1">
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                       </div>
                       )}
                      </Draggable>
                    )
                 })}
                 {provided.placeholder}
                </div>
              )}
            </Droppable>
           </DragDropContext>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-[262px] h-[44px] rounded-[8px] font-[500] ${
                !isFormValid || loading
                  ? "bg-[#EDEDED] text-[#CDCDD7]"
                  : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
              }`}
            >
             {loading ? "Processing..." : isEditing ? "Update" : "Next"}
            </Button>
          </div>
        </form>
      </div>

      {showLocationModal && (
        <LocationModal
          isOpen
          onClose={() => setShowLocationModal(false)}
          onSelectLocation={handleLocationSelect}
        />
      )}
    </div>
  );
}
