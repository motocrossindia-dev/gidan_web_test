


import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import { enqueueSnackbar } from 'notistack';

// Using your actual data structure
import OrderModal from "./OrderModal";
import {Helmet} from "react-helmet";

const MyOrders = () => {
  const [allOrders,setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [orderid, setOrderid] = useState(null);

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

  useEffect(()=>{
    getMyOrders()
  },[])
  const [timeFilters, setTimeFilters] = useState({
    'Last 30 Days': true,
    '2025': true,
    '2024': true,
    '2023': true,
  });

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOrderClick = async(order) => {
    try {
      const response = await axiosInstance.get(`/order/orderHistoryItems/${order?.id}`);

      if (response?.status === 200) {
        setSelectedOrder(response?.data?.data);
        setOrderid(order);
      }
    } catch (error) {
      enqueueSnackbar("Failed to load order details", { variant: "error" });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
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
        return 'text-green-600 bg-green-50';
      case 'RETURNED':
        return 'text-blue-600 bg-blue-50';
      case 'PROCESSING':
        return 'text-orange-600 bg-orange-50';
      case 'ON_THE_WAY':
        return 'text-purple-600 bg-purple-50';
      case 'ORDER_CONFIRMED':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
    return (    <div
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
                    src={`${process.env.REACT_APP_API_URL}${order?.product_details?.product_image}`}
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
                    <div className="text-xs text-green-600 mt-1">
                      Saved ₹{Math.round(order?.total_discount || 0).toLocaleString()}
                    </div>
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
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200"
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
                  src={`${process.env.REACT_APP_API_URL}${order?.product_details?.product_image}`}
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
                      <div className="text-sm text-green-600">
                        Saved ₹{Math.round(order?.total_discount).toLocaleString()}
                      </div>
                  )}
                </div>

                <span className="text-sm text-gray-600 capitalize">{order?.delivery_option}</span>
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
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              checked
                  ? 'bg-green-600 border-green-600'
                  : 'bg-white border-gray-300 group-hover:border-green-400'
          }`}>
            {checked && (
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      </label>
  );
  const FilterSidebar = () => (
      <div className={`bg-gray-50 rounded-lg p-6 h-fit ${
          isMobile ? 'fixed inset-0 z-50 m-4 overflow-y-auto' : 'sticky top-4'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
          <div className="flex items-center gap-2">
            <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition-colors"
            >
              RESET
            </button>
            {isMobile && (
                <button aria-label="Close"
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mb-6"></div>

        <div className="space-y-8">
          {/* Order Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order status</h3>
            <div className="space-y-1">
              {Object.entries(statusFilters).map(([status, checked]) => (
                  <CustomCheckbox
                      key={status}
                      checked={checked}
                      label={status.replace(/_/g, ' ')}
                      onChange={() =>
                          setStatusFilters((prev) => ({
                            ...prev,
                            [status]: !prev[status],
                          }))
                      }
                  />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-300"></div>

          {/* Order Time Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order time</h3>
            <div className="space-y-1">
              {Object.entries(timeFilters).map(([time, checked]) => (
                  <CustomCheckbox
                      key={time}
                      checked={checked}
                      label={time}
                      onChange={() =>
                          setTimeFilters((prev) => ({
                            ...prev,
                            [time]: !prev[time],
                          }))
                      }
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
  );

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

  if (isMobile) {
    return (
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-white shadow-sm sticky top-0 z-40">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button aria-label="Previous" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold">My Orders</h1>
              </div>
              <button aria-label="Toggle filters"
                      onClick={() => setShowFilters(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-sm text-gray-600">Home / My Account / My Orders</p>
            </div>
          </div>

          <div className="p-4">
            {content}
          </div>

          {showFilters && <FilterSidebar />}
          {isModalOpen && selectedOrder && <OrderModal order={selectedOrder} />}
        </div>
    );
  }

  return (
      <>
        <Helmet>
          <title>Gidan - My Orders</title>
        </Helmet>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-sm text-gray-600">Home / My Account / My Orders</p>
            </div>

            <div className="flex gap-6">
              <div className="w-80 flex-shrink-0">
                <FilterSidebar />
              </div>
              {content}
            </div>

            {isModalOpen && selectedOrder && <OrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} orderid={orderid}/>}
          </div>
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
// import {Helmet} from "react-helmet";
//
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
//         return 'text-green-600 bg-green-50';
//       case 'RETURNED':
//         return 'text-blue-600 bg-blue-50';
//       case 'PROCESSING':
//         return 'text-orange-600 bg-orange-50';
//       case 'ON_THE_WAY':
//         return 'text-purple-600 bg-purple-50';
//       case 'ORDER_CONFIRMED':
//         return 'text-yellow-600 bg-yellow-50';
//       default:
//         return 'text-gray-600 bg-gray-50';
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
//               src={`${process.env.REACT_APP_API_URL}${order?.product_details?.product_image}`}
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
//               <div className="text-xs text-green-600 mt-1">
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
//       className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200"
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
//             src={`${process.env.REACT_APP_API_URL}${order?.product_details?.product_image}`}
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
//                 <div className="text-sm text-green-600">
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
//             ? 'bg-green-600 border-green-600'
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
//     <div className={`bg-gray-50 rounded-lg p-6 h-fit ${
//       isMobile ? 'fixed inset-0 z-50 m-4 overflow-y-auto' : 'sticky top-4'
//     }`}>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleReset}
//             className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition-colors"
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
//       <div className="bg-gray-50 min-h-screen">
//         <div className="bg-white shadow-sm sticky top-0 z-40">
//           <div className="flex items-center justify-between p-4">
//             <div className="flex items-center gap-3">
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <h1 className="text-lg font-semibold">My Orders</h1>
//             </div>
//             <button
//               onClick={() => setShowFilters(true)}
//               className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
//         {isModalOpen && selectedOrder && <OrderModal order={selectedOrder} />}
//       </div>
//     );
//   }
//
//   return (
//       <>
//         <Helmet>
//           <title>Gidan - My Orders</title>
//         </Helmet>
//     <div className="bg-gray-50 min-h-screen">
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
//         {isModalOpen && selectedOrder && <OrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} orderid={orderid}/>}
//       </div>
//     </div>
//       </>
//   );
// };
//
// export default MyOrders;