import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "./ProductGrid";
import FAQSection from "./FAQSection";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axiosInstance from "../../../Axios/axiosInstance";

function PlantFilter() {
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname;

    const stateData = location.state || {};
    const { categoryId, categoryName, typeKey, subCategory, subcategoryID } = stateData;
    const { name: subCategoryName } = subCategory || {};

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
            if (id === "14") {
                try {
                    const response = await axiosInstance.get(
                        `/product/offerProducts/`
                    );
                    if (response.status === 200) {
                        setResults(response.data.products || []);
                        setProducts(response.data || {});
                    }
                } catch (error) {
                    console.error("Error fetching offer products:", error);
                }
                return;
            }

            try {
                let queryParams = new URLSearchParams();

                if (typeKey) {
                    queryParams.append("type", typeKey);
                }

                if (categoryId || id) {
                    queryParams.append("category_id", categoryId || id);
                }

                if (subcategoryID) {
                    queryParams.append("subcategory_id", subcategoryID);
                }

                const response = await axiosInstance.get(
                    `/filters/main_productsFilter/?${queryParams.toString()}`
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
                console.error("Error fetching products via filter API:", error);
            }
        };

        if (path.startsWith("/filter/")) {
            getInitialProducts();
        }
    }, [id, path, typeKey, categoryId, subcategoryID]);

    return (
        <>
            <Helmet>
                <title>Gidan - Plant Filter</title>
            </Helmet>
            <div className="container mx-auto  min-h-screen">
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
                        categoryId={categoryId || id}
                        category={categoryName}
                        subcategory={subCategoryName}
                        subcategoryID={subcategoryID}
                        typeKey={typeKey}
                    />
                </div>

                {/* Product Grid */}
                <div className="px-4 mt-4">
                    <ProductGrid
                        productDetails={results}
                        pagination={products}
                        setResults={setResults}
                        categoryName={categoryName}
                        typeKey={typeKey}
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
                                    categoryId={categoryId || id}
                                    category={categoryName}
                                    subcategory={subCategoryName}
                                    subcategoryID={subcategoryID}
                                    typeKey={typeKey}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PlantFilter;
// //<editor-fold desc="vertical">
// import React, { useEffect, useState } from "react";
// import FilterSidebar from "../Featured/FilterSidebar";
// import ProductGrid from "./ProductGrid";
// import FAQSection from "./FAQSection";
// import RecentlyViewedProduct from "./RecentlyViewedProduct";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import { useLocation } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import axiosInstance from "../../../Axios/axiosInstance";
//
// function PlantFilter() {
//     const { id } = useParams();
//     const location = useLocation();
//     const path = location.pathname;
//
//     const stateData = location.state || {};
//     const { categoryId, categoryName, typeKey, subCategory, subcategoryID } = stateData;
//     const { name: subCategoryName } = subCategory || {};
//
//     const [showMobileFilter, setShowMobileFilter] = useState(false);
//     const [products, setProducts] = useState({});
//     const [results, setResults] = useState([]);
//
//     useEffect(() => {
//         if (showMobileFilter) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "auto";
//         }
//         return () => {
//             document.body.style.overflow = "auto";
//         };
//     }, [showMobileFilter]);
//
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);
//
//     const toggleMobileFilter = () => {
//         setShowMobileFilter(!showMobileFilter);
//     };
//
//     useEffect(() => {
//         const getInitialProducts = async () => {
//             if (id === "14") {
//                 try {
//                     const response = await axiosInstance.get(
//                         `/product/offerProducts/`
//                     );
//                     if (response.status === 200) {
//                         setResults(response.data.products || []);
//                         setProducts(response.data || {});
//                     }
//                 } catch (error) {
//                     console.error("Error fetching offer products:", error);
//                 }
//                 return;
//             }
//
//             try {
//                 let queryParams = new URLSearchParams();
//
//                 if (typeKey) {
//                     queryParams.append("type", typeKey);
//                 }
//
//                 if (categoryId || id) {
//                     queryParams.append("category_id", categoryId || id);
//                 }
//
//                 if (subcategoryID) {
//                     queryParams.append("subcategory_id", subcategoryID);
//                 }
//
//                 const response = await axiosInstance.get(
//                     `/filters/main_productsFilter/?${queryParams.toString()}`
//                 );
//
//                 if (response.status === 200) {
//                     setResults(response.data.results || []);
//                     setProducts({
//                         count: response.data.count,
//                         next: response.data.next,
//                         previous: response.data.previous,
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching products via filter API:", error);
//             }
//         };
//
//         if (path.startsWith("/filter/")) {
//             getInitialProducts();
//         }
//     }, [id, path, typeKey, categoryId, subcategoryID]);
//
//     return (
//         <>
//             <Helmet>
//                 <title>Gidan - Plant Filter</title>
//             </Helmet>
//             <div className="container mx-auto bg-gray-100 pt-1">
//                 <br />
//                 <div className="flex md:hidden justify-between items-center">
//                     <button
//                         className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
//                         onClick={toggleMobileFilter}
//                     >
//                         <FiFilter size={20} />
//                         Filter
//                     </button>
//                 </div>
//                 <div className="flex flex-row md:flex-row px-4">
//                     <div className="hidden md:block">
//                         <FilterSidebar
//                             setResults={setResults}
//                             categoryId={categoryId || id}
//                             category={categoryName}
//                             subcategory={subCategoryName}
//                             subcategoryID={subcategoryID}
//                             typeKey={typeKey}
//                         />
//                     </div>
//                     <div className="flex-1">
//                         {/* REMOVED key prop to prevent forced re-renders */}
//                         <ProductGrid
//                             productDetails={results}
//                             pagination={products}
//                             setResults={setResults}
//                             categoryName={categoryName}
//                             typeKey={typeKey}
//                         />
//                     </div>
//                 </div>
//                 <RecentlyViewedProduct />
//                 <div className="md:ml-16 overflow-x-hidden md:mr-12">
//                     <FAQSection />
//                     <CheckoutStores />
//                 </div>
//                 {showMobileFilter && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//                             <button
//                                 className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
//                                 onClick={toggleMobileFilter}
//                             >
//                                 ✕
//                             </button>
//                             <FilterSidebar
//                                 setResults={setResults}
//                                 setShowMobileFilter={setShowMobileFilter}
//                                 categoryId={categoryId || id}
//                                 category={categoryName}
//                                 subcategory={subCategoryName}
//                                 subcategoryID={subcategoryID}
//                                 typeKey={typeKey}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }
//
// export default PlantFilter;
// //</editor-fold>
// // PlantFilter.js - Fixed version with proper state updates
//
// import React, { useEffect, useState } from "react";
// import FilterSidebar from "../Featured/FilterSidebar";
// import ProductGrid from "./ProductGrid";
// import FAQSection from "./FAQSection";
// import RecentlyViewedProduct from "./RecentlyViewedProduct";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import { useLocation } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import axiosInstance from "../../../Axios/axiosInstance";
//
// function PlantFilter() {
//     const { id } = useParams();
//     const location = useLocation();
//     const path = location.pathname;
//
//     const stateData = location.state || {};
//     const { categoryId, categoryName, typeKey, subCategory, subcategoryID } = stateData;
//     const { name: subCategoryName } = subCategory || {};
//
//     const [showMobileFilter, setShowMobileFilter] = useState(false);
//     const [products, setProducts] = useState({});
//     const [results, setResults] = useState([]);
//
//     useEffect(() => {
//         if (showMobileFilter) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "auto";
//         }
//         return () => {
//             document.body.style.overflow = "auto";
//         };
//     }, [showMobileFilter]);
//
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);
//
//     const toggleMobileFilter = () => {
//         setShowMobileFilter(!showMobileFilter);
//     };
//
//     useEffect(() => {
//         const getInitialProducts = async () => {
//             if (id === "14") {
//                 try {
//                     const response = await axiosInstance.get(
//                         `/product/offerProducts/`
//                     );
//                     if (response.status === 200) {
//                         setResults(response.data.products || []);
//                         setProducts(response.data || {});
//                     }
//                 } catch (error) {
//                     console.error("Error fetching offer products:", error);
//                 }
//                 return;
//             }
//
//             try {
//                 let queryParams = new URLSearchParams();
//
//                 if (typeKey) {
//                     queryParams.append("type", typeKey);
//                 }
//
//                 if (categoryId || id) {
//                     queryParams.append("category_id", categoryId || id);
//                 }
//
//                 if (subcategoryID) {
//                     queryParams.append("subcategory_id", subcategoryID);
//                 }
//
//                 const response = await axiosInstance.get(
//                     `/filters/productsFilter/?${queryParams.toString()}`
//                 );
//
//                 if (response.status === 200) {
//                     setResults(response.data.results || []);
//                     setProducts({
//                         count: response.data.count,
//                         next: response.data.next,
//                         previous: response.data.previous,
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching products via filter API:", error);
//             }
//         };
//
//         if (path.startsWith("/filter/")) {
//             getInitialProducts();
//         }
//     }, [id, path, typeKey, categoryId, subcategoryID]);
//
//     // *** ADD THIS: Update products state when results change ***
//     useEffect(() => {
//         console.log("Results updated:", results.length);
//         // Force re-render of ProductGrid when results change
//     }, [results]);
//
//     return (
//         <>
//             <Helmet>
//                 <title>Gidan - Plant Filter</title>
//             </Helmet>
//             <div className="container mx-auto bg-gray-100 pt-1">
//                 <br />
//                 <div className="flex md:hidden justify-between items-center">
//                     <button
//                         className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
//                         onClick={toggleMobileFilter}
//                     >
//                         <FiFilter size={20} />
//                         Filter
//                     </button>
//                 </div>
//                 <div className="flex flex-row md:flex-row px-4">
//                     <div className="hidden md:block">
//                         <FilterSidebar
//                             setResults={setResults}
//                             categoryId={categoryId || id}
//                             category={categoryName}
//                             subcategory={subCategoryName}
//                             subcategoryID={subcategoryID}
//                             typeKey={typeKey}
//                         />
//                     </div>
//                     <div className="flex-1">
//                         {/* *** KEY FIX: Add key prop to force re-render *** */}
//                         <ProductGrid
//                             key={results.length} // Forces re-render when results length changes
//                             productDetails={results}
//                             pagination={products}
//                             setResults={setResults}
//                             categoryName={categoryName}
//                             typeKey={typeKey}
//                         />
//                     </div>
//                 </div>
//                 <RecentlyViewedProduct />
//                 <div className="md:ml-16 overflow-x-hidden md:mr-12">
//                     <FAQSection />
//                     <CheckoutStores />
//                 </div>
//                 {showMobileFilter && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//                             <button
//                                 className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
//                                 onClick={toggleMobileFilter}
//                             >
//                                 ✕
//                             </button>
//                             <FilterSidebar
//                                 setResults={setResults}
//                                 setShowMobileFilter={setShowMobileFilter}
//                                 categoryId={categoryId || id}
//                                 category={categoryName}
//                                 subcategory={subCategoryName}
//                                 subcategoryID={subcategoryID}
//                                 typeKey={typeKey}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }
//
// export default PlantFilter;
// // //<editor-fold desc="above working">
// // // PlantFilter.js - Modified to use a single, unified filter API
// //
// // import React, { useEffect, useState } from "react";
// // import FilterSidebar from "../Featured/FilterSidebar";
// // import ProductGrid from "./ProductGrid";
// // import FAQSection from "./FAQSection";
// // import RecentlyViewedProduct from "./RecentlyViewedProduct";
// // import CheckoutStores from "./CheckoutStores";
// // import { FiFilter } from "react-icons/fi";
// // import { useLocation } from "react-router-dom";
// // import { useParams } from "react-router-dom";
// // import { Helmet } from "react-helmet";
// // import axiosInstance from "../../../Axios/axiosInstance";
// //
// // function PlantFilter() {
// //     const { id } = useParams();
// //     const location = useLocation();
// //     const path = location.pathname;
// //
// //     // Get state data passed from navigation
// //     const stateData = location.state || {};
// //     const { categoryId, categoryName, typeKey, subCategory, subcategoryID } = stateData;
// //     const { name: subCategoryName } = subCategory || {};
// //
// //     const [showMobileFilter, setShowMobileFilter] = useState(false);
// //     const [products, setProducts] = useState({}); // For pagination data
// //     const [results, setResults] = useState([]);   // For product list
// //
// //     useEffect(() => {
// //         if (showMobileFilter) {
// //             document.body.style.overflow = "hidden";
// //         } else {
// //             document.body.style.overflow = "auto";
// //         }
// //         return () => {
// //             document.body.style.overflow = "auto";
// //         };
// //     }, [showMobileFilter]);
// //
// //     useEffect(() => {
// //         window.scrollTo(0, 0);
// //     }, []);
// //
// //     const toggleMobileFilter = () => {
// //         setShowMobileFilter(!showMobileFilter);
// //     };
// //
// //     useEffect(() => {
// //         const getInitialProducts = async () => {
// //             // Special case for offers, as it might not be part of the main filter API
// //             if (id === "14") {
// //                 try {
// //                     const response = await axiosInstance.get(
// //                         `${process.env.REACT_APP_API_URL}/product/offerProducts/`
// //                     );
// //                     if (response.status === 200) {
// //                         setResults(response.data.products || []);
// //                         setProducts(response.data || {});
// //                     }
// //                 } catch (error) {
// //                     console.error("Error fetching offer products:", error);
// //                 }
// //                 return;
// //             }
// //
// //             // Use the unified filter API for all other categories and subcategories
// //             try {
// //                 let queryParams = new URLSearchParams();
// //
// //                 // Add type, which is crucial for the filter API
// //                 if (typeKey) {
// //                     queryParams.append("type", typeKey);
// //                 }
// //
// //                 // Add category ID from state or URL params
// //                 if (categoryId || id) {
// //                     queryParams.append("category_id", categoryId || id);
// //                 }
// //
// //                 // Add subcategory ID if it exists
// //                 if (subcategoryID) {
// //                     queryParams.append("subcategory_id", subcategoryID);
// //                 }
// //
// //                 const response = await axiosInstance.get(
// //                     `${process.env.REACT_APP_API_URL}/filters/productsFilter/?${queryParams.toString()}`
// //                 );
// //
// //                 if (response.status === 200) {
// //                     // The filter API returns data in a 'results' array
// //                     setResults(response.data.results || []);
// //                     // Set pagination data from the response
// //                     setProducts({
// //                         count: response.data.count,
// //                         next: response.data.next,
// //                         previous: response.data.previous,
// //                     });
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching products via filter API:", error);
// //             }
// //         };
// //
// //         // Call the unified function for all paths
// //         if (path.startsWith("/filter/")) {
// //             getInitialProducts();
// //         }
// //     }, [id, path, typeKey, categoryId, subcategoryID]); // Dependencies to refetch on change
// //
// //     return (
// //         <>
// //             <Helmet>
// //                 <title>Gidan - Plant Filter</title>
// //             </Helmet>
// //             <div className="container mx-auto bg-gray-100 pt-1">
// //                 <br />
// //                 {/* Mobile View Button */}
// //                 <div className="flex md:hidden justify-between items-center">
// //                     <button
// //                         className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
// //                         onClick={toggleMobileFilter}
// //                     >
// //                         <FiFilter size={20} />
// //                         Filter
// //                     </button>
// //                 </div>
// //                 <div className="flex flex-row md:flex-row px-4">
// //                     {/* Filter Sidebar */}
// //                     <div className="hidden md:block">
// //                         <FilterSidebar
// //                             setResults={setResults}
// //                             categoryId={categoryId || id}
// //                             category={categoryName}
// //                             subcategory={subCategoryName}
// //                             subcategoryID={subcategoryID}
// //                             typeKey={typeKey}
// //                         />
// //                     </div>
// //                     <div className="flex-1">
// //                         {/* Product Grid */}
// //                         <ProductGrid
// //                             productDetails={results}
// //                             pagination={products}
// //                             setResults={setResults}
// //                             categoryName={categoryName}
// //                             typeKey={typeKey}
// //                         />
// //                     </div>
// //                 </div>
// //                 <RecentlyViewedProduct />
// //                 {/* FAQ Section */}
// //                 <div className="md:ml-16 overflow-x-hidden md:mr-12">
// //                     <FAQSection />
// //                     <CheckoutStores />
// //                 </div>
// //                 {/* Mobile Filter Sidebar */}
// //                 {showMobileFilter && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
// //                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
// //                             <button
// //                                 className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
// //                                 onClick={toggleMobileFilter}
// //                             >
// //                                 ✕
// //                             </button>
// //                             <FilterSidebar
// //                                 setResults={setResults}
// //                                 setShowMobileFilter={setShowMobileFilter}
// //                                 categoryId={categoryId || id}
// //                                 category={categoryName}
// //                                 subcategory={subCategoryName}
// //                                 subcategoryID={subcategoryID}
// //                                 typeKey={typeKey}
// //                             />
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // }
// //
// // export default PlantFilter;
// // //</editor-fold>
// // ===================================================
// // // PlantFilter.js - Modified to use state data
// //
// // import React, { useEffect, useState } from "react";
// // import FilterSidebar from "../Featured/FilterSidebar";
// // import ProductGrid from "./ProductGrid";
// // import FAQSection from "./FAQSection";
// // import RecentlyViewedProduct from "./RecentlyViewedProduct";
// // import CheckoutStores from "./CheckoutStores";
// // import { FiFilter } from "react-icons/fi";
// // import { useLocation } from "react-router-dom";
// // import { useParams } from "react-router-dom";
// // import {Helmet} from "react-helmet";
// // import axiosInstance from "../../../Axios/axiosInstance";
// //
// // function PlantFilter() {
// //     const { id } = useParams();
// //     const location = useLocation();
// //     const path = location.pathname;
// //
// //     // Get state data passed from navigation
// //     const stateData = location.state || {};
// //     const {  categoryId,categoryName, typeKey, subCategory,subcategoryID } = stateData;
// //     const {name: subCategoryName,} = subCategory || {};
// //     // console.log(subCategoryName); // "Hand Tools"
// //     // console.log('ID from URL params:', id);
// //     console.log('ID from state categoryId:', categoryId);
// //     // console.log('Category name from state:', categoryName);
// //     // console.log('Type key from state:', typeKey);
// //     // console.log('Subcategory from state:', subCategory);
// //     //
// //     // console.log('Subcategory from state subcategoryID:', subcategoryID);
// //
// //     const [showMobileFilter, setShowMobileFilter] = useState(false);
// //     const [products, setProducts] = useState([]);
// //     const [results, setResults] = useState([]);
// //
// //     useEffect(() => {
// //         if (showMobileFilter) {
// //             document.body.style.overflow = "hidden";
// //         } else {
// //             document.body.style.overflow = "auto";
// //         }
// //         return () => {
// //             document.body.style.overflow = "auto";
// //         };
// //     }, [showMobileFilter]);
// //
// //     useEffect(() => {
// //         window.scrollTo(0, 0);
// //     }, []);
// //
// //     const toggleMobileFilter = () => {
// //         setShowMobileFilter(!showMobileFilter);
// //     };
// //
// //     useEffect(() => {
// //         const getCategoryProducts = async () => {
// //             try {
// //                 if (id === "14") {
// //                     // Special case for offers
// //                     const response = await axiosInstance.get(
// //                         `${process.env.REACT_APP_API_URL}/product/offerProducts/`
// //                     );
// //                     if (response.status === 200) {
// //                         setResults(response.data.products || []);
// //                         setProducts(response.data || {});
// //                     }
// //                     return;
// //                 }
// //                 const response = await axiosInstance.get(
// //                     `${process.env.REACT_APP_API_URL}/product/category-products/${id}/`
// //                 );
// //                 if (response.data.message === "success") {
// //                     setResults(response.data.products || []);
// //                     setProducts(response.data || {});
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching category products:", error);
// //             }
// //         };
// //
// //         const getSubCategorywiseProduct = async () => {
// //             try {
// //                 const response = await axiosInstance.get(
// //                     `${process.env.REACT_APP_API_URL}/product/subcategory-products/${subcategoryID}/`
// //                 );
// //                 if (response.status === 200) {
// //                     setResults(response.data.products || []);
// //                     setProducts(response.data || {});
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching subcategory products:", error);
// //             }
// //         };
// //
// //         if (path.startsWith("/filter/subcategory/")) {
// //             getSubCategorywiseProduct();
// //         } else if (path.startsWith("/filter/")) {
// //             getCategoryProducts();
// //         }
// //     }, [id, path]);
// //
// //     return (
// //         <>
// //             <Helmet>
// //                 <title>Gidan - Plant Filter</title>
// //             </Helmet>
// //             <div className="container mx-auto bg-gray-100 pt-1">
// //                 <br />
// //                 {/* Mobile View Button */}
// //                 <div className="flex md:hidden justify-between items-center">
// //                     <button
// //                         className="bg-white text-black w-full rounded-md flex items-center justify-center gap-2 my-2 p-2"
// //                         onClick={toggleMobileFilter}
// //                     >
// //                         <FiFilter size={20} />
// //                         Filter
// //                     </button>
// //                 </div>
// //                 <div className="flex flex-row md:flex-row px-4">
// //                     {/* Filter Sidebar */}
// //                     <div className="hidden md:block">
// //                         <FilterSidebar
// //                             setResults={setResults}
// //                             categoryId={id}
// //                             category={categoryName } // Use categoryName from state if available
// //                             subcategory={subCategoryName}
// //                             typeKey={typeKey} // Pass typeKey to FilterSidebar
// //                         />
// //                     </div>
// //                     <div className="flex-1">
// //                         {/* Product Grid */}
// //                         <ProductGrid
// //                             productDetails={results}
// //                             pagination={products}
// //                             setResults={setResults}
// //                             categoryName={categoryName} // Pass categoryName to ProductGrid
// //                             typeKey={typeKey} // Pass typeKey to ProductGrid
// //                         />
// //                     </div>
// //                 </div>
// //                 <RecentlyViewedProduct />
// //                 {/* FAQ Section */}
// //                 <div className="md:ml-16 overflow-x-hidden md:mr-12">
// //                     <FAQSection />
// //                     <CheckoutStores />
// //                 </div>
// //                 {/* Mobile Filter Sidebar */}
// //                 {showMobileFilter && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
// //                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
// //                             <button
// //                                 className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2"
// //                                 onClick={toggleMobileFilter}
// //                             >
// //                                 ✕
// //                             </button>
// //                             <FilterSidebar
// //                                 setResults={setResults}
// //                                 setShowMobileFilter={setShowMobileFilter}
// //                                 categoryId={id}
// //                                 category={categoryName} // Use categoryName from state if available
// //                                 subcategory={subCategoryName}
// //                                 typeKey={typeKey} // Pass typeKey to FilterSidebar
// //                             />
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // }
// //
// // export default PlantFilter;
