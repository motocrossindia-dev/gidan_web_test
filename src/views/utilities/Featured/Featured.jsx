import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar"; // Ensure this path is correct
import ProductGrid from "./ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

function Featured() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  return (
      <>
        <Helmet>
  <title>Gidan - Featured</title>

  <meta
    name="description"
    content="Discover featured plants, pots, seeds, and plant care essentials at Gidan. Shop our handpicked gardening products for healthier, smarter gardening."
  />

  <link
    rel="canonical"
    href="https://gidan.store/feature"
  />
</Helmet>

        <div className="container mx-auto pt-6  min-h-screen">
          {/* Mobile View Button */}
          <div className="md:hidden px-4 pt-4">
            <button
                className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow"
                onClick={toggleMobileFilter}
            >
              <FiFilter size={20} />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* --- CHANGE: Desktop Horizontal Filter - Full Width --- */}
          {/* This is the main container for the horizontal filter bar */}
          <div className="hidden md:block mt-4 overflow-visible relative z-10">
            <FilterSidebar
                setResults={setResults}
                setShowMobileFilter={setShowMobileFilter} // Pass this to close mobile filter on apply
            />
          </div>

          {/* --- CHANGE: Product Grid now takes up the full width below the filter --- */}
          <div className="px-4 mt-4">
            <ProductGrid results={results} />
          </div>

          {/* Additional Sections */}
          <div className="px-4 md:px-8 mt-8">
            <RecentlyViewedProduct />
            {/* <FAQSection /> */}
            <CheckoutStores />
          </div>

          {/* --- Mobile Filter Sidebar Overlay (No changes needed here) --- */}
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
                        setShowMobileFilter={setShowMobileFilter} // Pass this to close the overlay on apply
                    />
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
  );
}

export default Featured;
// ====================================================
// import React, { useEffect, useState } from "react";
// import FilterSidebar from "./FilterSidebar";
// import ProductGrid from "./ProductGrid";
// import FAQSection from "./FAQSection";
// import RecentlyViewedProduct from "./RecentlyViewedProduct";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import {Helmet} from "react-helmet";
//
// function Featured() {
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [results,setResults]=useState([]);
//
//   useEffect(() => {
//     window.scrollTo(0, 0); // Scroll to the top
//   }, []);
//   const toggleMobileFilter = () => {
//     setShowMobileFilter(!showMobileFilter);
//   };
//
//
//   return (
//       <>
//           <Helmet>
//               <title>Gidan - Featured</title>
//           </Helmet>
//     <div className="container mx-auto  pt-6">
//       {/* <Banner1 /> */}
//       <br />
//       <div className="w-full">
//
//       </div>
//       {/* Mobile View Button */}
//       <div className="flex md:hidden justify-between items-center">
//         <button
//           className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
//           onClick={toggleMobileFilter}
//         >
//           <FiFilter size={20} />
//           Filter
//         </button>
//       </div>
//
//       <div className="flex flex-row px-4">
//         {/* Filter Sidebar - 20% width */}
//         <div className="hidden md:block w-1/5">
//           <FilterSidebar setResults={setResults} />
//         </div>
//
//         {/* Product Grid - 80% width */}
//         <div className="md:w-4/5 w-full">
//           <ProductGrid results={results} />
//         </div>
//       </div>
//
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
//           <div className="absolute top-0 left-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//             <button
//               className="absolute top-0 right-0  text-gray-500 font-semibold rounded-full p-2"
//               onClick={toggleMobileFilter}
//             >
//               ✕
//             </button>
//             <FilterSidebar setResults={setResults}/>
//           </div>
//         </div>
//       )}
//     </div>
//           </>
//   );
// }
//
// export default Featured;
