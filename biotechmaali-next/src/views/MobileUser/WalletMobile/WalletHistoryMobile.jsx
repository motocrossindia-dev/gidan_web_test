'use client';

import React from "react";
import { isMobile } from "react-device-detect";
import { FaArrowLeft, FaSearch, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WalletHistory = () => {
  const navigate = useNavigate();

  // Sample transaction data
  const transactions = [
    { id: 1, name: "Promotional Reward Added on Registration", amount: "₹500.00", type: "credit" },
    { id: 2, name: "Hanif (Referral)", amount: "₹500.00", type: "credit" },
    { id: 3, name: "Ikhlas", amount: "₹500.00", type: "credit" },
    { id: 4, name: "Topup", amount: "₹500.00", type: "credit" },
    { id: 5, name: "Lily Plant", amount: "₹500.00", type: "debit" },
    { id: 6, name: "Topup", amount: "₹500.00", type: "credit" },
    { id: 7, name: "Topup", amount: "₹500.00", type: "credit" },
    { id: 8, name: "Topup", amount: "₹500.00", type: "credit" },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Wallet History</h1>
        <div className="flex space-x-3">
          <FaSearch className="text-gray-700 text-xl" />
          <FaBell className="text-gray-700 text-xl" />
        </div>
      </div>

      {/* Transactions */}
      <div className="p-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-3 bg-white shadow-sm rounded-md mb-3"
          >
            <p className="text-gray-700">{transaction.name}</p>
            <p className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletHistory;
