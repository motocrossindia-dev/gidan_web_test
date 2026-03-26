'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from "./ProductCard";
import axiosInstance from '../../Axios/axiosInstance';
import { getProductUrl } from "../../utils/urlHelper";


/**
 * Reusable Recently Viewed Products Component
 * Displays a grid of recently viewed products
 * Uses the reusable ProductCard component
 */
const RecentlyViewedProducts = ({ title = "You might also love" }) => {
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

  const handleProductClick = (product) => {
    router.push(getProductUrl(product), {
      state: {
        product_id: product?.slug,
        category_slug: product?.category_slug,
        sub_category_slug: product?.sub_category_slug
      }
    });

    // Scroll to top when navigating to product
    window.scrollTo(0, 0);
  };


  if (products.length === 0) {
    return null; // Don't render if no products
  }

  return (
    <div className="mt-16 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif text-gray-900 italic">
            {title}
          </h2>
        </div>
        <Link 
          href="/shop" 
          className="flex items-center gap-1.5 text-sm font-bold text-[#375421] hover:underline uppercase tracking-wider"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {/* Product Grid - 4 columns layout matching ProductGrid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <div key={product?.id} className="w-full">
            <ProductCard
              name={product?.name}
              price={Math.round(product?.selling_price)}
              imageUrl={product?.image || "/fallback-image.jpg"}
              userRating={product?.product_rating?.avg_rating || 0}
              ratingNumber={product?.product_rating?.num_ratings}
              product={product}
              inCart={product?.is_cart}
              inWishlist={product?.is_wishlist}
              getProducts={getProducts}
              mrp={Math.round(product?.mrp)}
              ribbon={product?.ribbon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
