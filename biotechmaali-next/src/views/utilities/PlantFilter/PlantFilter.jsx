'use client';

import { usePathname, useSearchParams, useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SwipeableDrawer, IconButton, Box, Typography } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import { Close as CloseIcon } from "@mui/icons-material";

import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import CheckoutStores from "./CheckoutStores";
import axiosInstance from "../../../Axios/axiosInstance";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import GenericPage from "../Info/GenericPage";
import SubCategorySchema from "../seo/SubCategorySchema";
import CategorySchema from "../seo/CategorySchema";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import Link from "next/link";

const CategoryLayout = ({ data }) => {
    return (
        <div className="space-y-12">
            <>
                <RecentlyViewedProducts />
                {data && data.hero && <GenericPage data={data} />}
                <CheckoutStores />
            </>
        </div>
    );
};

void (0);
function PlantFilter({ initialResults = [], initialCategoryData = null, initialFilterData = null } = {}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const path = pathname;
    const { categorySlug, subcategorySlug } = useParams();
    const routeBasedFilters = {
        isSeasonalCollection: path === '/seasonal' || path === '/seasonal/',
        isTrending: path === '/trending' || path === '/trending/' || path === '/latest' || path === '/latest/',
        isFeatured: path === '/featured' || path === '/featured/',
        isBestSeller: path === '/bestseller' || path === '/bestseller/'
    };

    // Extract query parameters for boolean filters (fallback)
    const queryIsSeasonalCollection = searchParams.get('is_seasonal_collection') === 'true';
    const queryIsTrending = searchParams.get('is_trending') === 'true';
    const queryIsFeatured = searchParams.get('is_featured') === 'true';
    const queryIsBestSeller = searchParams.get('is_best_seller') === 'true';

    // Combine route-based and query-based filters (route takes precedence)
    const isSeasonalCollection = routeBasedFilters.isSeasonalCollection || queryIsSeasonalCollection;
    const isTrending = routeBasedFilters.isTrending || queryIsTrending;
    const isFeatured = routeBasedFilters.isFeatured || queryIsFeatured;
    const isBestSeller = routeBasedFilters.isBestSeller || queryIsBestSeller;

    // Use null as primary data source (keep existing logic)
    const stateData = null || {};
    const { categoryId, categoryName, subCategory, subcategoryID, category_slug } = stateData;
    const { name: subCategoryName, subcategory_slug } = subCategory || {};

    // Derive the product type from the categorySlug so initial API calls include `type`
    // e.g. pots→pot, plants→plant, seeds→seed, plant-care→plantcare
    const derivedType = useMemo(() => {
        if (!categorySlug) return null;
        const slug = categorySlug.toLowerCase().replace(/-/g, '');
        const singular = slug.endsWith('s') ? slug.slice(0, -1) : slug;
        const typeMap = { pot: 'pot', plant: 'plant', seed: 'seed', plantcare: 'plantcare' };
        return typeMap[singular] || null;
    }, [categorySlug]);

    // Map known category slugs to their API IDs
    const categoryIdFromSlug = useMemo(() => {
        if (!categorySlug) return null;
        const slugToId = {
            'plants': 19,
            'pots': 20,
            'seeds': 21,
            'plant-care': 22,
        };
        return slugToId[categorySlug.toLowerCase()] || null;
    }, [categorySlug]);
    const typeKey = derivedType;

    // State to store fetched category/subcategory names when navigating via URL
    const [fetchedCategoryName, setFetchedCategoryName] = useState(null);
    const [fetchedSubcategoryName, setFetchedSubcategoryName] = useState(null);

    // Resolved IDs from slugs (for direct URL access)
    // Initialize from initialCategoryData if available to avoid waterfalls
    const [resolvedCategoryId, setResolvedCategoryId] = useState(
        categoryId || categoryIdFromSlug || initialCategoryData?.id || null
    );
    const [resolvedSubcategoryId, setResolvedSubcategoryId] = useState(
        subcategoryID || initialCategoryData?.subCategoryId || null
    );
    const [isResolvingIds, setIsResolvingIds] = useState(false);

    // State to track the currently selected Type from the Sidebar
    const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);

    // State for SwipeableDrawer
    const [mobileOpen, setMobileOpen] = useState(false);

    const [products, setProducts] = useState({
        count: initialResults?.length || 0,
        next: null,
        previous: null,
    });
    const [results, setResults] = useState(initialResults || []);
    const [categoryData, setCategoryData] = useState(initialCategoryData || null);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

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

    // Reset products only when category Slug actually changes (fundamental context change)
    useEffect(() => {
        // We only clear results if the category slug itself changes
        // Query params or subcategory changes should use the loading overlay for smoothness
        if (categorySlug) {
            // Optional: you could choose NOT to clear even here if you want ultra-smooth transitions
            // but usually a root category change justifies a fresh state.
            // setResults([]); 
            // setProducts({});
        }
        setFiltersApplied(false);
    }, [categorySlug]);

    // Handle slug to ID resolution
    useEffect(() => {
        const resolveSlugs = async () => {
            if (!categorySlug) return;

            // If we already have the ID from hardcoded map or initialCategoryData, skip resolving category
            let currentCatId = resolvedCategoryId;

            // Only fetch if we really don't have the ID
            if (!currentCatId) {
                setIsResolvingIds(true);
                try {
                    const catRes = await axiosInstance.get('/category/');
                    const categories = catRes.data?.data?.categories || [];
                    const foundCat = categories.find(c => c.slug === categorySlug);
                    if (foundCat) {
                        currentCatId = foundCat.id;
                        setResolvedCategoryId(foundCat.id);
                        setFetchedCategoryName(foundCat.name);
                    }
                } catch (err) {
                    console.error("Error resolving category slug:", err);
                } finally {
                    setIsResolvingIds(false);
                }
            }

            // 2. Resolve Subcategory ID if slug exists and not already resolved
            if (subcategorySlug && !resolvedSubcategoryId && currentCatId) {
                setIsResolvingIds(true);
                try {
                    const subRes = await axiosInstance.get(`/category/categoryWiseSubCategory/${categorySlug}/`);
                    const subcategories = subRes.data?.data?.subCategorys || [];
                    const foundSub = subcategories.find(s => s.slug === subcategorySlug);
                    if (foundSub) {
                        setResolvedSubcategoryId(foundSub.id);
                        setFetchedSubcategoryName(foundSub.name);
                    }
                } catch (err) {
                    console.error("Error resolving subcategory slug:", err);
                } finally {
                    setIsResolvingIds(false);
                }
            }
        };

        resolveSlugs();
    }, [categorySlug, subcategorySlug, resolvedCategoryId, resolvedSubcategoryId]);

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
                } catch (error) { }
                return;
            }

            try {
                // Build complete API params matching exact backend format
                const queryParams = new URLSearchParams();

                // Type - use derived type or default to "plant" for boolean filter pages
                const finalType = typeKey || (isSeasonalCollection || isTrending || isFeatured || isBestSeller ? "plant" : "");
                queryParams.append("type", finalType);

                // Subcategory ID - use resolved ID
                queryParams.append("subcategory_id", resolvedSubcategoryId || "");

                // Search
                queryParams.append("search", "");

                // Price range
                queryParams.append("min_price", "");
                queryParams.append("max_price", "");

                // Filter IDs (all empty on initial load)
                queryParams.append("color_id", "");
                queryParams.append("size_id", "");
                queryParams.append("planter_size_id", "");
                queryParams.append("planter_id", "");
                queryParams.append("weight_id", "");
                queryParams.append("pot_type_id", "");
                queryParams.append("litre_id", "");

                // Boolean filter flags (use "true" or "unknown")
                queryParams.append("is_featured", isFeatured ? "true" : "unknown");
                queryParams.append("is_best_seller", isBestSeller ? "true" : "unknown");
                queryParams.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
                queryParams.append("is_trending", isTrending ? "true" : "unknown");

                // Ordering
                queryParams.append("ordering", "");

                // Always make the API call with complete params
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
                    // API response: category_info.category_info contains { hero, sections }
                    setCategoryData(response.data?.category_info?.category_info || null);

                    // Update fetched names from API response if not in state
                    if (!categoryName && response.data?.category_info?.category_info?.category_name) {
                        setFetchedCategoryName(response.data.category_info.category_info.category_name);
                    }
                    if (!subCategoryName && response.data?.category_info?.category_info?.subcategory_name) {
                        setFetchedSubcategoryName(response.data.category_info.category_info.subcategory_name);
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsSearching(false);
            }
        };

        // Trigger product fetch when either we have the IDs OR it's a special boolean route
        const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

        // Skip initial fetch if data was provided by server (hydration) 
        // OR if filters have already been applied by the sidebar (to avoid overwriting filtered results)
        if (!isResolvingIds && (resolvedCategoryId || isSpecialRoute)) {
            if (filtersApplied) return;
            if (initialResults && initialResults.length > 0 && results.length === initialResults.length) {
                // Already have data from server, skip first fetch
                return;
            }
            setIsSearching(true);
            getInitialProducts();
        }
    }, [path, typeKey, resolvedCategoryId, resolvedSubcategoryId, isResolvingIds, isSeasonalCollection, isTrending, isFeatured, isBestSeller, initialResults, filtersApplied]);

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
    // Parse from pathname to sync immediately if history.pushState was used
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

    let canonicalCategorySlug = categorySlug || category_slug;
    let canonicalSubcategorySlug = subcategorySlug || subcategory_slug;

    if (!isSpecialRoute && pathSegments.length > 0) {
        canonicalCategorySlug = pathSegments[0];
        if (pathSegments.length > 1) {
            canonicalSubcategorySlug = pathSegments[1];
        } else {
            canonicalSubcategorySlug = null;
        }
    }

    return (
        <>
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

            <div className="w-full overflow-visible">
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
                    <div className="hidden md:block mt-4 overflow-visible relative z-50">
                        <FilterSidebar
                            setResults={setResults}
                            setProducts={setProducts}
                            setFiltersApplied={setFiltersApplied}
                            categoryId={resolvedCategoryId}
                            category={categoryName || fetchedCategoryName}
                            subcategory={subCategoryName || fetchedSubcategoryName}
                            subcategoryID={resolvedSubcategoryId}
                            subcategorySlug={subcategorySlug}
                            categorySlug={categorySlug}
                            categoryIdFromSlug={resolvedCategoryId}
                            typeKey={typeKey}
                            setCategoryData={setCategoryData}
                            setCurrentFilterType={setCurrentFilterType}
                            isSeasonalCollection={isSeasonalCollection}
                            isTrending={isTrending}
                            isFeatured={isFeatured}
                            isBestSeller={isBestSeller}
                            setFetchedCategoryName={setFetchedCategoryName}
                            setFetchedSubcategoryName={setFetchedSubcategoryName}
                            setIsSearching={setIsSearching}
                            initialFilterData={initialFilterData}
                        />
                    </div>


                    {/* Product Grid */}
                    <div className={`mt-4 transition-opacity duration-300 ${isSearching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                        <ProductGrid
                            productDetails={results}
                            pagination={products}
                            setResults={setResults}
                            filtersApplied={filtersApplied}
                            categoryName={categoryName || fetchedCategoryName}
                            typeKey={typeKey}
                            categorySlug={canonicalCategorySlug}
                            subcategorySlug={canonicalSubcategorySlug}
                            hasSubcategory={!!subcategoryID}
                        />
                        {isSearching && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        )}
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
                        setProducts={setProducts}
                        setFiltersApplied={setFiltersApplied}
                        setShowMobileFilter={setMobileOpen}
                        categoryId={resolvedCategoryId}
                        category={categoryName || fetchedCategoryName}
                        subcategory={subCategoryName || fetchedSubcategoryName}
                        subcategoryID={resolvedSubcategoryId}
                        subcategorySlug={subcategorySlug}
                        categorySlug={categorySlug}
                        categoryIdFromSlug={resolvedCategoryId}
                        typeKey={typeKey}
                        setCategoryData={setCategoryData}
                        setCurrentFilterType={setCurrentFilterType}
                        isSeasonalCollection={isSeasonalCollection}
                        isTrending={isTrending}
                        isFeatured={isFeatured}
                        isBestSeller={isBestSeller}
                        setFetchedCategoryName={setFetchedCategoryName}
                        setFetchedSubcategoryName={setFetchedSubcategoryName}
                        setIsSearching={setIsSearching}
                        initialFilterData={initialFilterData}
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
            <HomepageSchema />
            <StoreSchema />
        </>
    );
}

export default PlantFilter;
