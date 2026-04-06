'use client';




import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Filter,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package2,
  Check,
  ChevronLeft
} from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';
import Breadcrumb from '../../../components/Shared/Breadcrumb';
import PeopleAlsoBought from '../../../components/Shared/PeopleAlsoBought';
import WriteAReview from '../ProductData/WriteAReview';
// Using your actual data structure


const MyOrders = () => {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeReviewOrder, setActiveReviewOrder] = useState(null);


  const [statusFilters, setStatusFilters] = useState({
    'PROCESSING': true,
    'ORDER_CONFIRMED': true,
    'DELIVERED': true,
    'CANCELLED': true,
    'RETURNED': true,
    'ON_THE_WAY': true,
  });


  const getMyOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/order/orderHistory/`);

      if (response.status === 200) {
        setAllOrders(response?.data?.data?.orders);
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again later.";
      if (error.response) {
        errorMessage =
          error.response.data.message || `Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders()
  }, [])
  const [timeFilters, setTimeFilters] = useState({
    'Last 30 Days': true,
    '2026': true,
    '2025': true,
    '2024': true,
    '2023': true,
  });

  // Check for mobile / tablet viewport
  useEffect(() => {
    const checkViewport = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    setMounted(true);

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handleOrderClick = (order) => {
    router.push(`/profile/orders/postsummary/${order.order_id}`);
  };



  const handleReset = () => {
    setStatusFilters({
      'PROCESSING': true,
      'ORDER_CONFIRMED': true,
      'DELIVERED': true,
      'CANCELLED': true,
      'RETURNED': true,
      'ON_THE_WAY': true,
    });
    setTimeFilters({
      'Last 30 Days': true,
      '2026': true,
      '2025': true,
      '2024': true,
      '2023': true,
    });
  };

  const isWithinLast30Days = (dateString) => {
    const orderDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  };

  const getOrderYear = (dateString) => {
    return new Date(dateString).getFullYear().toString();
  };

  const filteredOrders = allOrders?.filter((order) => {
    // Status matching - normalize underscores and casing
    const currentStatus = order.status?.toUpperCase().replace(/\s+/g, '_');
    const statusMatch = statusFilters[currentStatus] ?? true;

    // Time matching logic
    const orderDate = new Date(order.order_date || order.date || Date.now());
    const orderYear = orderDate.getFullYear().toString();
    
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isWithin30 = diffDays <= 30;

    const timeMatch =
      (timeFilters['Last 30 Days'] && isWithin30) ||
      (timeFilters['2026'] && orderYear === '2026') ||
      (timeFilters['2025'] && orderYear === '2025') ||
      (timeFilters['2024'] && orderYear === '2024') ||
      (timeFilters['2023'] && orderYear === '2023');

    return statusMatch && timeMatch;
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CANCELLED':
        return 'text-red-700 bg-red-100/50 border-red-200';
      case 'DELIVERED':
        return 'text-[#375421] bg-green-100/50 border-green-200';
      case 'RETURNED':
        return 'text-bio-green bg-green-100/50 border-green-200';
      case 'PROCESSING':
        return 'text-orange-700 bg-orange-100/50 border-orange-200';
      case 'ON_THE_WAY':
        return 'text-indigo-700 bg-indigo-100/50 border-indigo-200';
      case 'ORDER_CONFIRMED':
        return 'text-emerald-700 bg-emerald-100/50 border-emerald-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      case 'ON_THE_WAY':
        return <Truck className="w-4 h-4" />;
      case 'PROCESSING':
        return <Clock className="w-4 h-4" />;
      case 'RETURNED':
        return <Package2 className="w-4 h-4" />;
      case 'ORDER_CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const MobileOrderCard = ({ order }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
      e.stopPropagation(); // prevent triggering handleOrderClick
      navigator.clipboard.writeText(order?.order_id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
      });
    };
    return (
      <div
        className="bg-white rounded-[24px] shadow-sm border border-gray-100 mb-5 overflow-hidden transition-all active:scale-[0.98] cursor-pointer"
        onClick={() => handleOrderClick(order)}
      >
        <div className="p-4 flex items-center justify-between bg-gray-50/50 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-full ${getStatusColor(order?.status).split(' ')[1]}`}>
              {getStatusIcon(order?.status)}
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order?.status)}`}>
              {order?.status.replace(/_/g, ' ')}
            </span>
          </div>
          <span
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
            onClick={handleCopy}
          >
            {copied ? "COPIED" : `#${order?.order_id}`}
          </span>
        </div>

        <div className="p-4 flex gap-4">
          <div className="w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-site-bg border border-gray-100 p-1">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
              loading="lazy"
              alt={order?.product_details?.product_name || "Order Product"}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">
                {formatDate(order?.date)}
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                {order?.product_details?.product_name}
              </h3>
            </div>
            <div className="flex justify-between items-end mt-2">
              <div>
                <span className="text-lg font-black text-gray-900 leading-none">₹{Math.round(order?.grand_total).toLocaleString()}</span>
                {order?.total_discount > 0 && (
                  <div className="text-[9px] bg-green-50 text-[#375421] px-1.5 py-0.5 rounded font-black uppercase tracking-wider inline-block mt-1">
                    Saved ₹{Math.round(order?.total_discount || 0).toLocaleString()}
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{order?.delivery_option}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DesktopOrderCard = ({ order }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
      e.stopPropagation(); // prevent triggering handleOrderClick
      navigator.clipboard.writeText(order?.order_id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
      });
    };

    return (
      <div
        className="bg-white rounded-[32px] overflow-hidden cursor-pointer border border-transparent hover:border-[#375421]/10 hover:shadow-[0_20px_50px_-15px_rgba(55,84,33,0.1)] transition-all duration-500 group mb-6"
        onClick={() => handleOrderClick(order)}
      >
        <div className="px-8 py-5 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order?.status)} shadow-sm`}>
                  {order?.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] font-bold text-gray-400 ml-4">{formatDate(order?.date)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order ID</span>
             <span
               className="text-[11px] font-black text-gray-900 group-hover:text-[#375421] transition-colors"
               onClick={handleCopy}
             >
               {copied ? "COPIED" : `#${order?.order_id}`}
             </span>
          </div>
        </div>

        <div className="px-8 py-6 flex items-center gap-8">
          <div className="w-24 h-28 rounded-3xl overflow-hidden flex-shrink-0 bg-site-bg p-2 border border-gray-100 group-hover:scale-105 transition-transform duration-700">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
              loading="lazy"
              alt={order?.product_details?.product_name || "Order Image"}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '';
              }}
            />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div className="max-w-md">
              <span className="text-[9px] font-black text-[#375421] uppercase tracking-[0.2em] mb-2 block">Premium Collection</span>
              <h3 className="text-xl font-bold text-gray-900 group-hover:underline underline-offset-4 decoration-1 decoration-[#375421]/20 transition-all">
                {order?.product_details?.product_name}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Delivery: <span className="text-gray-900">{order?.delivery_option}</span></p>
            </div>
            
            <div className="text-right">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-gray-900">₹{Math.round(order?.grand_total).toLocaleString()}</span>
                {order?.total_discount > 0 && (
                  <div className="text-[10px] text-[#375421] font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg mt-1">
                    Saved ₹{Math.round(order?.total_discount).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#375421] group-hover:text-[#375421] transition-all">
             <ChevronLeft className="w-5 h-5 rotate-180" />
          </div>
        </div>
      </div>
    );
  };

  const CustomCheckbox = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-2xl transition-all duration-300 group hover:bg-gray-50 active:scale-[0.98]">
      <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${checked ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-10 h-6 rounded-full transition-all duration-500 flex items-center px-1 ${checked
          ? 'bg-[#375421]'
          : 'bg-gray-200'
          }`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-500 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>
    </label>
  );

  const FilterSidebar = () => {
    const isOverlay = isMobile || isTablet;

    const filteredOrders = allOrders.filter(order => {
      // Status filtering
      const statusMatched = statusFilters[order.status?.toUpperCase().replace(/\s/g, '_')] ?? true;

      // Time filtering logic
      let timeMatched = false;
      const orderDate = new Date(order.order_date || Date.now());
      const now = new Date();
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilters['Last 30 Days'] && diffDays <= 30) timeMatched = true;
      if (timeFilters[orderDate.getFullYear().toString()]) timeMatched = true;

      return statusMatched && timeMatched;
    });

    const StatusTile = ({ status, checked, onChange }) => {
      const getIcon = () => {
        switch (status) {
          case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
          case 'PROCESSING': return <Clock className="w-4 h-4" />;
          case 'CANCELLED': return <XCircle className="w-4 h-4" />;
          case 'SHIPPED':
          case 'ON_THE_WAY': return <Truck className="w-4 h-4" />;
          case 'RETURNED': return <XCircle className="w-4 h-4" />;
          default: return <Package2 className="w-4 h-4" />;
        }
      };

      const colorClass = 'border-[#375421] text-[#375421] bg-[#375421]/5';

      return (
        <button 
          onClick={onChange}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] border transition-all duration-300 ${
            checked 
              ? `${colorClass} shadow-[0_10px_20px_-10px_#375421]/20 ring-1 ring-[#375421]/30 ring-offset-2 ring-offset-white` 
              : 'border-gray-100 text-gray-400 hover:border-gray-200'
          }`}
        >
          {getIcon()}
          <span className="text-[10px] font-black uppercase tracking-tight leading-none h-4 flex items-center">{status.replace(/_/g, ' ')}</span>
        </button>
      );
    };

    return (
      <>
        {isOverlay && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]" onClick={() => setShowFilters(false)} />
        )}

        <div className={`bg-white p-8 h-fit border border-gray-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-y-auto ${
          !isOverlay 
            ? 'sticky top-4 rounded-[32px] w-full' 
            : 'fixed bottom-0 left-0 right-0 z-[100] rounded-t-[40px] max-h-[85vh] animate-in slide-in-from-bottom duration-500'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 italic">Refine <span className="text-[#375421] font-extrabold not-italic">View</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-0.5 w-8 bg-[#375421] rounded-full"></div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Filter your orders</p>
              </div>
            </div>
            {isOverlay && (
              <button onClick={() => setShowFilters(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="space-y-12">
            {/* Status Section */}
            <div>
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em]">Status Categories</h3>
                  <button onClick={() => setStatusFilters(Object.fromEntries(Object.keys(statusFilters).map(k => [k, true])))} className="text-[9px] font-black text-gray-400 uppercase hover:text-[#375421] transition-colors tracking-widest">Select All</button>
               </div>
               <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                 {Object.entries(statusFilters).map(([status, checked]) => (
                   <StatusTile 
                     key={status} 
                     status={status} 
                     checked={checked} 
                     onChange={() => setStatusFilters(p => ({ ...p, [status]: !p[status] }))}
                   />
                 ))}
               </div>
            </div>

            {/* Time Section */}
            <div>
               <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em] mb-6">Temporal Window</h3>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(timeFilters).map(([time, checked]) => (
                   <button
                     key={time}
                     onClick={() => setTimeFilters(p => ({ ...p, [time]: !p[time] }))}
                     className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-tight transition-all duration-300 border ${
                       checked 
                         ? 'bg-[#375421] text-white border-[#375421] shadow-lg shadow-[#375421]/20' 
                         : 'bg-gray-50 text-gray-400 border-gray-50 hover:border-gray-200 hover:text-gray-600'
                     }`}
                   >
                     {time}
                   </button>
                 ))}
               </div>
            </div>

            {/* Reset Action */}
            <div className="pt-4">
              <button
                onClick={() => {
                   setStatusFilters(Object.fromEntries(Object.keys(statusFilters).map(k => [k, true])));
                   setTimeFilters(Object.fromEntries(Object.keys(timeFilters).map(k => [k, true])));
                }}
                className="w-full py-5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[24px] hover:bg-[#375421] transition-all duration-500 active:scale-[0.98] shadow-xl group border border-gray-100"
              >
                Reset <span className="group-hover:translate-x-1 inline-block transition-transform ml-1">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const content = (
    <div className="flex-1">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders?.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders?.map((order) =>
            isMobile ? (
              <MobileOrderCard key={order?.id} order={order} />
            ) : (
              <DesktopOrderCard key={order?.id} order={order} />
            )
          )}

        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more orders.</p>
        </div>
      )}
    </div>
  );

  if (!mounted) {
    return (
      <div className="bg-site-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="bg-site-bg min-h-screen">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex flex-col border-b">
            <div className="px-4 pt-4 flex items-center justify-between">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center text-[#375421] text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </button>
              <div className="flex items-center gap-4 text-xs font-medium text-[#375421]">
                <button className="hover:underline">Help & Support</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 pt-2">
              <h1 className="text-xl font-bold">My Orders</h1>
              <button aria-label="Toggle filters"
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-50 text-bio-green rounded-lg hover:bg-green-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden xs:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-0 md:hidden">
          <Breadcrumb 
            items={[{ label: 'Profile', path: '/profile' }]} 
            currentPage="My Orders" 
          />
        </div>
        <div className="p-4">
          {content}
        </div>
        <PeopleAlsoBought title="Curated Selection for You" />
        {showFilters && <FilterSidebar />}
      </div>
    );
  }

  // ── Tablet layout (768-1023 px) ────────────────────────────────────
  if (isTablet) {
    return (
      <div className="bg-site-bg min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <button
              aria-label="Toggle filters"
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-bio-green border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          {content}
        </div>
        {showFilters && <FilterSidebar />}
        {activeReviewOrder && (
          <WriteAReview
            isInline={false}
            onClose={() => setActiveReviewOrder(null)}
            onSuccess={() => setActiveReviewOrder(null)}
            productId={activeReviewOrder?.product_details?.id}
            productDetailData={activeReviewOrder?.product_details}
          />
        )}
      </div>
    );
  }

  // ── Desktop layout (≥ 1024 px) ─────────────────────────────────────
  return (
    <>
      <Link href="/profile" className="flex md:hidden items-center gap-2 px-4 pt-4 pb-1 text-bio-green font-medium">
        ← Back to Profile
      </Link>

      <div className="bg-site-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
          </div>

          <div className="flex gap-6">
            <div className="w-72 flex-shrink-0">
              <FilterSidebar />
            </div>
            {content}
          </div>
        </div>
        <PeopleAlsoBought title="Curated Selection for You" />
      </div>
    </>
  );
};

export default MyOrders;
// ===================================odl=============
//
//
//
// import React, { useState, useEffect } from 'react';
// import {
//   ArrowLeft,
//   Package,
//   Filter,
//   X,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Truck,
//   Package2,
//   Check
// } from 'lucide-react';
// import axiosInstance from '../../../Axios/axiosInstance';
// import { enqueueSnackbar } from 'notistack';
//
// // Using your actual data structure
// import OrderModal from "./OrderModal";
// //
// const MyOrders = () => {
//   const [allOrders,setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [orderid, setOrderid] = useState(null);
//
//   const [statusFilters, setStatusFilters] = useState({
//     'PROCESSING': true,
//     'ORDER_CONFIRMED': true,
//     'DELIVERED': true,
//     'CANCELLED': true,
//     'RETURNED': true,
//     'ON_THE_WAY': true,
//   });
//
//
//     const getMyOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(`/order/orderHistory/`);
//
//       if (response.status === 200) {
//         setAllOrders(response?.data?.data?.orders);
//       }
//     } catch (error) {
//       let errorMessage = "Something went wrong. Please try again later.";
//       if (error.response) {
//         errorMessage =
//           error.response.data.message || `Error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = "No response from server. Please check your connection.";
//       } else {
//         errorMessage = error.message;
//       }
//       enqueueSnackbar(errorMessage, { variant: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(()=>{
// getMyOrders()
//   },[])
//   const [timeFilters, setTimeFilters] = useState({
//     'Last 30 Days': true,
//     '2025': true,
//     '2024': true,
//     '2023': true,
//   });
//
//   // Check for mobile viewport
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//
//     // Simulate loading
//     setTimeout(() => setLoading(false), 1000);
//
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);
//
//   const handleOrderClick = async(order) => {
//     try {
//   const response = await axiosInstance.get(`/order/orderHistoryItems/${order?.id}`);
//
//   if (response?.status === 200) {
//     setSelectedOrder(response?.data?.data);
//     setOrderid(order)
//   }
//     } catch (error) {
//       console.log(error)
//     }
//     setIsModalOpen(true);
//   };
//
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };
//
//   const handleReset = () => {
//     setStatusFilters({
//       'PROCESSING': true,
//       'ORDER_CONFIRMED': true,
//       'DELIVERED': true,
//       'CANCELLED': true,
//       'RETURNED': true,
//       'ON_THE_WAY': true,
//     });
//     setTimeFilters({
//       'Last 30 Days': true,
//       '2025': true,
//       '2024': true,
//       '2023': true,
//     });
//   };
//
//   const isWithinLast30Days = (dateString) => {
//     const orderDate = new Date(dateString);
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
//     return orderDate >= thirtyDaysAgo;
//   };
//
//   const getOrderYear = (dateString) => {
//     return new Date(dateString).getFullYear().toString();
//   };
//
//   const filteredOrders = allOrders.filter((order) => {
//     const statusMatch = statusFilters[order.status];
//     const orderYear = getOrderYear(order.date);
//     const isLast30Days = isWithinLast30Days(order.date);
//
//     const timeMatch =
//       (timeFilters['Last 30 Days'] && isLast30Days) ||
//       (timeFilters['2025'] && orderYear === '2025') ||
//       (timeFilters['2024'] && orderYear === '2024') ||
//       (timeFilters['2023'] && orderYear === '2023');
//
//     return statusMatch && timeMatch;
//   });
//
//   const getStatusColor = (status) => {
//     switch (status?.toUpperCase()) {
//       case 'CANCELLED':
//         return 'text-red-600 bg-red-50';
//       case 'DELIVERED':
//         return 'text-[#375421] bg-green-50';
//       case 'RETURNED':
//         return 'text-bio-green bg-green-50';
//       case 'PROCESSING':
//         return 'text-orange-600 bg-orange-50';
//       case 'ON_THE_WAY':
//         return 'text-purple-600 bg-purple-50';
//       case 'ORDER_CONFIRMED':
//         return 'text-yellow-600 bg-yellow-50';
//       default:
//         return 'text-gray-600 bg-site-bg';
//     }
//   };
//
//   const getStatusIcon = (status) => {
//     switch (status?.toUpperCase()) {
//       case 'DELIVERED':
//         return <CheckCircle className="w-4 h-4" />;
//       case 'CANCELLED':
//         return <XCircle className="w-4 h-4" />;
//       case 'ON_THE_WAY':
//         return <Truck className="w-4 h-4" />;
//       case 'PROCESSING':
//         return <Clock className="w-4 h-4" />;
//       case 'RETURNED':
//         return <Package2 className="w-4 h-4" />;
//       case 'ORDER_CONFIRMED':
//         return <CheckCircle className="w-4 h-4" />;
//       default:
//         return <Package className="w-4 h-4" />;
//     }
//   };
//
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };
//
//   const MobileOrderCard = ({ order }) => {
//     const [copied, setCopied] = useState(false);
//
//     const handleCopy = (e) => {
//       e.stopPropagation(); // prevent triggering handleOrderClick
//       navigator.clipboard.writeText(order?.order_id).then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000); // reset after 2s
//       });
//     };
//   return (    <div
//       className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
//       onClick={() => handleOrderClick(order)}
//     >
//       <div className="p-4 border-b border-gray-100">
//         <div className="flex justify-between items-start mb-2">
//           <div className="flex items-center gap-2">
//             {getStatusIcon(order?.status)}
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
//               {order?.status.replace('_', ' ')}
//             </span>
//           </div>
//           <span
//               className="text-sm text-gray-500 cursor-pointer hover:text-black transition"
//               onClick={handleCopy}
//               title={copied ? "Copied!" : "Click to copy"}
//           >
//       #{order?.order_id}
//     </span>
//         </div>
//         <div className="text-xs text-gray-500">{formatDate(order?.date)}</div>
//       </div>
//
//       <div className="p-4">
//         <div className="flex gap-3">
//           <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
//             <img name=" "
//               src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
//               loading="lazy"
//               alt={order?.product_details?.product_name}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.src = 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400';
//               }}
//             />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
//               {order?.product_details?.product_name}
//             </h3>
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-gray-900">₹{Math.round(order?.grand_total).toLocaleString()}</span>
//               <span className="text-xs text-gray-500 capitalize">{order?.delivery_option}</span>
//             </div>
//             {order?.total_discount > 0 && (
//               <div className="text-xs text-[#375421] mt-1">
//                 Saved ₹{Math.round(order?.total_discount || 0).toLocaleString()}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
//   };
//
//   const DesktopOrderCard = ({ order }) => {
//     const [copied, setCopied] = useState(false);
//
//     const handleCopy = (e) => {
//       e.stopPropagation(); // prevent triggering handleOrderClick
//       navigator.clipboard.writeText(order?.order_id).then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000); // reset after 2s
//       });
//     };
//   return(
//     <div
//       className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200"
//       onClick={() => handleOrderClick(order)}
//     >
//       <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             {getStatusIcon(order?.status)}
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
//               {order?.status.replace('_', ' ')}
//             </span>
//           </div>
//           <span className="text-sm text-gray-500">{formatDate(order?.date)}</span>
//         </div>
//         <span
//             className="text-sm text-gray-500 cursor-pointer hover:text-black transition"
//             onClick={handleCopy}
//             title={copied ? "Copied!" : "Click to copy"}
//         >
//       #{order?.order_id}
//     </span>
//
//       </div>
//
//       <div className="p-6 flex items-center gap-6">
//         <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
//           <img name=" "
//             src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
//             loading="lazy"
//             alt={order?.product_details?.product_name}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.src = '';
//             }}
//           />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-base font-medium text-gray-900 mb-2">
//             {order?.product_details?.product_name}
//           </h3>
//           <div className="flex justify-between items-center">
//             <div>
//               <span className="text-xl font-semibold text-gray-900">₹{Math.round(order?.grand_total).toLocaleString()}</span>
//               {order?.total_discount > 0 && (
//                 <div className="text-sm text-[#375421]">
//                   Saved ₹{Math.round(order?.total_discount).toLocaleString()}
//                 </div>
//               )}
//             </div>
//
//             <span className="text-sm text-gray-500 capitalize">{order?.delivery_option}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )};
//  const CustomCheckbox = ({ checked, onChange, label }) => (
//     <label className="flex items-center justify-between cursor-pointer py-2 group">
//       <span className="text-sm text-gray-800 font-medium">{label}</span>
//       <div className="relative">
//         <input
//           type="checkbox"
//           className="sr-only"
//           checked={checked}
//           onChange={onChange}
//         />
//         <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
//           checked
//             ? 'bg-[#375421] border-[#375421]'
//             : 'bg-white border-gray-300 group-hover:border-green-400'
//         }`}>
//           {checked && (
//             <Check className="w-4 h-4 text-white" strokeWidth={3} />
//           )}
//         </div>
//       </div>
//     </label>
//   );
//   const FilterSidebar = () => (
//     <div className={`bg-site-bg rounded-lg p-6 h-fit ${
//       isMobile ? 'fixed inset-0 z-50 m-4 overflow-y-auto' : 'sticky top-4'
//     }`}>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleReset}
//             className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-site-bg0 transition-colors"
//           >
//             RESET
//           </button>
//           {isMobile && (
//             <button
//               onClick={() => setShowFilters(false)}
//               className="p-1 hover:bg-gray-200 rounded-lg"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           )}
//         </div>
//       </div>
//
//       {/* Divider */}
//       <div className="border-b border-gray-300 mb-6"></div>
//
//       <div className="space-y-8">
//         {/* Order Status Section */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Order status</h3>
//           <div className="space-y-1">
//             {Object.entries(statusFilters).map(([status, checked]) => (
//               <CustomCheckbox
//                 key={status}
//                 checked={checked}
//                 label={status}
//                 onChange={() =>
//                   setStatusFilters((prev) => ({
//                     ...prev,
//                     [status]: !prev[status],
//                   }))
//                 }
//               />
//             ))}
//           </div>
//         </div>
//
//         {/* Divider */}
//         <div className="border-b border-gray-300"></div>
//
//         {/* Order Time Section */}
//         <div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Order time</h3>
//           <div className="space-y-1">
//             {Object.entries(timeFilters).map(([time, checked]) => (
//               <CustomCheckbox
//                 key={time}
//                 checked={checked}
//                 label={time}
//                 onChange={() =>
//                   setTimeFilters((prev) => ({
//                     ...prev,
//                     [time]: !prev[time],
//                   }))
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//
//
//   const content = (
//     <div className="flex-1">
//       {loading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
//               <div className="flex items-center gap-4">
//                 <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : filteredOrders?.length > 0 ? (
//         <div className="space-y-4">
//           {filteredOrders?.map((order) =>
//             isMobile ? (
//               <MobileOrderCard key={order?.id} order={order} />
//             ) : (
//               <DesktopOrderCard key={order?.id} order={order} />
//             )
//           )}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg p-8 text-center">
//           <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//           <p className="text-gray-600">Try adjusting your filters to see more orders.</p>
//         </div>
//       )}
//     </div>
//   );
//
//   if (isMobile) {
//     return (
//       <div className="bg-site-bg min-h-screen">
//         <div className="bg-white shadow-sm sticky top-0 z-40">
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center gap-3">
//               <button className="p-2 hover:bg-site-bg rounded-lg transition-colors">
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <h1 className="text-lg font-semibold">My Orders</h1>
//             </div>
//             <button
//               onClick={() => setShowFilters(true)}
//               className="flex items-center gap-2 px-3 py-2 bg-green-50 text-bio-green rounded-lg hover:bg-green-100 transition-colors"
//             >
//               <Filter className="w-4 h-4" />
//               Filters
//             </button>
//           </div>
//           <div className="px-4 pb-3">
//             <p className="text-sm text-gray-500">Home / My Account / My Orders</p>
//           </div>
//         </div>
//
//         <div className="p-4">
//           {content}
//         </div>
//
//         {showFilters && <FilterSidebar />}
// {

// }
//       </div>
//     );
//   }
//
//   return (
//       <>
//         
//     <div className="bg-site-bg min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
//           <p className="text-sm text-gray-500">Home / My Account / My Orders</p>
//         </div>
//
//         <div className="flex gap-6">
//           <div className="w-80 flex-shrink-0">
//             <FilterSidebar />
//           </div>
//           {content}
//         </div>
//

//       </div>
//     </div>
//       </>
//   );
// };
//
// export default MyOrders;