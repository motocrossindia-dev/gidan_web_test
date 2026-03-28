'use client';


// ==================

import React, { useState} from "react";
import { Trash2, Plus, Minus, Info } from "lucide-react";

const ProductCard = ({ product, handleRemove, handleQuantityChange }) => {

  const [quantity, setQuantity] = useState(product.quantity);


  // Increment quantity
  const increment = () => {
    if (quantity >= 1000) return;
    const prev = quantity;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    handleQuantityChange(product.id, newQuantity, () => setQuantity(prev));
  };

  // Decrement quantity
  const decrement = () => {
    if (quantity > 1) {
      const prev = quantity;
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      handleQuantityChange(product.id, newQuantity, () => setQuantity(prev));
    }
  };

  // Manual quantity input
  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 1000) value = 1000;
    const prev = quantity;
    setQuantity(value);
    handleQuantityChange(product.id, value, () => setQuantity(prev));
  };


  return (
    <div className="group relative flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300">
      <button
        onClick={() => handleRemove(product.id)}
        className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 z-10"
        title="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div className="relative w-full sm:w-32 md:w-40 aspect-square overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
        <img name=" "   
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {product.discount > 0 && (
           <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
             SAVE ₹{Math.round(product.discount)}
           </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <div className="mb-1">
           <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full border border-green-100/50">
             {product.category || 'Plant'}
           </span>
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 truncate pr-8 group-hover:text-green-800 transition-colors">
          {product.name}
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-0.5 italic line-clamp-1">
           {product.short_description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-3">
           {product.care_guides && product.care_guides.length > 0 && (
             product.care_guides.map((guide) => (
               <div key={guide.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all hover:bg-white hover:border-green-100">
                  {guide.icon ? (
                    <img 
                      src={guide.icon} 
                      alt={guide.title} 
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  )}
                  <span className="text-[11px] font-bold text-gray-600">{guide.title}</span>
               </div>
             ))
           )}
        </div>

        <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-gray-900">
                ₹{Math.round(product.selling_price)}
              </p>
              {product.mrp && product.mrp > product.selling_price && (
                <p className="text-sm font-bold line-through text-gray-400 decoration-red-400/50">
                  ₹{Math.round(product.mrp)}
                </p>
              )}
            </div>
            {product.discount > 0 && (
               <p className="text-[11px] font-bold text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded-md border border-green-100">
                  ✓ You save ₹{Math.round(product.discount)}
               </p>
            )}
          </div>

          {product.stock_status ? (
            <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
              <button
                onClick={decrement}
                disabled={quantity <= 1}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all
                  ${quantity <= 1 ? 'text-gray-300 bg-transparent' : 'bg-white text-gray-600 hover:text-green-700 hover:shadow-sm'}`}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <input
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={handleInputChange}
                className="w-10 text-center bg-transparent font-black text-gray-900 border-none focus:ring-0"
              />

              <button
                onClick={increment}
                className="w-9 h-9 flex items-center justify-center bg-white text-gray-600 hover:text-green-700 rounded-xl transition-all shadow-sm active:scale-90"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Out of stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
