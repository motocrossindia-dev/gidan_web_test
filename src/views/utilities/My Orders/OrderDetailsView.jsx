'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Download,
    RefreshCcw,
    ChevronRight,
    Circle,
    CheckCircle2,
    Calendar,
    CreditCard,
    MapPin,
    Truck
} from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import WriteAReview from '../ProductData/WriteAReview';

const OrderDetailsView = () => {
    const router = useRouter();
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [orderHistory, setOrderHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReturnPopup, setShowReturnPopup] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returnNotes, setReturnNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [activeReviewProductId, setActiveReviewProductId] = useState(null);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            // First fetch the main order details to get context (status, etc.)
            const historyResponse = await axiosInstance.get(`/order/orderHistory/`);
            if (historyResponse.status === 200) {
                const currentOrder = historyResponse.data.data.orders.find(o => o.id.toString() === id.toString());
                setOrderHistory(currentOrder);
            }

            // Then fetch the detailed items and tracking
            const response = await axiosInstance.get(`/order/orderHistoryItems/${id}`);
            if (response.status === 200) {
                setOrderData(response.data.data);
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        const updated = [...imageFiles];
        updated.splice(index, 1);
        setImageFiles(updated);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInvoice = async () => {
        try {
            const response = await axiosInstance.get(`/order/invoice/${id}/`, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `invoice_${id}.pdf`;
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

    const handleSubmitReturn = async () => {
        setIsSubmitting(true);
        try {
            const orderItemResponse = await axiosInstance.get(
                `https://backend.gidan.store/order/orderItem/?order_id=${id}`
            );

            const orderItems = orderItemResponse?.data?.data?.order_items || [];
            const products = orderItems.map((item) => ({
                product_sku: item.sku,
                price: item.mrp,
                amount: item.total,
                discount: item.discount,
            }));

            const formData = new FormData();
            formData.append("return_order_status", "R");
            formData.append('notes', returnNotes || 'Customer requested refund');
            formData.append('products', JSON.stringify(products));

            imageFiles.forEach((file) => {
                formData.append(`return_products_images`, file);
            });

            const response = await axiosInstance.post(
                `/order/return/${id}/`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar('Return request submitted successfully', { variant: 'success' });
                setShowReturnPopup(false);
                setReturnReason('');
                setReturnNotes('');
                fetchOrderDetails();
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Failed to submit return request', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading order details...</p>
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
                    <p className="text-gray-600 mb-6">We couldn't find the order details you're looking for.</p>
                    <button
                        onClick={() => router.push('/orders')}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all"
                    >
                        Go Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    const updates = [...(orderData?.tracking_updates || [])].reverse();

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Helmet>
                <title>Order Details | Gidan</title>
            </Helmet>

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/orders')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Order Summary</h1>
                            <p className="text-xs text-gray-500">ID: {orderHistory?.order_id || id}</p>
                        </div>
                    </div>
                    {orderHistory?.status === 'DELIVERED' && (
                        <button
                            onClick={getInvoice}
                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Invoice
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Status Tracker */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Order Tracking
                        </h2>

                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-100"></div>

                            <div className="space-y-8">
                                {updates.map((update, index) => (
                                    <div key={index} className="relative flex items-start gap-4">
                                        <div className={`z-10 rounded-full h-6 w-6 flex items-center justify-center ${index === 0 ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-200'}`}>
                                            {index === 0 ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`text-sm font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{update.status}</h3>
                                                <p className="text-[10px] text-gray-400 font-medium">{formatDate(update.timestamp)}</p>
                                            </div>
                                            {update.notes && (
                                                <p className="text-xs text-gray-500 mt-1 italic">{update.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {updates.length === 0 && (
                                    <div className="text-center py-4 text-gray-400 text-sm">
                                        No tracking updates available yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Order Items ({orderData?.order_items?.length || 0})
                        </h2>

                        <div className="divide-y">
                            {orderData?.order_items?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="py-6 flex gap-4 first:pt-0 last:pb-0 group">
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border group-hover:border-green-200 transition-all">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${item?.image}`}
                                                alt={item?.product_name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{item?.product_name}</h3>
                                                    <p className="text-xs text-gray-500 mb-2">Delivery: {item?.delivery_option || 'Standard'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">₹{Math.round(item?.selling_price)}</p>
                                                    {item?.mrp > item?.selling_price && (
                                                        <p className="text-[10px] text-gray-400 line-through">₹{Math.round(item?.mrp)}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                                                </div>
                                            </div>
                                            {orderHistory?.status === 'DELIVERED' && (
                                                <div className="flex items-center gap-4 mt-2">
                                                    <button className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                                                        Buy it again <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveReviewProductId(activeReviewProductId === item.product_id ? null : item.product_id)}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        {activeReviewProductId === item.product_id ? 'Cancel Review' : 'Write a Review'} <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {activeReviewProductId === item.product_id && (
                                        <div className="pb-6 border-b">
                                            <WriteAReview
                                                isInline={true}
                                                onClose={() => setActiveReviewProductId(null)}
                                                productId={item.product_id}
                                                productDetailData={item}
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary & Actions */}
                <div className="space-y-6">

                    {/* Order Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Price Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Total MRP</span>
                                <span>₹{Math.round(orderData?.order?.total_price || orderHistory?.total_price || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-₹{Math.round(orderData?.order?.total_discount || orderHistory?.total_discount || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Delivery Fee</span>
                                <span className={(orderData?.order?.delivery_charge || orderHistory?.delivery_charge) === 0 ? 'text-green-600' : ''}>
                                    {(orderData?.order?.delivery_charge || orderHistory?.delivery_charge) === 0 ? 'FREE' : `₹${orderData?.order?.delivery_charge || orderHistory?.delivery_charge}`}
                                </span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span>₹{Math.round(orderData?.order?.grand_total || orderHistory?.grand_total || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Order Placement
                            </h3>
                            <p className="text-sm text-gray-700 font-medium">{formatDate(orderHistory?.date)}</p>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <CreditCard className="w-3 h-3" />
                                Payment Mode
                            </h3>
                            <p className="text-sm text-gray-700 font-medium">
                                {orderHistory?.payment_method?.toUpperCase() || 'ONLINE'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                Shipping Address
                            </h3>
                            <div className="text-sm text-gray-600">
                                <p className="font-bold text-gray-800">{orderData?.order?.customer_name || orderHistory?.customer_name}</p>
                                <p className="mt-1">{orderData?.order?.address || orderHistory?.address}</p>
                                <p>{orderData?.order?.city || orderHistory?.city}, {orderData?.order?.state || orderHistory?.state}</p>
                                <p>PIN: {orderData?.order?.pincode || orderHistory?.pincode}</p>
                                <p className="mt-1 font-medium">Mob: {orderData?.order?.mobile || orderHistory?.mobile}</p>
                            </div>
                        </div>
                    </div>

                    {/* Return Action */}
                    {orderHistory?.status === 'DELIVERED' && orderHistory?.is_returnable && (
                        <button
                            onClick={() => setShowReturnPopup(true)}
                            className="w-full bg-white border border-red-200 text-red-600 font-bold py-4 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Return Order
                        </button>
                    )}

                    {!orderHistory?.is_returnable && orderHistory?.status === 'DELIVERED' && (
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                            <p className="text-xs text-orange-700 leading-relaxed font-medium">
                                Return window for this item has closed. It cannot be returned now.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Return Popup */}
            {
                showReturnPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Request Return</h3>
                                    <button onClick={() => setShowReturnPopup(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Return</label>
                                        <select
                                            value={returnReason}
                                            onChange={(e) => setReturnReason(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="Damaged product">Damaged product</option>
                                            <option value="Wrong item delivered">Wrong item delivered</option>
                                            <option value="Not as described">Not as described</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={returnNotes}
                                            onChange={(e) => setReturnNotes(e.target.value)}
                                            placeholder="Please provide more details about the issue..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            rows="4"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Proof Photos</label>
                                        <div className="flex flex-wrap gap-2">
                                            {imageFiles.map((file, index) => (
                                                <div key={index} className="relative w-16 h-16 group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="preview"
                                                        className="w-full h-full object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition-all text-gray-400">
                                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                <span className="text-xl">+</span>
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">Upload images clearly showing the damage or issue (Max 5 images)</p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowReturnPopup(false)}
                                            className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={isSubmitting || !returnReason}
                                            onClick={handleSubmitReturn}
                                            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-400 transition-all"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div >
    );
};

export default OrderDetailsView;
