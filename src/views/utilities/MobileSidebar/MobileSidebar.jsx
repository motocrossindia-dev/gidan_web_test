
import React, { useState } from "react";
import { Link } from "react-router-dom";

const MobileSidebar = () => {
  const [isEditing, setIsEditing] = useState(false);
  const new_user_mobile = JSON.parse(localStorage.getItem("userData"))
  
  const [name, setName] = useState(new_user_mobile.first_name);

  const options = [
    { label: "EditProfile", icon: "👤", link: "/mobilesidebar/editprofile" },
    { label: "Add New Address", icon: "📍", link: "/mobilesidebar/address" },
    { label: "Track Order", icon: "🚚", link: "/mobilesidebar/trackmobile" },
    { label: "Refer A Friend", icon: "👥", link: "/mobilesidebar/referalmobile" },
    { label: "Add Gift Card", icon: "🎁", link: "/mobilesidebar/giftcardmobile" },
    { label: "Wallet", icon: "📂", link: "/mobilesidebar/walletmobile" },
    { label: "My Orders", icon: "📦", link: "/orders" },
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
          <img name=" "   
            src="https://via.placeholder.com/40"
            loading="lazy"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
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
          className="text-gray-400 hover:text-gray-600"
          onClick={handleEditClick}
        >
          ✏️
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {options.map((option, index) => (
          <Link
            to={option.link}
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">{option.icon}</span>
              <p className="text-gray-800">{option.label}</p>
            </div>
            <span className="text-gray-400">➡️</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
};

export default MobileSidebar;
