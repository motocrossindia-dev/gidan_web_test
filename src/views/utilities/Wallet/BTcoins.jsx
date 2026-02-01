import React, { useEffect, useState } from "react";
import { Sprout, Gift, Users, History, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstace from "../../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";



const BTCoins = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    getBTcoinsWallet()
  }, []);



  const [data,setData] = useState(null);
   const [redeemCoins, setRedeemCoins] = useState("");
    const [loading, setLoading] = useState(false);

const navigate = useNavigate();

  const getBTcoinsWallet = async()=>{
    try {
      
      const response = await axiosInstace.get("/btcoins/btcoinswallet/")
      if (response.status===200) {
        setData(response?.data)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const getTransactionHistory= async()=>{
    try {
      const response = await axiosInstace.get(`/btcoins/btcoinsTransactions/`)
      if (response.status === 200) {
        navigate('/profile/history',{state:{resourse:response?.data?.data , data:data}})
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }     


    const handleRedeemCoins = async () => {
    if (!redeemCoins) return;

    try {
      setLoading(true);
      const response = await axiosInstace.post("/wallet/redeem-btcoins/", {
        coins: redeemCoins,
      });

      if (response.status === 200 || response.status === 201) {
        setRedeemCoins("");
        getBTcoinsWallet(); // refresh balance after redeem
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
      <Helmet>
  <title>Gidan - BTCoins</title>

  <meta
    name="description"
    content="Manage your Gidan BTCoins, earn rewards, and redeem coins for plants, pots, seeds, and gardening products. Enjoy a seamless rewards experience."
  />

  <link
    rel="canonical"
    href="https://gidan.store/profile/btcoins"
  />
</Helmet>

    <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-gray-100 min-h-screen w-full">
      <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
        {/* Total BT Coins Balance */}
        <h2 className="text-lg font-semibold mb-2">BT Coins</h2>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col justify-between items-center space-y-5">
            <span className="text-gray-700 font-semibold flex items-center gap-2">
              <Sprout className="text-green-600" />
              Total BT Coins Balance
            </span>
            <span className="text-2xl font-bold text-green-600">{data?.total_coins} Coins</span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Link  onClick={getTransactionHistory} className="text-md font-semibold text-lime-600 self-end flex items-center gap-2">
              <History size={18} />
              Coins Transaction History
            </Link>
          </div>
        </div>


        {/* Redeem Coins Input */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Redeem Coins</h2>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="number"
                placeholder="Enter coins to redeem"
                value={redeemCoins}
                onChange={(e) => setRedeemCoins(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
              <button
                onClick={handleRedeemCoins}
                disabled={loading}
                className="bg-lime-600 text-white px-2 py-1 rounded-md hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Redeeming..." : "Redeem Coins"}
              </button>
            </div>
          </div>

        {/* Earn Coins Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Ways to Earn BT Coins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-green-600" />
                <h3 className="font-semibold">Refer Friends</h3>
              </div>
              <p className="text-gray-600">Get 200 coins for each friend who makes their first purchase</p>
            </div>
            <div className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="text-green-600" />
                <h3 className="font-semibold">Make Purchases</h3>
              </div>
              <p className="text-gray-600">Earn 1 coin for every ₹10 spent on plants</p>
            </div>
          </div>
        </div>

        {/* Redeem Coins Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Redeem Your Coins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { coins: "200", discount: "₹50 off" },
              { coins: "500", discount: "₹150 off" },
              { coins: "1000", discount: "₹350 off" },
            ].map((reward, idx) => (
              <div key={idx} className="bg-white border border-green-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="text-xl font-bold text-green-600">{reward.coins} Coins</p>
                <p className="text-gray-600">Get {reward.discount}</p>
                {/* <button className="mt-3 w-full bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Redeem Now
                </button> */}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-6 px-4 bg-transparent border border-black-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="text-green-600" />
            Frequently Asked Questions
          </h2>
          {[
            {
              q: "How do I earn BT Coins?",
              a: "You can earn BT Coins by referring friends (100 coins per referral) and making purchases (1 coin per ₹10 spent)."
            },
            {
              q: "When do my BT Coins expire?",
              a: "BT Coins are valid for 12 months from the date they are earned."
            },
            {
              q: "How can I redeem my BT Coins?",
              a: "You can redeem your coins for discounts on plant purchases. Different coin amounts unlock different discount values."
            },
            {
              q: "Can I transfer my BT Coins to someone else?",
              a: "No, BT Coins are non-transferable and can only be used by the account holder who earned them."
            }
          ].map((faq, idx) => (
            <details key={idx} className="mb-2">
              <summary className="text-gray-700 py-2 cursor-pointer hover:text-gray-900">
                {faq.q}
              </summary>
              <p className="pl-4 text-gray-600 py-2">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Terms & Conditions */}
        <div className="px-2 sm:px-4 py-6">
          <h2 className="text-xl sm:text-2xl text-left mb-4">Terms & Conditions</h2>
          <ul className="list-decimal list-inside space-y-4">
            <li>BT Coins are reward points that can be earned and redeemed on Gidan's platform.</li>
            <li>Coins earned through referrals will be credited after the referred friend's first purchase.</li>
            <li>Coins cannot be exchanged for cash or transferred to other accounts.</li>
            <li>Gidan reserves the right to modify or terminate the BT Coins program at any time.</li>
            <li>Any misuse of the referral system will result in the forfeiture of earned coins.</li>
            <li>Coins can only be redeemed on plant purchases and cannot be used for accessories or gardening tools.</li>
            <li>A minimum purchase value may be required to redeem coins for discounts.</li>
            <li>Coins expire 12 months from the date of earning.</li>
          </ul>
        </div>
      </div>
    </div>
        </>
  );
};

export default BTCoins;