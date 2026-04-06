'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeOutline, IoHomeSharp, IoHeartOutline, IoHeartSharp, IoSearchOutline, IoSearchSharp } from 'react-icons/io5';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { MdOutlineShoppingBag, MdShoppingBag } from 'react-icons/md';
import CartIconWithCount from '../Cart/cartcount';
import WishlistIconWithCount from '../../views/utilities/WishList/wishlistcount';
const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Home',
            icon: <IoHomeOutline className="text-2xl" />,
            activeIcon: <IoHomeSharp className="text-2xl" />,
            href: '/',
        },
        {
            label: 'Wishlist',
            icon: <WishlistIconWithCount showLabel={false} className="scale-110" />,
            activeIcon: <WishlistIconWithCount showLabel={false} className="scale-110" />,
            href: '/wishlist',
        },
        {
            label: 'Cart',
            icon: <CartIconWithCount showLabel={false} className="scale-110" />,
            activeIcon: <CartIconWithCount showLabel={false} className="scale-110" />,
            href: '/cart',
        },

        {
            label: 'Profile',
            icon: <FaRegUser className="text-xl" />,
            activeIcon: <FaUser className="text-xl" />,
            href: '/profile',
        },
    ];

    const isCheckoutPage = pathname === '/checkout' || pathname === '/checkout/';
    if (isCheckoutPage) return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-[0_-2px_15px_rgba(0,0,0,0.08)] z-[2147483647]" style={{ isolation: 'isolate', transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }}>
            <div className="flex items-center justify-between max-w-md mx-auto pb-[env(safe-area-inset-bottom)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-200 ${
                                isActive ? 'text-[#375421]' : 'text-gray-500'
                            }`}
                        >
                            <div className="relative">
                                {isActive ? item.activeIcon : item.icon}
                            </div>
                            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#375421]' : 'text-gray-500'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
