'use client';

import { usePathname, useSearchParams, useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SwipeableDrawer, IconButton, Box, Typography } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import { Close as CloseIcon } from "@mui/icons-material";

import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import TrustBadges from "../../../components/Shared/TrustBadges";
import CategoryHero from "../../../components/Shared/CategoryHero";
import PublicFlags from "../../../components/Shared/PublicFlags";
import { Sun, Leaf, Droplets, Package, Smartphone, ShieldCheck, Heart } from "lucide-react";
// Schemas moved to Server Component (page.tsx) for better SSR/SEO

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CategoryStaticSEO from "../Info/CategoryStaticSEO";
import axiosInstance from "../../../Axios/axiosInstance";
import logo from "../../../Assets/Gidan_logo.webp";
import Pagination from "../../../components/Shared/Pagination";



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
// Mapping of flag names to IDs as provided by the backend
const FLAG_MAP = {
    is_featured: 2,
    is_latest: 3,
    is_best_seller: 4,
    is_seasonal_collection: 5,
    is_trending: 6
};

function PlantFilter({

    initialResults = [],
    initialCategoryData = null,
    initialFilterData = null,
    categorySlug: propCategorySlug = null,
    subcategorySlug: propSubcategorySlug = null,
    subcategoryName: propSubcategoryName = null,
    initialSEOData = null,
    initialFlags = null,
    hideHeader = false,
} = {}) {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const path = pathname;
    const { categorySlug, subcategorySlug } = useParams();
    const routeBasedFilters = useMemo(() => ({
        isSeasonalCollection: path === '/seasonal' || path === '/seasonal/',
        isTrending: path === '/trending' || path === '/trending/',
        isLatest: path === '/latest' || path === '/latest/',
        isFeatured: path === '/featured' || path === '/featured/',
        isBestSeller: path === '/bestseller' || path === '/bestseller/'
    }), [path]);

    const query = searchParams.get('query') || "";

    // Extract query parameters for boolean filters (fallback)
    const queryIsSeasonalCollection = searchParams.get('is_seasonal_collection') === 'true';
    const queryIsTrending = searchParams.get('is_trending') === 'true';
    const queryIsLatest = searchParams.get('is_latest') === 'true';
    const queryIsFeatured = searchParams.get('is_featured') === 'true';
    const queryIsBestSeller = searchParams.get('is_best_seller') === 'true';

    // Combine route-based and query-based filters (route takes precedence)
    const isSeasonalCollection = routeBasedFilters.isSeasonalCollection || queryIsSeasonalCollection;
    const isTrending = routeBasedFilters.isTrending || queryIsTrending;
    const isLatest = routeBasedFilters.isLatest || queryIsLatest;
    const isFeatured = routeBasedFilters.isFeatured || queryIsFeatured;
    const isBestSeller = routeBasedFilters.isBestSeller || queryIsBestSeller;

    // Use null as primary data source (keep existing logic)
    const stateData = null || {};
    const { categoryId, categoryName, subCategory, subcategoryID, category_slug } = stateData;
    const { name: subCategoryName, subcategory_slug } = subCategory || {};

    // Use props for SSR stability, fall back to client-side hooks
    const effectiveCategorySlug = propCategorySlug || categorySlug;
    const effectiveSubcategorySlug = propSubcategorySlug || subcategorySlug;

    // Helper to make slugs readable if API name is missing
    const toTitleCase = (str) => {
        if (!str) return "";
        return str.toLowerCase().replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const derivedType = useMemo(() => {
        if (!effectiveCategorySlug) return null;
        const slug = effectiveCategorySlug.toLowerCase().replace(/-/g, '');
        if (slug === 'gifts' || slug === 'gift') return 'gift';
        const singular = slug.endsWith('s') ? slug.slice(0, -1) : slug;
        const typeMap = { pot: 'pot', plant: 'plant', seed: 'seed', plantcare: 'plantcare' };
        return typeMap[singular] || null;
    }, [effectiveCategorySlug]);

    // Map known category slugs to their API IDs
    const categoryIdFromSlug = useMemo(() => {
        if (!effectiveCategorySlug) return null;
        const slugLower = effectiveCategorySlug.toLowerCase();
        if (slugLower === 'gifts' || slugLower === 'gift') return ""; // Return empty string for gifts category_id
        const slugToId = {
            'plants': 19,
            'pots': 20,
            'seeds': 21,
            'plant-care': 22,
        };
        return slugToId[slugLower] || null;
    }, [effectiveCategorySlug]);
    const typeKey = derivedType || (effectiveCategorySlug?.toLowerCase() === 'gifts' || effectiveCategorySlug?.toLowerCase() === 'gift' ? 'gift' : null);

    // State to store fetched category/subcategory names when navigating via URL
    const [fetchedCategoryName, setFetchedCategoryName] = useState(null);
    const [fetchedSubcategoryName, setFetchedSubcategoryName] = useState(null);

    // Resolved IDs from slugs (for direct URL access)
    // Initialize from initialCategoryData if available to avoid waterfalls
    const [resolvedCategoryId, setResolvedCategoryId] = useState(() => {
        const idFromSlug = categoryIdFromSlug;
        if (idFromSlug === "") return ""; // Explicitly handle gift case
        return categoryId || idFromSlug || initialCategoryData?.id || null;
    });
    const [resolvedSubcategoryId, setResolvedSubcategoryId] = useState(
        subcategoryID || initialCategoryData?.subCategoryId || null
    );
    const [isResolvingIds, setIsResolvingIds] = useState(false);

    // State to track the currently selected Type from the Sidebar
    const [currentFilterType, setCurrentFilterType] = useState(typeKey || null);

    // State to track the currently active slugs (reacts to sidebar type changes)
    const [currentCategorySlug, setCurrentCategorySlug] = useState(propCategorySlug || categorySlug || "");
    const [currentSubcategorySlug, setCurrentSubcategorySlug] = useState(propSubcategorySlug || subcategorySlug || "");

    // State for SwipeableDrawer
    const [mobileOpen, setMobileOpen] = useState(false);

    // State for Public Flags (Interactive Pills)
    const [selectedPublicFlag, setSelectedPublicFlag] = useState(() => {
        if (isFeatured) return FLAG_MAP.is_featured;
        if (isBestSeller) return FLAG_MAP.is_best_seller;
        if (isTrending) return FLAG_MAP.is_trending;
        if (isLatest) return FLAG_MAP.is_latest;
        if (isSeasonalCollection) return FLAG_MAP.is_seasonal_collection;
        return null;
    });

    // Normalize initialResults: could be an array (legacy) or an object (new)
    const normalizedInitialResults = useMemo(() => {
        if (!initialResults) return { results: [], count: 0, next: null, previous: null };
        if (Array.isArray(initialResults)) {
            return { results: initialResults, count: initialResults.length, next: null, previous: null };
        }
        return initialResults;
    }, [initialResults]);

    const subcategoryListMemo = useMemo(() => initialCategoryData?.subCategory || [], [initialCategoryData]);

    const [products, setProducts] = useState({
        count: normalizedInitialResults.count || 0,
        next: normalizedInitialResults.next || null,
        previous: normalizedInitialResults.previous || null,
    });
    const [results, setResults] = useState(normalizedInitialResults.results || []);
    // SEO Data: Prioritize initialSEOData prop, then fallback to initialCategoryData or initialResults
    const [categoryData, setCategoryData] = useState(initialSEOData || initialCategoryData || normalizedInitialResults.category_info?.category_info || null);
    // Construct the initial query string to match getInitialProducts logic
    const initialQueryString = useMemo(() => {
        const params = new URLSearchParams();
        const finalType = currentFilterType || typeKey || (isSeasonalCollection || isTrending || isFeatured || isBestSeller ? "plant" : "");
        params.append("type", finalType);
        // Clear category preference when searching to "handle all types"
        params.append("category_id", query ? "" : (resolvedCategoryId || ""));
        params.append("subcategory_id", resolvedSubcategoryId || "");
        params.append("search", query || "");
        params.append("min_price", "");
        params.append("max_price", "");
        params.append("color_id", "");
        params.append("size_id", "");
        params.append("planter_size_id", "");
        params.append("planter_id", "");
        params.append("weight_id", "");
        params.append("pot_type_id", "");
        params.append("litre_id", "");
        params.append("space_and_light_id", "");
        params.append("special_filter_id", "");
        params.append("care_guide_id", "");
        params.append("min_rating", "");
        params.append("flag", "");
        params.append("is_featured", isFeatured ? "true" : "unknown");
        params.append("is_best_seller", isBestSeller ? "true" : "unknown");
        params.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
        params.append("is_trending", isTrending ? "true" : "unknown");
        params.append("is_latest", isLatest ? "true" : "unknown");
        params.append("ordering", "");
        return params.toString();
    }, [typeKey, resolvedCategoryId, resolvedSubcategoryId, isFeatured, isBestSeller, isSeasonalCollection, isTrending, isLatest]);

    const [currentQuery, setCurrentQuery] = useState(initialQueryString);
    const [filtersApplied, setFiltersApplied] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.has('query') || params.has('color_id') || params.has('min_price') || params.has('max_price');
        }
        return false;
    });
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(new URLSearchParams(window.location.search).get('page') || '1');
        }
        return 1;
    });
    const pageSize = 12;

    // Sync currentQuery when filters are cleared
    useEffect(() => {
        if (!filtersApplied) {
            setCurrentQuery(initialQueryString);
            setCurrentPage(1);
        }
    }, [initialQueryString, filtersApplied]);

    const handlePageChange = async (pageNumber, isArrowClick = false) => {
        setIsSearching(true);
        setCurrentPage(pageNumber);
        try {
            const queryParams = new URLSearchParams(currentQuery);
            const response = await axiosInstance.get(
                `/filters/main_productsFilter/?${queryParams}&page_size=${pageSize}&page=${pageNumber}`
            );

            if (response.status === 200) {
                setResults(response.data.results || []);
                setProducts({
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous,
                });
                
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', pageNumber.toString());
                    window.history.replaceState(null, '', url.pathname + url.search);
                }

                const gridElem = document.getElementById('product-grid-container');
                if (gridElem) {
                    const offset = isArrowClick ? 200 : 100;
                    window.scrollTo({
                        top: gridElem.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
        } catch (error) {
            console.error("Error changing page:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const getProducts = async () => {
        setIsSearching(true);
        try {
            const queryParams = new URLSearchParams(currentQuery);
            const response = await axiosInstance.get(
                `/filters/main_productsFilter/?${queryParams}&page_size=12&limit=12&page=1`
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
            console.error("Error refreshing products:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // SEO state — initialised from server-fetched data, updates reactively on subcategory filter changes
    const [seoData, setSeoData] = useState(initialSEOData || initialCategoryData || (typeof normalizedInitialResults === 'object' ? normalizedInitialResults.category_info?.category_info : null));
    const [isSubcategorySEO, setIsSubcategorySEO] = useState(() => {
        const info = initialSEOData || initialCategoryData || (typeof normalizedInitialResults === 'object' ? normalizedInitialResults.category_info?.category_info : null);
        return !!(info?.subcategory_name || propSubcategorySlug);
    });
;

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

    const [isStuck, setIsStuck] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsStuck(true);
            } else {
                setIsStuck(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);


    useEffect(() => {
        if (effectiveCategorySlug) {

            if (filtersApplied) return;

            setFiltersApplied(false);
        }

    }, [effectiveCategorySlug]);
    useEffect(() => {
        const resolveSlugs = async () => {
            if (!effectiveCategorySlug) return;

            // If we already have the ID from props or derived from slug, skip API call
            if (resolvedCategoryId) return;

            setIsResolvingIds(true);
            try {
                const catRes = await axiosInstance.get('/category/');
                const categories = catRes.data?.data?.categories || [];
                const foundCat = categories.find(c => c.slug === effectiveCategorySlug);
                if (foundCat) {
                    setResolvedCategoryId(foundCat.id);
                    setFetchedCategoryName(foundCat.name);
                }
            } catch (err) {
                console.error("Error resolving category slug:", err);
            } finally {
                setIsResolvingIds(false);
            }
        };

        if (effectiveCategorySlug && !resolvedCategoryId) {
            resolveSlugs();
        }
    }, [effectiveCategorySlug, resolvedCategoryId]);

    // Separate effect for subcategory resolution to avoid complexity
    useEffect(() => {
        const resolveSubcategory = async () => {
            if (!effectiveCategorySlug || !effectiveSubcategorySlug || resolvedSubcategoryId) return;

            setIsResolvingIds(true);
            try {
                const endpoint = effectiveCategorySlug === 'offers' ? '/product/offerProducts/' : `/category/categoryWiseSubCategory/${effectiveCategorySlug}/`;
                const subRes = await axiosInstance.get(endpoint);
                const subcategories = subRes.data?.data?.subCategorys || subRes.data?.products || [];
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
        };

        if (effectiveSubcategorySlug && !resolvedSubcategoryId) {
            resolveSubcategory();
        }
    }, [effectiveCategorySlug, effectiveSubcategorySlug, resolvedSubcategoryId]);

    useEffect(() => {
        const getInitialProducts = async () => {
            // Skip fetching for specific categories that are handled elsewhere (like offers)
            if (categoryId === "14") {
                try {
                    const response = await axiosInstance.get(`/product/offerProducts/`);
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
                queryParams.append("category_id", query ? "" : (resolvedCategoryId || ""));
                queryParams.append("subcategory_id", resolvedSubcategoryId || "");
                queryParams.append("search", query || "");
                queryParams.append("min_price", "");
                queryParams.append("max_price", "");
                queryParams.append("color_id", "");
                queryParams.append("size_id", "");
                queryParams.append("planter_size_id", "");
                queryParams.append("planter_id", "");
                queryParams.append("weight_id", "");
                queryParams.append("pot_type_id", "");
                queryParams.append("litre_id", "");
                queryParams.append("space_and_light_id", "");
                queryParams.append("special_filter_id", "");
                queryParams.append("care_guide_id", "");
                queryParams.append("min_rating", "");
                queryParams.append("flag", "");
                queryParams.append("is_featured", isFeatured ? "true" : "unknown");
                queryParams.append("is_best_seller", isBestSeller ? "true" : "unknown");
                queryParams.append("is_seasonal_collection", isSeasonalCollection ? "true" : "unknown");
                queryParams.append("is_trending", isTrending ? "true" : "unknown");
                queryParams.append("is_latest", isLatest ? "true" : "unknown");
                queryParams.append("ordering", "");

                const currentPage = searchParams.get('page') || '1';
                const response = await axiosInstance.get(
                    `/filters/main_productsFilter/?${queryParams}&page_size=12&limit=12&page=${currentPage}`
                );

                if (response.status === 200) {
                    setCurrentQuery(queryParams.toString());
                    setResults(response.data.results || []);
                    setProducts({
                        count: response.data.count,
                        next: response.data.next,
                        previous: response.data.previous,
                    });

                    const parentCategoryInfo = response.data?.category_info || null;
                    const parentSubcategoryInfo = response.data?.subcategory_info || null;
                    const newCategoryInfo = parentCategoryInfo?.category_info || parentCategoryInfo;
                    const newSubcategoryInfo = parentSubcategoryInfo;
                    const activeInfo = newSubcategoryInfo || newCategoryInfo;

                    if (activeInfo) {
                        setCategoryData(activeInfo);
                        const hasSubcategory = !!newSubcategoryInfo;
                        setIsSubcategorySEO(hasSubcategory);

                        const parentObj = hasSubcategory ? parentSubcategoryInfo : parentCategoryInfo;

                        setSeoData({
                            ...activeInfo,
                            // Ensure headings/tags/stats are prioritized from the detailed nested block
                            heading_before: activeInfo.heading_before || "",
                            italic_text: activeInfo.italic_text || "",
                            heading_after: activeInfo.heading_after || "",
                            tags: activeInfo.tags || [],
                            stats: activeInfo.stats || [],
                            // Info cards and sections are often at the parent level or inherited from initial state
                            info_cards: (activeInfo.info_cards && activeInfo.info_cards.length > 0)
                                ? activeInfo.info_cards
                                : (parentObj?.info_cards?.length > 0 ? parentObj.info_cards : initialSEOData?.info_cards || []),
                            sections: (activeInfo.sections && activeInfo.sections.length > 0)
                                ? activeInfo.sections
                                : (parentObj?.sections || initialSEOData?.sections || [])
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

        if (!isResolvingIds && (resolvedCategoryId !== null || isSpecialRoute)) {
            if (filtersApplied) return;

            // STRONGER HYDRATION GUARD: 
            // 1. If server already provided results and we haven't manually changed anything, skip.
            // 2. We use normalizedInitialResults which is a memoized version of the SSR prop.
            const hasInitialResults = normalizedInitialResults.results && normalizedInitialResults.results.length > 0;

            // Check if current state results still exactly match the initial SSR results
            const isShowingInitialData = results === normalizedInitialResults.results ||
                (results.length === normalizedInitialResults.results.length && results.length > 0);

            if (hasInitialResults && isShowingInitialData && seoData) {
                // If we have SSR data, only fetch if the route has actually changed but the data hasn't
                return;
            }

            setIsSearching(true);
            getInitialProducts();
        }
    }, [path, typeKey, currentFilterType, resolvedCategoryId, resolvedSubcategoryId, isResolvingIds, isSeasonalCollection, isTrending, isFeatured, isBestSeller, normalizedInitialResults, results, seoData, filtersApplied]);

    const getDisplayName = () => {
        if (categoryData?.meta_title) return categoryData.meta_title;
        if (categoryData?.seo_title) return categoryData.seo_title;
        const suffix = "Online in India";
        if (isSeasonalCollection) return `Fresh Seasonal Collections - Buy Plants ${suffix}`;
        if (isTrending) return `Trending Gardening Products - Shop ${suffix}`;
        if (isLatest) return `New Arrivals - Latest Gardening Products ${suffix}`;
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

    // Sync Document Title for Real-Time Client SEO
    useEffect(() => {
        if (typeof document !== 'undefined' && displayName) {
            document.title = `${displayName} | Gidan Plants`;
        }
    }, [displayName]);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const isSpecialRoute = routeBasedFilters.isSeasonalCollection || routeBasedFilters.isTrending || routeBasedFilters.isFeatured || routeBasedFilters.isBestSeller;

    let canonicalCategorySlug = currentCategorySlug;
    let canonicalSubcategorySlug = currentSubcategorySlug;

    if (!filtersApplied && !isSpecialRoute && pathSegments.length > 0) {
        canonicalCategorySlug = pathSegments[0];
        if (pathSegments.length > 1) {
            canonicalSubcategorySlug = pathSegments[1];
        } else {
            canonicalSubcategorySlug = null;
        }
    }

    const breadcrumbItems = useMemo(() => {
        if (!canonicalSubcategorySlug) return [];
        return [
            {
                label: categoryName || fetchedCategoryName || toTitleCase(canonicalCategorySlug),
                path: `/${canonicalCategorySlug}/`
            }
        ];
    }, [canonicalSubcategorySlug, categoryName, fetchedCategoryName, canonicalCategorySlug]);

    const breadcrumbPage = useMemo(() => {
        if (canonicalSubcategorySlug) {
            return subCategoryName || fetchedSubcategoryName || toTitleCase(canonicalSubcategorySlug);
        }
        return categoryName || fetchedCategoryName || toTitleCase(canonicalCategorySlug);
    }, [canonicalSubcategorySlug, subCategoryName, fetchedSubcategoryName, categoryName, fetchedCategoryName, canonicalCategorySlug]);

    // Helper for Bottom Info Cards Icon Mapping
    const getBottomInfoCardIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('low light') || lower.includes('sun') || lower.includes('shade')) return <Sun className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('air purifying') || lower.includes('health') || lower.includes('toxin')) return <Leaf className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('maintenance') || lower.includes('care') || lower.includes('easy')) return <ShieldCheck className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('pet safe') || lower.includes('animal') || lower.includes('non-toxic')) return <Heart className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('eco') || lower.includes('sustainable') || lower.includes('material')) return <Leaf className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('drainage') || lower.includes('water') || lower.includes('root')) return <Droplets className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('size') || lower.includes('range')) return <Package className="w-5 h-5 text-[#86a86d]" />;
        if (lower.includes('whatsapp') || lower.includes('support')) return <Smartphone className="w-5 h-5 text-[#86a86d]" />;
        return <ShieldCheck className="w-5 h-5 text-[#86a86d]" />;
    };

    return (
        <>
            {!hideHeader && !seoData && (canonicalCategorySlug || canonicalSubcategorySlug) && (
                <>
                    <Breadcrumb
                        items={breadcrumbItems}
                        currentPage={breadcrumbPage}
                    />
                    <div className="bg-white border-b border-gray-100">
                        <TrustBadges />
                    </div>
                </>
            )}

            {!hideHeader && seoData && (
                <>
                    <CategoryHero
                        data={seoData}
                        breadcrumb={{
                            items: breadcrumbItems,
                            currentPage: breadcrumbPage
                        }}
                    />
                    <div className="bg-white border-b border-gray-100">
                        <TrustBadges />
                    </div>
                </>
            )}

            <div className="w-full overflow-visible py-8 md:py-12">
                <div className="container mx-auto px-4 md:px-8 max-w-full">
                    {/* Mobile Filter Trigger */}
                    <div className={`flex md:hidden sticky top-[95px] z-40 bg-[#f8f7f0]/95 backdrop-blur-md justify-between items-center px-4 rounded-xl border border-gray-100 mt-4 mb-4 shadow-sm transition-all duration-300 ${isStuck ? 'pt-8 pb-4' : 'p-4'}`}>
                        <div className="flex items-center gap-3">
                            <Typography variant="body2" className="text-gray-600 font-bold">
                                Refine Products
                            </Typography>
                        </div>
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#375421] text-white rounded-full font-bold text-sm hover:bg-[#2d451b] transition-all shadow-md active:scale-95"
                        >
                            <FiFilter />
                            Filter
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
                        {/* Desktop Sidebar (Left) */}
                        <div className={`hidden md:block w-[240px] lg:w-[280px] xl:w-[320px] flex-shrink-0 sticky top-[115px] z-30 self-start transition-all duration-300 ${isStuck ? 'pt-8' : 'pt-2'}`}>
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                                <FilterSidebar
                                    setResults={setResults}
                                    setProducts={setProducts}
                                    setFiltersApplied={setFiltersApplied}
                                    categoryId={resolvedCategoryId}
                                    category={categoryName || fetchedCategoryName}
                                    subcategory={subCategoryName || fetchedSubcategoryName}
                                    subcategoryID={resolvedSubcategoryId}
                                    subcategoryIDForSEO={resolvedSubcategoryId}
                                    subcategorySlug={currentSubcategorySlug}
                                    categorySlug={currentCategorySlug}
                                    setCategorySlug={setCurrentCategorySlug}
                                    setSubcategorySlug={setCurrentSubcategorySlug}
                                    categoryIdFromSlug={resolvedCategoryId}
                                    typeKey={typeKey}
                                    setCategoryData={setCategoryData}
                                    setCurrentFilterType={setCurrentFilterType}
                                    isSeasonalCollection={isSeasonalCollection}
                                    isTrending={isTrending}
                                    isLatest={isLatest}
                                    isFeatured={isFeatured}
                                    isBestSeller={isBestSeller}
                                    setFetchedCategoryName={setFetchedCategoryName}
                                    setFetchedSubcategoryName={setFetchedSubcategoryName}
                                    setIsSearching={setIsSearching}
                                    initialFilterData={initialFilterData}
                                    setSeoData={setSeoData}
                                    setIsSubcategorySEO={setIsSubcategorySEO}
                                    subcategoryList={subcategoryListMemo}
                                    setCurrentQuery={setCurrentQuery}
                                    selectedPublicFlag={selectedPublicFlag}
                                    setSelectedPublicFlag={setSelectedPublicFlag}
                                    searchQuery={query}
                                />
                            </div>
                        </div>

                        {/* Main Content (Right) - flex-grow with min-w-0 prevents grid overflow */}
                        <div className="flex-grow min-w-0 max-w-full">
                            {/* Public Flags Interactive Pills - Sticky at the top below header */}
                            <div className={`sticky top-[95px] md:top-[115px] z-[40] bg-[#f8f7f0]/95 backdrop-blur-md pb-1 md:pb-2 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-gray-100/50 mb-8 mt-0 transition-all duration-300 flex items-center ${isStuck ? 'pt-6 md:pt-8' : 'pt-1 md:pt-2'}`}>
                                <div className="flex-grow overflow-hidden">
                                    <PublicFlags
                                        selectedFlag={selectedPublicFlag}
                                        onSelectFlag={setSelectedPublicFlag}
                                        initialFlags={initialFlags}
                                    />
                                </div>
                            </div>

                            <div className={`mt-0 transition-opacity duration-300 ${isSearching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
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
                                    getProducts={getProducts}
                                    hidePagination={true}
                                />
                                {isSearching && (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#375421]"></div>
                                    </div>
                                )}

                                {/* Info Cards - Now just the grid, green text moved below pagination */}
                                <div className="mt-16 pt-8 border-t border-gray-100">
                                    <CategoryStaticSEO
                                        isLoading={isSearching}
                                        info_cards={(seoData?.info_cards?.length > 0 ? seoData.info_cards : initialSEOData?.info_cards || [])}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination - External and non-sticky */}
                    <div className="py-8 w-full">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={Math.ceil((products?.count || 0) / pageSize)}
                            onPageChange={handlePageChange}
                            isLoading={isSearching}
                        />
                    </div>

                    {/* Store Mission / SEO Statement - Final element below pagination */}
                    <div className="w-full pb-16 pt-8 bg-[#f8f7f0]/30">
                        <div className="max-w-4xl mx-auto text-center px-4">
                            {(seoData?.category_info_green_text || initialSEOData?.category_info_green_text) && (
                                <h2 className="text-xl md:text-2xl font-black text-[#375421] uppercase tracking-wider mb-6 leading-tight">
                                    {seoData?.category_info_green_text || initialSEOData?.category_info_green_text}
                                </h2>
                            )}
                            {(seoData?.category_info_description || initialSEOData?.category_info_description) && (
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium opacity-100 italic">
                                    {seoData?.category_info_description || initialSEOData?.category_info_description}
                                </p>
                            )}
                        </div>
                    </div>
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
                    zIndex: 10005,
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
                        subcategorySlug={currentSubcategorySlug}
                        categorySlug={currentCategorySlug}
                        setCategorySlug={setCurrentCategorySlug}
                        setSubcategorySlug={setCurrentSubcategorySlug}
                        categoryIdFromSlug={resolvedCategoryId}
                        typeKey={typeKey}
                        setCategoryData={setCategoryData}
                        setCurrentFilterType={setCurrentFilterType}
                        isSeasonalCollection={isSeasonalCollection}
                        isTrending={isTrending}
                        isLatest={isLatest}
                        isFeatured={isFeatured}
                        isBestSeller={isBestSeller}
                        setFetchedCategoryName={setFetchedCategoryName}
                        setFetchedSubcategoryName={setFetchedSubcategoryName}
                        setIsSearching={setIsSearching}
                        initialFilterData={initialFilterData}
                        setSeoData={setSeoData}
                        setIsSubcategorySEO={setIsSubcategorySEO}
                        subcategoryList={subcategoryListMemo}
                        setCurrentQuery={setCurrentQuery}
                        selectedPublicFlag={selectedPublicFlag}
                        setSelectedPublicFlag={setSelectedPublicFlag}
                        searchQuery={query}
                        isMobile={true}
                    />
                </Box>
            </SwipeableDrawer>
        </>
    );
}

export default PlantFilter;
