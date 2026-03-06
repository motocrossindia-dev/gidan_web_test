'use client';





import React, { useEffect, useState } from "react";
import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
import __gift22 from "../../../Assets/Gift/Gift card 1.webp";
const _gift22 = typeof __gift22 === 'string' ? __gift22 : __gift22?.src || __gift22;
const gift22 = typeof _gift22 === 'string' ? _gift22 : _gift22?.src || _gift22;

const TrackOrder = () => {
  const [giftId, setGiftId] = useState("");

  
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center  min-h-screen mx-10 bg-white font-sans">
      <main className="w-min-full bg-white p-8 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Enter Gift Card Number
        </h1>

        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <img name=" "     
            src={gift22}
            alt="Order Tracking"
            className="w-80 h-80 object-contain"
            loading="lazy"
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order ID Input */}
          <div>
            <label
              htmlFor="giftId"
              className="block text-md font-medium text-gray-700 text-center mb-2"
            >
              Order ID
            </label>
            <div className="flex justify-center">
              <input
                id="giftId"
                type="text"
                value={giftId}
                onChange={(e) => setGiftId(e.target.value)}
                placeholder="Enter your order ID"
                className="w-[400px] h-[48px] p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-bio-green"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[400px] h-[48px] py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300"
            >
             Apply
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default TrackOrder;
