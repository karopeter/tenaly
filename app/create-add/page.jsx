"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import MainCategoryDropdown from "../components/dropdowns/category-dropdown";
import PropertyDropdown from "../components/dropdowns/property-dropdown";
import LocationModal from "../components/UI/locationModal";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import { toast } from "react-toastify";
import api from "@/services/api";

// Optional: create a mapping for slugs/URLs
const routeMap = {
  "Commercial Property for rent": "/commercial-rent",
  "Commercial Property for sale": "/commercial-sale",
  "House and Apartment Property for rent": "/apartment-rent",
  "House and Apartment Property for sale": "/apartment-sale",
  "Lands and Plot for rent": "/land-rent",
  "Lands and Plot for sale": "/land-sale",
  "Short let Property": "/shortlet",
  "Event center and Venues": "/event-center",
};

export default function CreateCarPost() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [baseCategory, subCatgory] = category.split(" - ")
  const [location, setLocation] = useState("Choose location");
  const [state, setState] = useState("");
  const [link, setLink] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempPhone, setTempPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handlePhoneSubmit = async () => {
     try {
       const token = localStorage.getItem("token");
       if (!token) throw new Error("Not authenticated");

       const res = await api.put("/auth/update-phone", {
         headers: {
          "Content-Type": "multipart/form-data",
         }
       });

       if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Phone update failed")
       }

       const route = routeMap[subCatgory?.trim()];
       if (route) {
         router.push(route); // Specific match found
       } else if (baseCategory === "Vehicle") {
         router.push("/more-post-vehicle");
       } else if (baseCategory === "Property") {
         router.push("/more-property-post");
       } else {
         throw new Error("Unknown category selected.");
       }
   

       toast.success("Phone number updated successfully!");
       setShowPhoneModal(false);
       handleSubmit(); // retry ad submission
       router
     } catch (error) {
        toast.error("Error Upadating phone number, please check and try again.");
     }
  }


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uniqueFiles = files.filter(
      (file) => !uploadedImages.some((img) => img.name === file.name)
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

  const isFormValid =
    category !== "" &&
    location !== "Choose location" &&
    link.trim() !== "" &&
    uploadedImages.length >= 5;

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!isFormValid) {
        setError("Please complete all fields and upload at least 5 images.");
        return;
      }
    
      setLoading(true);
      setError("");
    
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        // Fetch user profile to check  phone number
        const userRes = await api.get("/profile");
        const user = userRes.data;

        if (!user.phoneNumber) {
          setShowPhoneModal(true);
          setLoading(false);
          return;
        }
    
        const baseCategory = category.split(" - ")[0];
    
        const formData = new FormData();
        formData.append("category", baseCategory); 
        formData.append("location", location);
        formData.append("link", link);
        uploadedImages.forEach((img) => formData.append("images", img));
    
        const res = await api.post("/carAdd", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        });
    
        const data = await res.data;
    
        toast.success("Post Ads created successfully!");
    
        // Store in localStorage (optional for later use)
        localStorage.setItem("baseAdInfo", JSON.stringify({
          category: baseCategory,
          location,
          link,
          images: uploadedImages.map((file) => file.name),
          adId: data?.adId || null,
        }));
    
        // ✅ Redirect based on baseCategory
        const route = routeMap[subCatgory?.trim()];
        if (route) {
          router.push(route); // Specific match found
        } else if (baseCategory === "Vehicle") {
          router.push("/more-post-vehicle");
        } else if (baseCategory === "Property") {
          router.push("/more-property-post");
        } else {
          throw new Error("Unknown category selected.");
        }
    
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || err.message || "An unexpected error occurred");
        setError(err.response?.data?.message ||err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleCategory = () => {
      if (!category) {
         toast.success("Please Select a Category");
         return;
      }
    }

    
    
  // when a state/LGA is picked in the modal, this fires:
  const handleLocationSelect = ({ state: selectedState, lga }) => {
    setState(selectedState);
    setLocation(lga);
    setShowLocationModal(false);
  };

  return (
    <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white shadow-phenom md:rounded-[12px] p-10 text-center">
            <h2 className="text-[#525252] font-[500] md:text-[16px] mb-6">
              Post your Ad
            </h2>

            <form onSubmit={handleSubmit}>
              {/* 1) Main Category */}
              <div className="mb-4 flex justify-center">
                <div className="w-full md:w-[481px]">
                  <MainCategoryDropdown
                    value={category}
                    onChange={setCategory}
                  />
                </div>
              </div>

              {/* 2) Location */}
              <div className="mb-6 flex justify-center">
                <div
                  onClick={() => setShowLocationModal(true)}
                  className="w-full md:w-[481px] h-[52px]
                             border border-[#CDCDD7] rounded-[4px]
                             flex justify-between items-center px-3 cursor-pointer"
                >
                  <span className="text-[#525252]">{location}</span>
                  <Plus className="w-5 h-5 text-[#525252]" />
                </div>
              </div>

              {/* 3) Link */}
              <div className="mb-6 flex justify-center">
                <input
                  type="url"
                  placeholder="Link (e.g. YouTube, Facebook…)"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full md:w-[481px] h-[52px]
                             border border-[#CDCDD7] rounded-[4px]
                             px-3 focus:outline-none"
                />
              </div>

              {/* 4) Photos instructions */}
              <div className="text-left md:ml-20 mb-4">
                <p className="text-[#525252] font-[500] md:text-[14px]">
                  Add photo
                </p>
                <p className="text-[#4C4C4C] md:text-[14px] font-[400]">
                  At least 5 images. First is your title image. You can drag
                  to reorder.
                </p>
                <span className="mt-2 text-[#767676] md:text-[12px] font-[400]">
                  PNG or JPEG. Min width 600px.
                </span>
              </div>

              {/* 5) Upload box + previews */}
              <div className="mt-2 md:ml-20 flex items-start gap-4">
                <div className="w-[80px] h-[80px] bg-[#E8E8FF] border border-[#EDEDED] rounded-[8px] flex items-center justify-center relative cursor-pointer">
                  <input type="file" multiple accept="image/*"
                     onChange={handleImageUpload}
                     className="absolute w-full h-full opacity-0 cursor-pointer" />
                    <Img src="/upload.svg" alt="Upload" width={24} height={24} />
                </div>
                <div className="flex flex-wrap gap-4">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="w-24 h-24 rounded-md overflow-hidden relative border border-[#EDEDED]">
                      <img src={URL.createObjectURL(img)}
                        alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                         type="button"
                         onClick={() => removeImage(i)}
                         className="absolute top-1 right-1 bg-white rounded-full p-1">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}

              {/* 6) Continue */}
              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`md:w-[262px] md:h-[44px] md:rounded-[8px]
                    md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px]
                    font-[500] md:text-[14px] ${
                      !isFormValid || loading
                        ? "bg-[#EDEDED] text-[#CDCDD7]"
                        : "bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                    }`}
                >
                  {loading ? "Posting…" : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

  {showPhoneModal && (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-center z-50">
      <div className="bg-[#FFFFFF] rounded-[24px] p-6 max-w-sm w-full">
      <h3 className="md:text-[18px] text-[#525252] font-inter font-[500] mb-4">Set Your Phone Number</h3>
       <p className="text-[#767676] md:text-[14px] font-inter font-[400]">
         Please enter your phone number so customers can
         reach you better, for faster sales
        </p>
      <input
        type="tel"
        value={tempPhone}
        onChange={(e) => setTempPhone(e.target.value)}
        className="w-full md:h-[52px] p-2 mb-4 outline-none rounded-[4px] mt-2 border border-[#CDCDD7] text-sm placeholder:text-[#CDCDD7]"
        placeholder="+234 | Enter your phone number" 
      />
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowPhoneModal(false)}
          className="px-4 py-2 md:w-[121px] md:h-[52px] rounded-[8px] border-[1px] 
          border-[#CDCDD7] text-[#525252] font-[500] text-[16px] font-inter"
        >
          Cancel
        </button>
        <button
          onClick={handlePhoneSubmit}
          className="px-4 py-2 md:w-[241px] md:h-[52px] rounded-[8px] 
          bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white font-inter font-[500] text-[16px]"
        >
          Proceed
        </button>
      </div>
    </div>
  </div>
)}


      {/* Location picker modal */}
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
