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
      <Link href="/profile" className="flex md:hidden items-center gap-2 px-4 pt-4 pb-1 text-bio-green font-medium">
        ← Back to Profile
      </Link>

      <div className="flex justify-center sm:justify-start px-4 sm:px-6 mt-2 bg-gray-100 min-h-screen w-full">
        <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          {/* Total Wallet Balance */}
          <h2 className="text-lg font-semibold mb-2">Gidan Wallet</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex flex-col justify-between items-center space-y-5">
              <span className="text-gray-700 font-semibold">Total Wallet Balance</span>
              <span className="text-2xl font-bold text-green-600">₹{wallet?.balance}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>{/* Placeholder to fill the left side */}
                <button onClick={getTransactions} className="text-md font-semibold text-lime-600 self-end">
                  Wallet Transaction History
                </button>
              </div>
            </div>
          </div>

          {/* Top Up Wallet */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Top Up Wallet</h2>

            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="₹1000"
                className="w-full p-3 border font-semibold rounded-lg text-green-600 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex space-x-4 justify-center sm:justify-start mb-4">
              {presetAmounts.map((amt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(amt)}
                  className="w-1/3 sm:w-1/4 md:w-1/5 border border-md border-gray-300 font-semibold text-center text-green-600 py-2 px-2 rounded-md hover:border-green-500 active:bg-border-green-500"
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="text-center sm:text-left">
              <button
                onClick={handleTopUp}
                className="w-full mb-6 bg-lime-600 text-white px-4 py-4 rounded-md hover:bg-green-700">
                Proceed To Top-Up
              </button>
            </div>
          </div>

          {/* <div>
          <button className="w-full mb-6 bg-lime-600 text-white px-4 py-4 rounded-md hover:bg-green-700">
            Proceed To Top-Up
          </button>
        </div> */}

          {/* Rewards and Credits */}
          <div className="mb-6">
            <div className="bg-transparent border border-black-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between mb-2 items-center">
              <div className="flex flex-col items-center sm:items-start">
                <span>Gidan Rewards</span>
                <span className="flex items-center">
                  25% Utilization On Cart Value
                  <FiAlertCircle className="ml-1" />
                </span>
              </div>
              <span className="text-green-600 font-semibold mt-2 sm:mt-0">₹500</span>
            </div>
            <div className="bg-transparent border border-black-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-col items-center sm:items-start">
                <span>Refund & Gift Credits</span>
                <span className="flex items-center">
                  100% Utilization
                  <FiAlertCircle className="ml-1" />
                </span>
              </div>
              <span className="text-green-600 font-semibold mt-2 sm:mt-0">₹0</span>
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
                className="text-green-500 hover:underline"
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
