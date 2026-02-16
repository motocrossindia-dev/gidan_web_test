import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import biotech from "../../../src/Assets/Gidan_logo.webp";
import { useSnackbar } from "notistack"; // Correct import
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setVerifiedUser } from "../../redux/User/verificationSlice";
import { setUsername } from "../../redux/Slice/userSlice";
import { storeToken } from "../../Services/Services/LocalStorageServices";
import { storenewData } from "../../redux/newUserData/newUserdataSlice";
import Verify from "../../Services/Services/Verify";

const Verification = ({ onClose, onSubmit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar(); // Correct usage of useSnackbar
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mobile = JSON.parse(localStorage.getItem("storeUserData"))?.mobile;

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

    const payload = {
      mobile,
      otp,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/account/validateOtp/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );


      if (response.data) {
 

        if ( response.data?.message ==="OTP is valid. and only registered with mobile number.") 
{

          onSubmit(); // open the login page for the new user
          // dispatch(setVerifiedUser(response));
          dispatch(storenewData(response.data));
        } else {

          // handle the message for the old user, no need to open the login page
          storeToken(response?.data?.data?.token, response?.data?.data?.token);
          const user = response.data.data.user;
          dispatch(setVerifiedUser(response.data));
          dispatch(setUsername(user.name || user.first_name));
          localStorage.setItem("userData", JSON.stringify(user));
          onClose();
          navigate("/");
        }
      }

      //("/");
      // }
    } catch (error) {

      if (error.response?.data?.message) {
        setError("Invalid OTP. Please try again.");
        // setOtpDigits(["", "", "", ""]);
        enqueueSnackbar("Invalid OTP. Please try again.", { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleResendOTP = () => {
  //   enqueueSnackbar("OTP Resent Successfully!", { variant: "info" });
  // };


  const handleResendOTP = async () => {
  const mobile = JSON.parse(localStorage.getItem("storeUserData"))?.mobile;

  if (!mobile) {
    enqueueSnackbar("Mobile number not found.", { variant: "error" });
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("mobile", mobile);

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/account/registerWithMobile/`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      enqueueSnackbar(response?.data?.message || "OTP resent successfully.", {
        variant: "info",
      });
      setOtpDigits(["", "", "", ""]);
    }
  } catch (error) {
    enqueueSnackbar(
      error.response?.data?.message || "Failed to resend OTP.",
      { variant: "error" }
    );
  }
};

  return (
    <>
    <Verify/>
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[350px] h-[380px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-4 flex justify-center">
          <img name=" "   
            src={biotech}
            alt="Gidan Logo"
            width="129"
            height="82"
            className="w-[129px] h-[82px]"
            loading="lazy"
          />
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <h2 className="text-center text-lg font-semibold mb-6">
          Enter verification code
        </h2>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex justify-center gap-4 mb-4">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                className="w-12 h-12 text-center border rounded outline-none focus:ring focus:ring-green-300 text-xl"
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <div className="flex justify-between w-full mb-4">
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-green-500 text-sm font-medium"
            >
              Resend
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Verification;
