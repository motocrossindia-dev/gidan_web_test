import React from "react";
import { FaArrowLeft, FaShareAlt } from "react-icons/fa";
import referafriend from "../../../Assets/ReferAFriend.png"
const ReferFriendMobile = () => {
  const referralLink = "https://yourapp.com/referral";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Refer a Friend",
        text: "Join now and get rewards!",
        url: referralLink,
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => window.history.back()} className="mr-3">
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Refer A Friend</h1>
      </div>

      {/* Illustration */}
      <div className="flex justify-center p-6">
        <img name=" "   
          src={referafriend} // Replace with actual image URL
          alt="Refer a Friend"
          className="w-3/4 h-auto md:w-1/2"
        />
      </div>

      {/* Share Referral Input */}
      <div className="px-4">
        <div className="flex items-center bg-white shadow-md rounded-lg p-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full p-2 text-gray-600 outline-none bg-transparent"
          />
          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaShareAlt className="mr-2" /> Share
          </button>
        </div>
      </div>

      {/* Total Referrals */}
      <div className="p-4">
        <div className="bg-white shadow-md rounded-lg p-3 text-center text-green-700 font-semibold">
          Total Referrals: 0
        </div>
      </div>
    </div>
  );
};

export default ReferFriendMobile;
