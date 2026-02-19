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
        if (!accessToken) {
            setWishlistCount(0);
            return;
        }

        const fetchWishlistCount = async () => {
            try {
                const response = await axiosInstance.get(`https://backend.gidan.store/order/wishlist/`);
                const wishlistItems = response?.data?.data?.wishlists || [];
                setWishlistCount(wishlistItems.length);
            } catch (error) {
                console.error('Failed to fetch wishlist count', error);
            }
        };

        fetchWishlistCount();

        const handleWishlistUpdate = () => {
            fetchWishlistCount();
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        return () => {
            window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
        };
    }, [accessToken]);

    return (
        <div className="relative">
            <FiHeart className="w-6 h-6 text-black" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
        {wishlistCount}
      </span>
        </div>
    );
};

export default WishlistIconWithCount;
