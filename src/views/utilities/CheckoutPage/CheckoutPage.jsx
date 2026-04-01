'use client';


import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Tag, CheckCircle, Pencil, ChevronDown, Check, X } from 'lucide-react';
import RazorpayPayment from "../RazorPayment/RazorpayPayment";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo, trackPurchase } from "../../../utils/ga4Ecommerce";
import RightDrawer from "../../../components/Shared/RightDrawer";
import CouponSection from "../../../components/Shared/CouponSection";

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
                      ? 'bg-[#375421]/10 text-[#375421] border border-[#375421]/20'
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
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
                  className={`p-5 pl-14 border rounded-2xl cursor-pointer relative transition-all duration-300 ${selectedAddress === addr.id
                    ? 'border-bio-green bg-green-50 shadow-md scale-[1.01]'
                    : 'border-gray-100 bg-white hover:border-bio-green hover:bg-green-100/20 hover:shadow-md'
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
                          ? 'bg-[#375421]/10 text-[#375421] border border-transparent'
                          : 'bg-orange-100 text-orange-700 border border-transparent'
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
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setIsGift(!isGift)}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${isGift ? 'bg-bio-green border-bio-green' : 'border-gray-300 group-hover:border-bio-green'}`}>
              {isGift && <Check size={16} strokeWidth={4} className="text-white" />}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className={`text-sm font-extrabold uppercase tracking-tight transition-colors whitespace-nowrap ${isGift ? 'text-gray-900' : 'text-gray-500'}`}>
                 This is a gift
              </span>
            </div>
          </label>
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
                className={`border p-2 rounded w-full bg-site-bg cursor-not-allowed${newAddressErrors.city ? ' border-red-500' : ''}`}
              />
              {newAddressErrors.city && <p className="text-red-500 text-xs mt-1">{newAddressErrors.city}</p>}
            </div>
            <div className="w-1/3">
              <input
                type="text"
                placeholder="State (Auto-filled) *"
                value={newAddress.state || ""}
                readOnly
                className={`border p-2 rounded w-full bg-site-bg cursor-not-allowed${newAddressErrors.state ? ' border-red-500' : ''}`}
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
              className="bg-[#375421] text-white px-6 py-2 rounded-md font-bold hover:bg-[#2d451b] hover:text-white"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="border border-gray-300 px-6 py-2 rounded-md hover:bg-site-bg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};






const OrderSummaryItem = ({ id, title, Quantity, mrp, sales_price, discount, image, onUpdateQuantity, isEditing, isMobile }) => {
  const qty = Number(Quantity) || 1;
  const unitMrp = Number(mrp) || 0;
  const unitPrice = qty > 0 ? (Number(sales_price) || 0) / qty : (Number(sales_price) || 0);
  const unitDisc = Number(discount) || 0;
  const totalSaving = unitDisc * qty;
  const savingPct = unitMrp > 0 && unitDisc > 0 ? Math.round((unitDisc / unitMrp) * 100) : 0;
  const lineTotal = Number(sales_price) || 0;

  if (isMobile) {
    return (
      <div className="border-b border-gray-50 py-4 last:border-0">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-site-bg rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
              alt={title}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1">{title}</h4>
            <p className="text-[10px] text-gray-400 font-medium mb-3">Standard Delivery</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">₹{Number(mrp).toFixed(2)}</span>
                <span className="font-bold text-gray-800">₹{Number(sales_price / qty).toFixed(2)}</span>
              </div>
              
              {isEditing ? (
                <div className="flex items-center p-1 border border-bio-green bg-green-50 rounded-lg gap-2">
                  <button
                    onClick={() => onUpdateQuantity(id, qty - 1)}
                    disabled={qty <= 1}
                    className="w-5 h-5 flex items-center justify-center bg-white border border-bio-green rounded-md text-bio-green"
                  >
                    <span className="leading-none select-none relative -top-[0.5px]">−</span>
                  </button>
                  <span className="w-5 text-center font-bold text-gray-800 text-[11px]">{qty}</span>
                  <button
                    onClick={() => onUpdateQuantity(id, qty + 1)}
                    className="w-5 h-5 flex items-center justify-center bg-white border border-bio-green rounded-md text-bio-green"
                  >
                    <span className="leading-none select-none relative -top-[0.5px]">+</span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Qty: {qty}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-dotted border-gray-100">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-emerald-600 font-bold">SAVED ₹{Number(discount).toFixed(2)}</span>
              </div>
              <span className="font-extrabold text-gray-800">₹{Number(sales_price).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr className="hidden md:table-row border-b border-gray-100 hover:bg-site-bg transition-colors">
      {/* Items Description */}
      <td className="py-4 pr-3">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-site-bg rounded-lg overflow-hidden shrink-0 border border-gray-100 p-1">
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
              <span className="leading-none select-none relative -top-[1px]">−</span>
            </button>
            <span className="w-8 text-center font-extrabold text-gray-800 text-sm">{qty}</span>
            <button
              onClick={() => onUpdateQuantity(id, qty + 1)}
              className="w-6 h-6 flex items-center justify-center bg-white border border-bio-green rounded-md text-bio-green font-bold text-lg hover:bg-bio-green hover:text-white transition-colors"
            >
              <span className="leading-none select-none relative -top-[1px]">+</span>
            </button>
          </div>
        ) : (
          <span className="text-sm font-extrabold text-gray-800 bg-site-bg px-3 py-1 rounded-full">{qty}</span>
        )}
      </td>

      {/* Savings */}
      <td className="py-4 px-3 text-center">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-[#375421]">₹{Number(discount).toFixed(2)}</span>
          <span className="text-[10px] bg-green-100 text-[#375421] px-1.5 py-0.5 rounded-full font-bold">SAVED</span>
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
          className="text-xs font-bold flex items-center gap-1 text-bio-green hover:bg-bio-green hover:text-white px-2 py-1 rounded-md transition-all border border-transparent hover:border-bio-green scale-100 active:scale-95"
        >
          <Pencil size={12} className="shrink-0" /> <span className="relative top-[0.5px]">Edit cart</span>
        </button>
      </div>

      <div
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex -space-x-1 shrink-0">
            {orderItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:z-10 bg-site-bg">
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
        <div className="bg-white rounded-b-md mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="hidden md:block">
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-1">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Items Description</th>
                    <th className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">MRP</th>
                    <th className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Qty</th>
                    <th className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Savings</th>
                    <th className="text-right text-[11px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Total</th>
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
          </div>

          {/* Mobile specific list - with vertical scroll if list is long */}
          <div className="md:hidden max-h-[500px] overflow-y-auto overflow-x-hidden space-y-2 pr-1">
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
                isMobile={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};






const ApplyCoupon = ({ id, setCoupon, coupon, onRemoveCoupon }) => {
  return (
    <div className="bg-[#f2f8f2] p-4 rounded-lg mt-4 border border-emerald-50">
      <CouponSection 
        mode="checkout"
        orderId={id}
        appliedCoupon={coupon?.success ? coupon : null}
        onSuccess={(data) => setCoupon(data)}
        onRemove={onRemoveCoupon}
      />
    </div>
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
    <div className="bg-site-bg p-4 mt-4">
      <div className="bg-[#375421] text-white p-4 rounded-md cursor-pointer flex justify-between items-center shadow-md hover:bg-[#2d451b] transition-colors"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center uppercase tracking-wider text-sm">
          <span className="bg-white text-[#375421] w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs font-black shadow-inner">
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
                  <CheckCircle className="w-6 h-6 text-[#375421] mt-1 flex-shrink-0" />
                ) : (
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === option.id ? 'border-[#375421] bg-white' : 'border-[#375421] bg-white'}`}>
                      {selectedMethod === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#375421]" />
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
              <button className="bg-bio-green text-white font-medium px-8 py-3 rounded hover:bg-[#375421] hover:text-white transition-colors">
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
        router.prefetch('/successpage'); // Preload the success page for instant transition
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
          // enqueueSnackbar(response?.data?.message || 'Payment Successful via Wallet', { variant: 'success' });
          trackPurchase({ transaction_id: orderId, value: activeOrder?.grand_total || 0, items: activeItems || [], shipping: activeOrder?.shipping_charge || 0, payment_type: 'Wallet' });
          sessionStorage.removeItem('payment_order_data');
          sessionStorage.removeItem('checkout_ordersummary');
          sessionStorage.removeItem('checkout_combo_offer');
          sessionStorage.removeItem('selected_combo_offer');
          sessionStorage.setItem('recent_payment_success', 'true');
          sessionStorage.setItem('recent_order_id', String(orderId));
          router.replace(`/successpage?order_id=${orderId}`);
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
                // enqueueSnackbar('Payment completed successfully!', { variant: 'success' });
                trackPurchase({ transaction_id: orderId, value: razorpayOrder.amount / 100, items: activeItems || [], shipping: activeOrder?.shipping_charge || 0 });
                sessionStorage.removeItem('payment_order_data');
                sessionStorage.removeItem('checkout_ordersummary');
                sessionStorage.removeItem('checkout_combo_offer');
                sessionStorage.removeItem('selected_combo_offer');
                sessionStorage.setItem('recent_payment_success', 'true');
                sessionStorage.setItem('recent_order_id', String(orderId));
                router.replace(`/successpage?order_id=${orderId}`);
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
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300 px-4"
          style={{ zIndex: 100001 }}
          onClick={() => setPartialPaymentPopup(null)}
        >
          <div
            className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200"
            style={{ zIndex: 100002 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-[#375421]">💳</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 text-center uppercase tracking-tight mb-2">Partial Balance Due</h2>
            <p className="text-xs text-gray-500 text-center font-bold uppercase tracking-widest mb-6 leading-relaxed">
              {partialPaymentPopup.message}
            </p>
            
            <div className="bg-site-bg rounded-2xl p-5 mb-8 space-y-3 border border-gray-100">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wallet Used</span>
                <span className="font-black text-lg text-[#375421]">₹{partialPaymentPopup.wallet_debited}</span>
              </div>
              <div className="h-px bg-dashed bg-gray-200 w-full shrink-0" />
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-emerald-700">Balance to Pay</span>
                <span className="font-black text-2xl text-gray-900">₹{partialPaymentPopup.remaining}</span>
              </div>
            </div>

            <button
              className="w-full py-5 bg-[#375421] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-[#2d451b] shadow-[0_20px_40px_-15px_rgba(55,84,33,0.4)] transition-all active:scale-[0.98] mb-3"
              onClick={handleProceedWithRazorpay}
            >
              Pay Remaining Balance
            </button>
            <button
              className="w-full py-3 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-600 transition-colors"
              onClick={() => setPartialPaymentPopup(null)}
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* ── Payment Method Centered Modal ── */}
      {showPaymentStep && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 shadow-2xl"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            style={{ zIndex: 99998 }}
            onClick={() => setShowPaymentStep(false)}
          />
          <div 
            className="relative bg-white w-[95%] max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
            style={{ zIndex: 99999 }}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Select Payment Method</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Secure · 256-bit Encryption</p>
              </div>
              <button 
                onClick={() => setShowPaymentStep(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-10 space-y-6">
              {/* Order Summary Recap - Compact Row */}
              <div className="bg-site-bg rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#375421] rounded-full" />
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                    <span className="text-xl font-black text-gray-900 leading-none">₹{correctedPayableAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {/* Map over items from data if available, or just show a placeholder if activeItems is not defined in this scope */}
                  {data?.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm">
                      <img src={`${axiosInstance.defaults.baseURL}${item.image}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {/* GST Checkbox - More compact */}
                <div
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${isGstSelected ? 'border-[#375421] bg-green-50' : 'border-gray-100 bg-white'}`}
                  onClick={() => {
                    const v = !isGstSelected;
                    setIsGstSelected(v);
                    setIsGst(v);
                    setSelectedGst(v ? gstFromProfile : '');
                  }}
                >
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer w-full">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isGstSelected ? 'bg-[#375421] border-[#375421]' : 'border-gray-300'}`}>
                      {isGstSelected && <Check size={12} className="text-white" strokeWidth={5} />}
                    </div>
                    <span className="font-black uppercase tracking-tight text-[11px] text-gray-900">Include GST Details</span>
                  </label>
                  {isGstSelected && (
                    <div className="mt-3 ml-7 pt-3 border-t border-dashed border-green-200">
                      <p className="text-[10px] text-green-700 font-bold uppercase">{gstFromProfile ? `GSTIN: ${gstFromProfile}` : 'Missing GST in Profile'}</p>
                    </div>
                  )}
                </div>

                {/* Payment options - Grid for wide screen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'Wallet', label: 'Gidan Wallet', sub: `₹${walletBalance?.balance ?? '0'}` },
                    { id: 'UPI', label: 'Razorpay Secure', sub: 'Cards · UPI · Pay' },
                    { id: 'cod', label: 'Pay on Delivery', sub: 'Unavailable', disabled: true },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => !opt.disabled && setSelectedPayMethod(opt.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer
                      ${opt.id === 'cod' ? 'md:col-span-1 opacity-40 cursor-not-allowed border-gray-100' : 
                        selectedPayMethod === opt.id ? 'border-[#375421] bg-green-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selectedPayMethod === opt.id ? 'border-[#375421]' : 'border-gray-300'}`}>
                        {selectedPayMethod === opt.id && <div className="w-2 h-2 rounded-full bg-[#375421]" />}
                      </div>
                      <div>
                        <p className="font-black text-[11px] text-gray-900 uppercase leading-none">{opt.label}</p>
                        <p className="text-[9px] text-gray-500 mt-1 font-bold uppercase tracking-widest leading-none">{opt.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button & Footer Info */}
              <div className="pt-2">
                <button
                  onClick={handlePayment}
                  disabled={isGstSelected && !gstFromProfile}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                  ${(isGstSelected && !gstFromProfile) 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-[#375421] text-white hover:shadow-lg active:scale-[0.99]'}`}
                >
                  Confirm Order
                </button>
                
                <div className="mt-6 pt-6 border-t border-dashed border-gray-100">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {[
                      'SSL-secured checkout',
                      '7-day plant guarantee',
                      'Free shipping',
                      'Easy 7-day returns'
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={9} className="text-emerald-600" strokeWidth={5} />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter truncate">{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-5 opacity-40 grayscale px-1">
                    {['UPI', 'GPay', 'Visa', 'Mastercard', 'RuPay'].map((brand) => (
                      <span key={brand} className="text-[7px] font-black border border-gray-300 px-1 py-0.5 rounded-sm uppercase">{brand}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-site-bg">

        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b py-6 lg:py-8 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between min-w-[680px] lg:min-w-0 w-full relative px-2">
              {/* Step 1: Cart */}
              <div className="flex items-center gap-3 relative z-10 group cursor-pointer shrink-0" onClick={() => router.push('/cart')}>
                <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center transition-all group-hover:border-[#375421]">
                  <Check size={16} className="text-[#375421]" strokeWidth={3} />
                </div>
                <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-gray-600 transition-colors">Shopping Cart</span>
              </div>

              {/* Line 1 */}
              <div className="flex-1 h-[2px] mx-4 bg-[#e6edde] shrink-0" />

              {/* Step 2: Checkout */}
              <div className="flex items-center gap-3 relative z-10 shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  ${!showPaymentStep ? 'bg-[#375421] border-[#375421] shadow-lg shadow-green-100' : 'bg-[#f2f7ec] border-[#e6edde] opacity-80'}`}>
                  {showPaymentStep ? (
                    <Check size={16} className="text-[#375421]" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-black text-white">2</span>
                  )}
                </div>
                <span className={`text-[13px] font-bold uppercase tracking-wide transition-colors
                  ${!showPaymentStep ? 'text-[#375421]' : 'text-gray-400'}`}>Checkout</span>
              </div>

              {/* Line 2 */}
              <div className={`flex-1 h-[2px] mx-4 transition-colors duration-500 shrink-0 ${showPaymentStep ? 'bg-[#375421]' : 'bg-[#e6edde]'}`} />

              {/* Step 3: Payment */}
              <div className="flex items-center gap-3 relative z-10 shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  ${showPaymentStep ? 'bg-[#375421] border-[#375421] shadow-lg shadow-green-100' : 'bg-[#f2f7ec] border-[#e6edde]'}`}>
                  <span className={`text-sm font-black transition-colors ${showPaymentStep ? 'text-white' : 'text-gray-400 opacity-60'}`}>3</span>
                </div>
                <span className={`text-[13px] font-bold uppercase tracking-wide transition-colors
                  ${showPaymentStep ? 'text-[#375421]' : 'text-gray-400'}`}>Payment</span>
              </div>

              {/* Line 3 */}
              <div className="flex-1 h-[2px] mx-4 bg-[#e6edde] shrink-0" />

              {/* Step 4: Confirmation */}
              <div className="flex items-center gap-3 relative z-10 opacity-60 shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-[#e6edde] bg-[#f2f7ec] flex items-center justify-center">
                  <span className="text-sm font-black text-gray-400 opacity-60">4</span>
                </div>
                <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Confirmation</span>
              </div>
            </div>
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
              /* ── Step 4: Payment Placeholder (Hidden, moved to Drawer) ── */
              <div className="bg-white p-16 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-3xl text-[#375421]">🛡️</span>
                </div>
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-2">Secure Checkout</h3>
                <p className="text-xs text-gray-400 font-bold max-w-xs mx-auto mb-6">Completing your order details... Please select your payment method in the side window.</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowPaymentStep(true)}
                    className="bg-[#375421] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    Open Payment Window
                  </button>
                  <button 
                    onClick={() => setShowPaymentStep(false)}
                    className="text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    Go Back to Delivery
                  </button>
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

                {!showPaymentStep && (
                  <ApplyCoupon
                    id={id}
                    setCoupon={setCoupon}
                    coupon={coupon}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                )}

                <hr className="border-dashed" />

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
                      // Support both data structures: data.order.gst_breakdown (from orderSummary) 
                      // and data.order.gst_breakdown.gst_X (from initial summary)
                      const breakdown = data?.order?.gst_breakdown || {};
                      
                      // Check for gst_N pattern in either breakdown root or breakdown.summary
                      const summary = breakdown.summary || breakdown;
                      const gstKeys = Object.keys(summary).filter(k => k.startsWith('gst_'));

                      if (gstKeys.length > 0) {
                        return gstKeys.map(key => {
                          const rate = key.split('_')[1];
                          const gData = summary[key];
                          const totalGst = Number(gData.total || 0);
                          if (totalGst === 0) return null;
                          const isExpanded = !!expandedGst[rate];

                          return (
                            <div key={rate} className="space-y-0.5 py-1">
                              <div
                                className="flex justify-between text-gray-600 text-[11px] font-medium cursor-pointer hover:bg-site-bg rounded px-1 -mx-1 transition-colors"
                                onClick={() => toggleGstExpand(rate)}
                              >
                                <span className="flex items-center gap-1">
                                  <span 
                                    className="text-[8px] transition-transform duration-200" 
                                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                  >
                                    ▶
                                  </span>
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
                                  {/* IGST detection (Remaining after CGST/SGST) */}
                                  {Number(gData.igst || 0) > 0 || (totalGst > (Number(gData.cgst || 0) + Number(gData.sgst || 0)) + 0.01) ? (
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                      <span>IGST ({rate}%)</span>
                                      <span>₹{(Number(gData.igst) || (totalGst - (Number(gData.cgst || 0) + Number(gData.sgst || 0)))).toFixed(2)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          );
                        });
                      }

                      // Legacy fallback for other structures (breakdownGroups)
                      const breakdownGroups = breakdown?.groups;
                      if (breakdownGroups) {
                        return Object.entries(breakdownGroups).map(([rate, group]) => {
                          const totalGst = Number(group.total_amount || group.igst || (Number(group.cgst || 0) + Number(group.sgst || 0)) || 0);
                          if (Number(rate) === 0 || totalGst === 0) return null;
                          const isExpanded = !!expandedGst[rate];

                          return (
                            <div key={rate} className="space-y-0.5 py-1">
                              <div
                                className="flex justify-between text-gray-600 text-[11px] font-medium cursor-pointer hover:bg-site-bg rounded px-1 -mx-1 transition-colors"
                                onClick={() => toggleGstExpand(rate)}
                              >
                                <span className="flex items-center gap-1">
                                  <span
                                    className="text-[8px] transition-transform duration-200"
                                    style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                  >
                                    ▶
                                  </span>
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
                <div className="bg-gradient-to-r from-[#375421] to-[#051d18] rounded-xl p-3 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">Grand Total</span>
                  <span className="text-white font-extrabold text-lg">₹{Number(activeOrder?.grand_total ?? 0).toFixed(2)}</span>
                </div>

                {/* Place Order / Proceed to Payment */}
                {!showPaymentStep ? (
                  <button
                    disabled={savingOrder}
                    onClick={handleSaveOrderSummary}
                    className="w-full bg-bio-green text-white font-bold py-3.5 rounded-xl hover:bg-[#375421] hover:text-white active:scale-[0.98] transition-all text-sm tracking-wide shadow disabled:opacity-60 flex items-center justify-center gap-2"
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
                    className="w-full bg-bio-green text-white font-bold py-3.5 rounded-xl hover:bg-[#375421] hover:text-white active:scale-[0.98] transition-all text-sm tracking-wide shadow disabled:opacity-60 flex items-center justify-center gap-2"
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