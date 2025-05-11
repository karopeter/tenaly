"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import { 
   carMakes, 
   carModels,
   carYears,
   carTrims,
   carColors,
   interiorColors,
   carTransmissions,
   registrationStatus,
   exchangeOptions,
   carKeyFeatures,
   carTypes,
   vehicleBodyTypes,
   fuelTypes,
   seatTypes,
   driveTrains,
   numCylinders,
   engineSizes,
   horsePowerOptions,
   negotiationOptions,
   businessCategories
  } from "../lib/carData";
import PostDropdown from "../components/dropdowns/car-post-dropdown";
import InputField from "../components/input";


export default function MoreAddPost() {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] =  useState("");
  const [selectedTrim, setSelectedTrim] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("");
  const [transmission, setTransmission] = useState("");
  const [vin, setVin] = useState("");
  const [registerd, setRegistered] = useState("");
  const [exchange, setExchange] = useState("");
  const [carFeatures, setCarFeatures] = useState("");
  const [carType, setCarType] = useState("");
  const [vehicleBody, setVehicleBody] = useState("");
  const [fuel, setFuel] = useState("");
  const [seat, setSeat] = useState("");
  const [driveTrain, setDriveTrain] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [horsePower, setHorzePower] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const handleGoBack  = () => router.back();

  const handleMakeChange = (value) => {
    setSelectedMake(value);
    setSelectedModel(""); // Reset model  when make changes 
  }

  const handleModelChange = (value) => {
    setSelectedModel(value);
  }
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
           <Sidebar />

           <main className="flex-1">
              <div className="bg-white shadow-phenom md:rounded-[12px] p-8 text-center">
                <div className="flex justify-start mb-6">
                <Button
                onClick={handleGoBack}
                className="flex items-center text-[#1031AA] hover:text-[#00A8DF] font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2 text-[#141B34]"  /> 
                <span className="text-[#525252] font-[500] md:text-[14px] font-inter">Go Back</span>
              </Button>
              </div>
                <h3 className="text-center text-[#525252] fonmt-[500] font-inter md:text-[16px]">Post your Ad</h3>
                <form>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                   <PostDropdown
                     label="Make"
                     value={selectedMake}
                     onChange={handleMakeChange}
                     options={carMakes}
                   />

                  <PostDropdown
                    label="Model"
                    value={selectedModel}
                    onChange={handleModelChange}
                    options={selectedMake ? carModels[selectedMake] : []}
                    disabled={!selectedMake} // Disable model dropdown if no make is selected
                   />
                   </div>
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown 
                      label="Year"
                      value={selectedYear}
                      onChange={setSelectedYear}
                      options={selectedModel ? carYears[selectedModel] : []} 
                      disabled={!selectedModel}
                     />

                     <PostDropdown 
                      label="Trim"
                      value={selectedTrim}
                      onChange={setSelectedTrim}
                      options={selectedModel ? carTrims[selectedModel] : []}
                      disabled={!selectedModel}
                     />
                   </div>
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown 
                       label="Car Color"
                       value={selectedColor}
                       onChange={setSelectedColor}
                       options={carColors}
                     />
                     <PostDropdown 
                       label="Interior Color"
                       value={selectedInteriorColor}
                       onChange={setSelectedInteriorColor}
                       options={interiorColors}
                     />
                   </div>
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown
                        label="Transmission"
                        options={carTransmissions}
                        value={transmission}
                        onChange={setTransmission}
                     />
                     <InputField 
                        label="VIN / Chassis Number"
                        placeholder="Enter"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        className="flex justify-between items-center"
                      />
                     <div>
                     </div>
                   </div>
                   <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown 
                        label="Is the car registered?"
                        options={registrationStatus}
                        value={registerd}
                         onChange={setRegistered}
                      />
                      <PostDropdown
                        label="Is exchange possible?"
                        options={exchangeOptions}
                        value={exchange}
                        onChange={setExchange}
                       />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                     <PostDropdown
                       label="Key Features"
                       options={carKeyFeatures}
                       value={carFeatures}
                       onChange={setCarFeatures}
                     />
                     <PostDropdown
                      label="Car Type"
                      options={carTypes}
                      value={carType}
                      onChange={setCarType}
                     />
                  </div>

                  { /* this cannot be editted. it fills automatically  based on the selection */ }
                  <div 
                   className="bg-[#FAFAFA] md:pt-[16px] 
                    md:pr-[12px] md:mt-5 md:pb-[16px] md:pl-[12px]
                     md:h-[276px] md:h-auto md:rounded-[8px]">
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <PostDropdown
                           label="Body"
                           value={vehicleBody}
                          onChange={setVehicleBody}
                          options={vehicleBodyTypes}
                        />
                        <PostDropdown
                          label="Fuel"
                          value={fuel}
                          onChange={setFuel}
                          options={fuelTypes}
                        /> 
                     </div>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                       <PostDropdown
                         label="Seat"
                         value={seat}
                         onChange={setSeat}
                         options={seatTypes}
                       />
                       <PostDropdown
                         label="Drive train"
                         value={driveTrain}
                         onChange={setDriveTrain}
                         options={driveTrains}
                       />
                     </div>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                      <PostDropdown
                        label="Number of cylinders"
                        value={cylinders}
                        onChange={setCylinders}
                        options={numCylinders}
                      />
                      <PostDropdown
                       label="Engine Sizes (cc)"
                       value={engineSize}
                       onChange={setEngineSize}
                       options={engineSizes}
                      />
                     </div>
                     <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                       <PostDropdown
                         label="Horse Power (hp)"
                         value={horsePower}
                         onChange={setHorzePower}
                         options={horsePowerOptions}
                       />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField
                      label="Amount"
                      placeholder="₦ Enter your amount"
                      value={amount}
                      onChange={setAmount}
                      options={(e) => setAmount(e.target.value)}
                    />
                    <PostDropdown
                       label="Are you opened for negotiation"
                       value={negotiation}
                       onChange={setNegotiation}
                       options={negotiationOptions}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <PostDropdown
                      label="Enter business category"
                      value={business}
                      onChange={setBusiness}
                      options={businessCategories}
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
                </form>
                <div className="text-center mt-5 font-[400] font-inter md:text-[12px]">
                   <p className="text-[#767676]">By clicking on Post Ad, you accept to 
                    <span className="text-[#000087]"> Terms of Use,</span>
                    confirm that you will abide by the Safety Tips, 
                    <br />
                    and declare that this posting does not include any Prohibited items.
                  </p>
                </div>  
              </div>
           </main>
        </div>
      </div>
    );
}