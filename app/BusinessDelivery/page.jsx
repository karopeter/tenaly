"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/navbar/sidebar";
import Content from "./content";

export default function BusinessDelivery() {
  const [activeSection, setActiveSection] = useState("Delivery"); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conditionally render the entire layout based on mobile state and active section
  const renderLayout = () => {
    // If it's mobile and no section is active, show the sidebar.
    if (isMobile && !activeSection) {
      return (
        <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
          <Sidebar
            isMobile={isMobile}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
      );
    }
        
    // If it's desktop or a mobile section is active, show the main content.
    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <div className="flex flex-col md:flex-row gap-10">
          {!isMobile && (
            <div>
             <Sidebar
              isMobile={isMobile}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
            </div>
          )}
          <Content
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMobile={isMobile}
          />
        </div>
      </div>
    );
  };

  return renderLayout();
}