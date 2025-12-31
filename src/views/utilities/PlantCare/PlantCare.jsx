import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import FilterSidebarMobile from "./FilterSidebarMobile";
import ProductGrid from "../PlantFilter/ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axiosInstance from "../../../Axios/axiosInstance";

function PlantCare() {
  const { id } = useParams();
  const location = useLocation();
  const path = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [products, setProducts] = useState({});
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMobileFilter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  useEffect(() => {
    const getInitialProducts = async () => {
      if (query) {
        try {
          const response = await axiosInstance.get(
              `${process.env.REACT_APP_API_URL}/filters/main_productsFilter/?search=${query}`
          );
          if (response.status === 200) {
            setResults(response.data.results || []);
           setProducts({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
          });
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
        return;
      }

      // Default behavior when no search query
      try {
        const response = await axiosInstance.get(
            `/filters/main_productsFilter/`
        );

        if (response.status === 200) {
          setResults(response.data.results || []);
          setProducts({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (path.startsWith("/plant-care") || query) {
      getInitialProducts();
    }
  }, [id, path, query]);

  return (
      <>
        <Helmet>
          <title>Gidan - Plant Care</title>
        </Helmet>
        <div className="container mx-auto min-h-screen">
          {/* Mobile Filter Button */}
          <div className="md:hidden px-4 pt-4">
            <button
                className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow"
                onClick={toggleMobileFilter}
            >
              <FiFilter size={20} />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Desktop Horizontal Filter - Full Width */}
          <div className="hidden md:block mt-4 overflow-visible relative z-10">
            <FilterSidebar
                setResults={setResults}
            />
          </div>

          {/* Product Grid */}
          <div className="px-4 mt-4">
            <ProductGrid
                productDetails={results}
                pagination={products}
                setResults={setResults}
                query={query}
            />
          </div>

          {/* Additional Sections */}
          <div className="px-4 md:px-8 mt-8">
            <RecentlyViewedProduct />
            <FAQSection />
            <CheckoutStores />
          </div>

          {/* Mobile Filter Sidebar Overlay */}
          {showMobileFilter && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
                  {/* Close Button */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                    <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        onClick={toggleMobileFilter}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Mobile Filter Content */}
                  <div className="p-4">
                    <FilterSidebar
                        setResults={setResults}
                        setShowMobileFilter={setShowMobileFilter}
                    />
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
  );
}

export default PlantCare;
// import React, { useEffect, useState } from "react";
// import FilterSidebar from "../Featured/FilterSidebar";
// import FilterSidebarMobile from "./FilterSidebarMobile"; // Mobile version of FilterSidebar
// import ProductGrid from "../PlantFilter/ProductGrid";
// import FAQSection from "./FAQSection";
// import RecentlyViewedProduct from "./RecentlyViewedProduct";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import { useLocation } from "react-router-dom";
// import  axiosInstance  from "../../../Axios/axiosInstance";
// import {Helmet} from "react-helmet"; // Adjust the import path as necessary
//
//
// function PlantCare() {
//
//
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [results,setResults] = useState([])
//   const [pages,setPages] = useState(null)
//   const toggleMobileFilter = () => {
//     setShowMobileFilter(!showMobileFilter);
//   };
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const query = queryParams.get('query') || '';
//
// useEffect(() => {
//  if (query) {
//   const fetchSearchResults = async () => {
//     try {
//
//       const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/product/searchProducts/?search=${query}`,
//           // { search: query },
//         );
//                 if (response?.status === 200) {
//
//           // navigate("/search", { state: { searchResults: response?.data,SearchTerm:searchTerm } });
//                   setResults(response?.data?.products); // Store search results
//           setPages(response?.data); // Store pagination data
//         }
//
//     } catch (error) {
//               console.error("Error fetching search results:", error);
//
//     }
//   }
//   fetchSearchResults();
// }
//
// }, [query]);
//
//
//
//
//   useEffect(() => {
//     window.scrollTo(0, 0); // Scroll to the top
//   }, []);
//
//   return (
//       <>
//           <Helmet>
//               <title>Gidan - Plant Care</title>
//           </Helmet>
//     <div className="container mx-auto bg-gray-100 pt-6">
//       {/* <Banner1 /> */}
//       <br />
//       <div className="w-full">
//
//       </div>
//       {/* Mobile View Button */}
//       <div className="flex md:hidden justify-between items-center">
//       <button
//         className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
//         onClick={toggleMobileFilter}
//       >
//          <FiFilter size={20} />
//         Filter
//       </button>
//       </div>
//       <div className="flex flex-row md:flex-row px-4 ">
//         {/* Filter Sidebar */}
//         <div className="hidden md:block">
//           <FilterSidebar setResults={setResults} />
//         </div>
//         <div className="flex-1">
//           {/* Product Grid */}
//           <ProductGrid productDetails={results} pagination={pages} setResults={setResults} query={query} />
//         </div>
//       </div>
//       <RecentlyViewedProduct />
//       {/* FAQ Section */}
//       <div className="md:ml-16 overflow-x-hidden md:mr-12 ">
//         <FAQSection />
//
//         <CheckoutStores />
//       </div>
//       {/* Mobile Filter Sidebar */}
//       {showMobileFilter && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//           <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//             <button
//               className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
//               onClick={toggleMobileFilter}
//             >
//               ✕
//             </button>
//             <FilterSidebarMobile />
//           </div>
//         </div>
//       )}
//     </div>
//           </>
//   );
// }
//
// export default PlantCare;
