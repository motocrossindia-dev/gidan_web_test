'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Download,
    RefreshCcw,
    ChevronRight,
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

const OrderDetailsView = () => {
    const router = useRouter();
    const { id } = useParams(); // This can be numeric ID or string order_id
    const [orderData, setOrderData] = useState(null);
    const [extraOrderDetails, setExtraOrderDetails] = useState(null);
    const [orderHistory, setOrderHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeReviewProductId, setActiveReviewProductId] = useState(null);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            // 1. Fetch from orderHistory to get numeric ID and context
            let numericId = id;
            const historyResponse = await axiosInstance.get(`/order/orderHistory/`);
            if (historyResponse.status === 200) {
                const orders = historyResponse.data.data.orders;
                const currentOrder = orders.find(o => o.id.toString() === id.toString() || o.order_id === id);
                if (currentOrder) {
                    setOrderHistory(currentOrder);
                    numericId = currentOrder.id;
                }
            }

            // 2. Fetch tracking and items (existing API)
            const response = await axiosInstance.get(`/order/orderHistoryItems/${numericId}`);
            if (response.status === 200) {
                setOrderData(response.data.data);
            }

            // 3. Fetch from the specific order API (new API)
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
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

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
                    <p className="text-gray-600 font-medium">Loading order details...</p>
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
                        onClick={() => router.push('/orders')}
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
    const totalAmount = Math.round(extraOrderDetails?.grand_total || orderData?.order?.grand_total || orderHistory?.grand_total || 0);

    // Validation Flags
    const orderStatus = (extraOrderDetails?.status || orderHistory?.status || orderData?.order?.status || "")?.toUpperCase();
    const isDelivered = orderStatus === 'DELIVERED';

    // Shipping calculation
    const itemsSubtotal = Math.round(extraOrderDetails?.total_price || orderData?.order?.total_price || orderHistory?.total_price || 0);
    const totalDiscount = Math.round(extraOrderDetails?.total_discount || orderData?.order?.total_discount || orderHistory?.total_discount || 0);
    const shippingValue = extraOrderDetails?.delivery_charge ?? (totalAmount - (itemsSubtotal - totalDiscount));
    const finalShipping = Math.max(0, Math.round(shippingValue));

    return (
        <div className="min-h-screen bg-white pb-20">
            

            {/* Top Navigation */}
            <div className="bg-gray-100 border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
                    <button onClick={() => router.push('/profile')} className="hover:underline">Your Account</button>
                    <ChevronRight className="w-3 h-3" />
                    <button onClick={() => router.push('/orders')} className="hover:underline">Your Orders</button>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#4A7515] font-medium">Order Details</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                    <div className="flex items-center gap-4 text-sm">
                        <p className="text-gray-700">Ordered on {formatDate(orderDate)}</p>
                        <span className="text-gray-300">|</span>
                        <p className="text-gray-700">Order# <span className="font-bold">{orderIdToDisplay}</span></p>
                    </div>
                </div>

                {/* Main Summary Card (Amazon Style) */}
                <div className="border rounded-lg overflow-hidden mb-8 shadow-sm">
                    <div className="bg-gray-50 p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Shipping Address */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Shipping Address</h3>
                            <div className="text-sm text-gray-700">
                                <p className="font-bold">
                                    {extraOrderDetails?.delivery_address?.first_name} {extraOrderDetails?.delivery_address?.last_name || extraOrderDetails?.customer_name}
                                </p>
                                <p>{extraOrderDetails?.delivery_address?.address || extraOrderDetails?.order?.address || orderHistory?.address}</p>
                                <p>{extraOrderDetails?.delivery_address?.city || orderHistory?.city}, {extraOrderDetails?.delivery_address?.state || orderHistory?.state} {extraOrderDetails?.delivery_address?.pincode || orderHistory?.pincode}</p>
                                <p>India</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Payment Method</h3>
                            <div className="text-sm text-gray-700 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span>{extraOrderDetails?.payment_method || orderHistory?.payment_method || 'Online Payment'}</span>
                            </div>
                            {extraOrderDetails?.transfer_details?.method && (
                                <p className="text-xs text-gray-500 mt-1 ml-6 uppercase">{extraOrderDetails.transfer_details.method} • {extraOrderDetails.transfer_details.bank || 'Captured'}</p>
                            )}
                        </div>

                        {/* Order Summary Table */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Order Summary</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Item(s) Subtotal:</span>
                                    <span>₹{itemsSubtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span className={finalShipping === 0 ? 'text-green-700' : ''}>
                                        {finalShipping === 0 ? '₹0.00' : `₹${finalShipping}`}
                                    </span>
                                </div>
                                {(totalDiscount) > 0 && (
                                    <div className="flex justify-between text-green-700">
                                        <span>Discount:</span>
                                        <span>-₹{totalDiscount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t mt-1">
                                    <span>Grand Total:</span>
                                    <span>₹{Math.round(totalAmount)}</span>
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
                        <div className="flex justify-between items-center relative mb-12">
                            {/* Background Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

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
                                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
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
                                    <div key={step} className="flex flex-col items-center relative z-10 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                            {isActive ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                                        </div>
                                        <div className="absolute top-10 whitespace-nowrap text-center">
                                            <p className={`text-xs font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.replace(/_/g, ' ')}
                                            </p>
                                            {isCurrent && extraOrderDetails?.status_history?.[0]?.timestamp && (
                                                <p className="text-[10px] text-gray-500">{new Date(extraOrderDetails.status_history[0].timestamp).toLocaleDateString()}</p>
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
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                                <Download className="w-4 h-4" />
                                Invoice
                            </button>
                        )}
                    </div>

                    <div className="divide-y">
                        {orderData?.order_items?.map((item, index) => (
                            <div key={index} className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-lg border flex-shrink-0 flex items-center justify-center p-2">
                                        <img
                                            src={item?.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                                            alt={item?.product_name}
                                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <h3
                                            onClick={() => router.push(getProductUrl(item))}
                                            className="text-lg font-medium text-[#15803D] hover:text-[#5A8A1A] transition-colors cursor-pointer line-clamp-2"
                                        >
                                            {item?.product_name}
                                        </h3>
                                        <p className="text-xs text-gray-500">Sold by: Gidan Plants</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[#15803D] font-bold text-xl">₹{Math.round(item?.selling_price)}</span>
                                            {item?.mrp > item?.selling_price && (
                                                <span className="text-sm text-gray-500 line-through">₹{Math.round(item?.mrp)}</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium">Qty: {item.quantity || 1}</p>

                                        <div className="flex flex-wrap gap-3 mt-4 pt-4">
                                            <button
                                                onClick={() => router.push(getProductUrl(item))}
                                                className="bg-[#5A8A1A] hover:bg-[#4A7515] text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all"
                                            >
                                                Buy it again
                                            </button>

                                            {isDelivered && !(item.is_reviewed || item.is_review) && (
                                                <button
                                                    onClick={() => setActiveReviewProductId(activeReviewProductId === item.product_id ? null : item.product_id)}
                                                    className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm border border-gray-300 transition-all font-medium"
                                                >
                                                    Write a product review
                                                </button>
                                            )}

                                            {!isDelivered && (
                                                <p className="text-[10px] text-gray-400 italic">Review available after delivery</p>
                                            )}

                                            {(item.is_reviewed || item.is_review) && isDelivered && (
                                                <button
                                                    onClick={() => setActiveReviewProductId(activeReviewProductId === item.product_id ? null : item.product_id)}
                                                    className="bg-white hover:bg-gray-50 text-[#15803D] px-4 py-1.5 rounded-full text-xs font-medium shadow-sm border border-[#15803D] transition-all flex items-center gap-1"
                                                >
                                                    <Check className="w-3 h-3" /> Edit your review
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Column for Desktop */}
                                    <div className="md:w-48 space-y-2 border-l md:pl-6 pt-4 md:pt-0">
                                        {item.tracking_id && (
                                            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-xs flex items-center justify-between group">
                                                <span>Track package</span>
                                                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-900" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {activeReviewProductId === item.product_id && (
                                    <div className="mt-8 pt-8 border-t border-dashed">
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
                        onClick={() => router.push('/orders')}
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

export default OrderDetailsView;
