import HeroSection from "../components/features/hero-section";
import DropdownPage from "../components/dropdowns/dropdown-page";
import TrendingSection from "../components/features/trending-section";
import MarketPlace from "../components/features/market-place";
import BuyAnything from "../components/features/buy-anything";

export default function ProductList() {
    return (
      <>
        <HeroSection />
        <DropdownPage />
        <div className="md:pr-[104px] md:pl-[104px]">
          <TrendingSection />
          <MarketPlace />
          <BuyAnything/>
        </div>
      </>
    );
};