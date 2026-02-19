'use client';


import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import TrendingCard from '../../../components/TrendingProducts/TrendingCard';


const ProductGrid = ({searchResults ,pagination}) => {
  const navigate = useNavigate();
  

  const handleProductClick = (product) => {
    const category_slug = product?.category_slug;
    const sub_category_slug = product?.sub_category_slug;

    // All products have category, subcategory, and product slug
    navigate(`/${category_slug}/${sub_category_slug}/${product.slug}/`, {       state: {
        product_id: product.slug,
        category_slug:category_slug,
        sub_category_slug:sub_category_slug

      } });
  };
  const totalProducts = searchResults.length;
  return (
    <div className="mt-2 p-2 bg-white rounded-md md:ml-16">
      {/* Heading with Sort By Button */}
      <div className="flex justify-between items-center mb-4">
      
      <h2 className="text-xs md:text-lg text-gray-500 font-normal">
        {totalProducts > 0
          ? `Showing 1-${Math.min(48, totalProducts)} of ${totalProducts} products`
          : "No products found"}
      </h2>

      {/* {totalProducts > 0 ? (
        <ul>
          {searchResults.slice(0, 48).map((item) => (
            <li key={item.id} className="p-2 border-b">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )} */}
   
      <div className="relative mr-6 p-3">
        {/* <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-white border border-blue-700  text-blue-700 px-2 md:px-4 py-2 text-xs rounded-md hover:bg-blue-700 hover:text-white flex items-center gap-2"
        >
          <span>Sort By: {selectedSortOption}</span>
          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button> */}
        
        {/* {dropdownOpen && (
          <div className="fixed sm:absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-10">
            <ul className="py-1">
              {['Lower Price', 'Higher Price', 'Higher Rating', 'Lower Rating'].map((option) => (
                <li
                  key={option}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSortChange(option)}
                >
                  <span>{option}</span>
                  <input
                    type="radio"
                    name="sortOption"
                    checked={selectedSortOption === option}
                    readOnly
                    className="ml-2"
                  />
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 justify-items-center font-sans">
        {searchResults.map((product, index) => (
          <div
          key={index}
          onClick={() => handleProductClick(product)}
          className="cursor-pointer"
        >
          <TrendingCard
            key={index}
            name={product.name}
            price={Math.round(product.selling_price)}
            oldPrice={Math.round(product.oldPrice)}
            imageUrl={product.image}
            rating={product.rating}
            product={product}
            inCart={product.is_cart}
            inWishlist={product.is_wishlist}
            mrp={Math.round(product.mrp)}
          />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
        >
          <span className="text-bio-green"><FaAngleLeft /></span>
        </button>
        {/* <button className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1">
          View All
        </button> */}
        <button
          className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
        >
          <span className="text-bio-green"><FaAngleRight /></span>
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
