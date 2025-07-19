import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import giftcard from "../../../Assets/Gift/Gift card 1.png"
const AddGiftCardMobile = () => {
  const [giftCardNumber, setGiftCardNumber] = useState("");

  const handleApply = () => {
    alert(`Gift Card ${giftCardNumber} applied!`);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={() => window.history.back()} className="mr-3">
          <FaArrowLeft className="text-gray-700 text-xl" />
        </button>
        <h1 className="text-lg font-semibold">Add Gift Card</h1>
      </div>

      {/* Card Container */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
       
        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <img name=" "   
            src={giftcard } // Replace with actual image URL
            alt="Gift Card"
            className="w-3/4 md:w-1/2"
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={giftCardNumber}
          onChange={(e) => setGiftCardNumber(e.target.value)}
          placeholder="Enter Gift Card Number"
          className="w-full p-2 border rounded-md outline-none text-gray-700"
        />

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-md text-lg font-semibold"
        >
          Apply
        </button>
    </div>
    </div>
  );
};

export default AddGiftCardMobile;
