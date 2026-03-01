'use client';

import React from "react";
import Script from "next/script";

const RazorpayPayment = () => {
  const handlePayment = async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 50000,
      currency: "INR",
      name: "Bio-tech Maali",
      description: "Transaction",
      image: "/Gidan_logo.webp",
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_key}_id}`);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div>
      {/* Load Razorpay only on the payment page, not globally */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button onClick={handlePayment} className="bg-bio-green text-white px-4 py-2 rounded">
        Proceed To Payment
      </button>
    </div>
  );
};

export default RazorpayPayment;

