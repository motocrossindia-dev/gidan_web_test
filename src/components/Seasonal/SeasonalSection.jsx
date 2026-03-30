'use client';

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../Shared/ProductCard";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";

/**
 * SeasonalSection Component
 * Displays seasonal products in a premium horizontal scroll layout.
 * Featured after the second dynamic section.
 */
export const SeasonalSection = () => {
  const accessToken = useSelector(selectAccessToken);

  // Fetch seasonal products
  const { data: rawProducts = [], isLoading, refetch } = useHomeProducts(
    accessToken,
    { is_seasonal_collection: true }
  );

  const productsDetails = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;
    if (rawProducts && typeof rawProducts === 'object') {
      return rawProducts.results || rawProducts.products || [];
    }
    return [];
  }, [rawProducts]);

  if (isLoading && productsDetails.length === 0) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
           <div className="h-12 w-64 bg-gray-100 rounded animate-pulse mb-4" />
           <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mb-10" />
           <div className="flex gap-6 overflow-hidden">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="shrink-0 w-[280px] h-[400px] bg-gray-50 rounded-3xl animate-pulse" />
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (!isLoading && productsDetails.length === 0) return null;

  return (
    <div className="py-16 bg-white overflow-hidden">
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left animate-fade-in flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f3fceb] text-[#375421] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#375421]/10">
              LIMITED TIME
            </span>
            <h2 className="text-[32px] md:text-[48px] font-serif text-[#1a1f14] leading-tight mb-4">
              Seasonal <span className="italic font-normal text-[#375421] transform -skew-x-6">deals & collections</span>
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#1a1f14]/60 font-medium max-w-xl leading-relaxed">
              Handpicked collections for every kind of plant lover and every budget.
            </p>
          </div>

          <div className="flex shrink-0">
            <Link
              href="/offers/"
              className="group flex items-center gap-2 text-[12px] font-bold text-[#375421] hover:text-[#1a1f14] transition-colors duration-300"
            >
              All offers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
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
      </div>
    </div>
  );
};

export default SeasonalSection;
