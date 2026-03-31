'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSnackbar } from "notistack";
import { useMediaQuery } from 'react-responsive';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DeactivationConfirmation from "../Deactivation/Deactivation";
import AddressSection from "./AddressSection";
import FAQSection from "./FAQSection";
import axiosInstance from "../../../Axios/axiosInstance";
import { setGst } from '../../../redux/Slice/userSlice';
import MobileSidebar from '../../utilities/MobileSidebar/MobileSidebar';
import EditProfile from '../../MobileUser/Edit Profile/EditProfile';


const ProfileForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isMobileView = useMediaQuery({ query: '(max-width: 780px)' });
  const [mounted, setMounted] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
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

  useEffect(() => { setMounted(true); }, []);

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
      {mounted && isMobileView ? (
        <>
          {mobileSection === 'editprofile' && (
            <EditProfile onBack={() => setMobileSection(null)} />
          )}
          {mobileSection === 'address' && (
            <AddressSection onBack={() => setMobileSection(null)} />
          )}
          {!mobileSection && <MobileSidebar onNavigate={setMobileSection} />}
        </>
      ) : (
        <div className="bg-site-bg min-h-screen">
          <div className="flex flex-col md:hidden bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-gray-100">
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center text-[#375421] text-xs font-black uppercase tracking-tight"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Profile
              </button>
              <div className="flex items-center gap-4 text-[10px] font-black text-[#375421] uppercase tracking-widest">
                 <button className="hover:underline">Settings</button>
              </div>
            </div>
            <div className="px-5 pb-4">
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Account</h1>
            </div>
          </div>
          {showDeactivation ? (
            <DeactivationConfirmation
              onCancel={() => setShowDeactivation(false)}
            />
          ) : (
            <main className="p-4 md:py-6 lg:py-8">
              <div className="bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-6 sm:p-10 rounded-[32px] border border-gray-100">
                {/* Profile Header Summary */}
                <div className="flex flex-col md:flex-row items-center gap-6 pb-8 mb-8 border-b border-gray-50">
                  <div className="w-16 h-16 rounded-full bg-site-bg flex items-center justify-center border border-gray-100 shadow-sm relative group overflow-hidden">
                     <span className="text-xl font-black text-[#375421] uppercase">{userName?.charAt(0) || "U"}</span>
                     <div className="absolute inset-0 bg-[#375421]/0 group-hover:bg-[#375421]/5 transition-colors cursor-pointer"></div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[#375421] uppercase tracking-[0.2em] mb-0.5">Authenticated Account</span>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{userName} {lastUserName}</h2>
                     </div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{userEmail} • Verified Member</p>
                  </div>
                  <div className="flex gap-3">
                     {!isEditing ? (
                       <button
                         onClick={handleEditClick}
                         className="px-5 py-2.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#375421] transition-all"
                       >
                         Edit Profile
                       </button>
                     ) : (
                       <button
                         onClick={handleCancelClick}
                         className="px-5 py-2.5 bg-site-bg text-red-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-red-50 transition-all border border-red-100"
                       >
                         Discard
                       </button>
                     )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[9px] font-black text-[#375421] uppercase tracking-[0.3em] mb-6">Personal Information</h3>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleProfileSubmit}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block">First Name</label>
                      <input
                        type="text"
                        placeholder="Botanist Name"
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all placeholder:text-gray-300 focus:outline-none ${isEditing ? 'border-gray-200 bg-white ring-2 ring-gray-50' : 'cursor-not-allowed opacity-80'}`}
                        disabled={!isEditing}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block">Last Name</label>
                      <input
                        type="text"
                        placeholder="Family Name"
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all placeholder:text-gray-300 focus:outline-none ${isEditing ? 'border-gray-200 bg-white ring-2 ring-gray-50' : 'cursor-not-allowed opacity-80'}`}
                        disabled={!isEditing}
                        value={lastUserName}
                        onChange={(e) => setLastUserName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Gender & Date of Birth Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Gender Selection</label>
                      <div className="flex space-x-5">
                        {["Male", "Female", "Other"].map((gen) => (
                          <label key={gen} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center mr-2.5">
                              <input
                                type="radio"
                                name="gender"
                                value={gen}
                                checked={gender === gen}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-4 h-4 appearance-none border-2 border-gray-200 rounded-full checked:border-[#375421] transition-all"
                                disabled={!isEditing}
                                required
                              />
                              {gender === gen && <div className="absolute w-2 h-2 bg-[#375421] rounded-full scale-100 animate-in zoom-in-50 duration-300"></div>}
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${gender === gen ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{gen}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block">Date of Birth</label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all focus:outline-none ${isEditing ? 'border-gray-200 bg-white ring-2 ring-gray-50' : 'cursor-not-allowed opacity-80'}`}
                        max={new Date().toISOString().split("T")[0]}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block">Email Protocol</label>
                      <input
                        type="email"
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all focus:outline-none ${isEditing ? 'border-gray-200 bg-white ring-2 ring-gray-0' : 'cursor-not-allowed opacity-80'}`}
                        disabled={!isEditing}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Mobile Access</label>
                      <input
                        type="tel"
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all focus:outline-none opacity-80 cursor-not-allowed`}
                        disabled={true}
                        value={userMobile}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block">GST Registration</label>
                      <input
                        type="text"
                        placeholder="GST Identification (Optional)"
                        className={`w-full bg-gray-50/50 border border-transparent px-4 py-3 rounded-xl text-[13px] font-bold text-gray-900 transition-all focus:outline-none ${isEditing ? 'border-gray-200 bg-white ring-2 ring-gray-0' : 'cursor-not-allowed opacity-80'}`}
                        disabled={!isEditing}
                        value={gst}
                        onChange={handleGstChange}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="mt-10">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gray-900 text-white px-10 py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#375421] transition-all shadow-lg shadow-gray-200"
                      >
                        Save Profile
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </main>
          )}
          <AddressSection />
          {/* <FAQSection /> */}
        </div>
      )}
    </>
  );
};

export default ProfileForm;