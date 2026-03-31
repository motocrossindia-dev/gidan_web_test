'use client';

import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

const StoreCard = ({ store }) => {
    if (!store) return null;

    const mapLink = store.address_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

    return (
        <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-300">
            {/* Header Area with Image and Badge */}
            <div className="relative h-44 overflow-hidden">
                <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${store.image}`} 
                    alt={store.location}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Open Now Badge - Refined */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    <span className="text-[9px] font-bold text-gray-900 uppercase">Open now</span>
                </div>

                {/* Subtle Brand Label Overlay */}
                <div className="absolute bottom-3 left-3 bg-[#375421]/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-lg z-10">
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest block">
                        {store.location.split(',')[0]} Store
                    </span>
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content Section - Compact and Reduced Gaps */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-black text-gray-900 mb-1 leading-tight">
                    {store.location.includes(',') ? store.location : `${store.location}, Bengaluru`}
                </h3>
                <p className="text-[13px] text-gray-400 font-medium leading-relaxed line-clamp-2 mb-4">
                    {store.address}
                </p>

                {/* Time Pill - Compact */}
                <div className="inline-flex items-center gap-1.5 bg-[#f4f7f1] px-3 py-1.5 rounded-lg w-fit mb-5 shadow-sm">
                    <Clock size={14} className="text-[#375421]" />
                    <span className="text-[11px] font-bold text-[#375421]">
                        Open: {store.time_period || '09:00 – 19:00 daily'}
                    </span>
                </div>

                {/* Dual Button Bar - Further Reduced Size */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
                    <button 
                        onClick={() => window.open(mapLink, '_blank')}
                        className="flex items-center justify-center gap-1.5 py-2 bg-[#2d4a1e] hover:bg-[#1f3315] text-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-all shadow-md active:scale-95"
                    >
                        <MapPin size={12} className="text-white shrink-0" /> Directions
                    </button>
                    <a 
                        href={`tel:${store.contact}`}
                        className="flex items-center justify-center gap-1.5 py-2 bg-white border-2 border-gray-100 hover:border-[#375421] text-gray-700 hover:text-[#375421] rounded-lg font-black text-[10px] uppercase tracking-wider transition-all active:scale-95"
                    >
                        <Phone size={12} className="text-gray-400 shrink-0" /> Call
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StoreCard;
