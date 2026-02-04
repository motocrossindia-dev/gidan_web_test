import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import TrendingCard from "./TrendingCard";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import axiosInstance from "../../Axios/axiosInstance";
import convertToSlug from "../../utils/slugConverter";


const TrendingSection = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const itemsPerSlide = 4; // Display 4 items per slide on mobile view
  const navigate = useNavigate(); // Initialize the navigate function
  const [productsDetails, setProductsDetails] = useState([]);
  const accessToken = useSelector(selectAccessToken);

  const [visibleCount, setVisibleCount] = useState(8);

  const getProducts = async () => {

    try {
      if (accessToken) {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/product/homeProducts/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Include the user token for authentication
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
      console.error("Error fetching categories:", error);
      setProductsDetails([]); // Fallback to an empty array
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleProductClick = (product) => {
    console.log("id=========",product.id)
    navigate(`/products/${product.slug}/`,{
      state: {
        product_id: product.slug,
      }
    });
  };


  const filteredProducts = productsDetails.filter((product) => {
    if (selectedTab === "featured") {
      return product.is_featured;
    } else if (selectedTab === "latest") {
      return product.is_trending;
    } else if (selectedTab === "bestseller") {
      return product.is_best_seller;
    }
    return true; // Return all products when selectedTab is empty
  });



  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 768) {
        setVisibleCount(4); // Mobile view
      } else {
        setVisibleCount(8); // Desktop view
      }
    };

    // Initial check
    updateVisibleCount();

    // Listen for window resize events
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const ViewAll = async () => {
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
      console.error("Error fetching categories:", error);
      setProductsDetails([]); // Fallback to an empty array
    }
  };
  return (
<div className="p-4 rounded-md font-sans bg-gray-100 md:bg-white">
      <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">Trending Products</h2>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setSelectedTab("")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedTab("featured")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "featured" ? "bg-bio-green text-white border-bio-green" : "text-black border-bio-green"} rounded mx-1`}
        >
          Featured
        </button>
        <button
          onClick={() => setSelectedTab("latest")}
          className={`px-2 py-1 md:px-4 md:py-2 border-2 ${selectedTab === "latest" ? "bg-bio-green text-white border-bio-green" : "border-bio-green"} rounded mx-1`}
        >
          Latest
        </button>
        <button
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
              price={Math.round(product?.selling_price)}   // ✅ Rounded to integer
              oldPrice={Math.round(product?.oldPrice)}     // (optional) if you also want oldPrice rounded
              imageUrl={product?.image}
              product={product}
              userRating={product?.product_rating?.avg_rating}
              ratingNumber={product?.product_rating?.num_ratings}
              inWishlist={product?.is_wishlist}
              inCart={product?.is_cart}
              getProducts={getProducts}
              mrp={Math.round(product?.mrp)}               // (optional) round MRP too
              ribbon={product.ribbon}
            />

            </div>
          ))}
        </div>
      </div>


      <div className="flex justify-center mt-4">
        <button
          onClick={ViewAll}
          className="bg-white text-bio-green w-[94px] h-[34px] border border-bio-green rounded mx-1"
        >
          <Link to="/feature">View All</Link>
        </button>
      </div>
    </div>
  );
};

export default TrendingSection;
