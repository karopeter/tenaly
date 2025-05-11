"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import PostDropdown from "../dropdowns/car-post-dropdown";
import InputField from "../input";

export default function ServiceChargeSection() {
  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceFees, setServiceFees] = useState([
    { name: "", amount: "" },
  ]);

  const handleAdd = () =>
    setServiceFees((prev) => [...prev, { name: "", amount: "" }]);

  const handleChange = (i, field, value) =>
    setServiceFees((prev) =>
      prev.map((row, idx) =>
        idx === i ? { ...row, [field]: value } : row
      )
    );

  return (
    <div className="mt-6 md:mt-2">
      {/* 1) Yes / No dropdown */}
      <div className="">
        <PostDropdown
          label="Is there a service charge?"
          value={serviceCharge}
          onChange={setServiceCharge}
          options={["Yes", "No"]}
        />
      </div>

      {/* 2) If yes, one or more name/fee rows */}
      {serviceCharge === "Yes" && (
        <div className="mt-4 space-y-4">
          {serviceFees.map((row, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-left mb-1 text-[#525252] font-[500]">
                  Service Name
                </label>
                <InputField
                  placeholder="Enter service name"
                  value={row.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-left mb-1 text-[#525252] font-[500]">
                  Service Fee
                </label>
                <InputField
                  placeholder="Enter fee amount"
                  value={row.amount}
                  onChange={(e) =>
                    handleChange(i, "amount", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {/* 3) Add another button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center text-[#000087] md:text-[14px] font-[400] font-inter"
          >
            <Plus className="w-5 h-5 mr-2 rounded-full border-[1.5px] border-[#000087] text-[#000087] p-1" />
            Add another Service fee
          </button>
        </div>
      )}
    </div>
  );
}
