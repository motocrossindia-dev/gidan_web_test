'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { FaArrowLeft } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import HomepageSchema from "../../utilities/seo/HomepageSchema";
import StoreSchema from "../../utilities/seo/StoreSchema";
import Breadcrumb from "../../../components/Shared/Breadcrumb";
import { ChevronLeft, ArrowLeft } from "lucide-react";


const EditProfile = ({ onBack }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    mobile: "",
  });

  const handleBackClick = () => {
    if (onBack) onBack();
    else router.push("/profile");
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
      <div className="flex flex-col md:hidden bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="px-4 pt-4 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center text-[#375421] text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </button>
        </div>

        <div className="p-4 pt-2">
          <h2 className="text-xl font-bold">Edit Profile</h2>
        </div>
      </div>

      <div className="mt-0 text-xs sm:text-sm md:hidden">
        <Breadcrumb 
          items={[{ label: 'Profile', path: '/profile' }]} 
          currentPage="Edit Profile" 
        />
      </div>

      <div className={`flex justify-center items-start min-h-screen ${isMounted && isMobile ? 'bg-site-bg' : 'bg-white'} mt-2`}>
        <div className="w-full max-w-md bg-white p-4 shadow-md rounded-lg">
          {/* Header Removed as it is now in the sticky bar */}

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
            className="w-full bg-[#375421] text-white py-2 rounded-md text-lg font-semibold hover:bg-[#375421] hover:text-white"
          >
            SAVE
          </button>
        </form>
      </div>
    </div>

      <HomepageSchema/>
      <StoreSchema/>
    </>
  );
};

export default EditProfile;