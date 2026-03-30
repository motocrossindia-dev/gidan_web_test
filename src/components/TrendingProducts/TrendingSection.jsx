'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TrendingCard from "../Shared/ProductCard";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";
import { getProductUrl } from "../../utils/urlHelper";

export const TrendingSection = ({ initialTrending, initialFeatured, initialBestseller }) => {
  const [selectedTab, setSelectedTab] = useState("latest");
  const accessToken = useSelector(selectAccessToken);
  const [visibleCount, setVisibleCount] = useState(12);

  // Map selected tab to API filters
  const currentFilters = useMemo(() => {
    if (selectedTab === "featured") return { flag: "Featured" };
    if (selectedTab === "latest") return { flag: "Latest" };
    if (selectedTab === "bestseller") return { flag: "Bestsellers" };
    return { flag: "Trending" };
  }, [selectedTab]);

  const initialDataForTab = useMemo(() => {
    if (selectedTab === "featured") return initialFeatured;
    if (selectedTab === "latest") return initialTrending;
    if (selectedTab === "bestseller") return initialBestseller;
    return initialTrending;
  }, [selectedTab, initialTrending, initialFeatured, initialBestseller]);

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
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 gap-4">
          <div className="text-left animate-fade-in">
            <h2 className="text-[32px] md:text-[52px] font-serif text-[#1a1f14] leading-tight flex flex-wrap gap-x-3 items-baseline">
              Trending <span className="italic font-normal text-[#375421] transform -skew-x-6">right now</span>
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#1a1f14]/60 font-medium mt-3 max-w-xl">
              India&apos;s most-loved plants — chosen by 12,000+ happy gardeners.
            </p>
          </div>

          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[20px] shadow-sm border border-gray-100 self-start md:self-end">
            {[
              { id: "latest", label: "All" },
              { id: "featured", label: "Featured" },
              { id: "bestseller", label: "Bestseller" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-[14px] transition-all duration-500 ${
                  selectedTab === tab.id 
                  ? "bg-[#375421] text-white shadow-lg shadow-[#375421]/20 -translate-y-0.5" 
                  : "text-[#375421]/60 hover:text-[#375421] hover:bg-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="flex items-stretch gap-6 md:gap-8 overflow-x-auto pb-12 scrollbar-hide px-2 -mx-2">
          {visibleProducts.map((product, index) => (
            <div key={product?.id || index} className="shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] md:w-[300px] animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <TrendingCard
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

        <div className="flex justify-center mt-4">
          <Link
            href={
              selectedTab === "featured" ? "/featured/" :
                selectedTab === "bestseller" ? "/bestseller/" :
                  selectedTab === "latest" ? "/latest/" :
                    "/trending/"
            }
            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#375421] px-10 py-4 rounded-full border-2 border-[#375421]/10 hover:border-[#375421] hover:bg-[#375421] hover:text-white transition-all duration-500 shadow-sm"
          >
            Explore the Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
