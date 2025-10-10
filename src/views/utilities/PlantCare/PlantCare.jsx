import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import FilterSidebarMobile from "./FilterSidebarMobile"; // Mobile version of FilterSidebar
import ProductGrid from "../PlantFilter/ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import  axiosInstance  from "../../../Axios/axiosInstance";
import {Helmet} from "react-helmet"; // Adjust the import path as necessary


function PlantCare() {
  

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [results,setResults] = useState([])
  const [pages,setPages] = useState(null)
  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  
useEffect(() => {
 if (query) {
  const fetchSearchResults = async () => {
    try {
     
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/product/searchProducts/?search=${query}`,
          // { search: query },
        );
                if (response?.status === 200) {
                    
          // navigate("/search", { state: { searchResults: response?.data,SearchTerm:searchTerm } });
                  setResults(response?.data?.products); // Store search results
          setPages(response?.data); // Store pagination data
        }

    } catch (error) {
              console.error("Error fetching search results:", error);

    }
  }
  fetchSearchResults();
}

}, [query]);




  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
      <>
          <Helmet>
              <title>Biotech Maali - Plant Care</title>
          </Helmet>
    <div className="container mx-auto bg-gray-100 pt-6">
      {/* <Banner1 /> */}
      <br />
      <div className="w-full">

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
          <FilterSidebar setResults={setResults} />
        </div>
        <div className="flex-1">
          {/* Product Grid */}
          <ProductGrid productDetails={results} pagination={pages} setResults={setResults} query={query} />
        </div>
      </div>
      <RecentlyViewedProduct />
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
          </>
  );
}

export default PlantCare;
