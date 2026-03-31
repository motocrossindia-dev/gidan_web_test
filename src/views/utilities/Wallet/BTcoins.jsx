'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Sprout, Gift, Users, History, HelpCircle, ChevronLeft, ArrowLeft } from "lucide-react";
import axiosInstace from "../../../Axios/axiosInstance";
import Breadcrumb from "../../../components/Shared/Breadcrumb";

const GDCoins = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    getGDcoinsWallet()
  }, []);



  const [data, setData] = useState(null);
  const [redeemCoins, setRedeemCoins] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const getGDcoinsWallet = async () => {
    try {

      const response = await axiosInstace.get("/btcoins/btcoinswallet/")
      if (response.status === 200) {
        setData(response?.data)
      }
    } catch (error) { }
  }

  const getTransactionHistory = async () => {
    try {
      const response = await axiosInstace.get(`/btcoins/btcoinsTransactions/`)
      if (response.status === 200) {
        router.push('/profile/history', { state: { resourse: response?.data?.data, data: data } })
      }

    } catch (error) { }
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
        getGDcoinsWallet(); // refresh balance after redeem
      }
    } catch (error) { } finally {
      setLoading(false);
    }
  };

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

      <div className="mt-0 md:hidden text-xs sm:text-sm">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="GD Coins" 
        />
      </div>

      <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-site-bg min-h-screen w-full">
        <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-12 rounded-[32px] border border-gray-100">
          {/* Total GD Coins Balance */}
          <div className="flex items-center justify-between mb-8">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-2">GD Wallet</span>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Coins Balance</h2>
             </div>
             <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300">
                <Sprout className="w-6 h-6 text-[#375421]/30" />
             </div>
          </div>

          <div className="bg-site-bg rounded-[24px] p-8 mb-10 border border-gray-100 relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#375421]/5 rounded-full blur-3xl group-hover:bg-[#375421]/10 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-green-100/50">
                    <Sprout className="w-10 h-10 text-[#375421]" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available for redemption</span>
                    <span className="text-5xl font-black text-[#375421] tracking-tighter">
                       {data?.total_coins || 0} <span className="text-base font-bold text-gray-400 align-baseline ml-1 uppercase">Coins</span>
                    </span>
                 </div>
              </div>

              <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                <button
                  type="button"
                  onClick={getTransactionHistory}
                  className="px-6 py-3 bg-white text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] rounded-xl shadow-sm border border-gray-100 hover:bg-[#375421] hover:text-white transition-all flex items-center gap-2"
                >
                  <History size={14} />
                  History
                </button>
              </div>
            </div>
          </div>


          {/* Redeem Coins Input */}
          <div className="mb-12">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-4">Redeem Credits</h3>
            <div className="bg-gray-50 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-lg border border-gray-100">
              <input
                type="number"
                placeholder="Enter amount to convert..."
                value={redeemCoins}
                onChange={(e) => setRedeemCoins(e.target.value)}
                className="flex-1 bg-transparent border-none px-5 py-4 focus:ring-0 text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
              />
              <button
                onClick={handleRedeemCoins}
                disabled={loading}
                className="bg-gray-900 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#375421] transition-all disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? "Redeeming..." : "Redeem Now"}
              </button>
            </div>
          </div>

          {/* Earn Coins Section */}
          <div className="mb-12">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-6">Ways to Earn Credits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-lg transition-all duration-500 group flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#375421]/5 transition-colors">
                  <Users className="text-[#375421]" />
                </div>
                <div>
                   <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-tight mb-1">Refer Friends</h4>
                   <p className="text-[11px] text-gray-500 font-bold leading-tight uppercase tracking-tight">Earn 200 coins for every friend who orders</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-lg transition-all duration-500 group flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#375421]/5 transition-colors">
                  <Gift className="text-[#375421]" />
                </div>
                <div>
                   <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-tight mb-1">Botanical Rewards</h4>
                   <p className="text-[11px] text-gray-500 font-bold leading-tight uppercase tracking-tight">Earn 1 coin for every ₹10 spent on Gidan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redeem Coins Section */}
          <div className="mb-16">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-6">Tiered Redemptions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { coins: "200", discount: "₹50 Reward" },
                { coins: "500", discount: "₹150 Reward" },
                { coins: "1000", discount: "₹350 Reward" },
              ].map((reward, idx) => (
                <div key={idx} className="bg-gray-50/50 border border-transparent hover:border-[#375421]/10 rounded-[24px] p-8 text-center transition-all group">
                   <div className="text-[10px] text-[#375421] font-black uppercase tracking-widest mb-4 opacity-50 group-hover:opacity-100 transition-opacity">Tier {idx + 1}</div>
                   <p className="text-2xl font-black text-gray-900 mb-1">{reward.coins}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-6">Coins Required</p>
                   
                   <div className="bg-white py-4 rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#375421] group-hover:text-white transition-all">
                      <p className="text-[11px] font-black uppercase tracking-[0.1em]">{reward.discount}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mb-12">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-6">Common Inquiries</h3>
            <div className="space-y-4">
              {[
                {
                  q: "How do I earn GD Coins?",
                  a: "Earn through referrals (Refer Friends) and making plant purchases. 1 coin for every ₹10 spent."
                },
                {
                  q: "When do my credits expire?",
                  a: "GD Credits are valid for 12 months from the date of issuance."
                },
                {
                  q: "Can I transfer my coins?",
                  a: "GD Coins are account-specific and cannot be transferred to other users."
                }
              ].map((faq, idx) => (
                <details key={idx} className="group bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                  <summary className="text-[12px] font-black text-gray-900 uppercase tracking-tight py-4 px-6 cursor-pointer list-none flex justify-between items-center transition-all">
                    {faq.q}
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-400 group-open:rotate-180 transition-transform">
                      <ChevronLeft className="w-3 h-3 -rotate-90" />
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-[11px] text-gray-500 font-bold uppercase tracking-tight leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-site-bg/50 rounded-[24px] p-8">
            <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em] mb-6">Terms of Service</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              {[
                "GD Coins can be earned and redeemed on Gidan's platform.",
                "Referral credits apply after the first successful order.",
                "Credits cannot be exchanged for monetary value.",
                "Gidan reserves all modification rights to the program.",
                "Abuse of policy will result in instant forfeiture.",
                "Credits apply to plant products exclusively.",
                "Minimum purchase thresholds may apply for redemption.",
                "Coins maintain 12-month validity from issuance."
              ].map((term, i) => (
                <li key={i} className="flex gap-3">
                   <span className="text-[#375421] font-black text-xs">0{i+1}.</span>
                   <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-tight leading-tight">{term}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default GDCoins;
// ==========================old================
// import React, { useEffect, useState } from "react";
// import { Sprout, Gift, Users, History, HelpCircle } from "lucide-react";
// // import axiosInstace from "../../../Axios/axiosInstance";
// //
//
//
// const BTCoins = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     getBTcoinsWallet()
//   }, []);
//
//
//
//   const [data,setData] = useState(null);
//    const [redeemCoins, setRedeemCoins] = useState("");
//     const [loading, setLoading] = useState(false);
//
// const router = useRouter();
//
//   const getBTcoinsWallet = async()=>{
//     try {
//
//       const response = await axiosInstace.get("/btcoins/btcoinswallet/")
//       if (response.status===200) {
//         setData(response?.data)
//       }
//     } catch (error) {
//       console.log(error);
//
//     }
//   }
//
//   const getTransactionHistory= async()=>{
//     try {
//       const response = await axiosInstace.get(`/btcoins/btcoinsTransactions/`)
//       if (response.status === 200) {
//         router.push('/profile/history',{state:{resourse:response?.data?.data , data:data}})
//       }
//
//     } catch (error) {
//       console.log(error);
//
//     }
//   }
//
//
//     const handleRedeemCoins = async () => {
//     if (!redeemCoins) return;
//
//     try {
//       setLoading(true);
//       const response = await axiosInstace.post("/wallet/redeem-btcoins/", {
//         coins: redeemCoins,
//       });
//
//       if (response.status === 200 || response.status === 201) {
//         setRedeemCoins("");
//         getBTcoinsWallet(); // refresh balance after redeem
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//       <>
//         
//     <div className="flex justify-center sm:justify-start px-4 sm:px-6 bg-site-bg min-h-screen w-full">
//       <div className="w-full sm:w-full md:w-4/5 lg:w-full xl:w-full h-auto bg-white shadow-lg p-4 sm:p-6 rounded-lg">
//         {/* Total BT Coins Balance */}
//         <h2 className="text-lg font-semibold mb-2">BT Coins</h2>
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6">
//           <div className="flex flex-col justify-between items-center space-y-5">
//             <span className="text-gray-700 font-semibold flex items-center gap-2">
//               <Sprout className="text-[#375421]" />
//               Total BT Coins Balance
//             </span>
//             <span className="text-2xl font-bold text-[#375421]">{data?.total_coins} Coins</span>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <Link  onClick={getTransactionHistory} className="text-md font-semibold text-lime-600 self-end flex items-center gap-2">
//               <History size={18} />
//               Coins Transaction History
//             </Link>
//           </div>
//         </div>
//
//
//         {/* Redeem Coins Input */}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Redeem Coins</h2>
//             <div className="flex flex-col sm:flex-row gap-3 max-w-md">
//               <input
//                 type="number"
//                 placeholder="Enter coins to redeem"
//                 value={redeemCoins}
//                 onChange={(e) => setRedeemCoins(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#375421]"
//               />
//               <button
//                 onClick={handleRedeemCoins}
//                 disabled={loading}
//                 className="bg-lime-600 text-white px-2 py-1 rounded-md hover:bg-[#375421] hover:text-white disabled:opacity-60"
//               >
//                 {loading ? "Redeeming..." : "Redeem Coins"}
//               </button>
//             </div>
//           </div>
//
//         {/* Earn Coins Section */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold mb-4">Ways to Earn BT Coins</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-center gap-3 mb-2">
//                 <Users className="text-[#375421]" />
//                 <h3 className="font-semibold">Refer Friends</h3>
//               </div>
//               <p className="text-gray-600">Get 200 coins for each friend who makes their first purchase</p>
//             </div>
//             <div className="border border-green-100 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-center gap-3 mb-2">
//                 <Gift className="text-[#375421]" />
//                 <h3 className="font-semibold">Make Purchases</h3>
//               </div>
//               <p className="text-gray-600">Earn 1 coin for every ₹10 spent on plants</p>
//             </div>
//           </div>
//         </div>
//
//         {/* Redeem Coins Section */}
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold mb-4">Redeem Your Coins</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {[
//               { coins: "200", discount: "₹50 off" },
//               { coins: "500", discount: "₹150 off" },
//               { coins: "1000", discount: "₹350 off" },
//             ].map((reward, idx) => (
//               <div key={idx} className="bg-white border border-green-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
//                 <p className="text-xl font-bold text-[#375421]">{reward.coins} Coins</p>
//                 <p className="text-gray-600">Get {reward.discount}</p>
//                 {/* <button className="mt-3 w-full bg-lime-600 text-white px-4 py-2 rounded-md hover:bg-[#375421] hover:text-white">
//                   Redeem Now
//                 </button> */}
//               </div>
//             ))}
//           </div>
//         </div>
//
//         {/* FAQs Section */}
//         <div className="mb-6 px-4 bg-transparent border border-black-100">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <HelpCircle className="text-[#375421]" />
//             Frequently Asked Questions
//           </h2>
//           {[
//             {
//               q: "How do I earn BT Coins?",
//               a: "You can earn BT Coins by referring friends (100 coins per referral) and making purchases (1 coin per ₹10 spent)."
//             },
//             {
//               q: "When do my BT Coins expire?",
//               a: "BT Coins are valid for 12 months from the date they are earned."
//             },
//             {
//               q: "How can I redeem my BT Coins?",
//               a: "You can redeem your coins for discounts on plant purchases. Different coin amounts unlock different discount values."
//             },
//             {
//               q: "Can I transfer my BT Coins to someone else?",
//               a: "No, BT Coins are non-transferable and can only be used by the account holder who earned them."
//             }
//           ].map((faq, idx) => (
//             <details key={idx} className="mb-2">
//               <summary className="text-gray-700 py-2 cursor-pointer hover:text-gray-900">
//                 {faq.q}
//               </summary>
//               <p className="pl-4 text-gray-600 py-2">
//                 {faq.a}
//               </p>
//             </details>
//           ))}
//         </div>
//
//         {/* Terms & Conditions */}
//         <div className="px-2 sm:px-4 py-6">
//           <h2 className="text-xl sm:text-2xl text-left mb-4">Terms & Conditions</h2>
//           <ul className="list-decimal list-inside space-y-4">
//             <li>BT Coins are reward points that can be earned and redeemed on Gidan's platform.</li>
//             <li>Coins earned through referrals will be credited after the referred friend's first purchase.</li>
//             <li>Coins cannot be exchanged for cash or transferred to other accounts.</li>
//             <li>Gidan reserves the right to modify or terminate the BT Coins program at any time.</li>
//             <li>Any misuse of the referral system will result in the forfeiture of earned coins.</li>
//             <li>Coins can only be redeemed on plant purchases and cannot be used for accessories or gardening tools.</li>
//             <li>A minimum purchase value may be required to redeem coins for discounts.</li>
//             <li>Coins expire 12 months from the date of earning.</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//         </>
//   );
// };
//
// export default BTCoins;