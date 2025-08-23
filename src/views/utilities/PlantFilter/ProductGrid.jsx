
import React, { useState,useEffect } from 'react';
import ProductCard from './ProductCard';
import {  FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductGrid = ({productDetails,pagination,setResults,query}) => {

  
  const [currentUrl, setCurrentUrl] = useState(''); // Your base API URL
  const [pages,setPages] = useState(null)

  const navigate = useNavigate();
  // Function to handle sorting option selection


  const handleProductClick = (productId) => {
    navigate("/productdata/" + productId);
  };
  
  const totalProducts = productDetails?.length ||0;
  useEffect(() => {
    const fetchProducts = async () => {

      if (query) {
        try {
          
          const response = await axios.post(currentUrl,
            { search: query },
          );
          if (response.data.message === "success") {
             setResults(response?.data?.products)
          }
        } catch (error) {
          console.log(error);
          
        }
      }
      try {
        const res = await axios.get(currentUrl);
        if (res?.status === 200) {
         setResults(res?.data?.products);         
         setPages(res?.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentUrl]);

  const handleNext = () => {
    if (pagination?.next) {
      setCurrentUrl(pagination?.next);
    }
  };

  const handlePrevious = () => {
    if (pages?.previous) {
      setCurrentUrl(pages?.previous);
    }
  };
  return (
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16">
      {/* Heading with Sort By Button */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xs md:text-lg text-gray-500 font-normal">
        {totalProducts > 0
          ? `Showing 1-${Math.min(48, totalProducts)} of ${pagination.count} products`
          : "No products found"}
      </h2>

    </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center font-sans">

        {productDetails?.map((product, index) => (
           <div
           key={index}
           onClick={() => handleProductClick(product?.id)}
           className="cursor-pointer"
         >
          <ProductCard
            key={index}
            name={product?.name}
            price={Math.round(product?.selling_price)}
            imageUrl={product?.image}
            userRating={product?.product_rating?.avg_rating}
            ratingNumber={product?.product_rating?.num_ratings}
            product={product?.id}
            mrp={Math.round(product?.mrp)}
            inWishlist={product?.is_wishlist}
            inCart={product?.is_cart}
          />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={!pages?.previous}
          className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border disabled:opacity-50"
        >
          <span className="text-bio-green"><FaAngleLeft /></span>
        </button>

        <button
          onClick={handleNext}
          disabled={!pagination?.next}
          className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border disabled:opacity-50"
        >
          <span className="text-bio-green"><FaAngleRight /></span>
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
