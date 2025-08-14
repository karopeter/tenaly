"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Img from "../components/Image";
import MainCategoryDropdown from "../components/dropdowns/category-dropdown";
import LocationModal from "../components/UI/locationModal";
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
};

export default function CreateCarContent() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("Choose location");
  const [state, setState] = useState("");
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

  const getCategoryDetails = () => {
    if (category.includes(" - ")) {
      const [base, value] = category.split(" - ");
      return {
        baseCategory: base,
        categoryValue: value.trim(),
      };
    }
    const value = category.trim();
    return {
      baseCategory: ["car", "bus", "tricycle"].includes(value) ? "Vehicle" : "Property",
      categoryValue: value,
    };
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
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

      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Append text fields
      formData.append("category", categoryValue);
      formData.append("location", location);

      // The link field is now only appended if it has a value, making it optional.
      if (link.trim() !== "") {
        formData.append("link", link);
      }
      
      // Append images - make sure this matches your backend expectation
      uploadedImages.forEach((file, index) => {
        formData.append("images", file);
      });

      // Log for debugging (remove in production)
      console.log("Submitting form data:");
      console.log("Category:", categoryValue);
      console.log("Location:", location);
      console.log("Link:", link);
      console.log("Images count:", uploadedImages.length);
      console.log("Business ID:", businessId);

      const res = await api.post(`/carAdd/${businessId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      setMessage(`✅ ${data.message}`);
      //toast.success("Post Ad created successfully!");

      // Reset form after successful submission
      setCategory("");
      setLocation("Choose location");
      setLink("");
      setUploadedImages([]);
      setBusinessId("");

      const route = routeMap[categoryValue];
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
    setLocation(lga);
    setShowLocationModal(false);
  };

  return (
    <div>
      <div className="bg-white shadow-phenom md:rounded-[12px] p-10 text-center">
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
              <span className="text-[#525252]">{location}</span>
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
            <p className="text-[#525252] font-[500] md:text-[14px]">
              {["car", "bus", "tricycle"].includes(category.toLowerCase())
                ? "Upload Vehicle Images"
                : "Upload Property Images"}
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
            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-md overflow-hidden relative border border-[#EDEDED]"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
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
             Next
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
