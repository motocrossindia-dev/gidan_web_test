'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { TrashIcon } from "lucide-react";
import Verify from "../../../Services/Services/Verify";
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";







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
    const newAddress = {
      isEditing: true,
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      phone: "",
      addressType: "",
      isDefault: false,
    };
    setAddress([...address, newAddress]);
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...address];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
    setAddress(updatedAddresses);
  };

  const handleEdit = (index) => {
    const updatedAddresses = [...address];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      isEditing: true,
      firstName: updatedAddresses[index].first_name,
      lastName: updatedAddresses[index].last_name,
      pinCode: updatedAddresses[index].pincode,
      addressType: updatedAddresses[index].address_type,
      address: updatedAddresses[index].address,
      city: updatedAddresses[index].city,
      state: updatedAddresses[index].state,
      phone: updatedAddresses[index].phone,
    };
    setAddress(updatedAddresses);
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

  const handleSaveEdit = async (index) => {
    const currentAddress = address[index];

    const addressData = {
      first_name: currentAddress.firstName,
      last_name: currentAddress.lastName,
      address: currentAddress.address,
      city: currentAddress.city,
      state: currentAddress.state,
      address_type: currentAddress.addressType,
      pincode: parseInt(currentAddress.pinCode),
      phone: currentAddress.phone,
      is_default: currentAddress.isDefault || false,
    };

    try {
      const response = await axiosInstance.post(
        `/account/address/`,
        addressData,
        
      );

      if (response.data.message === "success") {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

      const handleSaveEditChanges = async (index) => {
        const currentAddress = address[index];
      
        const addressData = {
          address_id: currentAddress.id,
          first_name: currentAddress.firstName || currentAddress.first_name,
          last_name: currentAddress.lastName || currentAddress.last_name,
          address: currentAddress.address,
          city: currentAddress.city,
          state: currentAddress.state,
          address_type: currentAddress.addressType || currentAddress.address_type,
          pincode: parseInt(currentAddress.pinCode || currentAddress.pincode),
          phone: currentAddress.phone,
          is_default:
            currentAddress.isDefault || currentAddress.is_default || false,
        };
      
        try {
          const response = await axiosInstance.patch(
            `/account/address/`,
            addressData,

          );
      
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <span className="font-bold text-lg">Edit Address</span>
                        <button
                          className="text-red-500 hover:text-red-700 font-semibold py-2 px-3 border border-red-200 rounded text-sm self-start sm:self-auto"
                          onClick={() => handleCancelEdit(index)}
                        >
                          Cancel
                        </button>
                      </div>
                      
                      {/* Form Grid - Single column on mobile, two columns on desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={address.firstName || address.first_name || ""}
                          onChange={(e) =>
                            handleAddressChange(index, "firstName", e.target.value)
                          }
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={address.lastName || address.last_name || ""}
                          onChange={(e) =>
                            handleAddressChange(index, "lastName", e.target.value)
                          }
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        />
                        
                        {/* Full width address field */}
                        <input
                          type="text"
                          placeholder="Apartment, Suite, etc. (Optional)"
                          value={address.address || ""}
                          onChange={(e) =>
                            handleAddressChange(index, "address", e.target.value)
                          }
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:col-span-2"
                          required
                        />
                        
                        <input
                          type="text"
                          placeholder="City"
                          value={address.city || ""}
                          onChange={(e) =>
                            handleAddressChange(index, "city", e.target.value)
                          }
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        />
                        
                        <select
                          value={address.state || ""}
                          onChange={(e) =>
                            handleAddressChange(index, "state", e.target.value)
                          }
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        >
                          <option value="" disabled>
                            Select State
                          </option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Punjab">Punjab</option>
                        </select>
                        
                        <input
                          type="number"
                          placeholder="PIN Code"
                          value={address.pinCode || address.pincode || ""}
                          maxLength={6}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 6);
                            handleAddressChange(index, "pinCode", value);
                          }}
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        />
                        
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={address.phone || ""}
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 10);
                            handleAddressChange(index, "phone", value);
                          }}
                          className="p-3 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                          required
                        />
                      </div>
                      
                      {/* Address Type Selection */}
                      <div className="mt-4">
                        <label className="block font-semibold mb-3">Address Type</label>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                          <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50">
                            <input
                              type="radio"
                              name={`addressType-${index}`}
                              checked={
                                address.addressType === "Home" ||
                                address.address_type === "Home"
                              }
                              onChange={() =>
                                handleAddressChange(index, "addressType", "Home")
                              }
                              className="mr-3 w-4 h-4"
                            />
                            <span className="text-sm sm:text-base">Home (All day Delivery)</span>
                          </label>
                          <label className="flex items-center cursor-pointer p-2 border rounded hover:bg-gray-50">
                            <input
                              type="radio"
                              name={`addressType-${index}`}
                              checked={
                                address.addressType === "Work" ||
                                address.address_type === "Work"
                              }
                              onChange={() =>
                                handleAddressChange(index, "addressType", "Work")
                              }
                              className="mr-3 w-4 h-4"
                            />
                            <span className="text-sm sm:text-base">Work (9am - 6pm)</span>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                        <button
                          className="bg-bio-green text-white font-semibold py-3 px-4 rounded hover:bg-green-600 text-base w-full sm:w-auto"
                          onClick={
                            address.id
                              ? () => handleSaveEditChanges(index)
                              : () => handleSaveEdit(index)
                          }
                        >
                          Save Address
                        </button>
                        <button
                          className="border border-bio-green text-bio-green font-semibold py-3 px-4 rounded hover:bg-green-100 text-base w-full sm:w-auto"
                          onClick={() => handleCancelEdit(index)}
                        >
                          Cancel
                        </button>
                      </div>
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
          <HomepageSchema/>
          <StoreSchema/>
        </>
  );
};

export default AddressSection;

