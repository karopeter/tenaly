import ProfilePageContent from "../Profile/ProfilePageContent";
import AddCarPostContent from "./AddPageContent";
import Wallet from "../Wallet/page";
import FrequentlyAskedQuestions from "../Faq/page";
import BookMarkPage from "../Bookmark/page";
import Settings from "../Settings/page";

const sectionComponents = {
  "Profile": <ProfilePageContent />,
  "My Ads": <AddCarPostContent />,
  "Analytics": <div><h2 className="text-xl font-bold mb-2">Analytics</h2><p>Content for Analytics not yet implemented.</p></div>,
  "Bookmarked": <BookMarkPage />,
  "Customer Reviews": <div><h2 className="text-xl font-bold mb-2">Customer Reviews</h2><p>Content for Customer Reviews not yet implemented.</p></div>,
  "Pro Sales": <div><h2 className="text-xl font-bold mb-2">Pro Sales</h2><p>Content for Pro Sales not yet implemented.</p></div>,
  "Customer Support": <div><h2 className="text-xl font-bold mb-2">Customer Support</h2><p>Content for Customer Support not yet implemented.</p></div>,
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
            return sectionComponents["My Ads"];
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

            <div className="p-4">
                {renderContent()}
            </div>
        </main>
    );
}