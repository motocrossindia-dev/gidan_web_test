'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Truck, Heart, Thermometer, ChevronRight, Home, Leaf, Sun, ShieldCheck, Droplets, Package, Smartphone } from 'lucide-react';
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
        stats = [],
        info_cards = []
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

    // Helper to map icons based on info card titles (since icons are null in API)
    const getInfoCardIcon = (title) => {
        const lower = title.toLowerCase();
        if (lower.includes('resistant') || lower.includes('sun')) return <Sun className="w-5 h-5 text-[#C4E4B5]" />;
        if (lower.includes('eco') || lower.includes('sustainable') || lower.includes('material')) return <Leaf className="w-5 h-5 text-[#C4E4B5]" />;
        if (lower.includes('drainage') || lower.includes('water') || lower.includes('root')) return <Droplets className="w-5 h-5 text-[#C4E4B5]" />;
        if (lower.includes('size') || lower.includes('range')) return <Package className="w-5 h-5 text-[#C4E4B5]" />;
        if (lower.includes('whatsapp') || lower.includes('support')) return <Smartphone className="w-5 h-5 text-[#C4E4B5]" />;
        return <ShieldCheck className="w-5 h-5 text-[#C4E4B5]" />;
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

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 mt-6 md:mt-8">
                    
                    {/* Left Side: Messaging */}
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
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
                                <p className="mt-5 text-sm md:text-base text-white/70 leading-relaxed max-w-xl font-medium tracking-wide">
                                    {description}
                                </p>
                            )}

                            {/* Trust Tags - Cinematic Glassmode */}
                            {tags && tags.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    {tags.map((tag, idx) => (
                                        <div 
                                            key={idx}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-full transition-all cursor-default"
                                        >
                                            <div className="text-[#C4E4B5]">
                                                {getTagIcon(tag.label)}
                                            </div>
                                            <span className="text-[8px] md:text-[9px] font-bold text-white uppercase tracking-[0.12em]">
                                                {tag.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Removed Info Cards from here as they are now centralized at the bottom */}

                    {/* Bottom-Anchored Stats Bar (positioned absolute to the section) */}
                    {stats && stats.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="absolute bottom-0 left-0 right-0 z-20 flex justify-center lg:justify-end px-4 md:px-16"
                        >
                            <div className="bg-black/30 backdrop-blur-3xl border-x border-t border-white/10 p-4 md:p-6 lg:p-8 rounded-t-[3rem] flex items-center justify-around md:justify-center gap-6 md:gap-12 lg:gap-16 shadow-2xl w-full max-w-screen-xl lg:max-w-none lg:w-auto">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tighter">
                                                {stat.value.replace('★', '')}
                                            </span>
                                            {stat.value.includes('★') && (
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            )}
                                        </div>
                                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] text-[#C4E4B5] mt-1.5 text-center whitespace-nowrap">
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
