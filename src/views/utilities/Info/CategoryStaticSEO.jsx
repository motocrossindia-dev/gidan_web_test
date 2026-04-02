import React from "react";
import { Sun, Leaf, Droplets, Package, Smartphone, ShieldCheck, Heart } from 'lucide-react';

/**
 * CategoryStaticSEO
 *
 * Modified version: Renders the cinematic 2x2 Info Cards grid with fallbacks and loading states.
 */
const DEFAULT_INFO_CARDS = [
    { id: 'def-1', title: "Safe & Secure Packaging", description: "Multi-layer eco-friendly protection for every plant and pot." },
    { id: 'def-2', title: "Expert Care Support", description: "Our botanical experts are just a WhatsApp message away." },
    { id: 'def-3', title: "Pan-India Shipping", description: "Reliable and fast delivery to over 20,000+ pin codes." },
    { id: 'def-4', title: "Satisfaction Guarantee", description: "Premium quality products or an instant replacement." }
];

const CategoryStaticSEO = ({
    info_cards = [],
    isLoading = false,
    greenText = "",
    description = ""
}) => {
    // Helper to map icons for info cards (consistent with CategoryHero)
    const getInfoCardIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('low light') || lower.includes('sun') || lower.includes('shade')) return <Sun className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('air purifying') || lower.includes('health') || lower.includes('toxin')) return <Leaf className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('maintenance') || lower.includes('care') || lower.includes('easy')) return <ShieldCheck className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('pet safe') || lower.includes('animal') || lower.includes('non-toxic')) return <Heart className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('eco') || lower.includes('sustainable') || lower.includes('material') || lower.includes('packaging')) return <Leaf className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('drainage') || lower.includes('water') || lower.includes('root')) return <Droplets className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('size') || lower.includes('range') || lower.includes('shipping') || lower.includes('delivery')) return <Package className="w-4 h-4 text-[#375421]" />;
        if (lower.includes('whatsapp') || lower.includes('support')) return <Smartphone className="w-4 h-4 text-[#375421]" />;
        return <ShieldCheck className="w-4 h-4 text-[#375421]" />;
    };

    // Use default cards if provided list is empty
    const displayCards = (info_cards && info_cards.length > 0) ? info_cards.slice(0, 4) : DEFAULT_INFO_CARDS;

    return (
        <div className="py-2 md:py-4 px-4 md:px-16 font-sans">
            <div className="container mx-auto max-w-7xl">
                {/* Integrated Info Cards - Cinematic 2x2 Grid - Minimalist Style */}
                <div className="max-w-4xl mx-auto overflow-hidden bg-white/30 rounded-[20px] md:rounded-[25px] border border-gray-100/50 shadow-sm mb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {displayCards.map((card, idx) => (
                            <div 
                                key={card.id || idx} 
                                className={`flex flex-col items-center text-center p-4 md:p-6 group transition-all hover:bg-[#375421]/5 ${
                                    idx === 0 ? "border-b md:border-r border-gray-100/80" : ""
                                } ${
                                    idx === 1 ? "border-b border-gray-100/80" : ""
                                } ${
                                    idx === 2 ? "md:border-r border-t md:border-t-0 border-gray-100/80" : ""
                                } ${
                                    idx === 3 ? "border-t md:border-t-0 border-gray-100/80" : ""
                                }`}
                            >
                                {isLoading ? (
                                    <div className="animate-pulse w-full flex flex-col items-center">
                                        <div className="w-6 h-6 bg-gray-100 rounded-full mb-3" />
                                        <div className="h-2 bg-gray-100 rounded w-16 mb-2" />
                                        <div className="h-1.5 bg-gray-100 rounded w-28" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="shrink-0 mb-2 group-hover:scale-110 transition-transform duration-700 ease-out text-[#375421]">
                                            {getInfoCardIcon(card.title)}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <h4 className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-[0.15em] leading-tight mb-1.5">
                                                {card.title}
                                            </h4>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed font-medium max-w-[200px] opacity-90">
                                                {card.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional SEO Content Section removed / moved outside from caller */}
            </div>
        </div>
    );
};

export default CategoryStaticSEO;
