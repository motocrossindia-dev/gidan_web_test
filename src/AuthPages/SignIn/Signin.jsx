'use client';

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import __biotech from "../../Assets/Gidan_logo.webp"; // Adjust the path to your logo image
import { useSnackbar } from "notistack";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFail,
} from "../../redux/Auth/authSlice";

const biotech = typeof __biotech === 'string' ? __biotech : __biotech?.src || __biotech;

const SignIn = ({ onClose, onGetOtpClick }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    mobile: "", // Mobile number field
  });
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const handleContentClick = (event) => {
    event.stopPropagation();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value.length <= 10) {
      setFormData({
        ...formData,
        [name]: value, // Update the mobile field in formData
      });
    }
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[+]{0,1}[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMobile(formData.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("mobile", formData.mobile);

    try {
      dispatch(signInStart());
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/registerWithMobile/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(signInSuccess(response.data));
      localStorage.setItem("storeUserData", JSON.stringify(response.data));
//data is send to backend

//this is response
      if (response.status === 201 || response.status === 200) {

        
        // Store mobile number in localStorage
        // localStorage.setItem("userMobile", formData.mobile);
        enqueueSnackbar(response?.data.message, { variant: "success" });
        setFormData({ mobile: "" });

        if (onGetOtpClick) {
          onGetOtpClick(formData); // Pass the form data to the parent component
        }
      }
    } catch (error) {
      dispatch(signInFail(error.message));
      //remove this line
      setError({ general: "Mobile number already exists" });
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Close modal when clicking outside the content
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[370px] h-[341px]"
        onClick={handleContentClick} // Prevent closing when clicking inside the content
      >
        <div className="relative mb-4">
          <img name=" "   
            src={biotech}
            alt="Gidan Logo"
            width="129"
            height="82"
            className="mx-auto w-[129px] h-[82px]"
          />
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <h2 className="text-center text-lg font-semibold mb-4">
          Welcome to Gidan
        </h2>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Your Mobile Number
          </label>
<input
  type="text" // No arrows
  inputMode="numeric" // Opens number keyboard on mobile
  pattern="[0-9]*" // Optional: allows only digits
  id="mobile"
  name="mobile"
  value={formData.mobile}
  onChange={handleChange}
  placeholder="+91 9876543210"
  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

        </div>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <button
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          onClick={handleSubmit} // Submit the form
        >
          Get OTP
        </button>
      </div>
    </div>
  );
};

export default SignIn;
