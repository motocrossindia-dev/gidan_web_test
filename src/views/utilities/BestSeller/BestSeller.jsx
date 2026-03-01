'use client';

import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import FilterSidebarMobile from "./FilterSidebarMobile"; // Mobile version of FilterSidebar
import ProductGrid from "../../../components/Shared/ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import CheckoutStores from "./CheckoutStores";
import Banner1 from "./Banner1";
import { Card } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";

function BestSeller() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  return (
      <>
          
    <div className="container mx-auto bg-gray-100 pt-6">
      <Banner1 />
      <br />
      <div className="w-full">
        <Card className="bg-gray-100 w-full">
          <h1 className="md:text-3xl text-xl font-bold  mb-4 w-full mt-6 md:pl-8 pl-4">
            Plants
          </h1>
          <p className="text-gray-600 mx-4 mb-8 text-md">
            Plants make for the best house companions, suitable for all your
            moods and every aesthetic. BiotechMaali brings you the widest
            variety of plants to choose from so you can buy plants online from
            the comfort of your home!
          </p>
        </Card>
      </div>
      {/* Mobile View Button */}
      <div className="flex md:hidden justify-between items-center">
      <button
        className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
        onClick={toggleMobileFilter}
      >
         <FiFilter size={20} /> 
        Filter
      </button>
      </div>
      <div className="flex flex-row md:flex-row px-4 ">
        {/* Filter Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar />
        </div>
        <div className="flex-1">
          {/* Product Grid */}
          <ProductGrid />
        </div>
      </div>
      <RecentlyViewedProducts />
      {/* FAQ Section */}
      <div className="md:ml-16 overflow-x-hidden md:mr-12 ">
        <FAQSection />

        <CheckoutStores />
      </div>
      {/* Mobile Filter Sidebar */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
              onClick={toggleMobileFilter}
            >
              ✕
            </button>
            <FilterSidebarMobile />
          </div>
        </div>
      )}
    </div>
        <HomepageSchema/>
        <StoreSchema/>
          </>
  );
}

export default BestSeller;
