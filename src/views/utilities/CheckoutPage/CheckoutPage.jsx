'use client';


import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Tag } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import RazorpayPayment from "../RazorPayment/RazorpayPayment";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { trackBeginCheckout, trackAddPaymentInfo, trackAddShippingInfo } from "../../../utils/ga4Ecommerce";



const DeliveryAddress = ({ setSelectedAddress, selectedAddress, setSelectedOption, setIsAddNewOpen, isAddNewOpen }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedDelType, setSelectedDelType] = useState("");
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

  const deliveryOptions = [
    { id: "Door Delivery", label: "Door Delivery" },
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
      console.log(error);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedDelType(optionId);
    setSelectedOption({ deliveryType: optionId, storeId: null });
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStoreId(storeId);
    setSelectedOption({ deliveryType: selectedDelType, storeId });
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="p-4 font-sans space-y-6">
          <section>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-1">1. Delivery Address</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsAddNewOpen(true);
                    setTimeout(() => {
                      document.getElementById('add-new-address-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border border-green-200 hover:bg-green-200 transition-colors"
                >
                  + Add Address
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                    className="text-xs font-bold text-bio-green hover:text-green-800"
                  >
                    {showAllAddresses ? "Show Selected Only" : "Change Address"}
                  </button>
                )}
              </div>
            </div>

            {!showAllAddresses && selectedAddrObj ? (
              <div className="p-4 border border-bio-green bg-green-50 rounded-lg shadow-sm relative animate-in fade-in duration-300">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 text-sm">{`${selectedAddrObj.first_name} ${selectedAddrObj.last_name}`}</span>
                    {selectedAddrObj.address_type && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] rounded uppercase font-bold tracking-wider">
                        {selectedAddrObj.address_type}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{selectedAddrObj.address}</p>
                  <p className="text-xs text-gray-600">{selectedAddrObj.city}, {selectedAddrObj.state} - {selectedAddrObj.pincode}</p>
                  <p className="text-xs text-gray-700 font-medium mt-1"> {selectedAddrObj.phone}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                {addresses.map((addr, index) => (
                  <div
                    key={addr.id || index}
                    onClick={() => {
                      setSelectedAddress(addr.id);
                      setShowAllAddresses(false);
                    }}
                    className={`p-4 border rounded-lg shadow-sm cursor-pointer relative transition-all hover:shadow-md ${selectedAddress === addr.id
                      ? 'border-bio-green bg-green-50 ring-2 ring-bio-green ring-opacity-20'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-bio-green' : 'border-gray-300'
                        }`}>
                        {selectedAddress === addr.id && <div className="h-2.5 w-2.5 rounded-full bg-bio-green"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800 text-sm">{`${addr.first_name} ${addr.last_name}`}</span>
                          {addr.address_type && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] rounded uppercase font-bold tracking-wider">
                              {addr.address_type}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{addr.address}</p>
                        <p className="text-xs text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => {
                    setIsAddNewOpen(true);
                    setTimeout(() => {
                      document.getElementById('add-new-address-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-bio-green hover:text-bio-green transition-all cursor-pointer bg-gray-50 hover:bg-white min-h-[80px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">+</span>
                    <span className="font-semibold text-xs text-center leading-tight">Add New<br />Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Add New Address Form */}
            {isAddNewOpen && (
              <div className="mt-6 border-t pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <AddNewAddress isOpen={isAddNewOpen} setIsOpen={setIsAddNewOpen} />
              </div>
            )}
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">2. Choose Delivery Method</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionChange(option.id)}
                  className={`flex-1 p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-all ${selectedDelType === option.id
                    ? 'border-bio-green bg-white shadow-sm ring-1 ring-bio-green'
                    : 'border-gray-200 bg-white hover:border-bio-green'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedDelType === option.id ? 'border-bio-green' : 'border-gray-300'
                      }`}>
                      {selectedDelType === option.id && <div className="h-2 w-2 rounded-full bg-bio-green"></div>}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedDelType === 'Pick Up Store' && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block mb-2 text-xs font-bold text-gray-600 uppercase">Select pickup store</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scroll pr-2">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      onClick={() => handleStoreSelect(store.id)}
                      className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedStoreId === store.id
                        ? 'bg-green-50 border-green-500 ring-1 ring-bio-green'
                        : 'bg-white border-gray-200 hover:border-green-300'
                        }`}
                    >
                      <p className="font-bold text-gray-800 text-xs">{store.pathname}</p>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{store.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAddressChange = (field, value) => {
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/address/`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
    }
  };

  return (
    <div id="add-new-address-section">
      <div className="bg-white">
        <h3 className="text-bio-green font-bold mb-2">Add New Address</h3>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveNewAddress(); }}>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="First name"
              value={newAddress.firstName}
              onChange={(e) => handleAddressChange("firstName", e.target.value)}
              className="border p-2 rounded w-1/2"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              value={newAddress.lastName}
              onChange={(e) => handleAddressChange("lastName", e.target.value)}
              className="border p-2 rounded w-1/2"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={newAddress.address}
            onChange={(e) => handleAddressChange("address", e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="City (Auto-filled)"
              value={newAddress.city || ""}
              readOnly
              className="border p-2 rounded w-1/3 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="State (Auto-filled)"
              value={newAddress.state || ""}
              readOnly
              className="border p-2 rounded w-1/3 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="PIN Code"
              value={newAddress.pinCode}
              maxLength={6}
              onChange={(e) => handleAddressChange("pinCode", e.target.value.replace(/\D/g, ""))}
              className="border p-2 rounded w-1/3"
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Phone"
            value={newAddress.phone}
            maxLength={10}
            onChange={(e) => handleAddressChange("phone", e.target.value.replace(/\D/g, ""))}
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex space-x-4 items-center">
            <label className="flex items-center">
              <input
                type="radio"
                name="addressType"
                checked={newAddress.addressType === "Home"}
                onChange={() => handleAddressChange("addressType", "Home")}
                className="mr-2"
                required
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
              className="bg-green-900 text-white px-6 py-2 rounded-md font-bold hover:bg-green-800"
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






const OrderSummaryItem = ({ title, Quantity, mrp, sales_price, discount, image }) => {
  const saving = Number(mrp) - Number(sales_price);
  const savingPct = mrp > 0 ? Math.round((saving / mrp) * 100) : 0;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Description */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
            alt={title}
            loading="lazy"
            className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0"
          />
          <span className="text-sm font-medium text-gray-800 leading-snug">{title}</span>
        </div>
      </td>

      {/* Quantity */}
      <td className="py-4 px-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded text-sm font-semibold text-gray-700">
          {Quantity}
        </span>
      </td>

      {/* Savings */}
      <td className="py-4 px-3 text-center">
        {saving > 0 ? (
          <div className="space-y-0.5">
            <p className="text-red-500 text-xs font-bold">{savingPct}% Off</p>
            <p className="text-gray-400 line-through text-xs">₹{Number(mrp).toFixed(2)}</p>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* Price */}
      <td className="py-4 px-3 text-right">
        <span className="text-sm font-bold text-gray-800">₹{Number(sales_price).toFixed(2)}</span>
      </td>
    </tr>
  );
};















const OrderSummary = ({ selectedOption, selectedAddress, data }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  // const [orderSummary, setOrderSummary] = useState([]);
  const orderData = null?.resource;

  const toggleDropdown = () => setIsOpen(!isOpen);

  // const handleSaveOrderSummary = async () => {
  //   if (!data?.order?.id || !selectedAddress || !selectedOption) {
  //     enqueueSnackbar("Please fill in all the required details!", {variant: "warning" });
  //     return;
  //   }

  //   const orderSummaryData = {
  //     order_id: data.order.id,
  //     address_id: selectedAddress,
  //     delivery_option: selectedOption?.deliveryType,
  //     store_id:selectedOption?.storeId,
  //   };

  //   try {
  //     const response = await axios.patch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/order/orderSummary/`,
  //       orderSummaryData,
  //       {
  //         headers: {Authorization: `Bearer ${accessToken}` },
  //       }
  //     );

  //     if (response.data.message === "success") {
  //       enqueueSnackbar("Order summary saved successfully!", {variant: "success" });

  //       router.push("/paymentgateway", {
  //         state: {resource: response.data.data, order_id: data.order.id }
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error saving order summary:", error);

  //     // Show a detailed error message
  //     enqueueSnackbar(
  //       error.response?.data?.message || "Failed to save order summary. Please try again.",
  //       {variant: "error" }
  //     );
  //   }
  // };

  return (
    <div className="bg-gray-100 p-4 mt-4">
      <div className="bg-gradient-to-r from-green-500 to-green-900 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center text-sm md:text-base">
          <span className="bg-white text-green-900 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">
            1
          </span>
          Order Summary
        </h2>
        <span className="text-white font-bold">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="bg-white rounded-b-md overflow-x-auto mt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Items Description</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Quantity</th>
                <th className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Savings</th>
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400 py-3 px-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {(data?.order_items || []).map((item, idx) => (
                <OrderSummaryItem
                  key={item.id ?? idx}
                  title={item.product_name}
                  Quantity={item.quantity}
                  mrp={item.mrp}
                  sales_price={item.selling_price}
                  discount={item.discount}
                  image={item.image}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};






const ApplyCoupon = ({ id, setCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const accessToken = useSelector(selectAccessToken);
  const [coupons, setCoupons] = useState([]);

  const getCoupones = async () => {
    if (!id) return;
    try {
      const response = await axiosInstance.get(`/coupon/coupons/?order_id=${id}`);
      if (response.status === 200) {
        setCoupons(response.data.coupons);
        // Auto-open accordion if coupons are available
        if (response.data.coupons && response.data.coupons.length > 0) {
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoupones();
  }, [id]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/applyCoupon/`,
        {
          selected_coupon_id: couponId,
          order_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("✅ Coupon API Response:", response.data);
        console.log("✅ New Grand Total:", response.data?.order?.grand_total);
        console.log("✅ Discount Amount:", response.data?.discount_amount);
        console.log("✅ Coupon Applied:", response.data?.success);
        setCoupon(response.data);
        enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
      }
    } catch (error) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;
      console.error("❌ Coupon application error:", { statusCode, responseData, message: error.message });
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

    // Find the coupon in the available coupons list
    const coupon = coupons.find(c => c.code === couponCode.trim().toUpperCase());

    if (!coupon) {
      enqueueSnackbar("Invalid coupon code", { variant: "error" });
      return;
    }

    if (!coupon.is_applicable) {
      enqueueSnackbar("This coupon cannot be applied to your order", { variant: "error" });
      return;
    }

    // Apply the coupon using the existing method
    await applyCouponById(coupon.id);
    setCouponCode(''); // Clear the input after successful application
  };

  return (
    <div className="font-sans">
      {/* Toggle bar */}
      <div
        className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleDropdown}
      >
        <span className="text-sm font-semibold text-gray-700">
          {isOpen ? "Hide coupons" : (coupons.length > 0 ? `${coupons.length} coupon${coupons.length > 1 ? 's' : ''} available` : "Enter coupon code")}
        </span>
        <span className="text-bio-green font-bold text-lg">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="px-5 pb-5">
          {/* Manual coupon entry */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-green text-sm w-full"
            />
            <button
              onClick={applyManualCoupon}
              className="bg-bio-green text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
            >
              Apply
            </button>
          </div>

          {/* Available coupons */}
          <div className="max-h-48 overflow-y-auto scrollbar-hide">
            <div className="space-y-2 pr-2">
              {coupons.length > 0 ? (
                coupons.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-dashed rounded-lg gap-2"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <Tag className="text-bio-green mt-1 sm:mt-0 flex-shrink-0" size={18} />
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{offer.description}</p>
                        <p className="text-gray-500 text-xs">Min. ₹{offer.minimum_order_value}</p>
                        <p className="font-bold text-bio-green text-xs mt-0.5">{offer.code}</p>
                      </div>
                    </div>
                    <button
                      className={`font-semibold px-4 py-2 rounded-lg text-sm shrink-0 ${offer.is_applicable
                        ? "text-white bg-bio-green hover:bg-green-700 cursor-pointer"
                        : "text-gray-400 bg-gray-100 cursor-not-allowed"
                        }`}
                      onClick={() => offer.is_applicable && applyCouponById(offer.id)}
                      disabled={!offer.is_applicable}
                    >
                      APPLY
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-400 py-4">No coupons available for this order</div>
              )}
            </div>
          </div>

          <style jsx global>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>
      )}
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
  const [coupon, setCoupon] = useState();
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [showGstDetail, setShowGstDetail] = useState(false);
  const [showShippingDetail, setShowShippingDetail] = useState(false);

  const isCombo = !!(data?.order?.is_combo_purchase || data?.order?.is_shop_the_look || comboOffer);

  useEffect(() => {
    if (data?.order?.is_shop_the_look && !selectedOption) {
      setSelectedOption({ deliveryType: "Door Delivery", storeId: null });
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

  const handleSaveOrderSummary = async () => {
    if (!data?.order?.id || !selectedAddress || !selectedOption) {
      enqueueSnackbar("Please select a delivery address and delivery method!", { variant: "warning" });
      return;
    }

    const orderSummaryData = {
      order_id: data.order.id,
      address_id: selectedAddress,
      delivery_option: selectedOption?.deliveryType,
      store_id: selectedOption?.storeId,
    };

    setSavingOrder(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/orderSummary/`,
        orderSummaryData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.message === "success") {
        // GA4: Track add_shipping_info event
        trackAddShippingInfo(
          data.order_items,
          selectedOption?.deliveryType || 'Standard',
          data?.order?.grand_total
        );

        // If coupon was applied, merge the coupon data into the response
        const finalOrderData = coupon?.success
          ? {
            ...response.data.data,
            order: {
              ...response.data.data.order,
              grand_total: Math.max(0, Number(coupon.order?.grand_total ?? coupon.new_total ?? 0)),
              coupon_applied: true,
              coupon_discount: coupon.discount_amount,
              applied_coupon: coupon.order?.applied_coupon
            }
          }
          : response.data.data;

        sessionStorage.setItem('payment_order_data', JSON.stringify({ resource: finalOrderData, order_id: data.order.id }));
        setPaymentReady(true);
        router.push("/paymentgateway");
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

  const deliveryCharge = Number(data?.shipping_info?.shipping_charge || 0);

  // When coupon is applied, use updated values from coupon response
  const activeOrder = coupon?.success ? coupon.order : data?.order;
  const activeItems = coupon?.success ? coupon.order_items : data?.order_items;

  // Calculate backend total based on order type
  // Priority: coupon response > combo offer > original order data
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
    <div className="min-h-screen bg-gray-100">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span
            className="hover:text-bio-green cursor-pointer transition-colors"
            onClick={() => router.push('/cart')}
          >SHOPPING CART</span>
          <span className="text-gray-300">›</span>
          <span className="text-bio-green">CHECKOUT</span>
          <span className="text-gray-300">›</span>
          <span>CONFIRMATION</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* ══ LEFT COLUMN ══ */}
        <div className="w-full lg:w-3/5 space-y-4">

          {/* ── Step 1: Delivery Address ── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-900 px-5 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-white text-green-800 text-xs font-extrabold flex items-center justify-center">1</span>
              <span className="text-white font-bold text-sm tracking-wide">DELIVERY ADDRESS</span>
            </div>
            <DeliveryAddress
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
              setSelectedOption={setSelectedOption}
              setIsAddNewOpen={setIsAddNewOpen}
              isAddNewOpen={isAddNewOpen}
            />
          </div>

          {/* ── Step 2: Apply Coupon ── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-900 px-5 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-white text-green-800 text-xs font-extrabold flex items-center justify-center">2</span>
              <span className="text-white font-bold text-sm tracking-wide">APPLY COUPON</span>
            </div>
            <div className="p-1">
              <ApplyCoupon id={id} setCoupon={setCoupon} />
            </div>
          </div>

        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-xl shadow-md sticky top-4 overflow-hidden">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-green-600 to-green-900 px-4 py-3">
              <p className="text-white font-bold text-sm tracking-wide">Order Summary</p>
              {data?.order?.order_id && (
                <p className="text-green-200 text-[10px] mt-0.5">{data.order.order_id} · {data.order.date}</p>
              )}
            </div>

            <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-2">
                  Items ({data?.order_items?.length ?? 0})
                </p>
                {(isCombo || data?.order?.is_shop_the_look) ? (
                  <div className="flex flex-wrap gap-2">
                    {activeItems?.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={`${axiosInstance.defaults.baseURL}${item.image}`}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "/placeholder-product.png")}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="ml-1 self-center">
                      <p className="font-semibold text-gray-800 text-xs">{comboOffer?.title || "Shop The Look"}</p>
                      <p className="text-[10px] text-gray-400">{data?.order_items?.length} items</p>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-2 w-1/2">Items Description</th>
                        <th className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-1">Qty</th>
                        <th className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-1">Savings</th>
                        <th className="text-right text-[9px] font-bold text-gray-400 uppercase tracking-wider py-1.5 px-2">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeItems?.map((item) => {
                        const discountPct = Number(item.discount_value ?? 0);
                        const hasSaving = Number(item.discount ?? 0) > 0;
                        return (
                          <tr key={item.id} className="align-middle">
                            {/* Description */}
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                  <img
                                    src={`${axiosInstance.defaults.baseURL}${item.image}`}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "/placeholder-product.png")}
                                  />
                                </div>
                                <span className="font-semibold text-gray-800 text-[10px] leading-tight line-clamp-2">{item.product_name}</span>
                              </div>
                            </td>
                            {/* Qty */}
                            <td className="py-2 px-1 text-center">
                              <span className="inline-block border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 min-w-[22px]">
                                {item.quantity}
                              </span>
                            </td>
                            {/* Savings */}
                            <td className="py-2 px-1 text-center">
                              {hasSaving ? (
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className="text-[9px] font-bold text-red-500">
                                    {item.discount_type === "%" ? `${discountPct.toFixed(0)}% Off` : `₹${Number(item.discount).toFixed(0)} Off`}
                                  </span>
                                  <span className="text-[9px] text-gray-400 line-through">₹{Number(item.mrp).toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="text-[9px] text-gray-400">—</span>
                              )}
                            </td>
                            {/* Price */}
                            <td className="py-2 px-2 text-right">
                              <span className="font-bold text-gray-800 text-[11px]">₹{Number(item.selling_price).toFixed(2)}</span>
                              {Number(item.total_gst_amount ?? 0) > 0 && (
                                <p className="text-[9px] text-indigo-500 mt-0.5">+GST ₹{Number(item.total_gst_amount).toFixed(2)}</p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <hr className="border-dashed" />

              {/* ── Price Breakdown ── */}
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Price Breakdown</p>
                <div className="space-y-2 text-sm">

                  {/* MRP Total */}
                  <div className="flex justify-between text-gray-600">
                    <span>MRP Total</span>
                    <span>₹{activeItems?.reduce((s, i) => s + Number(i.mrp) * i.quantity, 0).toFixed(2)}</span>
                  </div>

                  {/* Product Discount */}
                  {Number(activeOrder?.total_discount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        Discount
                        {activeOrder?.discount_type && (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                            {activeOrder.discount_type === "%" ? `${Number(activeOrder.discount_value ?? 0).toFixed(0)}%` : `Flat ₹${Number(activeOrder.discount_value ?? 0).toFixed(2)}`}
                          </span>
                        )}
                      </span>
                      <span>-₹{Number(activeOrder?.total_discount ?? 0).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Coupon Discount */}
                  {coupon?.success && Number(coupon?.discount_amount ?? 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        🏷️ Coupon
                        <span className="text-[10px] bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 font-semibold">
                          {coupon.coupon_code}
                        </span>
                      </span>
                      <span>-₹{Number(coupon.discount_amount).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Taxable Sub Total */}
                  <div className="flex justify-between text-gray-800 font-semibold border-t pt-2">
                    <span>Taxable Sub Total</span>
                    <span>₹{Number(activeOrder?.total_price ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ── Product GST ── */}
              {(Number(activeOrder?.gst_amount_5 ?? 0) > 0 || Number(activeOrder?.gst_amount_18 ?? 0) > 0) && (
                <>
                  <hr className="border-dashed" />
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowGstDetail((v) => !v)}
                      className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1"
                    >
                      <span>Product Tax (GST)</span>
                      <span className="text-gray-400 text-xs">{showGstDetail ? "▲" : "▼"}</span>
                    </button>
                    {showGstDetail && (
                      <div className="space-y-1.5 text-sm mt-2">
                        {Number(activeOrder?.gst_amount_5 ?? 0) > 0 && (
                          <div className="border border-gray-200 rounded-lg p-2.5 space-y-1">
                            <div className="flex justify-between font-medium text-gray-700">
                              <span>GST @ 5%</span>
                              <span>₹{Number(activeOrder.gst_amount_5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>CGST 2.5%</span><span>₹{Number(activeOrder.cgst_amount_5).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>SGST 2.5%</span><span>₹{Number(activeOrder.sgst_amount_5).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        {Number(activeOrder?.gst_amount_18 ?? 0) > 0 && (
                          <div className="border border-gray-200 rounded-lg p-2.5 space-y-1">
                            <div className="flex justify-between font-medium text-gray-700">
                              <span>GST @ 18%</span>
                              <span>₹{Number(activeOrder.gst_amount_18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>CGST 9%</span><span>₹{Number(activeOrder.cgst_amount_18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-xs pl-2">
                              <span>SGST 9%</span><span>₹{Number(activeOrder.sgst_amount_18).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Shipping ── */}
              <hr className="border-dashed" />
              <div>
                <button
                  type="button"
                  onClick={() => setShowShippingDetail((v) => !v)}
                  className="w-full flex items-center justify-between text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1"
                >
                  <span>Shipping</span>
                  <span className="text-gray-400 text-xs">{showShippingDetail ? "▲" : "▼"}</span>
                </button>
                {/* Always show the total shipping line */}
                <div className="flex justify-between text-sm font-medium text-gray-700 mt-1">
                  <span>Shipping Charge</span>
                  <span>{deliveryCharge === 0 ? "Free" : `₹${Number(data.shipping_info?.final_shipping ?? (deliveryCharge + Number(data?.shipping_info?.shipping_gst ?? 0))).toFixed(2)}`}</span>
                </div>
                {showShippingDetail && deliveryCharge > 0 && (
                  <div className="border border-gray-200 rounded-lg p-2.5 space-y-1 text-sm mt-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping Charge (Base)</span>
                      <span>₹{Number(deliveryCharge).toFixed(2)}</span>
                    </div>
                    {Number(data?.shipping_info?.shipping_gst ?? 0) > 0 && (
                      <>
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping GST (18%)</span>
                          <span>₹{Number(data.shipping_info.shipping_gst).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs pl-2">
                          <span>CGST 9%</span>
                          <span>₹{Number(data.shipping_info.shipping_cgst).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs pl-2">
                          <span>SGST 9%</span>
                          <span>₹{Number(data.shipping_info.shipping_sgst).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 font-semibold border-t border-gray-200 pt-1.5 mt-1">
                          <span>Total Shipping</span>
                          <span>₹{Number(data.shipping_info.final_shipping ?? (deliveryCharge + Number(data?.shipping_info?.shipping_gst ?? 0))).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {data?.shipping_info?.free_shipping && (
                      <p className="text-[10px] text-gray-500 font-semibold">✓ Free shipping applied</p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Coupon applied confirmation ── */}
              {(coupon?.success || data?.order?.coupon_applied) && (
                <>
                  <hr className="border-dashed" />
                  <div className="bg-emerald-50 border border-dashed border-emerald-300 rounded-lg px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏷️</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {coupon?.coupon_code || data?.order?.applied_coupon || "Coupon Applied"}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">
                      -₹{Number(coupon?.discount_amount ?? data?.order?.coupon_discount ?? 0).toFixed(2)}
                    </span>
                  </div>
                </>
              )}

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

              {/* Place Order */}
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
              <p className="text-center text-[10px] text-gray-400">🔒 Safe and Secure Payments. 100% Authentic Products.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;