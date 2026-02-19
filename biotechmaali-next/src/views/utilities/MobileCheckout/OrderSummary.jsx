'use client';

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState,useEffect } from 'react';
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
          <span className={currentStep === 'address' ? 'text-blue-600 font-medium' : 'text-gray-400'}>
            Address
          </span>
          <span className={currentStep === 'order' ? 'text-blue-600 font-medium' : 'text-gray-400'}>
            Order Summary
          </span>
          <span className={currentStep === 'payment' ? 'text-blue-600 font-medium' : 'text-gray-400'}>
            Payment
          </span>
        </div>
        <div className="w-full bg-gray-200 h-1 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [orderItem,setOrderItem] = useState([]);
  const [order, setOrder] = useState();
  const orderData = null?.resource; 
  useEffect(() => {
    if (orderData?.order_items) {
      setOrderItem(orderData.order_items);
      setOrder(orderData.order);
    }
  }, [orderData]); // Runs only when orderData changes
  
    
  // const [quantity, setQuantity] = useState({ item1: 1, item2: 1 });
  const [address, setAddresses] = useState('');
  const accessToken = useSelector(selectAccessToken);


  const fetchDefaultAddress = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/account/address/`,
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

    const handleSaveOrderSummary = async () =>{
      const data={
        order_id:orderData.order.id,
        delivery_option:selectedOption,
        address_id:address.id
      }
      try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/order/orderSummary/`,
          data,{
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
              className="text-sm text-green-600"
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
          {orderItem.map((item) => (
            <div key={""} className="flex items-center space-x-4">
              <img name=" "   
                src={`https://backend.gidan.store${item.image}`}
                loading="lazy"
                alt="Product"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">₹{item.price}.00</span>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-gray-100 border rounded-md text-sm">
                      {/* {quantity[item`${item}`]} */}
                      {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-red-500 text-sm">Remove</button>
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
              <input type="radio" name="delivery" id="regular" className="text-green-600" />
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
            <button className="px-4 py-2 bg-green-600 text-white rounded">Apply</button>
          </div>
        </div>

        {/* Price Details */}
        <div className="border-t pt-4 mb-6">
          <h3 className="font-medium mb-3 text-gray-500">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Price ({orderItem?.length||0} items)</span>
              <span>₹{order?.total_price}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="text-green-500">-₹{order?.total_discount||0}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-500">₹50 Free</span>
            </div>
            <div className="flex justify-between">
              {/* <span className="text-gray-600">Secured Packaging Fee</span>
              <span>₹198</span> */}
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{order?.grand_total||0}.00</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button onClick={handleSaveOrderSummary} className="w-full py-3 bg-green-600 text-white rounded-lg font-medium">
          Save Order Summary
        </button>
      </div>
    </div>
        <HomepageSchema/>
        <StoreSchema/>
      </>
  );
};

export default OrderSummary;