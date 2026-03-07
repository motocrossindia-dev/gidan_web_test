'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Download,
    RefreshCcw,
    CheckCircle2,
    Calendar,
    CreditCard,
    MapPin,
    Truck,
    Clock,
    X,
    ExternalLink,
    Check,
    AlertCircle
} from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';
import { motion } from "framer-motion";
import WriteAReview from '../ProductData/WriteAReview';
import { getProductUrl } from '../../../utils/urlHelper';

const PostSummaryView = () => {
    const router = useRouter();
    const { id } = useParams(); // This will be the order_id string like BMO... or numeric id
    const [orderData, setOrderData] = useState(null); // From orderHistoryItems
    const [extraOrderDetails, setExtraOrderDetails] = useState(null); // From /order/{id}/
    const [orderHistory, setOrderHistory] = useState(null); // From orderHistory list
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [activeReviewProductId, setActiveReviewProductId] = useState(null);
    const [showGstDetail, setShowGstDetail] = useState(false);
    const [showShippingDetail, setShowShippingDetail] = useState(false);

    const fetchAllOrderDetails = async () => {
        setLoading(true);
        try {
            // 1. Fetch from orderHistory to get numeric ID if "id" is order_id string
            let numericId = id;
            const historyResponse = await axiosInstance.get('/order/orderHistory/');
            if (historyResponse.status === 200) {
                const orders = historyResponse.data.data.orders;
                const currentOrder = orders.find(o => o.id.toString() === id.toString() || o.order_id === id);
                if (currentOrder) {
                    setOrderHistory(currentOrder);
                    numericId = currentOrder.id;
                }
            }

            // 2. Fetch items and basic tracking
            const itemsResponse = await axiosInstance.get(`/order/orderHistoryItems/${numericId}`);
            if (itemsResponse.status === 200) {
                setOrderData(itemsResponse.data.data);
            }

            // 3. Fetch specific details from the new API provided
            const extraResponse = await axiosInstance.get(`/order/${numericId}/`);
            if (extraResponse.status === 200) {
                setExtraOrderDetails(extraResponse.data.data);
            }

        } catch (error) {
            enqueueSnackbar("Failed to load order details", { variant: "error" });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (id) {
            fetchAllOrderDetails();
        }
    }, [id]);

    if (!mounted) return null;

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getInvoice = async () => {
        const numericId = orderHistory?.id || id;
        try {
            const response = await axiosInstance.get(`/order/invoice/${numericId}/`, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `invoice_${orderHistory?.order_id || numericId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            enqueueSnackbar("Failed to download invoice", { variant: "error" });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#5A8A1A] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your order summary...</p>
                </div>
            </div>
        );
    }

    if (!orderData && !extraOrderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Order not found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the order details for ID: {id}</p>
                    <button
                        onClick={() => router.push('/profile/orders')}
                        className="w-full bg-[#232F3E] text-white font-bold py-3 rounded-xl hover:bg-[#37475A] transition-all"
                    >
                        Go Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    const orderIdToDisplay = extraOrderDetails?.order_id || orderHistory?.order_id || id;
    const orderDate = extraOrderDetails?.date || orderHistory?.date;

    // Validation Flags
    const orderStatus = (extraOrderDetails?.status_history?.[0]?.status || orderHistory?.status || "")?.toUpperCase();
    const isDelivered = orderStatus === 'DELIVERED';

    return (
        <div className="min-h-screen bg-white pb-20">

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <p className="text-gray-700">Ordered on {formatDate(orderDate)}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-gray-700">Order# <span className="font-bold">{orderIdToDisplay}</span></p>
                    </div>
                </div>

                {/* Main Summary Card */}
                <div className="border rounded-lg overflow-hidden mb-8 shadow-sm">
                    <div className="bg-gray-50 p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Shipping Address</h3>
                            <div className="text-sm text-gray-700">
                                <p className="font-bold">{extraOrderDetails?.delivery_address?.first_name} {extraOrderDetails?.delivery_address?.last_name || extraOrderDetails?.customer_name}</p>
                                <p>{extraOrderDetails?.delivery_address?.address || extraOrderDetails?.order?.address}</p>
                                <p>{extraOrderDetails?.delivery_address?.city}, {extraOrderDetails?.delivery_address?.state} {extraOrderDetails?.delivery_address?.pincode}</p>
                                <p>India</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Payment Method</h3>
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span>{extraOrderDetails?.payment_method || 'Online Payment'}</span>
                            </div>
                            {extraOrderDetails?.transfer_details?.method && (
                                <p className="text-xs text-gray-500 mt-1 ml-6 uppercase">{extraOrderDetails.transfer_details.method} • {extraOrderDetails.transfer_details.bank || 'Captured'}</p>
                            )}
                        </div>

                        {/* Order Price Breakdown (Checkout Style) */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h3>
                            <div className="space-y-2 text-sm">

                                {/* MRP Total */}
                                <div className="flex justify-between text-gray-600">
                                    <span>MRP Total</span>
                                    <span>₹{(extraOrderDetails?.items || []).reduce((s, i) => s + Number(i.mrp) * i.quantity, 0).toFixed(2)}</span>
                                </div>

                                {/* Product Discount */}
                                {Number(extraOrderDetails?.total_discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span className="flex items-center gap-1">
                                            Discount
                                            {extraOrderDetails?.discount_type && (
                                                <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                                                    {extraOrderDetails.discount_type === "%" ? `${Number(extraOrderDetails.discount_value ?? 0).toFixed(0)}%` : `Flat ₹${Number(extraOrderDetails.discount_value ?? 0).toFixed(2)}`}
                                                </span>
                                            )}
                                        </span>
                                        <span>-₹{Number(extraOrderDetails.total_discount).toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Coupon Discount */}
                                {extraOrderDetails?.coupon_applied && Number(extraOrderDetails?.coupon_discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span className="flex items-center gap-1">
                                            🏷️ Coupon
                                            {extraOrderDetails.coupon_value && (
                                                <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                                                    {extraOrderDetails.coupon_type === "%" ? `${Number(extraOrderDetails.coupon_value).toFixed(0)}%` : `₹${Number(extraOrderDetails.coupon_value).toFixed(2)}`}
                                                </span>
                                            )}
                                        </span>
                                        <span>-₹{Number(extraOrderDetails.coupon_discount).toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Taxable Sub Total */}
                                <div className="flex justify-between text-gray-800 font-semibold border-t pt-2">
                                    <span>Taxable Sub Total</span>
                                    <span>₹{Number(extraOrderDetails?.total_price ?? 0).toFixed(2)}</span>
                                </div>

                                {/* Product GST Toggle */}
                                {(Number(extraOrderDetails?.gst_amount_5 ?? 0) > 0 || Number(extraOrderDetails?.gst_amount_18 ?? 0) > 0) && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowGstDetail(v => !v)}
                                            className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest py-1"
                                        >
                                            <span>Product Tax (GST)</span>
                                            <span>{showGstDetail ? "▲" : "▼"}</span>
                                        </button>
                                        {showGstDetail && (
                                            <div className="space-y-1 text-xs mt-1">
                                                {Number(extraOrderDetails?.gst_amount_5 ?? 0) > 0 && (
                                                    <div className="border border-gray-200 rounded p-2 space-y-0.5">
                                                        <div className="flex justify-between font-medium text-gray-700">
                                                            <span>GST @ 5%</span><span>₹{Number(extraOrderDetails.gst_amount_5).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 pl-2">
                                                            <span>CGST 2.5%</span><span>₹{Number(extraOrderDetails.cgst_amount_5).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 pl-2">
                                                            <span>SGST 2.5%</span><span>₹{Number(extraOrderDetails.sgst_amount_5).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {Number(extraOrderDetails?.gst_amount_18 ?? 0) > 0 && (
                                                    <div className="border border-gray-200 rounded p-2 space-y-0.5">
                                                        <div className="flex justify-between font-medium text-gray-700">
                                                            <span>GST @ 18%</span><span>₹{Number(extraOrderDetails.gst_amount_18).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 pl-2">
                                                            <span>CGST 9%</span><span>₹{Number(extraOrderDetails.cgst_amount_18).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400 pl-2">
                                                            <span>SGST 9%</span><span>₹{Number(extraOrderDetails.sgst_amount_18).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Shipping Toggle */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowShippingDetail(v => !v)}
                                        className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest py-1"
                                    >
                                        <span>Shipping</span>
                                        <span>{showShippingDetail ? "▲" : "▼"}</span>
                                    </button>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>Shipping Charge</span>
                                        <span>
                                            {Number(extraOrderDetails?.shipping_charge ?? 0) === 0
                                                ? "Free"
                                                : `₹${(Number(extraOrderDetails.shipping_charge) + Number(extraOrderDetails?.shipping_gst ?? 0)).toFixed(2)}`}
                                        </span>
                                    </div>
                                    {showShippingDetail && Number(extraOrderDetails?.shipping_charge ?? 0) > 0 && (
                                        <div className="border border-gray-200 rounded p-2 space-y-0.5 text-xs mt-1">
                                            <div className="flex justify-between text-gray-700">
                                                <span>Shipping Charge (Base)</span><span>₹{extraOrderDetails.shipping_charge}</span>
                                            </div>
                                            {Number(extraOrderDetails?.shipping_gst ?? 0) > 0 && (
                                                <>
                                                    <div className="flex justify-between text-gray-700">
                                                        <span>Shipping GST (18%)</span>
                                                        <span>₹{Number(extraOrderDetails.shipping_gst).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-400 pl-2">
                                                        <span>CGST 9%</span><span>₹{Number(extraOrderDetails.shipping_cgst).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-400 pl-2">
                                                        <span>SGST 9%</span><span>₹{Number(extraOrderDetails.shipping_sgst).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-semibold text-gray-700 border-t pt-1">
                                                        <span>Total Shipping</span>
                                                        <span>₹{(Number(extraOrderDetails.shipping_charge) + Number(extraOrderDetails.shipping_gst)).toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* GD Coins */}
                                {Number(extraOrderDetails?.gd_coin ?? 0) > 0 && (
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <span>🪙</span>
                                            <span className="text-xs text-gray-600">GD Coins Earned</span>
                                        </div>
                                        <span className="font-bold text-orange-500">+{extraOrderDetails.gd_coin}</span>
                                    </div>
                                )}

                                {/* Grand Total */}
                                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg px-3 py-2 flex justify-between items-center mt-1">
                                    <span className="text-white font-bold text-sm">Grand Total</span>
                                    <span className="text-white font-extrabold">₹{Number(extraOrderDetails?.grand_total ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracking Progress Section */}
                <div className="mb-8 bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gray-700" />
                        Delivery Status
                    </h2>

                    <div className="relative">
                        {/* Status bar */}
                        <div className="flex justify-between items-start relative mb-4">
                            {/* Background Line */}
                            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                            {/* Active Line (Calculated based on status) */}
                            {(() => {
                                const status = (extraOrderDetails?.status_history?.[0]?.status || orderHistory?.status || '').toUpperCase();
                                let progress = '0%';
                                if (status === 'PROCESSING') progress = '25%';
                                if (status === 'ORDER_CONFIRMED') progress = '50%';
                                if (status === 'ON_THE_WAY') progress = '75%';
                                if (status === 'DELIVERED') progress = '100%';

                                return (
                                    <div
                                        className="absolute top-4 left-4 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                                        style={{ width: progress }}
                                    ></div>
                                );
                            })()}

                            {['PROCESSING', 'ORDER_CONFIRMED', 'ON_THE_WAY', 'DELIVERED'].map((step, index) => {
                                const status = (extraOrderDetails?.status_history?.[0]?.status || orderHistory?.status || '').toUpperCase();
                                const steps = ['PROCESSING', 'ORDER_CONFIRMED', 'ON_THE_WAY', 'DELIVERED'];
                                const currentIndex = steps.indexOf(status);
                                const isActive = index <= currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                    <div key={step} className="flex flex-col items-center relative z-50 w-1/4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                            {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                                        </div>
                                        <div className="mt-2 text-center w-full px-1">
                                            <p className={`text-[10px] font-bold leading-tight break-words ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.replace(/_/g, ' ')}
                                            </p>
                                            {isCurrent && extraOrderDetails?.status_history?.[0]?.timestamp && (
                                                <p className="text-[9px] text-gray-500 mt-0.5">{new Date(extraOrderDetails.status_history[0].timestamp).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Items Ordered</h2>
                        {orderHistory?.status === 'DELIVERED' && (
                            <button
                                onClick={getInvoice}
                                className="text-sm font-medium text-bio-green hover:text-green-800 hover:underline flex items-center gap-1"
                            >
                                <Download className="w-4 h-4" />
                                Invoice
                            </button>
                        )}
                    </div>

                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {orderData?.order_items?.map((item, index) => (
                            <div key={index} className="flex flex-col rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div
                                    className="aspect-square bg-gray-50 flex items-center justify-center p-3 cursor-pointer"
                                    onClick={() => router.push(getProductUrl(item))}
                                >
                                    <img
                                        src={item?.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                                        alt={item?.product_name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-3 flex flex-col gap-1.5 flex-1">
                                    <p
                                        onClick={() => router.push(getProductUrl(item))}
                                        className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 cursor-pointer hover:text-bio-green transition-colors"
                                    >
                                        {item?.product_name}
                                    </p>

                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                        <span className="text-sm font-bold text-[#15803D]">₹{item?.selling_price}</span>
                                        {Number(item?.mrp) > Number(item?.selling_price) && (
                                            <span className="text-[10px] text-gray-400 line-through">₹{item?.mrp}</span>
                                        )}
                                    </div>

                                    <p className="text-[10px] text-gray-500">Qty: {item.quantity || 1}</p>

                                    {/* Actions */}
                                    <div className="mt-auto pt-2 flex flex-col gap-1.5">
                                        <button
                                            onClick={() => router.push(getProductUrl(item))}
                                            className="w-full bg-[#5A8A1A] hover:bg-[#4A7515] text-white py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                                        >
                                            Buy Again
                                        </button>

                                        {isDelivered && !(item.is_reviewed || item.is_review) && (
                                            <button
                                                onClick={() => setActiveReviewProductId(activeReviewProductId === item.product_id ? null : item.product_id)}
                                                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                                            >
                                                Write Review
                                            </button>
                                        )}

                                        {(item.is_reviewed || item.is_review) && isDelivered && (
                                            <button
                                                onClick={() => setActiveReviewProductId(activeReviewProductId === item.product_id ? null : item.product_id)}
                                                className="w-full border border-[#15803D] text-[#15803D] hover:bg-green-50 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                                            >
                                                <Check className="w-3 h-3" /> Edit Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {activeReviewProductId === item.product_id && (
                                    <div className="col-span-full border-t border-dashed p-4">
                                        <WriteAReview
                                            isInline={true}
                                            onClose={() => setActiveReviewProductId(null)}
                                            productId={item.product_id}
                                            productDetailData={item}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
                    <button
                        onClick={() => router.push('/profile/orders')}
                        className="text-[#15803D] hover:underline flex items-center gap-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Your Orders
                    </button>
                    <div className="flex gap-4">
                        <button onClick={() => router.push('/contact-us/')} className="text-[#15803D] hover:underline">Help & Support</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => router.push('/shipping/')} className="text-[#15803D] hover:underline">Shipping Policies</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => router.push('/return/')} className="text-[#15803D] hover:underline">Return & Refund Policy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSummaryView;
