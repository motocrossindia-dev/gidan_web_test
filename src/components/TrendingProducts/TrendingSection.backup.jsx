'use client';


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TrendingCard from "./../Shared/ProductCard";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import axiosInstance from "../../Axios/axiosInstance";


const TrendingSection = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const itemsPerSlide = 4;
  const navigate = useNavigate();
  const [productsDetails, setProductsDetails] = useState([]);
  const accessToken = useSelector(selectAccessToken);

  const [visibleCount, setVisibleCount] = useState(8);

  const getProducts = useCallback(async () => {
    try {
      if (accessToken) {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_API_URL}/product/homeProducts/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
        );
        if (response.status === 200) {
          setProductsDetails(response?.data?.data?.products);
        }
      } else {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_API_URL}/product/homeProducts/`);
        if (response.status === 200) {
          setProductsDetails(response?.data?.data?.products);
        }
      }
    } catch (error) {
      setProductsDetails([]);
    }
  }, [accessToken]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleProductClick = useCallback((product) => {
    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    // All products have category, subcategory, and product slug
    navigate(`/${category_slug}/${sub_category_slug}/${product.slug}/`, {
      state: {
        product_id: product.slug,
        category_slug:category_slug,
        sub_category_slug:sub_category_slug
      }
    });
    
    // Scroll to top when navigating to product
    window.scrollTo(0, 0);
  }, [navigate]);

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

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const ViewAll = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/product/viewAll`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );
      if (response.status === 200) {
        setProductsDetails(response?.data?.data?.products);
      }
    } catch (error) {
      setProductsDetails([]);
    }
  }, []);

  return (
      <div className="p-4 rounded-md font-sans md:bg-white">
        <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Trending Products</h2>

        <div className="flex justify-center mb-8">
          <button aria-label="Button"
                  onClick={() => setSelectedTab("")}
                  className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
          >
            All
          </button>
          <button aria-label="Button"
                  onClick={() => setSelectedTab("featured")}
                  className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "featured" ? "bg-bio-green text-white border-bio-green" : "text-black border-bio-green"} rounded mx-1`}
          >
            Featured
          </button>
          <button aria-label="Button"
                  onClick={() => setSelectedTab("latest")}
                  className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "latest" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
          >
            Latest
          </button>
          <button aria-label="Button"
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
                      getProducts={getProducts}
                      mrp={Math.round(product?.mrp)}
                      ribbon={product.ribbon}
                  />
                </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button aria-label="View all"
                  onClick={() => {
                    const route =
                      selectedTab === "featured" ? "/featured/" :
                      selectedTab === "bestseller" ? "/bestseller/" :
                      selectedTab === "latest" ? "/latest/" :
                      "/trending/";
                    navigate(route);
                  }}
                  className="bg-white text-bio-green w-[94px] h-[34px] border border-bio-green rounded mx-1"
          >
            View All
          </button>
        </div>
      </div>
  );
};

export default TrendingSection;
