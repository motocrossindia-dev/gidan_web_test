'use client';

import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import FranchiseForm from "./FranchiseForm";
import WhyWeRockSection from "./WhyWeRock";
import StoreLocations from "./StoreLocations";
function FranchiseEnquires() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  return (
    <>
      

      <div className="space-y-10 bg-site-bg mt-10 px-4 md:px-0 mb-2">
        <HeroSection />
        <FranchiseForm />
        <WhyWeRockSection />
        <StoreLocations />
      </div>
    </>

  );
}

export default FranchiseEnquires;
