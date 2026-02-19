'use client';


import React, { useEffect, useRef } from "react";
import __empty from '../../../src/Assets/emptycart.webp';
const _empty = typeof __empty === 'string' ? __empty : __empty?.src || __empty;
const empty = typeof _empty === 'string' ? _empty : _empty?.src || _empty;

const EmptyCart = ({ onClose }) => {
  const modalRef = useRef(null);

  // Close the modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <img name=" "   
          src={empty} // Replace with your image URL
          alt="Empty Cart"
          className="mx-auto mb-4"
        />
        <h2 className="text-lg font-semibold mb-4">Your cart is currently empty</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={onClose}>
          Add Products
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
