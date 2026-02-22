'use client';

// import React, { useEffect, useState } from "react";
// import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
// import location from "../../../Assets/21bd1d1e8c39ab293b04937cb183ed2d3481b3b4 (1).gif";
// import {Helmet} from "react-helmet-async";

// const TrackOrder = () => {
//   const { isDesktop } = useDeviceDetect();
//   const [orderId, setOrderId] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);


//   useEffect(() => {
//     window.scrollTo(0, 0); // Scroll to the top
//   }, []);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitted(true); // Set state to show the tracking details
//   };

//   return (
//       <>
//         <Helmet>
//           <title>Gidan - Track Order Page</title>
//         </Helmet>
//     <div className="flex justify-center items-center min-h-screen mx-10 bg-white font-sans">
//       {!isSubmitted ? (
//         <main className="w-min-full bg-white p-8 rounded-lg shadow-lg">
//           {/* Header */}
//           <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
//             Track your Order
//           </h1>

//           {/* Illustration */}
//           <div className="flex justify-center mb-8">
//             <img name=" "   
//               src={location}
//               alt="Order Tracking"
//               loading="lazy"
//               className="w-80 h-80 object-contain"
//             />
//           </div>


//           {/* Form Section */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Order ID Input */}
//             <div>
//               <label
//                 htmlFor="orderId"
//                 className="block text-md font-medium text-gray-700 text-center mb-2"
//               >
//                 Order ID
//               </label>
//               <div className="flex justify-center">
//                 <input
//                   id="orderId"
//                   type="text"
//                   value={orderId}
//                   onChange={(e) => setOrderId(e.target.value)}
//                   placeholder="Enter your order ID"
//                   className="w-[400px] h-[48px] p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="w-[400px] h-[48px] py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300"
//               >
//                 SUBMIT
//               </button>
//             </div>
//           </form>
//         </main>
//       ) : (
//         <main className="w-full bg-white p-8 mb-20 ">
//           {/* Order Tracking Section */}
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             Order ID: {orderId}
//           </h2>

//           {/* Action Buttons */}
//           <div className="flex justify-between mb-8">
//             <button className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-md text-sm font-semibold">
//               Invoice
//             </button>
//             <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold">
//               Track order
//             </button>
//           </div>

//           {/* Order Status Timeline */}
//           <div className="flex items-center justify-between">
//             <div className="text-center">
//               <div className="text-green-600 font-semibold">Order Confirmed</div>
//               <div className="text-gray-500">Wed, 11th Jan</div>
//             </div>
//             <div className="text-center">
//               <div className="text-gray-400 font-semibold">Shipped</div>
//               <div className="text-gray-500">Wed, 11th Jan</div>
//             </div>
//             <div className="text-center">
//               <div className="text-gray-400 font-semibold">Out for Delivery</div>
//               <div className="text-gray-500">Wed, 11th Jan</div>
//             </div>
//             <div className="text-center">
//               <div className="text-gray-400 font-semibold">Delivered</div>
//               <div className="text-gray-500">Expected by, Mon 16th</div>
//             </div>
//           </div>

//           {/* Timeline Bar */}
//           <div className="flex justify-between items-center mt-4">
//             <div className="bg-green-600 w-2.5 h-2.5 rounded-full"></div>
//             <div className="bg-gray-400 w-1/3 h-0.5"></div>
//             <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
//             <div className="bg-gray-400 w-1/3 h-0.5"></div>
//             <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
//             <div className="bg-gray-400 w-1/3 h-0.5"></div>
//             <div className="bg-gray-400 w-2.5 h-2.5 rounded-full"></div>
//           </div>
//         </main>
//       )}
//     </div>



//         </>
//   );
// };

// export default TrackOrder;


import React, { useEffect, useState } from "react";
import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
import __location from "../../../Assets/21bd1d1e8c39ab293b04937cb183ed2d3481b3b4 (1).webp";
const _location = typeof __location === 'string' ? __location : __location?.src || __location;
const location = typeof _location === 'string' ? _location : _location?.src || _location;
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";

const TrackOrder = () => {
  const { isDesktop } = useDeviceDetect();
  const [orderId, setOrderId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Token handling
  const accessToken = useSelector(selectAccessToken);
  const [localToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const token = accessToken || localToken;

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://backend.gidan.store/tracking/shipway/order/${orderId}/`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.data?.tracking_updates) {
        setTrackingUpdates(res.data.data.tracking_updates);
      } else {
        setTrackingUpdates([]);
      }
    } catch (err) {
      setError("Failed to fetch order details. Please check Order ID.");
      setTrackingUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gidan - Track Order Page</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Track your Gidan order easily and stay updated on delivery status. Enter your details to view real-time order tracking and updates."
        />

        <link
          rel="canonical"
          href="https://www.gidan.store/profile/trackorder"
        />
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
              <img
                src={location}
                alt="Order Tracking"
                loading="lazy"
                className="w-80 h-80 object-contain"
              />
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
          <main className="w-full bg-white p-8 mb-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order ID: {orderId}
            </h2>

            <div className="flex justify-between mb-8">
              <button className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-md text-sm font-semibold">
                Invoice
              </button>
              <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold">
                Track order
              </button>
            </div>

            {/* Loading / Error */}
            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Dynamic Order Status Timeline */}
            <div className="flex justify-between items-start">
              {trackingUpdates.length > 0 ? (
                trackingUpdates.map((update, index) => (
                  <div key={index} className="text-center w-1/4">
                    <div
                      className={`font-semibold ${index === trackingUpdates.length - 1
                          ? "text-green-600"
                          : "text-gray-400"
                        }`}
                    >
                      {update.status}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(update.timestamp).toLocaleString()}
                    </div>
                    {update.notes && (
                      <div className="text-xs text-gray-400 mt-1">
                        {update.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tracking updates found.</p>
              )}
            </div>
          </main>
        )}
      </div>
    </>
  );
};

export default TrackOrder;



