'use client';



import React, { useState } from 'react';

function DeactivationConfirmation() {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleDeactivation = () => {
    console.log('Deactivating account with OTP:', otp);
  };

  return (
    <div className="w-full flex items-center justify-center bg-white-100 mt-20">
      <div className="bg-white p-8 rounded-md shadow-md w-full border border-black-100 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Are you sure you want to leave?
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              placeholder="Enter your Email ID"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <br />
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
            <input
              type="tel"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your phone number"
            />
          </label>
          <br />
          <label className="block text-sm font-medium text-gray-700">
            Enter received OTP
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={otp}
              onChange={handleOtpChange}
            />
          </label>
        </div>
        <br />
        <div className="flex justify-between">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDeactivation}
          >
            Confirm Deactivation
          </button>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            No, let's stay!
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeactivationConfirmation;
