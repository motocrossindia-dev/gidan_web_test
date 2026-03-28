'use client';

import React from 'react';
import { Thermometer, ShieldCheck, Package, MessageCircle } from 'lucide-react';

const InfoCards = ({ cards }) => {
    if (!cards || !Array.isArray(cards)) return null;

    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('tested')) return <Thermometer className="w-8 h-8 text-rose-500" />;
        if (lowerTitle.includes('guarantee')) return <ShieldCheck className="w-8 h-8 text-blue-500" />;
        if (lowerTitle.includes('packaging')) return <Package className="w-8 h-8 text-amber-700" />;
        if (lowerTitle.includes('support')) return <MessageCircle className="w-8 h-8 text-emerald-600" />;
        return <ShieldCheck className="w-8 h-8 text-[#375421]" />;
    };

    return (
        <section className="mt-8 mb-12 px-4 max-w-5xl mx-auto">
            <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {cards.slice(0, 4).map((card, index) => (
                    <div 
                        key={card.id} 
                        className={`flex flex-col items-center text-center p-6 md:p-8 hover:bg-gray-50/50 transition-colors duration-300 relative group
                            ${index % 2 === 0 ? 'md:border-r border-gray-100' : ''}
                            ${index < 2 ? 'border-b border-gray-100' : ''}
                        `}
                    >
                        {/* 3D-effect Icon Container */}
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 blur-md opacity-20 scale-125">
                                    {getIcon(card.title)}
                                </div>
                                <div className="relative z-10 flex items-center justify-center scale-90 md:scale-100">
                                    {getIcon(card.title)}
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-[#375421] font-bold text-sm md:text-base mb-2 tracking-tight">
                            {card.title}
                        </h3>
                        
                        <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed max-w-[200px] font-medium opacity-80">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoCards;
