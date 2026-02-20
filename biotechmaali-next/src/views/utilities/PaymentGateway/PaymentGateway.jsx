'use client';


import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import {Helmet} from "react-helmet-async";
import { trackPurchase } from "../../../utils/ga4Ecommerce";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentGateway = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  // Start null — reads happen client-side in useEffect (sessionStorage is not available during SSR)
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const order_id = orderId;
  const name = orderData?.order?.customer_name || '';
  const email = orderData?.order?.email || '';
  const phone = orderData?.order?.mobile || '';
  const data = orderData;
  const [selectedMethod, setSelectedMethod] = useState("");
  const accessToken = useSelector(selectAccessToken);
  const [balance,setBalance] = useState(null)
  const [walletAdded,setWalletAdded] = useState(null)

  const [isGstSelected, setIsGstSelected] = useState(false);
const [isGst, setIsGst] = useState(false);
const [selectedGst, setSelectedGst] = useState("");

const gstFromProfile = useSelector((state) => state.user.gst);



const handleGstCheckbox = (e) => {
  const checked = e.target.checked;
  setIsGstSelected(checked);
  setIsGst(checked);
  setSelectedGst(checked ? gstFromProfile : '');
};


  const getWalletbalance =async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/wallet`,
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }

      )
      if (response.status === 200) {
        
        setBalance(response?.data?.data)
      }
    } catch (error) {
      console.log(error);
      
    }
  }



  // Read sessionStorage on client mount only
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('payment_order_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrderData(parsed?.resource || null);
        setOrderId(parsed?.order_id || null);
      }
    } catch {}
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    if (!orderData) {
      console.warn("No order data received. Redirecting to checkout.");
      router.replace('/checkout');
      return;
    }
    getWalletbalance();
  }, [dataLoaded, orderData]);

  const paymentOptions = [
    { id: "Wallet", title: "Gidan Wallet", description: `Your current balance is ₹${balance?.balance|| 0}`, type: "radio" },
    { id: "UPI", title: "Razorpay Secure (UPI, Cards, Wallets, NetBanking)", type: "radio" },
    { id: "cod", title: "Cash on Delivery/Pay on Delivery", type: "radio" },
  ];

  const handleSelection = (id) => {
    setSelectedMethod(id);
  };


  
const handlePayment = async () => {
  if (!orderData?.order?.order_id || !selectedMethod) {
    alert("Please select a payment method.");
    return;
  }

  const payload = {
    order_id: order_id,
    payment_method: selectedMethod,
    is_gst: isGst,
    gst_number: selectedGst,
  };

  try {
    const response = await axiosInstance.patch(`/order/proceedToPayment/`, payload);

    if (response.status === 200 || response.status === 206) {
      const usedWallet = response?.data?.wallet_debited || 0;
      setWalletAdded(usedWallet);

      const razorpayOrder = response?.data?.razorpay_order;

      // ✅ CASE 1: Full wallet payment (no Razorpay required)
      if (!razorpayOrder) {
        enqueueSnackbar(response?.data?.message || "Payment Successful via Wallet", {
          variant: "success",
        });
        
        // GA4: Track purchase event for wallet payment
        trackPurchase({
          transaction_id: order_id || response.data.order_id,
          value: orderData?.order?.grand_total || 0,
          items: orderData?.order_items || orderData?.items || [],
          shipping: orderData?.order?.delivery_charge || 0,
          coupon: response.data.coupon_code
        });
        
        router.push("/successpage");
        return;
      }

      // ✅ CASE 2: Partial Wallet + Razorpay Required
      const options = {
        key: "rzp_live_RH46LqJqM4UlmU",
        amount: razorpayOrder.amount || 0,
        currency: "INR",
        name: "Bio-tech Maali",
        description: "Pay remaining balance",
        image: "https://your-logo-url.com",
        order_id: razorpayOrder.id,
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/order/verifyPayment/`,
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: response.data.order_id,
                payment_method: selectedMethod,
                amount: razorpayOrder.amount / 100, // amount in INR
                payment_details: paymentResponse,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyRes.data.message === "Payment successful") {
              enqueueSnackbar("Payment completed successfully!", { variant: "success" });
              
              // GA4: Track purchase event
              trackPurchase({
                transaction_id: order_id || response.data.order_id,
                value: razorpayOrder.amount / 100,
                items: orderData?.order_items || orderData?.items || [],
                shipping: orderData?.order?.delivery_charge || 0
              });
              
              router.push("/successpage");
            } else {
              enqueueSnackbar("Payment verification failed.", { variant: "error" });
            }
          } catch (err) {
            console.error("Verification error:", err);
            enqueueSnackbar("Payment verification error.", { variant: "error" });
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: async () => {
            if (usedWallet > 0) {
              try {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/order/payments/rollback-wallet/`,
                  {
                    order_id: order_id,
                    wallet_amount: usedWallet,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                enqueueSnackbar("Wallet rollback successful.", { variant: "info" });
                setWalletAdded(0);
              } catch (err) {
                console.error("Rollback failed:", err);
                enqueueSnackbar("Failed to rollback wallet.", { variant: "warning" });
              }
            }
          },
        },
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        enqueueSnackbar('Failed to load payment gateway. Please try again.', { variant: 'error' });
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
      });
    }
  } catch (error) {
    console.error("Payment error:", error);
    enqueueSnackbar(
      error?.response?.data?.message || "Error processing your payment.",
      { variant: "error" }
    );
  }
};



  
  return (
      <>
        <Helmet>
  <title>Gidan - Payment Gateway</title>

  <meta
    name="description"
    content="Securely complete your payment for plants, pots, seeds, and gardening products on Gidan. Enjoy a fast, safe, and seamless checkout experience."
  />

  <link
    rel="canonical"
    href="https://gidan.store/paymentgateway"
  />
</Helmet>

    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <div className="lg:w-3/4 max-h-screen overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Payment Method</h2>

<div className="mb-4">
  <label className="flex items-center space-x-2 text-sm text-gray-700">
    <input
      type="checkbox"
      checked={isGstSelected}
      onChange={handleGstCheckbox}
      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
    />
    <span>Use My GST Number</span>
  </label>

    {isGstSelected && (
    <p className="ml-6 mt-2 text-sm text-gray-600">
      <strong>GST Number:</strong> {gstFromProfile || "Not provided"}
    </p>
  )}
</div>

        <div className="bg-white p-6 shadow-md rounded-lg transition-all duration-300">
        <div className="space-y-6">
  {paymentOptions.map((option) => {
    const isCOD = option.id === "cod";
    const isSelected = selectedMethod === option.id;
    const isDisabled = isCOD; // disable COD

    return (
      <div
        key={option.id}
        className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300
          ${isSelected ? "bg-green-50 border border-green-500 shadow-md" : "hover:bg-gray-50"}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !isDisabled && handleSelection(option.id)}
      >
        <div className="mt-1 flex-shrink-0">
          {option.type === "radio" ? (
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isSelected ? "border-green-600 bg-white" : "border-gray-400 bg-white"}
              `}
            >
              {isSelected && <div className="w-3 h-3 rounded-full bg-green-600" />}
            </div>
          ) : (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelection(option.id)}
              className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              disabled={isDisabled}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 text-lg font-medium">{option.title}</h3>
          <p className="text-gray-600 text-sm">
            {isCOD
              ? "Cash on Delivery is currently unavailable for your pathname. Please choose another payment method."
              : option.description}
          </p>
        </div>
      </div>
      
    );
  })}
</div>

{!(isGstSelected && !gstFromProfile) && (
  <div className="mt-8 flex justify-center">
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
    >
      Proceed to Payment
    </button>
  </div>
)}

{isGstSelected && !gstFromProfile && (
  <p className="text-red-500 text-center mt-4 text-sm font-medium">
    Please add your GST number in Profile to proceed with this option.
  </p>
)}

        </div>
      </div>
      <div className="w-full lg:w-1/4 mt-6 lg:mt-4 lg:pl-6">
  <div className="bg-white p-4 rounded-md shadow-md sticky top-4">
    <h2 className="text-gray-500 font-semibold mb-2">Price Details</h2>
    <hr />
    <div className="space-y-2 mt-4">
      {/* Price */}
      <div className="flex justify-between text-gray-700">
        <span>Price ({data?.order_items?.length})</span>
        <span>₹{Math.round(data?.order?.total_price)}</span>
      </div>

      {/* Discount */}
      <div className="flex justify-between text-bio-green">
        <span>Discount</span>
        <span>-₹{Math.round(data?.order?.total_discount)}</span>
      </div>

      {/* Coupon Discount */}
      <div className="flex justify-between text-bio-green">
        <span>Coupon Discount</span>
        <span>-₹{Math.round(data?.order?.coupon_discount)}</span>
      </div>

      {/* Wallet Debit - conditional */}
      {walletAdded > 0 && (
        <div className="flex justify-between text-bio-green">
          <span>Debited from Wallet</span>
          <span>-₹{walletAdded}</span>
        </div>
      )}

      {/* Delivery Charges */}
      {/* <div className="flex justify-between text-gray-700">
        <span>Delivery Charges</span>
        <span>
          <span className="line-through text-gray-400">₹80</span>{" "}
          <span className="text-bio-green">Free</span>
        </span>
      </div> */}

      {/* Packaging Fee */}
      {/* <div className="flex justify-between text-gray-700">
        <span>Secured Packaging Fee</span>
        <span className="line-through text-gray-400">₹198</span>
        <span className="text-bio-green">Free</span>
      </div>
    </div> */}

    {/* Delivery Charges */}
      <div className="flex justify-between text-gray-700">
        <span>Delivery Charges</span>
        <span>
          <span className=" text-gray-700">₹{data?.shipping_info?.shipping_charge}</span>{" "}
          {/* <span className="text-bio-green">Free</span> */}
        </span>
      </div>

    </div>

    <hr className="my-4" />

    {/* Total Amount */}
    <div className="flex justify-between font-semibold text-gray-900">
      <span>Total Amount</span>
      <span>
        ₹
        {Math.round((
          data?.order?.grand_total -
          (walletAdded || 0)
        ).toFixed(2))}
      </span>
    </div>

    <hr className="my-4" />

    {/* Savings */}
    <div className="text-bio-green text-sm font-semibold">
      You will save ₹
      {Math.round((data?.order?.total_discount || 0) +
        (data?.order?.coupon_discount || 0) +(walletAdded|| 0))}{" "}
      on this order
    </div>
  </div>
</div>

    </div>
        </>
  );
};

export default PaymentGateway;


