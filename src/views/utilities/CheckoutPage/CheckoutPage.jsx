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
    <div className="bg-gray-100 p-4 font-sans">
      <div
        className="bg-gradient-to-r from-green-500 to-green-900 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center text-sm md:text-base">
          <span className="bg-white text-blue-900 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">
            2
          </span>
          Delivery Details
        </h2>
      </div>

      {isOpen && (
        <div className="bg-white p-4 shadow-md rounded-md mt-2 space-y-6">
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
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
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
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-white border-gray-200 hover:border-blue-300'
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
      )}
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
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="saveToProfile" className="text-xs text-gray-600 font-medium cursor-pointer">
              Save in profile (Set as default)
            </label>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-800"
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






const OrderSummaryItem = ({ title, Quantity, mrp, sales_price, total, image }) => {

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-4">
        <img name=" "
          src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
          alt={title}
          loading="lazy"
          className="w-24 h-24 object-cover rounded-md"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Quantity: {Quantity}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">₹{Math.round(sales_price)}</span>
              {/* <span className="text-gray-500 text-sm">{mrp}</span> */}

              <span className="text-gray-500 line-through text-sm">MRP ₹{Math.round(mrp)}</span>

            </div>
            {/* <p className="text-bio-green text-sm">You Save ₹{saving}</p> */}

          </div>
        </div>
      </div>

    </div>
  );
};















const OrderSummary = ({ selectedOption, selectedAddress, data }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(false);
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
          <span className="bg-white text-blue-900 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">
            1
          </span>
          Order Summary
        </h2>
        <span className="text-white font-bold">{isOpen ? "" : ""}</span>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div>
          <div className="divide-y divide-gray-200 mt-4">
            {/* <OrderSummaryItem
              title="Peace Lily Plant"
              details="2ft /2ft- GroPot / Ivory"
              price="499.00"
              originalPrice="599.00"
              discount="20%"
              savings="100.00"
            /> */}
            {(data?.order_items || []).map((item, idx) => (
              <OrderSummaryItem
                key={item.id ?? idx}
                title={item.product_name}
                Quantity={item.quantity}
                mrp={Math.round(item.mrp)}
                sales_price={Math.round(item.selling_price)}
                total={Math.round(item.total)}
                image={item.image}
              />
            ))}
          </div>

          {/* Save Order Summary Button
          <div className="flex justify-center p-4 border-t mt-4">
            <button
              className="bg-bio-green text-white px-6 py-2 rounded-md hover:bg-lime-400 transition-colors"
              onClick={handleSaveOrderSummary}
            >
              Place Order
            </button>
          </div> */}
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
    <div className="bg-gray-100 p-4 mt-4">
      <div
        className="bg-gradient-to-r from-green-500 to-green-900 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center text-sm md:text-base">
          <span className="bg-white text-blue-900 w-6 h-6 flex items-center justify-center rounded-full mr-2 text-xs">
            3
          </span>
          Apply Coupon Code
        </h2>
        <span className="text-white font-bold text-xl sm:text-2xl">{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div className="p-4">
          {/* Manual coupon entry */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
            />
            <button
              onClick={applyManualCoupon}
              className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm w-full sm:w-auto"
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
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-dashed rounded-md gap-2"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <Tag className="text-bio-green mt-1 sm:mt-0" size={20} />
                      <div className="text-sm">
                        <p className="font-medium">{offer.description}</p>
                        <p className="text-gray-600">
                          Minimum Amount: ₹{offer.minimum_order_value}
                        </p>
                        <p className="font-bold text-blue-800">{offer.code}</p>
                      </div>
                    </div>

                    <button
                      className={`font-semibold px-4 py-2 rounded-md mt-2 sm:mt-0 text-sm ${offer.is_applicable
                        ? "text-white bg-blue-900 hover:bg-blue-700 cursor-pointer"
                        : "text-gray-500 bg-gray-300 cursor-not-allowed"
                        }`}
                      onClick={() => offer.is_applicable && applyCouponById(offer.id)}
                      disabled={!offer.is_applicable}
                    >
                      APPLY OFFER
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No available coupons at the moment 💸
                </div>
              )}
            </div>
          </div>

          {/* Hide scrollbar utility */}
          <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
      <div className="bg-blue-900 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2">
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

  const isCombo = !!(data?.order?.is_combo_purchase || data?.order?.is_shop_the_look || comboOffer);

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
      enqueueSnackbar("Please fill in all the required details!", { variant: "warning" });
      return;
    }

    const orderSummaryData = {
      order_id: data.order.id,
      address_id: selectedAddress,
      delivery_option: selectedOption?.deliveryType,
      store_id: selectedOption?.storeId,
    };

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/orderSummary/`,
        orderSummaryData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.message === "success") {
        enqueueSnackbar("Order summary saved successfully!", { variant: "success" });

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
        router.push("/paymentgateway");
      }
    } catch (error) {
      console.error("Error saving order summary:", error);

      // Show a detailed error message
      enqueueSnackbar(
        error.response?.data?.message || "Failed to save order summary. Please try again.",
        { variant: "error" }
      );
    }
  };

  const deliveryCharge = Number(data?.shipping_info?.shipping_charge || 0);

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

    <>


      <div className="flex flex-col lg:flex-row bg-gray-100 p-4">
        {/* Left Side - Steps */}
        <div className="w-full lg:w-3/4">
          <div className="space-y-4">
            {/* Order Summary */}
            <OrderSummary
              selectedOption={selectedOption}
              selectedAddress={selectedAddress}
              data={data}
            />

            {/* Delivery Details (Address + Options) */}
            <DeliveryAddress
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
              setSelectedOption={setSelectedOption}
              setIsAddNewOpen={setIsAddNewOpen}
              isAddNewOpen={isAddNewOpen}
            />

            {/* Apply Coupon */}
            <ApplyCoupon id={id} setCoupon={setCoupon} />
          </div>
        </div>

        {/* Right Side - Price Details (Sticky) */}
        <div className="w-full lg:w-1/4 lg:pl-6">
          <div className="bg-white p-4 rounded-md shadow-md sticky top-4">
            <h2 className="text-gray-500 font-semibold mb-2">Your Items</h2>
            <hr />

            <div className="mt-4 space-y-4">
              {(isCombo || data?.order?.is_shop_the_look) ? (
                // ✅ Combo/Shop The Look Offer Block
                <div className="flex flex-col gap-4">
                  {/* Image Gallery */}
                  <div className="flex flex-wrap gap-3">
                    {data?.order_items?.map((item) => (
                      <div key={item.id} className="w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={`${axiosInstance.defaults.baseURL}${item.image}`}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Combo Title */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {comboOffer?.title || "Shop The Look"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {data?.order_items?.length} items
                    </p>
                  </div>
                </div>
              ) : (
                // ✅ Normal Products Block
                <>
                  {/* Image Gallery - Render once */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {data?.order_items?.map((item) => (
                      <div key={item.id} className="w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={`${axiosInstance.defaults.baseURL}${item.image}`}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Price Details */}
            <h2 className="text-gray-500 font-semibold mt-6 mb-2">Price Details</h2>
            <hr />
            <div className="space-y-2 mt-4">
              {/* Price */}
              <div className="flex justify-between text-gray-700">
                <span>Sub Total x {data?.order_items?.length ?? 0}</span>
                <span>
                  ₹
                  {Math.round((isCombo || data?.order?.is_shop_the_look)
                    ? (data?.order?.total_price ?? 0)
                    : (coupon?.order?.total_price ?? data?.order?.total_price ?? 0))}
                </span>
              </div>

              {/* Discount */}
              <div className="flex justify-between text-bio-green">
                <span>Discount</span>
                <span>-₹{Math.round(coupon?.order?.total_discount ?? data?.order?.total_discount ?? 0)}</span>
              </div>

              {/* Coupon Discount */}
              <div className="flex justify-between text-bio-green">
                <span>Coupon Discount</span>
                <span>-₹{Math.round(coupon?.discount_amount ?? 0)}</span>
              </div>

              {/* Delivery Charges */}
              {/* Delivery Charges */}
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                <div className="flex flex-col items-end">
                  <span className={deliveryCharge === 0 ? "text-bio-green" : ""}>
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}
                  </span>
                  {data?.shipping_info?.free_shipping && deliveryCharge > 0 && (
                    <span className="text-[10px] text-bio-green">Coupon Applied</span>
                  )}
                </div>
              </div>


              {/* Packaging Fee */}
              {/* <div className="flex justify-between text-gray-700">
        <span>Secured Packaging Fee</span>
        <span className="line-through text-gray-400">₹198</span>
        <span className="text-bio-green">Free</span>
      </div> */}

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">GD Coins Earned</p>
                    <p className="text-xs text-gray-500">Use coins on your next order</p>
                  </div>
                </div>

                <span className="text-lg font-bold text-orange-600">
                  {Math.round(
                    0.1 *
                    (correctedPayableAmount)
                  )}
                </span>
              </div>


            </div>

            <hr className="my-4" />

            {/* Total Amount */}
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>₹{Math.round(correctedPayableAmount)}</span>
            </div>




            <hr className="my-4" />

            {/* Savings */}
            <div className="text-bio-green text-sm font-semibold">
              You will save ₹
              {Math.round(coupon?.discount_amount
                ? coupon.discount_amount + (data?.order?.total_discount || 0)
                : data?.order?.total_discount || 0)}
              &nbsp; on this order
            </div>


            {/* Save Order Summary Button */}
            <div className="flex justify-center p-4 border-t mt-4">
              <button
                className="bg-bio-green text-white px-6 py-2 rounded-md hover:bg-lime-400 transition-colors"
                onClick={handleSaveOrderSummary}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default CheckoutPage;