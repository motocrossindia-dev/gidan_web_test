'use client';

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import FilterSidebar from "../Featured/FilterSidebar";
import ProductGrid from "../../../components/Shared/ProductGrid";
import PublicFlags from "../../../components/Shared/PublicFlags";
import CategoryHero from "../../../components/Shared/CategoryHero";
import InfoCards from "../../../components/Shared/InfoCards";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import CheckoutStores from "./CheckoutStores";
import { FiFilter } from "react-icons/fi";
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import { Typography, SwipeableDrawer, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const INFO_CARDS = [
  {
    id: 1,
    title: "100% Secure Payment",
    description: "Your security is our top priority. We use industry-standard encryption to protect your data.",
    icon: "ShieldCheck",
  },
  {
    id: 2,
    title: "Fast Delivery",
    description: "Experience lightning-fast shipping. We ensure your orders reach you in record time.",
    icon: "Truck",
  },
  {
    id: 3,
    title: "Satisfaction Guaranteed",
    description: "Love it or return it. We stand by the quality of our products with a no-hassle guarantee.",
    icon: "Heart",
  },
];

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

function PlantCare() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState({ count: 0, next: null, previous: null });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedPublicFlag, setSelectedPublicFlag] = useState(null);
  const [currentFilterType, setCurrentFilterType] = useState("plant");

  // Construct dynamic SEO/Hero data for search results
  const searchSeoData = useMemo(() => ({
    category_info: {
      category_name: `SEARCH: ${query?.toUpperCase()}`,
      category_description: query ? `Browse our collection of products matching your search for "${query}".` : `Explore our collection of premium plants and garden essentials.`,
      category_image: "https://gidan-web.s3.ap-south-1.amazonaws.com/category-hero/search-hero.webp",
      cat_mob_image: "https://gidan-web.s3.ap-south-1.amazonaws.com/category-hero/search-mobile.webp",
    }
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
      const response = await axiosInstance.get(
        `/filters/main_productsFilter/?search=${query}&page_size=12`
      );
      if (response.status === 200) {
        setResults(response.data.results || []);
        setProducts({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
        setCurrentQuery(`search=${query}`);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    getInitialProducts();
    window.scrollTo(0, 0);
  }, [getInitialProducts]);

  return (
    <>
      <CategoryHero 
        data={searchSeoData} 
        breadcrumb={{
          items: [],
          currentPage: `SEARCH: ${query?.toUpperCase()}`
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
                  typeKey={currentFilterType}
                  setCurrentFilterType={setCurrentFilterType}
                  setIsSearching={setIsSearching}
                  setCurrentQuery={setCurrentQuery}
                  selectedPublicFlag={selectedPublicFlag}
                  setSelectedPublicFlag={setSelectedPublicFlag}
                  searchQuery={query}
                />
              </div>
            </div>

            {/* Main Content (Right) */}
            <div className="flex-grow">
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
                  typeKey={currentFilterType}
                  query={currentQuery}
                  searchTerm={query}
                  getProducts={getInitialProducts}
                  bottomContent={<InfoCards cards={INFO_CARDS} />}
                />
                {isSearching && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#375421]"></div>
                  </div>
                )}
              </div>

              {/* Additional Sections */}
              <div className="mt-16 space-y-16">
                <RecentlyViewedProducts />
                <CheckoutStores />
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
            typeKey={currentFilterType}
            setCurrentFilterType={setCurrentFilterType}
            setIsSearching={setIsSearching}
            setCurrentQuery={setCurrentQuery}
            selectedPublicFlag={selectedPublicFlag}
            setSelectedPublicFlag={setSelectedPublicFlag}
            isMobile={true}
            searchQuery={query}
          />
        </Box>
      </SwipeableDrawer>

      <HomepageSchema />
      <StoreSchema />
    </>
  );
}

export default PlantCare;
