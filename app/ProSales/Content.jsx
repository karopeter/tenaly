import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import MorePostCarContent from "../more-post-vehicle/MorePostCarContent";
import CreateCarContent from "../create-add/CreateAddContent";
import CommercialSaleContent from "../commercial-sale/CommercialSaleContent";
import ApartmentSaleContent from "../apartment-sale/ApartmentSaleContent";
import ApartmentRentContent from "../apartment-rent/ApartmentRentContent";
import Wallet from "../Wallet/page";
import AnalyticsContent from "../Analytics/AnalyticsContent";
import ProSalesContent from "./ProSalesContent";
import FrequentlyAskedQuestions from "../Faq/page";
import Bookmarked from "../Bookmarked/page";
import Settings from "../Settings/page";    
import { ArrowLeft } from "lucide-react";


const sectionComponents = {
  "Profile": <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Create Car": <CreateCarContent />,
  "Create Vehicle": <MorePostCarContent />,
  "Commercial Sale": <CommercialSaleContent />,
  "Apartment Sale": <ApartmentSaleContent />,
  "Apartment Rent": <ApartmentRentContent />,
  "Analytics":  <AnalyticsContent />,
  "Bookmarked": <Bookmarked />,
  "Customer Reviews": <div><h2 className="text-xl font-bold mb-2">Comming Soon</h2></div>,
  "Pro Sales": <ProSalesContent />,
  "Customer Support": <div><h2 className="text-xl font-bold mb-2">Coming Soon</h2></div>,
  "Wallet": <Wallet />,
  "Frequently Asked Questions": <FrequentlyAskedQuestions />,
  "Settings": <Settings />
};

export default function Content({ activeSection, setActiveSection, isMobile }) {
  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  const renderContent = () => {
    // If no activeSection is selected, show Create Car by default
    if (!activeSection) {
      return sectionComponents["Pro Sales"];
    }
    
    return sectionComponents[activeSection] || (
      <div>
        <h2 className="text-xl font-bold mb-2">Comming soon</h2>
        {/* <h2 className="text-xl font-bold mb-2">{activeSection}</h2>
        <p>Content for {activeSection} not yet implemented.</p> */}
      </div>
    );
  };

  return (
    <main className="flex-1">
      {isMobile && activeSection && (
        <button
          onClick={handleBackToMenu}
          className="text-blue-700 mb-4 flex items-center gap-2 md:hidden"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      )}

      <div className="p-4">
        {renderContent()}
      </div>
    </main>
  );
}