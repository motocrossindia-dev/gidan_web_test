'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useCallback, memo, useEffect } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { FaRegHeart, FaHeart, FaStar, FaShoppingCart, FaCartPlus, FaCheck } from "react-icons/fa";
import { MdOutlineShoppingBag, MdOutlineCartArrowDown } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setPendingCartItem } from "../../redux/Slice/cartSlice";
import { setPendingWishlistItem } from "../../redux/Slice/addtowishlistSlice";
import { savePendingCartItem, savePendingWishlistItem } from "../../utils/pendingAction";
import { enqueueSnackbar } from "notistack";
// import img from "./img";
import ReactStars from "react-rating-stars-component";
import axiosInstance from "../../Axios/axiosInstance";
import { getProductUrl } from "../../utils/urlHelper";
import { trackAddToCart, trackRemoveFromCart, trackAddToWishlist } from "../../utils/ga4Ecommerce";
import { ArrowRight } from 'lucide-react';


const StarsOnCards = ({ rating, ratingNumber }) => {

    return (
        <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(rating) ? "text-[#EAB308]" : "text-gray-300"
                        }`}
                />
            ))}
            <p className="text-[12px] font-medium text-gray-500">
                {rating > 0 ? rating.toFixed(1) : "0.0"} ({ratingNumber})
            </p>
        </div>

    )
}

const ProductCard = ({
    name: propName,
    price: propPrice,
    imageUrl: propImageUrl,
    product,
    userRating,
    getProducts,
    ratingNumber,
    mrp: propMrp,
    ribbon: propRibbon,
    variant = 'default',
    extra = {}
}) => {
    const isBento = variant === 'bento' || variant === 'bento-large';
    const isBentoLarge = variant === 'bento-large';

    // Normalize product data for universal usage
    const pData = product?.product_data || product || {};
    const name = propName || pData.name || "Gidan Selection";

    const originalPrice = parseFloat(propMrp || pData.mrp) || 0;
    const price = parseFloat(propPrice || pData.selling_price) || originalPrice;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const ribbon = propRibbon || pData.ribbon;
    const avgRating = userRating || pData.product_rating?.avg_rating || 0;
    const ratingsCount = ratingNumber || pData.product_rating?.num_ratings || 0;

    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const [isRehydrated, setIsRehydrated] = useState(false);
    const [badgeCycleIndex, setBadgeCycleIndex] = useState(0);

    // Ensure we only show highlights after Redux-Persist has rehydrated on hard reload
    useEffect(() => {
        setIsRehydrated(true);

        // Badge Rotation every 5 seconds
        const interval = setInterval(() => {
            setBadgeCycleIndex((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // SOURCE OF TRUTH: Use API flags if available, otherwise check Redux as fallback
    const isInWishlist = Boolean(product?.is_wishlist) || (isRehydrated && wishlistItems.some(item => (item.id === product?.id || item.prod_id === product?.id || item.main_prod_id === product?.id)));
    const isItemInCart = Boolean(product?.is_cart) || (isRehydrated && cartItems.some(item => (item.id === product?.id || item.prod_id === product?.id || item.main_prod_id === product?.id)));

    const flagsData = product?.flags || {};

    const handleAddToWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            dispatch(setPendingWishlistItem(product));
            savePendingWishlistItem({ main_prod_id: product?.id });
            enqueueSnackbar("Added to wishlist (Guest)", { variant: "success" });
            window.dispatchEvent(new Event("wishlistUpdated"));
            return;
        }

        try {
            if (isInWishlist) {
                const response = await axiosInstance.delete(
                    `/order/wishlist/?main_product_id=${product.id}`,
                );
                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Product Removed from wishlist!", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                }
            } else {
                const response = await axiosInstance.post(
                    `/order/wishlist/`,
                    { main_prod_id: product.id },
                );
                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Added to wishlist", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                    trackAddToWishlist(product);
                }
            }
            if (typeof getProducts === 'function') {
                getProducts();
            }
        } catch (error) { }
    }, [isAuthenticated, router, isInWishlist, product, getProducts]);

    const handleAddToCart = useCallback(async (e) => {
        if (!isAuthenticated) {
            dispatch(setPendingCartItem(product));
            savePendingCartItem({ main_prod_id: product?.id });
            enqueueSnackbar("Added to cart (Guest)", { variant: "success" });
            window.dispatchEvent(new Event("cartUpdated"));
            return;
        }

        // Debug: Check if product and product.id exist
        if (!product || !product.id) {
            console.error("Product or product.id is undefined:", product);
            enqueueSnackbar("Error: Product information is missing", { variant: "error" });
            return;
        }

        try {
            if (isItemInCart) {
                // Item already in cart — just show info
                enqueueSnackbar("This item is already in your cart.", { variant: "info" });
                return;
            } else {
                const payload = {
                    main_prod_id: product.id,
                    quantity: 1
                };
                console.log("Add to cart payload:", payload);

                const response = await axiosInstance.post(
                    `/order/cart/`,
                    payload,
                );

                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Added to cart", { variant: "success" });
                    window.dispatchEvent(new Event("cartUpdated"));
                    trackAddToCart(product);
                }
            }
            if (typeof getProducts === 'function') {
                getProducts();
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            const msg = error.response?.data?.message || "";
            if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists") || error.response?.status === 400) {
                enqueueSnackbar("This item is already in your cart.", { variant: "info" });
            } else {
                enqueueSnackbar(msg || "Failed to add to cart", { variant: "error" });
            }
        }
    }, [isAuthenticated, router, isItemInCart, product, getProducts]);

    // ========== OLD CODE (Before Feb 16, 2026) - COMMENTED OUT ==========
    // const handleQuickView = useCallback((e) => {
    //     const category_slug = product?.category_slug;
    //     const sub_category_slug = product?.sub_category_slug;
    //     const productUrl = `/${category_slug}/${sub_category_slug}/${product.slug}/`;
    //     router.push(productUrl, {
    //         state: {
    //             product_id: product.id,
    //             category_slug: category_slug,
    //             sub_category_slug: sub_category_slug
    //         }
    //     });
    // }, [navigate, product.category_slug, product.sub_category_slug, product.slug, product.id]);
    // ========== END OLD CODE ==========

    // ========== NEW CODE (Feb 16, 2026) - Replaced with Link ==========
    const productUrl = getProductUrl(product);
    // ========== END NEW CODE ==========

    // Data from new API
    const subcategory = product?.sub_category_slug?.replace(/-/g, " ").toUpperCase();
    const category = product?.category_slug?.replace(/-/g, " ").toUpperCase();
    const scientificName = product?.meta_title?.split(" - ")[0]; // Just a heuristic based on meta_title example

    // stock handling logic
    const isOutOfStock = product?.is_stock === false || (product?.stock !== undefined && product?.stock <= 0);
    const stockCount = product?.stock || 0;

    const getStockConfig = (count) => {
        if (count <= 0) return { label: "Out of Stock", color: "#6B7280", barColor: "bg-gray-300", percent: 0 };

        // Progress bar based on actual count vs a maximum baseline (e.g., 50)
        // Adjust the denominator (50) to change how quickly the bar fills/empties
        const maxThreshold = 50;
        const calculatedPercent = (count / maxThreshold) * 100;

        if (count <= 10) return { label: `Only ${count} left!`, color: "#EF4444", barColor: "bg-red-500", percent: Math.max(calculatedPercent, 10) };
        if (count <= 30) return { label: `${count} in stock`, color: "#F59E0B", barColor: "bg-orange-500", percent: calculatedPercent };
        if (count <= 50) return { label: `${count} available`, color: "#10B981", barColor: "bg-emerald-500", percent: calculatedPercent };
        return { label: "In Stock", color: "#059669", barColor: "bg-green-600", percent: 100 };
    };

    const stockConfig = getStockConfig(stockCount);
    const stockStatus = stockCount > 0 ? stockConfig.label : null;

    // Image handling logic for consistent URL prefixing across the app
    const getImages = () => {
        const imageList = product?.image || [];

        const processUrl = (url) => {
            if (!url || typeof url !== 'string' || url === "") return "/static/logo/gidan.png";
            if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/static')) return url;
            return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${url}` : `${process.env.NEXT_PUBLIC_API_URL || ''}/${url}`;
        };

        const primary = processUrl(propImageUrl || product?.image);

        if (Array.isArray(imageList) && imageList.length >= 2) {
            return {
                main: processUrl(imageList[0]),
                hover: processUrl(imageList[1])
            };
        }
        return { main: primary, hover: primary };
    };

    const productImages = getImages();

    // Badge Logic - Returns up to 5 badges based on user request
    const getBadges = () => {
        const badgeList = [];

        // 1. Ribbon (Now Top Right) - e.g. "NEW", "ON SALE"
        if (ribbon) {
            badgeList.push({ text: ribbon, color: "#EF4444", position: "top-right-float" });
        }

        // 2. Flags (Now Top Left) - e.g. "TRENDING"
        const flags = product?.flags || flagsData || {};
        const activeFlags = Object.entries(flags)
            .filter(([_, value]) => value === true)
            .map(([key]) => key.replace("is_", "").replace(/_/g, " ").toUpperCase());

        if (activeFlags.length > 0) {
            // Cycle through flags if multiple
            const currentFlag = activeFlags[badgeCycleIndex % activeFlags.length];
            badgeList.push({ text: currentFlag, color: "#F59E0B", position: "top-left" });
        }

        // 3. Care Guides, 4. Space & Light, 5. Special Filters (Floating Bottom)
        const categories = [
            { key: 'care_guides', color: '#10B981' },        // Emerald
            { key: 'space_and_light', color: '#6366F1' },   // Indigo
            { key: 'special_filters', color: '#8B5CF6' }    // Violet
        ];

        categories.forEach(cat => {
            const items = product?.[cat.key] || [];
            if (items.length > 0) {
                // Cycle through items within this category if multiple
                const currentItem = items[badgeCycleIndex % items.length];
                const text = typeof currentItem === 'object' ? (currentItem.title || currentItem.name || "") : currentItem;
                if (text) {
                    badgeList.push({ text: text.toUpperCase(), color: cat.color, position: "bottom-float" });
                }
            }
        });

        // Add Out of Stock override
        if (isOutOfStock) {
            badgeList.unshift({ text: "OUT OF STOCK", color: "#374151", position: "top-left" });
        }

        return badgeList;
    };

    const badges = getBadges();
    if (isBentoLarge) {
        return (
            <Link href={productUrl} className="relative flex flex-col w-full h-full bg-gradient-to-br from-[#7fb35d] to-[#4b7a33] overflow-hidden group rounded-[50px] shadow-2xl transition-all duration-700 hover:scale-[1.01]">
                {/* Floating Rating Badge (Top Left) */}
                {avgRating > 0 && (
                    <div className="absolute top-5 left-5 z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl animate-fade-in border border-white flex flex-col items-center">
                        <div className="flex items-center gap-1 text-[#204516]">
                            <FaStar size={11} className="text-[#EAB308]" />
                            <span className="text-[12px] font-extrabold leading-tight">{avgRating.toFixed(1)}</span>
                        </div>
                        <div className="text-[6.5px] text-[#1a3d0a]/40 font-bold uppercase tracking-[0.1em] leading-none mt-1">
                            {ratingsCount} {ratingsCount === 1 ? "review" : "reviews"}
                        </div>
                    </div>
                )}

                {/* Floating Badges (Top Right) */}
                <div className="absolute top-5 right-5 z-30 flex flex-col items-end gap-1.5">
                    {ribbon && (
                        <span className="bg-[#fa8e4c] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg tracking-widest uppercase animate-fade-in">
                            {ribbon}
                        </span>
                    )}
                    {pData.is_latest && (
                        <span className="bg-[#a8e070] text-[#1a3d0a] text-[9px] font-bold px-3 py-1 rounded-full shadow-lg tracking-widest uppercase animate-fade-in">
                            New Arrival
                        </span>
                    )}
                </div>

                {/* Image Container (Flex-Grow) */}
                <div className="flex-grow relative w-full flex items-center justify-center p-8 pt-16">
                    <div className="relative w-full h-[85%] transform group-hover:scale-110 transition-transform duration-1000">
                        <Image
                            src={productImages.main}
                            alt={name}
                            fill
                            className="object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.25)]"
                        />
                    </div>
                </div>

                {/* Info Panel (Bottom: flex-shrink-0) */}
                <div className="flex-shrink-0 p-6 lg:p-7 pt-0">
                    <div className="bg-white/95 backdrop-blur-xl border border-white p-6 lg:p-7 rounded-[40px] text-[#1a1f14] shadow-2xl transition-all group-hover:bg-white">
                        <div className="flex flex-col gap-0.5 mb-2.5">
                            <span className="text-[8px] lg:text-[9px] font-bold text-[#2d5a1b] opacity-40 uppercase tracking-[0.25em]">
                                {subcategory || category || "Gidan Selection"}
                            </span>
                            <h3 className="text-[14px] lg:text-[16px] font-bold tracking-tight uppercase line-clamp-1">
                                {name}
                            </h3>
                            {stockStatus && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className={`w-1 h-1 rounded-full animate-pulse`} style={{ backgroundColor: stockConfig.color }} />
                                    <span className="text-[7.5px] font-bold uppercase tracking-wider opacity-60" style={{ color: stockConfig.color }}>
                                        {stockStatus}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-black/5 pt-3">
                            <div className="flex flex-col">
                                <span className="text-[18px] lg:text-[20px] font-black text-[#1a1f14] leading-tight tracking-tight">₹{Math.round(price)}</span>
                                {originalPrice > price && (
                                    <span className="text-[10px] lg:text-[11px] text-[#4a4a4a] opacity-40 line-through decoration-[1.5px] decoration-black/10">MRP: ₹{Math.round(originalPrice)}</span>
                                )}
                            </div>
                            <div className="text-[9px] font-black text-[#2d5a1b] flex items-center gap-1 tracking-[0.1em] hover:opacity-70 transition-all uppercase">
                                DETAILS <ArrowRight size={11.5} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // ==========================================
    // RENDER: BENTO VARIANT (Square/Auto)
    // ==========================================
    if (variant === 'bento') {
        const isBrown = extra.is_brown_variant || false;
        const bgGradient = isBrown
            ? "from-[#c68953] to-[#8c5a2b]"
            : "from-[#8cb369] to-[#6a8d4c]";

        return (
            <Link href={productUrl} className={`relative flex flex-col w-full h-full bg-gradient-to-br ${bgGradient} overflow-hidden group rounded-[50px] shadow-xl transition-all duration-700 hover:scale-[1.02]`}>
                {/* Rating Overlay (Top Left) */}
                {avgRating > 0 && (
                    <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 animate-fade-in text-[#204516]">
                        <FaStar size={8} className="text-[#EAB308]" />
                        <span className="text-[9px] font-bold leading-tight">{avgRating.toFixed(1)}</span>
                    </div>
                )}

                {/* Floating Ribbon (Top Right) */}
                {ribbon && (
                    <div className="absolute top-4 right-4 z-30">
                        <span className="bg-white/90 backdrop-blur-md text-[#fa8e4c] text-[7.5px] font-bold px-2 px-1 rounded-full shadow-sm tracking-[0.15em] uppercase">
                            {ribbon}
                        </span>
                    </div>
                )}

                {/* Image Container (Flex-Grow) */}
                <div className="flex-grow relative w-full flex items-center justify-center p-10 pt-14">
                    <div className="relative w-full h-[90%] transform group-hover:scale-110 transition-transform duration-1000">
                        <Image
                            src={productImages.main}
                            alt={name}
                            fill
                            className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
                        />
                    </div>
                </div>

                {/* Compact Info Panel (Bottom: flex-shrink-0) */}
                <div className="flex-shrink-0 p-4 pt-0">
                    <div className="bg-white/95 backdrop-blur-xl border border-white p-4 lg:p-5 rounded-[32px] text-[#1a1f14] transition-all group-hover:bg-white shadow-lg">
                        <div className="flex flex-col gap-0 mb-1">
                            <span className="text-[7px] font-bold text-[#2d5a1b] opacity-40 uppercase tracking-[0.15em] line-clamp-1">
                                {subcategory || category || "Gidan Selection"}
                            </span>
                            <h4 className="text-[11px] lg:text-[12px] font-bold leading-tight truncate uppercase">
                                {name}
                            </h4>
                            {stockStatus && (
                                <span className="text-[7.5px] font-bold opacity-30 uppercase tracking-tight mt-0.5" style={{ color: stockConfig.color }}>
                                    {stockStatus}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between border-t border-black/5 pt-2.5">
                            <div className="flex flex-col">
                                <span className="text-[14px] lg:text-[15px] font-black text-[#1a1f14] leading-tight">₹{Math.round(price)}</span>
                                {originalPrice > price && (
                                    <span className="text-[8.5px] text-[#4a4a4a] opacity-30 line-through decoration-[1px]">₹{Math.round(originalPrice)}</span>
                                )}
                            </div>
                            <div className="text-[8.5px] font-black text-[#2d5a1b] hover:opacity-70 transition-opacity uppercase tracking-wider">
                                DETAILS
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <>

            {/* Desktop & Tablet View */}
            <div className="hidden sm:block w-full">
                <div
                    onClick={() => router.push(productUrl)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative flex flex-col items-start text-left transition-all duration-500 bg-white rounded-[2.5rem] border border-gray-100/60 overflow-hidden cursor-pointer hover:shadow-[0_22px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2"
                >
                    {/* Premium Diagonal Ribbon (Top Right) */}
                    {badges.filter(b => b.position === "top-right-float").map((badge, idx) => (
                        <div key={idx} className="absolute top-0 right-0 z-30 overflow-hidden w-28 h-28 pointer-events-none">
                            <div className="absolute top-0 right-0 w-[150%] min-h-[34px] bg-gradient-to-r from-[#D83636] via-[#EF4444] to-[#D83636] text-white flex flex-col items-center justify-center transform rotate-45 translate-x-[25%] translate-y-[45%] origin-center border-b border-white/20 shadow-lg px-4 group">
                                {/* Top/Bottom Dashed Accents */}
                                <div className="w-full border-t border-dashed border-white/30 h-px mb-1 opacity-40" />

                                {/* Luxury Shimmer Effect */}
                                <div
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    style={{
                                        animation: 'shimmer 3s infinite linear',
                                        width: '200%'
                                    }}
                                />
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] relative z-10 drop-shadow-md py-0.5">
                                    {badge.text}
                                </span>
                                <div className="w-full border-b border-dashed border-white/30 h-px mt-1 opacity-40" />
                            </div>
                        </div>
                    ))}

                    {/* Premium Status Flag (Top Left) */}
                    {badges.filter(b => b.position === "top-left").map((badge, idx) => (
                        <div key={idx} className="absolute top-5 left-5 z-20 overflow-hidden rounded-lg">
                            <div
                                className="text-white px-3 py-1 text-[9px] font-black shadow-lg tracking-[0.2em] uppercase relative overflow-hidden backdrop-blur-md border border-white/20"
                                style={{ backgroundColor: `${badge.color}dd` }}
                            >
                                {/* Glow Shimmer */}
                                <div
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    style={{
                                        animation: 'shimmer 2.5s infinite linear',
                                        width: '200%'
                                    }}
                                />
                                <span className="relative z-10">{badge.text}</span>
                            </div>
                        </div>
                    ))}

                    {/* Wishlist Button - Adjusted for Ribbon Compatibility */}
                    <button aria-label="Add to wishlist"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWishlist();
                        }}
                        className={`absolute ${badges.some(b => b.position === "top-right-float") ? "top-14" : "top-5"} right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-40 shadow-sm ${isInWishlist ? "bg-red-50 text-red-500 border border-red-200" : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-white"
                            }`}
                    >
                        {isInWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                    </button>

                    <div className="relative w-full aspect-[1/1] bg-gradient-to-b from-[#8cb369]/10 to-transparent flex justify-center items-center overflow-hidden">
                        {/* Primary Image with Luxurious Scale Transition */}
                        <Image
                            src={productImages.main}
                            alt={name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            priority={false}
                            className={`object-contain p-8 md:p-10 lg:p-12 transition-all duration-700 ease-out group-hover:scale-110 ${isHovered && productImages.hover !== productImages.main ? "opacity-0 scale-95" : "opacity-100 scale-100"
                                } ${isOutOfStock ? "grayscale opacity-40" : ""}`}
                        />

                        {/* Hover Image Reveal */}
                        {productImages.hover !== productImages.main && (
                            <Image
                                src={productImages.hover}
                                alt={`${name} hover`}
                                fill
                                sizes="(max-width: 1024px) 50vw, 33vw"
                                className={`object-contain p-8 md:p-10 lg:p-12 transition-all duration-700 ease-out absolute inset-0 group-hover:scale-110 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                    } ${isOutOfStock ? "grayscale opacity-40" : ""}`}
                            />
                        )}

                        {/* Bottom Tags Floating on Image */}
                        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            {badges.filter(b => b.position === "bottom-float").map((badge, idx) => (
                                <div
                                    key={idx}
                                    className="px-2 py-1 text-[8px] font-bold rounded-lg shadow-sm uppercase tracking-tighter text-white/90 backdrop-blur-sm"
                                    style={{ backgroundColor: `${badge.color}dd` }}
                                >
                                    {badge.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full p-4 md:p-5 lg:p-6 flex flex-col gap-1 md:gap-1.5">
                        {/* Brand / Category Tag */}
                        <div className="text-[10px] font-extrabold text-[#375421] opacity-60 uppercase tracking-[0.2em] mb-1">
                            {subcategory || category || "Gidan Selection"}
                        </div>

                        {/* Title - Elegant weight */}
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 leading-tight line-clamp-1 group-hover:text-[#375421] transition-colors">
                            {name}
                        </h3>

                        {/* Rating Display */}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-yellow-500 gap-0.5">
                                <FaStar className="w-3 h-3" />
                                <span className="text-xs font-bold text-gray-700">{avgRating > 0 ? avgRating.toFixed(1) : "5.0"}</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">({ratingsCount || 0})</span>
                        </div>

                        {/* Price & Actions Section */}
                        <div className="flex items-end justify-between mt-3 md:mt-4">
                            <div className="flex flex-col">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-lg lg:text-xl font-black text-gray-900 leading-none">
                                        ₹{Math.round(price)}
                                    </span>
                                    {originalPrice > price && (
                                        <span className="text-[9.5px] lg:text-[10.5px] text-gray-400 line-through font-medium opacity-60 leading-none">
                                            MRP: ₹{Math.round(originalPrice)}
                                        </span>
                                    )}
                                </div>
                                {stockStatus && (
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <div className={`w-1 h-1 rounded-full animate-pulse`} style={{ backgroundColor: stockConfig.color }} />
                                        <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: stockConfig.color }}>
                                            {stockStatus}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                className={`h-10 lg:h-12 px-3 md:px-4 lg:px-6 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm active:scale-95 ${isOutOfStock
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : isItemInCart
                                            ? "bg-[#6D7D62] text-white"
                                            : "bg-[#375421] text-white hover:shadow-lg hover:shadow-[#375421]/20"
                                    }`}
                            >
                                <FaShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-widest leading-none">
                                    {isItemInCart ? "Added" : "Add"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View - Redesigned for 2-column premium grid */}
            <div className="sm:hidden w-full">
                <div
                    onClick={() => router.push(productUrl)}
                    className="group relative flex flex-col items-start text-left bg-white rounded-[1.5rem] border border-gray-100/80 overflow-hidden shadow-sm active:scale-[0.98] transition-all"
                >
                    {/* Mobile Premium Ribbon (Top Right) */}
                    {badges.filter(b => b.position === "top-right-float").map((badge, idx) => (
                        <div key={idx} className="absolute top-0 right-0 z-30 overflow-hidden w-20 h-20 pointer-events-none">
                            <div className="absolute top-0 right-0 w-[150%] min-h-[26px] bg-gradient-to-r from-[#D83636] via-[#EF4444] to-[#D83636] text-white flex flex-col items-center justify-center transform rotate-45 translate-x-[25%] translate-y-[45%] origin-center shadow-md px-2">
                                <span className="text-[7px] font-black uppercase tracking-widest relative z-10 drop-shadow-sm">
                                    {badge.text}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Mobile Status Flag (Top Left) */}
                    {badges.filter(b => b.position === "top-left").map((badge, idx) => (
                        <div key={idx} className="absolute top-2.5 left-2.5 z-20 overflow-hidden rounded-md">
                            <div
                                className="text-white px-2 py-0.5 text-[7px] font-black shadow-md tracking-widest uppercase relative overflow-hidden backdrop-blur-sm"
                                style={{ backgroundColor: `${badge.color}ee` }}
                            >
                                <span className="relative z-10">{badge.text}</span>
                            </div>
                        </div>
                    ))}

                    {/* Wishlist Mobile - Adjusted Position */}
                    <button aria-label="Add to wishlist"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToWishlist();
                        }}
                        className={`absolute ${badges.some(b => b.position === "top-right-float") ? "top-10" : "top-2.5"} right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-40 shadow-sm ${isInWishlist ? "bg-red-50 text-red-500 border border-red-200" : "bg-white/95 text-gray-400"
                            }`}
                    >
                        {isInWishlist ? <FaHeart className="w-3.5 h-3.5" /> : <FaRegHeart className="w-3.5 h-3.5" />}
                    </button>

                    <div className="relative w-full aspect-square bg-[#F9F9F8] flex justify-center items-center overflow-hidden">
                        <Image
                            src={productImages.main}
                            alt={name}
                            fill
                            sizes="50vw"
                            className={`object-contain p-10 ${isOutOfStock ? "grayscale opacity-40" : ""}`}
                        />
                    </div>

                    <div className="w-full p-3.5 flex flex-col gap-1">
                        <div className="text-[8px] font-extrabold text-[#375421] opacity-50 uppercase tracking-[0.15em]">
                            {category || "PLANT"}
                        </div>

                        <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-1">
                            {name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-500">{avgRating > 0 ? avgRating.toFixed(1) : "5.0"}</span>
                            <div className="flex text-yellow-500">
                                <FaStar className="w-2 h-2" />
                            </div>
                        </div>

                        <div className="flex flex-col mt-2 gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 leading-none">
                                    ₹{Math.round(price)}
                                </span>
                                {originalPrice > price && (
                                    <span className="text-[8.5px] text-gray-400 line-through opacity-50 font-medium">
                                        ₹{Math.round(originalPrice)}
                                    </span>
                                )}
                            </div>

                            <button
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                className={`w-full h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${isOutOfStock
                                        ? "bg-gray-100 text-gray-300"
                                        : isItemInCart
                                            ? "bg-[#6D7D62] text-white"
                                            : "bg-[#375421] text-white"
                                    }`}
                            >
                                <FaShoppingCart className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                    {isItemInCart ? "In Cart" : "Add"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard);

