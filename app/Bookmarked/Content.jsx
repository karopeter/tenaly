import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import MorePostCarContent from "../more-post-vehicle/MorePostCarContent";
import CreateCarContent from "../create-add/CreateAddContent";
import CommercialSaleContent from "../commercial-sale/CommercialSaleContent";
import ApartmentSaleContent from "../apartment-sale/ApartmentSaleContent";
import BookMarkedContent from "./BookmarkedContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import Settings from "../Settings/page";

import { ArrowLeft } from "lucide-react";

export default function Content({ activeSection, setActiveSection, isMobile }) {
  const handleBackToMenu = () => {
    setActiveSection(null);
  };

  // Create section components as functions to ensure fresh renders
  const getSectionComponent = (section) => {
    switch (section) {
      case "Profile":
        return <ProfilePageContent />;
      case "My Ads":
        return <AddCarPostContent />;
      case "Create Car":
        return <CreateCarContent />;
      case "Create Vehicle":
        return <MorePostCarContent />;
      case "Commercial Sale":
        return <CommercialSaleContent />;
      case "Apartment Sale":
        return <ApartmentSaleContent />;
      case "Analytics":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Analytics</h2>
            <p>Content for Analytics not yet implemented.</p>
          </div>
        );
      case "Bookmarked":
        return <BookMarkedContent />;
      case "Customer Reviews":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
            <p>Content for Customer Reviews not yet implemented.</p>
          </div>
        );
      case "Pro Sales":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Pro Sales</h2>
            <p>Content for Pro Sales not yet implemented.</p>
          </div>
        );
      case "Customer Support":
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">Customer Support</h2>
            <p>Content for Customer Support not yet implemented.</p>
          </div>
        );
      case "Wallet":
        return <Wallet />;
      case "Frequently Asked Questions":
        return <FrequentlyAskedQuestions />;
      case "Settings":
        return <Settings />;
      default:
        return (
          <div>
            <h2 className="text-xl font-bold mb-2">{section}</h2>
            <p>Content for {section} not yet implemented.</p>
          </div>
        );
    }
  };

  const renderContent = () => {
    // If no activeSection is selected, show Bookmarked by default
    const sectionToRender = activeSection || "Bookmarked";
    return getSectionComponent(sectionToRender);
  };

  return (
    <main className="flex-1 mt-6 md:mt-0 space-y-6 gap-2">
      {isMobile && activeSection && (
        <button
          onClick={handleBackToMenu}
          className="text-[#000087] mb-4 flex items-center gap-2 md:hidden"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      )}

      <div className="p-4">
        {renderContent()}
      </div>
    </main>
  );
}