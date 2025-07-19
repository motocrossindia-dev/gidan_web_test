import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import FranchiseForm from "./FranchiseForm";
import WhyWeRockSection from "./WhyWeRock";
import FeaturesSection from "./FeaturesSection";
import StoreLocations from "./StoreLocations";
import TestimonialsSection from "./Testimonials";
import {Helmet} from "react-helmet";

function FranchiseEnquires() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  return (
      <>
          <Helmet>
              <title>Biotech Maali - Franchise Enquires</title>
          </Helmet>
          <div className="space-y-10 bg-gray-100 mt-10 px-4 md:px-0">
              <HeroSection />
              <FranchiseForm />
              <WhyWeRockSection />
              <FeaturesSection />
              <StoreLocations />
              <TestimonialsSection />
          </div>
      </>

  );
}

export default FranchiseEnquires;
