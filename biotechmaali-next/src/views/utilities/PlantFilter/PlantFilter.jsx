'use client';

import React, { useEffect, useState } from "react";
// Material UI imports
import { SwipeableDrawer, IconButton, Box, Typography } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import { Close as CloseIcon } from "@mui/icons-material";

import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import FAQSection from "./FAQSection";
import CheckoutStores from "./CheckoutStores";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../Axios/axiosInstance";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import { Helmet } from "react-helmet-async";
import GenericPage from "../Info/GenericPage";
import SubCategorySchema from "../seo/SubCategorySchema";
import CategorySchema from "../seo/CategorySchema";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import Breadcrumb from "../../../components/Shared/Breadcrumb";

const CategoryLayout = ({ data }) => {
    const hasGenericContent = data && data.hero;

    return (
        <div className="space-y-12">
            <>
                <RecentlyViewedProducts />
                {!hasGenericContent && <FAQSection />}
                {hasGenericContent && <GenericPage data={data} />}
                <CheckoutStores />
            </>
        </div>
    );
};

function PlantFilter() {
    const location = useLocation();
    const path = location.pathname;

    // Extract slugs from URL
    const { categorySlug, subcategorySlug } = useParams();

    // Detect filter type based on route path
    const routeBasedFilters = {
        isSeasonalCollection: path === '/seasonal' || path === '/seasonal/',
        isTrending: path === '/trending' || path === '/trending/' || path === '/latest' || path === '/latest/',
        isFeatured: path === '/featured' || path === '/featured/',
        isBestSeller: path === '/bestseller' || path === '/bestseller/'
    };

    // Extract query parameters for boolean filters (fallback)
    const searchParams = new URLSearchParams(location.search);
    const queryIsSeasonalCollection = searchParams.get('is_seasonal_collection') === 'true';
    const queryIsTrending = searchParams.get('is_trending') === 'true';
    const queryIsFeatured = searchParams.get('is_featured') === 'true';
    const queryIsBestSeller = searchParams.get('is_best_seller') === 'true';

    // Combine route-based and query-based filters (route takes precedence)
    const isSeasonalCollection = routeBasedFilters.isSeasonalCollection || queryIsSeasonalCollection;
    const isTrending = routeBasedFilters.isTrending || queryIsTrending;
    const isFeatured = routeBasedFilters.isFeatured || queryIsFeatured;
    const isBestSeller = routeBasedFilters.isBestSeller || queryIsBestSeller;

    // Use location.state as primary data source (keep existing logic)
    const stateData = location.state || {};
    const { categoryId, categoryName, typeKey, subCategory, subcategoryID, category_slug } = stateData;
    const { name: subCategoryName, subcategory_slug } = subCategory || {};

    // State to store fetched category/subcategory names when navigating via URL
    const [fetchedCategoryName, setFetchedCategoryName] = useState(null);
    const [fetchedSubcategoryName, setFetchedSubcategoryName] = useState(null);

    // State to track the currently selected Type from the Sidebar
    const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);

    // State for SwipeableDrawer
    const [mobileOpen, setMobileOpen] = useState(false);

    const [products, setProducts] = useState({});
    const [results, setResults] = useState([]);
    const [categoryData, setCategoryData] = useState(null);

    // iOS Swipeable Drawer patch to prevent body bounce
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Handle drawer toggle
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setMobileOpen(open);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                } catch (error) {}
                return;
            }

            try {
                let queryParams = new URLSearchParams();

                if (typeKey) {
                    queryParams.append("type", typeKey);
                }

                // Priority: Use IDs from state if available, otherwise use slugs from URL
                if (categoryId) {
                    queryParams.append("category_id", categoryId);
                } else if (categorySlug) {
                    queryParams.append("category_slug", categorySlug);
                }

                if (subcategoryID) {
                    queryParams.append("subcategory_id", subcategoryID);
                } else if (subcategorySlug) {
                    queryParams.append("subcategory_slug", subcategorySlug);
                }

                // Add boolean filter flags
                if (isSeasonalCollection) queryParams.append("is_seasonal_collection", "true");
                if (isTrending) queryParams.append("is_trending", "true");
                if (isFeatured) queryParams.append("is_featured", "true");
                if (isBestSeller) queryParams.append("is_best_seller", "true");

                // Only make API call if we have at least category info or boolean filters
                if (queryParams.toString()) {
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

                        // Update fetched names from API response if not in state
                        if (!categoryName && response.data?.category_info?.category_info?.category_name) {
                            setFetchedCategoryName(response.data.category_info.category_info.category_name);
                        }
                        if (!subCategoryName && response.data?.category_info?.category_info?.subcategory_name) {
                            setFetchedSubcategoryName(response.data.category_info.category_info.subcategory_name);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Trigger product fetch when URL params exist (either from state or URL) or boolean filters are present
        if (categoryId || categorySlug || path.startsWith("/category/") || isSeasonalCollection || isTrending || isFeatured || isBestSeller) {
            getInitialProducts();
        }
    }, [path, typeKey, categoryId, subcategoryID, categorySlug, subcategorySlug, isSeasonalCollection, isTrending, isFeatured, isBestSeller]);

    // Determine the base name for Helmet tags
    const getDisplayName = () => {
        if (isSeasonalCollection) return "Seasonal Collections";
        if (isTrending) return "Trending Products";
        if (isFeatured) return "Featured Products";
        if (isBestSeller) return "Best Sellers";
        if (currentFilterType) return currentFilterType;
        if (subCategoryName) return subCategoryName;
        if (fetchedSubcategoryName) return fetchedSubcategoryName;
        if (categoryName) return categoryName;
        if (fetchedCategoryName) return fetchedCategoryName;
        return "Gardening Products";
    };

    const displayName = getDisplayName();

    // Use URL params for canonical, fallback to state slugs
    const canonicalCategorySlug = categorySlug || category_slug;
    const canonicalSubcategorySlug = subcategorySlug || subcategory_slug;

    return (
        <>
            <Helmet>
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

                <link
                    rel="canonical"
                    href={
                        canonicalSubcategorySlug
                            ? `https://gidan.store/${canonicalCategorySlug}/${canonicalSubcategorySlug}/`
                            : `https://gidan.store/${canonicalCategorySlug}/`
                    }
                />
            </Helmet>

            {/* Breadcrumb Navigation */}
            {(canonicalCategorySlug || canonicalSubcategorySlug) && (
                <Breadcrumb
                    items={
                        canonicalSubcategorySlug
                            ? [
                                {
                                    label: categoryName || fetchedCategoryName || canonicalCategorySlug,
                                    path: `/${canonicalCategorySlug}/`
                                }
                            ]
                            : []
                    }
                    currentPage={
                        canonicalSubcategorySlug
                            ? (subCategoryName || fetchedSubcategoryName || canonicalSubcategorySlug)
                            : (categoryName || fetchedCategoryName || canonicalCategorySlug)
                    }
                />
            )}

            <div className="w-full overflow-x-hidden">
                <div className="container mx-auto px-4 md:px-8 max-w-full">
                    {/* Mobile Filter Button - Triggers SwipeableDrawer */}
                    <div className="md:hidden pt-4 sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm py-2 border-b border-gray-200">
                        <button
                            onClick={toggleDrawer(true)}
                            className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                        >
                            <FiFilter size={20} />
                            <span className="font-medium">Filter Products</span>
                        </button>
                    </div>

                    {/* Desktop Horizontal Filter - Full Width */}
                    <div className="hidden md:block mt-4 overflow-visible relative z-10">
                        <FilterSidebar
                            setResults={setResults}
                            categoryId={categoryId}
                            category={categoryName || fetchedCategoryName}
                            subcategory={subCategoryName || fetchedSubcategoryName}
                            subcategoryID={subcategoryID}
                            subcategorySlug={subcategorySlug}
                            categorySlug={categorySlug}
                            typeKey={typeKey}
                            setCategoryData={setCategoryData}
                            setCurrentFilterType={setCurrentFilterType}
                            isSeasonalCollection={isSeasonalCollection}
                            isTrending={isTrending}
                            isFeatured={isFeatured}
                            isBestSeller={isBestSeller}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="mt-4">
                        <ProductGrid
                            productDetails={results}
                            pagination={products}
                            setResults={setResults}
                            categoryName={categoryName || fetchedCategoryName}
                            typeKey={typeKey}
                            categorySlug={category_slug || categorySlug}
                            subcategorySlug={subcategory_slug || subcategorySlug}
                            hasSubcategory={!!subcategoryID}
                        />
                    </div>

                    {/* Additional Sections */}
                    <div className="mt-12 mb-8">
                        <CategoryLayout data={categoryData} />
                    </div>
                </div>
            </div>

            {/* MUI Swipeable Drawer for Mobile */}
            <SwipeableDrawer
                anchor="right"
                open={mobileOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: '85%',
                        maxWidth: '350px'
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Filters
                    </Typography>
                    <IconButton onClick={toggleDrawer(false)} sx={{ color: '#4b5563' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                    <FilterSidebar
                        setResults={setResults}
                        setShowMobileFilter={setMobileOpen} // Pass state setter to auto-close drawer on apply
                        categoryId={categoryId}
                        category={categoryName || fetchedCategoryName}
                        subcategory={subCategoryName || fetchedSubcategoryName}
                        subcategoryID={subcategoryID}
                        subcategorySlug={subcategorySlug}
                        categorySlug={categorySlug}
                        typeKey={typeKey}
                        setCategoryData={setCategoryData}
                        setCurrentFilterType={setCurrentFilterType}
                        isSeasonalCollection={isSeasonalCollection}
                        isTrending={isTrending}
                        isFeatured={isFeatured}
                        isBestSeller={isBestSeller}
                    />
                </Box>
            </SwipeableDrawer>

            <CategorySchema
                categoryName={categoryName || fetchedCategoryName}
                categorySlug={canonicalCategorySlug}
                items={results || []}
            />
            <SubCategorySchema
                category={{
                    name: categoryName || fetchedCategoryName,
                    slug: canonicalCategorySlug
                }}
                subCategory={
                    canonicalSubcategorySlug ? {
                        name: subCategoryName || fetchedSubcategoryName,
                        slug: canonicalSubcategorySlug
                    } : null
                }
                items={results || []}
            />
            <HomepageSchema/>
            <StoreSchema/>
        </>
    );
}

export default PlantFilter;
// =====================muisidebar=============
// import { useEffect, useState } from "react";
// import FilterSidebar from "../Featured/FilterSidebar";
// import ProductGrid from "./ProductGrid";
// import FAQSection from "./FAQSection";
// import CheckoutStores from "./CheckoutStores";
// import { FiFilter } from "react-icons/fi";
// import { useLocation, useParams } from "react-router-dom";
// import axiosInstance from "../../../Axios/axiosInstance";
// import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
// import { Helmet } from "react-helmet-async";
// import GenericPage from "../Info/GenericPage";
// import SubCategorySchema from "../seo/SubCategorySchema";
// import CategorySchema from "../seo/CategorySchema";
// import HomepageSchema from "../seo/HomepageSchema";
// import StoreSchema from "../seo/StoreSchema";
//
// const CategoryLayout = ({ data }) => {
//     const hasGenericContent = data && data.hero;
//
//     return (
//         <div className="space-y-12">
//             <>
//                 <RecentlyViewedProducts />
//                 {!hasGenericContent && <FAQSection />}
//                 {hasGenericContent && <GenericPage data={data} />}
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
//     // Extract slugs from URL
//     const { categorySlug, subcategorySlug } = useParams();
//
//     // Use location.state as primary data source (keep existing logic)
//     const stateData = location.state || {};
//     const { categoryId, categoryName, typeKey, subCategory, subcategoryID, category_slug } = stateData;
//     const { name: subCategoryName, subcategory_slug } = subCategory || {};
//
//     // State to store fetched category/subcategory names when navigating via URL
//     const [fetchedCategoryName, setFetchedCategoryName] = useState(null);
//     const [fetchedSubcategoryName, setFetchedSubcategoryName] = useState(null);
//
//     // State to track the currently selected Type from the Sidebar
//     const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);
//
//     const [showMobileFilter, setShowMobileFilter] = useState(false);
//     const [products, setProducts] = useState({});
//     const [results, setResults] = useState([]);
//     const [categoryData, setCategoryData] = useState(null);
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
//                     }
//                 } catch (error) {}
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
//                 // Priority: Use IDs from state if available, otherwise use slugs from URL
//                 if (categoryId) {
//                     queryParams.append("category_id", categoryId);
//                 } else if (categorySlug) {
//                     // Try using slug - backend should support this
//                     queryParams.append("category_slug", categorySlug);
//                 }
//
//                 if (subcategoryID) {
//                     queryParams.append("subcategory_id", subcategoryID);
//                 } else if (subcategorySlug) {
//                     // Try using slug - backend should support this
//                     queryParams.append("subcategory_slug", subcategorySlug);
//                 }
//
//                 // Only make API call if we have at least category info
//                 if (queryParams.toString()) {
//                     const response = await axiosInstance.get(
//                         `/filters/main_productsFilter/?${queryParams.toString()}`
//                     );
//
//                     if (response.status === 200) {
//                         setResults(response.data.results || []);
//                         setProducts({
//                             count: response.data.count,
//                             next: response.data.next,
//                             previous: response.data.previous,
//                         });
//                         setCategoryData(response.data?.category_info?.category_info || null);
//
//                         // Update fetched names from API response if not in state
//                         if (!categoryName && response.data?.category_info?.category_info?.category_name) {
//                             setFetchedCategoryName(response.data.category_info.category_info.category_name);
//                         }
//                         if (!subCategoryName && response.data?.category_info?.category_info?.subcategory_name) {
//                             setFetchedSubcategoryName(response.data.category_info.category_info.subcategory_name);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             }
//         };
//
//         // Trigger product fetch when URL params exist (either from state or URL)
//         if (categoryId || categorySlug || path.startsWith("/category/")) {
//             getInitialProducts();
//         }
//     }, [path, typeKey, categoryId, subcategoryID, categorySlug, subcategorySlug]);
//
//     // Determine the base name for Helmet tags
//     const getDisplayName = () => {
//         if (currentFilterType) return currentFilterType;
//         if (subCategoryName) return subCategoryName;
//         if (fetchedSubcategoryName) return fetchedSubcategoryName;
//         if (categoryName) return categoryName;
//         if (fetchedCategoryName) return fetchedCategoryName;
//         return "Gardening Products";
//     };
//
//     const displayName = getDisplayName();
//
//     // Use URL params for canonical, fallback to state slugs
//     const canonicalCategorySlug = categorySlug || category_slug;
//     const canonicalSubcategorySlug = subcategorySlug || subcategory_slug;
//
//     return (
//         <>
//             <Helmet>
//                 <title>
//                     {displayName
//                         ? `Buy ${displayName} Online | Best Price in Bengaluru – Gidan`
//                         : 'Buy Gardening Products Online | Best Price in Bengaluru – Gidan'}
//                 </title>
//
//                 <meta
//                     name="description"
//                     content={
//                         displayName
//                             ? `Shop ${displayName} online at best prices. Wide range of premium varieties and styles. Fast delivery & easy returns – Gidan.`
//                             : 'Shop gardening products online at best prices. Wide range of plants, pots, seeds, and accessories. Fast delivery & easy returns – Gidan.'
//                     }
//                 />
//
//                 {/* NEW: Clean canonical URLs */}
//                 <link
//                     rel="canonical"
//                     href={
//                         canonicalSubcategorySlug
//                             ? `https://gidan.store/${canonicalCategorySlug}/${canonicalSubcategorySlug}/`
//                             : `https://gidan.store/${canonicalCategorySlug}/`
//                     }
//                 />
//             </Helmet>
//
//             <div className="container mx-auto min-h-screen">
//                 {/* Mobile Filter Button */}
//                 <div className="md:hidden px-4 pt-4">
//                     <button aria-label="Toggle filters"
//                             className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow"
//                             onClick={toggleMobileFilter}
//                     >
//                         <FiFilter size={20} />
//                         <span className="font-medium">Filters ss</span>
//                     </button>
//                 </div>
//
//                 {/* Desktop Horizontal Filter - Full Width */}
//                 <div className="hidden md:block mt-4 overflow-visible relative z-10">
//                     <FilterSidebar
//                         setResults={setResults}
//                         categoryId={categoryId}
//                         category={categoryName || fetchedCategoryName}
//                         subcategory={subCategoryName || fetchedSubcategoryName}
//                         subcategoryID={subcategoryID}
//                         subcategorySlug={subcategorySlug}
//                         categorySlug={categorySlug}
//                         typeKey={typeKey}
//                         setCategoryData={setCategoryData}
//                         setCurrentFilterType={setCurrentFilterType}
//                     />
//                 </div>
//
//                 {/* Product Grid */}
//                 <div className="px-4 mt-4">
//                     <ProductGrid
//                         productDetails={results}
//                         pagination={products}
//                         setResults={setResults}
//                         categoryName={categoryName || fetchedCategoryName}
//                         typeKey={typeKey}
//                         categorySlug={category_slug || categorySlug}
//                         subcategorySlug={subcategory_slug || subcategorySlug}
//                         hasSubcategory={!!subcategoryID}
//                     />
//                 </div>
//
//                 {/* Additional Sections */}
//                 <div className="mt-12 mb-8">
//                     <div className="container mx-auto px-4 md:px-8">
//                         <CategoryLayout data={categoryData} />
//                     </div>
//                 </div>
//
//                 {/* Mobile Filter Sidebar Overlay */}
//                 {showMobileFilter && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
//                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
//                             <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex items-center justify-between z-10">
//                                 <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//                                 <button
//                                     className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
//                                     onClick={toggleMobileFilter}
//                                 >
//                                     ✕
//                                 </button>
//                             </div>
//
//                             <div className="p-4">
//                                 <FilterSidebar
//                                     setResults={setResults}
//                                     setShowMobileFilter={setShowMobileFilter}
//                                     categoryId={categoryId}
//                                     category={categoryName || fetchedCategoryName}
//                                     subcategory={subCategoryName || fetchedSubcategoryName}
//                                     subcategoryID={subcategoryID}
//                                     subcategorySlug={subcategorySlug}
//                                     categorySlug={categorySlug}
//                                     typeKey={typeKey}
//                                     setCategoryData={setCategoryData}
//                                     setCurrentFilterType={setCurrentFilterType}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <CategorySchema
//                 categoryName={categoryName || fetchedCategoryName}
//                 categorySlug={canonicalCategorySlug}
//                 items={results || []}
//             />
//             <SubCategorySchema
//                 categoryName={categoryName || fetchedCategoryName}
//                 subCategoryName={subCategoryName || fetchedSubcategoryName}
//                 categorySlug={canonicalCategorySlug}
//                 subCategorySlug={canonicalSubcategorySlug}
//                 items={results || []}
//             />
//             <HomepageSchema/>
//             <StoreSchema/>
//         </>
//     );
// }
//
// export default PlantFilter;
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
////
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
////                 }
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
////             }
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
//                     <button aria-label="Toggle filters"
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
//                             <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex items-center justify-between z-10">
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
// ========================old================
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
// import SubCategorySchema from "../seo/SubCategorySchema";
// import CategorySchema from "../seo/CategorySchema";
// import HomepageSchema from "../seo/HomepageSchema";
// import StoreSchema from "../seo/StoreSchema";
//
// const CategoryLayout = ({ data }) => {
//     // ✅ 4. FIX LOGIC: Check if data exists and has content (hero/sections)
//     // instead of checking for an ID.
//     const hasGenericContent = data && data.hero;
//     console.log(hasGenericContent, '--------------------------------hhh');
//
//     return (
//         <div className="space-y-12">
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
//     const { categoryId, categoryName, typeKey, subCategory, subcategoryID, category_slug } = stateData;
//     const { name: subCategoryName, subcategory_slug } = subCategory || {};
//
//     // NEW: State to track the currently selected Type from the Sidebar
//     const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);
//
//     const [showMobileFilter, setShowMobileFilter] = useState(false);
//     const [products, setProducts] = useState({});
//     const [results, setResults] = useState([]);
//     const [categoryData, setCategoryData] = useState(null);
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
//     }, [path, typeKey, categoryId, subcategoryID]);
//
//     // LOGIC to determine the base name for Helmet tags
//     // Priority: 1. Selected Filter Type (e.g. 'Pots'), 2. Subcategory Name, 3. Category Name
//     const getDisplayName = () => {
//         if (currentFilterType) return currentFilterType;
//         if (subCategoryName) return subCategoryName;
//         return categoryName || "Gardening Products";
//     };
//
//     const displayName = getDisplayName();
//
//     return (
//         <>
//             <Helmet>
//                 {/* DYNAMIC TITLE & META LOGIC */}
//                 <title>
//                     {displayName
//                         ? `Buy ${displayName} Online | Best Price in Bengaluru – Gidan`
//                         : 'Buy Gardening Products Online | Best Price in Bengaluru – Gidan'}
//                 </title>
//
//                 <meta
//                     name="description"
//                     content={
//                         displayName
//                             ? `Shop ${displayName} online at best prices. Wide range of premium varieties and styles. Fast delivery & easy returns – Gidan.`
//                             : 'Shop gardening products online at best prices. Wide range of plants, pots, seeds, and accessories. Fast delivery & easy returns – Gidan.'
//                     }
//                 />
//
//                 {/* Canonical logic handles both subcategory and main category */}
//                 <link
//                     rel="canonical"
//                     href={
//                         subCategoryName
//                             ? `https://gidan.store/category/${category_slug}?subcategory=${subcategory_slug}`
//                             : `https://gidan.store/category/${category_slug}`
//                     }
//                 />
//             </Helmet>
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
//                         // PASS THIS PROP TO UPDATE TITLE ON FILTER CHANGE
//                         setCurrentFilterType={setCurrentFilterType}
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
//                         <CategoryLayout data={categoryData} />
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
//                                     // PASS THIS PROP TO UPDATE TITLE ON FILTER CHANGE (MOBILE)
//                                     setCurrentFilterType={setCurrentFilterType}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <CategorySchema
//                 categoryName={categoryName}
//                 categorySlug={category_slug}
//                 items={results || []}
//             />
//             <SubCategorySchema
//                 categoryName={categoryName}
//                 subCategoryName={subCategoryName}
//                 categorySlug={category_slug}
//                 subCategorySlug={subcategory_slug}
//                 items={results || []}
//             />
//             <HomepageSchema/>
//             <StoreSchema/>
//         </>
//     );
// }
//
// export default PlantFilter;
// // import React, { useEffect, useState } from "react";
// // import FilterSidebar from "../Featured/FilterSidebar";
// // import ProductGrid from "./ProductGrid";
// // import FAQSection from "./FAQSection";
// // import CheckoutStores from "./CheckoutStores";
// // import { FiFilter } from "react-icons/fi";
// // import { useLocation } from "react-router-dom";
// // import axiosInstance from "../../../Axios/axiosInstance";
// // import RecentlyViewedProduct from "./RecentlyViewedProduct";
// // import { Helmet } from "react-helmet-async";
// // import GenericPage from "../Info/GenericPage";
// //
// //
// // const CategoryLayout = ({ data }) => {
// //     // ✅ 4. FIX LOGIC: Check if data exists and has content (hero/sections)
// //     // instead of checking for an ID.
// //     const hasGenericContent = data && data.hero;
// //     console.log(hasGenericContent,'--------------------------------hhh');
// //
// //     return (
// //         <div className="space-y-12">
// //
// //             <>
// //                 <RecentlyViewedProduct />
// //                 {/* 2. Show FAQ ONLY if NO generic content is found (The conditional one) */}
// //                 {!hasGenericContent && <FAQSection />}
// //                 {/* Show GenericPage ONLY if we have the valid JSON content */}
// //                 {hasGenericContent && <GenericPage data={data} />}
// //
// //                 <CheckoutStores />
// //             </>
// //         </div>
// //     );
// // };
// //
// // function PlantFilter() {
// //     const location = useLocation();
// //     const path = location.pathname;
// //
// //     const stateData = location.state || {};
// //     const { categoryId, categoryName, typeKey, subCategory, subcategoryID ,category_slug,} = stateData;
// //     const { name: subCategoryName ,subcategory_slug} = subCategory || {};
// //
// //     // New state to track the Type selected in the FilterSidebar
// //     const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);
// //
// //     const [showMobileFilter, setShowMobileFilter] = useState(false);
// //     const [products, setProducts] = useState({});
// //     const [results, setResults] = useState([]);
// //
// //
// //     const [categoryData, setCategoryData] = useState(null);
// //
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
// //             if (categoryId === "14") {
// //                 try {
// //                     const response = await axiosInstance.get(
// //                         `/product/offerProducts/`
// //                     );
// //                     if (response.status === 200) {
// //                         setResults(response.data.products || []);
// //                         setProducts(response.data || {});
// //
// //                     }
// //
// //                 } catch (error) {
// //                     console.error("Error fetching offer products:", error);
// //                 }
// //                 return;
// //             }
// //
// //             try {
// //                 let queryParams = new URLSearchParams();
// //
// //                 if (typeKey) {
// //                     queryParams.append("type", typeKey);
// //                 }
// //
// //                 if (categoryId) {
// //                     queryParams.append("category_id", categoryId);
// //                 }
// //
// //                 if (subcategoryID) {
// //                     queryParams.append("subcategory_id", subcategoryID);
// //                 }
// //
// //                 const response = await axiosInstance.get(
// //                     `/filters/main_productsFilter/?${queryParams.toString()}`
// //                 );
// //
// //                 if (response.status === 200) {
// //                     setResults(response.data.results || []);
// //                     setProducts({
// //                         count: response.data.count,
// //                         next: response.data.next,
// //                         previous: response.data.previous,
// //                     });
// //                     setCategoryData(response.data?.category_info?.category_info || null);
// //                 }
// //             } catch (error) {
// //                 console.error("Error fetching products via filter API:", error);
// //             }
// //         };
// //
// //         if (path.startsWith("/category/")) {
// //             getInitialProducts();
// //         }
// //     }, [ path, typeKey, categoryId, subcategoryID]);
// //
// //
// //     // Determine the base name for the Title
// //     // Priority: 1. Selected Filter Type, 2. Subcategory, 3. Category
// //     const getBaseName = () => {
// //         if (currentFilterType) return currentFilterType;
// //         if (subCategoryName) return subCategoryName;
// //         return categoryName || "Gardening Products";
// //     };
// //
// //     const baseName = getBaseName();
// //
// //     return (
// //         <>
// //             <Helmet>
// //                 {/* SUB-CATEGORY META */}
// //                 {subCategoryName ? (
// //                     <>
// //                         <title>
// //                             {`${subCategoryName} for Home & Garden | Gidan`}
// //                         </title>
// //
// //                         <meta
// //                             name="description"
// //                             content={`Explore ${subCategoryName} at Gidan. Perfect for home gardeners and plant lovers. Affordable prices & fast delivery.`}
// //                         />
// //
// //                         <link
// //                             rel="canonical"
// //                             href={`https://gidan.store/category/${category_slug}?subcategory=${subcategory_slug}`}
// //                         />
// //                     </>
// //                 ) : (
// //                     /* CATEGORY META */
// //                     <>
// //                         <title>
// //                             {categoryName
// //                                 ? `Buy ${categoryName} Online | Best Price in Bengaluru – Gidan`
// //                                 : 'Buy Gardening Products Online | Best Price in Bengaluru – Gidan'}
// //                         </title>
// //
// //                         <meta
// //                             name="description"
// //                             content={
// //                                 categoryName
// //                                     ? `Shop ${categoryName} online at best prices. Wide range of premium varieties and styles. Fast delivery & easy returns – Gidan.`
// //                                     : 'Shop gardening products online at best prices. Wide range of plants, pots, seeds, and accessories. Fast delivery & easy returns – Gidan.'
// //                             }
// //                         />
// //
// //                         <link
// //                             rel="canonical"
// //                             href={`https://gidan.store/category/${category_slug}`}
// //                         />
// //                     </>
// //                 )}
// //             </Helmet>
// //
// //
// //
// //             <div className="container mx-auto min-h-screen">
// //                 {/* Mobile Filter Button */}
// //                 <div className="md:hidden px-4 pt-4">
// //                     <button
// //                         className="bg-white text-black w-full rounded-lg flex items-center justify-center gap-2 p-3 shadow-sm hover:shadow-md transition-shadow"
// //                         onClick={toggleMobileFilter}
// //                     >
// //                         <FiFilter size={20} />
// //                         <span className="font-medium">Filters</span>
// //                     </button>
// //                 </div>
// //
// //                 {/* Desktop Horizontal Filter - Full Width */}
// //                 <div className="hidden md:block mt-4 overflow-visible relative z-10">
// //                     <FilterSidebar
// //                         setResults={setResults}
// //                         categoryId={categoryId}
// //                         category={categoryName}
// //                         subcategory={subCategoryName}
// //                         subcategoryID={subcategoryID}
// //                         typeKey={typeKey}
// //                         setCategoryData={setCategoryData}
// //                     />
// //                 </div>
// //
// //                 {/* Product Grid */}
// //                 <div className="px-4 mt-4">
// //                     <ProductGrid
// //                         productDetails={results}
// //                         pagination={products}
// //                         setResults={setResults}
// //                         categoryName={categoryName}
// //                         typeKey={typeKey}
// //                     />
// //                 </div>
// //
// //                 {/* Additional Sections - Fixed with proper spacing */}
// //                 <div className="mt-12 mb-8">
// //                     <div className="container mx-auto px-4 md:px-8">
// //                         <CategoryLayout data={categoryData}/>
// //                     </div>
// //                 </div>
// //
// //                 {/* Mobile Filter Sidebar Overlay */}
// //                 {showMobileFilter && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
// //                         <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg z-50 overflow-y-auto">
// //                             {/* Close Button */}
// //                             <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
// //                                 <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
// //                                 <button
// //                                     className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
// //                                     onClick={toggleMobileFilter}
// //                                 >
// //                                     ✕
// //                                 </button>
// //                             </div>
// //
// //                             {/* Mobile Filter Content */}
// //                             <div className="p-4">
// //                                 <FilterSidebar
// //                                     setResults={setResults}
// //                                     setShowMobileFilter={setShowMobileFilter}
// //                                     categoryId={categoryId}
// //                                     category={categoryName}
// //                                     subcategory={subCategoryName}
// //                                     subcategoryID={subcategoryID}
// //                                     typeKey={typeKey}
// //                                     setCategoryData={setCategoryData}
// //                                 />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </>
// //     );
// // }
// //
// // export default PlantFilter;