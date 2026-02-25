'use client';

import { useRouter, usePathname } from "next/navigation";
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";


const PaymentPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const pathname = usePathname();
  const orderData = null?.resource;
  const data = orderData?.orders || {};
  const accessToken = useSelector(selectAccessToken);

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
                router.push('/orders')
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
                <span className="text-blue-600 font-medium">Payment</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full">
                <div className="h-full bg-blue-600 rounded-full w-full transition-all duration-300"></div>
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