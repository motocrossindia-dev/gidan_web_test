'use client';

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";


const PaymentPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [countdown, setCountdown] = useState(8);
  const pathname = usePathname();
  const [expandedGst, setExpandedGst] = useState({});
  const orderData = (() => {
    try { return JSON.parse(sessionStorage.getItem('payment_order_data') || 'null'); } catch { return null; }
  })();
  const data = orderData?.resource || {};
  const accessToken = useSelector(selectAccessToken);

  // Countdown + redirect after payment success
  useEffect(() => {
    if (!paymentSuccess) return;
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
  }, [paymentSuccess]);

  const handlePayment = async () => {
    // Add your payment processing logic here
    if (!paymentMethod || !data.id) {
      alert('Please select a payment method');
      return;

    }
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/order/proceedToPayment/`, {
        order_id: data.id,
        payment_method: paymentMethod,
      },
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }

      )
      if (response.data.status === "created") {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.grand_total * 100,
          currency: "INR",
          name: "Bio-tech Maali",
          description: "Transaction",
          image: "/Gidan_logo.webp",
          order_id: response.data.id, // Pass the order_id from API response
          handler: async (paymentResponse) => {

            try {
              const verifyResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/order/verifyPayment/`,
                {
                  razorpay_payment_id: paymentResponse?.razorpay_payment_id,
                  razorpay_order_id: paymentResponse?.razorpay_order_id, // Use the correct ID from Razorpay
                  razorpay_signature: paymentResponse?.razorpay_signature,
                  order_id: orderData?.orders?.id, // Match the order ID
                  payment_method: paymentMethod,
                  amount: data?.grand_total,
                  payment_details: paymentResponse,
                },
                { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
              );
              if (verifyResponse.data.message === "Payment successful") {
                enqueueSnackbar("Payment Verified Successfully!", { variant: "success" });
                setSuccessOrderId(orderData?.orders?.id ?? null);
                setPaymentSuccess(true);
              } else {
                enqueueSnackbar("Payment Verification Failed.", { variant: "error" });
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              enqueueSnackbar("Payment verification error.", { variant: "error" });
            }

          },
          prefill: { name: "John Doe", email: "john@example.com", contact: "9876543210" },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();


      }
    } catch (error) {
      console.log(error);

    }
    // router.push('/order-success');
  };

  // Show success screen instantly without any page navigation
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-10 flex flex-col items-center text-center">
            <CheckCircle2 className="w-20 h-20 text-white mb-4" />
            <h1 className="text-2xl font-extrabold text-white">Order Placed Successfully!</h1>
            {successOrderId && (
              <p className="text-green-200 text-sm mt-1">Order ID: <span className="font-bold text-white">{successOrderId}</span></p>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-8 space-y-3">
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
  }

  return (
    <>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4">
          {/* Progress Bar Component */}
          <div className="flex items-center mb-6 border-b pb-4">
            <button onClick={() => window.history.back()} className="mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Address</span>
                <span className="text-gray-400">Order Summary</span>
                <span className="text-bio-green font-medium">Payment</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full">
                <div className="h-full bg-bio-green rounded-full w-full transition-all duration-300"></div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Amount</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Price (3 items)</span>
                <span>₹{data.total_price}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">₹{data.total_discount}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-green-600">₹50 Free</span>
              </div>
              {/* <div className="flex justify-between">
              <span className="text-gray-600">Secured Packaging Fee</span>
              <span>₹198</span>
            </div> */}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{data.grand_total}.00</span>
              </div>
            </div>

            {/* GST Section */}
            {(() => {
              const breakdownGroups = data?.order?.gst_breakdown?.groups;
              const summary = data?.order?.gst_summary;
              const newSummary = data?.order?.summary || data?.order?.gst_breakdown?.summary;

              if (newSummary && Object.keys(newSummary).some(k => k.startsWith('gst_'))) {
                return Object.entries(newSummary).map(([key, gData]) => {
                  const rate = key.split('_')[1];
                  const totalGst = Number(gData.total || 0);
                  if (totalGst === 0) return null;
                  const isExpanded = !!expandedGst[rate];

                  return (
                    <div key={rate} className="space-y-1 py-1 transition-all duration-300">
                      <div
                        className="flex justify-between text-xs text-gray-600 font-medium cursor-pointer"
                        onClick={() => setExpandedGst(prev => ({ ...prev, [rate]: !prev[rate] }))}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          GST ({rate}%)
                        </span>
                        <span>₹{totalGst.toFixed(2)}</span>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 pl-4 border-l border-gray-100 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {Number(gData.cgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>CGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(gData.cgst).toFixed(2)}</span>
                            </div>
                          )}
                          {Number(gData.sgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>SGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(gData.sgst).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              }

              if (breakdownGroups) {
                return Object.entries(breakdownGroups).map(([rate, group]) => {
                  const totalGst = Number(group.total_amount || group.igst || (Number(group.cgst || 0) + Number(group.sgst || 0)) || 0);
                  if (Number(rate) === 0 || totalGst === 0) return null;
                  const isExpanded = !!expandedGst[rate];

                  return (
                    <div key={rate} className="space-y-1 py-1 transition-all duration-300">
                      <div
                        className="flex justify-between text-xs text-gray-600 font-medium cursor-pointer"
                        onClick={() => setExpandedGst(prev => ({ ...prev, [rate]: !prev[rate] }))}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          GST ({rate}%)
                        </span>
                        <span>₹{totalGst.toFixed(2)}</span>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 pl-4 border-l border-gray-100 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {Number(group.cgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>CGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(group.cgst).toFixed(2)}</span>
                            </div>
                          )}
                          {Number(group.sgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>SGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(group.sgst).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              }

              return null;
            })()}

            <div className="mt-2 text-green-600 text-sm">
              You will save ₹{data.total_discount}.00 on this order
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="reward"
                  name="payment"
                  value="reward"
                  checked={paymentMethod === 'reward'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <label htmlFor="reward" className="flex-1">
                  <div className="font-medium">Reward Points Worth₹65.07</div>
                  <div className="text-sm text-gray-500">Your current balance is ₹65.07</div>
                </label>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="wallet"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <label htmlFor="wallet" className="flex-1">
                  <div className="font-medium">25% Utilization on Cart Value</div>
                </label>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="razorpay"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <label htmlFor="razorpay" className="flex-1">
                  <div className="font-medium">Razorpay Secure (UPI, Cards, Wallet, NetBanking)</div>
                </label>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="COD"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-green-600"
                />
                <label htmlFor="cod" className="flex-1">
                  <div className="font-medium">Cash on Delivery/Pay on Delivery</div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handlePayment}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
            >
              Proceed To Payment
            </button>
            <button
              onClick={() => router.push('/order-summary')}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default PaymentPage;