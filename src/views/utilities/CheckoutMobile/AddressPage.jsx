'use client';

import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const AddressPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b">
        <FaArrowLeft className="text-lg cursor-pointer" />
        <h2 className="ml-2 text-lg font-semibold">Address</h2>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 flex items-center justify-center border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded-full">
              ✓
            </div>
            <span className="ml-2 text-sm text-gray-700 font-medium">
              Address
            </span>
          </div>
          <div className="w-16 h-1 bg-blue-500" />
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-blue-500 flex items-center justify-center rounded-full text-blue-500">
              2
            </div>
            <span className="ml-2 text-sm text-gray-700 font-medium">
              Order Summary
            </span>
          </div>
          <div className="w-16 h-1 bg-gray-300" />
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-gray-400 flex items-center justify-center rounded-full text-gray-400">
              3
            </div>
            <span className="ml-2 text-sm text-gray-500">Payment</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AddressPage;
