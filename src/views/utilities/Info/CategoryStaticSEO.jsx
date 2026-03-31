import React from "react";
import { Sun, Leaf, Droplets, Package, Smartphone, ShieldCheck, Heart } from 'lucide-react';

/**
 * CategoryStaticSEO
 *
 * Simplified version: Renders ONLY the cinematic 2x2 Info Cards grid.
 * All textual SEO data (headings, descriptions, sections) is hidden as per latest branding update.
 */
const CategoryStaticSEO = ({
    info_cards = []
}) => {
    // Helper to map icons for info cards (consistent with CategoryHero)
    const getInfoCardIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('low light') || lower.includes('sun') || lower.includes('shade')) return <Sun className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('air purifying') || lower.includes('health') || lower.includes('toxin')) return <Leaf className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('maintenance') || lower.includes('care') || lower.includes('easy')) return <ShieldCheck className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('pet safe') || lower.includes('animal') || lower.includes('non-toxic')) return <Heart className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('eco') || lower.includes('sustainable') || lower.includes('material')) return <Leaf className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('drainage') || lower.includes('water') || lower.includes('root')) return <Droplets className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('size') || lower.includes('range')) return <Package className="w-5 h-5 text-[#375421]" />;
        if (lower.includes('whatsapp') || lower.includes('support')) return <Smartphone className="w-5 h-5 text-[#375421]" />;
        return <ShieldCheck className="w-5 h-5 text-[#375421]" />;
    };

    if (!info_cards || info_cards.length === 0) return null;

    return (
        <div className="py-6 md:py-10 px-4 md:px-16 font-sans">
            <div className="container mx-auto max-w-full">
                {/* Integrated Info Cards - Cinematic 2x2 Grid - Minimalist Style */}
                <div className="max-w-4xl mx-auto overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {info_cards.slice(0, 4).map((card, idx) => (
                            <div 
                                key={card.id || idx} 
                                className={`flex flex-col items-center text-center p-6 md:p-8 group transition-all hover:bg-[#375421]/5 ${
                                    idx === 0 ? "border-b md:border-r border-gray-100" : ""
                                } ${
                                    idx === 1 ? "border-b border-gray-100" : ""
                                } ${
                                    idx === 2 ? "md:border-r border-t md:border-t-0 border-gray-100" : ""
                                } ${
                                    idx === 3 ? "border-t md:border-t-0 border-gray-100" : ""
                                }`}
                            >
                                <div className="shrink-0 mb-4 group-hover:scale-110 transition-transform duration-500">
                                    {getInfoCardIcon(card.title)}
                                </div>
                                <div className="flex flex-col items-center">
                                    <h4 className="text-[11px] md:text-[12px] font-black text-gray-900 uppercase tracking-widest leading-tight mb-2">
                                        {card.title}
                                    </h4>
                                    <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed font-medium max-w-[220px]">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryStaticSEO;
