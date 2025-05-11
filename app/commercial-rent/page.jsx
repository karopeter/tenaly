"use client";
import { useState } from "react";
import { ArrowLeft, Car } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/navbar/sidebar";
import Button from "../components/Button";
import { propertyTypeOptions, furnishingOptions, parkingSpaceOptions, ownershipStatusOptions, serviceChargeOptions, propertyDurationOptions, negotiationOptions, businessCategoryOptions } from "../lib/propertyData";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import ServiceChargeSection from "../components/UI/serviceCharge";
import InputField from "../components/input";


export default function MorePropertyPost() {
  const router = useRouter();
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [parking, setParking] = useState("");
  const [squareMeter, setSquareMeter] = useState("");
  const [ownershipStatus, setOwnerShipStatus] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceFees, setServiceFees] = useState([
     { name: "", amount: "" },
  ])
  const [propertyDuration, setPropertyDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    setServiceFees((prev) => [...prev, { name: "", amount: "" }]);
  };

  const handleChange = (i, field, value) => 
    setServiceFees((prev) => 
     prev.map((row, idx) => 
       idx === i ? { ...row, [field]: value} : row));

  const handleGoBack  = () => router.back();
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />

           <main className="flex-1">
              <div className="bg-white shadow-phenom md:rounded-[12px] p-10 text-center">
              <Button
                onClick={handleGoBack}
                className="flex items-center text-left text-[#1031AA] hover:text-[#00A8DF] font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-1 text-[#141B34]"  /> 
                <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
              </Button>
                <h3 
                 className="text-center text-[#525252] 
                 font-[500] font-inter md:text-[16px] mt-8 mb-4">
                    Commercial Propert for rent</h3>
              <form>
                 <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                  <InputField
                    label="Title"
                    placeholder="Enter name of the property"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                  <InputField
                   label="Address"
                   placeholder="Enter the address of the property"
                   value={propertyAddress}
                   onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                   <PostDropdown 
                     label="Property Type"
                     value={propertyType}
                     onChange={setPropertyType}
                     options={propertyTypeOptions}
                   />

                   <PostDropdown 
                     label="Furnishing"
                     value={furnishing}
                    onChange={setFurnishing}
                    options={furnishingOptions}
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                   <PostDropdown
                     label="Is there a parking space"
                     value={parking}
                     onChange={setParking}
                     options={parkingSpaceOptions}
                   />
                   <InputField 
                     label="Square Meters (sqm)"
                     placeholder="Enter"
                     value={squareMeter}
                     onChange={(e) => setSquareMeter(e.target.value)}
                   />
                </div>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                   <PostDropdown
                     label="Are you the owner or an agent of the property?"
                     value={ownershipStatus}
                     onChange={setOwnerShipStatus}
                     options={ownershipStatusOptions}
                   />
                   <div></div> {/* optional placeholder to maintain layout */}
                </div>
                  <div className="bg-[#FAFAFA] px-3 py-2 p-5 md:h-auto mt-5">
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <ServiceChargeSection />
                       <div></div> {/* optional placeholder to maintain layout */}
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown
                       label="Duration"
                       value={propertyDuration}
                       onChange={setPropertyDuration}
                       options={propertyDurationOptions}
                      />
                      <InputField 
                        label="Amount"
                        placeholder="₦ Enter your amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Are you open for negotiation?"
                      value={negotiation}
                      onChange={setNegotiation}
                      options={negotiationOptions}
                    />
                  <PostDropdown
                   label="Enter business category"
                   value={businessCategory}
                   onChange={setBusinessCategory}
                   options={businessCategoryOptions}
                  />
                  </div>
                  <div className="mt-2">
                  <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">Description</label>
                  <textarea 
                    placeholder="Enter the description of the property"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                  >
                    </textarea>
                  </div>

                  <div className="flex justify-center mt-5">
                    <Button
                       type="submit"
                       className="md:w-[262px] md:h-[44px] md:rounded-[8px] 
                       md:pt-[10px] md:pr-[16px] md:pb-[10px] md:pl-[16px] 
                       font-[500] md:text-[14px] bg-[#EDEDED] text-[#CDCDD7] 
                       bg-gradient-to-r from-[#00A8DF] to-[#1031AA] text-white">
                      Post Ad
                   </Button>
                  </div>
                  <div className="text-center mt-5 font-[400] font-inter md:text-[12px]">
                   <p className="text-[#767676]">By clicking on Post Ad, you accept to 
                    <span className="text-[#000087]"> Terms of Use,</span>
                    confirm that you will abide by the Safety Tips, 
                    <br />
                    and declare that this posting does not include any Prohibited items.
                  </p>
                </div> 
                </form>
              </div>
           </main>
        </div>
      </div>
    );
}