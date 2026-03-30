'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";
import ProductCard from "../Shared/ProductCard";

/**
 * SeasonalSection Component
 * Displays seasonal products in a premium horizontal scroll layout with tab switching.
 * Follows the same pattern as TrendingSection but for seasonal collections.
 */
export const SeasonalSection = ({ initialSeasonal }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const accessToken = useSelector(selectAccessToken);

  // Map selected tab to API filters
  // All tabs consistently use is_seasonal_collection=true
  const currentFilters = useMemo(() => {
    const baseFilters = { is_seasonal_collection: true };
    if (selectedTab === "trending") return { ...baseFilters, is_trending: true };
    if (selectedTab === "featured") return { ...baseFilters, is_featured: true };
    if (selectedTab === "bestseller") return { ...baseFilters, is_best_seller: true };
    return baseFilters; // "all"
  }, [selectedTab]);

  // Use initial data only for the default "all" tab to ensure instant first render
  const initialDataForTab = useMemo(() => {
    if (selectedTab === "all") return initialSeasonal;
    return undefined;
  }, [selectedTab, initialSeasonal]);

  // Fetch seasonal products
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

  if (isLoading && productsDetails.length === 0 && !initialDataForTab) {
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
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-8">
          <div className="text-left animate-fade-in flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f3fceb] text-[#375421] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#375421]/10 shadow-sm">
              LIMITED TIME
            </span>
            <h2 className="text-[32px] md:text-[48px] font-serif text-[#1a1f14] leading-tight mb-4 flex flex-wrap gap-x-3 items-baseline">
              Seasonal <span className="italic font-normal text-[#375421] transform -skew-x-6">deals & collections</span>
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#1a1f14]/60 font-medium max-w-xl leading-relaxed">
              Handpicked collections for every kind of plant lover and every budget.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[20px] shadow-sm border border-gray-100">
              {[
                { id: "all", label: "All" },
                { id: "trending", label: "Trending" },
                { id: "featured", label: "Featured" },
                { id: "bestseller", label: "Bestseller" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-[14px] transition-all duration-500 ${
                    selectedTab === tab.id 
                    ? "bg-[#375421] text-white shadow-lg shadow-[#375421]/20 -translate-y-0.5" 
                    : "text-[#375421]/60 hover:text-[#375421] hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <Link
              href="/seasonal/"
              className="group flex items-center gap-2 text-[12px] font-bold text-[#375421] hover:text-[#1a1f14] transition-colors duration-300"
            >
              All offers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        {productsDetails.length > 0 ? (
          <div className="flex items-stretch gap-6 md:gap-8 overflow-x-auto pb-8 scrollbar-hide px-2 -mx-2">
            {productsDetails.map((product, index) => (
              <div 
                key={product?.id || index} 
                className="shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] animate-fade-in-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  name={product?.name}
                  price={Math.round(product?.selling_price)}
                  imageUrl={product?.image}
                  userRating={product?.product_rating?.avg_rating}
                  ratingNumber={product?.product_rating?.num_ratings}
                  mrp={Math.round(product?.mrp)}
                  ribbon={product.ribbon}
                  getProducts={refetch}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-white/30">
            <p className="text-gray-400 font-serif italic">No seasonal products found for {selectedTab}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalSection;
