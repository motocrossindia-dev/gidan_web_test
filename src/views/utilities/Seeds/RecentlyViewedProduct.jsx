
import React, { useEffect, useState } from 'react';    
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import TrendingCard from "../../../Components/TrendingProducts/TrendingCard"

const RecentlyViewedProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  
  
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/recentlyViewed/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      setProducts(response?.data?.data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
      setProducts([]); // Fallback to an empty array in case of error
    }
  };
  
  useEffect(() => {
   
      getProducts();
    
  }, []); // Re-run if `accessToken` changes

  const handleProductClick = (productId) => {
    navigate("/productdata/" + productId);
  };
  
  return (
    <div className="w-full bg-gray-100">
      <div className="my-8 p-4 bg-grey-200 rounded-md">
        <h2 className="md:text-2xl text-xl mb-4 text-center md:font-bold font-semibold">
          Recently Viewed
        </h2>

        <div className="max-w-7xl mx-auto px-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 lg:mx-10 gap-4 lg:gap-2 justify-items-center">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product?.id} onClick={() => handleProductClick(product?.id)}>
                  <TrendingCard
                    product={product}
                    name={product?.name}
                    price={product?.price}
                    imageUrl={product?.image || "/fallback-image.jpg"} // Use a default image
                    userRating={product?.product_rating?.avg_rating || 0}
                    ratingNumber={product?.product_rating?.num_ratings}
                    inCart={product?.is_cart}
                    inWishlist={product?.is_wishlist}
                    getProducts={getProducts}
                    mrp={product?.mrp}
                  />
                </div>
              ))
            ) : (
              <p className="text-center col-span-4">No products found.</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
            <span className="text-bio-green"><FaAngleLeft /></span>
          </button>
          <button className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1">
            View All
          </button>
          <button className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border">
            <span className="text-bio-green"><FaAngleRight /></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedProduct;
