import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./OrderSummary"; // Adjust the import path as needed

const AddAddressPageCheckout = () => {
  const navigate = useNavigate();
  const [addressType, setAddressType] = useState('home');

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="p-4 flex-1">
        <ProgressBar currentStep="address" />
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full border rounded-lg px-4 py-2"
          />
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Address Type</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={addressType === 'home'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="mr-2"
                />
                Home (All day delivery)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={addressType === 'work'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="mr-2"
                />
                Work/Office (9am-5pm)
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="p-4 space-y-3">
        <button 
          onClick={() => navigate('/address')}
          className="w-full py-3 border border-gray-300 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button 
          onClick={() => navigate('/address')}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AddAddressPageCheckout;