'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoReorderThree, IoLocationOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlinePerson } from "react-icons/md";
import { CiBitcoin, CiWallet } from "react-icons/ci";
import { TbGiftCard } from "react-icons/tb";
import { GoCrossReference } from "react-icons/go";
import LogoutGif from "../../../Assets/logout.gif"; // Replace with actual path
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSelector } from "react-redux";

const SideBar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const userName = useSelector((state) => state.user.username); // Retrieve user name from Redux

  const handleLogoutClick = () => setIsLogoutDialogOpen(true);
  const handleCancelLogout = () => setIsLogoutDialogOpen(false);

  const handleLogOutConfirm = () => {
    setIsLogoutDialogOpen(false);
    router.push("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [accessToken]);

  return (
    <div className="bg-gray-100 hidden md:block shadow-lg"> {/* Sidebar container */}
      <div className="w-[270px] h-screen font-sans flex flex-col">
        
        {/* Header Section */}
        <div className="h-[80px] px-4 bg-white flex items-center space-x-3 border-b shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">{userName?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-sm text-gray-500">Hello,</div>
            <div className="text-md font-bold text-gray-900">{userName}</div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="bg-white mt-6 flex-grow overflow-y-auto">
          <div className="h-[580px] pt-4 px-2">
           <Link
  to="/orders"
  className="flex items-center justify-between bg-white p-4 rounded shadow-sm hover:bg-gray-50 transition"
>
  {/* Left: Icon and Text */}
  <div className="flex items-center gap-3">
    <IoReorderThree className="text-green-500 text-xl" />
    <span className="text-gray-700 font-medium">MY ORDERS</span>
  </div>

  {/* Right: Arrow Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</Link>


            <MenuSection title="ACCOUNT SETTINGS">
              <MenuItem icon={<MdOutlinePerson className="text-green-500" />} text="My Profile" to="/profile" />
              <MenuItem icon={<IoLocationOutline className="text-green-500" />} text="Track Order" to="/profile/trackorder" />
              {/* <MenuItem icon={<MdOutlineNotificationsActive className="text-green-500" />} text="Notifications" to="/profile/notification" /> */}
            </MenuSection>

            <MenuSection title="PAYMENTS">
              <MenuItem icon={<CiWallet className="text-green-500" />} text="Wallet" to="/profile/wallet" />
              <MenuItem icon={<CiBitcoin className="text-green-500" />} text="GD Coins" to="/profile/btcoins" />
            </MenuSection>

            <MenuSection title="MY STUFF">
              <MenuItem icon={<TbGiftCard className="text-green-500" />} text="Add A Gift Card" to="/profile/giftcard" />
              <MenuItem icon={<GoCrossReference className="text-green-500" />} text="My Referrals" to="/profile/referal" />
            </MenuSection>

            {/* Logout Button */}
            <MenuItem icon={<IoLogOutOutline className="text-red-500" />} text="Logout" onClick={handleLogoutClick} />

            {/* Logout Confirmation Modal */}
            {isLogoutDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logout</h3>
                  <img name=" "    src={LogoutGif} loading="lazy" alt="Logout" className="mx-auto w-40 mb-4" />
                  <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                  <div className="flex justify-around">
                    <button
                      className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400 transition"
                      onClick={handleCancelLogout}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition"
                      onClick={handleLogOutConfirm}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Section Header Component */
const MenuSection = ({ title, children }) => (
  <div className="mt-4">
    <div className="text-gray-600 text-sm font-semibold uppercase px-2 py-2 border-b">{title}</div>
    {children}
  </div>
);

/* Sidebar Menu Item Component */
const MenuItem = ({ icon, text, to, onClick }) => (
  <div
    className="flex items-center justify-between px-4 py-3 rounded-md hover:bg-gray-100 transition cursor-pointer"
    onClick={onClick}
  >
    <Link to={to || "#"} className="flex items-center space-x-3 w-full">
      {icon && <span className="text-xl">{icon}</span>}
      <span className="text-md font-medium text-gray-700">{text}</span>
    </Link>
  </div>
);

export default SideBar;
