'use client';

import React, { useEffect, useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from "../../../Axios/axiosInstance";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { setWishlistItems } from "../../../redux/Slice/addtowishlistSlice";

const WishlistIconWithCount = () => {
    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const fetchWishlistCount = async () => {
             // If not logged in, count pending items in localStorage
            if (!accessToken) {
                const raw = localStorage.getItem("pendingWishlistAction");
                try {
                    const guestItems = raw ? JSON.parse(raw) : [];
                    const itemsArray = Array.isArray(guestItems) ? guestItems : (guestItems ? [guestItems] : []);
                    setWishlistCount(itemsArray.length);
                } catch (e) {
                    setWishlistCount(0);
                }
                return;
            }

            try {
                // ADDED: Cache-busting timestamp to prevent stale browser/server responses
                const response = await axiosInstance.get(`/order/wishlist/`, {
                    signal: controller.signal,
                    params: { t: new Date().getTime() },
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // Accept 500 locally to handle it
                    },
                });

                if (response.status === 500) {
                    return;
                }
                
                // Flexible parsing to handle different backend response structures
                const data = response?.data;
                let actualItems = [];
                
                if (Array.isArray(data)) {
                    actualItems = data;
                } else if (data?.data && Array.isArray(data.data)) {
                    actualItems = data.data;
                } else if (data?.data?.wishlists && Array.isArray(data.data.wishlists)) {
                    actualItems = data.data.wishlists;
                } else if (data?.wishlists && Array.isArray(data.wishlists)) {
                    actualItems = data.wishlists;
                }
                
                // Update Redux state for real-time sync across ProductCards
                dispatch(setWishlistItems(actualItems));

                setWishlistCount(actualItems.length);
            } catch (error) {
                if (error.name === 'AbortError' || error.name === 'CanceledError' || (error.code === 'ERR_CANCELED')) {
                    // Silently return on intentional aborts/cancellation
                    return;
                }
                if (error.response?.status === 500) {
                    // Silently handle backend 500 errors to prevent console noise
                    return;
                }
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
            controller.abort();
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
