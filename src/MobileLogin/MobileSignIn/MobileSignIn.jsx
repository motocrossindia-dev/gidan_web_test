import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Biotech-Maali.png";
import logoImage from "../../Assets/MobileSignin.png";
import { useDispatch } from "react-redux";
import { signInStart, signInFail, signInSuccess } from "../../redux/Auth/authSlice";
import { useSnackbar } from "notistack";
import axiosInstance from "../../Axios/axiosInstance";
import {Helmet} from "react-helmet";

const MobileSignIn = () => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState("");
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState("");

    const validateMobile = (mobile) => {
        const mobileRegex = /^[+]{0,1}[0-9]{10}$/;
        return mobileRegex.test(mobile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateMobile(mobileNumber)) {
            setError("Please enter a valid mobile number.");
            return;
        }

        try {
            dispatch(signInStart());
            const response = await axiosInstance.post(
                `/account/registerWithMobile/`,
                { mobile: mobileNumber },
                { headers: { "Content-Type": "application/json" } }
            );

            dispatch(signInSuccess(response.data));
            localStorage.setItem("storeUserData", JSON.stringify(response.data));

            if (response.status === 201 || response.status === 200) {
                enqueueSnackbar(response?.data.message, { variant: "success" });
                setMobileNumber("");
                navigate("/mobile-verification");
            }
        } catch (error) {
            dispatch(signInFail(error.message));
            setError("Mobile number already exists");
            enqueueSnackbar(error.response?.data?.message || "An error occurred", { variant: "error" });
        }
    };

    return (
        <>
            <Helmet>
                <title>Gidan - Mobile SignIn</title>
            </Helmet>
        <div className="flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md p-6 rounded-lg bg-white ">
                <div className="flex justify-center mb-4">
                    <img name=" "    src={logo}  alt="logo" className="max-w-md" />
                </div>
                <div className="flex justify-center mb-4">
                    <img name=" "    src={logoImage}  alt="Illustration" className="w-full max-w-xs h-40" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 text-left">Login or Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Enter Your Mobile Number</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            placeholder="+91 888822990"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9630] focus:border-transparent"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-bio-green text-white py-2 rounded-lg font-medium">
                        Get OTP
                    </button>
                    <div>
                        <p className="text-center text-xs text-gray-500 mt-10 space-y-1">
                            <span>By clicking through, I agree with the </span>
                            <span className="text-blue-500 cursor-pointer">Terms of Service <span className="text-gray-500"> & </span>Privacy Policy</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>

            </>
    );
};

export default MobileSignIn;