'use client';

import React from "react";
import { isMobile } from "react-device-detect";
import { FaArrowLeft } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    title: "Peace Lily Plant (Roma Pot, ... is waiting to be yours.",
    price: "₹499.00",
    date: "21 Aug 2024",
    image: "https://via.placeholder.com/80", // Replace with actual image URL
  },
  {
    id: 2,
    title: "Peace Lily Plant (Roma Pot, ... is waiting to be yours.",
    price: "₹499.00",
    date: "21 Aug 2024",
    image: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    title: "Peace Lily Plant (Roma Pot, ... is waiting to be yours.",
    price: "₹499.00",
    date: "21 Aug 2024",
    image: "https://via.placeholder.com/80",
  },
];

const Notifications = () => {
  return (
    <div className="max-w-md mx-auto bg-site-bg min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => window.history.back()} className="mr-3">
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Notifications (15 New)</h1>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex bg-white p-3 rounded-lg shadow-md mb-3">
            <img name=" "    src={item.image}  alt="Plant" className="w-16 h-16 rounded-md" />
            <div className="ml-3 flex-1">
              <p className="text-gray-700 text-sm">{item.title}</p>
              <p className="text-[#375421] font-semibold">{item.price}</p>
              <p className="text-gray-500 text-xs">{item.date}</p>
              <button className="text-[#375421] font-medium text-sm mt-1">
                More Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
