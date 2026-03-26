'use client';

// App.js
import React from 'react';

function SideParrot() {
  return (
    <div className="w-[290px] h-[743px] bg-white-100 font-sans">
      <div className="h-[74px] px-4 bg-white flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-2xl font-semibold text-white">M</span>
        </div>
        <div>
          <div className="text-sm text-gray-400">Hello,</div>
          <div className="text-lg font-bold">Mallikjan Baroodwale</div>
        </div>
      </div>

      <div className='bg-white-500'>
      <div className="overflow-y-auto h-[641px] pt-4">
        <MenuItem icon="🏠" text="MY ORDERS" />
        <MenuSection title="ACCOUNT SETTINGS">
          <MenuItem text="My Profile" />
          <MenuItem text="Track Order" />
          <MenuItem text="Notifications" />
        </MenuSection>
        <MenuItem icon="💳" text="Membership" />
        <MenuSection title="PAYMENTS">
          <MenuItem text="Wallet" badge="₹0" />
          <MenuItem text="BT Coins" badge="₹0" />
        </MenuSection>
        <MenuSection title="MY STUFF">
          <MenuItem text="My Coupons" />
          <MenuItem text="Gift Cards" />
          <MenuItem text="My Referrals" />
        </MenuSection>
        <MenuItem icon="⚡" text="Logout" />
      </div>
      </div>
    </div>
  );
}

const MenuSection = ({ title, children }) => (
  <div>
    <div className="text-gray-400 text-xs uppercase px-4 py-2">{title}</div>
    {children}
  </div>
);

const MenuItem = ({ icon, text, badge }) => (
  <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-[#375421] text-xl">{icon}</span>}
      <span className="text-sm">{text}</span>
    </div>
    {badge && <div className="text-[#375421] text-sm">{badge}</div>}
  </div>
);

export default SideParrot;
