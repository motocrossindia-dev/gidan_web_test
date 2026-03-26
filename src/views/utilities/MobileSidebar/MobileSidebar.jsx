'use client';


import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  MdPerson,
  MdLocationOn,
  MdLocalShipping,
  MdPeople,
  MdCardGiftcard,
  MdAccountBalanceWallet,
  MdShoppingBag,
  MdEdit,
  MdChevronRight,
  MdMonetizationOn
} from "react-icons/md";

const MobileSidebar = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData?.first_name) {
          setName(parsedData.first_name);
        }
      } catch (e) {
        console.error("Error parsing userData from localStorage", e);
      }
    }
  }, []);

  const options = [
    { label: "My Orders", icon: <MdShoppingBag />, link: "/profile/orders" },
    { label: "Edit Profile", icon: <MdPerson />, link: "/profile", section: "editprofile" },
    { label: "Add New Address", icon: <MdLocationOn />, link: "/profile", section: "address" },
    { label: "Track Order", icon: <MdLocalShipping />, link: "/profile/trackorder" },
    { label: "Refer A Friend", icon: <MdPeople />, link: "/profile/referal" },
    { label: "Add Gift Card", icon: <MdCardGiftcard />, link: "/profile/giftcard" },
    { label: "GD Coins", icon: <MdMonetizationOn />, link: "/profile/btcoins" },
    { label: "Wallet", icon: <MdAccountBalanceWallet />, link: "/profile/wallet" },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <>

      <div className="max-w-md mx-auto p-2 bg-site-bg rounded-lg shadow-lg mt-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-bio-green/10 flex items-center justify-center border border-bio-green/20">
              <MdPerson className="text-bio-green text-2xl" />
            </div>
            <div>
              <p className="text-gray-500">Hello,</p>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-indigo-500"
                  onBlur={handleSaveClick} // Save when clicking outside
                  autoFocus
                />
              ) : (
                <h2 className="text-lg font-semibold">{name}</h2>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {options.map((option, index) => {
            const cls = "w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:bg-site-bg transition";
            const inner = (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-bio-green text-2xl">{option.icon}</span>
                  <p className="text-gray-800 font-medium">{option.label}</p>
                </div>
                <MdChevronRight className="text-gray-400 text-xl" />
              </>
            );
            return onNavigate && option.section ? (
              <button key={index} className={cls} onClick={() => onNavigate(option.section)}>
                {inner}
              </button>
            ) : (
              <Link key={index} href={option.link || "#"} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
