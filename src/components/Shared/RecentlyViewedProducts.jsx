'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';
import ProductCard from "./ProductCard";
import axiosInstance from '../../Axios/axiosInstance';
import { getProductUrl } from "../../utils/urlHelper";


/**
 * Reusable Recently Viewed Products Component
 * Displays a grid of recently viewed products
 * Uses the reusable ProductCard component
 */
const RecentlyViewedProducts = () => {
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
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16 relative z-10">
      <h2 className="text-base font-semibold text-black mb-4">
        Recently Viewed
      </h2>

      {/* Product Grid - 4 columns layout matching ProductGrid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center font-sans">
        {products.map((product) => (
          <Link
            key={product?.id}
            href={getProductUrl(product)}
            onClick={() => window.scrollTo(0, 0)}

            className="cursor-pointer w-full"
          >
            <ProductCard
              name={product?.name}
              price={Math.round(product?.selling_price)}
              imageUrl={product?.image || "/fallback-image.jpg"}
              userRating={product?.product_rating?.avg_rating || 0}
              ratingNumber={product?.product_rating?.num_ratings}
              product={product}
              inCart={product?.is_cart}
              inWishlist={product?.is_wishlist}
              mrp={Math.round(product?.mrp)}
              ribbon={product?.ribbon}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
