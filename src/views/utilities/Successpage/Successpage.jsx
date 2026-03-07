'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';

const Successpage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [showGstDetail, setShowGstDetail] = useState(false);
  const [showShippingDetail, setShowShippingDetail] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setMounted(true);
    try {
      const isSuccess = sessionStorage.getItem('recent_payment_success');
      if (!isSuccess) {
        router.replace('/');
        return;
      }
      sessionStorage.removeItem('recent_payment_success');
      const id = sessionStorage.getItem('recent_order_id');
      if (id) setOrderId(id);
      setPaymentVerified(true);
    } catch { }
  }, []);

  // Auto-redirect only after payment is confirmed
  useEffect(() => {
    if (!paymentVerified) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push('/profile/orders');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentVerified]);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/order/${orderId}/`);
        if (res.status === 200) setOrderData(res.data.data);
      } catch (e) {
        console.error('Failed to fetch order details', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!mounted) return null;

  const order = orderData;
  const items = orderData?.order_items ?? [];

  const deliveryCharge = Number(order?.shipping_charge ?? 0);
  const totalDiscount = Number(order?.total_discount ?? 0);
  const couponDiscount = Number(order?.coupon_discount ?? 0);
  const grandTotal = Number(order?.grand_total ?? 0);
  const savings = totalDiscount + couponDiscount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      {/* Success Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Green Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-8 flex flex-col items-center text-center">
          <CheckCircle2 className="w-16 h-16 text-white mb-3" />
          <h1 className="text-2xl font-extrabold text-white">Order Placed Successfully!</h1>
          {order?.order_id && (
            <p className="text-green-200 text-sm mt-1">Order ID: <span className="font-bold text-white">{order.order_id}</span></p>
          )}
          {order?.date && (
            <p className="text-green-200 text-xs mt-0.5">{new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          )}
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading order details…</p>
          </div>
        ) : !order ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Your order was placed successfully!</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">

            {/* Items */}
            {items.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Items Ordered</p>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        <img
                          src={`${axiosInstance.defaults.baseURL}${item.image}`}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = '/placeholder-product.png')}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 flex-shrink-0">₹{Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-dashed" />

            {/* Price Details */}
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Price Details</p>
              <div className="space-y-2 text-sm">
                {/* MRP row — only when item.mrp is present in API response */}
                {items.length > 0 && items.some(i => Number(i.mrp) > 0) && (
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span>₹{Number(items.reduce((s, i) => s + Number(i.mrp) * i.quantity, 0)).toFixed(2)}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      🏷️ Coupon Discount
                      {order?.applied_coupon && (
                        <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1">{order.applied_coupon}</span>
                      )}
                    </span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-semibold' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                {/* Product GST collapsible */}
                {(Number(order?.gst_amount_5 ?? 0) + Number(order?.gst_amount_18 ?? 0)) > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowGstDetail((v) => !v)}
                      className="w-full flex justify-between text-gray-600 py-0.5"
                    >
                      <span>Product GST</span>
                      <span className="flex items-center gap-1">
                        ₹{(Number(order.gst_amount_5 ?? 0) + Number(order.gst_amount_18 ?? 0)).toFixed(2)}
                        <span className="text-xs text-gray-400 ml-1">{showGstDetail ? '▲' : '▼'}</span>
                      </span>
                    </button>
                    {showGstDetail && (
                      <div className="pl-3 border-l-2 border-gray-100 mt-1 space-y-1 text-xs text-gray-500">
                        {Number(order.gst_amount_5 ?? 0) > 0 && (
                          <>
                            <div className="flex justify-between"><span>GST @ 5%</span><span>₹{Number(order.gst_amount_5).toFixed(2)}</span></div>
                            <div className="flex justify-between pl-2"><span>CGST 2.5%</span><span>₹{Number(order.cgst_amount_5).toFixed(2)}</span></div>
                            <div className="flex justify-between pl-2"><span>SGST 2.5%</span><span>₹{Number(order.sgst_amount_5).toFixed(2)}</span></div>
                          </>
                        )}
                        {Number(order.gst_amount_18 ?? 0) > 0 && (
                          <>
                            <div className="flex justify-between"><span>GST @ 18%</span><span>₹{Number(order.gst_amount_18).toFixed(2)}</span></div>
                            <div className="flex justify-between pl-2"><span>CGST 9%</span><span>₹{Number(order.cgst_amount_18).toFixed(2)}</span></div>
                            <div className="flex justify-between pl-2"><span>SGST 9%</span><span>₹{Number(order.sgst_amount_18).toFixed(2)}</span></div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping GST collapsible */}
                {Number(order?.shipping_gst ?? 0) > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowShippingDetail((v) => !v)}
                      className="w-full flex justify-between text-gray-600 py-0.5"
                    >
                      <span>Shipping GST</span>
                      <span className="flex items-center gap-1">
                        ₹{Number(order.shipping_gst).toFixed(2)}
                        <span className="text-xs text-gray-400 ml-1">{showShippingDetail ? '▲' : '▼'}</span>
                      </span>
                    </button>
                    {showShippingDetail && (
                      <div className="pl-3 border-l-2 border-gray-100 mt-1 space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between pl-2"><span>CGST 9%</span><span>₹{Number(order.shipping_cgst).toFixed(2)}</span></div>
                        <div className="flex justify-between pl-2"><span>SGST 9%</span><span>₹{Number(order.shipping_sgst).toFixed(2)}</span></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex justify-between text-gray-800 font-bold border-t pt-2 text-base">
                  <span>Total Amount Paid</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>

                {/* GD Coins */}
                {Number(order?.gd_coin ?? 0) > 0 && (
                  <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪙</span>
                      <div>
                        <p className="text-xs font-bold text-gray-800">GD Coins Earned</p>
                        <p className="text-[10px] text-gray-400">Use on your next order</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-orange-500">+{order.gd_coin}</span>
                  </div>
                )}

                {savings > 0 && (
                  <p className="text-emerald-600 text-xs font-semibold text-center bg-emerald-50 rounded-lg py-1.5">
                    🎉 You saved ₹{savings.toFixed(2)} on this order!
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Action Buttons */}
        <div className="px-5 pb-6 space-y-3">
          <button
            onClick={() => router.push('/profile/orders')}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> View My Orders <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-xs text-gray-400">Redirecting to your orders in {countdown}s…</p>
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default Successpage;
