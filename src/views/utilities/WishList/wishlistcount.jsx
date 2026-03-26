'use client';

import React, { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axiosInstance from "../../../Axios/axiosInstance";
import { selectAccessToken } from "../../../redux/User/verificationSlice";

const WishlistIconWithCount = () => {
    const accessToken = useSelector(selectAccessToken);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const fetchWishlistCount = async () => {
             // If not logged in, count pending items in localStorage
            if (!accessToken) {
                const pending = localStorage.getItem("pendingWishlistAction");
                setWishlistCount(pending ? 1 : 0);
                return;
            }

            try {
                // ADDED: Cache-busting timestamp to prevent stale browser/server responses
                const response = await axiosInstance.get(`/order/wishlist/?t=${new Date().getTime()}`);
                const wishlistItems = response?.data?.data?.wishlists || [];
                setWishlistCount(Array.isArray(wishlistItems) ? wishlistItems.length : 0);
            } catch (error) {
                console.error('Failed to fetch wishlist count', error);
            }
        };

        fetchWishlistCount();

        const handleWishlistUpdate = () => {
            fetchWishlistCount();
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        window.addEventListener('storage', handleWishlistUpdate);
        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
            window.removeEventListener('storage', handleWishlistUpdate);
        };
    }, [accessToken]);

    return (
        <div className="relative">
            <FiHeart className="w-6 h-6 text-black" />
            {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.2 py-0.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </div>
    );
};

export default WishlistIconWithCount;
