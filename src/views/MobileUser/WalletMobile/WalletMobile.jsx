import React from "react";
import { isMobile } from "react-device-detect";
import { FaArrowLeft } from "react-icons/fa";

const WalletMobile = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => window.history.back()} className="mr-3">
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Wallet</h1>
      </div>

      {/* Wallet Balance */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4 text-center">
        <h2 className="text-gray-600">Total Wallet Balance</h2>
        <p className="text-green-600 text-2xl font-bold">₹0</p>
      </div>

      {/* Top-Up Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-gray-700 mb-2">Top Up Wallet</h2>
        <input
          type="text"
          placeholder="₹1000"
          className="w-full p-2 border rounded-md outline-none text-gray-700"
        />
        <div className="flex justify-between mt-2">
          <button className="bg-gray-200 text-gray-700 py-1 px-4 rounded">₹100</button>
          <button className="bg-gray-200 text-gray-700 py-1 px-4 rounded">₹500</button>
          <button className="bg-gray-200 text-gray-700 py-1 px-4 rounded">₹1000</button>
        </div>
        <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md text-lg font-semibold">
          Proceed To Top-up
        </button>
      </div>

      {/* Wallet Transactions */}
      <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md text-lg font-semibold">
        Wallet Transactions History
      </button>

      {/* Rewards Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-gray-700">Bitcoin Mash Rewards</h2>
          <p className="text-green-600 font-bold">₹500</p>
        </div>
        <p className="text-gray-500 text-sm">25% Cashback on Card Value</p>
      </div>

      {/* FAQs Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-gray-700 font-semibold">FAQs</h2>
        <p className="text-gray-500 text-sm mt-2">How to use the Pocketly Wallet?</p>
        <p className="text-gray-500 text-sm">How to redeem rewards?</p>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-gray-700 font-semibold">Terms & Conditions</h2>
        <p className="text-gray-500 text-sm mt-2">
          1. Cashback is applicable only on certain purchases.
        </p>
        <p className="text-gray-500 text-sm">
          2. Wallet top-up is non-refundable.
        </p>
      </div>
    </div>
  );
};

export default WalletMobile;
