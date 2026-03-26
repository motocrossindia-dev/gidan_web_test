'use client';

import React from "react";
import { ShoppingCart } from "lucide-react";

const ModernComboCard = ({ offer }) => {
  return (
    <div className="w-full group relative bg-white rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-lg hover:bg-[#CFFFBE] transition-all duration-300 overflow-hidden flex flex-col">

      {/* Ribbon */}
      <div className="absolute top-2 right-2 z-20">
        <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded shadow-md">
          {offer?.is_shop_the_look ? "SHOP THE LOOK" : "COMBO"}
        </span>
      </div>

      {/* Image */}
      <div className="w-full flex justify-center pt-4 px-3">
        <img
          className="w-full max-w-[140px] sm:max-w-[180px] lg:max-w-[220px] aspect-square object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
          src={`${process.env.NEXT_PUBLIC_API_URL}${offer?.image}`}
          alt={offer?.title}
          loading="lazy"
          width="400"
          height="400"
        />
      </div>

      {/* Details */}
      <div className="w-full flex flex-col items-center px-3 pb-3 pt-3 flex-1">
        <h2
          className="text-xs sm:text-base font-bold text-black mb-2 line-clamp-2 text-center w-full"
          title={offer?.title}
        >
          {offer?.title}
        </h2>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm sm:text-lg font-bold text-[#375421]">
            ₹{Math.round(offer?.final_price)}
          </span>
          {offer?.total_price && offer?.total_price > offer?.final_price && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              ₹{Math.round(offer?.total_price)}
            </span>
          )}
        </div>

        {offer?.total_price && offer?.final_price && offer?.total_price > offer?.final_price && (
          <span className="text-[9px] sm:text-[10px] font-bold text-[#375421] bg-green-100 px-2 py-0.5 rounded-full border border-green-200 mb-2">
            SAVE ₹{Math.round(offer?.total_price - offer?.final_price)} ({Math.round(((offer?.total_price - offer?.final_price) / offer?.total_price) * 100)}% OFF)
          </span>
        )}

        {/* Buy It Now - appears on hover */}
        <button
          className="w-full bg-[#375421] text-white py-1.5 sm:py-2 px-3 rounded-xl hover:bg-[#2d451b] hover:text-white transition-all duration-300 flex items-center justify-center mt-auto pt-2 font-bold text-xs sm:text-sm shadow-md opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingCart className="inline-block mr-1.5 w-3.5 h-3.5" />
          Buy It Now
        </button>
      </div>
    </div>
  );
};

export default ModernComboCard;
