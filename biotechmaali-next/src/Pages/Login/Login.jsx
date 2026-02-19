'use client';

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import the action
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import __biotech from "../../Assets/Gidan_logo.webp"; // Adjust the path to your logo image
import { signInSuccess } from "../../redux/Auth/authSlice"; // Import the action to update the user state
import { enqueueSnackbar } from "notistack";
import { setVerifiedUser } from "../../redux/User/verificationSlice";
import { setUsername } from "../../redux/Slice/userSlice";
import { storeToken } from "../../Services/Services/LocalStorageServices";
import axios from "axios";
import Verify from "../../Services/Services/Verify";

const biotech = typeof __biotech === 'string' ? __biotech : __biotech?.src || __biotech;

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    referral_code: "",
  });

  const dispatch = useDispatch(); // Initialize dispatch


  const mobile = useSelector((state) => state?.auth?.currentUser?.mobile);
  const new_user_mobile = useSelector(
    (state) => state?.newUsersdata?.data?.mobile
  );
  const first_name = useSelector(
    (state) => state?.auth?.currentUser?.first_name
  );

  // Handle input changes and update the respective field in formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the respective field in formData
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs before submitting
    if (!formData.name || !new_user_mobile) {
      enqueueSnackbar("Mobile number and Name is required.", {
        variant: "error",
      });
      return;
    }

    // Dispatch action to update the username in Redux store
    dispatch(
      signInSuccess({
        name: formData.name, // Include name from formData
        mobile: mobile, // Include mobile from Redux
        first_name: first_name, // Include first_name from Redux
      })
    );
    try {
      // Make POST request to the API
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/account/register/`,
        {
          name: formData.name, // Use the correct name value
          mobile: new_user_mobile,
          referral_code: formData.referral_code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (response.data) {

        storeToken(response.data.data.token, response.data.data.token);
        const user = response.data.data.user;
        dispatch(setVerifiedUser(response.data));
        dispatch(setUsername(user.name || user.first_name));
        localStorage.setItem("userData", JSON.stringify(user));

        enqueueSnackbar("Logged in successfully!", { variant: "success" });
        onClose(); // Close the modal after successful submission
      } else {
        enqueueSnackbar(`Error: ${response.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while registering.", {
        variant: "error",
      });
    }
  };

  return (
    <>
    <Verify/>
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[350px] h-[auto]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-4">
          <img name="Gidan Logo"
            src={biotech}
            alt="Gidan Logo"
            width="129"
            height="82"
            className="mx-auto w-[129px] h-[82px]"
            loading="lazy"
          />
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Enter your details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="referral"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Referral Code (optional)
            </label>
            <input
              type="text"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );

};

export default Login;
