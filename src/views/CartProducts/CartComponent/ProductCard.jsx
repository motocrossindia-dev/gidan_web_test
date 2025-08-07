
// ==================

import React, { useState} from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const ProductCard = ({ product, handleRemove, handleQuantityChange }) => {

  const [quantity, setQuantity] = useState(product.quantity);


  // Increment quantity
  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleQuantityChange(product.id, newQuantity);

  };

  // Decrement quantity
  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleQuantityChange(product.id, newQuantity);

    }
  };

  // Manual quantity input
  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    setQuantity(value);
    handleQuantityChange(product.id, value);
  };


  return (
    <div className="flex flex-row justify-between items-center border-t border-b p-4 shadow-sm bg-white space-x-4">
      <div className="flex flex-row space-x-4 items-center">
        {/* Adjust image size responsively */}
        <img name=" "   
          src={`${process.env.REACT_APP_API_URL}${product.image}`}
          alt={product.name}
          className="w-24 h-36 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-md object-cover"
        />
        <div className="flex flex-col items-start">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-gray-500 mt-1">
  {product.short_description.length > 50 
    ? product.short_description.substring(0, 50) + "..." 
    : product.short_description}
</p>


          <div className="flex items-center space-x-2 mt-3">
            <p className="text-sm md:text-lg lg:text-xl font-semibold text-black-600">
              ₹{product.selling_price}
            </p>
            {product.mrp && (
              <p className="text-xs md:text-sm line-through text-gray-400">
                ₹{product.mrp}
              </p>
            )}
          </div>

          {product.stock_status ? (
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={decrement}
                className="px-2 py-1 bg-lime-500 rounded text-xs md:text-sm font-semibold text-white"
              >
                -
              </button>
              {/* <span className="text-sm md:text-lg font-medium">
                {product.quantity}
              </span> */}

                            <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleInputChange}
                className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-sm md:text-base"
              />

  
              <button
                onClick={increment}
                className="px-2 py-1 bg-lime-500 rounded text-xs md:text-sm font-semibold text-white"
              >
                +
              </button>
            </div>
          ) : (
            <p className="text-red-500 font-semibold mt-3 text-sm ">
              Out of stock
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => handleRemove(product.id)}
        className="flex justify-center items-center w-8 h-10 bg-lime-500 text-white rounded-md transition duration-150 ease-in-out hover:text-red-500 hover:bg-red-100"
      >
        <RiDeleteBin6Line className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProductCard;
