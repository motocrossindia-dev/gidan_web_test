'use client';


import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Tag, CheckCircle, Pencil, ChevronDown, Check } from 'lucide-react';
import RazorpayPayment from "../RazorPayment/RazorpayPayment";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo, trackPurchase } from "../../../utils/ga4Ecommerce";
import RightDrawer from "../../../components/Shared/RightDrawer";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });


const DeliveryAddress = ({ setSelectedAddress, selectedAddress, setSelectedOption, setIsAddNewOpen, isAddNewOpen, onConfirmStore, isGift, setIsGift }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedDelType, setSelectedDelType] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [confirmingStore, setConfirmingStore] = useState(false);
  const [storeConfirmed, setStoreConfirmed] = useState(false);

  const deliveryOptions = [
    { id: "DoorDelivery", label: "Door Delivery" },
    { id: "Pick Up Store", label: "Pickup From Store" }
  ];

  useEffect(() => {
    fetchAllAddresses();
    getStoreList();
  }, [accessToken, selectedAddress]);

  const fetchAllAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/account/address/`);
      const allAddresses = response.data.data.address || [];
      setAddresses(allAddresses);

      const defaultAddress = allAddresses.find((addr) => addr.is_default) || allAddresses[0];
      if (defaultAddress && !selectedAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      enqueueSnackbar("Failed to load addresses. Please refresh and try again.", { variant: "error" });
    }
  };

  const selectedAddrObj = addresses.find(a => a.id === selectedAddress);

  const getStoreList = async () => {
    try {
      const response = await axiosInstance.get('/store/store_list/');
      if (response.status === 200) {
        setStores(response?.data?.data?.stores || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
      enqueueSnackbar("Failed to load store list. Please refresh and try again.", { variant: "error" });
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedDelType(optionId);
    setSelectedOption({ deliveryType: optionId, storeId: null });
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStoreId(storeId);
    setSelectedOption({ deliveryType: selectedDelType, storeId });
    setStoreConfirmed(false); // reset confirmation when store changes
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="font-sans space-y-6">
      {/* 1. Delivery Address Container */}
      <section className="bg-white p-6 rounded-xl shadow-sm animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-2">
          <div className="flex items-center gap-3">
            <span className="bg-bio-green text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Delivery Address</h3>
          </div>
          <div className="flex gap-4">
            {addresses.length > 0 && (
              <button
                onClick={() => setShowAllAddresses(!showAllAddresses)}
                className="text-xs font-bold text-bio-green hover:text-[#051d18] transition-colors"
              >
                {showAllAddresses ? "Show Selected" : "Change"}
              </button>
            )}
          </div>
        </div>

        {!showAllAddresses && selectedAddrObj ? (
          <div className="p-5 border border-bio-green bg-green-50 rounded-2xl relative animate-in fade-in duration-300 shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full border-2 border-bio-green flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-bio-green"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedAddrObj.address_type && (
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider flex items-center gap-1 ${selectedAddrObj.address_type.toLowerCase() === 'home'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                      {selectedAddrObj.address_type.toUpperCase()}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{`${selectedAddrObj.first_name} ${selectedAddrObj.last_name}`}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-1">
                  {selectedAddrObj.address}, {selectedAddrObj.city}, {selectedAddrObj.state} — {selectedAddrObj.pincode}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                  <span className="text-gray-400">PH:</span>
                  <span>+91 {selectedAddrObj.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="max-h-[380px] overflow-y-auto px-1 py-1 custom-scroll space-y-3">
              {addresses.map((addr, index) => (
                <div
                  key={addr.id || index}
                  onClick={() => {
                    setSelectedAddress(addr.id);
                    setShowAllAddresses(false);
                  }}
                  className={`p-5 pl-14 border rounded-2xl cursor-pointer relative transition-all ${selectedAddress === addr.id
                    ? 'border-bio-green bg-green-50/40 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-bio-green' : 'border-gray-300'
                      }`}>
                      {selectedAddress === addr.id && <div className="h-3 w-3 rounded-full bg-bio-green"></div>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      {addr.address_type && (
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider ${addr.address_type.toLowerCase() === 'home'
                          ? 'bg-green-100 text-green-700 border border-transparent'
                          : 'bg-blue-100 text-blue-700 border border-transparent'
                          }`}>
                          {addr.address_type.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-gray-800 text-base mb-1">{`${addr.first_name} ${addr.last_name}`}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed mb-1 font-medium">
                      {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium font-semibold">
                      <span>PH:</span>
                      <span className="text-gray-600">+91 {addr.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsAddNewOpen(true);
                setTimeout(() => {
                  document.getElementById('add-new-address-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full p-4 border-2 border-dashed border-green-200 rounded-2xl flex items-center justify-center gap-2 text-bio-green cursor-pointer bg-white transition-colors hover:bg-green-50 sticky bottom-0 mt-2 shadow-sm"
            >
              <span className="text-xl font-light">+</span>
              <span className="font-bold text-xs uppercase tracking-tight">Add a new delivery address</span>
            </button>
          </div>
        )}

        {/* Inline Add New Address Form */}
        {isAddNewOpen && (
          <div className="mt-8 border-t-2 border-dashed border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <AddNewAddress isOpen={isAddNewOpen} setIsOpen={setIsAddNewOpen} />
          </div>
        )}
      </section>

      {/* 2. Choose Delivery Method Container */}
      <section className="bg-white p-6 rounded-xl shadow-sm animate-in fade-in duration-500 delay-150">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-6">
          <span className="bg-bio-green text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Choose Delivery Method</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {deliveryOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionChange(option.id)}
              className={`flex-1 p-5 rounded-2xl cursor-pointer relative border transition-all ${selectedDelType === option.id
                ? 'border-bio-green bg-green-50/40 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedDelType === option.id ? 'border-bio-green' : 'border-gray-300'
                  }`}>
                  {selectedDelType === option.id && <div className="h-3 w-3 rounded-full bg-bio-green"></div>}
                </div>
                <div className="flex-1">
                  <span className={`text-base font-extrabold uppercase tracking-tight transition-colors ${selectedDelType === option.id ? 'text-gray-900' : 'text-gray-500'}`}>
                    {option.label}
                  </span>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {option.id === 'DoorDelivery' ? 'Delivery to your selected address' : 'Collect from our nearest store'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedDelType === 'Pick Up Store' && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-dashed border-gray-100 pt-6">
            <label className="block mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Select pickup store</label>
            
            <div className="relative group">
              <select
                value={selectedStoreId || ""}
                onChange={(e) => handleStoreSelect(Number(e.target.value))}
                className="w-full h-[64px] pl-14 pr-12 bg-white border-2 border-[#2A333E] rounded-[20px] appearance-none cursor-pointer focus:outline-none transition-all font-extrabold text-sm md:text-[15px] text-[#2A333E] uppercase tracking-tight shadow-sm"
              >
                <option value="" disabled className="text-gray-400 font-medium">Select a store Location</option>
                {stores && stores.length > 0 ? (
                  stores.map((store) => (
                    <option key={store.id} value={store.id} className="">
                      {store.address || store.pathname || 'Store Location'}
                    </option>
                  ))
                ) : (
                  <option disabled>No stores available</option>
                )}
              </select>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-bio-green">
                <ChevronDown size={22} strokeWidth={2.5} />
              </div>
            </div>

            {/* Display Selected Store Address Details */}
            {selectedStoreId && stores.find(s => s.id === selectedStoreId) && (
              <div className="mt-4 p-6 bg-green-50/40 border border-bio-green rounded-2xl animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">
                      {stores.find(s => s.id === selectedStoreId)?.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gift Option */}
        <div className="mt-8 pt-6 border-t border-dashed border-gray-100">
          <label 
            className="flex items-center gap-4 cursor-pointer group w-fit"
            onClick={() => setIsGift(!isGift)}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isGift ? 'bg-bio-green border-bio-green' : 'border-gray-300 group-hover:border-bio-green'}`}>
              {isGift && <Check size={16} strokeWidth={4} className="text-white" />}
            </div>
            <span className={`text-sm font-extrabold uppercase tracking-tight transition-colors ${isGift ? 'text-gray-900' : 'text-gray-500'}`}>
              This is a gift
            </span>
          </label>
          <p className="text-xs text-gray-400 font-medium mt-1 ml-10">
            Let us know if this is a gift and we'll ensure a special experience.
          </p>
        </div>
      </section>
    </div>
  );
};



const AddNewAddress = ({ isOpen, setIsOpen }) => {
  const accessToken = useSelector(selectAccessToken);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    addressType: "",
    isDefault: false,
  });
  const [newAddressErrors, setNewAddressErrors] = useState({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddressChange = (field, value) => {
    setNewAddressErrors((prev) => ({ ...prev, [field]: '' }));
    setNewAddress((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "pinCode") {
        const pinStr = String(value).trim();
        if (pinStr.length !== 6) {
          updated.city = "";
          updated.state = "";
        }
      }
      return updated;
    });

    if (field === "pinCode") {
      const pinStr = String(value).trim();
      if (pinStr.length === 6) {
        fetch(`https://api.postalpincode.in/pincode/${pinStr}`)
          .then((res) => res.json())
          .then((responseData) => {
            if (responseData && responseData[0].Status === "Success") {
              const data = responseData[0].PostOffice[0];
              setNewAddress((prev) => ({
                ...prev,
                city: data.District || data.Block || data.Name || "",
                state: data.State || "",
              }));
            } else {
              setNewAddress((prev) => ({ ...prev, city: "", state: "" }));
            }
          })
          .catch((err) => console.error("Error looking up Pincode:", err));
      }
    }
  };

  const handleSaveNewAddress = async () => {
    const errs = {};
    if (!newAddress.firstName.trim()) errs.firstName = 'First name is required.';
    if (!newAddress.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!newAddress.address.trim()) errs.address = 'Address is required.';
    if (!newAddress.pinCode || String(newAddress.pinCode).length !== 6) errs.pinCode = 'Enter a valid 6-digit PIN code.';
    if (!newAddress.city.trim()) errs.city = 'City is required. Enter a valid PIN code to auto-fill.';
    if (!newAddress.state.trim()) errs.state = 'State is required. Enter a valid PIN code to auto-fill.';
    if (!newAddress.phone || String(newAddress.phone).length !== 10) errs.phone = 'Enter a valid 10-digit phone number.';
    if (!newAddress.addressType) errs.addressType = 'Please select an address type.';
    if (Object.keys(errs).length > 0) {
      setNewAddressErrors(errs);
      return;
    }
    const addressData = {
      first_name: newAddress.firstName,
      last_name: newAddress.lastName,
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      address_type: newAddress.addressType,
      pincode: parseInt(newAddress.pinCode),
      phone: newAddress.phone,
      is_default: newAddress.isDefault,
    };

    try {
      const response = await axiosInstance.post(
        `/account/address/`,
        addressData
      );

      if (response.data.message === "success") {
        setIsOpen(false);
        setNewAddress({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          state: "",
          pinCode: "",
          phone: "",
          addressType: "",
          isDefault: false,
        });
        enqueueSnackbar("Address added successfully!", { variant: "success" });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving address:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to save address. Please check your details and try again.",
        { variant: "error" }
      );
    }
  };

  return (
    <div id="add-new-address-section">
      <div className="bg-white">
        <h3 className="text-bio-green font-bold mb-2">Add New Address</h3>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveNewAddress(); }}>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="First name *"
                value={newAddress.firstName}
                onChange={(e) => handleAddressChange("firstName", e.target.value)}
                className={`border p-2 rounded w-full${newAddressErrors.firstName ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.firstName && <p className="text-red-500 text-xs mt-1">{newAddressErrors.firstName}</p>}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Last name *"
                value={newAddress.lastName}
                onChange={(e) => handleAddressChange("lastName", e.target.value)}
                className={`border p-2 rounded w-full${newAddressErrors.lastName ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.lastName && <p className="text-red-500 text-xs mt-1">{newAddressErrors.lastName}</p>}
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Apartment, suite, etc. *"
              value={newAddress.address}
              onChange={(e) => handleAddressChange("address", e.target.value)}
              className={`border p-2 rounded w-full${newAddressErrors.address ? ' border-red-500' : ''}`}
            />
            {newAddressErrors.address && <p className="text-red-500 text-xs mt-1">{newAddressErrors.address}</p>}
          </div>
          <div className="flex space-x-2">
            <div className="w-1/3">
              <input
                type="text"
                placeholder="City (Auto-filled) *"
                value={newAddress.city || ""}
                readOnly
                className={`border p-2 rounded w-full bg-gray-100 cursor-not-allowed${newAddressErrors.city ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.city && <p className="text-red-500 text-xs mt-1">{newAddressErrors.city}</p>}
            </div>
            <div className="w-1/3">
              <input
                type="text"
                placeholder="State (Auto-filled) *"
                value={newAddress.state || ""}
                readOnly
                className={`border p-2 rounded w-full bg-gray-100 cursor-not-allowed${newAddressErrors.state ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.state && <p className="text-red-500 text-xs mt-1">{newAddressErrors.state}</p>}
            </div>
            <div className="w-1/3">
              <input
                type="text"
                placeholder="PIN Code *"
                value={newAddress.pinCode}
                maxLength={6}
                onChange={(e) => handleAddressChange("pinCode", e.target.value.replace(/\D/g, ""))}
                className={`border p-2 rounded w-full${newAddressErrors.pinCode ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.pinCode && <p className="text-red-500 text-xs mt-1">{newAddressErrors.pinCode}</p>}
            </div>
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone *"
              value={newAddress.phone}
              maxLength={10}
              onChange={(e) => handleAddressChange("phone", e.target.value.replace(/\D/g, ""))}
              className={`border p-2 rounded w-full${newAddressErrors.phone ? ' border-red-500' : ''}`}
            />
            {newAddressErrors.phone && <p className="text-red-500 text-xs mt-1">{newAddressErrors.phone}</p>}
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Address Type *</p>
            <div className="flex space-x-4 items-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  checked={newAddress.addressType === "Home"}
                  onChange={() => handleAddressChange("addressType", "Home")}
                  className="mr-2"
                />
                Home
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  checked={newAddress.addressType === "Work"}
                  onChange={() => handleAddressChange("addressType", "Work")}
                  className="mr-2"
                />
                Work
              </label>
            </div>
            {newAddressErrors.addressType && <p className="text-red-500 text-xs mt-1">{newAddressErrors.addressType}</p>}
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="saveToProfile"
              checked={newAddress.isDefault}
              onChange={(e) => handleAddressChange("isDefault", e.target.checked)}
              className="w-4 h-4 text-bio-green border-gray-300 rounded focus:ring-bio-green"
            />
            <label htmlFor="saveToProfile" className="text-xs text-gray-600 font-medium cursor-pointer">
              Save in profile (Set as default)
            </label>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              type="submit"
              className="bg-[#062e25] text-white px-6 py-2 rounded-md font-bold hover:bg-[#051d18]"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};






const OrderSummaryItem = ({ id, title, Quantity, mrp, sales_price, discount, image, onUpdateQuantity, isEditing }) => {
  const qty = Number(Quantity) || 1;
  const unitMrp = Number(mrp) || 0;
  const unitPrice = qty > 0 ? (Number(sales_price) || 0) / qty : (Number(sales_price) || 0);
  const unitDisc = Number(discount) || 0;
  const totalSaving = unitDisc * qty;
  const savingPct = unitMrp > 0 && unitDisc > 0 ? Math.round((unitDisc / unitMrp) * 100) : 0;
  const lineTotal = Number(sales_price) || 0;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Items Description */}
      <td className="py-4 pr-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 p-1">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
              alt={title}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-snug max-w-[200px] line-clamp-2">{title}</h4>
            <p className="text-[11px] text-gray-400 font-medium">Standard Delivery</p>
          </div>
        </div>
      </td>

      {/* MRP */}
      <td className="py-4 px-3 text-center">
        <span className="text-sm font-bold text-gray-800">₹{Number(mrp).toFixed(2)}</span>
      </td>

      {/* Quantity */}
      <td className="py-4 px-3 text-center">
        {isEditing ? (
          <div className="flex items-center justify-center p-1.5 border border-bio-green bg-green-50 rounded-lg mx-auto w-fit shadow-sm gap-2">
            <button
              onClick={() => onUpdateQuantity(id, qty - 1)}
              disabled={qty <= 1}
              className="w-6 h-6 flex items-center justify-center bg-white border border-bio-green rounded-md text-bio-green font-bold text-lg hover:bg-bio-green hover:text-white transition-colors disabled:opacity-50"
            >
              −
            </button>
            <span className="w-8 text-center font-extrabold text-gray-800 text-sm">{qty}</span>
            <button
              onClick={() => onUpdateQuantity(id, qty + 1)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-bio-green rounded-md text-bio-green font-bold text-lg hover:bg-bio-green hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-sm font-extrabold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">{qty}</span>
        )}
      </td>

      {/* Savings */}
      <td className="py-4 px-3 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-green-600">₹{Number(discount).toFixed(2)}</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">SAVED</span>
        </div>
      </td>

      {/* Total */}
      <td className="py-4 pl-3 text-right">
        <span className="text-sm font-extrabold text-gray-800">₹{Number(sales_price).toFixed(2)}</span>
      </td>
    </tr>
  );
};















const OrderSummary = ({ selectedOption, selectedAddress, data, onUpdateData }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleUpdateQuantity = async (orderItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axiosInstance.patch(`/order/placeOrder/`, {
        order_id: data?.order?.id || data?.id || data?.order_id,
        order_item_id: orderItemId,
        quantity: newQuantity
      });

      if (response.data.message === "success") {
        onUpdateData(response.data.data);
        enqueueSnackbar("Quantity updated", { variant: "success" });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      enqueueSnackbar(error.response?.data?.message || "Failed to update quantity", { variant: "error" });
    }
  };

  const orderItems = data?.order_items || [];
  const orderData = data?.order || data;

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4 bg-white">
        <div className="flex items-center gap-3">
          <span className="bg-bio-green text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
          <h2 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-wide">
            Review your order
          </h2>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); if (!isOpen) setIsOpen(true); }}
          className="text-xs font-bold flex items-center gap-1 text-bio-green hover:bg-green-50 px-2 py-1 rounded-md transition-colors"
        >
          <Pencil size={14} /> Edit cart
        </button>
      </div>

      <div
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex -space-x-1 shrink-0">
            {orderItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:z-10 bg-gray-50">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
            <span className="font-extrabold text-gray-800 text-xs md:text-sm shrink-0 uppercase">
              Items ({orderItems.length})
            </span>
            <span className="text-gray-300 shrink-0">·</span>
            <span className="text-xs md:text-sm text-gray-400 truncate font-medium">
              {orderItems.map(i => i.product_name).join(", ")}
            </span>
          </div>
        </div>
        <div className={`text-gray-300 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={18} className="text-bio-green" />
        </div>
      </div>

      {isOpen && (
        <div className="bg-white rounded-b-md overflow-x-auto mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Items Description</th>
                <th className="text-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">MRP</th>
                <th className="text-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Qty</th>
                <th className="text-center text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Savings</th>
                <th className="text-right text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orderItems.map((item, idx) => (
                <OrderSummaryItem
                  key={item.id ?? idx}
                  id={item.id}
                  title={item.product_name}
                  Quantity={item.quantity}
                  mrp={item.mrp}
                  sales_price={item.selling_price}
                  discount={item.discount}
                  image={item.image}
                  onUpdateQuantity={handleUpdateQuantity}
                  isEditing={isEditing}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};






const ApplyCoupon = ({ id, setCoupon, coupon, onRemoveCoupon }) => {
  const [removing, setRemoving] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const accessToken = useSelector(selectAccessToken);
  const [coupons, setCoupons] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

  const getCoupones = async () => {
    if (!id) return;
    try {
      const response = await axiosInstance.get(`/coupon/coupons/?order_id=${id}`);
      if (response.status === 200) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      enqueueSnackbar("Failed to load available coupons.", { variant: "warning" });
    }
  };

  useEffect(() => {
    getCoupones();
  }, [id]);

  const applyCouponById = async (couponId) => {
    if (!id) {
      enqueueSnackbar("Order not found. Please restart checkout.", { variant: "error" });
      return;
    }
    if (!couponId) {
      enqueueSnackbar("Invalid coupon. Please try again.", { variant: "error" });
      return;
    }
    try {
      console.log("🎟️ Applying coupon ID:", couponId, "to order:", id);
      const response = await axiosInstance.post(
        `/order/applyCoupon/`,
        {
          selected_coupon_id: couponId,
          order_id: id,
        }
      );

      if (response.status === 200) {
        setCoupon(response.data);
        setShowDrawer(false);
        enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
      }
    } catch (error) {
      const responseData = error.response?.data;
      const errorMessage =
        (typeof responseData === 'object' && responseData !== null && responseData.error) ||
        (typeof responseData === 'string' && responseData) ||
        "Failed to apply coupon. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const applyManualCoupon = async () => {
    if (!couponCode.trim()) {
      enqueueSnackbar("Please enter a coupon code", { variant: "warning" });
      return;
    }

    const foundCoupon = coupons.find(c => c.code === couponCode.trim().toUpperCase());

    if (!foundCoupon) {
      enqueueSnackbar("Invalid coupon code", { variant: "error" });
      return;
    }

    if (!foundCoupon.is_applicable) {
      enqueueSnackbar("This coupon cannot be applied to your order", { variant: "error" });
      return;
    }

    await applyCouponById(foundCoupon.id);
    setCouponCode('');
  };

  return (
    <>
      <div className="bg-[#f2f8f2] p-4 rounded-lg mt-4 border border-emerald-50">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="text-[#c5a382]" size={16} fill="#c5a382" />
          <span className="text-[11px] font-bold text-[#062e25] uppercase tracking-wider">APPLY COUPON</span>
        </div>

        {coupon?.success ? (
          <div className="flex items-center justify-between bg-white border border-emerald-100 rounded-lg px-3 py-2">
            <div className="flex flex-col">
              <span className="text-emerald-700 text-xs font-bold">{coupon.coupon_code}</span>
              <span className="text-emerald-600 text-[10px]">Applied - saved ₹{Number(coupon.discount_amount ?? 0).toFixed(2)}</span>
            </div>
            <button
              onClick={async () => {
                setRemoving(true);
                await onRemoveCoupon?.();
                setRemoving(false);
              }}
              disabled={removing}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase"
            >
              {removing ? '...' : 'Remove'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border-2 border-dashed border-[#062e25]/30 rounded-lg focus:outline-none text-sm bg-white placeholder:text-gray-300"
              />
              <button
                onClick={applyManualCoupon}
                className="bg-[#062e25] text-white font-bold px-5 py-2 rounded-lg hover:bg-[#051d18] transition-colors text-xs uppercase"
              >
                Apply
              </button>
            </div>

            {coupons.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <span className="text-[10px] text-gray-500">Try</span>
                  {coupons.slice(0, 1).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => c.is_applicable && applyCouponById(c.id)}
                      className={`text-[10px] font-bold underline decoration-dashed transition-colors ${c.is_applicable ? 'text-[#062e25] hover:text-[#051d18]' : 'text-gray-400'}`}
                    >
                      {c.code}
                    </button>
                  ))}
                  <span className="text-[10px] text-gray-400">· {coupons[0]?.description?.split(' ')[0] || 'Offers'}</span>
                </div>
                {coupons.length > 1 && (
                  <button
                    onClick={() => setShowDrawer(true)}
                    className="text-[10px] font-bold text-[#062e25] uppercase hover:underline"
                  >
                    + More
                  </button>
                )}
              </div>
            )}

            {/* Reusable Side Drawer for Coupons */}
            <RightDrawer
              isOpen={showDrawer}
              onClose={() => setShowDrawer(false)}
              title="Available Coupons"
              subtitle="Choose your best offer"
              footerText="Apply coupons manually if you have a special code!"
            >
              <div className="space-y-4">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative p-5 border-2 rounded-[24px] transition-all duration-300 ${c.is_applicable
                        ? 'bg-white border-gray-900 hover:border-emerald-600 shadow-sm'
                        : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`font-black text-[11px] px-3.5 py-1.5 rounded-lg border-2 tracking-widest uppercase transition-colors ${c.is_applicable ? 'text-gray-900 bg-[#ebf5eb] border-gray-900' : 'text-gray-400 bg-gray-100 border-gray-200'}`}>
                            {c.code}
                          </span>
                          {c.is_applicable && (
                            <span className="text-2xl animate-pulse">
                              🔥
                            </span>
                          )}
                        </div>
                        <p className="text-base font-black text-gray-900 leading-snug tracking-tight">{c.description}</p>
                        <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-widest border-l-2 border-emerald-400 pl-2">
                          Valid on orders above ₹{c.minimum_order_value}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                      <button
                        onClick={() => c.is_applicable && applyCouponById(c.id)}
                        className={`w-full py-4.5 rounded-2xl font-black text-[12px] uppercase tracking-[0.1em] transition-all active:scale-[0.96] flex items-center justify-center gap-2
                        ${c.is_applicable
                            ? 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-200'
                          }`}
                      >
                        {c.is_applicable ? 'APPLY COUPON' : 'LOCKED'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </RightDrawer>
          </div>
        )}
      </div>
    </>
  );
};



// import {useState} from "react";

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [isOpen, setIsOpen] = useState(false);
  const paymentOptions = [
    {
      id: 'wallet',
      title: 'Gidan Wallet',
      description: 'Your current balance is ₹65.07.',
      type: 'checkbox'
    },
    {
      id: 'rewards',
      title: 'Gidan Rewards',
      description: '25% Utilization on Cart Value',
      type: 'checkbox'
    },
    {
      id: 'razorpay',
      title: 'Razorpay Secure (UPI, Cards, Wallets,NetBanking)',
      description: (
        <div className="flex items-center gap-2 mt-1">
          <img name=" " src="/api/placeholder/40/25" loading="lazy" alt="UPI" className="h-6" />
          <img name=" " src="/api/placeholder/40/25" loading="lazy" alt="Visa" className="h-6" />
          <img name=" " src="/api/placeholder/40/25" loading="lazy" alt="Mastercard" className="h-6" />
          <img name=" " src="/api/placeholder/40/25" loading="lazy" alt="RuPay" className="h-6" />
          <span className="text-gray-500 text-sm">+16</span>
        </div>
      ),
      type: 'radio'
    },
    {
      id: 'cod',
      title: 'Cash on Delivery/Pay on Delivery',
      type: 'radio'
    }
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-100 p-4 mt-4">
      <div className="bg-green-900 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-green-900 px-2 py-1 rounded-full mr-2">
            4
          </span>
          Select a payment method
        </h2>
        <span className="text-white font-bold">{isOpen ? "" : ""}</span>
      </div>

      {isOpen && (
        <div className="bg-white p-4 shadow-md rounded-md mt-2">
          <div className="space-y-6">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => option.type === 'radio' && setSelectedMethod(option.id)}
              >
                {option.type === 'checkbox' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                ) : (
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === option.id ? 'border-green-600 bg-white' : 'border-green-600 bg-white'}`}>
                      {selectedMethod === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-gray-900 text-lg">{option.title}</h3>
                  {option.description && (
                    <div className="text-gray-700">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Conditionally render RazorPayment component */}
          <div className="mt-6">
            {/* Conditionally render RazorpayPayment component */}
            {selectedMethod === 'razorpay' ? (
              <RazorpayPayment />
            ) : (
              <button className="bg-bio-green text-white font-medium px-8 py-3 rounded hover:bg-green-700 transition-colors">
                Proceed To Payment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {

  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  // Read order data client-side only (sessionStorage is not available during SSR)
  const [data, setData] = useState(null);
  const [comboOffer, setComboOffer] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('checkout_ordersummary');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        router.replace('/cart');
      }
    } catch { }
    try {
      const combo = sessionStorage.getItem('checkout_combo_offer') || sessionStorage.getItem('selected_combo_offer');
      if (combo) setComboOffer(JSON.parse(combo));
    } catch { }
    setDataLoaded(true);
  }, []);
  const id = data?.order?.id;
  const [orderResource, setOrderResource] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [isGift, setIsGift] = useState(false);
  const [coupon, setCoupon] = useState();
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [showGstDetail, setShowGstDetail] = useState(false);
  const [showShippingDetail, setShowShippingDetail] = useState(false);
  const [expandedGst, setExpandedGst] = useState({});

  const toggleGstExpand = (key) => {
    setExpandedGst(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Payment Step State ──
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletAdded, setWalletAdded] = useState(0);
  const [selectedPayMethod, setSelectedPayMethod] = useState('');
  const [isGstSelected, setIsGstSelected] = useState(false);
  const [isGst, setIsGst] = useState(false);
  const [selectedGst, setSelectedGst] = useState('');
  const [partialPaymentPopup, setPartialPaymentPopup] = useState(null);
  const gstFromProfile = useSelector((state) => state.user.gst);

  const isCombo = !!(data?.order?.is_combo_purchase || data?.order?.is_shop_the_look || comboOffer);

  useEffect(() => {
    if (data?.order?.is_shop_the_look && !selectedOption) {
      setSelectedOption({ deliveryType: "DoorDelivery", storeId: null });
    }
  }, [data?.order?.is_shop_the_look, selectedOption]);

  useEffect(() => {
    // GA4: Track begin_checkout event
    if (data?.order_items && data.order_items.length > 0) {
      trackBeginCheckout(data.order_items, data?.order?.grand_total);
    }
  }, [data, comboOffer]);

  // Clear combo if this order is not a combo or shop the look
  useEffect(() => {
    if (!data?.order?.is_combo_purchase && !data?.order?.is_shop_the_look) {
      sessionStorage.removeItem("selected_combo_offer");
      if (!comboOffer) {
        setComboOffer(null);
      }
    }
  }, [data?.order?.is_combo_purchase, data?.order?.is_shop_the_look]);

  // Log when coupon changes
  useEffect(() => {
  }, [coupon]);

  // ✅ Deduplicate items by product_name
  const uniqueItems = data?.order_items?.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.product_name === item.product_name)
  );

  const handleRemoveCoupon = async () => {
    if (!data?.order?.id) return;
    try {
      const res = await axiosInstance.post(`/order/removeCoupon/`, { order_id: data.order.id });
      setCoupon(undefined);

      // The removeCoupon API returns { success, order, order_items, ... } directly in res.data
      if (res.data?.order) {
        const updatedData = res.data;
        setData(updatedData);

        // If we were in payment step, update the session storage as well
        if (showPaymentStep) {
          sessionStorage.setItem('payment_order_data', JSON.stringify({ resource: updatedData, order_id: data.order.id }));
        }
      }
      enqueueSnackbar('Coupon removed.', { variant: 'info' });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Failed to remove coupon.', { variant: 'error' });
    }
  };

  const handleConfirmStore = async () => {
    await handleSaveOrderSummary();
    return true;
  };

  const handleSaveOrderSummary = async () => {
    if (!data?.order?.id) {
      enqueueSnackbar("Order not found. Please restart checkout.", { variant: "warning" });
      return;
    }
    if (!selectedOption) {
      enqueueSnackbar("Please select a delivery method!", { variant: "warning" });
      return;
    }
    const isPickup = selectedOption?.deliveryType === "Pick Up Store";
    if (isPickup && !selectedOption?.storeId) {
      enqueueSnackbar("Please select a pickup store!", { variant: "warning" });
      return;
    }
    if (!isPickup && !selectedAddress) {
      enqueueSnackbar("Please select a delivery address!", { variant: "warning" });
      return;
    }

    const orderSummaryData = {
      order_id: data.order.id,
      address_id: selectedAddress || null,
      delivery_option: selectedOption?.deliveryType,
      store_id: isPickup ? selectedOption?.storeId : null,
      is_wrap: isGift,
    };

    setSavingOrder(true);
    try {
      const response = await axiosInstance.patch(
        `/order/orderSummary/`,
        orderSummaryData
      );

      if (response.data.message === "success") {
        const latestOrderData = response.data.data;

        // Update data state so right panel reflects the latest prices (incl. zero shipping for pickup)
        setData(latestOrderData);

        // GA4: Track add_shipping_info event
        trackAddShippingInfo(
          data.order_items,
          selectedOption?.deliveryType || 'Standard',
          data?.order?.grand_total
        );

        // If coupon was applied, merge coupon metadata into the response.
        // IMPORTANT: use response grand_total (post-shipping, post-coupon from server) — never override it.
        const finalOrderData = coupon?.success
          ? {
            ...latestOrderData,
            order: {
              ...latestOrderData.order,
              coupon_applied: true,
              coupon_discount: coupon.discount_amount,
              applied_coupon: coupon.order?.applied_coupon || coupon.coupon_code
            }
          }
          : latestOrderData;

        sessionStorage.setItem('payment_order_data', JSON.stringify({ resource: finalOrderData, order_id: data.order.id }));
        setShowPaymentStep(true);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      }
    } catch (error) {
      console.error("Error saving order summary:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to save order summary. Please try again.",
        { variant: "error" }
      );
    } finally {
      setSavingOrder(false);
    }
  };

  const getWalletBalance = async () => {
    try {
      const res = await axiosInstance.get(`/wallet/wallet`);
      if (res.status === 200) setWalletBalance(res.data?.data);
    } catch (e) {
      console.warn('Wallet fetch failed', e);
      enqueueSnackbar('Failed to fetch wallet balance.', { variant: 'warning' });
    }
  };

  useEffect(() => { if (showPaymentStep) getWalletBalance(); }, [showPaymentStep]);

  const handlePayment = async () => {
    if (!data?.order?.id || !selectedPayMethod) {
      enqueueSnackbar('Please select a payment method.', { variant: 'warning' });
      return;
    }
    const orderId = data.order.id;
    const payload = { order_id: orderId, payment_method: selectedPayMethod, is_gst: isGst, gst_number: selectedGst };
    try {
      const paymentItems = activeItems || [];
      if (paymentItems.length > 0) {
        trackAddPaymentInfo(paymentItems, selectedPayMethod, activeOrder?.grand_total);
      }
      const response = await axiosInstance.patch(`/order/proceedToPayment/`, payload);
      if (response.status === 200 || response.status === 206) {
        const usedWallet = response?.data?.wallet_debited || 0;
        setWalletAdded(usedWallet);
        const razorpayOrder = response?.data?.razorpay_order;
        // CASE 1: Full wallet payment
        if (!razorpayOrder) {
          enqueueSnackbar(response?.data?.message || 'Payment Successful via Wallet', { variant: 'success' });
          trackPurchase({ transaction_id: orderId, value: activeOrder?.grand_total || 0, items: activeItems || [], shipping: activeOrder?.shipping_charge || 0, payment_type: 'Wallet' });
          sessionStorage.removeItem('payment_order_data');
          sessionStorage.removeItem('checkout_ordersummary');
          sessionStorage.removeItem('checkout_combo_offer');
          sessionStorage.removeItem('selected_combo_offer');
          sessionStorage.setItem('recent_payment_success', 'true');
          sessionStorage.setItem('recent_order_id', String(orderId));
          router.push('/successpage');
          return;
        }
        // CASE 2: Partial wallet + Razorpay
        const name = activeOrder?.customer_name || '';
        const email = activeOrder?.email || '';
        const phone = activeOrder?.mobile || '';
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount || 0,
          currency: 'INR',
          name: 'Gidan Store',
          description: 'Pay remaining balance',
          image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.gidan.store'}/logo.webp`,
          order_id: razorpayOrder.id,
          handler: async (paymentResponse) => {
            try {
              const verifyRes = await axiosInstance.post(
                `/order/verifyPayment/`,
                {
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  order_id: response.data.order_id,
                  payment_method: selectedPayMethod,
                  amount: razorpayOrder.amount / 100,
                  payment_details: paymentResponse,
                }
              );
              if (verifyRes.data.message === 'Payment successful') {
                enqueueSnackbar('Payment completed successfully!', { variant: 'success' });
                trackPurchase({ transaction_id: orderId, value: razorpayOrder.amount / 100, items: activeItems || [], shipping: activeOrder?.shipping_charge || 0 });
                sessionStorage.removeItem('payment_order_data');
                sessionStorage.removeItem('checkout_ordersummary');
                sessionStorage.removeItem('checkout_combo_offer');
                sessionStorage.removeItem('selected_combo_offer');
                sessionStorage.setItem('recent_payment_success', 'true');
                sessionStorage.setItem('recent_order_id', String(orderId));
                router.push('/successpage');
              } else {
                enqueueSnackbar('Payment verification failed.', { variant: 'error' });
              }
            } catch (err) {
              console.error('Verification error:', err);
              enqueueSnackbar('Payment verification error.', { variant: 'error' });
            }
          },
          prefill: { name, email, contact: phone },
          theme: { color: '#3399cc' },
          modal: {
            ondismiss: async () => {
              if (usedWallet > 0) {
                try {
                  await axiosInstance.post(
                    `/order/payments/rollback-wallet/`,
                    { order_id: orderId, wallet_amount: usedWallet }
                  );
                  enqueueSnackbar('Wallet rollback successful.', { variant: 'info' });
                  setWalletAdded(0);
                } catch (err) {
                  console.error('Rollback failed:', err);
                  enqueueSnackbar('Failed to rollback wallet.', { variant: 'warning' });
                }
              }
            },
          },
        };
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          enqueueSnackbar('Failed to load payment gateway. Please try again.', { variant: 'error' });
          return;
        }
        if (usedWallet > 0) {
          // Partial wallet + Razorpay — show breakdown popup
          setPartialPaymentPopup({
            message: response?.data?.message || 'Wallet partially used. Please complete remaining payment via UPI.',
            wallet_debited: response?.data?.wallet_debited || '0.00',
            remaining: (razorpayOrder.amount / 100).toFixed(2),
            razorpayOptions: options,
          });
        } else if (selectedPayMethod === 'Wallet') {
          // Wallet selected but balance is insufficient — inform user then open Razorpay
          setPartialPaymentPopup({
            message: 'Your Gidan Wallet balance is insufficient. Please complete the full payment via UPI / Card.',
            wallet_debited: '0.00',
            remaining: (razorpayOrder.amount / 100).toFixed(2),
            razorpayOptions: options,
          });
        } else {
          // Pure Razorpay / UPI selected — open gateway directly, no popup
          const razorpay = new window.Razorpay(options);
          razorpay.open();
          razorpay.on('payment.failed', () => { enqueueSnackbar('Payment failed. Please try again.', { variant: 'error' }); });
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      enqueueSnackbar(error?.response?.data?.message || 'Error processing your payment.', { variant: 'error' });
    }
  };

  const handleProceedWithRazorpay = () => {
    if (!partialPaymentPopup) return;
    const razorpay = new window.Razorpay(partialPaymentPopup.razorpayOptions);
    setPartialPaymentPopup(null);
    razorpay.open();
    razorpay.on('payment.failed', () => { enqueueSnackbar('Payment failed. Please try again.', { variant: 'error' }); });
  };

  // When coupon is applied, start from coupon.order (has correct grand_total with discount).
  // Only override grand_total + shipping_charge from data.order AFTER the PATCH has run
  // (showPaymentStep = true), when the server has recomputed totals with the chosen address.
  const activeOrder = coupon?.success
    ? {
      ...coupon.order,
      // Post-PATCH: data.order has server-authoritative totals (coupon + address shipping)
      ...(showPaymentStep && data?.order ? {
        grand_total: data.order.grand_total,
        shipping_charge: data.order.shipping_charge,
      } : {}),
      coupon_applied: true,
      coupon_discount: coupon.discount_amount,
      applied_coupon: coupon.order?.applied_coupon || coupon.coupon_code,
    }
    : data?.order;

  // Always use data.order_items for display — stable reference prevents image flicker.
  // coupon.order_items only provides per-item coupon fields (not needed for display).
  const activeItems = data?.order_items;

  const deliveryCharge = Number(data?.shipping_info?.shipping_charge ?? activeOrder?.shipping_charge ?? 0);
  const isFreeShipping = data?.shipping_info?.free_shipping === true ? true : deliveryCharge === 0;

  const backendTotal = (coupon?.success && (coupon?.order?.grand_total !== undefined || coupon?.new_total !== undefined))
    ? Math.max(0, Number(coupon.order?.grand_total ?? coupon.new_total ?? 0))
    : (isCombo || data?.order?.is_shop_the_look)
      ? (comboOffer?.final_price ?? data?.order?.grand_total ?? 0)
      : (data?.order?.grand_total ?? 0);

  const correctedPayableAmount = backendTotal;

  if (!dataLoaded || !data) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 font-semibold text-lg animate-pulse">Loading Checkout Details...</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Partial Wallet Payment Popup ── */}
      {partialPaymentPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={() => setPartialPaymentPopup(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800 text-center mb-3">Partial Wallet Payment</h2>
            <p className="text-sm text-gray-600 text-center mb-4">{partialPaymentPopup.message}</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Wallet Debited</span>
                <span className="font-semibold text-green-600">₹{partialPaymentPopup.wallet_debited}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Remaining via UPI</span>
                <span className="font-semibold text-gray-800">₹{partialPaymentPopup.remaining}</span>
              </div>
            </div>
            <button
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mb-2"
              onClick={handleProceedWithRazorpay}
            >
              Proceed with Razorpay
            </button>
            <button
              className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              onClick={() => setPartialPaymentPopup(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100">

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span
              className="hover:text-bio-green cursor-pointer transition-colors"
              onClick={() => router.push('/cart')}
            >SHOPPING CART</span>
            <span className="text-gray-300">›</span>
            <span
              className={!showPaymentStep ? 'text-bio-green' : 'hover:text-bio-green cursor-pointer transition-colors'}
              onClick={() => showPaymentStep && setShowPaymentStep(false)}
            >CHECKOUT</span>
            <span className="text-gray-300">›</span>
            <span className={showPaymentStep ? 'text-bio-green' : ''}>PAYMENT</span>
            <span className="text-gray-300">›</span>
            <span>CONFIRMATION</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

          {/* ══ LEFT COLUMN ══ */}
          <div className="w-full lg:w-3/5 space-y-4">

            {!showPaymentStep ? (
              <>
                {/* ── Step 1: Delivery Address ── */}
                <DeliveryAddress
                  setSelectedAddress={setSelectedAddress}
                  selectedAddress={selectedAddress}
                  setSelectedOption={setSelectedOption}
                  setIsAddNewOpen={setIsAddNewOpen}
                  isAddNewOpen={isAddNewOpen}
                  onConfirmStore={handleConfirmStore}
                  isGift={isGift}
                  setIsGift={setIsGift}
                />

                {/* ── Step 3: Review Order ── */}
                <OrderSummary
                  selectedOption={selectedOption}
                  selectedAddress={selectedAddress}
                  data={data}
                  onUpdateData={setData}
                />
              </>
            ) : (
              /* ── Step 4: Payment ── */
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-2 mb-6">
                  <span className="bg-bio-green text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">Select Payment Method</h3>
                </div>
                <div className="space-y-4">

                  {/* GST Checkbox */}
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGstSelected}
                      onChange={(e) => { const v = e.target.checked; setIsGstSelected(v); setIsGst(v); setSelectedGst(v ? gstFromProfile : ''); }}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded"
                    />
                    <span>Use My GST Number</span>
                  </label>
                  {isGstSelected && (
                    <p className="ml-6 text-sm text-gray-600">
                      <strong>GST:</strong> {gstFromProfile || <span className="text-red-500">Not set — please add in Profile</span>}
                    </p>
                  )}

                  {/* Payment options */}
                  <div className="space-y-3">
                    {[
                      { id: 'Wallet', label: 'Gidan Wallet', sub: `Balance: ₹${walletBalance?.balance ?? '…'}` },
                      { id: 'UPI', label: 'Razorpay Secure', sub: 'UPI · Cards · Wallets · NetBanking' },
                      { id: 'cod', label: 'Cash on Delivery', sub: 'Currently unavailable for your location', disabled: true },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => !opt.disabled && setSelectedPayMethod(opt.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${opt.disabled ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' :
                            selectedPayMethod === opt.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200'}`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedPayMethod === opt.id ? 'border-green-600' : 'border-gray-300'}`}>
                          {selectedPayMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isGstSelected && !gstFromProfile && (
                    <p className="text-red-500 text-sm font-medium text-center">Please add your GST number in Profile to proceed.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md sticky top-4 overflow-hidden">

              {/* ── Header ── */}
              <div className=" px-4 py-3">
                <p className="font-bold text-sm tracking-wide">Order Summary</p>
              </div>

              <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">
                    Items ({data?.order_items?.length ?? 0})
                  </p>
                  <div className="space-y-4">
                    {activeItems?.map((item) => {
                      const qty = Number(item.quantity) || 1;
                      const lineTotal = Number(item.selling_price) || 0;
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                              <img
                                src={`${axiosInstance.defaults.baseURL}${item.image}`}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "/placeholder-product.png")}
                              />
                              <div className="absolute top-0 right-0 bg-gray-800/80 text-white text-[10px] font-bold w-4 h-4 rounded-bl-lg flex items-center justify-center">
                                {qty}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-xs leading-tight line-clamp-1">{item.product_name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-gray-400">Regular</span>
                                {item.is_climate_tested && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                      🌡️ Climate tested
                                    </span>
                                  </>
                                )}
                                {item.is_gift_packaging && (
                                  <>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                      🎁 Gift packaging
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-gray-800 text-sm">₹{lineTotal.toFixed(0)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-dashed" />

                {/* ── Coupon Section ── */}
                <ApplyCoupon
                  id={id}
                  setCoupon={setCoupon}
                  coupon={coupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />

                {/* ── Price Details ── */}
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Price Details</p>
                  <div className="space-y-2 text-sm">

                    <div className="flex justify-between text-gray-600 pb-1">
                      <span>Subtotal ({data?.order_items?.length ?? 0} items)</span>
                      <span>₹{Number(activeOrder?.total_selling_price ?? 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-emerald-600 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        Discount
                      </span>
                      <span>-₹{Number(activeOrder?.total_discount ?? 0).toFixed(2)}</span>
                    </div>

                    {/* Coupon Discount */}
                    {(coupon?.success || activeOrder?.coupon_applied) && (
                      <div className="flex justify-between text-emerald-600 font-medium pb-1">
                        <span className="flex items-center gap-1 flex-wrap text-emerald-600">
                          Coupon Discount
                          {coupon?.coupon_code && (
                            <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                              {coupon.coupon_code}
                            </span>
                          )}
                        </span>
                        <span>-₹{Number(coupon?.discount_amount ?? activeOrder?.coupon_discount ?? 0).toFixed(2)}</span>
                      </div>
                    )}

                    {/* Delivery Charges */}
                    <div className="flex justify-between text-gray-600 pt-1">
                      <span>Delivery Charges</span>
                      <span className={isFreeShipping ? "text-emerald-600 font-semibold" : ""}>
                        {isFreeShipping ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Taxable Value */}
                    {Number(activeOrder?.taxable_value ?? 0) > 0 && (
                      <div className="flex justify-between text-gray-600 border-t border-dashed pt-2">
                        <span>Taxable Value</span>
                        <span>₹{Number(activeOrder.taxable_value).toFixed(2)}</span>
                      </div>
                    )}

                    {/* GST Section */}
                    {(() => {
                      const breakdownGroups = data?.order?.gst_breakdown?.groups;
                      const summary = data?.order?.gst_summary;
                      const newSummary = data?.order?.summary || data?.order?.gst_breakdown?.summary;

                      // 1. Priority: New "summary" format (gst_18: { cgst, sgst, total })
                      if (newSummary && Object.keys(newSummary).some(k => k.startsWith('gst_'))) {
                        return Object.entries(newSummary).map(([key, gData]) => {
                          const rate = key.split('_')[1];
                          const totalGst = Number(gData.total || 0);
                          if (totalGst === 0) return null;
                          const isExpanded = !!expandedGst[rate];

                          return (
                            <div key={rate} className="space-y-0.5 py-1 transition-all duration-300">
                              <div
                                className="flex justify-between text-gray-600 text-[11px] font-medium cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
                                onClick={() => toggleGstExpand(rate)}
                              >
                                <span className="flex items-center gap-1">
                                  <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                  GST ({rate}%)
                                </span>
                                <span>₹{totalGst.toFixed(2)}</span>
                              </div>

                              {isExpanded && (
                                <div className="space-y-0.5 pl-4 border-l border-gray-100 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                  {Number(gData.cgst || 0) > 0 && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>CGST ({Number(rate) / 2}%)</span>
                                      <span>₹{Number(gData.cgst).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {Number(gData.sgst || 0) > 0 && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>SGST ({Number(rate) / 2}%)</span>
                                      <span>₹{Number(gData.sgst).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {(Number(gData.total || 0) > (Number(gData.cgst || 0) + Number(gData.sgst || 0)) + 0.01) && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>IGST ({rate}%)</span>
                                      <span>₹{(Number(gData.total) - (Number(gData.cgst || 0) + Number(gData.sgst || 0))).toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        });
                      }

                      if (breakdownGroups) {
                        return Object.entries(breakdownGroups).map(([rate, group]) => {
                          const totalGst = Number(group.total_amount || group.igst || (Number(group.cgst || 0) + Number(group.sgst || 0)) || 0);
                          if (Number(rate) === 0 || totalGst === 0) return null;
                          const isExpanded = !!expandedGst[rate];

                          return (
                            <div key={rate} className="space-y-0.5 py-1">
                              <div
                                className="flex justify-between text-gray-600 text-[11px] font-medium cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
                                onClick={() => toggleGstExpand(rate)}
                              >
                                <span className="flex items-center gap-1">
                                  <span className={`text-[8px] transition-transform duration-200`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                  GST ({rate}%)
                                </span>
                                <span>₹{totalGst.toFixed(2)}</span>
                              </div>

                              {isExpanded && (
                                <div className="space-y-0.5 pl-4 border-l border-gray-100 ml-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                  {Number(group.cgst || 0) > 0 && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>CGST ({Number(rate) / 2}%)</span>
                                      <span>₹{Number(group.cgst).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {Number(group.sgst || 0) > 0 && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>SGST ({Number(rate) / 2}%)</span>
                                      <span>₹{Number(group.sgst).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {Number(group.igst || 0) > 0 && (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>IGST ({rate}%)</span>
                                      <span>₹{Number(group.igst).toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        });
                      }

                      if (summary) {
                        return Object.entries(summary).map(([rateStr, amount]) => {
                          const rate = parseFloat(rateStr);
                          const totalGst = Number(amount);
                          if (rate === 0 || totalGst === 0) return null;
                          return (
                            <div key={rateStr} className="flex justify-between text-gray-600 text-[11px] font-medium py-1">
                              <span>GST ({rate}%)</span>
                              <span>₹{totalGst.toFixed(2)}</span>
                            </div>
                          );
                        });
                      }

                      return null;
                    })()}

                    {/* Total Amount */}
                    <div className="flex justify-between text-gray-800 font-bold border-t pt-2 text-base">
                      <span>Total Amount</span>
                      <span>₹{Number(activeOrder?.grand_total ?? 0).toFixed(2)}</span>
                    </div>

                    {/* Savings message */}
                    {(Number(activeOrder?.total_discount ?? 0) + Number(coupon?.discount_amount ?? activeOrder?.coupon_discount ?? 0)) > 0 && (
                      <p className="text-emerald-600 text-xs font-semibold text-center bg-emerald-50 rounded-lg py-1.5">
                        You will save ₹{(Number(activeOrder?.total_discount ?? 0) + Number(coupon?.discount_amount ?? activeOrder?.coupon_discount ?? 0)).toFixed(2)} on this order
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* ── Fixed Bottom: GD Coins + Grand Total + Place Order ── */}
              <div className="border-t border-gray-100 px-4 pt-3 pb-4 space-y-3">
                {/* GD Coins */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">GD Coins Earned</p>
                      <p className="text-[10px] text-gray-400">Use on your next order</p>
                    </div>
                  </div>
                  <span className="text-lg font-extrabold text-orange-500">+{activeOrder?.gd_coin ?? 0}</span>
                </div>

                {/* Grand Total */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">Grand Total</span>
                  <span className="text-white font-extrabold text-lg">₹{Number(activeOrder?.grand_total ?? 0).toFixed(2)}</span>
                </div>

                {/* Place Order / Proceed to Payment */}
                {!showPaymentStep ? (
                  <button
                    disabled={savingOrder}
                    onClick={handleSaveOrderSummary}
                    className="w-full bg-bio-green text-white font-bold py-3.5 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all text-sm tracking-wide shadow disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {savingOrder ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Saving…</>
                    ) : (
                      <>Place Order →</>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={!selectedPayMethod || (isGstSelected && !gstFromProfile)}
                    onClick={handlePayment}
                    className="w-full bg-bio-green text-white font-bold py-3.5 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all text-sm tracking-wide shadow disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    Pay ₹{Number(activeOrder?.grand_total ?? 0).toFixed(2)} →
                  </button>
                )}
                <p className="text-center text-[10px] text-gray-400">🔒 Safe and Secure Payments. 100% Authentic Products.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CheckoutPage;