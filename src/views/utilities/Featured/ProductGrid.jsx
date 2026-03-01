'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import __plantImage from "../../../Assets/Gift/Gift3.webp";
const _plantImage = typeof __plantImage === 'string' ? __plantImage : __plantImage?.src || __plantImage;
const plantImage = typeof _plantImage === 'string' ? _plantImage : _plantImage?.src || _plantImage;
import TrendingCard from '../../../components/TrendingProducts/TrendingCard';

// Import the useNavigate hook
import axiosInstance from '../../../Axios/axiosInstance';
import { getProductUrl } from '../../../utils/urlHelper';
import Link from 'next/link';



const ProductGrid = ({ results }) => {
  const [products, setProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const router = useRouter(); // Initialize the navigate function

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

  const handleProductClick = (product) => {
    router.push(getProductUrl(product));
  };


  return (
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16 relative z-50">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs md:text-lg text-gray-500 font-normal">
          Showing {products.length} products
        </h2>
        <div className="relative mr-6 p-3">

        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 justify-items-center font-sans">
        {(results?.length ? results : products).map((product, index) => (
          <Link
            key={index}
            href={getProductUrl(product)}
            className="cursor-pointer block w-full"
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
          </Link>
        ))}


      </div>


    </div>
  );
};

export default ProductGrid;