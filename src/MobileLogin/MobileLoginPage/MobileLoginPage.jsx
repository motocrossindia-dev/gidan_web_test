'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import __logo from "../../Assets/Gidan_logo.webp";
import __logoImage from "../../Assets/MobileLogin.webp";
import { signInSuccess } from "../../redux/Auth/authSlice"; // Action to update user state
import { setVerifiedUser } from "../../redux/User/verificationSlice";
import { setUsername } from "../../redux/Slice/userSlice";
import { storeToken } from "../../Services/Services/LocalStorageServices";
import axiosInstance from "../../Axios/axiosInstance";
import {Helmet} from "react-helmet-async";

const logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logoImage = typeof __logoImage === 'string' ? __logoImage : __logoImage?.src || __logoImage;

const MobileLoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    referralCode: '',
  });

  const mobile = useSelector((state) => state.auth.currentUser?.mobile);
  const first_name = useSelector((state) => state.auth.currentUser?.first_name);
  const [new_user_mobile] = useState(() => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem("storeUserData"));
  });
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Debugging log
  
    dispatch(signInSuccess({
      name: formData.name,
      mobile: mobile,
      first_name: first_name,
    }));
  
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/register/`,
        {
          name: formData.name,
          mobile: new_user_mobile.mobile,
          referralCode: formData.referralCode,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.data) {
        storeToken(response.data.data.token, response.data.data.token);
        const user = response.data.data.user;
        dispatch(setVerifiedUser(response.data));
        dispatch(setUsername(user.name || user.first_name));
        localStorage.setItem("userData", JSON.stringify(user));
        enqueueSnackbar("Logged in successfully!", { variant: "success" });
        router.push("/"); // Redirect to homepage after login
      }
    } catch (error) {
      console.error("API Error: ", error); // Log error in the console
      if (error.response) {
        enqueueSnackbar(error.response.data.message || "An error occurred while registering.", { variant: "error" });
      } else {
        enqueueSnackbar("Network error. Please try again.", { variant: "error" });
      }
    }
  };
  

  return (
      <>
        <Helmet>
          <title>Gidan - Mobile Login Page</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img name=" "    src={logo} alt="logo"  className="mx-auto w-[110px] h-[70px]" />
        </div>

        <div className="flex justify-center mb-4">
          <img name=" "    src={logoImage}  alt="Illustration" className="w-full max-w-xs h-40" />
        </div>

        <form className="space-y-4 mt-14" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name" // Name attribute to match state property
              value={formData.name} // Value is controlled by state
              onChange={handleInputChange} // Update state on input change
              placeholder="Enter Name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="referral" className="block text-sm font-medium text-gray-700">
              Enter The Referral Code (optional)
            </label>
            <input
              type="text"
              id="referral"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="000000"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bio-green focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-bio-green hover:bg-bio-green text-white py-2 rounded-lg font-medium"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-blue-500 mt-5 cursor-pointer" onClick={() => router.push("/mobile-signin")}>
          Back to sign-in
        </p>
      </div>
    </div>

        </>
  );
};

export default MobileLoginPage;