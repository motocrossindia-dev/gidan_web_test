'use client';

import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import FranchiseForm from "./FranchiseForm";
import WhyWeRockSection from "./WhyWeRock";
import StoreLocations from "./StoreLocations";
import { Helmet } from "react-helmet-async";

function FranchiseEnquires() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  return (
      <>
          <Helmet>
  <title>Gidan - Franchise Enquires</title>

  <meta
    name="description"
    content="Partner with Gidan through franchise opportunities. Submit your franchise enquiry and join our growing gardening and plant retail brand."
  />

  <link
    rel="canonical"
    href="https://gidan.store/franchise-enquiry"
  />
</Helmet>

          <div className="space-y-10 bg-gray-100 mt-10 px-4 md:px-0 mb-2">
              <HeroSection />
              <FranchiseForm />
              <WhyWeRockSection />
              <StoreLocations />
          </div>
      </>

  );
}

export default FranchiseEnquires;
