import React, { useState, useEffect } from 'react';
import plantImage from "../../../Assets/Gift/Gift3.png";
import TrendingCard from '../../../Components/TrendingProducts/TrendingCard';

import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import axiosInstance from '../../../Axios/axiosInstance';


const ProductGrid = ({ results }) => {
  const [products, setProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch data from API
  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/homeProducts/`);
      if (response.status == 200) {
      setProducts(response.data?.data?.products || []);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProducts([]); // Fallback to empty array in case of error
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Sorting function

  const handleProductClick = (productId) => {
    navigate("/productdata/" + productId);
  };

  return (
    <div className="mt-4 p-2 md:bg-white bg-gray-100 rounded-md md:ml-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs md:text-lg text-gray-500 font-normal">
          Showing {products.length} products
        </h2>
        <div className="relative mr-6 p-3">
          
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 justify-items-center font-sans">
        {(results?.length ? results : products).map((product, index) => (
                      <div
                      key={index}
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer"
                    >
          <TrendingCard
            key={index}
            name={product.name}
            price={Math.round(product.selling_price)}
            mrp={Math.round(product.mrp || 0)}
            imageUrl={product?.image || plantImage}
            rating={product.rating}
            product={product}
            inCart={product.is_cart}
            inWishlist={product.is_wishlist}
            getProducts={getProducts}
            ribbon={product.ribbon}
          />
            </div>

        ))}

      </div>

      
    </div>
  );
};

export default ProductGrid;