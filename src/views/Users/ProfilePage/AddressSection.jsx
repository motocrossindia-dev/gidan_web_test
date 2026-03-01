'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { TrashIcon } from "lucide-react";
import { useSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";

const AddressSection = () => {
  const accessToken = useSelector(selectAccessToken);
  const [address, setAddress] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    fetchAddresses();
  }, [accessToken]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(
        `/account/address/`);
      if (response.status === 200) {
        setAddress(response.data.data.address);

      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleDefaultAddressChange = async (addressId) => {
    try {
      const response = await axiosInstance.patch(
        `/account/address/${addressId}/`,
        { is_default: true },

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
    setAddress((prev) => {
      const updatedAddrs = [...prev];
      updatedAddrs[index] = { ...updatedAddrs[index], [field]: value };

      // Immediately clear city and state if pincode is modified and not 6 digits
      if (field === "pinCode") {
        const pinStr = String(value).trim();
        if (pinStr.length !== 6) {
          updatedAddrs[index].city = "";
          updatedAddrs[index].state = "";
        }
      }
      return updatedAddrs;
    });

    if (field === "pinCode") {
      const pinStr = String(value).trim();
      if (pinStr.length === 6) {
        fetch(`https://api.postalpincode.in/pincode/${pinStr}`)
          .then((res) => res.json())
          .then((responseData) => {
            if (responseData && responseData[0].Status === "Success") {
              const data = responseData[0].PostOffice[0];
              setAddress((prev) => {
                const newAddrs = [...prev];
                newAddrs[index] = {
                  ...newAddrs[index],
                  city: data.District || data.Block || data.Name || "",
                  state: data.State || "",
                };
                return newAddrs;
              });
            } else {
              setAddress((prev) => {
                const newAddrs = [...prev];
                newAddrs[index] = { ...newAddrs[index], city: "", state: "" };
                return newAddrs;
              });
            }
          })
          .catch((err) => console.error("Error looking up Pincode:", err));
      }
    }
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
    setIsEditing(true);
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
    setIsEditing(false);
  };

  const handleSaveEdit = async (index) => {
    const currentAddress = address[index];

    const addressData = {
      first_name: currentAddress.firstName || currentAddress.first_name,
      last_name: currentAddress.lastName || currentAddress.last_name,
      address: currentAddress.address,
      city: currentAddress.city,
      state: currentAddress.state,
      address_type: currentAddress.addressType || currentAddress.address_type,
      pincode: parseInt(currentAddress.pinCode || currentAddress.pincode),
      phone: currentAddress.phone,
      is_default: currentAddress.isDefault || currentAddress.is_default || false,
    };

    try {
      const response = await axiosInstance.post(
        `/account/address/`,
        addressData,

      );

      if (response.data.message === "success") {
        fetchAddresses();
        setIsEditing(false);
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
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDelete = async (index, addressId) => {
    try {
      const response = await axiosInstance.delete(`/account/address/${addressId}/`);

      if (response.data.message === "Address deleted successfully.") {
        const updatedAddresses = [...address];
        updatedAddresses.splice(index, 1);
        setAddress(updatedAddresses);
      }
    } catch (error) {
      if (
        error.response?.data?.message === "Default address cannot be deleted."
      ) {
        alert("Default address cannot be deleted.");
      } else {
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <>
      <main className="p-8">
        <div className="border p-6 rounded bg-white">
          <h2 className="text-2xl font-bold mb-4">Address</h2>
          {address.map((address, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg ">
              {address.isEditing ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Edit Address</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold"
                      onClick={() => handleCancelEdit(index)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={address.firstName || address.first_name || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "firstName", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={address.lastName || address.last_name || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "lastName", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Apartment, Suite, etc. (Optional)"
                      value={address.address || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "address", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City (Auto-filled by PIN Code)"
                      value={address.city || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "city", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 cursor-not-allowed"
                      readOnly
                      required
                    />
                    <input
                      type="text"
                      placeholder="State (Auto-filled by PIN Code)"
                      value={address.state || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "state", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100 cursor-not-allowed"
                      readOnly
                      required
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="PIN Code"
                      value={address.pinCode !== undefined ? address.pinCode : (address.pincode || "")}
                      maxLength={6}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                        handleAddressChange(index, "pinCode", value);
                      }}
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block font-semibold">Address Type</label>
                    <div className="flex space-x-4 mt-2">
                      <label>
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
                          className="mr-2"
                        />
                        Home (All day Delivery)
                      </label>
                      <label>
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
                          className="mr-2"
                        />
                        Work (9am - 6pm)
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-bio-green text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
                      onClick={
                        address.id
                          ? () => handleSaveEditChanges(index)
                          : () => handleSaveEdit(index)
                      }
                    >
                      Save Address
                    </button>
                    <button
                      className="border border-bio-green text-bio-green font-semibold py-2 px-4 rounded hover:bg-green-100"
                      onClick={() => handleCancelEdit(index)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="defaultAddress"
                        checked={address.is_default}
                        onChange={() => handleDefaultAddressChange(address.id)}
                        className="w-4 h-4 text-bio-green"
                      />
                      <span className="font-bold">{`${address.first_name} ${address.last_name}`}</span>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="text-bio-green hover:text-bio-green font-semibold"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      {!address.is_default && (
                        <button
                          className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2"
                          onClick={() => handleDelete(index, address.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                  <p>{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                  <p>{`Type: ${address.address_type}`}</p>
                  {address.is_default && (
                    <p className="text-bio-green font-semibold mt-2">
                      Default Address
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleAddNewAddress}
            className="flex items-center gap-2 mt-4  p-4 mb-4 border rounded-lg  text-blue-700 font-semibold hover:text-blue-600"
          >
            <span className="text-2xl font-bold">+</span> Add New Address
          </button>
        </div>
      </main>
    </>
  );
};

export default AddressSection;
