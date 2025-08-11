import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import BookMarkPage from "../Bookmark/page";
import Settings from "../Settings/page";
import DeliveryContent from "./DeliveryContent";
import { ArrowLeft } from "lucide-react";
import BusinessHourContent from "../BusinessHours/BusinessHourContent";
import CreateBusinessContent from "../create-business/CreateBusinessContent";

const sectionComponents = {
  "Profile": <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Business Profile": <CreateBusinessContent />,
  "Business Page": <BusinessHourContent />,
  "Business Hour": <BusinessHourContent />,
  "Delivery": <DeliveryContent />,
  "Analytics": <div><h2 className="text-xl font-bold mb-2">Analytics</h2><p>Coming Soon...</p></div>,
  "Bookmarked": <BookMarkPage />,
  "Customer Reviews": <div><h2 className="text-xl font-bold mb-2">Customer Reviews</h2><p>Coming Soon...</p></div>,
  "Pro Sales": <div><h2 className="text-xl font-bold mb-2">Pro Sales</h2><p>Coming Soon</p></div>,
  "Customer Support": <div><h2 className="text-xl font-bold mb-2">Customer Support</h2><p>Coming Soon...</p></div>,
  "Wallet": <Wallet />,
  "Frequently Asked Questions": <FrequentlyAskedQuestions />,
  "Settings": <Settings />
};

export default function Content({ activeSection, setActiveSection, isMobile }) {
    const handleBackToMenu = () => {
        setActiveSection(null);
    };

    const renderContent = () => {
        // If no activeSection is selected, show a default message or component
        if (!activeSection) {
            return (
                <div>
                    <h2 className="text-xl font-bold mb-2">Welcome</h2>
                    <p>Please select an option from the menu.</p>
                </div>
            );
        }
        
        // Ensure Business Hour content is properly rendered
        return sectionComponents[activeSection] || (
            <div>
                <h2 className="text-xl font-bold mb-2">{activeSection}</h2>
                <p>Content for {activeSection} not yet implemented.</p>
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
       <ArrowLeft size={20} /> Back
     </button>
            )}

            <div>
                {renderContent()}
            </div>
        </main>
    );
}