'use client';

import Link from "next/link";
import React from 'react';
import { IoReorderThree } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { FaMapMarker } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdCardMembership } from "react-icons/md";
import { CiWallet } from "react-icons/ci";
import { RiCoupon2Fill } from "react-icons/ri";
import { TbGiftCard } from "react-icons/tb";
import { GoCrossReference } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

function T1() {
  return (
    <div className='bg-gray-100 '>
      <div className="w-[270px] h-[743px] font-sans">
        {/* Header Section */}
        <div className="h-[74px] px-4 bg-white flex items-center space-x-2 border-b">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">M</span>
          </div>
          <div>
            <div className="text-sm text-gray-400">Hello,</div>
            <div className="text-lg font-bold">Mallikjan Baroodwale</div>
          </div>
        </div>

        {/* Content Section */}
        <div className='bg-white mt-8 '>
          <div className="overflow-y-auto h-[580px] pt-4">
            <div className='space-x-2'>         
            <MenuItem icon={<IoReorderThree style={{ color: '#A3CD39' }} />} text="MY ORDERS" /* to="/orders" */ />
            <MenuSection title="ACCOUNT SETTINGS">
              <MenuItem icon={<IoMdPerson style={{ color: '#A3CD39' }} />} text="My Profile" to="/profile" />
              <MenuItem icon={<FaMapMarker style={{ color: '#A3CD39' }} />} text="Track Order" />
              <MenuItem icon={<IoIosNotifications style={{ color: '#A3CD39' }} />} text="Notification" to="/profile/notification" />
            </MenuSection>
            <MenuItem icon={<MdCardMembership style={{ color: '#A3CD39' }} />} text="Membership" />
            <MenuSection title="">
              <MenuItem icon={<CiWallet style={{ color: '#A3CD39' }} />} text="Wallet" to="/profile/wallet" badge="₹0" />
            </MenuSection>
            <MenuSection title="MY STUFF">
              <MenuItem icon={<RiCoupon2Fill style={{ color: '#A3CD39' }} />} text="My Coupons" />
              <MenuItem icon={<TbGiftCard style={{ color: '#A3CD39' }} />} text="Gift Cards" />
              <MenuItem icon={<GoCrossReference style={{ color: '#A3CD39' }} />} text="My Referrals" to="/profile/referal"/>
            </MenuSection>
            <MenuItem icon={<IoLogOutOutline style={{ color: '#A3CD39' }} />} text="Logout" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const MenuSection = ({ title, children }) => (
  <div>
    <div className="text-gray-500 text-md font-semibold uppercase px-2 py-2">{title}</div>
    {children}
  </div>
);

const MenuItem = ({ icon, text, badge, to }) => (
  <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-200 cursor-pointer">
    <Link to={to || "#"} className="flex items-center space-x-2 w-full">
      {icon && <span className="text-xl">{icon}</span>} {/* Removed the previous color styling here */}
      <span className="text-md font-semibold">{text}</span>
    </Link>
    {badge && <div className="text-green-500 text-sm">{badge}</div>}
  </div>
);

export default T1;
