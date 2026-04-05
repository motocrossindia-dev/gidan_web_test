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

    if (isCheckoutPage) {
        return (
            <div className="md:hidden fixed bottom-2 left-0 right-0 z-[2147483647] px-4 pb-4 select-none touch-none pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <Link
                        href="/cart"
                        className="flex items-center justify-center gap-3 w-full bg-white text-[#173113] py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#173113]/10 active:scale-[0.98] transition-all duration-300 font-bold text-sm md:text-base relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[#173113]/5 opacity-0 group-active:opacity-100 transition-opacity"></div>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-4 h-4 md:w-5 md:h-5"
                        >
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        <span>Change Items / Back to Cart</span>
                    </Link>
                </div>
            </div>
        );
    }

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
