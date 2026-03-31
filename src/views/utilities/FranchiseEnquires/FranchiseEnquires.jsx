'use client';

import React, { useEffect } from "react";
import PageHeader from "@/components/Shared/PageHeader";
import FranchiseForm from "./FranchiseForm";
import WhyWeRockSection from "./WhyWeRock";
import StoreLocations from "./StoreLocations";

function FranchiseEnquires() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <main className="font-sans text-[#173113] bg-[#faf9f6] min-h-screen">
      <PageHeader 
        title="Grow with Gidan" 
        subtitle="Join our network of sustainable gardening partners and cultivate success."
      />
      
      <div className="space-y-24 bg-[#faf9f6] pb-24">
        <FranchiseForm />
        <WhyWeRockSection />
        <StoreLocations />
      </div>
    </main>
  );
}

export default FranchiseEnquires;
