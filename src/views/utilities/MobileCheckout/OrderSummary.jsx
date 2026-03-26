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

    <><div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4">
        <ProgressBar currentStep="order" />

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
          <div className="mt-2">
            <p className="text-gray-700">Deliver to:{address?.address}</p>
            <p className="font-medium">{address?.city}</p>
            <p className="text-sm text-gray-500">{address?.state}-{address?.pincode} </p>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-4 mb-6">
          {orderItem.map((item, idx) => (
            <div key={item.id ?? idx} className="flex items-center space-x-4">
              <img name=" "
                src={`https://backend.gidan.store${item.image}`}
                loading="lazy"
                alt="Product"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">₹{item.selling_price}</span>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-site-bg border rounded-md text-sm">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Products Button */}
        <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 mb-6">
          Add More Products
        </button>

        {/* Delivery Options */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Choose Delivery Option</h3>
          <div className="space-y-2">
            {deliveryOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="delivery-option"
                  value={option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="w-5 h-5"
                />              <label htmlFor="express">{option.label} ( {option.price}.00 )</label>
              </div>
            ))}

            {/* <div className="flex items-center space-x-2">
              <input type="radio" name="delivery" id="regular" className="text-[#375421]" />
              <label htmlFor="regular">Regular (₹700.00)</label>
            </div> */}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 ">Apply Coupon</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Discount code"
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="px-4 py-2 bg-[#375421] text-white rounded">Apply</button>
          </div>
        </div>

        {/* Price Details */}
        <div className="border-t pt-4 mb-6">
          <h3 className="font-medium mb-3 text-gray-500">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Price ({orderItem?.length || 0} items)</span>
              <span>₹{order?.total_selling_price || order?.total_price}</span>
            </div>
            {Number(order?.total_discount || 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="text-[#375421]">-₹{order?.total_discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-[#375421]">
                {order?.shipping_charge ? `₹${order.shipping_charge}` : 'Free'}
              </span>
            </div>

            {/* Taxable Value */}
            {Number(order?.taxable_value || 0) > 0 && (
              <div className="flex justify-between pt-2 border-t border-dashed">
                <span className="text-gray-500">Taxable Value</span>
                <span>₹{order.taxable_value}</span>
              </div>
            )}

            {/* GST Section */}
            {(() => {
              const breakdownGroups = order?.gst_breakdown?.groups;
              const summary = order?.gst_summary;
              const newSummary = order?.summary || order?.gst_breakdown?.summary;

              // 1. Priority: New "summary" format (gst_18: { cgst, sgst, total })
              if (newSummary && Object.keys(newSummary).some(k => k.startsWith('gst_'))) {
                return Object.entries(newSummary).map(([key, gData]) => {
                  const rate = key.split('_')[1];
                  const totalGst = Number(gData.total || 0);
                  if (totalGst === 0) return null;
                  const isExpanded = !!expandedGst[rate];

                  return (
                    <div key={rate} className="space-y-1 py-1 transition-all duration-300">
                      <div
                        className="flex justify-between text-xs text-gray-600 font-medium cursor-pointer"
                        onClick={() => setExpandedGst(prev => ({ ...prev, [rate]: !prev[rate] }))}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          GST ({rate}%)
                        </span>
                        <span>₹{totalGst.toFixed(2)}</span>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 pl-4 border-l border-gray-100 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                          {Number(gData.cgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>CGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(gData.cgst).toFixed(2)}</span>
                            </div>
                          )}
                          {Number(gData.sgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>SGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(gData.sgst).toFixed(2)}</span>
                            </div>
                          )}
                          {(Number(gData.total || 0) > (Number(gData.cgst || 0) + Number(gData.sgst || 0)) + 0.01) && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>IGST ({rate}%)</span>
                              <span>₹{(Number(gData.total) - (Number(gData.cgst || 0) + Number(gData.sgst || 0))).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              }

              if (breakdownGroups) {
                return Object.entries(breakdownGroups).map(([rate, group]) => {
                  const totalGst = Number(group.total_amount || group.igst || (Number(group.cgst || 0) + Number(group.sgst || 0)) || 0);
                  if (Number(rate) === 0 || totalGst === 0) return null;
                  const isExpanded = !!expandedGst[rate];

                  return (
                    <div key={rate} className="space-y-1 py-1">
                      <div
                        className="flex justify-between text-xs text-gray-600 font-medium cursor-pointer"
                        onClick={() => setExpandedGst(prev => ({ ...prev, [rate]: !prev[rate] }))}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          GST ({rate}%)
                        </span>
                        <span>₹{totalGst.toFixed(2)}</span>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 pl-4 border-l border-gray-100 ml-1 mt-1">
                          {Number(group.cgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>CGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(group.cgst).toFixed(2)}</span>
                            </div>
                          )}
                          {Number(group.sgst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>SGST ({Number(rate) / 2}%)</span>
                              <span>₹{Number(group.sgst).toFixed(2)}</span>
                            </div>
                          )}
                          {Number(group.igst || 0) > 0 && (
                            <div className="flex justify-between text-[10px] text-gray-400">
                              <span>IGST ({rate}%)</span>
                              <span>₹{Number(group.igst).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              }

              if (summary) {
                return Object.entries(summary).map(([rateStr, amount]) => {
                  const rate = parseFloat(rateStr);
                  const totalGst = Number(amount);
                  if (rate === 0 || totalGst === 0) return null;
                  return (
                    <div key={rateStr} className="flex justify-between text-xs text-gray-600 font-medium py-1">
                      <span>GST ({rate}%)</span>
                      <span>₹{totalGst.toFixed(2)}</span>
                    </div>
                  );
                });
              }

              return null;
            })()}

            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{order?.grand_total || 0}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button onClick={handleSaveOrderSummary} className="w-full py-3 bg-[#375421] text-white rounded-lg font-medium">
          Save Order Summary
        </button>
      </div>
    </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default OrderSummary;