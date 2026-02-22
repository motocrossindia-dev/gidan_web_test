'use client';

import React from "react";

const ProductCard = ({ product }) => {
  if (!product) {
    return <div className="text-red-500">No product data available</div>;
  }

  return (
    <div className="border rounded-lg p-4 text-center shadow-md">
      <img name=" "   
        src={product.image || "https://via.placeholder.com/150"}
        loading="lazy"
        alt={product.name || "Product"}
        className="w-full h-32 object-cover mb-2"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback image
      />
      <h3 className="text-sm font-medium">{product.name || "Unknown Product"}</h3>
      <p className="text-gray-500 text-sm">{product.price || "N/A"}</p>
      <button className="bg-green-500 text-white text-sm py-1 px-3 rounded mt-2">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
