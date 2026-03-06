'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { TrashIcon } from "lucide-react";
import { useSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import AddressForm from "@/components/Shared/AddressForm";

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
    setIsEditing(false);
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
            className="flex items-center gap-2 mt-4  p-4 mb-4 border rounded-lg  text-bio-green font-semibold hover:text-bio-green"
          >
            <span className="text-2xl font-bold">+</span> Add New Address
          </button>
        </div>
      </main>
    </>
  );
};

export default AddressSection;
