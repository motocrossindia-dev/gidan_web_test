import { useNavigate } from "react-router-dom";
import { useState } from "react";
import location1 from "../../../Assets/Location tracking 1.png";
import { FaArrowLeft } from "react-icons/fa";
// import Header from '../../../Components/Header/Header';
// import Navigation from '../../../Components/NavigationBar/NavigationBar';

const TrackOrderMobile = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("");

  const handleBackClick = () => {
    navigate("/mobilesidebar"); // Navigate to MobileSidebar
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
    </>
  );
};

export default TrackOrderMobile;
