'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from "./ProductCard";
import axiosInstance from '../../Axios/axiosInstance';
import { getProductUrl } from "../../utils/urlHelper";


/**
 * Reusable Recently Viewed Products Component - Universal List-Style Card
 */
const RecentlyViewedProducts = ({ title = "Recently Viewed" }) => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/recentlyViewed/`);
      setProducts(response?.data?.data?.products || []);
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);


  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 px-4 md:px-8 max-w-full mx-auto mb-20 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h2 className="text-[24px] md:text-[32px] font-serif font-bold text-[#1a1f14]">
          {title}
        </h2>
        <Link 
          href="/shop" 
          className="text-[11px] font-bold text-[#2d5a1b] hover:gap-2 flex items-center gap-1 tracking-widest transition-all uppercase"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex items-stretch gap-4 md:gap-8 overflow-x-auto pb-8 scrollbar-hide px-1">
        {products.slice(0, 12).map((product) => (
          <div key={product?.id} className="shrink-0 w-[220px] xs:w-[240px] sm:w-[280px] md:w-[300px]">
            <ProductCard
              name={product?.name}
              price={Math.round(product?.selling_price)}
              imageUrl={product?.image}
              userRating={product?.product_rating?.avg_rating}
              ratingNumber={product?.product_rating?.num_ratings}
              product={product}
              mrp={Math.round(product?.mrp)}
              ribbon={product?.ribbon}
              getProducts={getProducts}
            />
          </div>
        ))}
      </div>
    </div>
  );
};



export default RecentlyViewedProducts;
