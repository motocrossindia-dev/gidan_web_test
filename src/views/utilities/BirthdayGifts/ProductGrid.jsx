
import React, { useState } from 'react';
import plantImage from "../../../Assets/Gift/Gift3.png";
import ProductCard from './ProductCard';
import { FaAngleDown, FaAngleUp, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { ChevronDown, ChevronUp } from 'lucide-react';

const products = [
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
  { name: "Peace Lily Plant", price: 499, oldPrice: 650, image: plantImage, rating: 4 },
];

const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState("featured");
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
  const [selectedSortOption, setSelectedSortOption] = useState(''); // Track the selected sort option

  // Function to handle sorting option selection
  const handleSortChange = (option) => {
    setSelectedSortOption(option);
    setDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="mt-8 p-2 bg-white rounded-md md:ml-16">
      {/* Heading with Sort By Button */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xs md:text-lg text-gray-500 font-normal">
        Showing 1-48 of 111 products
      </h2>
      <div className="relative mr-6 p-3">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-white border border-blue-700  text-blue-700 px-2 md:px-4 py-2 text-xs rounded-md hover:bg-blue-700 hover:text-white flex items-center gap-2"
        >
          <span>Sort By: {selectedSortOption}</span>
          {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {dropdownOpen && (
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
        )}
      </div>
    </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 justify-items-center font-sans">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            imageUrl={plantImage}
            rating={product.rating}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
        >
          <span className="text-bio-green"><FaAngleLeft /></span>
        </button>
        <button className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1">
          View All
        </button>
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
