'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, Heart, Thermometer, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Cinematic Category Hero - Boutique Forest Green Style
 * Matches the user reference with leaf patterns, glassmorphic stats, 
 * and integrated breadcrumbs.
 */
const CategoryHero = ({ data, breadcrumb }) => {
    if (!data) return null;

    const {
        heading_before = "",
        italic_text = "",
        heading_after = "",
        description = "",
        tags = [],
        stats = []
    } = data;

    // Use a clean fallback if no dynamic heading parts are provided
    const hasDynamicHeading = heading_before || italic_text || heading_after;
    const fallbackHeading = breadcrumb?.currentPage || "Collection";

    // Helper to map icons based on tag labels
    const getTagIcon = (label) => {
        const lower = label.toLowerCase();
        if (lower.includes('climate')) return <Thermometer className="w-3.5 h-3.5" />;
        if (lower.includes('rating')) return <Star className="w-3.5 h-3.5 fill-current" />;
        if (lower.includes('delivery')) return <Truck className="w-3.5 h-3.5" />;
        if (lower.includes('guarantee')) return <Heart className="w-3.5 h-3.5" />;
        return <Star className="w-3.5 h-3.5" />;
    };

    return (
        <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[#375421] overflow-hidden flex flex-col justify-center">
            {/* Subtle Leaf Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-5 10-15 15-15 25s10 15 15 25c5-10 15-15 15-25s-10-15-15-25z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                     backgroundSize: '80px 80px'
                 }}>
            </div>

            {/* Content Container */}
            <div className="relative max-w-screen-2xl mx-auto px-6 md:px-16 pt-4 pb-24 md:pt-8 md:pb-28 w-full flex flex-col h-full z-10">
                
                {/* Integrated Breadcrumb */}
                {breadcrumb && (
                    <motion.nav 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-white/50 text-[10px] md:text-xs font-medium uppercase tracking-[0.1em] mb-3 md:mb-5"
                    >
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                            <Home className="w-2.5 h-2.5" />
                            <span>Home</span>
                        </Link>
                        {breadcrumb.items?.map((item, idx) => (
                            <React.Fragment key={idx}>
                                <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                                <Link href={item.path} className="hover:text-white transition-colors">
                                    {item.label}
                                </Link>
                            </React.Fragment>
                        ))}
                        <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                        <span className="text-white">{breadcrumb.currentPage}</span>
                    </motion.nav>
                )}

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-auto">
                    
                    {/* Left Side: Messaging */}
                    <div className="max-w-4xl pb-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                                {hasDynamicHeading ? (
                                    <>
                                        {heading_before}{" "}
                                        <span className="italic font-serif text-[#C4E4B5] font-normal leading-none px-1">
                                            {italic_text}
                                        </span>{" "}
                                        <br className="hidden md:block" />
                                        {heading_after}
                                    </>
                                ) : fallbackHeading}
                            </h1>
                            
                            {description && (
                                <p className="mt-4 text-[11px] md:text-xs text-white/70 leading-relaxed max-w-xl font-medium tracking-wide">
                                    {description}
                                </p>
                            )}

                            {/* Trust Tags - Cinematic Glassmode */}
                            {tags && tags.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {tags.map((tag, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-full transition-all cursor-default"
                                        >
                                            <div className="text-[#C4E4B5]">
                                                {getTagIcon(tag.label)}
                                            </div>
                                            <span className="text-[7.5px] md:text-[8px] font-bold text-white uppercase tracking-[0.1em]">
                                                {tag.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Side: Bottom-Anchored Stats Wide Bar */}
                    {stats && stats.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 z-20 flex justify-center lg:justify-end px-4 md:px-16"
                        >
                            <div className="bg-black/20 backdrop-blur-3xl border-x border-t border-white/10 p-3.5 md:p-5 lg:p-7 rounded-t-[2.5rem] flex items-center justify-around md:justify-center gap-5 md:gap-10 lg:gap-14 shadow-2xl w-full max-w-screen-xl lg:max-w-none lg:w-auto">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xl md:text-2xl font-extrabold text-white tracking-tighter">
                                                {stat.value.replace('★', '')}
                                            </span>
                                            {stat.value.includes('★') && (
                                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                            )}
                                        </div>
                                        <span className="text-[6.5px] md:text-[7.5px] font-bold uppercase tracking-[0.2em] text-[#C4E4B5] mt-1 text-center whitespace-nowrap">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>

            {/* Decorative Side Vignette Mask */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
        </section>
    );
};

export default CategoryHero;
