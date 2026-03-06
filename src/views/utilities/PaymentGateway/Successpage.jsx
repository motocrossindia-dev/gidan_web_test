'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";

const Successpage = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGstDetail, setShowGstDetail] = useState(false);
  const [showShippingDetail, setShowShippingDetail] = useState(false);

  useEffect(() => {
    const successFlag = sessionStorage.getItem('recent_payment_success');
    if (!successFlag) {
      router.replace("/");
      return;
    }
    setIsAuthorized(true);
    window.scrollTo(0, 0);

    const orderId = sessionStorage.getItem('recent_order_id');
    if (orderId && accessToken) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          if (res.data?.message === "success") {
            setOrder(res.data.data);
            setItems(res.data.data?.items || []);
          }
        })
        .catch((err) => console.error("Order fetch error:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router, accessToken]);

  const handleGoToOrders = () => {
    sessionStorage.removeItem('recent_payment_success');
    sessionStorage.removeItem('recent_order_id');
    router.push("/profile/orders");
  };

  if (!isAuthorized) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://backend.gidan.store';
  const deliveryCharge = Number(order?.shipping_charge || 0);
  const shippingGst = Number(order?.shipping_gst || 0);
  const totalShipping = deliveryCharge + shippingGst;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-900 py-3 px-4 text-white text-center text-sm font-semibold tracking-wide">
        SHOPPING CART &rsaquo; CHECKOUT &rsaquo; <span className="underline">CONFIRMATION</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-5 mb-5 flex items-center gap-4"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 flex-shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-gray-800">Payment Confirmed!</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Thank you! Your order has been placed and is being processed.
            </p>
            {order?.order_id && (
              <p className="text-xs text-gray-400 mt-1">
                Order ID: <span className="font-semibold text-gray-600">{order.order_id}</span>
                {order.date && <span className="ml-2">· {order.date}</span>}
              </p>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm animate-pulse">
            Loading order details…
          </div>
        ) : order ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Card header */}
            <div className="bg-gradient-to-r from-green-600 to-green-900 px-4 py-3 flex items-center justify-between">
              <span className="text-white font-bold text-sm tracking-wide">Order Summary</span>
              <span className="text-green-200 text-xs">{order.order_id} · {order.date}</span>
            </div>

            <div className="p-4 space-y-5">

              {/* ── Items Table ── */}
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">
                  Items ({items.length})
                </p>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-2 w-1/2">Items Description</th>
                      <th className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-1">Qty</th>
                      <th className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-1">Savings</th>
                      <th className="text-right text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-2">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => {
                      const hasSaving = Number(item.discount ?? 0) > 0;
                      const discountPct = Number(item.discount_value ?? 0);
                      return (
                        <tr key={item.id} className="align-middle">
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                <img
                                  src={`${baseUrl}${item.image}`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.currentTarget.src = "/placeholder-product.png")}
                                />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800 text-[10px] leading-tight line-clamp-2 block">{item.product_name}</span>
                                {(item.color || item.planter_size || item.size || item.weight) && (
                                  <span className="text-[9px] text-gray-400">
                                    {[item.color, item.planter_size, item.size, item.weight].filter(Boolean).join(' · ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center">
                            <span className="inline-block border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 min-w-[22px]">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="py-2 px-1 text-center">
                            {hasSaving ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[9px] font-bold text-red-500">
                                  {item.discount_type === "%" ? `${discountPct.toFixed(0)}% Off` : `₹${Number(item.discount).toFixed(0)} Off`}
                                </span>
                                <span className="text-[9px] text-gray-400 line-through">₹{Number(item.mrp).toFixed(2)}</span>
                              </div>
                            ) : (
                              <span className="text-[9px] text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right">
                            <span className="font-bold text-gray-800 text-[11px]">₹{Number(item.selling_price).toFixed(2)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <hr className="border-dashed" />

              {/* ── Price Breakdown ── */}
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Price Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>MRP Total</span>
                    <span>₹{items.reduce((s, i) => s + Number(i.mrp) * i.quantity, 0).toFixed(2)}</span>
                  </div>
                  {Number(order.total_discount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        Discount
                        {order.discount_type && (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                            {order.discount_type === "%" ? `${Number(order.discount_value ?? 0).toFixed(0)}%` : `Flat ₹${Number(order.discount_value ?? 0).toFixed(2)}`}
                          </span>
                        )}
                      </span>
                      <span>-₹{Number(order.total_discount).toFixed(2)}</span>
                    </div>
                  )}
                  {order.coupon_applied && Number(order.coupon_discount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        🏷️ Coupon
                        {order.coupon_value && (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                            {order.coupon_type === "%" ? `${Number(order.coupon_value).toFixed(0)}%` : `₹${Number(order.coupon_value).toFixed(2)}`}
                          </span>
                        )}
                      </span>
                      <span>-₹{Number(order.coupon_discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-800 font-semibold border-t pt-2">
                    <span>Taxable Sub Total</span>
                    <span>₹{Number(order.total_price ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ── Product GST ── */}
              {(Number(order.gst_amount_5 ?? 0) > 0 || Number(order.gst_amount_18 ?? 0) > 0) && (
                <>
                  <hr className="border-dashed" />
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowGstDetail((v) => !v)}
                      className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1"
                    >
                      <span>Product Tax (GST)</span>
                      <span className="text-gray-400 text-xs">{showGstDetail ? "▲" : "▼"}</span>
                    </button>
                    {showGstDetail && (
                      <div className="space-y-1.5 text-sm mt-2">
                        {Number(order.gst_amount_5 ?? 0) > 0 && (
                          <div className="border border-gray-200 rounded-lg p-2.5 space-y-1">
                            <div className="flex justify-between font-medium text-gray-700">
                              <span>GST @ 5%</span><span>₹{Number(order.gst_amount_5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>CGST 2.5%</span><span>₹{Number(order.cgst_amount_5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>SGST 2.5%</span><span>₹{Number(order.sgst_amount_5).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        {Number(order.gst_amount_18 ?? 0) > 0 && (
                          <div className="border border-gray-200 rounded-lg p-2.5 space-y-1">
                            <div className="flex justify-between font-medium text-gray-700">
                              <span>GST @ 18%</span><span>₹{Number(order.gst_amount_18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>CGST 9%</span><span>₹{Number(order.cgst_amount_18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>SGST 9%</span><span>₹{Number(order.sgst_amount_18).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Shipping ── */}
              <hr className="border-dashed" />
              <div>
                <button
                  type="button"
                  onClick={() => setShowShippingDetail((v) => !v)}
                  className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1"
                >
                  <span>Shipping</span>
                  <span className="text-gray-400 text-xs">{showShippingDetail ? "▲" : "▼"}</span>
                </button>
                <div className="flex justify-between text-sm font-medium text-gray-700 mt-1">
                  <span>Shipping Charge</span>
                  <span>{deliveryCharge === 0 ? "Free" : `₹${totalShipping.toFixed(2)}`}</span>
                </div>
                {showShippingDetail && deliveryCharge > 0 && (
                  <div className="border border-gray-200 rounded-lg p-2.5 space-y-1 text-sm mt-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping Charge (Base)</span><span>₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                    {shippingGst > 0 && (
                      <>
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping GST (18%)</span><span>₹{shippingGst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs pl-2">
                          <span>CGST 9%</span><span>₹{Number(order.shipping_cgst).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs pl-2">
                          <span>SGST 9%</span><span>₹{Number(order.shipping_sgst).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 font-semibold border-t border-gray-200 pt-1.5 mt-1">
                          <span>Total Shipping</span><span>₹{totalShipping.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ── Payment Method ── */}
              {order.payment_method && (
                <>
                  <hr className="border-dashed" />
                  <div className="flex justify-between text-sm text-gray-700">
                    <span className="font-medium">Payment Method</span>
                    <span className="font-semibold">{order.payment_method}</span>
                  </div>
                </>
              )}

              {/* ── Delivery Address ── */}
              {order.delivery_address && (
                <>
                  <hr className="border-dashed" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">Delivery Address</p>
                    <p className="text-sm font-semibold text-gray-800">{order.delivery_address.first_name} {order.delivery_address.last_name}</p>
                    <p className="text-xs text-gray-500">{order.delivery_address.address}</p>
                    <p className="text-xs text-gray-500">{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                    <span className="inline-block mt-1 text-[9px] border border-gray-300 rounded px-1.5 py-0.5 text-gray-500">{order.delivery_address.address_type}</span>
                  </div>
                </>
              )}
            </div>

            {/* ── Fixed Bottom ── */}
            <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-3">
              {/* GD Coins */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">GD Coins Earned</p>
                    <p className="text-[10px] text-gray-400">Use on your next order</p>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-orange-500">+{order.gd_coin ?? 0}</span>
              </div>

              {/* Grand Total */}
              <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-white font-bold text-sm">Grand Total</span>
                <span className="text-white font-extrabold text-lg">₹{Number(order.grand_total ?? 0).toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleGoToOrders}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  View Orders
                </button>
                <button
                  onClick={() => { sessionStorage.removeItem('recent_payment_success'); sessionStorage.removeItem('recent_order_id'); router.push('/'); }}
                  className="flex-1 bg-bio-green text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all text-sm"
                >
                  Continue Shopping
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400">🔒 Safe and Secure Payments. 100% Authentic Products.</p>
            </div>
          </div>
        ) : (
          /* Fallback if no order data */
          <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-4">
            <p className="text-gray-500 text-sm">Order details unavailable.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleGoToOrders} className="bg-bio-green text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-green-700">
                View Orders
              </button>
              <button onClick={() => router.push('/')} className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-50">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Successpage;
