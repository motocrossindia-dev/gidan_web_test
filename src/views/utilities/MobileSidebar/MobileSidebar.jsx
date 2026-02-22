'use client';


import Link from "next/link";
import React, { useState } from "react";
import {
  MdPerson,
  MdLocationOn,
  MdLocalShipping,
  MdPeople,
  MdCardGiftcard,
  MdAccountBalanceWallet,
  MdShoppingBag,
  MdEdit,
  MdChevronRight
} from "react-icons/md";

const MobileSidebar = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [new_user_mobile] = useState(() =>
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData')) : null
  );
  const [name, setName] = useState(() => new_user_mobile?.first_name || '');

  const options = [
    { label: "Edit Profile", icon: <MdPerson />, link: "/mobilesidebar/editprofile" },
    { label: "Add New Address", icon: <MdLocationOn />, link: "/mobilesidebar/address" },
    { label: "Track Order", icon: <MdLocalShipping />, link: "/mobilesidebar/trackmobile" },
    { label: "Refer A Friend", icon: <MdPeople />, link: "/mobilesidebar/referalmobile" },
    { label: "Add Gift Card", icon: <MdCardGiftcard />, link: "/mobilesidebar/giftcardmobile" },
    { label: "Wallet", icon: <MdAccountBalanceWallet />, link: "/mobilesidebar/walletmobile" },
    { label: "My Orders", icon: <MdShoppingBag />, link: "/orders" },
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <>

      <div className="max-w-md mx-auto p-2 bg-gray-100 rounded-lg shadow-lg mt-4">
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
          <button
            className="p-2 text-gray-400 hover:text-bio-green transition-colors"
            onClick={handleEditClick}
            aria-label="Edit Name"
          >
            <MdEdit size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {options.map((option, index) => (
            <Link
              href={option.link || "#"}
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-bio-green text-2xl">{option.icon}</span>
                <p className="text-gray-800 font-medium">{option.label}</p>
              </div>
              <MdChevronRight className="text-gray-400 text-xl" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
