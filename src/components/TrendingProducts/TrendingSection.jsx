'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";
import ProductCard from "../Shared/ProductCard";

/**
 * TrendingSection Component
 * Displays trending, featured, and bestseller products with tab switching.
 * Uses the main filter endpoint via useHomeProducts hook.
 */
export const TrendingSection = ({
  initialTrending,
  initialFeatured,
  initialBestseller,
  initialLatest,
  publicFlags = []
}) => {
  const [selectedTab, setSelectedTab] = useState("bestseller");
  const accessToken = useSelector(selectAccessToken);
  const [visibleCount, setVisibleCount] = useState(8);

  // Map selected tab to API filters dynamically generated from publicFlags SSR Array
  const currentFilters = useMemo(() => {
    const getId = (name) => publicFlags?.find(f => f.name.toLowerCase().includes(name.toLowerCase()))?.id || null;
    
    if (selectedTab === "featured") return { flag: getId('featured') || 2 };
    if (selectedTab === "bestseller") return { flag: getId('best_seller') || getId('best seller') || 4 };
    if (selectedTab === "latest") return { flag: getId('latest') || 3 };
    // Default to trending
    return { flag: getId('trending') || 6 };
  }, [selectedTab, publicFlags]);



  const initialDataForTab = useMemo(() => {
    if (selectedTab === "featured") return initialFeatured;
    if (selectedTab === "bestseller") return initialBestseller;
    if (selectedTab === "latest") return initialLatest;
    return initialTrending;
  }, [selectedTab, initialTrending, initialFeatured, initialBestseller, initialLatest]);


  const { data: rawProducts = [], isLoading, refetch } = useHomeProducts(
    accessToken,
    currentFilters,
    initialDataForTab
  );

  const productsDetails = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts && typeof rawProducts === 'object') {
      return rawProducts.results || rawProducts.products || [];
    }
    return [];
  }, [rawProducts]);

  const visibleProducts = useMemo(() => {
    return productsDetails.slice(0, visibleCount);
  }, [productsDetails, visibleCount]);

  if (isLoading && !initialDataForTab) {
    return (
      <div className="py-16 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-10" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 w-[300px] h-[450px] bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-[#faf9f6] overflow-hidden">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="text-left animate-fade-in-up">
            <span className="text-[10px] md:text-[11px] font-bold text-[#1a1f14]/40 uppercase tracking-[0.2em] mb-3 block">
              Curated Selection
            </span>
            <h2 className="text-[32px] md:text-[48px] font-serif text-[#1a1f14] leading-tight flex flex-wrap gap-x-3 items-baseline mb-4">
              {selectedTab === 'featured' ? 'Featured' :
                selectedTab === 'bestseller' ? 'Best Selling' :
                  selectedTab === 'latest' ? 'New' : 'Trending'}
              <span className="italic font-normal text-[#375421]">
                {selectedTab === 'featured' ? 'Plants in Bangalore' :
                  selectedTab === 'bestseller' ? 'Plants in Bangalore' :
                    selectedTab === 'latest' ? 'Arrivals in Bangalore' : 'Now in Bangalore'}
              </span>
            </h2>
            <p className="text-[14px] md:text-[15px] text-[#1a1f14]/60 font-medium max-w-lg">
              {selectedTab === 'latest'
                ? "Discover our freshest additions, curated for your home."
                : "India's most-loved plants — chosen by 12,000+ gardeners."}
            </p>
          </div>

          <div className="w-full max-w-sm md:max-w-md flex-shrink-0 animate-fade-in order-last md:order-none">
            <div className="bg-white/40 md:bg-white/60 backdrop-blur-xl rounded-full p-1 border border-[#1a1f14]/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] md:overflow-visible overflow-hidden">
              <div className="grid grid-cols-4 items-center h-11 md:h-12">
                {[
                  { id: "bestseller", label: "Bestseller" },
                  { id: "featured", label: "Featured" },
                  { id: "trending", label: "Trending" },
                  { id: "latest", label: "New Arrivals" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`h-full w-full rounded-full text-[9px] md:text-[10px] font-bold uppercase transition-all duration-500 ${selectedTab === tab.id
                      ? "bg-[#1a3d0a] text-white shadow-[0_4px_12px_rgba(26,61,10,0.3)] scale-[0.98] tracking-normal"
                      : "text-[#1a1f14]/50 hover:text-[#1a3d0a] hover:bg-black/[0.03] tracking-[0.1em] md:tracking-[0.2em]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standardized Grid Layout Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {visibleProducts.map((product, index) => (
            <div
              key={product?.id || index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <ProductCard product={product} priority={index === 0} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href={`/shop/?${(() => {
            const f = selectedTab === 'featured' ? publicFlags?.find(f => f.name.toLowerCase().includes('featured')) :
                     selectedTab === 'bestseller' ? publicFlags?.find(f => f.name.toLowerCase().includes('best')) :
                     selectedTab === 'latest' ? publicFlags?.find(f => f.name.toLowerCase().includes('latest')) :
                     publicFlags?.find(f => f.name.toLowerCase().includes('trending'));
            return f?.filter_key || f?.slug || (selectedTab === 'bestseller' ? 'is_best_seller' : `is_${selectedTab}`);
          })()}=true`}
          className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#375421] px-10 py-5 rounded-full border-2 border-[#375421]/10 hover:border-[#375421] hover:bg-[#375421] hover:text-white transition-all duration-500"
        >
          Explore the Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
        </Link>
      </div>
    </div>
  );
};

export default TrendingSection;
