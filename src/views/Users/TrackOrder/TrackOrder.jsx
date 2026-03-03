'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
import __location from "../../../Assets/21bd1d1e8c39ab293b04937cb183ed2d3481b3b4 (1).webp";
const _location = typeof __location === 'string' ? __location : __location?.src || __location;
const location = typeof _location === 'string' ? _location : _location?.src || _location;
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";

const STEPS = [
  { key: 'PROCESSING',       label: 'Processing' },
  { key: 'ORDER_CONFIRMED',  label: 'Order Confirmed' },
  { key: 'ON_THE_WAY',       label: 'On The Way' },
  { key: 'DELIVERED',        label: 'Delivered' },
];

const TrackOrder = () => {
  const { isDesktop } = useDeviceDetect();
  const [orderId, setOrderId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accessToken = useSelector(selectAccessToken);
  const [localToken] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const token = accessToken || localToken;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://backend.gidan.store/order/orderDetailHistory/${orderId}/`,//tracking/shipway/order/
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.data?.data) {
        setOrderData(res.data.data);
      } else {
        setOrderData(null);
        setError("No order data found.");
      }
    } catch (err) {
      setError("Failed to fetch order details. Please check Order ID.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = orderData?.current_status || '';
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStatus);
  const progressPct = currentStepIndex >= 0
    ? `${Math.round(((currentStepIndex) / (STEPS.length - 1)) * 100)}%`
    : '0%';

  // Find the timestamp for each step from status_history
  const getTimestamp = (stepKey) => {
    const entry = orderData?.status_history?.find(h => h.status === stepKey);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <>
      <Link href="/profile" className="flex md:hidden items-center gap-2 px-4 pt-4 pb-1 text-bio-green font-medium">
        ← Back to Profile
      </Link>

      <div className="flex justify-center items-start min-h-screen mx-4 md:mx-10 bg-white font-sans">
        {!isSubmitted ? (
          <main className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Track your Order
            </h1>
            <div className="flex justify-center mb-8">
              <img
                src={location}
                alt="Order Tracking"
                loading="lazy"
                className="w-80 h-80 object-contain"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-md font-medium text-gray-700 text-center mb-2">
                  Order ID
                </label>
                <div className="flex justify-center">
                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter your order ID"
                    className="w-full max-w-[400px] h-[48px] p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full max-w-[400px] h-[48px] py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </main>
        ) : (
          <main className="w-full bg-white p-4 md:p-8 mb-20">

            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Order ID: <span className="text-green-700">{orderId}</span>
              </h2>
              <button
                onClick={() => { setIsSubmitted(false); setOrderData(null); setError(""); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Search again
              </button>
            </div>

            {/* Loading / Error */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Order details card */}
            {!loading && orderData && (
              <div className="border rounded-xl bg-white shadow-sm p-5 md:p-6 space-y-6">

                {/* Current status badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {orderData.current_status_display || orderData.current_status}
                  </span>
                </div>

                {/* Tracking ID / link */}
                {orderData.tracking_id && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Tracking ID:</span>{' '}
                    {orderData.delivery_tracking_link ? (
                      <a
                        href={orderData.delivery_tracking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {orderData.tracking_id}
                      </a>
                    ) : (
                      <span>{orderData.tracking_id}</span>
                    )}
                  </div>
                )}

                {/* Stepper */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Delivery Status</h3>
                  <div className="relative flex justify-between items-start">

                    {/* Background track */}
                    <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-gray-200 z-0" />

                    {/* Active track */}
                    <div
                      className="absolute top-4 left-[12.5%] h-1 bg-green-500 z-0 transition-all duration-500"
                      style={{ width: `calc(${progressPct} * 0.75)` }}
                    />

                    {STEPS.map((step, index) => {
                      const isActive   = index <= currentStepIndex;
                      const isCurrent  = index === currentStepIndex;
                      const ts         = getTimestamp(step.key);

                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 w-1/4">
                          {/* Dot */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all
                            ${isActive
                              ? 'bg-green-500 border-green-200 text-white'
                              : 'bg-white border-gray-300 text-gray-300'}
                          `}>
                            {isActive ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>

                          {/* Label + timestamp */}
                          <div className="mt-2 text-center w-full px-0.5">
                            <p className={`text-[10px] font-bold leading-tight break-words
                              ${isCurrent ? 'text-green-700' : isActive ? 'text-gray-800' : 'text-gray-400'}
                            `}>
                              {step.label}
                            </p>
                            {ts && (
                              <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{ts}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status history log */}
                {orderData.status_history?.length > 0 && (
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Status History</h3>
                    <ul className="space-y-3">
                      {orderData.status_history.map((entry) => (
                        <li key={entry.id} className="flex items-start gap-3 text-sm">
                          <span className="mt-0.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                          <div>
                            <p className="font-medium text-gray-800">{entry.status_display || entry.status}</p>
                            <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}</p>
                            {entry.notes && <p className="text-xs text-gray-400 mt-0.5">{entry.notes}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </main>
        )}
      </div>
    </>
  );
};

export default TrackOrder;
