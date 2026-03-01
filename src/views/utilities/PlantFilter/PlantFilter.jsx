'use client';

import { usePathname, useSearchParams, useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SwipeableDrawer, IconButton, Box, Typography } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import { Close as CloseIcon } from "@mui/icons-material";

import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
// Schemas moved to Server Component (page.tsx) for better SSR/SEO

import Link from "next/link";
import CategoryStaticSEO from "../Info/CategoryStaticSEO";
import axiosInstance from "../../../Axios/axiosInstance";

/**
 * @param {object} props
 * @param {any[] | {results: any[], count: number, next: string | null, previous: string | null}} props.initialResults
 * @param {object} [props.initialCategoryData]
 * @param {object} [props.initialFilterData]
 * @param {string} [props.categorySlug]
 * @param {string} [props.subcategorySlug]
 * @param {string} [props.subcategoryName]
 * @param {object} [props.initialSEOData] SEO content pre-fetched server-side (hero/sections for category, title/subtitle/description for subcategory)
 */
function PlantFilter({
    initialResults = [],
    initialCategoryData = null,
    initialFilterData = null,
    categorySlug: propCategorySlug = null,
    subcategorySlug: propSubcategorySlug = null,
    subcategoryName: propSubcategoryName = null,
    initialSEOData = null,
} = {}) {
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

    // Use props for SSR stability, fall back to client-side hooks
    const effectiveCategorySlug = propCategorySlug || categorySlug;
    const effectiveSubcategorySlug = propSubcategorySlug || subcategorySlug;

    // Derive the product type from the categorySlug so initial API calls include `type`
    // e.g. pots→pot, plants→plant, seeds→seed, plant-care→plantcare
    const derivedType = useMemo(() => {
        if (!effectiveCategorySlug) return null;
        const slug = effectiveCategorySlug.toLowerCase().replace(/-/g, '');
        const singular = slug.endsWith('s') ? slug.slice(0, -1) : slug;
        const typeMap = { pot: 'pot', plant: 'plant', seed: 'seed', plantcare: 'plantcare' };
        return typeMap[singular] || null;
    }, [effectiveCategorySlug]);

    // Map known category slugs to their API IDs
    const categoryIdFromSlug = useMemo(() => {
        if (!effectiveCategorySlug) return null;
        const slugToId = {
            'plants': 19,
            'pots': 20,
            'seeds': 21,
            'plant-care': 22,
        };
        return slugToId[effectiveCategorySlug.toLowerCase()] || null;
    }, [effectiveCategorySlug]);
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

    // Normalize initialResults: could be an array (legacy) or an object (new)
    const normalizedInitialResults = useMemo(() => {
        if (!initialResults) return { results: [], count: 0, next: null, previous: null };
        if (Array.isArray(initialResults)) {
            return { results: initialResults, count: initialResults.length, next: null, previous: null };
        }
        return initialResults;
    }, [initialResults]);

    const [products, setProducts] = useState({
        count: normalizedInitialResults.count || 0,
        next: normalizedInitialResults.next || null,
        previous: normalizedInitialResults.previous || null,
    });
    const [results, setResults] = useState(normalizedInitialResults.results || []);
    const [categoryData, setCategoryData] = useState(initialCategoryData || normalizedInitialResults.category_info?.category_info || null);
    // Construct the initial query string to match getInitialProducts logic
    const initialQueryString = useMemo(() => {
        const params = new URLSearchParams();
        const finalType = typeKey || (isSeasonalCollection || isTrending || isFeatured || isBestSeller ? "plant" : "");
        params.append("type", finalType);
        params.append("category_id", resolvedCategoryId || "");
        params.append("subcategory_id", resolvedSubcategoryId || "");
        params.append("search", "");
        params.append("min_price", "");
        params.append("max_price", "");
        params.append("color_id", "");
        params.append("size_id", "");
        params.append("planter_size_id", "");
        params.append("planter_id", "");
        params.append("weight_id", "");
        params.append("pot_type_id", "");
        params.append("litre_id", "");
        params.append("is_featured", isFeatured ? "true" : "unknown");
        params.append("is_best_seller", isBestSeller ? "true" : "unknown");
        params.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
        params.append("is_trending", isTrending ? "true" : "unknown");
        params.append("ordering", "");
        return params.toString();
    }, [typeKey, resolvedCategoryId, resolvedSubcategoryId, isFeatured, isBestSeller, isSeasonalCollection, isTrending]);

    const [currentQuery, setCurrentQuery] = useState(initialQueryString);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Sync currentQuery when props/ids resolve so ProductGrid pagination stays correct
    useEffect(() => {
        if (!filtersApplied) {
            setCurrentQuery(initialQueryString);
        }
    }, [initialQueryString, filtersApplied]);

    // SEO state — initialised from server-fetched data, updates reactively on subcategory filter changes
    const [seoData, setSeoData] = useState(initialSEOData || null);
    const [isSubcategorySEO, setIsSubcategorySEO] = useState(!!propSubcategorySlug);

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
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    // Reset products only when category Slug actually changes (fundamental context change)
    useEffect(() => {
        if (effectiveCategorySlug) {
            setFiltersApplied(false);
        }
    }, [effectiveCategorySlug]);

    // (SEO sync is now handled directly by FilterSidebar via setSeoData prop)

    // Handle slug to ID resolution
    useEffect(() => {
        const resolveSlugs = async () => {
            if (!effectiveCategorySlug) return;

            let currentCatId = resolvedCategoryId;

            if (!currentCatId) {
                setIsResolvingIds(true);
                try {
                    const catRes = await axiosInstance.get('/category/');
                    const categories = catRes.data?.data?.categories || [];
                    const foundCat = categories.find(c => c.slug === effectiveCategorySlug);
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

            if (effectiveSubcategorySlug && !resolvedSubcategoryId && currentCatId) {
                setIsResolvingIds(true);
                try {
                    const subRes = await axiosInstance.get(`/category/categoryWiseSubCategory/${effectiveCategorySlug}/`);
                    const subcategories = subRes.data?.data?.subCategorys || [];
                    const foundSub = subcategories.find(s => s.slug === effectiveSubcategorySlug);
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
    }, [effectiveCategorySlug, effectiveSubcategorySlug, resolvedCategoryId, resolvedSubcategoryId]);

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
                const queryParams = new URLSearchParams();
                const finalType = typeKey || (isSeasonalCollection || isTrending || isFeatured || isBestSeller ? "plant" : "");
                queryParams.append("type", finalType);
                queryParams.append("category_id", resolvedCategoryId || "");
                queryParams.append("subcategory_id", resolvedSubcategoryId || "");
                queryParams.append("search", "");
                queryParams.append("min_price", "");
                queryParams.append("max_price", "");
                queryParams.append("color_id", "");
                queryParams.append("size_id", "");
                queryParams.append("planter_size_id", "");
                queryParams.append("planter_id", "");
                queryParams.append("weight_id", "");
                queryParams.append("pot_type_id", "");
                queryParams.append("litre_id", "");
                queryParams.append("is_featured", isFeatured ? "true" : "unknown");
                queryParams.append("is_best_seller", isBestSeller ? "true" : "unknown");
                queryParams.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
                queryParams.append("is_trending", isTrending ? "true" : "unknown");
                queryParams.append("ordering", "");

                const response = await axiosInstance.get(
                    `/filters/main_productsFilter/?${queryParams}&page_size=12&limit=12&page=1`
                );

                if (response.status === 200) {
                    setCurrentQuery(queryParams.toString());
                    setResults(response.data.results || []);
                    setProducts({
                        count: response.data.count,
                        next: response.data.next,
                        previous: response.data.previous,
                    });
                    const newCategoryInfo = response.data?.category_info?.category_info || null;
                    setCategoryData(newCategoryInfo);

                    // Update SEO data reactively when subcategory filter changes
                    if (newCategoryInfo) {
                        const hasSubcategory = !!newCategoryInfo.subcategory_name;
                        setIsSubcategorySEO(hasSubcategory);
                        if (hasSubcategory) {
                            // Subcategory — spread ALL fields so sections/intro_text are preserved
                            setSeoData({
                                ...newCategoryInfo,
                                title: newCategoryInfo.subcategory_name,
                                subtitle: newCategoryInfo.subtitle || `${newCategoryInfo.subcategory_name} - Buy Online in India from Gidan.store`,
                                description: newCategoryInfo.intro_text || newCategoryInfo.description || newCategoryInfo.content || "",
                                sections: newCategoryInfo.sections || [],
                            });
                        } else {
                            // Back to category level — use hero+sections format
                            setSeoData(newCategoryInfo);
                            setIsSubcategorySEO(false);
                        }
                    }

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

        const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

        if (!isResolvingIds && (resolvedCategoryId || isSpecialRoute)) {
            if (filtersApplied) return;
            const hasInitialData = normalizedInitialResults.results && normalizedInitialResults.results.length > 0;
            const isMatchingData = results.length === normalizedInitialResults.results.length;

            if (hasInitialData && isMatchingData) {
                return;
            }
            setIsSearching(true);
            getInitialProducts();
        }
    }, [path, typeKey, resolvedCategoryId, resolvedSubcategoryId, isResolvingIds, isSeasonalCollection, isTrending, isFeatured, isBestSeller, normalizedInitialResults, filtersApplied, results.length]);

    const getDisplayName = () => {
        if (categoryData?.meta_title) return categoryData.meta_title;
        if (categoryData?.seo_title) return categoryData.seo_title;
        const suffix = "Online in India";
        if (isSeasonalCollection) return `Fresh Seasonal Collections - Buy Plants ${suffix}`;
        if (isTrending) return `Trending Gardening Products - Shop ${suffix}`;
        if (isFeatured) return `Featured Garden Products ${suffix}`;
        if (isBestSeller) return `Best Selling Plants & Pots ${suffix}`;
        if (currentFilterType) return `Buy ${currentFilterType}s ${suffix}`;
        if (subCategoryName || fetchedSubcategoryName) {
            const sName = subCategoryName || fetchedSubcategoryName;
            const cName = categoryName || fetchedCategoryName || "";
            return `Buy ${sName} ${cName} ${suffix}`.replace(/\s+/g, ' ').trim();
        }
        if (categoryName || fetchedCategoryName) {
            const cName = categoryName || fetchedCategoryName;
            return `Buy ${cName} ${suffix}`;
        }
        return `Best Gardening Products ${suffix}`;
    };

    const displayName = getDisplayName();
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

    let canonicalCategorySlug = effectiveCategorySlug || category_slug;
    let canonicalSubcategorySlug = effectiveSubcategorySlug || subcategory_slug;

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
                    {/* Mobile Filter Trigger */}
                    <div className="flex md:hidden justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200 mt-4 mb-2">
                        <Typography variant="body2" className="text-gray-600 font-medium">
                            Refine Products
                        </Typography>
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-sm hover:bg-green-700 transition-colors shadow-md"
                        >
                            <FiFilter />
                            Filter
                        </button>
                    </div>

                    <div className="hidden md:block mt-4 overflow-visible relative z-50">
                        <FilterSidebar
                            setResults={setResults}
                            setProducts={setProducts}
                            setFiltersApplied={setFiltersApplied}
                            categoryId={resolvedCategoryId}
                            category={categoryName || fetchedCategoryName}
                            subcategory={subCategoryName || fetchedSubcategoryName}
                            subcategoryID={resolvedSubcategoryId}
                            subcategorySlug={effectiveSubcategorySlug}
                            categorySlug={effectiveCategorySlug}
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
                            setSeoData={setSeoData}
                            setIsSubcategorySEO={setIsSubcategorySEO}
                            subcategoryList={initialCategoryData?.subCategory || []}
                            setCurrentQuery={setCurrentQuery}
                        />
                    </div>

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
                            hasSubcategory={!!resolvedSubcategoryId}
                            query={currentQuery}
                        />
                        {isSearching && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        )}
                    </div>

                    {/* Reactive SEO block — SSR on first load, updates on subcategory filter change */}
                    {seoData && !isSearching && (
                        <div className="mt-12 mb-4">
                            <CategoryStaticSEO
                                categorySlug={effectiveCategorySlug}
                                subcategorySlug={effectiveSubcategorySlug}
                                subcategoryName={fetchedSubcategoryName || propSubcategoryName}
                                isSubcategory={isSubcategorySEO}
                                categoryDataFromAPI={seoData}
                                key={isSubcategorySEO ? (fetchedSubcategoryName || effectiveSubcategorySlug || 'sub') : (effectiveCategorySlug || 'cat')}
                            />
                        </div>
                    )}

                </div>
            </div>

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
                        subcategorySlug={effectiveSubcategorySlug}
                        categorySlug={effectiveCategorySlug}
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
                        setSeoData={setSeoData}
                        setIsSubcategorySEO={setIsSubcategorySEO}
                        subcategoryList={initialCategoryData?.subCategory || []}
                        setCurrentQuery={setCurrentQuery}
                    />
                </Box>
            </SwipeableDrawer>

            {/* Schemas moved to Server Component */}
        </>
    );
}

export default PlantFilter;
