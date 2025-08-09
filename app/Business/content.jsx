
import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "../Add/AddPageContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import BookMarkPage from "../Bookmark/page";
import Settings from "../Settings/page";
import BusinessContent from "./BusinessContent";
import CreateBusinessContent from "../create-business/CreateBusinessContent";
import BusinessHourContent from "../BusinessHours/BusinessHourContent";

const sectionComponents = {
  "Profile": <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Business Profile": <CreateBusinessContent />,
  "Business Page": <BusinessContent />,
  "Business Hour": <BusinessHourContent />,
  "Analytics": <div><h2 className="text-xl font-bold mb-2">Analytics</h2><p>Comming Soon...</p></div>,
  "Bookmarked": <BookMarkPage />,
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
            return sectionComponents["Business Page"];
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
                    className="text-blue-700 mb-4 flex items-center gap-2"
                >
                    &larr; Back to Menu
                </button>
            )}

            <div>
                {renderContent()}
            </div>
        </main>
    );
}

