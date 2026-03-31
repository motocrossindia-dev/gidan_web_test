'use client';

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import PublicFlags from "../../../components/Shared/PublicFlags";
import CategoryHero from "../../../components/Shared/CategoryHero";
import TrustBadges from "../../../components/Shared/TrustBadges";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import Blog from "../../../components/Blog/Blog";
import { FiFilter } from "react-icons/fi";
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import CategoryStaticSEO from "../Info/CategoryStaticSEO";
import { Typography, SwipeableDrawer, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";



const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

function PlantCare({ initialResults, initialFilterData, initialSEOData }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [mobileOpen, setMobileOpen] = useState(false);
  // Normalize initialResults: could be an array or an object
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
  const [isSearching, setIsSearching] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('query') || params.has('color_id') || params.has('min_price') || params.has('max_price');
    }
    return false;
  });
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedPublicFlag, setSelectedPublicFlag] = useState(null);
  const [currentFilterType, setCurrentFilterType] = useState("");
  const [categoryData, setCategoryData] = useState(initialSEOData || normalizedInitialResults.category_info?.category_info || null);
  const [seoData, setSeoData] = useState(initialSEOData || normalizedInitialResults.category_info?.category_info || null);
  const [isSubcategorySEO, setIsSubcategorySEO] = useState(() => {
    const info = initialSEOData || normalizedInitialResults.category_info?.category_info;
    return !!info?.subcategory_name;
  });

  // Construct dynamic SEO/Hero data for search results
  const searchSeoData = useMemo(() => ({
    // CategoryHero reads directly from data properties
    heading_before: `SEARCH: ${query?.toUpperCase() || ''}`,
    description: query ? `Browse our collection of products matching your search for "${query}".` : `Explore our collection of premium plants and garden essentials.`,
    tags: [],
    stats: []
  }), [query]);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileOpen(open);
  };

  const getInitialProducts = useCallback(async () => {
    setIsSearching(true);
    try {
      const typeParam = currentFilterType ? `&type=${currentFilterType}` : '';
      const response = await axiosInstance.get(
        `/filters/main_productsFilter/?search=${query}${typeParam}&page_size=12`
      );
      if (response.status === 200) {
        setResults(response.data.results || []);
        setProducts({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
        const newCategoryInfo = response.data?.category_info?.category_info || null;
        setCategoryData(newCategoryInfo);
        if (newCategoryInfo) {
          setSeoData(newCategoryInfo);
          setIsSubcategorySEO(!!newCategoryInfo.subcategory_name);
        }
        setCurrentQuery(`search=${query}`);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  }, [query, currentFilterType]);

  useEffect(() => {
    if (filtersApplied) return;

    // Hydration guard: If we already have results from server that match current query, skip initial fetch
    const hasInitialData = normalizedInitialResults.results && normalizedInitialResults.results.length > 0;
    const isMatchingData = results.length === normalizedInitialResults.results.length;
    if (hasInitialData && isMatchingData) {
      return;
    }

    getInitialProducts();
    window.scrollTo(0, 0);
  }, [getInitialProducts, filtersApplied, normalizedInitialResults, results.length]);

  return (
    <>
      <CategoryHero 
        data={seoData || searchSeoData} 
        breadcrumb={{
          items: [],
          currentPage: seoData?.title || seoData?.subcategory_name || seoData?.category_name || `SEARCH: ${query?.toUpperCase()}`
        }}
      />

      <div className="w-full overflow-visible py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-full">
          {/* Mobile Filter Trigger */}
          <div className="flex md:hidden sticky top-[160px] z-40 bg-white/95 backdrop-blur-md justify-between items-center p-4 rounded-xl border border-gray-100 mt-4 mb-4 shadow-sm">
            <Typography variant="body2" className="text-gray-600 font-bold">
              Refine Results
            </Typography>
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
            <div className="hidden md:block w-[240px] lg:w-[280px] xl:w-[320px] flex-shrink-0 sticky top-[140px] z-30 self-start">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                <FilterSidebar
                  setResults={setResults}
                  setProducts={setProducts}
                  setFiltersApplied={setFiltersApplied}
                  typeKey={""}
                  setCurrentFilterType={setCurrentFilterType}
                  setIsSearching={setIsSearching}
                  setCurrentQuery={setCurrentQuery}
                  selectedPublicFlag={selectedPublicFlag}
                  setSelectedPublicFlag={setSelectedPublicFlag}
                  searchQuery={query}
                  setCategoryData={setCategoryData}
                  setSeoData={setSeoData}
                  setIsSubcategorySEO={setIsSubcategorySEO}
                />
              </div>
            </div>

            {/* Main Content (Right) - min-w-0 prevents flex items from overflowing their container */}
            <div className="flex-grow min-w-0 max-w-full">
              {/* Public Flags Interactive Pills - Parallel to Filter Sidebar */}
              <div className="mb-8 mt-4">
                <PublicFlags 
                  selectedFlag={selectedPublicFlag} 
                  onSelectFlag={setSelectedPublicFlag} 
                />
              </div>

              <div className={`mt-0 transition-opacity duration-300 ${isSearching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <ProductGrid
                  productDetails={results}
                  pagination={products}
                  setResults={setResults}
                  filtersApplied={filtersApplied}
                  typeKey={""}
                  query={currentQuery}
                  searchTerm={query}
                  getProducts={getInitialProducts}
                  bottomContent={
                    <>
                      <div className="py-8">
                        <TrustBadges />
                      </div>
                      {seoData && (
                        <CategoryStaticSEO 
                          categoryDataFromAPI={seoData} 
                          isSubcategory={isSubcategorySEO} 
                        />
                      )}
                      <RecentlyViewedProducts />
                      <Blog categoryId={2} />
                    </>
                  }
                />
                {isSearching && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#375421]"></div>
                  </div>
                )}
              </div>

              <div className="mt-16 space-y-16">
                {/* Content moved to bottomContent of ProductGrid */}
              </div>
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
            typeKey={""}
            setCurrentFilterType={setCurrentFilterType}
            setIsSearching={setIsSearching}
            setCurrentQuery={setCurrentQuery}
            selectedPublicFlag={selectedPublicFlag}
            setSelectedPublicFlag={setSelectedPublicFlag}
            isMobile={true}
            searchQuery={query}
            setCategoryData={setCategoryData}
            setSeoData={setSeoData}
            setIsSubcategorySEO={setIsSubcategorySEO}
          />
        </Box>
      </SwipeableDrawer>

      <HomepageSchema />
      <StoreSchema />
    </>
  );
}

export default PlantCare;
