'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    ChevronLeft,
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
import Breadcrumb from '../../../components/Shared/Breadcrumb';

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
                setOrderData(itemsResponse.data.data);
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
            <div className="min-h-screen flex items-center justify-center bg-site-bg">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your order summary...</p>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-site-bg">
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

    const breadcrumbItems = [
        { label: 'Profile', path: '/profile' },
        { label: 'Orders', path: '/profile/orders' }
    ];

    return (
        <div className="min-h-screen bg-white pb-24 font-sans">
            {/* Mobile Header Redesign - Professional Minimalist */}
            <div className="flex flex-col md:hidden bg-white shadow-sm sticky top-0 z-40 border-b">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/profile/orders')}
                        className="flex items-center text-[#375421] text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orders
                    </button>
                    <div className="flex items-center gap-4 text-[11px] font-bold text-[#375421] uppercase tracking-wider">
                        <button className="hover:underline">Support</button>
                    </div>
                </div>
                <div className="px-4 pb-3">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">Order Details</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                {/* Desktop Header - Amazon Style */}
                <div className="hidden md:block mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h1>
                    <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                            <span className="font-medium whitespace-nowrap">Ordered on {formatDate(orderDate)}</span>
                            <span className="text-gray-300">|</span>
                            <span>Order# <span className="font-bold text-gray-900">{orderIdToDisplay}</span></span>
                        </div>
                        <div className="flex items-center gap-4">
                           {isDelivered && (
                               <button onClick={getInvoice} className="hover:underline text-[#375421] font-bold">Download Invoice</button>
                           )}
                        </div>
                    </div>
                </div>

                {/* Amazon-Style Fulfillment Section (3-Column Card) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-lg overflow-hidden mb-10 shadow-sm">
                    {/* Shipping Address */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Shipping Address</h3>
                        <div className="text-[12.5px] text-gray-600 leading-normal font-medium">
                            <p className="font-bold text-gray-900 mb-1">{orderData?.delivery_address?.first_name} {orderData?.delivery_address?.last_name}</p>
                            <p>{orderData?.delivery_address?.address}</p>
                            <p>{orderData?.delivery_address?.city}, {orderData?.delivery_address?.state} {orderData?.delivery_address?.pincode}</p>
                            <p>India</p>
                            <p className="mt-3 text-xs text-gray-400">Phone: {orderData?.delivery_address?.mobile}</p>
                        </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/30">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h3>
                        <div className="text-[12.5px] text-gray-600 font-medium">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-bold text-gray-700">Online</span>
                                <span className="font-bold text-gray-900">{orderData?.order?.payment_method || 'Selection'}</span>
                            </div>
                            {orderData?.order?.transfer_details?.method && (
                                <p className="text-xs text-gray-400">Account: {orderData.order.transfer_details.bank || 'Verified'}</p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="p-6 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2.5 text-[12.5px] font-medium text-gray-600">
                            <div className="flex justify-between items-baseline">
                                <span>Items:</span>
                                <span>₹{(orderData?.order_items || []).reduce((s, i) => s + Number(i.selling_price) * i.quantity, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span>Shipping:</span>
                                <span>₹{(Number(orderData?.order?.shipping_charge || 0) + Number(orderData?.order?.shipping_gst || 0)).toFixed(2)}</span>
                            </div>
                            {Number(orderData?.order?.total_discount || 0) > 0 && (
                                <div className="flex justify-between items-baseline">
                                    <span>Promotion Applied:</span>
                                    <span className="text-emerald-700">-₹{Number(orderData.order.total_discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                                <span className="text-sm font-bold text-gray-900">Total:</span>
                                <span className="text-base font-bold text-gray-900">₹{Number(orderData?.order?.grand_total || 0).toFixed(2)}</span>
                            </div>
                            {Number(orderData?.order?.gd_coin ?? 0) > 0 && (
                                <div className="flex justify-between items-center text-[11px] text-[#375421] font-bold pt-2 uppercase tracking-wide">
                                    <span>🪙 GDC Earned</span>
                                    <span>+{orderData.order.gd_coin}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Amazon Status Dashboard */}
                <div className="border border-gray-200 rounded-lg p-6 mb-10 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                       <Truck className="w-5 h-5 text-gray-400" />
                       <h3 className="text-lg font-bold text-gray-900">{latestTrackingStatus === 'DELIVERED' ? 'Delivered successfully' : `Shipment Status: ${latestTrackingStatus.replace(/_/g, ' ')}`}</h3>
                    </div>

                    {/* Clean Progress Bar */}
                    <div className="relative pt-2 pb-6 px-4">
                        <div className="flex justify-between items-start relative">
                            {/* Track Lines */}
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 z-0 mx-[12.5%]" />
                            {(() => {
                                const status = latestTrackingStatus;
                                let progress = '0%';
                                if (status === 'PROCESSING') progress = '0%';
                                if (status === 'ORDER_CONFIRMED') progress = '33.33%';
                                if (status === 'ON_THE_WAY') progress = '66.66%';
                                if (status === 'DELIVERED') progress = '100%';

                                return (
                                    <div
                                        className="absolute top-4 left-0 h-1 bg-[#375421] z-0 transition-all duration-700 ease-in-out mx-[12.5%]"
                                        style={{ width: progress }}
                                    />
                                );
                            })()}

                            {['PROCESSING', 'ORDER_CONFIRMED', 'ON_THE_WAY', 'DELIVERED'].map((step, index) => {
                                const steps = ['PROCESSING', 'ORDER_CONFIRMED', 'ON_THE_WAY', 'DELIVERED'];
                                const currentIndex = steps.indexOf(latestTrackingStatus);
                                const isActive = index <= currentIndex;
                                const stepUpdate = orderData?.tracking_updates?.find(u => u.status.toUpperCase() === step);

                                return (
                                    <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                            ${isActive
                                              ? 'bg-[#375421] border-[#375421] text-white shadow shadow-green-100'
                                              : 'bg-white border-gray-200 text-gray-200'}
                                        `}>
                                            {isActive ? <Check className="w-4 h-4" strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className={`text-[12px] font-bold leading-tight tracking-tight
                                                ${isActive ? 'text-gray-900' : 'text-gray-400'}
                                            `}>
                                                {step.replace(/_/g, ' ')}
                                            </p>
                                            {isActive && stepUpdate?.timestamp && (
                                                <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                                                    {new Date(stepUpdate.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Amazon-Style Item Registry (Row Based) */}
                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-12 shadow-sm">
                    <div className="p-10 space-y-12">
                        {orderData?.order_items?.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-10 items-start pb-12 border-b border-gray-100 last:border-0 last:pb-0">
                                {/* Amazon Product Image */}
                                <div
                                    className="w-40 h-40 flex-shrink-0 cursor-pointer mx-auto md:mx-0"
                                    onClick={() => router.push(getProductUrl(item))}
                                >
                                    <img
                                        src={item?.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                                        alt={item?.product_name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105"
                                    />
                                </div>

                                {/* Amazon Product Info & Standard Actions */}
                                <div className="flex-1 flex flex-col md:flex-row justify-between gap-10">
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-[#375421] opacity-50 uppercase tracking-[0.2em] mb-2 block">{item.category_slug?.replace(/-/g, ' ') || item.category_name || "Gidan Selection"}</p>
                                        <p
                                            onClick={() => router.push(getProductUrl(item))}
                                            className="text-[17px] font-bold text-gray-900 hover:text-[#375421] transition-colors leading-snug cursor-pointer mb-3"
                                        >
                                            {item?.product_name}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-4">
                                           <span>Qty: {item.quantity || 1}</span>
                                           <span className="text-gray-200">|</span>
                                           <span className="text-[#375421] font-bold">₹{item?.selling_price}</span>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => router.push(getProductUrl(item))}
                                                className="px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-gray-900 text-sm font-medium rounded-full shadow-sm shadow-gray-100 transition-all active:scale-95 text-center min-w-[140px]"
                                            >
                                                Buy it again
                                            </button>
                                        </div>
                                    </div>

                                    {/* Amazon Secondary Vertical Actions */}
                                    <div className="flex flex-col gap-3 w-full md:w-56 mt-4 md:mt-0">
                                        {isDelivered && !(item.is_reviewed || item.is_review) && (
                                            <button
                                                onClick={() => setActiveReviewProductId(item.product_id)}
                                                className="w-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-center shadow-sm"
                                            >
                                                Write a product review
                                            </button>
                                        )}
                                        {(item.is_reviewed || item.is_review) && isDelivered && (
                                            <button
                                                onClick={() => setActiveReviewProductId(item.product_id)}
                                                className="w-full px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 text-center shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-4 h-4 text-emerald-600" /> Reviewed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Write a Review Modal */}
                {activeReviewProductId && (() => {
                    const reviewItem = orderData?.order_items?.find(i => i.product_id === activeReviewProductId);
                    return (
                        <WriteAReview
                            isInline={false}
                            onClose={() => setActiveReviewProductId(null)}
                            productId={activeReviewProductId}
                            productDetailData={reviewItem}
                        />
                    );
                })()}

                {/* Amazon Minimalist Bottom Links */}
                <div className="mt-16 mb-12 pt-8 flex items-center justify-center gap-10 text-[13px] font-medium text-gray-500">
                    <button onClick={() => router.push('/contact-us/')} className="hover:text-[#375421] transition-colors">Help</button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => router.push('/shipping/')} className="hover:text-[#375421] transition-colors">Shipping Policies</button>
                    <span className="text-gray-200">|</span>
                    <button onClick={() => router.push('/return/')} className="hover:text-[#375421] transition-colors">Returns & Refunds</button>
                </div>
            </div>
        </div>
    );
};

export default PostSummaryView;
