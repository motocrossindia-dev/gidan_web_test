'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { signInSuccess, signInStart, signInFail } from '@/redux/Auth/authSlice';
import { setVerifiedUser } from '@/redux/User/verificationSlice';
import { setUsername } from '@/redux/Slice/userSlice';
import { storeToken } from '@/Services/Services/LocalStorageServices';
import { storenewData } from '@/redux/newUserData/newUserdataSlice';

import StepMobile from './StepMobile';
import StepOTP from './StepOTP';
import StepDetails from './StepDetails';

const LoginContainer = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Details
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [name, setName] = useState('');
    const [referral, setReferral] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectUrl = searchParams.get('redirect') || '/';

    // Step 1: Request OTP
    const handleMobileSubmit = async (e) => {
        e.preventDefault();
        if (mobile.length < 10) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            dispatch(signInStart());
            const formDataToSend = new FormData();
            formDataToSend.append("mobile", mobile);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/registerWithMobile/`,
                formDataToSend,
                { headers: { "Content-Type": "application/json" } }
            );

            dispatch(signInSuccess(response.data));
            localStorage.setItem("storeUserData", JSON.stringify(response.data));
            
            enqueueSnackbar(response?.data.message || "OTP sent successfully!", { variant: "success" });
            setStep(2);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
            dispatch(signInFail(errorMessage));
            setError(errorMessage);
            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 4) {
            setError("Please fill all OTP fields.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/validateOtp/`,
                { mobile, otp: otpValue },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data) {
                if (response.data?.message === "OTP is valid. and only registered with mobile number.") {
                    // New user -> Go to Step 3
                    dispatch(storenewData(response.data));
                    setStep(3);
                } else {
                    // Existing user -> Login complete
                    completeLogin(response.data);
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
            setError(msg);
            enqueueSnackbar(msg, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Register Details
    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Full Name is required.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/register/`,
                { name, mobile, referral_code: referral },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data) {
                completeLogin(response.data);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "An error occurred during registration.";
            setError(msg);
            enqueueSnackbar(msg, { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const completeLogin = (data) => {
        const token = data.data?.token;
        const user = data.data?.user;

        storeToken(token, token);
        dispatch(setVerifiedUser(data));
        dispatch(setUsername(user.name || user.first_name));
        localStorage.setItem("userData", JSON.stringify(user));
        
        // Notify other components
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("wishlistUpdated"));

        enqueueSnackbar("Logged in successfully!", { variant: "success" });
        router.push(redirectUrl);
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("mobile", mobile);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/account/registerWithMobile/`,
                formDataToSend,
                { headers: { "Content-Type": "application/json" } }
            );
            enqueueSnackbar("OTP resent successfully.", { variant: "info" });
            setOtp(['', '', '', '']);
        } catch (err) {
            enqueueSnackbar("Failed to resend OTP.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(55,84,33,0.1)] border border-gray-100">
                {step === 1 && (
                    <StepMobile 
                        mobile={mobile} 
                        setMobile={setMobile} 
                        onSubmit={handleMobileSubmit} 
                        error={error} 
                        loading={loading}
                    />
                )}
                {step === 2 && (
                    <StepOTP 
                        otp={otp} 
                        setOtp={setOtp} 
                        mobile={mobile} 
                        onSubmit={handleOTPSubmit} 
                        error={error} 
                        loading={loading}
                        onResend={handleResendOTP}
                    />
                )}
                {step === 3 && (
                    <StepDetails 
                        name={name} 
                        setName={setName} 
                        referral={referral} 
                        setReferral={setReferral} 
                        onSubmit={handleDetailsSubmit} 
                        error={error} 
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default LoginContainer;
