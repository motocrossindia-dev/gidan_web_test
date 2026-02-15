
import React,{useEffect} from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Navigation from "./Components/NavigationBar/NavigationBar";

const LandingPageLayout = () => {

   useEffect(() => {
      window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);
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
