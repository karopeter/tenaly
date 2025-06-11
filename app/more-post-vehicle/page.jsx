"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../components/Button";
import Sidebar from "../components/navbar/sidebar";
import { useAuth } from "../context/AuthContext";
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
import Img from "../components/Image";
import api from "@/services/api";
import toast from "react-hot-toast";


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
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [seat, setSeat] = useState("");
  const [driveTrain, setDriveTrain] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [horsePower, setHorzePower] = useState("");
  const [amount, setAmount] = useState("");
  const [negotiation, setNegotiation] = useState("");
  const [businessOptions, setBusinessOptions] = useState([]);
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  const searchParams = useSearchParams();
   const { user } = useAuth();
   const businessId = searchParams.get("businessId"); 
  const router = useRouter();

useEffect(() => {
  const fetchBusinesses = async () => {
    try {
      const res = await api.get("/business/my-businesses");
      const options = res.data.map((b) => ({
        label: b.businessName,
        value: b._id,
      }));
      setBusinessOptions(options);
    } catch (error) {
      console.error("Failed to fetch businesses", error);
    }
  };

  if (!window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
  }

  fetchBusinesses();
}, []);

const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

   const handleGoBack = () => router.back();

  const handleMakeChange = (value) => {
    setSelectedMake(value);
    setSelectedModel(""); 
  }

  const handleModelChange = (value) => {
    setSelectedModel(value);
  }

  const planDetails = {
  basic: { name: "Basic", amount: 15000, image: "/basic.svg" },
  premium: { name: "Premium", amount: 30000, image: "/premium-plan.svg" },
  vip: { name: "VIP", amount: 45000, image: "/medal-star.svg" },
  diamond: { name: "Diamond", amount: 60000, image: "/diamonds.svg" },
  enterprise: { name: "Enterprise", amount: 100000, image: "/crown3.svg" }
};

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  }

  const BusinessPostDropdown = ({ label, value, onChange, options }) => (
  <div className="relative w-full mt-5">
    <label className="block text-left mb-1 text-[#525252] md:text-[12px] font-inter font-[500]">{label}</label>
    <select 
     className="border-[1px] border-[#CDCDD7] md:h-[52px] rounded-[4px] mb-2 focus:outline-none  px-3 py-2 text-[#525252] flex justify-between items-center bg-white"
      value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select a business</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);


  const plan = planDetails[selectedPlan];

   const handlePayment = async () => {
  try {
    const payload = {
      vehicleType: selectedMake,
      model: selectedModel,
      year: selectedYear,
      trim: selectedTrim,
      color: selectedColor,
      interiorColor: selectedInteriorColor,
      transmission,
      vinChassisNumber: vin,
      carRegistered: registerd,
      exchangePossible: exchange,
      carKeyFeatures: carFeatures,
      carType,
      carBody: vehicleBody,
      fuel,
      seat,
      driveTrain,
      numberOfCylinders: cylinders,
      engineSizes: engineSize,
      horsePower,
      amount: plan.amount, // use plan amount from selected plan
      negotiation,
      businessCategory: business,
      description,
      plan: selectedPlan
    };

    console.log(payload);

    const response = await api.post("/vehicles/post-vehicle-ad", payload);
    const result = response.data;
    console.log(result);

    if (result.data?.paymentUrl) {
        window.location.href = result.data.paymentUrl;
    } else {
      toast.error("Failed to get payment URL from server.");
    }

  } catch (error) {
    console.error("Payment init error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

 
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
                       label="Car Key Features"
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
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      min="0"
                      step="any"
                      options={setAmount}
                    />
                    <PostDropdown
                       label="Are you opened for negotiation"
                       value={negotiation}
                       onChange={setNegotiation}
                       options={negotiationOptions}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <BusinessPostDropdown
                      label="Enter business category"
                      value={business}
                      onChange={setBusiness}
                      options={businessOptions}
                    />
                  </div>

                  <div className="mt-2">
                  <label className="block text-left mb-1 text-[#525252] font-[500] font-inter">Description</label>
                  <textarea 
                    placeholder="Enter the description of the vehicle"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[120px] border border-[#CDCDD7] rounded-[4px] px-3 py-2 bg-white focus:outline-none resize-none"
                  >
                    </textarea>
                  </div>
                 
              <div className="text-center mt-4">
                <h4 className="text-[#525252] text-[16px] font-[500] font-inter mb-4">Promote your Ad</h4>
                <p className="text-[#767676] text-[12px] font-[400] font-inter mb-6">
                  You have reached your limit of free ad posting in vehicles
                </p>

                {Object.keys(planDetails).map((plan) => (
                <div
                  key={plan}
                 onClick={() => handlePlanSelect(plan)}
                className={`max-w-md mx-auto border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                selectedPlan === plan
                 ? "border-[#000087] bg-[#F7F7FF]"
                 : "border-[#EDEDED] hover:border-[#000087] hover:bg-gray-50"
               }`}>
              <label htmlFor={plan} className="flex items-center gap-3 flex-1 cursor-pointer">
                <div
                  id={plan}
                  className={`w-5 h-5 border rounded flex items-center justify-center flex-shrink-0 ${
                  selectedPlan === plan ? "border-[#000087]" : "border-[#EDEDED]"
                 }`}>
                {selectedPlan === plan && (
                  <Img
                   src="/icon-check.svg"
                   alt="Check"
                   width={4}
                   height={4}
                   className="w-4 h-4"
                 />
                )}
              </div>

            <div className="w-8 h-8 flex-shrink-0">
              <Img
                src={planDetails[plan].image}
                width={67}
                height={67}
                alt={`${plan} plan`}
                className="w-full h-full object-contain"
              />
            </div>

             <span className="text-[#525252] font-inter font-[500] text-sm truncate">
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </span>
            </label>

          <div className="text-right ml-4">
            <span className="text-[#525252] font-inter font-[500] text-sm">
              ₦{planDetails[plan].amount.toLocaleString()}
            </span>
             </div>
            </div>
            ))}
          </div>
           <div className="flex justify-center mt-5">
              <Button
                onClick={handlePayment}
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