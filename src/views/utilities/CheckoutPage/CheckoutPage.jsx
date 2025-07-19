
import React, { useEffect, useState } from "react";
import { Tag } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { useLocation,useNavigate } from "react-router-dom";
import RazorpayPayment from "../RazorPayment/RazorpayPayment";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import {Helmet} from "react-helmet";

const DeliveryAddress = ({setSelectedAddress}) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(true); // Toggles visibility of the section
  const [address, setAddresses] = useState([]);

  useEffect(() => {
    fetchDefaultAddress();
  }, [accessToken]);

  const fetchDefaultAddress = async () => {
    try {
      const response = await axiosInstance.get(
        `/account/address/`);
      const defaultAddress = response.data.data.address.find(
        (addr) => addr.is_default
      );
      if (defaultAddress) {
        setAddresses([defaultAddress]);
        setSelectedAddress(defaultAddress.id)
      }
      
    } catch (error) {
      console.error("Error fetching default address:", error);
    }
  };

  const handleEdit = (index) => {
    setAddresses(
      address.map((address, i) =>
        i === index ? { ...address, isEditing: true } : address
      )
    );
  };

  const handleCancelEdit = (index) => {
    setAddresses(
      address.map((address, i) =>
        i === index ? { ...address, isEditing: false } : address
      )
    );
  };

  const handleSaveEdit = (index) => {
    setAddresses(
      address.map((address, i) =>
        i === index ? { ...address, isEditing: false } : address
      )
    );
  };

  const handleAddressChange = (index, field, value) => {
    setAddresses(
      address.map((address, i) =>
        i === index ? { ...address, [field]: value } : address
      )
    );
  };


  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="bg-gray-100 p-4 font-sans">
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2">
            1
          </span>
          Delivery Address
        </h2>
      </div>

      {isOpen && (
        <div className="bg-white p-4 shadow-md rounded-md mt-2">
          <h3 className="text-lg font-bold mb-4 text-bio-green">Address</h3>
          {address.map((address, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg shadow-md">
              {address.isEditing ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Edit Address</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold"
                      onClick={() => handleCancelEdit(index)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={address.firstName || address.first_name || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "firstName", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={address.lastName || address.last_name || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "lastName", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Apartment, Suite, etc. (Optional)"
                      value={address.address || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "address", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "city", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={address.state || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "state", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Karnataka">Karnataka</option>
                      {/* Add more states as options */}
                    </select>
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={address.pinCode || address.pincode || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "pinCode", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={address.phone || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "phone", e.target.value)
                      }
                      className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block font-semibold">Address Type</label>
                    <div className="flex space-x-4 mt-2">
                      <label>
                        <input
                          type="checkbox"
                          checked={address.isHome || false}
                          onChange={(e) =>
                            handleAddressChange(index, "isHome", e.target.checked)
                          }
                          className="mr-2"
                        />
                        Home (All day Delivery)
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={address.isWork || false}
                          onChange={(e) =>
                            handleAddressChange(index, "isWork", e.target.checked)
                          }
                          className="mr-2"
                        />
                        Work (9am - 6pm)
                      </label>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-bio-green text-white font-semibold py-2 px-4 rounded hover:bg-green-500"
                      onClick={() => handleSaveEdit(index)}
                    >
                      Save
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
                    <span className="font-bold">{`${address.first_name} ${address.last_name}`}</span>
                    <button
                      className="text-bio-green font-semibold"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                  </div>
                  <p>{address.address}</p>
                  <p>{address.city}</p>
                  <p className="text-sm">{address.state},{address.pincode}</p>

                </div>
              )}
            </div>
          ))}
         
        </div>
      )}
    </div>
  );
};




const AddNewAddress = () => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(false);
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
    setNewAddress({
      ...newAddress,
      [field]: value,
    });
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
        `${process.env.REACT_APP_API_URL}/account/address/`,
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
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 mt-4">
      {/* Add New Address Header */}
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2">
            +
          </span>
          Add New Address
        </h2>
        <span className="text-white font-bold">{isOpen ? "" : ""}</span>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="bg-white p-4 shadow-md rounded-md mt-2">
          <h3 className="text-bio-green font-bold mb-2">Add New Address</h3>
          <form className="space-y-4">
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
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="border p-2 rounded w-1/3"
                required
              />
              <select
                value={newAddress.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                className="border p-2 rounded w-1/3"
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
                value={newAddress.pinCode}
                maxLength={6}
                onChange={(e) => 
                  { 
                    const value = e.target.value.slice(0, 6);
                    handleAddressChange("pinCode", e.target.value ,value);}}
                className="border p-2 rounded w-1/3"
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone"
              value={newAddress.phone}
              maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
              onChange={(e) =>   
                {
                  const value = e.target.value.slice(0, 10);
                  handleAddressChange("phone", e.target.value, value);}}
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
                Home (All day Delivery)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  checked={newAddress.addressType === "Work"}
                  onChange={() => handleAddressChange("addressType", "Work")}
                  className="mr-2"
                />
                Work (9am - 6pm)
              </label>
            </div>
            {/* Buttons */}
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                className="bg-bio-green text-white px-4 py-2 rounded"
                onClick={handleSaveNewAddress}
              >
                Save
              </button>
              <button
                type="button"
                onClick={toggleDropdown}
                className="border border-bio-green px-4 py-2 rounded text-bio-green"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};






const OrderSummaryItem = ({ title, Quantity, mrp, sales_price, total,image }) => {
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-4">
        <img name=" "    
          src={`${process.env.REACT_APP_API_URL}${image}`}
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
            <span className="text-lg font-semibold">₹{sales_price}</span>
            {/* <span className="text-gray-500 text-sm">{mrp}</span> */}

              <span className="text-gray-500 line-through text-sm">MRP ₹{mrp}</span>

            </div>
            {/* <p className="text-bio-green text-sm">You Save ₹{saving}</p> */}
           
          </div>
        </div>
      </div>
     
    </div>
  );
};





const DeliveryOptions = ({ setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const deliveryOptions = [
    { id: "standard", label: "Standard", price: "₹000.00" },
    { id: "express", label: "Express Way", price: "₹000.00" },
    { id: "Pick Up Store", label: "Pickup From Store" }
  ];

  const getStoreList = async () => {
    try {
      const response = await axiosInstance.get('/store/store_list/');
      if (response.status === 200) {
        setStores(response?.data?.data?.stores);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoreList();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = (optionId) => {
    setSelected(optionId);
    setSelectedOption({ deliveryType: optionId, storeId: null }); // clear store ID initially
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStoreId(storeId);
    setSelectedOption({ deliveryType: selected, storeId }); // pass both values to parent
  };

  return (
    <div className="bg-gray-100 p-4 mt-4">
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-4 rounded-md cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2">2</span>
          Choose Delivery Option
        </h2>
      </div>

      {isOpen && (
        <div className="bg-white p-4 shadow-md rounded-md mt-2 space-y-4">
          {deliveryOptions.map((option) => (
            <div key={option.id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="delivery-option"
                  value={option.id}
                  checked={selected === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="w-5 h-5"
                />
                <label className="ml-2 text-gray-800">{option.label}</label>
              </div>
              {option.price && <span className="text-gray-600">{option.price}</span>}
            </div>
          ))}

          {selected === 'Pick Up Store' && (
            <div className="mt-4">
              <label className="block mb-2 font-medium text-gray-700">Select a Store</label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 custom-scroll">
                {stores.map((store, index) => (
                  <div
                    key={store.id}
                    onClick={() => handleStoreSelect(store.id)}
                    className={`p-3 rounded cursor-pointer border mb-2 transition ${
                      selectedStoreId === store.id
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{store.location}</p>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};









const OrderSummary = ({ selectedOption,selectedAddress,data }) => {
  const accessToken = useSelector(selectAccessToken);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const [orderSummary, setOrderSummary] = useState([]);
  const location = useLocation();
  const orderData = location.state?.resource; 

  

  const toggleDropdown = () => setIsOpen(!isOpen);

const handleSaveOrderSummary = async () => {
  if (!data?.order?.id || !selectedAddress || !selectedOption) {
    enqueueSnackbar("Please fill in all the required details!", { variant: "warning" });
    return;
  }

  const orderSummaryData = {
    order_id: data.order.id,
    address_id: selectedAddress,
    delivery_option: selectedOption?.deliveryType,
    store_id:selectedOption?.storeId,
  };

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_URL}/order/orderSummary/`,
      orderSummaryData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.data.message === "success") {
      enqueueSnackbar("Order summary saved successfully!", { variant: "success" });

      navigate("/paymentgateway", { 
        state: { resource: response.data.data, order_id: data.order.id } 
      });
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

  return (
    <div className="bg-gray-100 p-4 mt-4">
      <div className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-4 rounded-md cursor-pointer flex justify-between items-center" 
      onClick={toggleDropdown}
      >
        <h2 className="font-bold flex items-center">
          <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2">
            4
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
            {data.order_items.map((item) => (
            <OrderSummaryItem
              title={item.product_name}
              Quantity={item.quantity}
              mrp={item.mrp}
              sales_price={item.selling_price}
              total={item.total}
              image={item.image}
            />
            ))}
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
    try {
      const response = await axiosInstance.get(`/coupon/coupons/?order_id=${id}`);
      if (response.status === 200) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoupones();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const applyCouponById = async (couponId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/applyCoupon/`,
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
        setCoupon(response.data);
        enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to apply coupon. Please try again.";
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
    className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-4 rounded-md cursor-pointer flex justify-between items-center" 
    onClick={toggleDropdown}
  >
    <h2 className="font-bold flex items-center text-sm sm:text-base">
      <span className="bg-white text-blue-900 px-2 py-1 rounded-full mr-2 text-xs sm:text-sm">3</span>
      Apply Coupon
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
                  className={`font-semibold px-4 py-2 rounded-md mt-2 sm:mt-0 text-sm ${
                    offer.is_applicable
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



// import { useState } from "react";

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [isOpen, setIsOpen] = useState(false);
  const paymentOptions = [
    {
      id: 'wallet',
      title: 'Biotech Maali Wallet',
      description: 'Your current balance is ₹65.07.',
      type: 'checkbox'
    },
    {
      id: 'rewards',
      title: 'Biotech Maali Rewards',
      description: '25% Utilization on Cart Value',
      type: 'checkbox'
    },
    {
      id: 'razorpay',
      title: 'Razorpay Secure (UPI, Cards, Wallets,NetBanking)',
      description: (
        <div className="flex items-center gap-2 mt-1">
          <img name=" "    src="/api/placeholder/40/25" loading="lazy" alt="UPI" className="h-6" />
          <img name=" "    src="/api/placeholder/40/25" loading="lazy" alt="Visa" className="h-6" />
          <img name=" "    src="/api/placeholder/40/25" loading="lazy" alt="Mastercard" className="h-6" />
          <img name=" "    src="/api/placeholder/40/25" loading="lazy" alt="RuPay" className="h-6" />
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
          <RazorpayPayment/>
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

  const location = useLocation();
  const { resource } = location.state || {}; // Extract resource from state
  const [orderResource,setOrderResource] = useState(resource || {});
  const [selectedOption, setSelectedOption] = useState(null); // Lift state up
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [coupon,setCoupon] = useState()
 const data = location.state?.ordersummary;
  const id  = data?.order?.id
  
  
  

  useEffect(() => {
    if (resource) {
      setOrderResource(resource);
    }      
  },[resource]);


  return (

      <>
        <Helmet>
          <title>Biotech Maali - CheckoutPage </title>
        </Helmet>
<div className="flex flex-col lg:flex-row bg-gray-100 p-4">
  {/* Left Side - Steps */}
  <div className="w-full lg:w-3/4">
    <div className="space-y-4">
      {/* Delivery Address Dropdown */}
      <DeliveryAddress setSelectedAddress={setSelectedAddress} />

      {/* Add New Address Dropdown */}
      <AddNewAddress />

      {/* Choose Delivery Option */}
      <DeliveryOptions setSelectedOption={setSelectedOption} />

      {/* Apply Coupon */}
      <ApplyCoupon id={id} setCoupon={setCoupon} />

      {/* Order Summary */}
      <OrderSummary
        selectedOption={selectedOption}
        selectedAddress={selectedAddress}
        data={data}
      />
    </div>
  </div>

  {/* Right Side - Price Details (Sticky) */}
  <div className="w-full lg:w-1/4 lg:pl-6">
  <div className="bg-white p-4 rounded-md shadow-md sticky top-4">
    <h2 className="text-gray-500 font-semibold mb-2">Price Details</h2>
    <hr />
    <div className="space-y-2 mt-4">
      {/* Price */}
      <div className="flex justify-between text-gray-700">
        <span>Price ({coupon?.order_items?.length ?? data?.order_items?.length})</span>
        <span>₹{coupon?.order?.total_price ?? data?.order?.total_price}</span>
      </div>
      {/* Discount */}
      <div className="flex justify-between text-bio-green">
        <span>Discount</span>
        <span>-₹{coupon?.order?.total_discount ?? data?.order?.total_discount}</span>
      </div>   
         <div className="flex justify-between text-bio-green">
        <span>Coupon Discount</span>
        <span>-₹{coupon?.discount_amount}</span>
      </div>
      {/* Delivery Charges */}
      <div className="flex justify-between text-gray-700">
        <span>Delivery Charges</span>
        <span>
          <span className="line-through text-gray-400">₹80</span>{" "}
          <span className="text-bio-green">Free</span>
        </span>
      </div>
      {/* Packaging Fee */}
      <div className="flex justify-between text-gray-700">
        <span>Secured Packaging Fee</span>
        <span className="line-through text-gray-400">₹198</span>
        <span className="text-bio-green">Free</span>
      </div>
    </div>
    <hr className="my-4" />
    {/* Total Amount */}
    <div className="flex justify-between font-semibold text-gray-900">
  <span>Total Amount</span>
  <span>₹{(coupon?.order?.grand_total ?? data?.order?.grand_total) || 0}</span>
</div>

    <hr className="my-4" />
    {/* Savings */}
    <div className="text-bio-green text-sm font-semibold">
  You will save ₹
  {coupon?.discount_amount 
    ? coupon.discount_amount + (data?.order?.total_discount || 0) 
    : data?.order?.total_discount || 0} 
 &nbsp; on this order
</div>


  </div>
</div>

</div>
</>
  );
};

export default CheckoutPage;