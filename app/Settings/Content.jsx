import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import MorePostCarContent from "../more-post-vehicle/MorePostCarContent";
import CreateCarContent from "../create-add/CreateAddContent";
import CommercialSaleContent from "../commercial-sale/CommercialSaleContent";
import ApartmentSaleContent from "../apartment-sale/ApartmentSaleContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import Bookmarked from "../Bookmarked/page";
import SettingsContent from "./SettingsContent"; 
import { ArrowLeft } from "lucide-react";

const sectionComponents = {
  Profile: <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Create Car": <CreateCarContent />,
  "Create Vehicle": <MorePostCarContent />,
  "Commercial Sale": <CommercialSaleContent />,
  "Apartment Sale": <ApartmentSaleContent />,
  Analytics: (
    <div>
      <h2 className="text-xl font-bold mb-2">Analytics</h2>
      <p>Comming soon.</p>
    </div>
  ),
  Bookmarked: <Bookmarked />,
  "Customer Reviews": (
    <div>
      <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
      <p>Comming Soon</p>
    </div>
  ),
  "Pro Sales": (
    <div>
      <h2 className="text-xl font-bold mb-2">Pro Sales</h2>
      <p>Comming Soon.</p>
    </div>
  ),
  "Customer Support": (
    <div>
      <h2 className="text-xl font-bold mb-2">Customer Support</h2>
      <p>Comming soon.</p>
    </div>
  ),
  Wallet: <Wallet />,
  "Frequently Asked Questions": <FrequentlyAskedQuestions />,
  Settings: <SettingsContent />,
};

export default function Content({ activeSection, setActiveSection, isMobile }) {
  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  const renderContent = () => {
    if (!activeSection) {
      return sectionComponents["Settings"]; 
    }
    return (
      sectionComponents[activeSection] || (
        <div>
          <h2 className="text-xl font-bold mb-2">{activeSection}</h2>
          <p>Content for {activeSection} not yet implemented.</p>
        </div>
      )
    );
  };

  return (
    <main className="flex-1">
      {isMobile && activeSection && (
        <button
          onClick={handleBackToMenu}
          className="text-[#000087] mb-4 flex mt-5 items-center gap-2 md:hidden"
        >
           <ArrowLeft size={20} />
          {activeSection}  
        </button>
      )}

      <div className="p-4">{renderContent()}</div>
    </main>
  );
}
