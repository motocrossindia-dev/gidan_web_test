'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useRef, useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "../../Axios/axiosInstance";
import { getProductUrl, toSlugString } from "../../utils/urlHelper";
import { trackViewItemList, trackSelectItem } from "../../utils/ga4Ecommerce";


const ProductGrid = ({
  productDetails = [],
  pagination = {},
  setResults,
  query,
  filtersApplied = false,
  categorySlug: propCategorySlug,
  subcategorySlug: propSubcategorySlug,
}) => {

  const router = useRouter();

  const observer = useRef(null);

  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(pagination?.next || null);
  const [prevUrl, setPrevUrl] = useState(pagination?.previous || null);
  // Track current page offset for the "Showing X–Y of Z" display
  const [pageOffset, setPageOffset] = useState(0);

  // Keep nextUrl/prevUrl synced when parent gives new pagination (filter change resets page)
  useEffect(() => {
    setNextUrl(pagination?.next || null);
    setPrevUrl(pagination?.previous || null);
    // Reset offset to 0 when filter/category changes (new pagination object)
    setPageOffset(0);
  }, [pagination?.next, pagination?.previous, query]);

  // GA4: Track view_item_list when products are shown
  const listName = [propCategorySlug, propSubcategorySlug].filter(Boolean).join(' > ') || 'Product List';
  const prevProductIdsRef = useRef('');
  useEffect(() => {
    if (!productDetails || productDetails.length === 0) return;
    // Only fire when product list actually changes (avoid duplicate fires)
    const productIds = productDetails.map(p => p.id || p.prod_id).join(',');
    if (productIds === prevProductIdsRef.current) return;
    prevProductIdsRef.current = productIds;
    trackViewItemList(productDetails, listName);
  }, [productDetails, listName]);

  const handleProductClick = (product) => {
    const category_slug = toSlugString(product?.category_slug) || propCategorySlug;
    const sub_category_slug = toSlugString(product?.sub_category_slug) || propSubcategorySlug || "all";
    const product_slug = toSlugString(product?.slug) || product?.slug;

    if (!category_slug || !sub_category_slug || !product_slug) {
      console.warn('Missing slug fields, skipping navigation', { category_slug, sub_category_slug, product_slug });
      return;
    }

    // GA4: Track select_item when a product is clicked
    const productIndex = productDetails.findIndex(p => (p.id || p.prod_id) === (product.id || product.prod_id));
    trackSelectItem(product, listName, productIndex >= 0 ? productIndex : 0);

    // NEW: Use 3-segment URL pattern: /:categorySlug/:subcategorySlug/:productSlug/
    router.push(getProductUrl(product), {
      state: {
        product_id: product_slug,
        category_slug: category_slug,
        sub_category_slug: sub_category_slug
      }
    });


    // Scroll to top when navigating to product
    window.scrollTo(0, 0);
  };

  // Fetch specific page and replace results
  const fetchPage = useCallback(async (url, direction = 'next') => {
    if (!url || loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.get(url);

      if (res?.status === 200) {
        const newProducts = res.data?.results || res.data?.products || [];

        if (Array.isArray(newProducts)) {
          // Update offset: move forward or backward by current batch size
          setPageOffset((prev) =>
            direction === 'next'
              ? prev + productDetails.length
              : Math.max(0, prev - newProducts.length)
          );
          setResults(newProducts);
          setNextUrl(res.data.next || null);
          setPrevUrl(res.data.previous || null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.error("Error fetching page:", err);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      setLoading(false);
    }
  }, [loading, setResults, productDetails.length]);

  // Compute "Showing X–Y of Z" display string
  const showingFrom = productDetails?.length > 0 ? pageOffset + 1 : 0;
  const showingTo = pageOffset + (productDetails?.length ?? 0);
  const totalCount = pagination?.count ?? productDetails?.length ?? 0;

  return (
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16 relative z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs md:text-lg text-gray-500 font-normal">
          {productDetails?.length > 0
            ? `Showing ${showingFrom}–${showingTo} of ${totalCount} products`
            : "No products found"}
        </h2>
        {filtersApplied && productDetails?.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            Filters Active
          </span>
        )}
      </div>

      {productDetails?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">No products match your filters</p>
            <p className="text-gray-400 text-sm">Try adjusting your filter criteria</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center font-sans">
          {productDetails?.map((product, index) => {
            const isLast = index === productDetails.length - 1;
            const key = product?.prod_id || product?.id || index;

            return (
              <Link
                key={key}
                href={getProductUrl(product)}
                onClick={() => {
                  // GA4: Track select_item when a product is clicked
                  const productIndex = productDetails.findIndex(p => (p.id || p.prod_id) === (product.id || product.prod_id));
                  trackSelectItem(product, listName, productIndex >= 0 ? productIndex : 0);
                  window.scrollTo(0, 0);
                }}

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
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && productDetails?.length > 0 && (nextUrl || prevUrl) && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-4">
          <button
            onClick={() => fetchPage(prevUrl, 'prev')}
            disabled={!prevUrl || loading}
            className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${!prevUrl || loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-green-700"
              }`}
          >
            Previous
          </button>

          <button
            onClick={() => fetchPage(nextUrl, 'next')}
            disabled={!nextUrl || loading}
            className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${!nextUrl || loading
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-green-700"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center mt-8 mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
