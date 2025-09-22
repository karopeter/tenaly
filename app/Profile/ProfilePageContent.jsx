"use client";
import { useEffect, useState, useRef } from "react";
import Button from "../components/Button";
import { Camera, Pencil, XCircle } from "lucide-react";
import api from "@/services/api";
import InputField from "../components/input";
import BusinessOnboardingModal from "../components/BusinessOnboarding/BusinessOnboardingModal";
import { toast } from "react-toastify";
import Img from "../components/Image";
import { useRouter } from "next/navigation";

export default function ProfilePageContent() {
  const [fetchedImage, setFetchedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isImageFromUpload, setIsImageFromUpload] = useState(false);
  const fileInputRef = useRef(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
     // Check localStorage or query flat if user is new seller 
     const isNewSeller = localStorage.getItem("newSeller");
     if (isNewSeller === "true") {
       setShowOnboarding(true);
       //localStorage.removeItem("newSeller");
     }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get("/profile");
        const [first, ...rest] = data.fullName.split(" ");
        setFirstName(first || "");
        setLastName(rest.join(" ") || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        if (data.image) {
          setFetchedImage(`${data.image}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
     // formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await api.put("/profile/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditable(false);
      setIsImageFromUpload(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsImageFromUpload(true);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleClose = () => {
    setShowOnboarding(false);
    localStorage.removeItem("newSeller"); 
  };

  const handleContinue = () => {
    setShowOnboarding(false);
    localStorage.removeItem("newSeller"); 
    router.push("/create-business");
  };

  return (
   <>
      <form
      onSubmit={handleSubmit}
      className="bg-white md:shadow-phenom rounded-[12px] p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto"
    >
      {/* Header with Profile Image and Edit Button */}
      <div className="flex justify-between items-start mb-6">
        {/* Profile Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
            <img
              src={imagePreview || fetchedImage || "/profile-circles1.svg"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-2 border-gray-100"
              onError={(e) => {
                e.currentTarget.src = "/profile-circles1.svg"; 
              }}
            />
            {imagePreview && isImageFromUpload ? (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        
        {/* Edit Button */}
        {!isEditable && (
  <div className="mt-2">
    <Button
      type="button"
      onClick={() => setIsEditable(true)}
      className="flex items-center gap-1 sm:gap-2 border border-[#EDEDED] px-3 sm:px-4 py-2 rounded-full text-[#232323] text-xs sm:text-sm font-medium bg-[#F1F1F1] hover:bg-[#E8E8E8] transition-colors"
    >
      <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-[#3C3C3C]" />
      <span className="hidden sm:inline">Edit</span>
    </Button>
  </div>
)}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-6">
        {/* Full Name Field */}
        <div className="space-y-4">
          <InputField
            label="Full Name"
            placeholder="Full Name"
            value={`${firstName} ${lastName}`.trim()}
            onChange={(e) => {
              const fullName = e.target.value;
              const [first, ...rest] = fullName.split(" ");
              setFirstName(first || "");
              setLastName(rest.join(" ") || "");
            }}
            disabled={!isEditable}
            className="w-full"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-4">
          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            onChange={() => {}}
            disabled={true}
            className="w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone Number Field */}
        <div className="space-y-4">
          <InputField
            label="Phone number"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!isEditable}
            className="w-full"
          />
        </div>
      </div>

      {/* Save Button - Only shown when editing */}
      {isEditable && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[200px] md:w-[262px] h-[44px] rounded-[8px] font-[500] text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              <>
                <Img src="/tick-circles.svg" alt="Save" width={20} height={20} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </form>

    {showOnboarding && (
      <BusinessOnboardingModal
        onClose={handleClose}
        onContinue={handleContinue}
      />
    )}
   </>
  );
}