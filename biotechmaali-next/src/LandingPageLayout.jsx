'use client';


import React,{useEffect} from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/NavigationBar/NavigationBar";

const LandingPageLayout = () => {
   const location = useLocation();

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Smooth scroll to top on route change
    }, [location.pathname]);
    
  return (
    <div className="landing-page-layout w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* sticky Header */}
      <div className="sticky top-0 left-0  w-full z-50">
        <Header />
        <Navigation />
      </div>

      
      <main className="main-content w-full overflow-x-hidden">
        <Outlet />

          {/* Footer */}
          <Footer />
      </main>

    </div>
  );
};

export default LandingPageLayout;
