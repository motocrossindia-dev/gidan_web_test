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
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import Breadcrumb from "../../../components/Shared/Breadcrumb";

const STEPS = [
  { key: 'PROCESSING',       label: 'Processing' },
  { key: 'ORDER_CONFIRMED',  label: 'Order Confirmed' },
  { key: 'ON_THE_WAY',       label: 'On The Way' },
  { key: 'DELIVERED',        label: 'Delivered' },
];

const TrackOrder = () => {
  const router = useRouter();
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
    const trimmedOrderId = orderId.trim();
    setOrderId(trimmedOrderId);
    setIsSubmitted(true);
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/orderDetailHistory/${trimmedOrderId}/`,//tracking/shipway/order/
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
      <div className="flex flex-col md:hidden bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-gray-100">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center text-[#375421] text-xs font-black uppercase tracking-tight"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Profile
          </button>
          <div className="flex items-center gap-4 text-[10px] font-black text-[#375421] uppercase tracking-widest">
             <button className="hover:underline">Support</button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Track Journey</h1>
        </div>
      </div>

      <div className="mt-0 md:hidden text-xs sm:text-sm">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="Track Order" 
        />
      </div>

      <div className="flex justify-center items-start min-h-screen p-4 md:py-8 lg:py-12 bg-site-bg">
        {!isSubmitted ? (
          <main className="w-full max-w-xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-12 rounded-[32px] border border-gray-100 flex flex-col items-center">
            <div className="text-center mb-10 w-full">
              <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em] mb-3 block">Order Protocol</span>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">
                Botanical <span className="text-[#375421] italic">Journey</span>
              </h1>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest max-w-[320px] mx-auto leading-relaxed">
                Follow your plant's journey from our nursery to your doorstep.
              </p>
            </div>

            <div className="relative mb-12 group">
              <div className="absolute -inset-4 bg-[#375421]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                src={location}
                alt="Order Tracking"
                loading="lazy"
                className="w-56 h-56 object-contain relative z-10"
              />
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="relative">
                <label htmlFor="orderId" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 block text-center">
                  Unique Order Identification
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="GID-XXXX-XXXX"
                  className="w-full h-[60px] bg-gray-50/50 border border-transparent px-6 rounded-2xl text-base font-black text-gray-900 text-center tracking-widest uppercase transition-all focus:outline-none focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-50"
                  required
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-full h-[60px] bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#375421] transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                >
                  Locate Shipment
                </button>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Check your email for the Order ID</p>
                   <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </form>
          </main>
        ) : (
          <main className="w-full max-w-4xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-12 rounded-[32px] border border-gray-100 mb-20">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 pb-8 border-b border-gray-50">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em] mb-2">Shipment details</span>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  Order ID: <span className="text-[#375421] italic">{orderId}</span>
                </h2>
              </div>
              <button
                onClick={() => { setIsSubmitted(false); setOrderData(null); setError(""); }}
                className="px-6 py-3 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                Search again
              </button>
            </div>

            {/* Loading / Error */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Locating Shipment...</p>
              </div>
            )}
            {error && (
               <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center text-center">
                  <p className="text-red-600 text-[11px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                  <button onClick={() => setIsSubmitted(false)} className="mt-4 text-[10px] font-black text-red-600 uppercase tracking-widest underline">Adjust ID</button>
               </div>
            )}

            {/* Order details content */}
            {!loading && orderData && (
              <div className="space-y-12">
                {/* Phase Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-site-bg/50 p-8 rounded-[32px] border border-[#375421]/10 shadow-sm">
                      <span className="text-[9px] font-black text-[#375421] uppercase tracking-[0.3em] mb-4 block">Current Status</span>
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[#375421] flex items-center justify-center text-white shadow-lg shadow-[#375421]/20">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                         </div>
                         <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight break-words">{orderData.current_status_display || orderData.current_status}</h3>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 leading-relaxed">Your order is currently moving through Phase {currentStepIndex + 1} of our botanical protocol.</p>
                   </div>

                   <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 block">Carrier Linkage</span>
                      {orderData.tracking_id ? (
                        <div className="space-y-4">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identification</span>
                              <span className="text-lg font-black text-gray-900 uppercase tracking-tight">{orderData.tracking_id}</span>
                           </div>
                           {orderData.delivery_tracking_link && (
                             <a
                               href={orderData.delivery_tracking_link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 text-[10px] font-black text-[#375421] uppercase tracking-widest underline hover:text-black transition-colors"
                             >
                               Track via Carrier Site
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                             </a>
                           )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">Tracking ID will appear once dispatched.</p>
                      )}
                   </div>
                </div>

                {/* Stepper Redesign */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em]">Delivery Milestones</h3>
                     <div className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest">Real-time sync</div>
                  </div>
                  
                  <div className="relative flex justify-between items-start">
                    {/* Background track */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0 mx-[12.5%]" />

                    {/* Active track */}
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-[#375421] z-0 transition-all duration-700 ease-in-out mx-[12.5%]"
                      style={{ width: `calc(${progressPct} * 0.75)` }}
                    />

                    {STEPS.map((step, index) => {
                      const isActive   = index <= currentStepIndex;
                      const isCurrent  = index === currentStepIndex;
                      const ts         = getTimestamp(step.key);

                      return (
                        <div key={step.key} className="flex flex-col items-center z-10 w-1/4">
                          {/* Dot Redesign */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500
                            ${isActive
                              ? 'bg-[#375421] border-[#375421]/20 shadow-lg shadow-[#375421]/20 text-white'
                              : 'bg-white border-gray-100 text-gray-200 shadow-sm'}
                            ${isCurrent ? 'ring-4 ring-[#375421]/10 scale-110' : ''}
                          `}>
                            {isActive ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-[10px] font-black">{index + 1}</span>
                            )}
                          </div>

                          {/* Label + timestamp */}
                          <div className="mt-5 text-center w-full px-2">
                            <p className={`text-[10px] font-black uppercase tracking-tight
                              ${isCurrent ? 'text-gray-900' : isActive ? 'text-gray-600' : 'text-gray-300'}
                            `}>
                              {step.label}
                            </p>
                            {ts && (
                              <p className="text-[8px] text-[#375421] font-black uppercase tracking-widest mt-1.5 opacity-60 leading-none">{ts}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* History Log */}
                {orderData.status_history?.length > 0 && (
                  <div className="pt-12 border-t border-gray-50">
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8">Journey Log</h3>
                    <div className="space-y-6 max-w-2xl mx-auto">
                      {orderData.status_history.map((entry, idx) => (
                        <div key={entry.id} className="flex items-start gap-5 group">
                          <div className="flex flex-col items-center">
                             <div className={`w-3 h-3 rounded-full mt-1.5 transition-all duration-300 ${idx === 0 ? 'bg-[#375421] scale-125 shadow-lg shadow-[#375421]/20' : 'bg-gray-200'}`} />
                             {idx !== orderData.status_history.length - 1 && <div className="w-0.5 flex-1 bg-gray-50 min-h-[40px]" />}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                               <p className={`text-sm font-black uppercase tracking-tight ${idx === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{entry.status_display || entry.status}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(entry.timestamp).toLocaleString('en-IN', {
                                 day: '2-digit', month: 'short', year: 'numeric',
                                 hour: '2-digit', minute: '2-digit',
                               })}</p>
                            </div>
                            {entry.notes && <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest border-l-2 border-gray-50 pl-4 py-1 italic">{entry.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
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
