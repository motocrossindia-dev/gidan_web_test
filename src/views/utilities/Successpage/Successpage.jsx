'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Copy, 
  Check, 
  Truck, 
  Clock, 
  MapPin, 
  CreditCard,
  ChevronRight,
  ChevronDown,
  Star,
  Zap,
  Leaf,
  Calendar,
  MessageSquare,
  User,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Search,
  X,
  Mail,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import { getProductUrl } from '../../../utils/urlHelper';



// ── SKELETON COMPONENTS ──
const StatusSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex gap-4 items-start">
        <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-50 rounded w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

const ItemSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2].map(i => (
      <div key={i} className="flex gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-50 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

const SummarySkeleton = () => (
  <div className="space-y-4 animate-pulse pt-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex justify-between">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-1/6" />
      </div>
    ))}
    <div className="pt-6 border-t border-gray-50 flex justify-between">
      <div className="h-6 bg-gray-100 rounded w-1/3" />
      <div className="h-8 bg-gray-100 rounded w-1/4" />
    </div>
  </div>
);

const SuccesspageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [referralData, setReferralData] = useState(null);

  useEffect(() => {
    setMounted(true);
    const fetchOrderData = async () => {
      try {
        const orderId = searchParams.get('order_id') || sessionStorage.getItem('recent_order_id');
        const hasPermission = sessionStorage.getItem('recent_payment_success') === 'true';

        if (!orderId || !hasPermission) {
          router.replace('/');
          return;
        }

        // Fetch using the numeric ID from the orderHistoryItems endpoint to get full tracked data
        const response = await axiosInstance.get(`/order/orderHistoryItems/${orderId}`);
        if (response.status === 200) {
          setOrderDetails(response.data.data);
          // ── CONSUME PERMISSION ──
          // Once successfully viewed, we remove the success permission so it's not revisited via history/direct link
          sessionStorage.removeItem('recent_payment_success');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await axiosInstance.get("/btcoins/btcoinswallet/");
        if (response.status === 200) {
          setReferralData(response.data);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };
    fetchReferralData();
  }, []);

  // ── TRIGGER PURCHASE CONVERSION TAG ──
  useEffect(() => {
    if (orderDetails && orderDetails.order && orderDetails.order.order_id) {
      const { order, order_items = [] } = orderDetails;
      
      // Use sessionStorage to prevent duplicate triggers on page refresh
      const lastTriggeredId = sessionStorage.getItem('last_gtm_purchase_id');
      if (lastTriggeredId === order.order_id) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'CE - purchase',
        ecommerce: {
          transaction_id: order.order_id,
          value: parseFloat(order.grand_total),
          tax: parseFloat(order.total_gst || 0),
          shipping: parseFloat(order.shipping_charge || 0),
          currency: 'INR',
          items: order_items.map((item, index) => ({
            item_id: item.product_id || item.id,
            item_name: item.product_name,
            index: index,
            price: parseFloat(item.selling_price),
            quantity: item.quantity
          }))
        }
      });

      sessionStorage.setItem('last_gtm_purchase_id', order.order_id);
      console.log('Ecommerce Purchase Event Triggered:', order.order_id);
    }
  }, [orderDetails]);

  const handleCopyOrderId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    enqueueSnackbar("Order ID copied to clipboard", { variant: "success" });
  };

  if (!mounted) return null;

  const handleShareReferral = () => {
    const code = referralData?.referral_code || "";
    const text = `Hey! Join Gidan for amazing plants. Use my referral code: ${code} and get ₹150 off!`;
    const url = "https://www.gidan.store";
    
    if (navigator.share) {
      navigator.share({ title: "Gidan Referral", text: `${text}\n${url}` })
        .catch(err => console.log(err));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert("Referral link copied to clipboard!");
    }
  };

  // Removed: Full-page loader is gone to allow 'instant' success UI with skeletons below

  const { order, order_items = [], delivery_address = {}, care_guides = [] } = orderDetails || {};
  const currentStatusDisplay = orderDetails?.current_status_display || "Processing";
  const journey = orderDetails?.journey || {};
  
  // Helper to check journey status from data.journey
  const getJourneyStatus = (key) => {
    const time = journey[key];
    return {
      completed: !!time,
      time: time
    };
  };

  // Specific status checks based on Journey object
  const stepProcessing = getJourneyStatus('Processing');
  const stepConfirmed = getJourneyStatus('Order Confirmed');
  const stepDispatched = getJourneyStatus('Dispatched');
  const stepOnTheWay = getJourneyStatus('On the Way');
  const stepOutForDelivery = getJourneyStatus('Out for Delivery');
  const stepDelivered = getJourneyStatus('Delivered');

  // Helper to determine active step count
  const steps = [
    { label: 'Processing', ...stepProcessing },
    { label: 'Order confirmed', ...stepConfirmed },
    { label: 'Dispatched', ...stepDispatched },
    { label: 'On the way', ...stepOnTheWay },
    { label: 'Out for delivery', ...stepOutForDelivery },
    { label: 'Delivered', ...stepDelivered }
  ].filter(s => s.completed || ['Processing', 'Order confirmed', 'Dispatched', 'Out for delivery', 'Delivered'].includes(s.label));

  // Current active status
  const currentStatus = (orderDetails?.current_status || '').toUpperCase();
  const firstName = delivery_address?.first_name || 'there';
  const orderIdDisplay = order?.order_id || 'GID-2026-XXXX';

  // Cancelled edge case
  const cancelled = getJourneyStatus('Cancelled');

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* ── TOP CONFIRMATION BANNER ── */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#f4f7f1] rounded-full flex items-center justify-center mx-auto mb-6 scale-110 shadow-sm border border-[#e6edde]">
            {cancelled.completed ? (
              <X size={40} className="text-red-500" strokeWidth={2.5} />
            ) : (
              <CheckCircle2 size={40} className="text-[#375421]" strokeWidth={2.5} />
            )}
          </div>
          
          <p className="text-[11px] font-black text-[#375421] tracking-[0.25em] mb-3 uppercase">
            {cancelled.completed ? 'Order Cancelled' : 'Order Placed Successfully'}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] mb-5">
            {cancelled.completed ? 'We\'ve cancelled\nyour order' : 'Your plants are\non their way!'}
          </h1>
          
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md mx-auto mb-8">
            {cancelled.completed 
              ? `Hi ${firstName}, your order has been cancelled and any refund (if applicable) will be processed shortly.`
              : `Thank you, ${firstName}! Your order has been confirmed and our Bangalore team is preparing your plants with care.`
            }
          </p>

          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={() => handleCopyOrderId(orderIdDisplay)}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer active:scale-95 transition-all"
            >
              {loading && !orderDetails ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              ) : (
                <>
                  <span className="text-xs font-black text-gray-800 tracking-tight uppercase">Order #{orderIdDisplay}</span>
                  <div className="w-px h-3 bg-gray-200 mx-1" />
                  <div className="flex items-center gap-1.5 text-[#375421]">
                    {copied ? <Check size={14} /> : <Copy size={12} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? 'Copied' : 'tap to copy'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4 w-full md:w-auto">
              <button 
                onClick={() => router.push('/profile/orders')}
                className="flex-1 md:px-8 py-4 bg-[#375421] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-[#2d451b] transition-all"
              >
                Go To  Orders
              </button>
              <button 
                onClick={() => router.push('/')}
                className="flex-1 md:px-8 py-4 bg-white text-[#375421] border-2 border-[#375421] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* ── LEFT COLUMN: TRACKING ── */}
          <div className="flex-1 flex flex-col gap-8">
            {/* ── STEP 1: ORDER STATUS TRACKING ── */}
            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex-1">
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Order status</h3>
                </div>
                <span className="text-sm font-semibold text-gray-500">
                  Est. delivery: <span className="text-[#375421]">{order?.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Processing...'}</span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                {loading && !orderDetails ? (
                  <motion.div key="status-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <StatusSkeleton />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="status-content" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="space-y-0 relative pl-12 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100"
                  >
                    {/* 1. PROCESSING */}
                    <div className="relative pb-12 group">
                      <div className={`absolute -left-[2.75rem] top-0 w-10 h-10 ${stepProcessing.completed ? 'bg-[#375421]' : 'bg-gray-50'} rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-105`}>
                        <Clock size={18} className={stepProcessing.completed ? "text-white" : "text-gray-300"} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${stepProcessing.completed ? 'text-gray-900' : 'text-gray-400'}`}>Processing</h4>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stepProcessing.completed ? 'text-[#375421] bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                            {stepProcessing.completed ? '✓ Completed' : 'Started'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Order received & being verified</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                          {stepProcessing.time ? (
                            <><Clock size={12} /> {stepProcessing.time}</>
                          ) : 'Just now'}
                        </div>
                      </div>
                    </div>

                    {/* 2. ORDER CONFIRMED */}
                    <div className="relative pb-12 group">
                      <div className={`absolute -left-[2.75rem] top-0 w-10 h-10 ${stepConfirmed.completed ? 'bg-[#375421]' : 'bg-gray-50'} rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm`}>
                        {stepConfirmed.completed ? <Check size={20} className="text-white" strokeWidth={3} /> : <Zap size={18} className="text-gray-300" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${stepConfirmed.completed ? 'text-gray-900' : 'text-gray-400'}`}>Order confirmed</h4>
                          {stepConfirmed.completed && (
                            <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#375421] bg-green-50">✓ Completed</div>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${stepConfirmed.completed ? 'text-gray-500' : 'text-gray-300'}`}>Payment received · ₹{Number(order?.grand_total || 0).toFixed(0)} via {order?.payment_method || 'Razorpay'}</p>
                        {stepConfirmed.time && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                            <Clock size={12} /> {stepConfirmed.time}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. DISPATCHED */}
                    <div className="relative pb-12 group">
                      <div className={`absolute -left-[2.75rem] top-0 w-10 h-10 ${stepDispatched.completed ? 'bg-[#375421]' : 'bg-gray-50'} rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm`}>
                        {stepDispatched.completed ? <Check size={20} className="text-white" strokeWidth={3} /> : <span className="text-base font-bold text-gray-300">3</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${stepDispatched.completed ? 'text-gray-900' : 'text-gray-400'}`}>Dispatched</h4>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stepDispatched.completed ? 'text-[#375421] bg-green-50' : 'text-gray-300 bg-gray-50'}`}>
                            {stepDispatched.completed ? '✓ Completed' : 'Upcoming'}
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${stepDispatched.completed ? 'text-gray-500' : 'text-gray-300'}`}>Your plants will be handed to our delivery partner with a live tracking link.</p>
                        {stepDispatched.time && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                            <Clock size={12} /> {stepDispatched.time}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4. ON THE WAY */}
                    {stepOnTheWay.completed && (
                      <div className="relative pb-12 group">
                        <div className="absolute -left-[2.75rem] top-0 w-10 h-10 bg-[#375421] rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm">
                          <Truck size={18} className="text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-gray-900">On the way</h4>
                            <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#375421] bg-green-50">✓ Ongoing</div>
                          </div>
                          <p className="text-sm font-medium text-gray-500">Your order is currently in transit to your city.</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                            <Clock size={12} /> {stepOnTheWay.time}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. OUT FOR DELIVERY */}
                    <div className="relative pb-12 group">
                      <div className={`absolute -left-[2.75rem] top-0 w-10 h-10 ${stepOutForDelivery.completed ? 'bg-[#375421]' : 'bg-gray-50'} rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm`}>
                        {stepOutForDelivery.completed ? <Check size={20} className="text-white" strokeWidth={3} /> : <span className="text-base font-bold text-gray-300">{stepOnTheWay.completed ? '5' : '4'}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${stepOutForDelivery.completed ? 'text-gray-900' : 'text-gray-400'}`}>Out for delivery</h4>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stepOutForDelivery.completed ? 'text-[#375421] bg-green-50' : 'text-gray-300 bg-gray-50'}`}>
                            {stepOutForDelivery.completed ? '✓ Completed' : 'Upcoming'}
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${stepOutForDelivery.completed ? 'text-gray-500' : 'text-gray-300'}`}>Your order will be on the way to {delivery_address?.address?.slice(0, 40)}...</p>
                      </div>
                    </div>

                    {/* 6. DELIVERED */}
                    <div className="relative group">
                      <div className={`absolute -left-[2.75rem] top-0 w-10 h-10 ${stepDelivered.completed ? 'bg-[#375421]' : 'bg-gray-50'} rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm`}>
                        {stepDelivered.completed ? <Check size={20} className="text-white" strokeWidth={3} /> : <span className="text-base font-bold text-gray-300">{stepOnTheWay.completed ? '6' : '5'}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${stepDelivered.completed ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</h4>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${stepDelivered.completed ? 'text-[#375421] bg-green-50' : 'text-gray-300 bg-gray-50'}`}>
                            {stepDelivered.completed ? '✓ Completed' : 'Upcoming'}
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${stepDelivered.completed ? 'text-gray-500' : 'text-gray-300'}`}>Your plants arrive healthy, ready to grow. Remember your 7-day survival guarantee starts here.</p>
                        {stepDelivered.time && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1">
                            <Clock size={12} /> {stepDelivered.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* ── NEW ORDER SUMMARY SECTION (LEFT BELOW STATUS) ── */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                <div className="flex items-center gap-3 text-gray-900">
                   <Package size={20} className="text-[#375421]" />
                   <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-gray-800">Your order · #{orderIdDisplay}</h3>
                </div>
                <span className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-500 rounded-full uppercase tracking-widest border border-gray-100">{order_items.length} {order_items.length === 1 ? 'item' : 'items'}</span>
              </div>

              <div className="divide-y divide-gray-100">
                <AnimatePresence mode="wait">
                  {loading && !orderDetails ? (
                    <motion.div key="item-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ItemSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div key="item-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {order_items.map((item, idx) => (
                        <div key={idx} className="py-8 first:pt-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div 
                              onClick={() => router.push(getProductUrl(item))}
                              className="w-full sm:w-28 h-28 bg-[#f8fbf6] rounded-3xl overflow-hidden border border-gray-50 flex items-center justify-center relative group flex-shrink-0 cursor-pointer"
                            >
                              <img 
                                src={`${axiosInstance.defaults.baseURL}${item.image}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt="" 
                              />
                              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black text-[#375421] shadow-sm border border-green-50">{item.quantity}</div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                  <ArrowUpRight className="text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" size={24} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="group cursor-pointer" onClick={() => router.push(getProductUrl(item))}>
                                <p className="text-[10px] font-bold text-[#375421] uppercase tracking-widest mb-1 group-hover:underline">{item.category_slug?.replace(/-/g, ' ') || item.category_name || "Gidan Collection"}</p>
                                <h4 className="text-[16px] font-black text-gray-900 uppercase leading-none mb-2 group-hover:text-[#375421] transition-colors">{item.product_name}</h4>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mb-4">{item.variant_name || "Premium Selection · Professional Grade"}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="px-2.5 py-1 bg-[#f4f7f1] text-[9px] font-black text-[#375421] rounded-lg uppercase tracking-tight flex items-center gap-1.5">QUALITY VERIFIED</span>
                                  <span className="px-2.5 py-1 bg-[#f4f7f1] text-[9px] font-black text-[#375421] rounded-lg uppercase tracking-tight flex items-center gap-1.5">BOUTIQUE SELECTION</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg font-black text-gray-900 leading-none">₹{Number(item.selling_price).toFixed(0)}</span>
                                  <span className="text-[12px] text-gray-300 font-bold line-through">₹{Number(item.mrp).toFixed(0)}</span>
                                </div>
                                <button className="flex items-center gap-1.5 text-[10px] font-black text-[#375421] uppercase hover:underline">
                                  <Star size={12} className="fill-current" /> Write a review
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delivery & Payment Sub-sections */}
              <div className="flex flex-col md:flex-row border-t border-gray-100 mt-12 bg-white">
                {/* Shipping */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Delivering To</h3>
                    <div className="space-y-1">
                      <p className="text-[15px] font-black text-gray-900 uppercase tracking-tight">{delivery_address?.first_name} {delivery_address?.last_name}</p>
                      <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                        {delivery_address?.address}, {delivery_address?.city}<br />
                        {delivery_address?.state} — {delivery_address?.pincode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-black text-gray-900 pt-2">
                       <Smartphone size={18} className="text-gray-400" /> {delivery_address?.phone || delivery_address?.mobile || 'No number provided'}
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100 uppercase tracking-wide">
                        {currentStatusDisplay} · ETA: {order?.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="flex-1 p-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Payment</h3>
                    <div className="flex items-center gap-2 text-[#2d4a1e] font-black text-[13px] uppercase tracking-wide">
                      <div className="w-5 h-5 bg-[#2d4a1e] rounded flex items-center justify-center">
                        <Check size={12} className="text-white" strokeWidth={4} />
                      </div>
                      Payment successful
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Smartphone size={20} className="text-gray-400" />
                      <div className="text-[13px] font-black text-gray-900 uppercase">{order?.payment_method || 'UPI'}</div>
                    </div>
                    <div className="space-y-1 pt-2">
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID:</p>
                       <p className="text-[13px] font-black text-gray-900">{order?.transfer_details?.id ? order.transfer_details.id : `GPY${new Date().getTime()}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Totals Breakdown (Unified Table Style) */}
              <div className="border-t border-gray-100 p-8 pt-10 space-y-4">
                <AnimatePresence mode="wait">
                  {loading && !orderDetails ? (
                    <motion.div key="summary-skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <SummarySkeleton />
                    </motion.div>
                  ) : (
                    <motion.div key="summary-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                       <div className="flex justify-between items-center text-[14px] font-medium text-gray-600">
                         <span>Taxable Value</span>
                         <span className="text-gray-900 font-black">₹{Number(order?.taxable_value || 0).toFixed(2)}</span>
                       </div>

                       {/* GST Breakdown Summary with Disclosure/Dropdown */}
                       {order?.gst_breakdown?.summary && Object.entries(order.gst_breakdown.summary).map(([key, value]) => {
                         if (value.total > 0) {
                           const rate = key.replace('gst_', '');
                           return (
                             <div key={key} className="space-y-1">
                               <details className="group cursor-pointer">
                                 <summary className="flex justify-between items-center text-[14px] font-medium text-gray-600 list-none">
                                   <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
                                     <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform" />
                                     <span>GST ({rate}%)</span>
                                   </div>
                                   <span className="text-gray-900 font-black">₹{Number(value.total).toFixed(2)}</span>
                                 </summary>
                                 <div className="mt-2 space-y-1.5 transition-all">
                                   <div className="flex justify-between items-center text-[13px] font-medium text-gray-400 pl-6 border-l border-gray-100 ml-1.5">
                                     <span>CGST ({Number(rate)/2}%)</span>
                                     <span>₹{Number(value.cgst).toFixed(2)}</span>
                                   </div>
                                   <div className="flex justify-between items-center text-[13px] font-medium text-gray-400 pl-6 border-l border-gray-100 ml-1.5">
                                     <span>SGST ({Number(rate)/2}%)</span>
                                     <span>₹{Number(value.sgst).toFixed(2)}</span>
                                   </div>
                                 </div>
                               </details>
                             </div>
                           );
                         }
                         return null;
                       })}

                       <div className="flex justify-between items-center text-[14px] font-medium text-gray-600 border-t border-gray-50 pt-4">
                         <span>Subtotal ({order_items.length} items)</span>
                         <span className="text-gray-900 font-black">₹{Number(order?.total_price || 0).toFixed(0)}</span>
                       </div>
                       {Number(order?.coupon_discount || 0) > 0 && (
                         <div className="flex justify-between items-center text-[14px] font-medium text-gray-600">
                           <span>Coupon discount</span>
                           <span className="text-emerald-600 font-black">−₹{Number(order.coupon_discount).toFixed(0)}</span>
                         </div>
                       )}
                       <div className="flex justify-between items-center text-[14px] font-medium text-gray-600">
                         <span>Delivery</span>
                         <span className="text-emerald-600 font-black tracking-widest">
                          {Number(order?.shipping_charge || 0) > 0 ? `₹${Number(order.shipping_charge).toFixed(0)}` : 'FREE'}
                         </span>
                       </div>
                       
                       <div className="pt-8 flex flex-col gap-6">
                         <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-6">
                           <span className="text-[18px] font-black text-gray-900">Total paid</span>
                           <span className="text-3xl font-serif text-gray-900 italic">₹{Number(order?.grand_total || 0).toFixed(0)}</span>
                         </div>

                         <div className="bg-[#f4f7f1] px-6 py-4 rounded-xl border border-[#e8efe2] flex items-center justify-center">
                            <p className="text-[11px] font-black uppercase text-[#2d4a1e] tracking-[0.1em]">
                              You saved ₹{Number(order?.total_discount || 0) + Number(order?.coupon_discount || 0)} on this order · Nice one!
                            </p>
                         </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN: NEXT STEPS ── */}
          <div className="w-full lg:w-[380px] flex flex-col gap-8">
            <section className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex-1 flex flex-col">
              <div className="bg-[#2d4a1e] p-8 pb-10">
                <h3 className="text-[22px] font-serif text-white mb-2 leading-tight">What happens next?</h3>
                <p className="text-sm text-green-100/70">We'll keep you updated every step of the way</p>
              </div>

              <div className="px-8 pb-8 pt-8 flex-1">
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f7f1] flex items-center justify-center flex-shrink-0 text-[#375421] font-bold text-sm">1</div>
                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-none">WhatsApp confirmation</h4>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                        You'll receive an order summary on <span className="text-gray-900 font-bold">{delivery_address?.phone || delivery_address?.mobile || 'your phone'}</span> within 10 minutes.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f7f1] flex items-center justify-center flex-shrink-0 text-[#375421] font-bold text-sm">2</div>
                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-none">Quality check</h4>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                        Our team inspects every plant before packing — usually done within 6 hrs.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f7f1] flex items-center justify-center flex-shrink-0 text-[#375421] font-bold text-sm">3</div>
                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-none">Healthy arrival</h4>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                        Your plants are packed in breathable, eco-friendly boxes for a safe journey.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4f7f1] flex items-center justify-center flex-shrink-0 text-[#375421] font-bold text-sm">4</div>
                    <div className="space-y-1">
                      <h4 className="text-[15px] font-bold text-gray-900 leading-none">Delivered + care guide</h4>
                      <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                        Your plants arrive with a printed care card. Your 7-day guarantee starts on delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 space-y-3">
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <User size={18} className="text-blue-500" /> View my account
                </button>
              </div>
            </section>

            {/* Refer & Earn */}
            <section 
              onClick={handleShareReferral}
              className="bg-[#fdf9f4] border border-[#d98b4820] rounded-[2rem] p-8 cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#c07d3e] uppercase tracking-[0.2em] mb-4">
                REFER & EARN
              </div>
              <h2 className="text-[28px] font-serif text-gray-900 mb-2 leading-tight">
                Share Gidan, earn ₹150
              </h2>
              <p className="text-[14px] text-gray-500 font-medium leading-relaxed mb-8">
                Every friend you refer gets ₹150 off their first order — and you earn ₹150 credit too. No limit.
              </p>
              
              <div className="flex gap-3 mb-8">
                <div className="flex-1 border-2 border-dashed border-[#c07d3e] rounded-2xl flex items-center justify-center bg-white/50 min-w-0 p-1">
                  <div className="w-full flex items-center justify-center overflow-hidden">
                    <span className="text-[15px] sm:text-[17px] font-serif tracking-[0.15em] sm:tracking-[0.25em] text-[#c07d3e] whitespace-nowrap text-center leading-none px-2 py-3 truncate">
                      {referralData?.referral_code || 'GIDAN150'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(referralData?.referral_code || 'GIDAN150');
                    alert("Copied!");
                  }}
                  className="bg-[#c07d3e] text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#a66a33] transition-all whitespace-nowrap shadow-md shadow-[#c07d3e20]"
                >
                  <Copy size={16} /> Copy
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 px-1">
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    const text = `Hey! Join Gidan for amazing plants. Use my referral code: ${referralData?.referral_code || 'GIDAN150'} and get ₹150 off!`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + "\nhttps://www.gidan.store")}`, '_blank');
                  }}
                  className="bg-white border border-gray-100 rounded-xl py-3 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={20} style={{ display: 'block' }} className="text-black" />
                </div>
                <div 
                   onClick={(e) => {
                    e.stopPropagation();
                    window.open('https://www.instagram.com/thegidanstore/', '_blank');
                  }}
                  className="bg-white border border-gray-100 rounded-xl py-3 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                  title="Instagram"
                >
                  <FaInstagram size={18} style={{ display: 'block' }} className="text-black" />
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    const text = `Hey! Join Gidan for amazing plants. Use my referral code: ${referralData?.referral_code || 'GIDAN150'} and get ₹150 off!`;
                    window.location.href = `mailto:?subject=Gidan Referral&body=${encodeURIComponent(text + "\nhttps://www.gidan.store")}`;
                  }}
                  className="bg-white border border-gray-100 rounded-xl py-3 flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
                  title="Email"
                >
                  <FaEnvelope size={18} style={{ display: 'block' }} className="text-black" />
                </div>
              </div>
            </section>

            {/* ── First-week care guide ── */}
            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f4f7f1] rounded-xl flex items-center justify-center">
                        <Leaf size={20} className="text-[#375421]" />
                    </div>
                    <h3 className="text-2xl font-serif text-gray-900 italic">First-week care guide</h3>
                 </div>
                 <span className="text-sm font-medium text-gray-400">Tailored to your order</span>
               </div>
               
               <div className="divide-y divide-gray-100">
                 {care_guides.length > 0 ? (
                   care_guides.map((guide, idx) => (
                     <div key={guide.id || idx} className="p-8 flex gap-6 items-start hover:bg-gray-50/30 transition-colors">
                       <div className="w-14 h-14 bg-[#f4f7f1] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2">
                          <img 
                            src={guide.icon} 
                            className="w-full h-full object-contain" 
                            alt="" 
                          />
                       </div>

                       <div className="flex-1 space-y-1">
                         <h4 className="text-[17px] font-bold text-gray-900 leading-tight">
                          {guide.title}
                         </h4>
                         <div className="text-[14px] font-bold text-[#375421] mb-2 lowercase first-letter:uppercase">
                           {guide.subtitle || 'Week 1 tip'}
                         </div>
                         <p className="text-[15px] text-gray-500 font-medium leading-[1.6]">
                           {guide.description}
                         </p>
                       </div>
                     </div>
                   ))
                 ) : (
                   order_items.map((item, idx) => (
                     <div key={idx} className="p-8 flex gap-6 items-start hover:bg-gray-50/30 transition-colors">
                       <div className="w-14 h-14 bg-[#f4f7f1] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <img 
                            src={`${axiosInstance.defaults.baseURL}${item.image}`} 
                            className="w-10 h-10 object-contain" 
                            alt="" 
                          />
                       </div>

                       <div className="flex-1 space-y-1">
                         <h4 className="text-[17px] font-bold text-gray-900 leading-tight">
                          {item.product_name}
                         </h4>
                         <div className="text-[14px] font-bold text-[#375421] mb-2 lowercase first-letter:uppercase">
                           {idx === order_items.length - 1 ? 'Day 1 tip' : 'Week 1 tip'}
                         </div>
                         <p className="text-[15px] text-gray-500 font-medium leading-[1.6]">
                           Place in bright indirect light. Don't water for the first 5-7 days — let it settle from transit stress. Bangalore's humidity is perfect for your new plant.
                         </p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </section>
          </div>

        </div>
      </div>
      
      {/* ── FULL WIDTH RECENTLY VIEWED SECTION ── */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
           <RecentlyViewedProducts title="You might also love" />
        </div>
      </div>
    </div>
  );
};

const Successpage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Preparing your success story...</p>
        </div>
      </div>
    }>
      <SuccesspageContent />
    </Suspense>
  );
};

export default Successpage;
