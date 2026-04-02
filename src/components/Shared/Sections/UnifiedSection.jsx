"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Check, ChevronRight, Star,
    ShieldCheck, ArrowRight,
    Sun, Droplets, Leaf, Calendar, Trophy,
    Mail, CheckCircle, Sparkles, CheckCheck,
    CircleCheck
} from 'lucide-react';
import ProductCard from '../ProductCard';

const processUrl = (url) => {
    if (!url || typeof url !== 'string') return "/logo.png";
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/static')) return url;
    return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${url}` : `${process.env.NEXT_PUBLIC_API_URL || ''}/${url}`;
};

/**
 * SHARED UTILITIES
 */
const getLuminance = (hex) => {
    if (!hex || typeof hex !== 'string') return 0;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness;
};

const getIsDark = (hex) => {
    if (!hex) return null;
    const luminance = getLuminance(hex);
    return luminance < 128; // Standard threshold
};

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

    const labelText = data.extra?.badge_text || data.label;
    const headingColor = data.extra?.color;
    const italicTextColor = data.extra?.italic_text_color;
    const italicBgColor = data.extra?.italic_bg_color;

    return (
        <div className="space-y-1.5 mb-2">
            {labelText && (
                <div className="animate-fade-in group">
                    {isHero ? (
                        <span
                            className={`inline-block px-4 py-1.5 rounded-full border ${isDark ? 'border-[#a8e070]/30 text-[#a8e070] bg-[#a8e070]/5' : 'bg-black/5 text-black/40 border-black/5'} text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-sm transition-all hover:scale-105`}
                            style={data.extra?.italic_text_color ? { borderColor: `${data.extra.italic_text_color}33`, color: data.extra.italic_text_color } : {}}
                        >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#a8e070] mr-2" style={data.extra?.italic_text_color ? { backgroundColor: data.extra.italic_text_color } : {}} />
                            {labelText}
                        </span>
                    ) : (
                        <span
                            className="text-[11px] font-black tracking-[0.14em] uppercase text-[#a8e070]"
                            style={data.extra?.italic_text_color ? { color: data.extra.italic_text_color } : {}}
                        >
                            {labelText}
                        </span>
                    )}
                </div>
            )}
            <h2
                className={`${isHero ? 'text-3xl lg:text-5xl' : 'text-xl lg:text-4xl'} font-serif font-medium ${isDark ? 'text-white' : 'text-[#1a1f14]'} leading-[1.1] tracking-tight`}
                style={headingColor ? { color: headingColor } : {}}
            >
                {data.heading} <br className="hidden sm:block" />
                <span
                    className="italic font-normal text-[#a8e070]"
                    style={{
                        color: italicTextColor || undefined
                    }}
                >
                    {data.italic_text}
                </span> {data.heading_suffix}
            </h2>
            <p
                className={`text-[16px] lg:text-[17px] leading-relaxed max-w-[540px] ${!data.extra?.text_color && (isDark ? 'text-white/70' : 'text-black/60')}`}
                style={data.extra?.text_color ? { color: data.extra.text_color } : {}}
            >
                {renderDescription(data.description)}
            </p>
        </div>
    );
};

// Helper to convert hex to rgba for the hard shadow
const hexToRgba = (hex, alpha) => {
    if (!hex || !hex.startsWith('#')) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ActionButtons = ({ data, config, isDark, type }) => {
    const [isP1Hovered, setIsP1Hovered] = useState(false);
    const [isP2Hovered, setIsP2Hovered] = useState(false);
    const isClimateStory = type === 'climate' || type === 'gardener';

    // Helper to clean trailing arrows from the API text so we don't get doubles
    const cleanButtonText = (text) => {
        if (!text) return "";
        return text.replace(/\s*(->|→|=>|>)\s*$/, "").trim();
    };

    const p1Color = data.extra?.btn_primary_color || (isDark ? '#a8e070' : '#1a3d0a');
    const p2Color = data.extra?.btn_secondary_color || data.extra?.text_color || (isDark ? '#ffffff' : '#1a3d0a');

    // Button 1 (Primary): Solid -> Invert
    const b1Bg = isP1Hovered ? p2Color : p1Color;
    const b1Text = isP1Hovered ? p1Color : p2Color;

    // Button 2 (Secondary): Outline -> Fill
    const b2Bg = isP2Hovered ? p2Color : 'transparent';
    const b2Text = isP2Hovered ? p1Color : p2Color;

    const shadowStyle1 = isP1Hovered ? 'none' : `6px 6px 0px 0px ${hexToRgba(p2Color, 0.2)}`;
    const shadowStyle2 = isP2Hovered ? 'none' : `6px 6px 0px 0px ${hexToRgba(p2Color, 0.2)}`;

    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-5 pt-3 overflow-x-visible">
            {data.btn1_text && (
                <a
                    href={data.btn1_link}
                    onMouseEnter={() => setIsP1Hovered(true)}
                    onMouseLeave={() => setIsP1Hovered(false)}
                    className="w-full lg:w-auto px-12 py-4.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.96] border-2 whitespace-nowrap shrink-0"
                    style={{ 
                        backgroundColor: b1Bg, 
                        color: b1Text,
                        borderColor: p2Color,
                        boxShadow: shadowStyle1
                    }}
                >
                    {cleanButtonText(data.btn1_text)} {(isClimateStory || type === 'hero') && <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />}
                </a>
            )}
            {data.btn2_text && (
                <a
                    href={data.btn2_link}
                    onMouseEnter={() => setIsP2Hovered(true)}
                    onMouseLeave={() => setIsP2Hovered(false)}
                    className="w-full lg:w-auto px-12 py-4.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md border-2 active:scale-[0.96] whitespace-nowrap shrink-0"
                    style={{
                        backgroundColor: b2Bg,
                        color: b2Text,
                        borderColor: p2Color,
                        boxShadow: shadowStyle2
                    }}
                >
                    {cleanButtonText(data.btn2_text)}
                </a>
            )}
        </div>
    );
};
const StatsRenderer = ({ data, isDark }) => {
    const statCount = data.extra?.stat_count || "12,847";
    const statLabel = data.extra?.stat_label || "happy gardeners across India";
    const statRating = parseFloat(data.extra?.stat_rating || "4.8");

    return (
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
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={16}
                                fill={s <= Math.round(statRating) ? "currentColor" : "none"}
                                className={s <= Math.round(statRating) ? "" : "text-white/20"}
                            />
                        ))}
                    </div>
                    <p
                        className={`text-[15px] font-medium ${!data.extra?.text_color && (isDark ? 'text-white/80' : 'text-black/70')}`}
                        style={data.extra?.text_color ? { color: data.extra.text_color } : {}}
                    >
                        <span className="font-bold">{statCount}</span> <span>{statLabel}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const ItemsRenderer = ({ items, isDark, data }) => {
    const checklists = items.filter(i => i.item_type === 'checklist');
    const listItems = items.filter(i => i.item_type === 'list_item');
    const accentColor = data.extra?.text_color || (isDark ? '#ffffff' : '#1a3d0a');

    const renderIcon = (iconName) => {
        const iconMap = {
            'check': <CheckCheck size={18} strokeWidth={3} />,
            'circle': <CheckCircle size={18} strokeWidth={3} />,
            'leaf': <Leaf size={18} strokeWidth={3} />,
            'sun': <Sun size={18} strokeWidth={3} />,
            'shield': <ShieldCheck size={18} strokeWidth={3} />,
            'star': <Star size={18} strokeWidth={3} />,
            'default': <CheckCheck size={18} strokeWidth={3} />
        };
        return iconMap[iconName?.toLowerCase()] || iconMap.default;
    };

    return (
        <div className="space-y-6 pt-2 pb-6">
            {/* Minimalist Checklists */}
            {checklists.length > 0 && (
                <div className="space-y-4">
                    {checklists.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 group transition-all">
                            <div className={`mt-0.5 ${isDark ? 'text-[#a8e070]' : 'text-[#375421]'} flex-shrink-0`}>
                                {renderIcon(item.icon_name || 'default')}
                            </div>
                            <h4
                                className={`text-[15px] leading-relaxed ${!data?.extra?.text_color && (isDark ? 'text-white/80' : 'text-[#1a1f14]')}`}
                                style={data?.extra?.text_color ? { color: data.extra.text_color } : {}}
                            >
                                {item.name}
                            </h4>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium Feature Cards */}
            {listItems.length > 0 && (
                <div className="space-y-4 pt-2">
                    {listItems.map((item, idx) => {
                        const [isHovered, setIsHovered] = useState(false);
                        const hardShadow = isHovered ? 'none' : `6px 6px 0px 0px ${hexToRgba(accentColor, 0.12)}`;

                        return (
                            <div 
                                key={item.id || idx} 
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className={`group flex items-start gap-5 p-5 rounded-[28px] transition-all duration-300 border-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#e2efe0] backdrop-blur-sm'}`}
                                style={{ 
                                    boxShadow: hardShadow,
                                    transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                {/* Modern Bullet/Icon Slot */}
                                <div className={`mt-1.5 h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isDark ? 'bg-white/5 border border-white/10' : 'bg-[#ebf5eb] border border-[#d4e8a0]/30'}`}>
                                    <CheckCircle 
                                        size={18} 
                                        className={`transition-colors ${isDark ? 'text-[#a8e070]' : 'text-[#375421]'}`} 
                                        strokeWidth={3} 
                                    />
                                </div>
                                
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <h4
                                            className={`text-[12px] font-black uppercase tracking-[0.16em] leading-tight transition-colors ${!data?.extra?.text_color && (isDark ? 'text-white' : 'text-[#1a1f14]')}`}
                                            style={data?.extra?.text_color ? { color: data.extra.text_color } : {}}
                                        >
                                            {item.name}
                                        </h4>
                                        {item.tag && (
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase border ${isDark ? 'border-white/20 text-white/50' : 'border-[#9ed36a]/30 text-[#2d5a1b] bg-[#f0f9ea]'}`}>
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {(item.subtitle || item.description) && (
                                        <p
                                            className={`text-[15px] leading-relaxed max-w-xl ${!data?.extra?.text_color && (isDark ? 'text-white/60' : 'text-gray-500 font-medium')}`}
                                            style={data?.extra?.text_color ? { color: data.extra.text_color, opacity: 0.7 } : {}}
                                        >
                                            {item.subtitle || item.description} {item.price && <span className="font-bold opacity-100 ml-2 text-sm">₹{item.price}</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SubscriptionForm = ({ data, config, isDark }) => {
    const [isHovered, setIsHovered] = useState(false);
    const btnPrimaryColor = data.extra?.btn_primary_color || (isDark ? '#a8e070' : '#1a3d0a');
    const btnSecondaryColorRaw = data.extra?.btn_secondary_color || data.extra?.text_color || (isDark ? '#ffffff' : '#1a3d0a');

    const bgColor = isHovered ? btnSecondaryColorRaw : btnPrimaryColor;
    const textColor = isHovered ? btnPrimaryColor : btnSecondaryColorRaw;
    const borderColor = btnSecondaryColorRaw;
    const shadowStyle = isHovered ? 'none' : `6px 6px 0px 0px ${hexToRgba(btnSecondaryColorRaw, 0.2)}`;

    return (
        <div className="relative overflow-hidden group space-y-10">
            <form className="relative">
                <div className={`absolute left-7 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#a8e070]' : 'text-[#2d5a1b]'}`}><Mail size={22} /></div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full border rounded-3xl py-7 pl-16 pr-44 transition-all shadow-inner focus:outline-none ${isDark ? 'bg-white/5 border-white/20 text-white focus:border-[#a8e070]/50 placeholder:text-white/30' : 'bg-black/5 border-black/10 text-black focus:border-[#2d5a1b]/50 placeholder:text-black/30'}`}
                />
                <button
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="absolute right-3 top-3 bottom-3 px-10 rounded-2xl text-[12px] font-black tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all duration-300 border-2 active:scale-[0.96]"
                    style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: borderColor,
                        boxShadow: shadowStyle
                    }}
                >
                    JOIN <ArrowRight size={14} strokeWidth={3} />
                </button>
            </form>
            {data.extra?.disclaimer && <p className={`text-[11px] tracking-wide ${isDark ? 'text-white/40' : 'text-black/40'}`}>{data.extra.disclaimer}</p>}
        </div>
    );
};

const StaticImageGrid = ({ data, isDark }) => (
    <div className="grid grid-cols-2 gap-5 h-[400px] lg:h-[640px] animate-fade-in relative">
        <div
            className="relative bg-[#cee8a0] rounded-[60px] overflow-hidden row-span-2 shadow-2xl group border-8 border-white/10"
            style={data.extra?.product_card_color ? { backgroundColor: data.extra.product_card_color } : {}}
        >
            <Image src={processUrl(data.image)} alt="V1" fill className="object-cover transition-transform group-hover:scale-110 duration-1000" />
            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{data.extra?.sub_badge_text || "PREMIUM"}</span>
                <p className="text-white text-[15px] font-bold mt-1">{data.extra?.image_caption || "Curated Selection"}</p>
            </div>
            {data.extra?.badge_text && (
                <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg z-[2]">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#2d5a1b]">{data.extra.badge_text}</span>
                </div>
            )}
        </div>
        <div
            className="relative bg-[#cee8a0] rounded-[40px] overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform"
            style={data.extra?.product_card_color ? { backgroundColor: data.extra.product_card_color } : {}}
        >
            <Image src={processUrl(data.image_secondary || data.image)} alt="V2" fill className="object-cover" />
        </div>
        <div
            className="relative bg-[#d4e8a0] rounded-[40px] overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform"
            style={data.extra?.product_card_color ? { backgroundColor: data.extra.product_card_color } : {}}
        >
            <Image src={processUrl(data.image_tertiary || data.image)} alt="V3" fill className="object-cover" />
        </div>
    </div>
);

const BentoProductGrid = ({ products, isDark, data }) => {
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
        <div className="grid grid-cols-2 lg:grid-rows-2 gap-4 md:gap-5 h-[550px] md:h-[600px] lg:h-[600px] animate-fade-in relative">
            <div className="col-span-2 lg:col-span-1 lg:row-span-2 relative transform transition-transform duration-700 hover:scale-[1.02]">
                <ProductCard product={products[0].product_data || products[0]} variant="bento-large" />
            </div>
            <div className="col-span-1 lg:row-span-1 relative transform transition-transform duration-700 hover:scale-[1.02]">
                {products[1] ? (
                    <ProductCard product={products[1].product_data || products[1]} variant="bento" />
                ) : (
                    <div
                        className={`w-full h-full rounded-[40px] border border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                        style={data?.extra?.product_card_color ? { backgroundColor: data.extra.product_card_color, borderColor: 'transparent' } : {}}
                    />
                )}
            </div>
            <div className="col-span-1 lg:row-span-1 relative">
                {rotatorProducts.length > 0 ? (
                    <div className="relative w-full h-full overflow-hidden rounded-[40px]">
                        {rotatorProducts.map((p, idx) => (
                            <div key={p.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === activeIdx ? "opacity-100 scale-100 z-[1]" : "opacity-0 scale-95 pointer-events-none z-0"}`}>
                                <ProductCard product={p.product_data || p} variant="bento" extra={{ is_brown_variant: idx % 2 === 1 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className={`w-full h-full rounded-[40px] border border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}
                        style={data?.extra?.product_card_color ? { backgroundColor: data.extra.product_card_color, borderColor: 'transparent' } : {}}
                    />
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

    // API Priority Styles
    const apiBgColor = data.extra?.bg_color;
    const apiIsDark = data.extra?.is_dark !== undefined ? data.extra.is_dark : getIsDark(apiBgColor);

    const config = styleConfig[type] || styleConfig.hero;
    const isDark = apiIsDark !== null ? apiIsDark : config.isDark;

    return (
        <section
            className={`py-8 lg:py-16 ${config.bg} relative overflow-hidden`}
            style={data.extra?.bg_color ? { backgroundColor: data.extra.bg_color } : {}}
        >
            {isDark && <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />}

            <div className="max-w-[1300px] mx-auto px-5 lg:px-12 relative">
                <div className={`flex flex-col lg:flex-row gap-6 lg:gap-16 lg:items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Header Column: Title and Description */}
                    <div className={`w-full lg:w-[42%] space-y-2 animate-fade-in ${isReversed ? 'lg:pl-12' : 'lg:pr-8'}`}>
                        <SectionHeader data={data} config={config} isDark={isDark} type={type} />

                        {type === 'subscription' && <SubscriptionForm data={data} config={config} isDark={isDark} />}

                        {/* Items on left only if products are present on right */}
                        {hasItems && hasProducts && <ItemsRenderer items={items} isDark={isDark} data={data} />}

                        <ActionButtons data={data} config={config} isDark={isDark} type={type} />

                        {type === 'hero' && <StatsRenderer data={data} isDark={isDark} />}
                    </div>

                    {/* Visual Column: Bento Grid or Items or Static Images */}
                    <div className="w-full lg:w-[58%] animate-fade-in mt-12 lg:mt-0">
                        {hasProducts ? (
                            <BentoProductGrid products={products} isDark={isDark} data={data} />
                        ) : hasItems ? (
                            <div className="animate-fade-in">
                                <ItemsRenderer items={items} isDark={isDark} data={data} />
                            </div>
                        ) : (
                            <StaticImageGrid data={data} isDark={isDark} />
                        )}
                    </div>
                </div>

                {/* Secondary Extension (Below Main Grid) */}
                {data.heading_secondary && (
                    <div className={`flex flex-col lg:flex-row gap-10 items-center border-t border-black/5 pt-16 mt-20 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border-[8px] border-white/50">
                            <Image src={processUrl(data.image)} alt="Secondary Visual" fill className="object-cover" />
                        </div>
                        <div className="w-full lg:w-1/2 space-y-6">
                            <h3
                                className={`text-2xl lg:text-[36px] font-serif font-bold leading-tight ${!data.extra?.color && config.title}`}
                                style={data.extra?.color ? { color: data.extra.color } : {}}
                            >{data.heading_secondary}</h3>
                            <p
                                className={`text-[17px] leading-relaxed border-l-3 border-[#8dbd64]/20 pl-6 italic ${!data.extra?.text_color && (isDark ? 'text-white/60' : 'text-[#4a5f3a]')}`}
                                style={data.extra?.text_color ? { color: data.extra.text_color, opacity: 0.8 } : {}}
                            >{data.description_secondary}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UnifiedSection;
;

