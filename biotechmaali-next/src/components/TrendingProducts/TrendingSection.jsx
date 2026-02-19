'use client';

import { useRouter } from "next/navigation";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { useState, useEffect, useCallback, useMemo } from "react";
import TrendingCard from "./../Shared/ProductCard";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { useHomeProducts } from "../../hooks/useHomeProducts";

const TrendingSection = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const [visibleCount, setVisibleCount] = useState(8);

  // Use TanStack Query hook - shared cache with Home.jsx and SeasonalProduct.jsx
  const { data: productsDetails = [], isLoading, refetch } = useHomeProducts(accessToken);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 768) {
        setVisibleCount(4);
      } else {
        setVisibleCount(8);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const handleProductClick = useCallback((product) => {
    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    router.push(`/${category_slug}/${sub_category_slug}/${product.slug}/`, {
      state: {
        product_id: product.slug,
        category_slug: category_slug,
        sub_category_slug: sub_category_slug
      }
    });

    window.scrollTo(0, 0);
  }, [router]);

  const filteredProducts = useMemo(() => {
    return productsDetails.filter((product) => {
      if (selectedTab === "featured") {
        return product.is_featured;
      } else if (selectedTab === "latest") {
        return product.is_trending;
      } else if (selectedTab === "bestseller") {
        return product.is_best_seller;
      }
      return true;
    });
  }, [productsDetails, selectedTab]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  if (isLoading) {
    return (
      <div className="p-4 rounded-md font-sans md:bg-white">
        <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Trending Products</h2>
        {/* Filter tab skeletons */}
        <div className="flex justify-center mb-8 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 md:w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        {/* Product card skeletons */}
        <div className="max-w-7xl mx-auto px-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full max-w-[16rem] animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-40 sm:h-48 lg:h-[260px] w-full" />
                <div className="mt-3 space-y-2 px-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-100 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-md font-sans md:bg-white">
      <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Trending Products</h2>

      <div className="flex justify-center mb-8">
        <button
          aria-label="Button"
          onClick={() => setSelectedTab("")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
        >
          All
        </button>
        <button
          aria-label="Button"
          onClick={() => setSelectedTab("featured")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "featured" ? "bg-bio-green text-white border-bio-green" : "text-black border-bio-green"} rounded mx-1`}
        >
          Featured
        </button>
        <button
          aria-label="Button"
          onClick={() => setSelectedTab("latest")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "latest" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
        >
          Latest
        </button>
        <button
          aria-label="Button"
          onClick={() => setSelectedTab("bestseller")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "bestseller" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
        >
          Bestseller
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
          {visibleProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer"
            >
              <TrendingCard
                index={index}
                name={product?.name}
                price={Math.round(product?.selling_price)}
                oldPrice={Math.round(product?.oldPrice)}
                imageUrl={product?.image}
                product={product}
                userRating={product?.product_rating?.avg_rating}
                ratingNumber={product?.product_rating?.num_ratings}
                inWishlist={product?.is_wishlist}
                inCart={product?.is_cart}
                getProducts={refetch}
                mrp={Math.round(product?.mrp)}
                ribbon={product.ribbon}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          aria-label="View all"
          onClick={() => {
            const route =
              selectedTab === "featured" ? "/featured/" :
              selectedTab === "bestseller" ? "/bestseller/" :
              selectedTab === "latest" ? "/latest/" :
              "/trending/";
            router.push(route);
          }}
          className="bg-white text-bio-green-text w-[94px] h-[34px] border border-bio-green rounded mx-1 hover:bg-bio-green hover:text-white transition-colors"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default TrendingSection;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// // import TrendingCard from "./../Shared/ProductCard";
// import { useSelector } from "react-redux";
// import { selectAccessToken } from "../../redux/User/verificationSlice";
// import axiosInstance from "../../Axios/axiosInstance";
//
//
// const TrendingSection = () => {
//   const [selectedTab, setSelectedTab] = useState("");
//   const itemsPerSlide = 4;
//   const router = useRouter();
//   const [productsDetails, setProductsDetails] = useState([]);
//   const accessToken = useSelector(selectAccessToken);
//
//   const [visibleCount, setVisibleCount] = useState(8);
//
//   const getProducts = useCallback(async () => {
//     try {
//       if (accessToken) {
//         const response = await axiosInstance.get(
//             `${process.env.NEXT_PUBLIC_API_URL}/product/homeProducts/`,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//               },
//             }
//         );
//         if (response.status === 200) {
//           setProductsDetails(response?.data?.data?.products);
//         }
//       } else {
//         const response = await axiosInstance.get(
//             `${process.env.NEXT_PUBLIC_API_URL}/product/homeProducts/`);
//         if (response.status === 200) {
//           setProductsDetails(response?.data?.data?.products);
//         }
//       }
//     } catch (error) {
//       setProductsDetails([]);
//     }
//   }, [accessToken]);
//
//   useEffect(() => {
//     getProducts();
//   }, [getProducts]);
//
//   const handleProductClick = useCallback((product) => {
//     const category_slug = product?.category_slug;
//     const sub_category_slug = product?.sub_category_slug;
//
//     // All products have category, subcategory, and product slug
//     router.push(`/${category_slug}/${sub_category_slug}/${product.slug}/`, {
//       state: {
//         product_id: product.slug,
//         category_slug:category_slug,
//         sub_category_slug:sub_category_slug
//       }
//     });
//     
//     // Scroll to top when navigating to product
//     window.scrollTo(0, 0);
//   }, [navigate]);
//
//   const filteredProducts = useMemo(() => {
//     return productsDetails.filter((product) => {
//       if (selectedTab === "featured") {
//         return product.is_featured;
//       } else if (selectedTab === "latest") {
//         return product.is_trending;
//       } else if (selectedTab === "bestseller") {
//         return product.is_best_seller;
//       }
//       return true;
//     });
//   }, [productsDetails, selectedTab]);
//
//   useEffect(() => {
//     const updateVisibleCount = () => {
//       if (window.innerWidth <= 768) {
//         setVisibleCount(4);
//       } else {
//         setVisibleCount(8);
//       }
//     };
//
//     updateVisibleCount();
//     window.addEventListener("resize", updateVisibleCount);
//
//     return () => {
//       window.removeEventListener("resize", updateVisibleCount);
//     };
//   }, []);
//
//   const visibleProducts = useMemo(() => {
//     return filteredProducts.slice(0, visibleCount);
//   }, [filteredProducts, visibleCount]);
//
//   const ViewAll = useCallback(async () => {
//     try {
//       const response = await axiosInstance.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/product/viewAll`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//       );
//       if (response.status === 200) {
//         setProductsDetails(response?.data?.data?.products);
//       }
//     } catch (error) {
//       setProductsDetails([]);
//     }
//   }, []);
//
//   return (
//       <div className="p-4 rounded-md font-sans md:bg-white">
//         <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Trending Products</h2>
//
//         <div className="flex justify-center mb-8">
//           <button aria-label="Button"
//                   onClick={() => setSelectedTab("")}
//                   className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
//           >
//             All
//           </button>
//           <button aria-label="Button"
//                   onClick={() => setSelectedTab("featured")}
//                   className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "featured" ? "bg-bio-green text-white border-bio-green" : "text-black border-bio-green"} rounded mx-1`}
//           >
//             Featured
//           </button>
//           <button aria-label="Button"
//                   onClick={() => setSelectedTab("latest")}
//                   className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "latest" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
//           >
//             Latest
//           </button>
//           <button aria-label="Button"
//                   onClick={() => setSelectedTab("bestseller")}
//                   className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "bestseller" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
//           >
//             Bestseller
//           </button>
//         </div>
//
//         <div className="max-w-7xl mx-auto px-3">
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
//             {visibleProducts.map((product, index) => (
//                 <div
//                     key={index}
//                     onClick={() => handleProductClick(product)}
//                     className="cursor-pointer"
//                 >
//                   <TrendingCard
//                       index={index}
//                       name={product?.name}
//                       price={Math.round(product?.selling_price)}
//                       oldPrice={Math.round(product?.oldPrice)}
//                       imageUrl={product?.image}
//                       product={product}
//                       userRating={product?.product_rating?.avg_rating}
//                       ratingNumber={product?.product_rating?.num_ratings}
//                       inWishlist={product?.is_wishlist}
//                       inCart={product?.is_cart}
//                       getProducts={getProducts}
//                       mrp={Math.round(product?.mrp)}
//                       ribbon={product.ribbon}
//                   />
//                 </div>
//             ))}
//           </div>
//         </div>
//
//         <div className="flex justify-center mt-4">
//           <button aria-label="View all"
//                   onClick={() => {
//                     const route =
//                       selectedTab === "featured" ? "/featured/" :
//                       selectedTab === "bestseller" ? "/bestseller/" :
//                       selectedTab === "latest" ? "/latest/" :
//                       "/trending/";
//                     router.push(route);
//                   }}
//                   className="bg-white text-bio-green w-[94px] h-[34px] border border-bio-green rounded mx-1"
//           >
//             View All
//           </button>
//         </div>
//       </div>
//   );
// };
//
// export default TrendingSection;
// ========== END OLD CODE ==========
