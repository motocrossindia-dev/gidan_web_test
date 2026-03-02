'use client';

import { useRouter } from "next/navigation";
import React from "react";
import ProgressBar from "./OrderSummary";
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";
import axiosInstance from "../../../Axios/axiosInstance";
import AddressForm from "@/components/Shared/AddressForm";

const AddAddressPageCheckout = () => {
  const router = useRouter();

  const handleSave = async (form) => {
    try {
      const response = await axiosInstance.post(`/account/address/`, {
        first_name: form.firstName,
        last_name: form.lastName,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: parseInt(form.pinCode),
        phone: form.phone,
        address_type: form.addressType,
        is_default: false,
      });
      if (response.data.message === "success") {
        router.push("/address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <div className="p-4 flex-1">
          <ProgressBar currentStep="address" />
          <AddressForm
            variant="checkout"
            saveLabel="Done"
            cancelLabel="Cancel"
            onSave={handleSave}
            onCancel={() => router.push("/address")}
          />
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default AddAddressPageCheckout;