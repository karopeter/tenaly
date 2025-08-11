"use client";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "../components/navbar/sidebar";
import Content from "./Content";

export default function MorePropertyPost() {
   const [activeSection, setActiveSection] = useState("Event Center");
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Don't reset activeSection on desktop - keep it as "Create Car"
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

    return (
      <div className="md:px-[104px] px-4 md:ml-10 mt-16 md:mt-40">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {!isMobile && (
            <Sidebar 
              isMobile={isMobile} 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          )}
          {/* The fix: wrapping Content in a Suspense boundary */}
          <Suspense fallback={<div>Loading property post content...</div>}>
            <Content
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isMobile={isMobile}
            />
          </Suspense>
        </div>
      </div>
    );
  };
  return renderLayout();
}