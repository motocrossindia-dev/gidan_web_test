import React, { useEffect, useState } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "./ProductGrid";
import FAQSection from "./FAQSection";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../Axios/axiosInstance";
import RecentlyViewedProduct from "./RecentlyViewedProduct";
import { Helmet } from "react-helmet-async";
import GenericPage from "../Info/GenericPage";
import SubCategorySchema from "../seo/SubCategorySchema";
import CategorySchema from "../seo/CategorySchema";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";

const CategoryLayout = ({ data }) => {
    // ✅ 4. FIX LOGIC: Check if data exists and has content (hero/sections)
    // instead of checking for an ID.
    const hasGenericContent = data && data.hero;
    console.log(hasGenericContent, '--------------------------------hhh');

    return (
        <div className="space-y-12">
            <>
                <RecentlyViewedProduct />
                {/* 2. Show FAQ ONLY if NO generic content is found (The conditional one) */}
                {!hasGenericContent && <FAQSection />}
                {/* Show GenericPage ONLY if we have the valid JSON content */}
                {hasGenericContent && <GenericPage data={data} />}

                <CheckoutStores />
            </>
        </div>
    );
};

function PlantFilter() {
    const location = useLocation();
    const path = location.pathname;

    const stateData = location.state || {};
    const { categoryId, categoryName, typeKey, subCategory, subcategoryID, category_slug } = stateData;
    const { name: subCategoryName, subcategory_slug } = subCategory || {};

    // NEW: State to track the currently selected Type from the Sidebar
    const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);

    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [products, setProducts] = useState({});
    const [results, setResults] = useState([]);
    const [categoryData, setCategoryData] = useState(null);

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
            if (categoryId === "14") {
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

                if (categoryId) {
                    queryParams.append("category_id", categoryId);
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
                    setCategoryData(response.data?.category_info?.category_info || null);
                }
            } catch (error) {
                console.error("Error fetching products via filter API:", error);
            }
        };

        if (path.startsWith("/category/")) {
            getInitialProducts();
        }
    }, [path, typeKey, categoryId, subcategoryID]);

    // LOGIC to determine the base name for Helmet tags
    // Priority: 1. Selected Filter Type (e.g. 'Pots'), 2. Subcategory Name, 3. Category Name
    const getDisplayName = () => {
        if (currentFilterType) return currentFilterType;
        if (subCategoryName) return subCategoryName;
        return categoryName || "Gardening Products";
    };

    const displayName = getDisplayName();

    return (
        <>
            <Helmet>
                {/* DYNAMIC TITLE & META LOGIC */}
                <title>
                    {displayName
                        ? `Buy ${displayName} Online | Best Price in Bengaluru – Gidan`
                        : 'Buy Gardening Products Online | Best Price in Bengaluru – Gidan'}
                </title>

                <meta
                    name="description"
                    content={
                        displayName
                            ? `Shop ${displayName} online at best prices. Wide range of premium varieties and styles. Fast delivery & easy returns – Gidan.`
                            : 'Shop gardening products online at best prices. Wide range of plants, pots, seeds, and accessories. Fast delivery & easy returns – Gidan.'
                    }
                />

                {/* Canonical logic handles both subcategory and main category */}
                <link
                    rel="canonical"
                    href={
                        subCategoryName
                            ? `https://gidan.store/category/${category_slug}?subcategory=${subcategory_slug}`
                            : `https://gidan.store/category/${category_slug}`
                    }
                />
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
                        categoryId={categoryId}
                        category={categoryName}
                        subcategory={subCategoryName}
                        subcategoryID={subcategoryID}
                        typeKey={typeKey}
                        setCategoryData={setCategoryData}
                        // PASS THIS PROP TO UPDATE TITLE ON FILTER CHANGE
                        setCurrentFilterType={setCurrentFilterType}
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

                {/* Additional Sections - Fixed with proper spacing */}
                <div className="mt-12 mb-8">
                    <div className="container mx-auto px-4 md:px-8">
                        <CategoryLayout data={categoryData} />
                    </div>
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
                                    categoryId={categoryId}
                                    category={categoryName}
                                    subcategory={subCategoryName}
                                    subcategoryID={subcategoryID}
                                    typeKey={typeKey}
                                    setCategoryData={setCategoryData}
                                    // PASS THIS PROP TO UPDATE TITLE ON FILTER CHANGE (MOBILE)
                                    setCurrentFilterType={setCurrentFilterType}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CategorySchema
                categoryName={categoryName}
                categorySlug={category_slug}
                items={results || []}
            />
            <SubCategorySchema
                categoryName={categoryName}
                subCategoryName={subCategoryName}
                categorySlug={category_slug}
                subCategorySlug={subcategory_slug}
                items={results || []}
            />
            <HomepageSchema/>
            <StoreSchema/>
        </>
    );
}

export default PlantFilter;
// import React, { useEffect, useState } from "react";
// import FilterSidebar from "../Featured/FilterSidebar";
// import ProductGrid from "./ProductGrid";
// import FAQSection from "./FAQSection";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import { useLocation } from "react-router-dom";
// import axiosInstance from "../../../Axios/axiosInstance";
// import RecentlyViewedProduct from "./RecentlyViewedProduct";
// import { Helmet } from "react-helmet-async";
// import GenericPage from "../Info/GenericPage";
//
//
// const CategoryLayout = ({ data }) => {
//     // ✅ 4. FIX LOGIC: Check if data exists and has content (hero/sections)
//     // instead of checking for an ID.
//     const hasGenericContent = data && data.hero;
//     console.log(hasGenericContent,'--------------------------------hhh');
//
//     return (
//         <div className="space-y-12">
//
//             <>
//                 <RecentlyViewedProduct />
//                 {/* 2. Show FAQ ONLY if NO generic content is found (The conditional one) */}
//                 {!hasGenericContent && <FAQSection />}
//                 {/* Show GenericPage ONLY if we have the valid JSON content */}
//                 {hasGenericContent && <GenericPage data={data} />}
//
//                 <CheckoutStores />
//             </>
//         </div>
//     );
// };
//
// function PlantFilter() {
//     const location = useLocation();
//     const path = location.pathname;
//
//     const stateData = location.state || {};
//     const { categoryId, categoryName, typeKey, subCategory, subcategoryID ,category_slug,} = stateData;
//     const { name: subCategoryName ,subcategory_slug} = subCategory || {};
//
//     // New state to track the Type selected in the FilterSidebar
//     const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);
//
//     const [showMobileFilter, setShowMobileFilter] = useState(false);
//     const [products, setProducts] = useState({});
//     const [results, setResults] = useState([]);
//
//
//     const [categoryData, setCategoryData] = useState(null);
//
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
//             if (categoryId === "14") {
//                 try {
//                     const response = await axiosInstance.get(
//                         `/product/offerProducts/`
//                     );
//                     if (response.status === 200) {
//                         setResults(response.data.products || []);
//                         setProducts(response.data || {});
//
//                     }
//
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
//                 if (categoryId) {
//                     queryParams.append("category_id", categoryId);
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
//                     setCategoryData(response.data?.category_info?.category_info || null);
//                 }
//             } catch (error) {
//                 console.error("Error fetching products via filter API:", error);
//             }
//         };
//
//         if (path.startsWith("/category/")) {
//             getInitialProducts();
//         }
//     }, [ path, typeKey, categoryId, subcategoryID]);
//
//
//     // Determine the base name for the Title
//     // Priority: 1. Selected Filter Type, 2. Subcategory, 3. Category
//     const getBaseName = () => {
//         if (currentFilterType) return currentFilterType;
//         if (subCategoryName) return subCategoryName;
//         return categoryName || "Gardening Products";
//     };
//
//     const baseName = getBaseName();
//
//     return (
//         <>
//             <Helmet>
//                 {/* SUB-CATEGORY META */}
//                 {subCategoryName ? (
//                     <>
//                         <title>
//                             {`${subCategoryName} for Home & Garden | Gidan`}
//                         </title>
//
//                         <meta
//                             name="description"
//                             content={`Explore ${subCategoryName} at Gidan. Perfect for home gardeners and plant lovers. Affordable prices & fast delivery.`}
//                         />
//
//                         <link
//                             rel="canonical"
//                             href={`https://gidan.store/category/${category_slug}?subcategory=${subcategory_slug}`}
//                         />
//                     </>
//                 ) : (
//                     /* CATEGORY META */
//                     <>
//                         <title>
//                             {categoryName
//                                 ? `Buy ${categoryName} Online | Best Price in Bengaluru – Gidan`
//                                 : 'Buy Gardening Products Online | Best Price in Bengaluru – Gidan'}
//                         </title>
//
//                         <meta
//                             name="description"
//                             content={
//                                 categoryName
//                                     ? `Shop ${categoryName} online at best prices. Wide range of premium varieties and styles. Fast delivery & easy returns – Gidan.`
//                                     : 'Shop gardening products online at best prices. Wide range of plants, pots, seeds, and accessories. Fast delivery & easy returns – Gidan.'
//                             }
//                         />
//
//                         <link
//                             rel="canonical"
//                             href={`https://gidan.store/category/${category_slug}`}
//                         />
//                     </>
//                 )}
//             </Helmet>
//
//
//
//             <div className="container mx-auto min-h-screen">
//                 {/* Mobile Filter Button */}
//                 <div className="md:hidden px-4 pt-4">
//                     <button
//                         className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow"
//                         onClick={toggleMobileFilter}
//                     >
//                         <FiFilter size={20} />
//                         <span className="font-medium">Filters</span>
//                     </button>
//                 </div>
//
//                 {/* Desktop Horizontal Filter - Full Width */}
//                 <div className="hidden md:block mt-4 overflow-visible relative z-10">
//                     <FilterSidebar
//                         setResults={setResults}
//                         categoryId={categoryId}
//                         category={categoryName}
//                         subcategory={subCategoryName}
//                         subcategoryID={subcategoryID}
//                         typeKey={typeKey}
//                         setCategoryData={setCategoryData}
//                     />
//                 </div>
//
//                 {/* Product Grid */}
//                 <div className="px-4 mt-4">
//                     <ProductGrid
//                         productDetails={results}
//                         pagination={products}
//                         setResults={setResults}
//                         categoryName={categoryName}
//                         typeKey={typeKey}
//                     />
//                 </div>
//
//                 {/* Additional Sections - Fixed with proper spacing */}
//                 <div className="mt-12 mb-8">
//                     <div className="container mx-auto px-4 md:px-8">
//                         <CategoryLayout data={categoryData}/>
//                     </div>
//                 </div>
//
//                 {/* Mobile Filter Sidebar Overlay */}
//                 {showMobileFilter && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
//                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//                             {/* Close Button */}
//                             <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
//                                 <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//                                 <button
//                                     className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
//                                     onClick={toggleMobileFilter}
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//
//                             {/* Mobile Filter Content */}
//                             <div className="p-4">
//                                 <FilterSidebar
//                                     setResults={setResults}
//                                     setShowMobileFilter={setShowMobileFilter}
//                                     categoryId={categoryId}
//                                     category={categoryName}
//                                     subcategory={subCategoryName}
//                                     subcategoryID={subcategoryID}
//                                     typeKey={typeKey}
//                                     setCategoryData={setCategoryData}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }
//
// export default PlantFilter;