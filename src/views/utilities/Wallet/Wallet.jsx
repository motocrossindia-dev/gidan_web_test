'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import FAQSection from "./Faq";
import { isMobile } from "react-device-detect";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { ChevronLeft, ArrowLeft } from "lucide-react";



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

const Wallet = () => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const [wallet, setWallet] = useState([]);
  const [amount, setAmount] = useState("");
  const presetAmounts = ["₹500", "₹1000", "₹2000"];
  const handlePresetClick = (value) => {
    setAmount(value.replace("₹", ""));
  };
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Keep only numbers and dots
    setAmount(value);
  };
  const handleTopUp = async () => {
    if (!amount) return alert("Please enter a valid amount");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallet/create-order/`,
        { amount: parseFloat(amount).toFixed(2) },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",

          },
        }
      );
      if (response.status === 201) {


        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: response?.data?.order?.amount || 0,  // Ensure amount is set
          currency: "INR",
          name: "Bio-tech Maali",
          description: "Test Transaction",
          image: "https://your-logo-url.com",
          order_id: response?.data?.order?.id, // Corrected order_id
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wallet/verify-payment/`,
                {
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id, // Ensure correct ID
                  razorpay_signature: paymentResponse.razorpay_signature,

                },
                { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
              );


              if (verifyResponse.data.message === "Wallet credited successfully") {
                enqueueSnackbar("Wallet credited successfully!", { variant: "success" });
                getTransactions(); // Fetch transactions after successful payment
              } else {
                enqueueSnackbar("Payment Verification Failed.", { variant: "error" });
              }
            } catch (error) {
              enqueueSnackbar(error.message, { variant: "error" });
              console.log(error);

            }
          },
          prefill: { email: response?.data?.order?.notes?.user_email },
          theme: { color: "#3399cc" },
        };


        if (options.order_id && options.amount > 0) {
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            enqueueSnackbar('Failed to load payment gateway. Please try again.', { variant: 'error' });
            return;
          }
          const razorpay = new window.Razorpay(options);
          razorpay.open();

          razorpay.on("payment.failed", function (response) {
            alert("Payment failed. Please try again.");
          });
        } else {
          enqueueSnackbar("Razorpay options are invalid.", { variant: "info" });
        }
      }
    } catch (error) {
      enqueueSnackbar("Failed to top up wallet.", { variant: 'info' });
    }
  };
  const getWallet = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/wallet/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",

        },
      })
      if (response.status === 200) {
        setWallet(response?.data?.data)
      }
    } catch (error) {
      enqueueSnackbar('Wallet data is taking time to load', { variant: 'info' })

    }
  }
  const getTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",

        },
      })

      if (response.status === 200) {
        sessionStorage.setItem('wallet_history_data', JSON.stringify(response?.data?.data));
        router.push('/profile/wallethistory');


      }
    } catch (error) {
      enqueueSnackbar('Wallet history is taking time to load', { variant: 'info' })
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
    getWallet()
  }, []);
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
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Wallet</h1>
        </div>
      </div>

      <div className="mt-0 md:hidden">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="Wallet" 
        />
      </div>

      <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-site-bg min-h-screen w-full mt-2">
        <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-12 rounded-[32px] border border-gray-100">
          {/* Total Wallet Balance */}
          <div className="flex items-center justify-between mb-8">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-2">Stored Balance</span>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gidan Wallet</h2>
             </div>
             <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#375421]/10 flex items-center justify-center">
                   <div className="w-4 h-4 rounded-full bg-[#375421]"></div>
                </div>
             </div>
          </div>

          <div className="bg-site-bg rounded-[24px] p-8 mb-10 border border-gray-100 relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#375421]/5 rounded-full blur-3xl group-hover:bg-[#375421]/10 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-green-100/50">
                    <span className="text-4xl text-[#375421] font-black leading-none">₹</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Credits</span>
                    <span className="text-5xl font-black text-[#375421] tracking-tighter">
                       {wallet?.balance || 0}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                <button
                  onClick={getTransactions}
                  className="px-6 py-3 bg-white text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] rounded-xl shadow-sm border border-gray-100 hover:bg-[#375421] hover:text-white transition-all flex items-center gap-2"
                >
                  History
                </button>
              </div>
            </div>
          </div>

          {/* Top Up Wallet */}
          <div className="mb-12">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-4">Recharge Credits</h3>
            
            <div className="bg-gray-50 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-full border border-gray-100 mb-4">
              <div className="flex-1 relative flex items-center">
                 <span className="absolute left-5 text-gray-400 font-black text-sm">₹</span>
                 <input
                   type="text"
                   value={amount}
                   onChange={handleInputChange}
                   placeholder="1000"
                   className="w-full bg-transparent border-none pl-10 pr-5 py-4 focus:ring-0 text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
                 />
              </div>
              <button
                onClick={handleTopUp}
                className="bg-gray-900 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#375421] transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
              >
                Proceed To Pay
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(amt)}
                  className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                    amount === amt.replace("₹", "")
                      ? 'bg-[#375421] text-white border-[#375421]'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* <div>
          <button className="w-full mb-6 bg-lime-600 text-white px-4 py-4 rounded-md hover:bg-[#375421] hover:text-white">
            Proceed To Top-Up
          </button>
        </div> */}

          {/* Rewards and Credits */}
          <div className="mb-12">
             <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-6">Wallet Sub-Balances</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-start justify-between group hover:shadow-lg transition-all duration-500">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">Gidan Rewards</h4>
                       <FiAlertCircle className="text-gray-300 w-3 h-3 group-hover:text-[#375421] transition-colors" />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">25% Utilization Limit</p>
                 </div>
                 <span className="text-lg font-black text-[#375421] uppercase">₹500</span>
               </div>

               <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-start justify-between group hover:shadow-lg transition-all duration-500">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">Gift Credits</h4>
                       <FiAlertCircle className="text-gray-300 w-3 h-3 group-hover:text-[#375421] transition-colors" />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-tight">100% High Utility</p>
                 </div>
                 <span className="text-lg font-black text-[#375421] uppercase">₹0</span>
               </div>
             </div>
          </div>

          {/* FAQs Section */}
          {/* <FAQSection/> */}


          {/* How to Use Section */}
          {/* <div className="px-2 sm:px-4 py-6">
          <h1 className="text-xl sm:text-2xl text-left mb-4 sm:mb-6">
            How to Pay with a Gidan Card
          </h1>
          <ul className="list-decimal list-inside space-y-4 sm:space-y-6">
            <li>
              Go to{" "}
              <a
                href="https://www.gidan.store"
                className="text-[#375421] hover:underline"
              >
                www.gidan.store
              </a>{" "}
              and select the items you want to purchase. When you're ready to
              checkout, click "Proceed to Pay."
            </li>
            <li>Select the "Pay by Gift Card" option.</li>
            <li>Enter your 16-digit gift card number.</li>
            <li>
              If the gift card value doesn't cover your order total, you'll be
              prompted to select an additional payment method.
            </li>
            <li>
              NOTE: Funds will be deducted from your Flipkart Gift Card when you
              place your order. In case of any adjustment or cancellation at a
              later stage, we will credit the refund back to your Gift Card.
            </li>
          </ul>
          <h2 className="text-left mt-4 sm:mt-6">Does my Gidan Card expire?</h2>
          <p className="text-left mt-4 sm:mt-6">
            All Gidan Cards expire 1 year from the date of their
            creation.
          </p>
          <h2 className="text-xl sm:text-2xl text-left mt-8 sm:mt-10">
            Terms & Conditions
          </h2>
          <ul className="list-decimal list-inside space-y-6 py-8">
             <li>
               Gidan Cards ("GCs" or "Gift Cards") are issued by
               Qwikilver Solutions Pvt. Ltd. ("Qwikilver"), which is a private
               limited company incorporated under the laws of India and is
               authorized by the Reserve Bank of India (RBI) to issue such Gift
               Cards.
             </li>
             <li>
               The Gift Cards can be redeemed online against Sellers listed on  
               www.gidan.store or the Gidan Mobile App or Biotech
               Maali me (Platform) only.
             </li>             <li>
               Gift Cards can be purchased only on www.gidan.store or
               Gidan Mobile App using the following payment modes: Credit
               Card, Debit Card, and Net Banking.
             </li>
             <li>
               Gift Cards can be redeemed by selecting the payment mode as Gift
               Card.
             </li>
             <li>               Gift Cards cannot be used to purchase other Gidan Gift
               Cards or Gidan First subscriptions.
             </li>
             <li>
               Gift Cards cannot be used to make bulk purchases on the Platform.
             </li>
             <li>
               If the order value exceeds the gift card amount, the balance must
               be paid by Credit Card/Debit Card/Internet Banking.   The Cash on
               Delivery payment option cannot be used to pay the balance amount.
             </li>
           </ul>
        </div> */}
        </div>
      </div>

      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default Wallet;
