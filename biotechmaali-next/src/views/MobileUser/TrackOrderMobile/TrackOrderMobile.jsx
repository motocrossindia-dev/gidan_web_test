'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import __location1 from "../../../Assets/Location tracking 1.webp";
const _location1 = typeof __location1 === 'string' ? __location1 : __location1?.src || __location1;
const location1 = typeof _location1 === 'string' ? _location1 : _location1?.src || _location1;
import { FaArrowLeft } from "react-icons/fa";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";
// import Header from '../../../components/Header/Header';
// import Navigation from '../../../components/NavigationBar/NavigationBar';

const TrackOrderMobile = () => {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");

  const handleBackClick = () => {
    router.push("/mobilesidebar"); // Navigate to MobileSidebar
  };

  return (
    <>
          {/* <Header />
        <Navigation/> */}
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {/* Back Button and Heading - Positioned at the top */}
      <div className="absolute top-4 left-4 flex items-center">
        <button onClick={handleBackClick} className="mr-3">
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h2 className="text-lg font-semibold">Track Order</h2>
      </div>

      {/* Illustration */}
      <div className="mt-16 flex flex-col items-center">
        <img name=" "    src={location1}  alt="Track Order" className="w-full h-auto mb-6" />

        {/* Input Field */}
        <div className="w-full max-w-md">
          <label className="block text-blue-700 text-sm font-semibold mb-1">
            Order ID/Tracking Number
          </label>
          <input
            type="text"
            placeholder="Enter order ID or Tracking Number"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          {/* Track Button */}
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Track
          </button>
        </div>
      </div>
    </div>
      <HomepageSchema/>
      <StoreSchema/>
    </>
  );
};

export default TrackOrderMobile;
