import ProfilePageContent from "./ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import Bookmarked from "../Bookmarked/page";
import BusinessProfileContent from "./BusinessProfileContent";
import Settings from "../Settings/page";
import { ArrowLeft, Bookmark } from "lucide-react";


const sectionComponents = {
  "Profile": <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Business": <BusinessProfileContent />,
  "Analytics": <div><h2 className="text-xl font-bold mb-2">Analytics</h2><p>Comming Soon...</p></div>,
  "Bookmarked": <Bookmark />,
  "Customer Reviews": <div><h2 className="text-xl font-bold mb-2">Customer Reviews</h2><p>Coming Soon...</p></div>,
  "Pro Sales": <div><h2 className="text-xl font-bold mb-2">Pro Sales</h2><p>Comming Soon</p></div>,
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
        if (!activeSection) {
            return sectionComponents["Profile"];
        }
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
                   className="text-[#525252] mb-4 mt-4 flex items-center gap-2 md:hidden"
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