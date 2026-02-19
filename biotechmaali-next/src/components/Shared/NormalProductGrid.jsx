'use client';

import React, { useEffect, useRef, useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance";

/**
 * Normal Product Grid Component (without filters)
 * Displays products in a 4-column grid with infinite scroll
 * Used for pages without filter functionality
 */
const NormalProductGrid = ({
  productDetails = [],
  pagination = {},
  setResults,
  query
}) => {
  const navigate = useNavigate();
  const observer = useRef(null);

  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(pagination?.next || null);
  const [hasMore, setHasMore] = useState(Boolean(pagination?.next));

  // Keep nextUrl/hasMore synced when parent gives new pagination
  useEffect(() => {
    setNextUrl(pagination?.next || null);
    setHasMore(Boolean(pagination?.next));
  }, [pagination?.next, query]);

  const handleProductClick = (product) => {
    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    // All products have category, subcategory, and product slug
    navigate(`/${category_slug}/${sub_category_slug}/${product.slug}/`, {
      state: {
        product_id: product.id,
        category_slug: category_slug,
        sub_category_slug: sub_category_slug
      }
    });
    
    // Scroll to top when navigating to product
    window.scrollTo(0, 0);
  };

  // Fetch next page and append results
  const fetchNextPage = useCallback(async () => {
    if (!nextUrl || loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.get(nextUrl);

      if (res?.status === 200) {
        const newProducts = res.data?.results || res.data?.products || [];

        if (Array.isArray(newProducts) && newProducts.length > 0) {
          setResults((prev = []) => {
            const existingIds = new Set(prev.map((p) => p?.id || p?.prod_id));
            const merged = [...prev];

            for (const item of newProducts) {
              const itemId = item?.id || item?.prod_id;
              if (!existingIds.has(itemId)) {
                merged.push(item);
                existingIds.add(itemId);
              }
            }

            return merged;
          });

          setNextUrl(res.data.next || null);
          setHasMore(Boolean(res.data.next));
        } else {
          setHasMore(false);
          setNextUrl(null);
        }
      } else {
        setHasMore(false);
        setNextUrl(null);
      }
    } catch (err) {
      console.error("Error fetching next products:", err);
      setHasMore(false);
      setNextUrl(null);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading, setResults]);

  // Attach observer to the LAST product card
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && hasMore) {
            fetchNextPage();
          }
        },
        { root: null, rootMargin: "0px 0px -200px 0px", threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchNextPage]
  );

  return (
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16 relative z-10">
      <div className="flex justify-center items-center mb-4">
        {/* <h2 className="text-xs md:text-lg text-gray-500 font-normal">
          {productDetails?.length > 0
            ? `Showing ${productDetails?.length} of ${pagination?.count ?? productDetails?.length} products`
            : "No products found"}
        </h2> */}
      </div>

      {productDetails?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Please check back later</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="px-4 md:px-6 max-w-7xl w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center font-sans">
              {productDetails?.map((product, index) => {
                const isLast = index === productDetails.length - 1;
                const key = product?.prod_id || product?.id || index;

                return (
                  <div
                    key={key}
                    ref={isLast ? lastProductRef : null}
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer w-full"
                  >
                    <ProductCard
                      name={product?.name}
                      price={Math.round(product?.selling_price)}
                      imageUrl={product?.image}
                      userRating={product?.product_rating?.avg_rating}
                      ratingNumber={product?.product_rating?.num_ratings}
                      product={product}
                      mrp={Math.round(product?.mrp)}
                      ribbon={product?.ribbon}
                      inWishlist={product?.is_wishlist}
                      inCart={product?.is_cart}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-4">
          <p className="text-gray-500 text-sm">Loading more products...</p>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && !loading && productDetails?.length > 0 && (
        <div className="flex justify-center mt-4">
          {/* <p className="text-gray-500 text-sm">You've reached the end.</p> */}
        </div>
      )}
    </div>
  );
};

export default NormalProductGrid;
