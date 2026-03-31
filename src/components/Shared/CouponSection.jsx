'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, X, Loader2, ShieldCheck } from 'lucide-react';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../Axios/axiosInstance';
import RightDrawer from './RightDrawer';

/**
 * CouponSection Component
 * 
 * @param {string} mode - 'cart', 'pdp', or 'checkout'
 * @param {string} orderId - Required for 'checkout' mode
 * @param {Array} products - Required for 'cart' and 'pdp' modes [{prod_id, quantity}]
 * @param {Object} appliedCoupon - The currently applied coupon object
 * @param {Function} onSuccess - Callback when a coupon is successfully applied
 * @param {Function} onRemove - Callback when the coupon is removed
 */
const CouponSection = ({
    mode = 'cart',
    orderId,
    products = [],
    appliedCoupon,
    onSuccess,
    onRemove
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [coupons, setCoupons] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch available coupons
    const fetchCoupons = async () => {
        setIsFetching(true);
        try {
            // General coupons endpoint
            const endpoint = orderId ? `/coupon/coupons/?order_id=${orderId}` : `/coupon/coupons/`;
            const response = await axiosInstance.get(endpoint);

            if (response.status === 200) {
                const fetchedCoupons = response.data.coupons || response.data.data?.coupons || [];
                setCoupons(fetchedCoupons);
            }
        } catch (error) {
            // 401/403 is expected for guest users — silently ignore
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error("Failed to fetch coupons:", error);
            }
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [orderId]);

    const handleApplyCoupon = async (couponInput) => {
        const targetCode = typeof couponInput === 'string' ? couponInput : couponInput.code;
        const targetId = typeof couponInput === 'object' ? couponInput.id : null;

        if (!targetCode && !targetId) {
            enqueueSnackbar("Please enter or select a coupon code", { variant: "warning" });
            return;
        }

        setIsApplying(true);
        try {
            let response;
            if (mode === 'checkout') {
                // Checkout mode: Applies directly to order
                response = await axiosInstance.post(`/order/applyCoupon/`, {
                    selected_coupon_id: targetId,
                    order_id: orderId
                });
            } else {
                // Cart or PDP mode: Preview functionality
                const codeToApply = targetCode || coupons.find(c => c.id === targetId)?.code;

                const payload = {
                    coupon_code: codeToApply.toUpperCase(),
                    order_source: mode === 'pdp' ? 'product' : mode,
                };

                if (mode === 'pdp' && products.length > 0) {
                    // For standalone product preview, backend often expects direct prod_id/quantity
                    payload.prod_id = products[0].prod_id || products[0].product_id || products[0].id;
                    payload.quantity = products[0].quantity || 1;
                } else {
                    payload.products = products.map(p => ({
                        prod_id: p.prod_id || p.product_id || p.id,
                        quantity: p.quantity || 1
                    }));
                }

                const endpoint = mode === 'pdp' ? `/order/previewCouponProduct/` : `/order/previewCoupon/`;
                response = await axiosInstance.post(endpoint, payload);
            }

            if (response.status === 200) {
                const responseData = response.data.data || response.data;
                onSuccess(responseData);
                setShowDrawer(false);
                setManualCode('');
                enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to apply coupon. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemove = async () => {
        if (!onRemove) return;
        setIsApplying(true);
        try {
            await onRemove();
            setManualCode('');
        } catch (error) {
            enqueueSnackbar("Failed to remove coupon", { variant: "error" });
        } finally {
            setIsApplying(false);
        }
    };

    // Find a "Try it" coupon suggestion
    const bestCoupon = coupons.find(c => c.is_applicable) || coupons[0];

    return (
        <div className="coupon-section-container">
            {appliedCoupon ? (
                /* APPLIED STATE */
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl relative overflow-hidden group shadow-sm transition-all animate-in fade-in duration-300">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Tag className="w-4 h-4 text-emerald-800" />
                            <span className="text-sm font-black text-emerald-800 tracking-widest uppercase">
                                {appliedCoupon.coupon_code || appliedCoupon.code}
                            </span>
                            <div className="px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded uppercase tracking-tighter shadow-sm animate-pulse">Applied</div>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-bold tracking-tight">
                            Saved ₹{Math.round(appliedCoupon.discount_amount || appliedCoupon.order?.coupon_discount || 0)} extra on this order!
                        </p>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isApplying}
                        className="relative z-10 w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-emerald-800 hover:bg-red-50 hover:text-red-600 transition-all group-hover:scale-110 active:scale-90"
                    >
                        {isApplying ? <Loader2 className="w-4 h-4 animate-spin text-emerald-800" /> : <X className="w-4 h-4" />}
                    </button>
                    <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 text-emerald-100 opacity-30 pointer-events-none" />
                </div>
            ) : (
                /* IDLE STATE */
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="PROMO CODE"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(manualCode)}
                                className="w-full pl-4 pr-4 py-3.5 bg-white border-2 border-dashed border-[#375421]/20 rounded-2xl text-sm font-black text-gray-900 focus:bg-white focus:border-[#375421] outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest"
                            />
                        </div>
                        <button
                            onClick={() => handleApplyCoupon(manualCode)}
                            disabled={isApplying || !manualCode}
                            className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#375421] transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
                        >
                            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                        </button>
                    </div>

                    {!appliedCoupon && coupons.length > 0 && (
                        <div className="flex items-center justify-between px-1 transition-all animate-in fade-in slide-in-from-top-1 duration-500">
                            <div className="flex items-center gap-x-2">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter italic">Try</span>
                                <button
                                    onClick={() => handleApplyCoupon(bestCoupon)}
                                    disabled={isApplying}
                                    className={`text-[10px] font-black underline decoration-2 decoration-dashed transition-all uppercase tracking-tight
                                        ${bestCoupon?.is_applicable ? 'text-[#375421]/80 hover:text-[#375421] decoration-[#375421]/30' : 'text-gray-400 decoration-gray-200'}
                                    `}
                                >
                                    {bestCoupon?.code}
                                </button>
                                <span className="text-[10px] text-gray-300 font-bold opacity-50">· Launch from payment</span>
                            </div>

                            <button
                                onClick={() => setShowDrawer(true)}
                                className="text-[10px] font-black text-[#375421] uppercase tracking-[0.05em] hover:bg-[#375421]/5 px-2 py-1 rounded-lg transition-all flex items-center gap-1 group"
                            >
                                <Sparkles className="w-3 h-3 text-orange-400 group-hover:animate-bounce" />
                                {coupons.length > 1 ? `View ${coupons.length} More` : 'View Details'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Coupons Drawer */}
            <RightDrawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Your Exclusive Offers"
                subtitle="Available high-value coupons for your garden"
                footerText="Promo codes can only be combined with active site-wide deals!"
            >
                <div className="space-y-4 px-1 py-1">
                    {isFetching && coupons.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-40">
                            <Loader2 className="w-10 h-10 animate-spin text-emerald-800 mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest italic">Fetching best deals...</p>
                        </div>
                    ) : coupons.length > 0 ? (
                        coupons.map((c) => (
                            <div
                                key={c.id}
                                className={`group relative p-6 border-2 rounded-[32px] transition-all duration-500 overflow-hidden ${c.is_applicable
                                    ? 'bg-white border-gray-900/10 hover:border-[#375421] shadow-sm hover:shadow-xl hover:shadow-green-50/50'
                                    : 'bg-site-bg border-gray-100 opacity-70 grayscale-[0.2]'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`font-black text-[12px] px-4 py-2 rounded-2xl border-2 tracking-[0.2em] uppercase transition-all
                                                ${c.is_applicable
                                                    ? 'text-gray-900 bg-emerald-50 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]'
                                                    : 'text-gray-400 bg-site-bg border-gray-200'
                                                }`}
                                            >
                                                {c.code}
                                            </span>
                                            {c.is_applicable && (
                                                <div className="flex -space-x-1">
                                                    <span className="text-xl animate-bounce">🔥</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 uppercase tracking-tight">{c.description}</h3>
                                        <div className="flex items-center gap-2 mt-4">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">
                                                Min. Order: ₹{c.minimum_order_value}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-dashed border-gray-100 relative z-10 text-center">
                                    {appliedCoupon?.coupon_code === c.code || appliedCoupon?.code === c.code ? (
                                        <div className="w-full py-4.5 rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] bg-emerald-50 text-emerald-700 border-2 border-emerald-200 flex items-center justify-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Already Applied
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => c.is_applicable && handleApplyCoupon(c)}
                                            disabled={isApplying || !c.is_applicable}
                                            className={`w-full py-4.5 rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3
                                            ${c.is_applicable
                                                    ? 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none'
                                                    : 'bg-site-bg text-gray-300 cursor-not-allowed border-2 border-gray-100 flex-row-reverse'
                                                }`}
                                        >
                                            {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : c.is_applicable ? 'APPLY NOW' : 'NOT ELIGIBLE'}
                                            {c.is_applicable && !isApplying && <Sparkles className="w-4 h-4 text-orange-400" />}
                                        </button>
                                    )}
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-30">
                            <Tag className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">No active coupons found</p>
                        </div>
                    )}
                </div>
            </RightDrawer>
        </div>
    );
};

export default CouponSection;
