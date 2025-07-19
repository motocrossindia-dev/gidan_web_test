import React, { useEffect, useState } from "react";
import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
import location from "../../../Assets/21bd1d1e8c39ab293b04937cb183ed2d3481b3b4 (1).gif";
import {Helmet} from "react-helmet";

const TrackOrder = () => {
  const { isDesktop } = useDeviceDetect();
  const [orderId, setOrderId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Set state to show the tracking details
  };

  return (
      <>
        <Helmet>
          <title>Biotech Maali - Track Order Page</title>
        </Helmet>
    <div className="flex justify-center items-center min-h-screen mx-10 bg-white font-sans">
      {!isSubmitted ? (
        <main className="w-min-full bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Track your Order
          </h1>

          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <img name=" "   
              src={location}
              alt="Order Tracking"
              loading="lazy"
              className="w-80 h-80 object-contain"
            />
          </div>
          

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order ID Input */}
            <div>
              <label
                htmlFor="orderId"
                className="block text-md font-medium text-gray-700 text-center mb-2"
              >
                Order ID
              </label>
              <div className="flex justify-center">
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-[400px] h-[48px] p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                SUBMIT
              </button>
            </div>
          </form>
        </main>
      ) : (
        <main className="w-full bg-white p-8 mb-20 ">
          {/* Order Tracking Section */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order ID: {orderId}
          </h2>

          {/* Action Buttons */}
          <div className="flex justify-between mb-8">
            <button className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-md text-sm font-semibold">
              Invoice
            </button>
            <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold">
              Track order
            </button>
          </div>

          {/* Order Status Timeline */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-green-600 font-semibold">Order Confirmed</div>
              <div className="text-gray-500">Wed, 11th Jan</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-semibold">Shipped</div>
              <div className="text-gray-500">Wed, 11th Jan</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-semibold">Out for Delivery</div>
              <div className="text-gray-500">Wed, 11th Jan</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 font-semibold">Delivered</div>
              <div className="text-gray-500">Expected by, Mon 16th</div>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="flex justify-between items-center mt-4">
            <div className="bg-green-600 w-2.5 h-2.5 rounded-full"></div>
            <div className="bg-gray-400 w-1/3 h-0.5"></div>
            <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
            <div className="bg-gray-400 w-1/3 h-0.5"></div>
            <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
            <div className="bg-gray-400 w-1/3 h-0.5"></div>
            <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
          </div>
        </main>
      )}
    </div>
        </>
  );
};

export default TrackOrder;

