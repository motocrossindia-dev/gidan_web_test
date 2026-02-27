'use client';
import React, { useEffect, useRef, useState } from "react";
import Verify from "../../Services/Services/Verify";

const Cart = ({ onClose }) => {
  const modalRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart data (assuming Verify handles the API call)
    async function fetchCartData() {
      try {
        const response = await Verify(); // Assuming Verify is an API service
        setCartItems(response?.data?.cart || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }

    fetchCartData();

    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[11000]">
        <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div key={product.id} className="mb-4">
                <img name=" "
                  className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
                  alt={product.name}
                />
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.short_description}</p>
              </div>
            ))
          ) : (
            <h2 className="text-lg font-semibold mb-4">Your cart is currently empty</h2>
          )}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
            {cartItems.length > 0 ? "Continue Shopping" : "Add Products"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
