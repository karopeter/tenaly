"use client";
import { useEffect, useState, useRef, act } from "react";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import { Camera, Pencil, XCircle } from "lucide-react";
import api from "@/services/api";
import InputField from "../components/input";
import { toast } from "react-toastify";
import Img from "../components/Image";
import AddBusiness from "../components/addBusiness/add.business";
import BusinessForm from "../components/BusinessForm/business-form";
import AddBusinessHours from "../components/addBusinessHours/add-busi-hours";
import BusinessHoursForm from "../components/BusinessForm/business-hours-form";
import EditBusinessForm from "../components/BusinessForm/edit-business-hour";
import EditBussinessPage from "../components/BusinessForm/editBusiness";
import AddBusinessDetails from "../components/addBusinessDetails/add-business-details";
import AddBusinessDetailsForm from "../components/BusinessForm/business-details-form";
import BusinessDeliveryForm from "../components/BusinessForm/business-delivery-form";
import EditDeliveryForm from "../components/BusinessForm/edit-delivery-form";

export default function Profile({ 
  createBusinessPage, 
  addBusiness,
   businessHours, 
   addBusinessHours, 
  editBusinessHour,
  editBusinessDetails,
  addBusinessDetails,
  addBusinessDetailsForm,
  addBussinessDelivery,
  editDeliveryForm
}) {
  const [mode, setMode] = useState("personal");
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false)
  

  const renderContent = () => {
    if (mode === "personal") return renderPersonalInfo();
    if (createBusinessPage) return <BusinessForm />;
    if (addBusiness) return <AddBusiness />;
    if (businessHours) return <AddBusinessHours />;
    if (addBusinessHours) return <BusinessHoursForm />;
    if (editBusinessHour) return <EditBusinessForm />;
    if (editBusinessDetails) return <EditBussinessPage />;
    if (addBusinessDetails) return <AddBusinessDetails />;
    if (addBusinessDetailsForm) return <AddBusinessDetailsForm />;
    if (addBussinessDelivery) return <BusinessDeliveryForm />;
    if (editDeliveryForm)  return <EditDeliveryForm />;
    return <AddBusiness />;
  };

  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  // useEffect(() => {
  //  const checkMobile = () => {
  //    const mobile = window.innerWidth < 768;
  //    setIsMobile(mobile);
  //    if (mobile) {
  //     setIsProfileVisible(true);
  //    }
  //  };
  //  checkMobile();
  //  window.addEventListener("resize", checkMobile);
  //  return () => window.removeEventListener("resize", checkMobile);
  // }, []);



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
      formData.append("email", email);
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

  const renderPersonalInfo = () => (
    <div className="mt-6">
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <InputField
          label="First Name"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!isEditable}
        />
        <InputField
          label="Last Name"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!isEditable}
        />
      </div>
  
      <div className="grid md:grid-cols-1 mt-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1">
            <InputField
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditable}
            />
          </div>
          {isEditable && (
            <Button type="button" className="text-[#232323] text-sm underline bg-transparent whitespace-nowrap">
              Change my email
            </Button>
          )}
        </div>
      </div>
  
      <div className="grid md:grid-cols-1 mt-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1">
            <InputField
              label="Phone Number"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!isEditable}
            />
          </div>
          {isEditable && (
            <Button type="button" className="text-[#232323] text-sm underline bg-transparent whitespace-nowrap">
              Change my phone number
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
      <div className="flex flex-col md:flex-row gap-10">
        {isMobile ? (
          !activeSection || activeSection === "Profile" ? (
            !activeSection ? (
              <Sidebar 
                isMobile={isMobile}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            ): (
              <main className="flex-1 mt-6">
           <form 
             onSubmit={handleSubmit}
             className="bg-white shadow-phenom md:rounded-[12px] p-8 text-center">
             <div className="flex justify-between items-start mb-6">
               <div className="flex-1 flex justify-center">
                 <div className="relative w-32 h-32">
                   <img
                     src={imagePreview || fetchedImage ||  "/profile-circles.svg"}
                     alt="Profile"
                     className="w-full h-full object-cover rounded-full"
                   />
                   {imagePreview && isImageFromUpload ? (
                     <button
                       type="button"
                       onClick={handleRemoveImage}
                       className="absolute top-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                     >
                       <XCircle className="w-5 h-5 text-gray-600" />
                     </button>
                   ) : (
                     <button
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                     >
                       <Camera className="w-5 h-5 text-gray-600" />
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
 
              {mode === "personal" && (
               <div className="mt-2">
                 <Button
                   type="button"
                   onClick={() => setIsEditable(!isEditable)}
                   className="flex items-center gap-1 border-[1px] border-[#EDEDED] md:h-[36px] md:rounded-[28px] text-[#232323] text-sm font-medium bg-[#F1F1F1]"
                 >
                   <Pencil className="w-4 h-4 text-[#3C3C3C]" />
                   {isEditable ? "Done" : "Edit"}
                 </Button>
               </div>
              )}
             </div>
 
             {/* SWITCH ONLY VISIBLE WHEN NOT EDITING */}
             {!isEditable && (
               <div className="bg-[#FAFAFA] md:rounded-[4px] p-2 md:w-[400px] md:h-[52px] inline-flex gap-2">
                 <div className="flex justify-center gap-4 w-full">
                   <Button
                     type="button"
                     onClick={() => setMode("personal")}
                     className={`px-6 py-1 rounded-[4px] md:w-[169px] ${mode === "personal" ? "bg-[#DFDFF9] text-[#000087]" : "bg-transparent text-[#232323]"}`}
                   >
                     Personal
                   </Button>
                   <Button
                     type="button"
                     onClick={() => setMode("business")}
                     className={`px-6 py-1 rounded-[4px] md:w-[169px] ${mode === "business" ? "bg-[#DFDFF9] text-[#000087]" : "bg-transparent text-[#232323]"}`}
                   >
                     Business
                   </Button>
                 </div>
               </div>
             )}
            <div>
             {renderContent()}
            </div>
             {isEditable && (
               <div className="mt-6 flex justify-center">
                 <Button
                   type="submit"
                   disabled={loading}
                   className="flex items-center justify-center gap-2 md:w-[262px] md:h-[44px] md:rounded-[8px] font-[500] md:text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                 >
                   {loading ? "Saving..." : (
                     <>
                       <Img src="/tick-circles.svg" alt="Save" width={24} height={24} />
                       Save Changes
                     </>
                   )}
                 </Button>
               </div>
             )}
           </form>
           </main>
            )
          ) : null
        ): (
          // Desktop Sidebar and content side by side 
          <>
            <Sidebar
               isMobile={isMobile}
               activeSection={activeSection}
               setActiveSection={setActiveSection}
            />
             <main className="flex-1 mt-6">
           <form 
             onSubmit={handleSubmit}
             className="bg-white shadow-phenom md:rounded-[12px] p-8 text-center">
             <div className="flex justify-between items-start mb-6">
               <div className="flex-1 flex justify-center">
                 <div className="relative w-32 h-32">
                   <img
                     src={imagePreview || fetchedImage ||  "/profile-circles.svg"}
                     alt="Profile"
                     className="w-full h-full object-cover rounded-full"
                   />
                   {imagePreview && isImageFromUpload ? (
                     <button
                       type="button"
                       onClick={handleRemoveImage}
                       className="absolute top-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                     >
                       <XCircle className="w-5 h-5 text-gray-600" />
                     </button>
                   ) : (
                     <button
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                     >
                       <Camera className="w-5 h-5 text-gray-600" />
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
 
              {mode === "personal" && (
               <div className="mt-2">
                 <Button
                   type="button"
                   onClick={() => setIsEditable(!isEditable)}
                   className="flex items-center gap-1 border-[1px] border-[#EDEDED] md:h-[36px] md:rounded-[28px] text-[#232323] text-sm font-medium bg-[#F1F1F1]"
                 >
                   <Pencil className="w-4 h-4 text-[#3C3C3C]" />
                   {isEditable ? "Done" : "Edit"}
                 </Button>
               </div>
              )}
             </div>
 
             {/* SWITCH ONLY VISIBLE WHEN NOT EDITING */}
             {!isEditable && (
               <div className="bg-[#FAFAFA] md:rounded-[4px] p-2 md:w-[400px] md:h-[52px] inline-flex gap-2">
                 <div className="flex justify-center gap-4 w-full">
                   <Button
                     type="button"
                     onClick={() => setMode("personal")}
                     className={`px-6 py-1 rounded-[4px] md:w-[169px] ${mode === "personal" ? "bg-[#DFDFF9] text-[#000087]" : "bg-transparent text-[#232323]"}`}
                   >
                     Personal
                   </Button>
                   <Button
                     type="button"
                     onClick={() => setMode("business")}
                     className={`px-6 py-1 rounded-[4px] md:w-[169px] ${mode === "business" ? "bg-[#DFDFF9] text-[#000087]" : "bg-transparent text-[#232323]"}`}
                   >
                     Business
                   </Button>
                 </div>
               </div>
             )}
            <div>
             {renderContent()}
            </div>
             {isEditable && (
               <div className="mt-6 flex justify-center">
                 <Button
                   type="submit"
                   disabled={loading}
                   className="flex items-center justify-center gap-2 md:w-[262px] md:h-[44px] md:rounded-[8px] font-[500] md:text-[14px] bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white"
                 >
                   {loading ? "Saving..." : (
                     <>
                       <Img src="/tick-circles.svg" alt="Save" width={24} height={24} />
                       Save Changes
                     </>
                   )}
                 </Button>
               </div>
             )}
           </form>
         </main>
          </>
        )}
        
      </div>
    </div>
  );
}

