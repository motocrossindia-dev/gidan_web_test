'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSnackbar } from "notistack";
import useDeviceDetect from "../../../CustomHooks/useDeviceDetect";
import DeactivationConfirmation from "../Deactivation/Deactivation"; // Import the DeactivationConfirmation component
import AddressSection from "./AddressSection";
import FAQSection from "./FAQSection";
import axiosInstance from "../../../Axios/axiosInstance";
import { setGst } from '../../../redux/Slice/userSlice';


const ProfileForm = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isDesktop } = useDeviceDetect();
  const accessToken = useSelector(selectAccessToken);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivation, setShowDeactivation] = useState(false); // Define state for deactivation confirmation

  // Form state
  const [userName, setUserName] = useState("");
  const [lastUserName, setLastUserName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userId, setUserId] = useState(null);

  // const [userGst, setUserGst] = useState("");
  const gst = useSelector((state) => state.user.gst);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
    fetchProfileData();
  }, [accessToken]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/account/profile/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const profileData = response.data.data.profile;
      setUserId(profileData.id);
      setUserName(profileData.first_name || "");
      setLastUserName(profileData.last_name || "");
      setGender(profileData.gender || "");
      setDateOfBirth(profileData.date_of_birth || "");
      setUserEmail(profileData.email || "");
      setUserMobile(profileData.mobile || "");
      dispatch(setGst(profileData.gst || ""));

    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields are filled
    if (!userName || !lastUserName || !gender || !userEmail) {
      alert("Please fill all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate date of birth is not today or in the future
    const today = new Date();
    const selectedDate = new Date(dateOfBirth);
    if (selectedDate >= today) {
      alert("Please enter a valid date of birth");
      return;
    }

    const profileData = {
      profile: {
        id: userId,
        first_name: userName,
        last_name: lastUserName,
        email: userEmail,
        ...(dateOfBirth ? { date_of_birth: dateOfBirth } : {}),
        gender: gender,
        mobile: userMobile,
        gst: gst,
      },
    };

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/profile/`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.message === "success") {
        setIsEditing(false);
        fetchProfileData(); // Refresh the profile data
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      enqueueSnackbar("Failed to update profile. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleGstChange = (e) => {
    dispatch(setGst(e.target.value));
  };

  return (
    <>

      <div>
        <div>
          {showDeactivation ? (
            <DeactivationConfirmation
              onCancel={() => setShowDeactivation(false)}
            />
          ) : (
            <main className="bg-white p-8">
              <div className="border p-6 rounded-md shadow-md bg-white">
                {/* Title */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Personal Information </h2>
                  {/* Edit Button */}
                  <div>
                    {!isEditing ? (
                      <p
                        className="text-bio-green font-semibold cursor-pointer"
                        onClick={handleEditClick}
                      >
                        Edit
                      </p>
                    ) : (
                      <p
                        className="text-red-600 font-semibold cursor-pointer"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleProfileSubmit}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block font-semibold">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter your First Name"
                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={!isEditing}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} // Update state
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Last Name</label>
                      <input
                        type="text"
                        placeholder="Enter your Last Name"
                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={!isEditing}
                        value={lastUserName}
                        onChange={(e) => setLastUserName(e.target.value)} // Update state
                        required
                      />
                    </div>
                  </div>

                  {/* Gender & Date of Birth Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block font-semibold">Gender</label>
                      <div className="flex space-x-4 mt-2">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={gender === "Male"}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2"
                            disabled={!isEditing}
                            required
                          />{" "}
                          Male
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={gender === "Female"}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2"
                            disabled={!isEditing}
                            required
                          />{" "}
                          Female
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Other"
                            checked={gender === "Other"}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2"
                            disabled={!isEditing}
                            required
                          />{" "}
                          Others
                        </label>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-md font-semibold text-gray-700"
                      >
                        Date of Birth
                        <input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
                          max={new Date().toISOString().split("T")[0]} // Set max date to today
                          disabled={!isEditing}
                        />
                        {dateOfBirth ===
                          new Date().toISOString().split("T")[0] && (
                            <p className="text-red-500 text-sm mt-2">
                              Valid date of birth required
                            </p>
                          )}
                      </label>
                    </div>
                  </div>

                  {/* Other Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block font-semibold">Email ID</label>
                      <input
                        type="email"
                        placeholder="Enter your Email ID"
                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={!isEditing}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)} // Update state
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your Mobile Number"
                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        // disabled={true}
                        disabled={!isEditing}
                        value={userMobile}
                        onChange={(e) => setUserMobile(e.target.value)} // Update state
                        required
                      />
                    </div>


                    <div>
                      <label className="block font-semibold">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your GST Number"
                        className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        // disabled={true}
                        disabled={!isEditing}
                        value={gst}
                        onChange={handleGstChange} // Update state

                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="bg-bio-green text-white px-4 py-2 rounded hover:bg-green-500"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </main>
          )}
        </div>
        <AddressSection />
        {/* <FAQSection /> */}
      </div>
    </>
  );
};

export default ProfileForm;