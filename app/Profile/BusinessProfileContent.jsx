"use client";
import { useState } from "react";
import BusinessForm from "../components/BusinessForm/business-form";
import AddBusiness from "../components/addBusiness/add.business";
import AddBusinessHourss from "../components/addBusinessHours/add-busi-hours";
import BusinessHoursForm from "../components/BusinessForm/business-hours-form";
import BusinessDeliveryForm from "../components/BusinessForm/business-delivery-form";
import EditBusinessForm from "../components/BusinessForm/edit-business-hour";
import EditBussinessPage from "../components/BusinessForm/editBusiness";
import AddBusinessDetails from "../components/addBusinessDetails/add-business-details";
import EditDeliveryForm from "../components/BusinessForm/edit-delivery-form";

export default function BusinessProfileContent() {
  const [currentView, setCurrentView] = useState("addBusiness");
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const handleViewChange = (view, businessId = null) => {
    setSelectedBusinessId(businessId);
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "addBusiness":
        return <AddBusiness onViewChange={handleViewChange} />;
      case "addForm":
        return <BusinessForm onBack={() => handleViewChange("addBusiness")} />;
      case "addBusinessHours":
        return (
          <AddBusinessHourss
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("Business")}
          />
        );
      case "businessHoursForm":
        return (
          <BusinessHoursForm
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("addBusinessHours")}
          />
        );
      case "editBusinessHour":
        return (
          <EditBusinessForm
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("addBusinessHours")}
          />
        );
      case "editBusinessDetails":
        return (
          <EditBussinessPage
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("dashboard")}
          />
        );
      case "addBusinessDetails":
        return (
          <AddBusinessDetails
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("dashboard")}
          />
        );
      case "addBusinessDetailsForm":
        return (
          <AddBusinessDetails
            onBack={() => handleViewChange("addBusinessDetails")}
            businessId={selectedBusinessId}
          />
        );
      case "addBussinessDelivery":
        return (
          <BusinessDeliveryForm
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("addBusinessDetails")}
          />
        );
      case "editDeliveryForm":
        return (
          <EditDeliveryForm
            businessId={selectedBusinessId}
            onBack={() => handleViewChange("addBusinessDetails")}
          />
        );
      default:
        return <AddBusiness onViewChange={handleViewChange} />;
    }
  };

  return <div>{renderCurrentView()}</div>;
}
