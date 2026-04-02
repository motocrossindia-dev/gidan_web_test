'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  getProducts,
  categorySlug: propCategorySlug,
  subcategorySlug: propSubcategorySlug,
  bottomContent = null,
  searchTerm = "",
  hidePagination = false,
}) => {

  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(null);
  const [nextUrl, setNextUrl] = useState(pagination?.next || null);
  const [prevUrl, setPrevUrl] = useState(pagination?.previous || null);

  // Initialize from URL or default to 1
  const initialPage = parseInt(searchParams.get('page') || '1');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 12; // Lowered to make pagination visible

  // Calculate total pages
  const totalCount = pagination?.count ?? productDetails?.length ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Keep nextUrl/prevUrl synced when parent gives new pagination (filter change resets page)
  useEffect(() => {
    setNextUrl(pagination?.next || null);
    setPrevUrl(pagination?.previous || null);
    setCurrentPage(1);
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
  const fetchPage = useCallback(async (pageNumber, isArrow = false) => {
    if (loading) return;

    setLoading(true);
    if (!isArrow) {
      setLoadingPage(pageNumber);
    }

    try {
      // Construct URL based on current filters and page number
      // We need to preserve existing search params if possible, 
      // but usually the backend expects page/page_size
      let url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?page_size=${pageSize}&page=${pageNumber}`;

      // Append filters if they exist in the current URL or props
      if (query) {
        url += `&${query}`;
      }

      const res = await axiosInstance.get(url);

      if (res?.status === 200) {
        const newProducts = res.data?.results || res.data?.products || [];

        if (Array.isArray(newProducts)) {
          setResults(newProducts);
          setNextUrl(res.data.next || null);
          setPrevUrl(res.data.previous || null);
          setCurrentPage(pageNumber);

          // Update URL strictly
          const params = new URLSearchParams(searchParams);
          params.set('page', pageNumber.toString());
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
          // Only scroll after updating state
          setTimeout(() => {
            const gridTop = document.getElementById('product-grid-container');
            if (gridTop) {
              const headerOffset = 150; // Adjust for your sticky header height
              const elementPosition = gridTop.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }, 0);
        }
      }
    } catch (err) {
      console.error("Error fetching page:", err);
      setNextUrl(null);
      setPrevUrl(null);
    } finally {
      setLoading(false);
      setLoadingPage(null);
    }
  }, [loading, setResults, query, pageSize]);

  // Compute "Showing X–Y of Z" display string
  const showingFrom = productDetails?.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const showingTo = (currentPage - 1) * pageSize + (productDetails?.length ?? 0);
  const remainingCount = Math.max(0, totalCount - showingTo);

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return (
      <div className="flex flex-col items-center gap-8 mt-12 mb-8">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Previous Arrow */}
          <button
            onClick={() => currentPage > 1 && fetchPage(currentPage - 1, true)}
            disabled={currentPage === 1 || loading}
            className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 relative ${
              currentPage === 1 || loading
              ? "border-gray-100 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-600 hover:border-[#375421] hover:text-[#375421] hover:scale-110"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && fetchPage(page, false)}
              disabled={page === '...' || page === currentPage || loading}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 text-sm font-bold transition-all duration-300 relative ${
                page === currentPage
                ? "bg-[#375421] text-white border-[#375421] shadow-lg shadow-[#375421]/30 scale-110"
                : page === '...'
                  ? "border-transparent text-gray-400 cursor-default"
                  : "border-gray-100 text-gray-500 hover:border-[#375421] hover:text-[#375421] hover:bg-gray-50"
              }`}
            >
              {loading && loadingPage === page ? (
                <div className={`w-4 h-4 border-2 ${page === currentPage ? 'border-white' : 'border-[#375421]'} border-t-transparent rounded-full animate-spin mx-auto`}></div>
              ) : (
                page
              )}
            </button>
          ))}

          {/* Next Arrow */}
          <button
            onClick={() => currentPage < totalPages && fetchPage(currentPage + 1, true)}
            disabled={currentPage === totalPages || loading}
            className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 relative ${
              currentPage === totalPages || loading
              ? "border-gray-100 text-gray-300 cursor-not-allowed"
              : "border-gray-200 text-gray-600 hover:border-[#375421] hover:text-[#375421] hover:scale-110"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="product-grid-container" className="mt-4 p-0 md:px-2 lg:px-4 relative w-full max-w-full mx-auto z-0 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6 px-1 md:px-2 w-full">
        <h2 className="text-[10px] md:text-sm lg:text-base text-gray-500 font-medium">
          {productDetails?.length > 0 ? (
            <>
              Showing {showingFrom}–{showingTo} of {totalCount} products
              {searchTerm && (
                <> for <span className="text-[#375421] font-bold">"{searchTerm}"</span></>
              )}
            </>
          ) : (
            searchTerm ? `No products found for "${searchTerm}"` : "No products found"
          )}
        </h2>
        {filtersApplied && productDetails?.length > 0 && (
          <span className="text-[10px] md:text-xs text-bio-green font-bold uppercase tracking-wider">
            Filters Active
          </span>
        )}
      </div>

      {productDetails?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center w-full px-4">
            <p className="text-gray-500 text-lg mb-2">No products match your filters</p>
            <p className="text-gray-400 text-sm">Try adjusting your filter criteria</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 lg:gap-8 justify-items-center font-sans w-full max-w-full">
          {productDetails?.map((product, index) => {
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
                  price={product?.selling_price}
                  imageUrl={product?.image}
                  userRating={product?.product_rating?.avg_rating}
                  ratingNumber={product?.product_rating?.num_ratings}
                  product={product}
                  mrp={product?.mrp}
                  ribbon={product?.ribbon}
                  inWishlist={product?.is_wishlist}
                  inCart={product?.is_cart}
                  getProducts={getProducts || pagination?.fetchProducts}
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* Trust Section and Bottom Content - Now above pagination */}
      {bottomContent && (
        <div className="mt-12">
          {bottomContent}
        </div>
      )}

      {/* Pagination Controls - Conditionally hidden */}
      {!hidePagination && totalPages > 1 && renderPagination()}

    </div>
  );
};

export default ProductGrid;
