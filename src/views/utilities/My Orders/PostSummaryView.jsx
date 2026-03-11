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
import { applyGstToOrderData } from '../../../utils/serverApi';

const PostSummaryView = () => {
    const router = useRouter();
    const { id } = useParams(); // This will be the order_id string like BMO... or numeric id
    // orderData = full response from orderHistoryItems: { order, order_items, delivery_address, tracking_updates }
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [activeReviewProductId, setActiveReviewProductId] = useState(null);
    const [showGstDetail, setShowGstDetail] = useState(false);
    const [showShippingDetail, setShowShippingDetail] = useState(false);

    const fetchAllOrderDetails = async () => {
        setLoading(true);
        try {
            // id from URL is the order_id string (e.g. BMO2026...). API needs numeric order.id.
            // Resolve via orderHistory list first.
            let numericId = id;
            const historyResponse = await axiosInstance.get('/order/orderHistory/');
            if (historyResponse.status === 200) {
                const orders = historyResponse.data.data.orders;
                const found = orders.find(
                    o => o.id.toString() === id.toString() || o.order_id === id
                );
                if (found) numericId = found.id;
            }

            // orderHistoryItems returns: { order, order_items, delivery_address, tracking_updates }
            const itemsResponse = await axiosInstance.get(`/order/orderHistoryItems/${numericId}`);
            if (itemsResponse.status === 200) {
                setOrderData(applyGstToOrderData(itemsResponse.data.data));
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
        const numericId = orderData?.order?.id || id;
        try {
            const response = await axiosInstance.get(`/order/invoice/${numericId}/`, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `invoice_${orderData?.order?.order_id || numericId}.pdf`;
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

    if (!orderData) {
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

    const orderIdToDisplay = orderData?.order?.order_id || id;
    const orderDate = orderData?.order?.date;

    // Latest status from tracking_updates (last entry = most recent)
    const latestTrackingStatus = orderData?.tracking_updates?.slice(-1)?.[0]?.status?.toUpperCase() || '';
    const isDelivered = latestTrackingStatus === 'DELIVERED';

    // Calculate accurate Taxable and GST totals
    const { baseSubTotal, totalGst, slabEntries } = (() => {
        let taxableSum = 0;
        const slabs = {};
        (orderData?.order_items || []).forEach(item => {
            const cgstRate = parseFloat(item.cgst) || 0;
            const sgstRate = parseFloat(item.sgst) || 0;
            const gstField = parseFloat(String(item.gst || '').replace('%', '')) || 0;
            const totalRate = (cgstRate + sgstRate) > 0 ? (cgstRate + sgstRate) : gstField;

            const gstInclusiveTotal = Number(item.selling_price) || 0;
            const lineGstAmt = Number(item.total_gst_amount || item.gst_amount) > 0
                ? Number(item.total_gst_amount || item.gst_amount)
                : totalRate > 0
                    ? parseFloat((gstInclusiveTotal * totalRate / (100 + totalRate)).toFixed(2))
                    : 0;
            const basePreGstTotal = parseFloat((gstInclusiveTotal - lineGstAmt).toFixed(2));
            taxableSum += basePreGstTotal;

            if (totalRate > 0) {
                const total = Number(item.total) || 0;
                const taxable = total / (1 + totalRate / 100);
                const gstAmt = total - taxable;
                const key = `${totalRate}%`;
                if (!slabs[key]) slabs[key] = { slab: key, cgstRate, sgstRate, gstAmt: 0, cgstAmt: 0, sgstAmt: 0 };
                slabs[key].gstAmt += gstAmt;
                slabs[key].cgstAmt += taxable * cgstRate / 100;
                slabs[key].sgstAmt += taxable * sgstRate / 100;
            }
        });
        const slabEntriesList = Object.values(slabs);
        const gstSum = slabEntriesList.reduce((s, e) => s + e.gstAmt, 0);
        return { baseSubTotal: taxableSum, totalGst: gstSum, slabEntries: slabEntriesList };
    })();

    const displayShipping = Number(orderData?.order?.shipping_charge ?? 0);
    const displayCoupon = Number(orderData?.order?.coupon_discount ?? 0);
    const displayGrandTotal = baseSubTotal + totalGst + displayShipping - displayCoupon;

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
                                <p className="font-bold">{orderData?.delivery_address?.first_name} {orderData?.delivery_address?.last_name}</p>
                                <p>{orderData?.delivery_address?.address}</p>
                                <p>{orderData?.delivery_address?.city}, {orderData?.delivery_address?.state} {orderData?.delivery_address?.pincode}</p>
                                <p>India</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Payment Method</h3>
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span>{orderData?.order?.payment_method || 'Online Payment'}</span>
                            </div>
                            {orderData?.order?.transfer_details?.method && (
                                <p className="text-xs text-gray-500 mt-1 ml-6 uppercase">{orderData.order.transfer_details.method} • {orderData.order.transfer_details.bank || 'Captured'}</p>
                            )}
                        </div>

                        {/* Price Details */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Price Details</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                {/* Sub Total */}
                                <div className="flex justify-between text-gray-600">
                                    <span>Sub Total</span>
                                    <span>₹{Number(orderData?.order?.total_price ?? 0).toFixed(2)}</span>
                                </div>

                                {/* Discount */}
                                {Number(orderData?.order?.total_discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Discount</span>
                                        <span>-₹{Number(orderData?.order?.total_discount ?? 0).toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Coupon Discount */}
                                {Number(orderData?.order?.coupon_discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Coupon Discount</span>
                                        <span>-₹{Number(orderData?.order?.coupon_discount ?? 0).toFixed(2)}</span>
                                    </div>
                                )}

                                {/* Taxable Value */}
                                {(() => {
                                    const baseSubTotal = (orderData?.order_items || []).reduce((sum, item) => {
                                        const cgst = parseFloat(item.cgst) || 0;
                                        const sgst = parseFloat(item.sgst) || 0;
                                        const gst = parseFloat(String(item.gst || '').replace('%', '')) || 0;
                                        const rate = (cgst + sgst) > 0 ? (cgst + sgst) : gst;

                                        const gstInclusiveTotal = Number(item.selling_price) || 0;
                                        const lineGstAmt = Number(item.total_gst_amount || item.gst_amount) > 0
                                            ? Number(item.total_gst_amount || item.gst_amount)
                                            : rate > 0
                                                ? parseFloat((gstInclusiveTotal * rate / (100 + rate)).toFixed(2))
                                                : 0;
                                        const basePreGstTotal = parseFloat((gstInclusiveTotal - lineGstAmt).toFixed(2));
                                        return sum + basePreGstTotal;
                                    }, 0);

                                    return (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Taxable Value</span>
                                            <span>₹{baseSubTotal.toFixed(2)}</span>
                                        </div>
                                    );
                                })()}

                                {/* Delivery Charges */}
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className={Number(orderData?.order?.shipping_charge ?? 0) === 0 ? 'text-emerald-600 font-semibold' : ''}>
                                        {Number(orderData?.order?.shipping_charge ?? 0) === 0 ? 'FREE' : `₹${Number(orderData?.order?.shipping_charge ?? 0).toFixed(2)}`}
                                    </span>
                                </div>

                                {/* GST */}
                                {(() => {
                                    const slabs = {};
                                    (orderData?.order_items || []).forEach(item => {
                                        const cgstRate = parseFloat(item.cgst) || 0;
                                        const sgstRate = parseFloat(item.sgst) || 0;
                                        const gstField = parseFloat(String(item.gst || '').replace('%', '')) || 0;
                                        const totalRate = (cgstRate + sgstRate) > 0 ? (cgstRate + sgstRate) : gstField;
                                        if (totalRate <= 0) return;
                                        const total = Number(item.total) || 0;
                                        const taxable = total / (1 + totalRate / 100);
                                        const gstAmt = total - taxable;
                                        const key = `${totalRate}%`;
                                        if (!slabs[key]) slabs[key] = { slab: key, cgstRate, sgstRate, gstAmt: 0, cgstAmt: 0, sgstAmt: 0 };
                                        slabs[key].gstAmt += gstAmt;
                                        slabs[key].cgstAmt += taxable * cgstRate / 100;
                                        slabs[key].sgstAmt += taxable * sgstRate / 100;
                                    });
                                    const slabEntries = Object.values(slabs);
                                    const totalGst = slabEntries.reduce((s, e) => s + e.gstAmt, 0);
                                    if (totalGst <= 0) return null;

                                    return (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setShowGstDetail(p => !p)}
                                                className="flex justify-between items-center w-full text-gray-600 hover:text-gray-900"
                                            >
                                                <span className="flex items-center gap-1">
                                                    GST
                                                    <span className="text-[10px] text-gray-400">{showGstDetail ? '▲' : '▼'}</span>
                                                </span>
                                                <span>₹{totalGst.toFixed(2)}</span>
                                            </button>
                                            {showGstDetail && (
                                                <div className="mt-1.5 ml-3 space-y-2.5 border-l-2 border-gray-200 pl-3">
                                                    {slabEntries.map((e) => (
                                                        <div key={e.slab}>
                                                            <p className="text-[11px] font-semibold text-gray-600">GST @ {e.slab} — ₹{e.gstAmt.toFixed(2)}</p>
                                                            <div className="flex justify-between text-[10px] text-gray-400 ml-2">
                                                                <span>CGST @ {e.cgstRate}%</span>
                                                                <span>₹{e.cgstAmt.toFixed(2)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-[10px] text-gray-400 ml-2">
                                                                <span>SGST @ {e.sgstRate}%</span>
                                                                <span>₹{e.sgstAmt.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Total Amount */}
                                {(() => {
                                    const slabs = {};
                                    (orderData?.order_items || []).forEach(item => {
                                        const cgstRate = parseFloat(item.cgst) || 0;
                                        const sgstRate = parseFloat(item.sgst) || 0;
                                        const gstField = parseFloat(String(item.gst || '').replace('%', '')) || 0;
                                        const totalRate = (cgstRate + sgstRate) > 0 ? (cgstRate + sgstRate) : gstField;
                                        if (totalRate <= 0) return;
                                        const total = Number(item.total) || 0;
                                        const taxable = total / (1 + totalRate / 100);
                                        const gstAmt = total - taxable;
                                        const key = `${totalRate}%`;
                                        if (!slabs[key]) slabs[key] = { slab: key, cgstRate, sgstRate, gstAmt: 0, cgstAmt: 0, sgstAmt: 0 };
                                        slabs[key].gstAmt += gstAmt;
                                        slabs[key].cgstAmt += taxable * cgstRate / 100;
                                        slabs[key].sgstAmt += taxable * sgstRate / 100;
                                    });
                                    const slabEntries = Object.values(slabs);
                                    const totalGst = slabEntries.reduce((s, e) => s + e.gstAmt, 0);

                                    // Use grand_total directly. If the backend didn't add GST, we add it here.
                                    // Make sure we only add it once!
                                    // For now, testing adding it.
                                    const baseGrandTotal = Number(orderData?.order?.grand_total ?? 0);


                                    return (
                                        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t mt-2 text-base">
                                            <span>Total Amount</span>
                                            <span>₹{baseGrandTotal.toFixed(2)}</span>
                                        </div>
                                    );
                                })()}

                                {/* Savings message */}
                                {(Number(orderData?.order?.total_discount ?? 0) + Number(orderData?.order?.coupon_discount ?? 0)) > 0 && (
                                    <p className="text-emerald-600 text-xs font-semibold text-center bg-emerald-50 rounded-lg py-1.5 mt-2">
                                        You will save ₹{(Number(orderData?.order?.total_discount ?? 0) + Number(orderData?.order?.coupon_discount ?? 0)).toFixed(2)} on this order
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Fixed Bottom: GD Coins  ── */}
                <div className="pt-3 pb-4 space-y-3 px-4">
                    {/* GD Coins */}
                    {Number(orderData?.order?.gd_coin ?? 0) > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🪙</span>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">GD Coins Earned</p>
                                    <p className="text-[10px] text-gray-400">Use on your next order</p>
                                </div>
                            </div>
                            <span className="text-lg font-extrabold text-orange-500">+{orderData.order.gd_coin}</span>
                        </div>
                    )}
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
                            const status = latestTrackingStatus;
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
                            const steps = ['PROCESSING', 'ORDER_CONFIRMED', 'ON_THE_WAY', 'DELIVERED'];
                            const currentIndex = steps.indexOf(latestTrackingStatus);
                            const isActive = index <= currentIndex;
                            const isCurrent = index === currentIndex;
                            const stepUpdate = orderData?.tracking_updates?.find(u => u.status.toUpperCase() === step);

                            return (
                                <div key={step} className="flex flex-col items-center relative z-50 w-1/4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                        {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                                    </div>
                                    <div className="mt-2 text-center w-full px-1">
                                        <p className={`text-[10px] font-bold leading-tight break-words ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.replace(/_/g, ' ')}
                                        </p>
                                        {isCurrent && stepUpdate?.timestamp && (
                                            <p className="text-[9px] text-gray-500 mt-0.5">{new Date(stepUpdate.timestamp).toLocaleDateString()}</p>
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
                    {isDelivered && (
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
                                            onClick={() => setActiveReviewProductId(item.product_id)}
                                            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                                        >
                                            Write Review
                                        </button>
                                    )}

                                    {(item.is_reviewed || item.is_review) && isDelivered && (
                                        <button
                                            onClick={() => setActiveReviewProductId(item.product_id)}
                                            className="w-full border border-[#15803D] text-[#15803D] hover:bg-green-50 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                                        >
                                            <Check className="w-3 h-3" /> Edit Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write a Review Modal */}
            {
                activeReviewProductId && (() => {
                    const reviewItem = orderData?.order_items?.find(i => i.product_id === activeReviewProductId);
                    return (
                        <WriteAReview
                            isInline={false}
                            onClose={() => setActiveReviewProductId(null)}
                            productId={activeReviewProductId}
                            productDetailData={reviewItem}
                        />
                    );
                })()
            }

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
    );
};

export default PostSummaryView;
