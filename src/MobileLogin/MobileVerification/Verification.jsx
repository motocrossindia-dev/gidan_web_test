import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import logo from "../../Assets/Biotech-Maali.png";
import logoImage from "../../Assets/MobileLogin.png";
import { useDispatch } from "react-redux";
import {
  signInSuccess,
} from "../../redux/Auth/authSlice";
import { storeToken } from "../../Services/Services/LocalStorageServices";
import { setVerifiedUser } from "../../redux/User/verificationSlice";
import { setUsername } from "../../redux/Slice/userSlice";
import {Helmet} from "react-helmet";



const MobileVerification = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mobile = JSON.parse(localStorage.getItem("storeUserData"))?.mobile || "";
  const dispatch = useDispatch();
  const handleOTPChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const updatedOtpDigits = [...otpDigits];
      updatedOtpDigits[index] = value.slice(0, 1);
      setOtpDigits(updatedOtpDigits);

      if (value && index < otpDigits.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otp = otpDigits.join("");

    if (otp.length < 4) {
      setError("Please fill all OTP fields");
      setLoading(false);
      return;
    }

    setError("");

    const payload = { mobile, otp };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/account/validateOtp/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );


      if (response.data?.message) {
        if (response.data.message === "OTP is valid. and only registered with mobile number.") {
          navigate("/mobile-login"); // Open login for new users
        } else {
          storeToken(response?.data?.data?.token, response?.data?.data?.token);
          const user = response.data.data.user;
          dispatch(setVerifiedUser(response.data));
          dispatch(setUsername(user.name || user.first_name));
          dispatch(signInSuccess(response?.data?.data));
          localStorage.setItem("userData", JSON.stringify(response.data.data.user));
          localStorage.setItem("token", JSON.stringify(response.data.data.token.access));
          navigate("/"); // Redirect to homepage after successful login
        }
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      enqueueSnackbar("Invalid OTP. Please try again.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <Helmet>
          <title>Gidan - Mobile Verification</title>
        </Helmet>
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <img name=" "    src={logo}  alt="logo" className="max-w-xs" />
        </div>
        <div className="flex justify-center mb-4">
          <img name=" "    src={logoImage}  alt="Illustration" className="w-full max-w-xs h-40" />
        </div>
        <p className="text-center text-black font-semibold mb-6">Enter OTP</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-bio-green"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full bg-bio-green text-white py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-bio-green"}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive the verification OTP?{' '}
          <span className="text-bio-green] cursor-pointer font-semibold">Resend OTP</span>
        </p>
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm font-semibold">VERIFY DETAILS</p>
          <p className="text-gray-800 text-base">
            OTP Sent to <span className="font-semibold">{mobile}</span>
          </p>
        </div>
      </div>
    </div>
        </>
  );
};

export default MobileVerification;