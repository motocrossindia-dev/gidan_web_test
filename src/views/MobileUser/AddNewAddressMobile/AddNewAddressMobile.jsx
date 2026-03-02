'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { TrashIcon } from "lucide-react";
import Verify from "../../../Services/Services/Verify";
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";
import AddressForm from "@/components/Shared/AddressForm";







const AddressSection = () => {
  const accessToken = useSelector(selectAccessToken);
  const [address, setAddress] = useState([]);

  const fetchAddresses = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/account/address/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAddress(response.data.data.address || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);




  const handleDefaultAddressChange = async (addressId) => {
    try {
      const response = await axiosInstance.patch(
        `/account/address/${addressId}/`,
        { is_default: true }

      );

      if (response.data.message === "success") {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error changing default address:", error);
    }
  };

  const handleAddNewAddress = () => {
    setAddress((prev) => [...prev, { isEditing: true, isDefault: false }]);
  };

  const handleEdit = (index) => {
    setAddress((prev) =>
      prev.map((a, i) => (i === index ? { ...a, isEditing: true } : a))
    );
  };

  const handleCancelEdit = (index) => {
    const updatedAddresses = [...address];
    if (!updatedAddresses[index].id) {
      updatedAddresses.splice(index, 1);
    } else {
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        isEditing: false,
      };
    }
    setAddress(updatedAddresses);
  };

  const handleSaveEdit = async (index, formData) => {
    const currentAddress = address[index];
    const addressData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      address_type: formData.addressType,
      pincode: parseInt(formData.pinCode),
      phone: formData.phone,
      is_default: currentAddress.is_default || false,
    };
    try {
      const response = await axiosInstance.post(`/account/address/`, addressData);
      if (response.data.message === "success") {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleSaveEditChanges = async (index, formData) => {
    const currentAddress = address[index];
    const addressData = {
      address_id: currentAddress.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      address_type: formData.addressType,
      pincode: parseInt(formData.pinCode),
      phone: formData.phone,
      is_default: currentAddress.is_default || false,
    };
    try {
      const response = await axiosInstance.patch(`/account/address/`, addressData);
      if (response.data.message === "success") {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDelete = async (index, addressId) => {
    try {
      const response = await axiosInstance.delete(
        `/account/address/${addressId}/`,


      );

      if (response.data.message === "Address deleted successfully.") {
        const updatedAddresses = [...address];
        updatedAddresses.splice(index, 1);
        setAddress(updatedAddresses);
      }
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Default address cannot be deleted."
      ) {
        alert("Default address cannot be deleted.");
      } else {
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <>
      {/* <Header />
        <Navigation/> */}
      <div className="mobile-view">
        <Verify />
        <main className="p-4 sm:p-4">
          <div className="border p-4 sm:p-6 rounded bg-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Address</h2>
            {address.map((address, index) => (
              <div key={index} className="p-3 sm:p-4 mb-4 border rounded-lg">
                {address.isEditing ? (
                  <div>
                    <p className="font-bold text-lg mb-3">{address.id ? "Edit Address" : "New Address"}</p>
                    <AddressForm
                      variant="profile"
                      formIndex={index}
                      initialValues={{
                        firstName: address.first_name || "",
                        lastName: address.last_name || "",
                        address: address.address || "",
                        city: address.city || "",
                        state: address.state || "",
                        pinCode: String(address.pincode || ""),
                        phone: address.phone || "",
                        addressType: address.address_type || "Home",
                      }}
                      onSave={(formData) =>
                        address.id
                          ? handleSaveEditChanges(index, formData)
                          : handleSaveEdit(index, formData)
                      }
                      onCancel={() => handleCancelEdit(index)}
                    />
                  </div>
                ) : (
                  <div>
                    {/* Address Display Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="defaultAddress"
                          checked={address.is_default}
                          onChange={() => handleDefaultAddressChange(address.id)}
                          className="w-4 h-4 text-bio-green mt-1 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-base sm:text-lg block">
                            {`${address.first_name} ${address.last_name}`}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 sm:gap-4 self-start">
                        <button
                          className="text-bio-green hover:text-bio-green font-semibold py-2 px-3 border border-bio-green rounded text-sm min-w-[60px]"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        {!address.is_default && (
                          <button
                            className="text-red-600 hover:text-red-700 font-semibold flex items-center p-2 border border-red-200 rounded"
                            onClick={() => handleDelete(index, address.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="pl-7 space-y-1 text-sm sm:text-base text-gray-700">
                      <p className="font-medium">{address.phone}</p>
                      <p>{address.address}</p>
                      <p>{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                      <p className="text-gray-600">{`Type: ${address.address_type}`}</p>
                      {address.is_default && (
                        <p className="text-bio-green font-semibold mt-2 text-sm">
                          ✓ Default Address
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Address Button */}
            <button
              onClick={handleAddNewAddress}
              className="flex items-center justify-center gap-3 mt-4 p-4 mb-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-700 font-semibold hover:text-blue-600 hover:border-blue-400 w-full transition-colors"
            >
              <span className="text-xl font-bold">+</span>
              <span className="text-base">Add New Address</span>
            </button>
          </div>
        </main>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </>
  );
};

export default AddressSection;

