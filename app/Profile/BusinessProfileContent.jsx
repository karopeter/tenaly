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


// This component acts as a sub-router for all business-related views
export default function BusinessProfileContent() {
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or other views
  const [selectedBusinessId, setSelectedBusinessId] = useState(null); // State to store the ID of the business being edited

  // Centralized function to handle all view changes
  const handleViewChange = (view, businessId = null) => {
    setSelectedBusinessId(businessId);
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        // The dashboard view now passes a function to handle view changes
        return <AddBusiness onViewChange={handleViewChange} />;
      case "addForm":
        // This view is for adding a NEW business, so selectedBusinessId is null
        return <BusinessForm onBack={() => handleViewChange("dashboard")} />;
      case "addBusinessHours":
        // This view is for adding business hours for a specific business
        return <AddBusinessHourss businessId={selectedBusinessId} onBack={() => handleViewChange("dashboard")} />;
      case "businessHoursForm":
        // The business ID is now passed to the form
        return <BusinessHoursForm businessId={selectedBusinessId} onBack={() => handleViewChange("addBusinessHours")} />;
      case "editBusinessHour":
        // The business ID is now passed to the form
        return <EditBusinessForm businessId={selectedBusinessId} onBack={() => handleViewChange("addBusinessHours")} />;
      case "editBusinessDetails":
        // This is for editing a specific business's details
        return <EditBussinessPage businessId={selectedBusinessId} onBack={() => handleViewChange("dashboard")} />;
      case "addBusinessDetails":
        // The business ID is now passed to the form
        return <AddBusinessDetails businessId={selectedBusinessId} onBack={() => handleViewChange("dashboard")} />;
      case "addBusinessDetailsForm":
        // This is for adding details to a specific business
        return <AddBusinessDetails onBack={() => handleViewChange("addBusinessDetails")} businessId={selectedBusinessId} />;
      case "addBussinessDelivery":
        // The business ID is now passed to the form
        return <BusinessDeliveryForm businessId={selectedBusinessId} onBack={() => handleViewChange("addBusinessDetails")} />;
      case "editDeliveryForm":
        // The business ID is now passed to the form
        return <EditDeliveryForm businessId={selectedBusinessId} onBack={() => handleViewChange("addBusinessDetails")} />;
      default:
        // Defaulting to the dashboard view
        return <AddBusiness onViewChange={handleViewChange} />;
    }
  };

  return (
    <div>
      {renderCurrentView()}
    </div>
  );
}