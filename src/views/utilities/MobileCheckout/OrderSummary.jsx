'use client';

import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axios from 'axios';
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
// Progress Bar Component
const ProgressBar = ({ currentStep }) => {

  return (
    <div className="flex items-center mb-6 border-b pb-4">
      <button onClick={() => window.history.back()} className="mr-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <span className={currentStep === 'address' ? 'text-bio-green font-medium' : 'text-gray-400'}>
            Address
          </span>
          <span className={currentStep === 'order' ? 'text-bio-green font-medium' : 'text-gray-400'}>
            Order Summary
          </span>
          <span className={currentStep === 'payment' ? 'text-bio-green font-medium' : 'text-gray-400'}>
            Payment
          </span>
        </div>
        <div className="w-full bg-gray-200 h-1 rounded-full">
          <div
            className="h-full bg-bio-green rounded-full transition-all duration-300"
            style={{
              width: currentStep === 'address' ? '33%' :
                currentStep === 'order' ? '66%' : '100%'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Page
const OrderSummary = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [orderItem, setOrderItem] = useState([]);
  const [order, setOrder] = useState();
  const [expandedGst, setExpandedGst] = useState({});
  const orderData = (() => {
    try { return JSON.parse(sessionStorage.getItem('checkout_ordersummary') || 'null'); } catch { return null; }
  })();
  useEffect(() => {
    if (orderData?.order_items) {
      setOrderItem(orderData.order_items);
      setOrder(orderData.order);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps // Runs only when orderData changes


  // const [quantity, setQuantity] = useState({ item1: 1, item2: 1 });
  const [address, setAddresses] = useState('');
  const accessToken = useSelector(selectAccessToken);


  const fetchDefaultAddress = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/account/address/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const defaultAddress = response.data.data.address.find(
        (addr) => addr.is_default
      );
      if (defaultAddress) {
        setAddresses(defaultAddress);
        // setSelectedAddress(defaultAddress.id)
      }

    } catch (error) {
      console.error("Error fetching default address:", error);
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, [accessToken]);

  const deliveryOptions = [
    { id: "standard", label: "Standard", price: "₹000.00" },
    { id: "express", label: "Express Way", price: "₹000.00" },
  ];
  const [selectedOption, setSelectedOption] = useState("standard");

  const handleSaveOrderSummary = async () => {
    const data = {
      order_id: orderData.order.id,
      delivery_option: selectedOption,
      address_id: address.id
    }
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/order/orderSummary/`,
        data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (response.data.message === 'success') {
        router.push('/payment', { state: { resource: response.data.data } });
      }
    } catch (error) {
      console.error("Error fetching default address:", error);
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto bg-white h-screen flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col h-full">
        <ProgressBar currentStep="order" />

        <div className="flex-1 overflow-y-auto pr-1 -mr-1 scrollbar-hide">
          {/* Delivery Address */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <button
                onClick={() => router.push('/address')}
                className="text-sm text-[#375421]"
              >
                Change
              </button>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-gray-700">Deliver to: <span className="font-medium">{address?.address}</span></p>
              <p className="font-medium">{address?.city}</p>
              <p className="text-gray-500">{address?.state} - {address?.pincode} </p>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Items</h3>
            {orderItem.map((item, idx) => (
              <div key={item.id ?? idx} className="flex items-center space-x-4 p-2 bg-gray-50 rounded-xl border border-gray-100/50">
                <img 
                  src={`https://backend.gidan.store${item.image}`}
                  loading="lazy"
                  alt="Product"
                  className="w-16 h-16 object-cover rounded-lg shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{item.product_name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-[#375421]">₹{item.selling_price}</span>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-black uppercase text-gray-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Products Button */}
          <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:border-[#375421]/30 hover:text-[#375421]/50 transition-all mb-6">
            Add More Products
          </button>

          {/* Delivery Options */}
          <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Choose Delivery Option</h3>
            <div className="space-y-3">
              {deliveryOptions.map((option) => (
                <label key={option.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#375421]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="w-4 h-4 accent-[#375421]"
                    />
                    <span className="text-sm font-bold text-gray-700">{option.label}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{option.price}.00</span>
                </label>
              ))}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Apply Coupon</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Discount code"
                className="flex-1 border-2 border-dashed border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#375421] outline-none transition-all uppercase font-black placeholder:text-gray-300"
              />
              <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">Apply</button>
            </div>
          </div>

          {/* Price Details */}
          <div className="border-t border-dashed pt-6 mb-2">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Final Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Price ({orderItem?.length || 0} items)</span>
                <span className="font-bold">₹{order?.total_selling_price || order?.total_price}</span>
              </div>
              {Number(order?.total_discount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Discount</span>
                  <span className="text-[#375421] font-bold">-₹{order?.total_discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Delivery Charges</span>
                <span className="text-gray-900 font-bold">
                  {order?.shipping_charge ? `₹${order.shipping_charge}` : 'FREE'}
                </span>
              </div>

              {/* Taxable Value */}
              {Number(order?.taxable_value || 0) > 0 && (
                <div className="flex justify-between pt-2 border-t border-dashed border-gray-100">
                  <span className="text-gray-500 font-medium">Taxable Value</span>
                  <span className="font-bold">₹{order.taxable_value}</span>
                </div>
              )}

              {/* GST Section */}
              {(() => {
                const summaryData = order?.gst_summary;
                const breakdown = order?.gst_breakdown || {};
                
                let gstItems = [];
                let totalGst = 0;

                if (summaryData) {
                  Object.keys(summaryData).forEach(rate => {
                    const val = Number(summaryData[rate]);
                    if (!isNaN(val) && val > 0) {
                      gstItems.push({ rate: rate.includes('%') ? rate : `${rate}%`, amount: val });
                      totalGst += val;
                    }
                  });
                } else if (breakdown.summary || Object.keys(breakdown).some(k => k.startsWith('gst_'))) {
                  const sumObj = breakdown.summary || breakdown;
                  Object.keys(sumObj).filter(k => k.startsWith('gst_')).forEach(key => {
                    const rate = key.split('_')[1];
                    const val = Number(sumObj[key].total || 0);
                    if (val > 0) {
                      gstItems.push({ rate: `${rate}%`, amount: val });
                      totalGst += val;
                    }
                  });
                } else if (breakdown.groups) {
                  Object.keys(breakdown.groups).forEach(rate => {
                    const group = breakdown.groups[rate];
                    const val = Number(group.total_amount || group.igst || (Number(group.cgst || 0) + Number(group.sgst || 0)) || 0);
                    if (val > 0) {
                      gstItems.push({ rate: `${rate}%`, amount: val });
                      totalGst += val;
                    }
                  });
                }

                if (gstItems.length === 0) return null;

                const isExpanded = !!expandedGst['all_taxes'];

                return (
                  <div className="space-y-2 py-1">
                    <div
                      className="flex justify-between text-sm text-gray-600 font-medium cursor-pointer py-1"
                      onClick={() => setExpandedGst(prev => ({ ...prev, all_taxes: !prev.all_taxes }))}
                    >
                      <span className="flex items-center gap-1">
                        <span
                          className={`text-[8px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
                        >
                          ▶
                        </span>
                        Taxes (GST)
                      </span>
                      <span className="font-bold">₹{totalGst.toFixed(2)}</span>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2 pl-4 border-l-2 border-gray-100 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                        {gstItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-gray-400 font-bold uppercase">
                            <span>GST ({item.rate})</span>
                            <span>₹{item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-gray-100 mt-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-black text-gray-900 font-serif">₹{order?.grand_total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button Fixed at Bottom */}
        <div className="pt-4 border-t bg-white mt-auto">
          <button 
            onClick={handleSaveOrderSummary} 
            className="w-full py-4 bg-[#375421] text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-green-900/10 active:scale-[0.98] transition-all"
          >
            Save Order Summary
          </button>
          </div>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default OrderSummary;