'use client';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./OrderSummary";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema"; // Adjust the import path as needed

const AddressPage = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(0);

  return (
      <>

    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="p-4 flex-1">
        <ProgressBar currentStep="address" />
        
        <button 
          onClick={() => navigate('/add-address')}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 mb-6 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Address
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Deliver To:</h2>
          <div 
            className="border rounded-lg p-4 mb-4 cursor-pointer border-green-600"
            onClick={() => setSelectedAddress(0)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center justify-between w-full">
                  <h3 className="font-medium">Nandkiph Bondlwade</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/add-address');
                    }}
                    className="text-sm text-green-600"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">Maharashtra igst dtl cross bhilwara pin code</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <button 
          onClick={() => navigate('/order-summary')}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium"
        >
          Deliver Here
        </button>
      </div>
    </div>
        <HomepageSchema/>
        <StoreSchema/>
      </>
  );
};

export default AddressPage;