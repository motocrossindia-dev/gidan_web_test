'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Leaf, Sun, ShieldCheck, Package, MessageCircle } from 'lucide-react';

/**
 * Robust Image with Fallback Icon
 * Now supports both URL strings and React elements for icons
 */
const SafeImage = ({ src, alt, width, height, className, fill = false, size = 24 }) => {
    const [err, setErr] = useState(false);
    
    // If src is a React element (from our fallback mapping), render it directly
    if (src && typeof src !== 'string') {
        return (
            <div className={`flex items-center justify-center text-bio-green ${className}`}>
                {React.cloneElement(src, { size, strokeWidth: 1.5 })}
            </div>
        );
    }

    if (err || !src) {
        return (
            <div className={`flex items-center justify-center text-bio-green opacity-40 ${className}`}>
                <Leaf size={size} strokeWidth={1.5} />
            </div>
        );
    }


    return (
        <Image 
            src={src} 
            alt={alt || "Badge icon"} 
            width={!fill ? width : undefined} 
            height={!fill ? height : undefined} 
            fill={fill}
            className={className}
            onError={() => setErr(true)}
            unoptimized
        />
    );
};

/**
 * TrustBadges Component
 * Displays a row of value propositions (badges) fetched from the API.
 * Designed with a premium, clean aesthetic using the site's color palette.
 */
const TrustBadges = ({ variant = "scroll" }) => {
    const [badges, setBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/trustBadges/`);
                if (res.ok) {
                    const json = await res.json();
                    setBadges(json.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch trust badges", err);
                // Fallback data
                setBadges([
                    { id: 1, icon: <Sun />, title: "India-Climate Tested", subtitle: "Tested for Bangalore's uniquely unpredictable conditions" },
                    { id: 3, icon: <ShieldCheck />, title: "Survival Guarantee", subtitle: "We replace any plant that doesn't survive 7 days" },
                    { id: 5, icon: <Package />, title: "Expert Packaging", subtitle: "Plants arrive healthy with a 99% success rate" },
                    { id: 4, icon: <MessageCircle />, title: "Expert Support", subtitle: "Botanical expertise available on WhatsApp Mon–Sat" }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBadges();
    }, []);

    if (isLoading && badges.length === 0) return null;

    const filteredBadges = badges.filter(b => b.is_active !== false);

    // --- Cinematic Grid Variant (Category Page / Reference Image) ---
    if (variant === "grid") {
        return (
            <div className="w-full max-w-4xl mx-auto border border-[#173113]/5 rounded-3xl bg-white/50 backdrop-blur-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {filteredBadges.slice(0, 4).map((badge, idx) => (
                        <div 
                            key={badge.id}
                            className={`flex flex-col items-center text-center p-8 md:p-12 transition-all group hover:bg-[#A7D949]/5
                                ${idx === 0 ? "border-b md:border-r border-[#173113]/5" : ""}
                                ${idx === 1 ? "border-b border-[#173113]/5" : ""}
                                ${idx === 2 ? "md:border-r border-[#173113]/5" : ""}
                            `}
                        >
                             <div className="w-14 h-14 mb-6 relative group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                <SafeImage 
                                    src={badge.icon} 
                                    alt={badge.title} 
                                    fill 
                                    size={32}
                                    className="object-contain"
                                />
                             </div>
                            <h3 className="text-sm md:text-base font-serif font-bold text-[#173113] mb-2 px-2">
                                {badge.title}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed max-w-[200px]">
                                {badge.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- Centered Row Variant (Home / Landing Page / Below Category Hero) ---
    if (variant === "row") {
        return (
            <div className="w-full bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-start lg:justify-center py-4 md:py-6 gap-0">
                        {filteredBadges.map((badge, idx) => (
                            <div 
                                key={badge.id} 
                                className={`flex items-center shrink-0 gap-3 md:gap-4 px-6 md:px-10 ${
                                    idx !== filteredBadges.length - 1 ? "border-r border-gray-100" : ""
                                } hover:bg-gray-50/50 transition-colors`}
                            >
                                 <div className="relative shrink-0 w-8 md:w-10 h-8 md:h-10 flex items-center justify-center overflow-hidden">
                                    <SafeImage src={badge.icon} alt={badge.title} width={28} height={28} size={22} className="object-contain" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <h3 className="text-[11px] md:text-[13px] font-bold text-[#1a1f14] leading-tight whitespace-nowrap tracking-tight">
                                        {badge.title}
                                    </h3>
                                    <p className="text-[9px] md:text-[10px] font-medium text-[#1a1f14]/40 leading-tight mt-0.5 max-w-[140px] whitespace-nowrap lg:whitespace-normal">
                                        {badge.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        );
    }

    // --- Standard Scroll Variant (Minimal Default) ---
    return (
        <div className="w-full bg-white border-y border-gray-100 overflow-x-auto scrollbar-hide py-4">
            <div className="flex min-w-[max-content] lg:w-full items-stretch justify-center">
                {filteredBadges.map((badge) => (
                    <div 
                        key={badge.id} 
                        className="flex items-center gap-3 md:gap-4 px-6 md:px-10 border-r border-gray-100 last:border-r-0 hover:bg-gray-50/50 transition-colors"
                    >
                         <div className="relative shrink-0 w-10 h-10 bg-[#ecf3e8] rounded-xl flex items-center justify-center overflow-hidden p-2">
                            <SafeImage src={badge.icon} alt={badge.title} width={24} height={24} size={20} className="object-contain" />
                        </div>
                        <div className="flex flex-col text-left">
                            <h3 className="text-[11px] md:text-[13px] font-black text-[#1a1f14] leading-tight whitespace-nowrap">
                                {badge.title}
                            </h3>
                            <p className="text-[9px] md:text-[10px] font-medium text-[#1a1f14]/50 leading-tight mt-0.5 max-w-[120px]">
                                {badge.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default TrustBadges;
