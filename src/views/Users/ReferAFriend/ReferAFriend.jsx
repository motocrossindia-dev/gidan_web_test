'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiShare2 } from "react-icons/fi";
import __Refer from "../../../Assets/ReferAFriend.webp"; // Ensure the image path is correct
const Refer = typeof __Refer === 'string' ? __Refer : __Refer?.src || __Refer;
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";import { ArrowLeft } from "lucide-react";


function ReferAFriend() {

  const [data, setData] = useState(null)

  const getBTcoinsWallet = async () => {
    try {

      const response = await axiosInstance.get("/btcoins/btcoinswallet/")
      if (response.status === 200) {
        setData(response?.data)
      }
    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    getBTcoinsWallet()
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  const handleShare = () => {
    const referralCode = data?.referral_code || "No Referral Code"; // Default if empty
    const text = `Hey! I invite you to join Gidan. Use my referral code:
: ${referralCode}`;
    const url = `https://www.gidan.store/`;

    if (navigator.share) {
      navigator.share({
        title: "Gidan Referral",
        text: `${text}\n${url}`,
      })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };


  return (
    <>
      <div className="flex flex-col md:hidden bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-gray-100">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-[#375421] text-xs font-black uppercase tracking-tight"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Profile
          </button>
          <div className="flex items-center gap-4 text-[10px] font-black text-[#375421] uppercase tracking-widest">
             <button className="hover:underline">Rules</button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Referrals</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen bg-site-bg p-4 md:py-8 lg:py-12">
        {/* Main Card */}
        {/* Main Card */}
        <div className="bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 rounded-[32px] border border-gray-100 w-full max-w-5xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6 pb-8 border-b border-gray-50">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em] mb-2">Rewards Protocol</span>
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                Inspire <span className="text-[#375421] italic">Growth</span>
              </h1>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 max-w-[320px]">Invite your botanical circle to Join Gidan.</p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Network Scale</span>
               <div className="bg-site-bg border border-[#375421]/10 px-4 py-2 rounded-full shadow-sm">
                 <span className="text-[10px] font-black text-[#375421] uppercase tracking-widest">Total Referrals: </span>
                 <span className="text-sm font-black text-[#375421] ml-1">{data?.total_referrals || 0}</span>
               </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Utility: Code & Share */}
            <div className="lg:col-span-5 space-y-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-[#375421]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src={Refer}
                  alt="Refer a Friend"
                  loading="lazy"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto relative z-10"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block text-center lg:text-left ml-1">
                  Unique Referral Seed
                </label>
                <div className="flex flex-col gap-3">
                  <div className="h-[60px] bg-gray-50/50 border border-transparent px-6 rounded-2xl flex items-center justify-center text-base font-black text-gray-900 tracking-[0.3em] uppercase bg-site-bg shadow-inner">
                    {data?.referral_code || "GIDAN-MEMBER"}
                  </div>
                  <button
                    className="w-full h-[60px] bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] flex justify-center items-center rounded-2xl hover:bg-[#375421] transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                    onClick={handleShare}
                  >
                    <FiShare2 className="mr-2.5 w-4 h-4" /> SHARE JOURNEY
                  </button>
                </div>
              </div>
            </div>

            {/* Right Utility: Instructions & Terms */}
            <div className="lg:col-span-1 border-l border-gray-50 h-full hidden lg:block"></div>

            <div className="lg:col-span-6 space-y-12">
              {/* How it Works Redesign */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-8 h-8 rounded-full bg-[#375421] flex items-center justify-center text-white text-[11px] font-black">1</div>
                   <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-[0.2em]">How to Share Growth</h3>
                </div>
                
                <div className="space-y-8 pl-4 border-l border-gray-50 ml-4">
                   <div className="relative">
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        <span className="text-gray-900">Invite Circle:</span> Copy your unique referral seed and share it with friends via your preferred botanical community platforms.
                      </p>
                   </div>
                   <div className="relative">
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        <span className="text-gray-900">Member Registration:</span> Ensure your invitees use your unique code during their registration journey on the Gidan platform.
                      </p>
                   </div>
                   <div className="relative">
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                        <span className="text-gray-900">Cultivate Rewards:</span> Once they complete their first botanical order, both souls earn verified GD Coins for future nursery acquisitions.
                      </p>
                   </div>
                </div>
              </div>

              {/* Terms Section Redesign */}
              <div className="pt-10 border-t border-gray-50">
                <h3 className="text-[10px] font-black text-[#375421] uppercase tracking-[0.3em] mb-6">Redemption Protocol</h3>
                <ul className="space-y-4">
                  {[
                    "Rewards are issued as verified GD Coins within the Gidan neural network.",
                    "Redeemable across all botanical categories on gidan.store or our mobile protocols.",
                    "Verify your unique seed in the Dashboard to ensure accurate attribute tracking.",
                    "Coins from referrals typically unlock within 24 hours of successful invitee checkout.",
                    "Network rewards cannot be used for subscription-based botanical services.",
                    "Bulk order attributes are exempt from the standard referral protocol.",
                    "Referral seeds expire after one year of inactive account status."
                  ].map((term, i) => (
                    <li key={i} className="flex items-start gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                       <span className="w-1 h-1 rounded-full bg-[#375421] mt-1.5 flex-shrink-0" />
                       {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
}

export default ReferAFriend;
