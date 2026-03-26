'use client';

import { useRouter } from "next/navigation";
import React from 'react';
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <>

      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col items-center justify-center p-4">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-lg font-medium text-center mb-6">
          Thank you for ordering
        </h2>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => router.push('/profile/orders')}
            className="w-full py-3 bg-white border border-gray-300 rounded-lg font-medium"
          >
            Go to Your Orders
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#375421] text-white rounded-lg font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default OrderSuccess;