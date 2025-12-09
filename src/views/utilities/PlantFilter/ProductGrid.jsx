import React, { useEffect, useRef, useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Axios/axiosInstance";

const ProductGrid = ({
                       productDetails = [],
                       pagination = {},
                       setResults,
                       query,
                       filtersApplied = false
                     }) => {
  const navigate = useNavigate();
  const observer = useRef(null);

  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(pagination?.next || null);
  const [hasMore, setHasMore] = useState(Boolean(pagination?.next));

  // Keep nextUrl/hasMore synced when parent gives new pagination
  useEffect(() => {
    if (filtersApplied) {
      setNextUrl(null);
      setHasMore(false);
    } else {
      setNextUrl(pagination?.next || null);
      setHasMore(Boolean(pagination?.next));
    }
  }, [pagination?.next, query, filtersApplied]);

  const handleProductClick = (productId) => {
    navigate("/productdata/" + productId);
  };

  // Fetch next page and append results (only if no filters applied)
  const fetchNextPage = useCallback(async () => {
    if (!nextUrl || loading || filtersApplied) {
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
  }, [nextUrl, loading, setResults, filtersApplied]);

  // Attach observer to the LAST product card (only if no filters)
  const lastProductRef = useCallback(
      (node) => {
        if (loading || filtersApplied) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (entry.isIntersecting && hasMore && !filtersApplied) {
                fetchNextPage();
              }
            },
            { root: null, rootMargin: "0px 0px -200px 0px", threshold: 0.1 }
        );

        if (node) observer.current.observe(node);
      },
      [loading, hasMore, fetchNextPage, filtersApplied]
  );

  return (
      <div className="mt-8 p-2 bg-white rounded-md md:ml-16 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs md:text-lg text-gray-500 font-normal">
            {productDetails?.length > 0
                ? `Showing ${productDetails?.length} of ${pagination?.count ?? productDetails?.length} products`
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center font-sans">
              {productDetails?.map((product, index) => {
                const isLast = index === productDetails.length - 1;
                const key = product?.prod_id || product?.id || index;

                return (
                    <div
                        key={key}
                        ref={!filtersApplied && isLast ? lastProductRef : null}
                        onClick={() => handleProductClick(product?.prod_id || product?.id)}
                        className="cursor-pointer"
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
        )}

        {/* Loading indicator - only show if no filters applied */}
        {loading && !filtersApplied && (
            <div className="flex justify-center mt-4">
              <p className="text-gray-500 text-sm">Loading more products...</p>
            </div>
        )}

        {/* End of results indicator */}
        {!hasMore && !loading && productDetails?.length > 0 && !filtersApplied && (
            <div className="flex justify-center mt-4">
              <p className="text-gray-500 text-sm">You've reached the end.</p>
            </div>
        )}

        {/* Show total count when filters are applied */}
        {filtersApplied && productDetails?.length > 0 && (
            <div className="flex justify-center mt-4 p-3 bg-blue-50 rounded">
              <p className="text-blue-700 text-sm">
                Showing all {productDetails?.length} filtered results
              </p>
            </div>
        )}
      </div>
  );
};

export default ProductGrid;
// ============================================================
// import React, { useEffect, useRef, useCallback, useState } from "react";
// import ProductCard from "./ProductCard";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
//
// const ProductGrid = ({ productDetails = [], pagination = {}, setResults, query }) => {
//   const navigate = useNavigate();
//   const observer = useRef(null);
//
//   const [loading, setLoading] = useState(false);
//   const [nextUrl, setNextUrl] = useState(pagination?.next || null);
//   const [hasMore, setHasMore] = useState(Boolean(pagination?.next));
//
//   // Keep nextUrl/hasMore synced when parent gives new pagination (e.g., new search)
//   useEffect(() => {
//     setNextUrl(pagination?.next || null);
//     setHasMore(Boolean(pagination?.next));
//   }, [pagination?.next, query]);
//
//   const handleProductClick = (productId) => {
//     navigate("/productdata/" + productId);
//   };
//
//   // Fetch next page and append results (dedupe by id)
//   const fetchNextPage = useCallback(async () => {
//     if (!nextUrl || loading) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(nextUrl);
//       if (res?.status === 200 && Array.isArray(res.data?.products)) {
//         setResults((prev = []) => {
//           const existingIds = new Set(prev.map((p) => p?.id));
//           const merged = [...prev];
//           for (const item of res.data.products) {
//             if (!existingIds.has(item?.id)) {
//               merged.push(item);
//               existingIds.add(item?.id);
//             }
//           }
//           return merged;
//         });
//
//         setNextUrl(res.data.next || null);
//         setHasMore(Boolean(res.data.next));
//       } else {
//         setHasMore(false);
//         setNextUrl(null);
//       }
//     } catch (err) {
//       console.error("Error fetching next products:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [nextUrl, loading, setResults]);
//
//   // Attach observer to the LAST product card
//   const lastProductRef = useCallback(
//     (node) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();
//
//       // rootMargin negative bottom so the last item must be well inside viewport
//       observer.current = new IntersectionObserver(
//         (entries) => {
//           const entry = entries[0];
//           if (entry.isIntersecting && hasMore) {
//             fetchNextPage();
//           }
//         },
//         { root: null, rootMargin: "0px 0px -200px 0px", threshold: 0.1 }
//       );
//
//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, fetchNextPage]
//   );
//
//   return (
//     <div className="mt-8 p-2 bg-white rounded-md md:ml-16">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xs md:text-lg text-gray-500 font-normal">
//           {productDetails?.length > 0
//             ? `Showing ${productDetails?.length} of ${pagination?.count ?? productDetails?.length} products`
//             : "No products found"}
//         </h2>
//       </div>
//
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center font-sans">
//         {productDetails?.map((product, index) => {
//           const isLast = index === productDetails.length - 1;
//           const key = product?.id ?? index;
//           return (
//             <div
//               key={key}
//               ref={isLast ? lastProductRef : null}
//               onClick={() => handleProductClick(product?.id)}
//               className="cursor-pointer"
//             >
//               <ProductCard
//                 name={product?.name}
//                 price={Math.round(product?.selling_price)}
//                 imageUrl={product?.image}
//                 userRating={product?.product_rating?.avg_rating}
//                 ratingNumber={product?.product_rating?.num_ratings}
//                 product={product}
//                 mrp={Math.round(product?.mrp)}
//                 inWishlist={product?.is_wishlist}
//                 inCart={product?.is_cart}
//               />
//             </div>
//           );
//         })}
//       </div>
//
//       {/* Loading indicator */}
//       {loading && (
//         <div className="flex justify-center mt-4">
//           <p className="text-gray-500 text-sm">Loading more products...</p>
//         </div>
//       )}
//
//       {/* Optional: no more products indicator */}
//       {!hasMore && !loading && productDetails?.length > 0 && (
//         <div className="flex justify-center mt-4">
//           <p className="text-gray-500 text-sm">You've reached the end.</p>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default ProductGrid;
