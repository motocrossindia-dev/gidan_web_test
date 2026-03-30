"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Check, ChevronRight, Star, 
  ShieldCheck, ArrowRight,
  Sun, Droplets, Leaf, Calendar, Trophy,
  Mail, CheckCircle, Sparkles
} from 'lucide-react';
import ProductCard from '../ProductCard';

const processUrl = (url) => {
    if (!url || typeof url !== 'string') return "/static/logo/gidan.png";
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/static')) return url;
    return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${url}` : `${process.env.NEXT_PUBLIC_API_URL || ''}/${url}`;
};

/**
 * SHARED UTILITIES
 */

const SectionHeader = ({ data, config, isDark, type }) => {
    // Basic bolding for design match
    const renderDescription = (text) => {
        if (!text) return "";
        const parts = text.split(/(India-climate tested)/g);
        return parts.map((part, i) => 
            part === "India-climate tested" ? <strong key={i} className={isDark ? "text-white" : "text-black"}>{part}</strong> : part
        );
    };

    const isHero = type === 'hero';

    return (
        <div className="space-y-6">
            {data.label && (
                <div className="animate-fade-in">
                    {isHero ? (
                        <span className={`inline-block px-5 py-2 rounded-full border ${isDark ? 'border-[#a8e070]/30 text-[#a8e070] bg-[#a8e070]/5' : 'bg-black/5 text-black/40 border-black/5'} text-[11px] font-bold tracking-[0.25em] uppercase backdrop-blur-sm`}>
                            <span className="inline-block w-2 h-2 rounded-full bg-[#a8e070] mr-2" />
                            {data.label}
                        </span>
                    ) : (
                        <span className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#a8e070]">
                            {data.label}
                        </span>
                    )}
                </div>
            )}
            <h2 className={`${isHero ? 'text-5xl lg:text-[72px]' : 'text-3xl lg:text-[48px]'} font-serif font-medium ${isDark ? 'text-white' : 'text-[#1a1f14]'} leading-[1.05] tracking-tight`}>
                {data.heading} <br className="hidden sm:block" />
                <span className="italic font-normal text-[#a8e070]">{data.italic_text}</span> {data.heading_suffix}
            </h2>
            <p className={`text-[16px] lg:text-[18px] ${isDark ? 'text-white/70' : 'text-black/60'} leading-relaxed max-w-[600px]`}>
                {renderDescription(data.description)}
            </p>
        </div>
    );
};

const ActionButtons = ({ data, config, isDark, type }) => {
    const isClimateStory = type === 'climate' || type === 'gardener';
    
    // Helper to clean trailing arrows from the API text so we don't get doubles
    const cleanButtonText = (text) => {
        if (!text) return "";
        return text.replace(/\s*(->|→|=>|>)\s*$/, "").trim();
    };

    return (
        <div className="flex flex-wrap gap-5 pt-10">
            {data.btn1_text && (
                <a 
                    href={data.btn1_link} 
                    className="bg-white text-[#1a3d0a] px-10 py-5 rounded-[24px] text-[16px] font-extrabold flex items-center gap-3 group transition-all hover:scale-105 shadow-xl hover:shadow-white/10"
                >
                    {cleanButtonText(data.btn1_text)} {isClimateStory && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </a>
            )}
            {data.btn2_text && (
                <a 
                    href={data.btn2_link} 
                    className="px-10 py-5 rounded-[24px] text-[16px] font-bold flex items-center gap-2 transition-all hover:bg-white/10 border border-white/30 text-white backdrop-blur-md shadow-lg"
                >
                    {cleanButtonText(data.btn2_text)}
                </a>
            )}
        </div>
    );
};

const StatsRenderer = ({ data, isDark }) => (
    <div className="pt-12 mt-12 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-6">
            {/* Profile Bubbles */}
            <div className="flex -space-x-3">
                {['P', 'R', 'A', 'S'].map((char, i) => (
                    <div key={i} className={`w-11 h-11 rounded-full ${isDark ? 'bg-[#2d5a1b] border-2 border-[#1a3d0a]' : 'bg-[#f0f9ea] border-2 border-white'} flex items-center justify-center text-[13px] font-bold text-white shadow-lg`}>
                        {char}
                    </div>
                ))}
                <div className={`w-11 h-11 rounded-full ${isDark ? 'bg-[#4a8a2a] border-2 border-[#1a3d0a]' : 'bg-[#d4e8a0] border-2 border-white'} flex items-center justify-center text-[13px] font-bold text-white shadow-lg`}>
                    +
                </div>
            </div>

            {/* Stars & Text */}
            <div className="space-y-1">
                <div className="flex gap-1 text-orange-400">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className={`text-[15px] font-medium ${isDark ? 'text-white/80' : 'text-black/70'}`}>
                    <span className="font-bold">{data.extra?.stat_count || "12,847"} happy gardeners</span> <span className={isDark ? 'text-white/40' : 'text-black/40'}>across India</span>
                </p>
            </div>
        </div>
    </div>
);

const ItemsRenderer = ({ items, isDark }) => {
    const checklists = items.filter(i => i.item_type === 'checklist');
    const listItems = items.filter(i => i.item_type === 'list_item');

    return (
        <div className="space-y-8 py-4">
            {checklists.length > 0 && (
                <div className="space-y-4">
                    {checklists.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 group transition-all">
                            <Check size={20} className="text-[#a8e070] flex-shrink-0" strokeWidth={3} />
                            <h4 className={`text-[16px] lg:text-[17px] font-normal leading-relaxed ${isDark ? 'text-white/90' : 'text-[#1a1f14]'}`}>
                                {item.name}
                            </h4>
                        </div>
                    ))}
                </div>
            )}
            {listItems.length > 0 && (
                <div className="space-y-4">
                    {listItems.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between p-5 rounded-[24px] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-sm' : 'bg-white border-[#e2efe0] hover:bg-black/5'} border backdrop-blur-md transition-all`}>
                            <div className="space-y-1">
                                <h4 className={`text-[16px] font-bold ${isDark ? 'text-white' : 'text-[#1a1f14]'}`}>{item.name}</h4>
                                <p className={`text-[12px] ${isDark ? 'text-white/40' : 'text-black/40'} italic`}>{item.subtitle}{item.price && ` - ₹${item.price}`}</p>
                            </div>
                            {item.tag && (
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-tight border ${isDark ? 'border-white/20 text-white/60' : 'border-[#9ed36a]/30 text-[#2d5a1b] bg-[#f0f9ea]'}`}>
                                    {item.tag}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SubscriptionForm = ({ data, config }) => (
    <div className="relative overflow-hidden group space-y-10">
        <form className="relative">
            <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#a8e070]"><Mail size={22} /></div>
            <input type="email" placeholder="Enter your email" className="w-full bg-white/5 border border-white/20 rounded-3xl py-7 pl-16 pr-44 text-white focus:outline-none focus:border-[#a8e070]/50 transition-all placeholder:text-white/30 shadow-inner" />
            <button type="submit" className="absolute right-3 top-3 bottom-3 bg-[#a8e070] text-[#1a3d0a] px-8 rounded-2xl text-[14px] font-extrabold flex items-center gap-3 hover:bg-white transition-all">JOIN <ArrowRight size={18} /></button>
        </form>
        {data.extra?.disclaimer && <p className="text-[11px] text-white/40 tracking-wide">{data.extra.disclaimer}</p>}
    </div>
);

const StaticImageGrid = ({ data, isDark }) => (
    <div className="grid grid-cols-2 gap-5 h-[400px] lg:h-[640px] animate-fade-in relative z-10">
        <div className="relative bg-[#cee8a0] rounded-[60px] overflow-hidden row-span-2 shadow-2xl group border-8 border-white/10">
            <Image src={processUrl(data.image)} alt="V1" fill className="object-cover transition-transform group-hover:scale-110 duration-1000" />
            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{data.extra?.sub_badge_text || "PREMIUM"}</span>
                <p className="text-white text-[15px] font-bold mt-1">{data.extra?.image_caption || "Curated Selection"}</p>
            </div>
            {data.extra?.badge_text && (
                <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg z-30">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#2d5a1b]">{data.extra.badge_text}</span>
                </div>
            )}
        </div>
        <div className="relative bg-[#cee8a0] rounded-[40px] overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform">
            <Image src={processUrl(data.image_secondary || data.image)} alt="V2" fill className="object-cover" />
        </div>
        <div className="relative bg-[#d4e8a0] rounded-[40px] overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform">
            <Image src={processUrl(data.image_tertiary || data.image)} alt="V3" fill className="object-cover" />
        </div>
    </div>
);

const BentoProductGrid = ({ products, isDark }) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const rotatorProducts = products.slice(2);

    useEffect(() => {
        if (rotatorProducts.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % rotatorProducts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [rotatorProducts.length]);

    if (!products.length) return null;

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-5 h-[450px] lg:h-[600px] animate-fade-in relative z-10">
            <div className="col-span-1 row-span-2 relative transform transition-transform duration-700 hover:scale-[1.02]">
                <ProductCard product={products[0].product_data || products[0]} variant="bento-large" />
            </div>
            <div className="col-span-1 row-span-1 relative transform transition-transform duration-700 hover:scale-[1.02]">
                {products[1] ? (
                    <ProductCard product={products[1].product_data || products[1]} variant="bento" />
                ) : (
                    <div className={`w-full h-full rounded-[40px] ${isDark ? 'bg-white/5' : 'bg-black/5'} border border-dashed border-white/10`} />
                )}
            </div>
            <div className="col-span-1 row-span-1 relative">
                {rotatorProducts.length > 0 ? (
                    <div className="relative w-full h-full overflow-hidden rounded-[40px]">
                        {rotatorProducts.map((p, idx) => (
                            <div key={p.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === activeIdx ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                                <ProductCard product={p.product_data || p} variant="bento" extra={{ is_brown_variant: idx % 2 === 1 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`w-full h-full rounded-[40px] ${isDark ? 'bg-white/5' : 'bg-black/5'} border border-dashed border-white/10`} />
                )}
            </div>
        </div>
    );
};

/**
 * MASTER UNIVERSAL DISPATCHER
 */
const UnifiedSection = ({ data }) => {
    if (!data || !data.is_active) return null;

    const type = data.section_type || 'default';
    const items = data.items?.filter(i => i.is_active) || [];
    const products = data.product_cards?.filter(p => p.is_active) || [];
    
    // Logic: Shift items to the right visual column if no products are there
    const hasProducts = products.length > 0;
    const hasItems = items.length > 0;
    
    // Logic: Inverted 2-1 Pattern (Sections 1,2 = Left | Section 3 = Right | 4,5 = Left | 6 = Right)
    const sectionIndex = data.id || data.order || 1;
    const isReversed = sectionIndex % 3 === 0;
    
    const styleConfig = {
        hero: { bg: "bg-[#1a3d0a]", title: "text-white", highlight: "text-[#a8e070]", accent: "bg-[#4a8a2a] text-white", isDark: true },
        climate: { bg: "bg-[#1a3d0a]", title: "text-white", highlight: "text-[#a8e070]", accent: "bg-[#4a8a2a] text-white", isDark: true },
        gift: { bg: "bg-gradient-to-br from-[#1a3d0a] to-[#2d5a1b]", title: "text-white", highlight: "text-[#a8e070]", accent: "bg-[#a8e070] text-[#1a3d0a]", isDark: true },
        gardener: { bg: "bg-[#f9faf6]", title: "text-[#1a1f14]", highlight: "text-[#2d5a1b]", accent: "bg-[#2d5a1b] text-white", isDark: false },
        subscription: { bg: "bg-[#111111]", title: "text-white", highlight: "text-[#a8e070]", accent: "bg-[#a8e070] text-[#1a3d0a]", isDark: true }
    };
    
    const config = styleConfig[type] || styleConfig.hero;
    const isDark = config.isDark;

    return (
        <section className={`py-20 lg:py-32 ${config.bg} relative overflow-hidden`}>
            {isDark && <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />}
            
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16 relative z-10">
                <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16 lg:items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Header Column: Title and Description */}
                    <div className={`w-full lg:w-[42%] space-y-10 animate-fade-in ${isReversed ? 'lg:pl-16' : 'lg:pr-10'}`}>
                        <SectionHeader data={data} config={config} isDark={isDark} type={type} />
                        
                        {type === 'subscription' && <SubscriptionForm data={data} config={config} />}
                        
                        {/* Items on left only if products are present on right */}
                        {hasItems && hasProducts && <ItemsRenderer items={items} isDark={isDark} />}
                        
                        <ActionButtons data={data} config={config} isDark={isDark} type={type} />
                        
                        {type === 'hero' && <StatsRenderer data={data} isDark={isDark} />}
                    </div>

                    {/* Visual Column: Bento Grid or Items or Static Images */}
                    <div className="w-full lg:w-[58%] animate-fade-in mt-12 lg:mt-0">
                        {hasProducts ? (
                            <BentoProductGrid products={products} isDark={isDark} />
                        ) : hasItems ? (
                            <div className={`p-8 lg:p-12 rounded-[64px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/[0.05]'} border backdrop-blur-xl animate-fade-in`}>
                                <ItemsRenderer items={items} isDark={isDark} />
                            </div>
                        ) : (
                            <StaticImageGrid data={data} isDark={isDark} />
                        )}
                    </div>
                </div>

                {/* Secondary Extension (Below Main Grid) */}
                {data.heading_secondary && (
                    <div className={`flex flex-col lg:flex-row gap-16 items-center border-t border-black/5 pt-32 mt-32 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-[64px] overflow-hidden shadow-2xl border-[16px] border-white/50">
                            <Image src={processUrl(data.image)} alt="Secondary Visual" fill className="object-cover" />
                        </div>
                        <div className="w-full lg:w-1/2 space-y-10">
                            <h3 className={`text-3xl lg:text-[48px] font-serif font-bold ${config.title} leading-tight`}>{data.heading_secondary}</h3>
                            <p className={`${isDark ? 'text-white/60' : 'text-[#4a5f3a]'} text-[17px] leading-loose border-l-4 border-[#8dbd64]/20 pl-8 italic`}>{data.description_secondary}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UnifiedSection;
;

