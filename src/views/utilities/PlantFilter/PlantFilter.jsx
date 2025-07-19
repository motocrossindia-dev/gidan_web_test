import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "./ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";

import { FiFilter } from "react-icons/fi";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Helmet} from "react-helmet";
import axiosInstance from "../../../Axios/axiosInstance";

function PlantFilter() {
const { id } = useParams();
  const location = useLocation();

 const path = location.pathname;

  console.log('id from params:', id);

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [products, setProducts] = useState([]);
    const [results,setResults]=useState([]);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

useEffect(() => {
  if (path.includes("/filter/")) {
            const getCategoryProducts = async()=>{

    if (id === 14) {
       try {

      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/product/offerProducts/`)
      if (response.status === 200) {

        setResults(response.data.products || []);
        setProducts(response.data || {});
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }
    }
         try {
          const response = await axiosInstance.get(
            `${process.env.REACT_APP_API_URL}/product/category-products/${id}/`);
            if (response.data.message==='success') {
              setResults(response.data.products || []);
              setProducts(response.data || {});
            }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          return [];

        }
    }
    getCategoryProducts();
  } else if (path.includes("/filter/subcategory/")) {
    // Call API B
const getSubCategorywiseProduct = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/subcategory-products/${id}/`);


      if (response?.status===200) {
        setResults(response.data.products || []);
        setProducts(response.data || {});

      }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];

  }
}
getSubCategorywiseProduct(id)
  }
}, [id]);







  return (
      <>
          <Helmet>
              <title>Biotech Maali - Plant Filter</title>
          </Helmet>
    <div className="container mx-auto bg-gray-100 pt-1">
      {/* <Banner1 /> */}
      <br />

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
          <FilterSidebar setResults={setResults}  />

        </div>
        <div className="flex-1">
          {/* Product Grid */}
          <ProductGrid productDetails={results} pagination={products} setResults={setResults} />
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
            <FilterSidebar setResults={setResults}  />
            </div>
        </div>
      )}
    </div>
          </>
  );
}

export default PlantFilter;
