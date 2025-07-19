import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";


const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    mobile: "",
  });

  const handleBackClick = () => {
    navigate("/mobilesidebar"); // Navigate to MobileSidebar
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `/account/profile/`);

      if (response.status === 200) {
        setProfile(response.data.data.profile);
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch profile data.", { variant: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        `/account/profile/`,
        { profile },
        
        
      );

      if (response.status === 200) {
        enqueueSnackbar("Profile updated successfully.", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to update profile.", { variant: "error" });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
              {/* <Header />
            <Navigation/> */}
    <div className={`flex justify-center items-center min-h-screen ${isMobile ? 'bg-gray-100' : 'bg-white'}`}>
      <div className="w-full max-w-md bg-white p-4 shadow-md rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <button onClick={handleBackClick} className="mr-3">
            <FaArrowLeft className="text-gray-700 text-xl" />
          </button>
          <h2 className="text-lg font-semibold flex-grow text-center">Edit Profile</h2>
        </div>

        {/* Form */}
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Last Name"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700">Your Gender</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={profile.gender === "Male"}
                  onChange={handleInputChange}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={profile.gender === "Female"}
                  onChange={handleInputChange}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={profile.gender === "Others"}
                  onChange={handleInputChange}
                />
                <span>Others</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Email Address"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              max={new Date().toISOString().split("T")[0]} // Set max date to today
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={profile.mobile}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
              placeholder="Mobile Number"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-green-700"
          >
            SAVE
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditProfile;