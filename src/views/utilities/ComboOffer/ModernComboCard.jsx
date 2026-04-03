'use client';

import React from "react";
import { ShoppingCart, Sparkles, TrendingUp } from "lucide-react";

const ModernComboCard = ({ offer }) => {
  const discount = offer?.total_price && offer?.final_price 
    ? Math.round(((offer.total_price - offer.final_price) / offer.total_price) * 100) 
    : 0;

  return (
    <div className="w-full group relative bg-white rounded-[2rem] border border-[#173113]/5 hover:border-[#A7D949]/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col h-full">

      {/* Premium Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#173113] rounded-full shadow-lg border border-white/10">
          <Sparkles className="w-3 h-3 text-[#A7D949]" />
          <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white">
            {offer?.is_shop_the_look ? "Designer Look" : "Value Combo"}
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-[#faf9f6] flex justify-center items-center overflow-hidden p-6">
        <img
          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
          src={`${process.env.NEXT_PUBLIC_API_URL}${offer?.image}`}
          alt={offer?.title}
          loading="lazy"
        />
        
        {/* Discount Overlay */}
        {discount > 0 && (
          <div className="absolute bottom-4 right-4 bg-[#A7D949] text-[#173113] w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <span className="text-[10px] font-black leading-none">{discount}%</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">OFF</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 bg-white">
        <div className="mb-4">
           <span className="text-[10px] text-[#A7D949] font-black uppercase tracking-widest mb-1 block">Bundle Savings</span>
           <h3 className="text-lg font-serif text-[#173113] leading-tight line-clamp-2 min-h-[3rem]">
             {offer?.title}
           </h3>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#173113] leading-none">
                ₹{Math.round(offer?.final_price)}
              </span>
              {offer?.total_price > offer?.final_price && (
                <span className="text-xs text-gray-400 line-through font-medium opacity-60">
                  ₹{Math.round(offer?.total_price)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-[#2d5a1b] font-bold text-[10px] uppercase tracking-tighter bg-[#A7D949]/10 px-2 py-1 rounded-lg">
               <TrendingUp className="w-3 h-3" />
               Save ₹{Math.round(offer?.total_price - offer?.final_price)}
            </div>
          </div>

          <button
            className="w-full bg-[#173113] text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#173113]/90 hover:scale-[1.02] active:scale-100 transition-all shadow-xl shadow-[#173113]/10"
            onClick={(e) => {
              e.stopPropagation();
              // Parent onClick handles the actual navigation/buy logic
            }}
          >
            <ShoppingCart className="w-4 h-4 text-[#A7D949]" />
            Get Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernComboCard;
