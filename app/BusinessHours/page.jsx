// app/BusinessHours/page.js

"use client";
import { useEffect, useState, Suspense } from "react";
import Sidebar from "../components/navbar/sidebar";
import Content from "./content";

// A small component that contains the content and sidebar.
// This is what will be wrapped in Suspense.
function BusinessHoursSection({ activeSection, setActiveSection, isMobile }) {
  return (
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
  );
}

export default function BusinessHours() {
  const [activeSection, setActiveSection] = useState("Business Hour");
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

  const renderLayout = () => {
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
      <div className="md:px-[104px] px-4 md:ml-10 mt-20 md:mt-40">
        <Suspense fallback={<div>Loading...</div>}>
          <BusinessHoursSection
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMobile={isMobile}
          />
        </Suspense>
      </div>
    );
  };

  return renderLayout();
}