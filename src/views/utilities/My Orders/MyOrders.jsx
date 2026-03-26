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
import WriteAReview from '../ProductData/WriteAReview';
import Breadcrumb from '../../../components/Shared/Breadcrumb';
// Using your actual data structure


const MyOrders = () => {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPos, setFilterPos] = useState({ x: null, y: null });
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

  // Reset drag position when filter closes
  useEffect(() => {
    if (!showFilters) setFilterPos({ x: null, y: null });
  }, [showFilters]);

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

  const filteredOrders = allOrders.filter((order) => {
    const statusMatch = statusFilters[order.status];
    const orderYear = getOrderYear(order.date);
    const isLast30Days = isWithinLast30Days(order.date);

    const timeMatch =
      (timeFilters['Last 30 Days'] && isLast30Days) ||
      (timeFilters['2026'] && orderYear === '2026') ||
      (timeFilters['2025'] && orderYear === '2025') ||
      (timeFilters['2024'] && orderYear === '2024') ||
      (timeFilters['2023'] && orderYear === '2023');

    return statusMatch && timeMatch;
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      case 'DELIVERED':
        return 'text-[#375421] bg-green-50';
      case 'RETURNED':
        return 'text-bio-green bg-green-50';
      case 'PROCESSING':
        return 'text-orange-600 bg-orange-50';
      case 'ON_THE_WAY':
        return 'text-purple-600 bg-purple-50';
      case 'ORDER_CONFIRMED':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-site-bg';
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
    return (<div
      className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleOrderClick(order)}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(order?.status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
              {order?.status.replace(/_/g, ' ')}
            </span>
          </div>
          <span
            className="text-sm text-gray-600 cursor-pointer hover:text-black transition"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Click to copy"}
          >
            #{order?.order_id}
          </span>
        </div>
        <div className="text-xs text-gray-600">{formatDate(order?.date)}</div>
      </div>

      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
              loading="lazy"
              alt={order?.product_details?.product_name}
              className="w-full h-full object-cover"
              width="400"
              height="300"
              style={{ aspectRatio: '4/3' }}
              onError={(e) => {
                e.target.src = 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              {order?.product_details?.product_name}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">₹{Math.round(order?.grand_total).toLocaleString()}</span>
              <span className="text-xs text-gray-600 capitalize">{order?.delivery_option}</span>
            </div>
            {order?.total_discount > 0 && (
              <div className="text-xs text-[#375421] mt-1">
                Saved ₹{Math.round(order?.total_discount || 0).toLocaleString()}
              </div>
            )}
            {order?.status === 'DELIVERED' && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveReviewOrder(order); }}
                className={`mt-2 w-full py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  order?.is_review || order?.is_reviewed
                    ? 'border-[#375421] text-[#375421] hover:bg-green-50'
                    : 'border-gray-300 text-gray-700 hover:bg-site-bg'
                }`}
              >
                {order?.is_review || order?.is_reviewed ? '✓ Edit Review' : 'Write Review'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    )
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
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-green-200 transition-all duration-200"
        onClick={() => handleOrderClick(order)}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(order?.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
                {order?.status.replace(/_/g, ' ')}
              </span>
            </div>
            <span className="text-sm text-gray-600">{formatDate(order?.date)}</span>
          </div>
          <span
            className="text-sm text-gray-600 cursor-pointer hover:text-black transition"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Click to copy"}
          >
            #{order?.order_id}
          </span>

        </div>

        <div className="p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${order?.product_details?.product_image}`}
              loading="lazy"
              alt={order?.product_details?.product_name}
              className="w-full h-full object-cover"
              width="400"
              height="300"
              style={{ aspectRatio: '4/3' }}
              onError={(e) => {
                e.target.src = '';
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-2">
              {order?.product_details?.product_name}
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xl font-semibold text-gray-900">₹{Math.round(order?.grand_total).toLocaleString()}</span>
                {order?.total_discount > 0 && (
                  <div className="text-sm text-[#375421]">
                    Saved ₹{Math.round(order?.total_discount).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 capitalize">{order?.delivery_option}</span>
                {order?.status === 'DELIVERED' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveReviewOrder(order); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      order?.is_review || order?.is_reviewed
                        ? 'border-[#375421] text-[#375421] hover:bg-green-50'
                        : 'border-gray-300 text-gray-700 hover:bg-site-bg'
                    }`}
                  >
                    {order?.is_review || order?.is_reviewed ? '✓ Edit Review' : 'Write Review'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomCheckbox = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer py-2 group">
      <span className="text-sm text-gray-800 font-medium">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked
          ? 'bg-[#375421] border-[#375421]'
          : 'bg-white border-gray-300 group-hover:border-green-400'
          }`}>
          {checked && (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          )}
        </div>
      </div>
    </label>
  );
  const FilterSidebar = () => {
    const isOverlay = isMobile || isTablet;
    const isDraggable = isTablet; // tablet only – drag handle
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const getInitialXY = () => ({
      x: filterPos.x !== null ? filterPos.x : window.innerWidth / 2 - 150,
      y: filterPos.y !== null ? filterPos.y : window.innerHeight / 2 - 200,
    });

    const handleHeaderMouseDown = (e) => {
      if (!isDraggable) return;
      isDraggingRef.current = true;
      const { x, y } = getInitialXY();
      dragStartRef.current = { x: e.clientX - x, y: e.clientY - y };

      const onMove = (ev) => {
        if (!isDraggingRef.current) return;
        setFilterPos({ x: ev.clientX - dragStartRef.current.x, y: ev.clientY - dragStartRef.current.y });
      };
      const onUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      e.preventDefault();
    };

    const handleHeaderTouchStart = (e) => {
      if (!isDraggable) return;
      isDraggingRef.current = true;
      const touch = e.touches[0];
      const { x, y } = getInitialXY();
      dragStartRef.current = { x: touch.clientX - x, y: touch.clientY - y };

      const onMove = (ev) => {
        if (!isDraggingRef.current) return;
        const t = ev.touches[0];
        setFilterPos({ x: t.clientX - dragStartRef.current.x, y: t.clientY - dragStartRef.current.y });
      };
      const onEnd = () => {
        isDraggingRef.current = false;
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
      };
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    };

    const draggableStyle = isDraggable ? {
      position: 'fixed',
      left: filterPos.x !== null ? `${filterPos.x}px` : '50%',
      top: filterPos.y !== null ? `${filterPos.y}px` : '50%',
      transform: filterPos.x !== null ? 'none' : 'translate(-50%, -50%)',
      zIndex: 50,
      width: '300px',
      maxHeight: '82vh',
      overflowY: 'auto',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
    } : {};

    const FilterContent = () => (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order status</h3>
          <div className="space-y-1">
            {Object.entries(statusFilters).map(([status, checked]) => (
              <CustomCheckbox
                key={status}
                checked={checked}
                label={status.replace(/_/g, ' ')}
                onChange={() => setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }))}
              />
            ))}
          </div>
        </div>
        <div className="border-b border-gray-300"></div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order time</h3>
          <div className="space-y-1">
            {Object.entries(timeFilters).map(([time, checked]) => (
              <CustomCheckbox
                key={time}
                checked={checked}
                label={time}
                onChange={() => setTimeFilters((prev) => ({ ...prev, [time]: !prev[time] }))}
              />
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <>
        {/* Backdrop for any overlay */}
        {isOverlay && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilters(false)}
          />
        )}

        <div
          className={`bg-site-bg rounded-xl p-6 h-fit ${
            !isOverlay
              ? 'sticky top-4'
              : !isDraggable
              ? 'fixed inset-0 z-50 m-4 overflow-y-auto'
              : ''
          }`}
          style={draggableStyle}
        >
          {/* Header / drag handle */}
          <div
            className={`flex justify-between items-center mb-6 ${
              isDraggable ? 'cursor-grab active:cursor-grabbing select-none' : ''
            }`}
            onMouseDown={handleHeaderMouseDown}
            onTouchStart={handleHeaderTouchStart}
          >
            <div className="flex items-center gap-2">
              {isDraggable && (
                <span className="text-gray-400 text-base leading-none">⠿</span>
              )}
              <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-site-bg0 transition-colors"
              >
                RESET
              </button>
              {isOverlay && (
                <button aria-label="Close" onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-200 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-gray-300 mb-6"></div>
          <FilterContent />
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
      </div>
      {activeReviewOrder && (
        <WriteAReview
          isInline={false}
          onClose={() => setActiveReviewOrder(null)}
          onSuccess={() => setActiveReviewOrder(null)}
          productId={activeReviewOrder?.product_details?.id}
          productDetailData={activeReviewOrder?.product_details}
        />
      )}
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