'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";
import axiosInstance from "../../Axios/axiosInstance";
import ProductCard from "../Shared/ProductCard";

/**
 * SeasonalSection Component
 * Displays seasonal products in a premium horizontal scroll layout with tab switching.
 * Follows the same pattern as TrendingSection but for seasonal collections.
 */
export const SeasonalSection = ({
  initialSeasonal,
  initialSeasonalBestseller,
  publicFlags = []
}) => {
  const accessToken = useSelector(selectAccessToken);

  // Use dynamic flag mapping if available, otherwise fallback
  // Extracted instantly from SSR publicFlags prop to prevent hydration mismatch
  const currentFilters = useMemo(() => {
    const seasonalFlagId = publicFlags?.find(f => f.name.toLowerCase().includes('seasonal'))?.id;
    return seasonalFlagId ? { flag: seasonalFlagId } : { is_seasonal_collection: true };
  }, [publicFlags]);

  // Use pre-fetched general seasonal data
  const initialDataForTab = initialSeasonal;

  // Static titles as requested
  const sectionContent = {
    title: "Seasonal",
    italic: "products & more",
    description: "Top-rated seasonal collections with proven growth results."
  };

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="text-left animate-fade-in flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f3fceb] text-[#375421] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#375421]/10 shadow-sm">
              LIMITED TIME
            </span>
            <h2 className="text-[32px] md:text-[48px] font-serif text-[#1a1f14] leading-tight mb-4 flex flex-wrap gap-x-3 items-baseline">
              {sectionContent.title} <span className="italic font-normal text-[#375421] transform -skew-x-6">{sectionContent.italic}</span>
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#1a1f14]/60 font-medium max-w-xl leading-relaxed">
              {sectionContent.description}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-6">
            <Link
              href={`/shop/?${(() => {
                const f = publicFlags?.find(f => f.name.toLowerCase().includes('seasonal'));
                return f?.filter_key || f?.slug || 'is_seasonal_collection';
              })()}=true`}
              className="group flex items-center gap-2 text-[12px] font-bold text-[#375421] hover:text-[#1a1f14] transition-colors duration-300"
            >
              All seasonal offers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Layout Container (Responsive: 2 columns mobile, 4 columns desktop) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {productsDetails.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
            {productsDetails.slice(0, 8).map((product, index) => (
              <div
                key={product?.id || index}
                className="animate-fade-in-up"
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
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-white/30">
            <p className="text-gray-400 font-serif italic">No seasonal products found at the moment.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SeasonalSection;
