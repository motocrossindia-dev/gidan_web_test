'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { TrashIcon, ChevronLeft, ArrowLeft } from "lucide-react";
import { useSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import AddressForm from "@/components/Shared/AddressForm";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { useRouter } from "next/navigation";

const AddressSection = ({ onBack }) => {
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);

  const handleBackClick = () => {
    if (onBack) onBack();
    else router.push('/profile');
  };
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
      <div className="flex flex-col md:hidden bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-gray-100">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center text-[#375421] text-xs font-black uppercase tracking-tight"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Profile
          </button>
        </div>

        <div className="px-5 pb-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Address</h2>
        </div>
      </div>

      <div className="mt-0 md:hidden text-xs sm:text-sm">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="Address" 
        />
      </div>

      <main className="p-4 md:py-6 lg:py-8">
        <div className="bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 rounded-[32px] border border-gray-100">
          <div className="flex items-center justify-between mb-8">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#375421] uppercase tracking-[0.3em] mb-1.5">Saved Locations</span>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Address Book</h2>
             </div>
             <button
               onClick={handleAddNewAddress}
               className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#375421] transition-all"
             >
               + New Address
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {address.map((address, index) => (
              <div key={index} className={`relative p-6 rounded-[28px] border transition-all duration-500 ${address.is_default ? 'bg-site-bg/50 border-[#375421]/20 ring-1 ring-[#375421]/10 shadow-lg' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'}`}>
                {address.isEditing ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <h3 className="text-[9px] font-black text-[#375421] uppercase tracking-[0.2em] mb-5">{address.id ? "Modify Entry" : "Entry Registration"}</h3>
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
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="defaultAddress"
                            checked={address.is_default}
                            onChange={() => handleDefaultAddressChange(address.id)}
                            className="w-4 h-4 appearance-none border-2 border-gray-200 rounded-full checked:border-[#375421] transition-all cursor-pointer"
                          />
                          {address.is_default && <div className="absolute w-2 h-2 bg-[#375421] rounded-full"></div>}
                        </div>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{address.address_type}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-[#375421] hover:border-[#375421]/20 transition-all shadow-sm"
                          onClick={() => handleEdit(index)}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        {!address.is_default && (
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-100 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                            onClick={() => handleDelete(index, address.id)}
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-0.5">
                       <h4 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">{address.first_name} {address.last_name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-tight">{address.address}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{address.city}, {address.state} — {address.pincode}</p>
                    </div>
                    
                    <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex items-center text-[9px] font-black text-[#375421] uppercase tracking-widest">
                          {address.phone}
                       </div>
                       {address.is_default && (
                         <span className="bg-[#375421] text-white text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full">Primary</span>
                       )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={handleAddNewAddress}
              className="group h-full min-h-[180px] rounded-[28px] border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-[#375421]/30 hover:bg-site-bg transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#375421] group-hover:text-white transition-all shadow-sm">
                <span className="text-xl font-black">+</span>
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#375421]">New Registration</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressSection;
