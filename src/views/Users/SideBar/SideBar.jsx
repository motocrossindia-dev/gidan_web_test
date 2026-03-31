'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoReorderThree, IoLocationOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlinePerson } from "react-icons/md";
import { CiBitcoin, CiWallet } from "react-icons/ci";
import { TbGiftCard } from "react-icons/tb";
import { GoCrossReference } from "react-icons/go";
import LogoutGif from "../../../Assets/logout_anim.webp"; // Optimized WebP Animation
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { useSelector } from "react-redux";

const SideBar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const userName = useSelector((state) => state.user.username); // Retrieve user name from Redux

  useEffect(() => {
    setHasMounted(true);
    window.scrollTo(0, 0);
  }, [accessToken]);

  const handleLogoutClick = () => setIsLogoutDialogOpen(true);
  const handleCancelLogout = () => setIsLogoutDialogOpen(false);

  const handleLogOutConfirm = () => {
    setIsLogoutDialogOpen(false);
    router.push("/");
  };

  return (
    <div className="hidden md:block transition-all duration-300">
      <div className="w-[290px] font-sans flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] overflow-hidden">

        {/* Header Section */}
        <div className="px-6 py-8 bg-gray-50/50 flex flex-col items-center text-center border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-[#375421] flex items-center justify-center mb-4 shadow-lg shadow-green-100 border-4 border-white">
            <span className="text-3xl font-black text-white leading-none">
              {hasMounted ? userName?.charAt(0).toUpperCase() : ""}
            </span>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">Welcome back,</p>
            <h2 className="text-xl font-black text-gray-900 leading-tight">
              {hasMounted ? userName : "Member"}
            </h2>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="bg-white pb-8 overflow-y-auto">
          <MenuSection title="MY ACCOUNT">
            <MenuItem 
              icon={<IoReorderThree className="text-[#375421]" />} 
              text="My Orders" 
              to="/profile/orders" 
            />
            <MenuItem 
              icon={<MdOutlinePerson className="text-[#375421]" />} 
              text="My Profile" 
              to="/profile" 
            />
          </MenuSection>

          <MenuSection title="TRACKING">
            <MenuItem 
              icon={<IoLocationOutline className="text-[#375421]" />} 
              text="Track Order" 
              to="/profile/trackorder" 
            />
          </MenuSection>

          <MenuSection title="WALLET">
            <MenuItem 
              icon={<CiWallet className="text-[#375421] text-2xl" />} 
              text="Gidan Wallet" 
              to="/profile/wallet" 
            />
            <MenuItem 
              icon={<CiBitcoin className="text-[#375421] text-2xl" />} 
              text="GD Coins" 
              to="/profile/btcoins" 
            />
          </MenuSection>

          <MenuSection title="LOYALTY">
            <MenuItem icon={<TbGiftCard className="text-[#375421]" />} text="Gift Cards" to="/profile/giftcard" />
            <MenuItem icon={<GoCrossReference className="text-[#375421]" />} text="My Referrals" to="/profile/referal" />
          </MenuSection>

          <div className="mt-6 pt-4 border-t border-dashed border-gray-100">
            <MenuItem icon={<IoLogOutOutline className="text-red-500" />} text="Logout" onClick={handleLogoutClick} />
          </div>

            {/* Logout Confirmation Modal */}
            {isLogoutDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logout</h3>
                  <img name=" " src={LogoutGif} loading="lazy" alt="Logout" className="mx-auto w-40 mb-4" />
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
  );
};

/* Section Header Component */
const MenuSection = ({ title, children }) => (
  <div className="px-3">
    <div className="text-[9px] text-[#375421] font-black uppercase tracking-[0.2em] px-4 pt-6 pb-2">{title}</div>
    <div className="space-y-0.5">
      {children}
    </div>
  </div>
);

/* Sidebar Menu Item Component */
const MenuItem = ({ icon, text, to, onClick }) => (
  <div
    className="group"
    onClick={onClick}
  >
    <Link href={to || "#"} className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98]">
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>}
        <span className="text-[12px] font-extrabold text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{text}</span>
      </div>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 text-gray-300 group-hover:text-[#375421] transition-all transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
    </Link>
  </div>
);

export default SideBar;
