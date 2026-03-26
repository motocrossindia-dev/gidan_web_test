'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ProgressBar from "./OrderSummary";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import AddressForm from "@/components/Shared/AddressForm";

const AddressPage = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [editingAddress, setEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Nandkiph',
    lastName: 'Bondlwade',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    addressType: 'Home',
  });

  if (editingAddress) {
    return (
      <>
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          <div className="p-4 flex-1">
            <ProgressBar currentStep="address" />
            <AddressForm
              variant="checkout"
              initialValues={formData}
              saveLabel="Done"
              cancelLabel="Cancel"
              onSave={(saved) => { setFormData(saved); setEditingAddress(false); }}
              onCancel={() => setEditingAddress(false)}
            />
          </div>
        </div>
        <HomepageSchema />
        <StoreSchema />
      </>
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <div className="p-4 flex-1">
          <ProgressBar currentStep="address" />

          <button
            onClick={() => router.push('/add-address')}
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
              className="border rounded-lg p-4 mb-4 cursor-pointer border-[#375421]"
              onClick={() => setSelectedAddress(0)}
            >
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium">{formData.firstName} {formData.lastName}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(true);
                      }}
                      className="text-sm text-[#375421]"
                    >
                      Edit
                    </button>
                  </div>
                  {formData.phone && <p className="text-sm text-gray-600 mt-1">{formData.phone}</p>}
                  {formData.address && <p className="text-sm text-gray-600">{formData.address}</p>}
                  {formData.city && (
                    <p className="text-sm text-gray-600">
                      {formData.city}{formData.state ? `, ${formData.state}` : ''}{formData.pinCode ? ` - ${formData.pinCode}` : ''}
                    </p>
                  )}
                  {formData.addressType && <p className="text-sm text-gray-500">Type: {formData.addressType}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => router.push('/order-summary')}
            className="w-full py-3 bg-[#375421] text-white rounded-lg font-medium"
          >
            Deliver Here
          </button>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default AddressPage;