'use client';

import React, { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from "../../Axios/axiosInstance";
import { selectAccessToken } from "../../redux/User/verificationSlice";
import { setCartItems } from "../../redux/Slice/cartSlice";

const CartIconWithCount = () => {
    const [cartCount, setCartCount] = useState(0);
    const accessToken = useSelector(selectAccessToken);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartData = async () => {
            // If not logged in, count pending items in localStorage
            if (!accessToken) {
                const pending = localStorage.getItem("pendingCartAction");
                setCartCount(pending ? 1 : 0);
                return;
            }

            try {
                // ADDED: Cache-busting timestamp to prevent stale browser/server responses
                const response = await axiosInstance.get(`/order/cart/?t=${new Date().getTime()}`);
                const cartData = response.data?.data;
                const cartItems = cartData?.cart || [];
                
                // Update Redux state for real-time sync across ProductCards
                if (Array.isArray(cartItems)) {
                    dispatch(setCartItems(cartItems));
                }

                const totalQuantity = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : 0;
                setCartCount(totalQuantity);
            } catch (error) {
                console.error('Failed to fetch cart data', error);
            }
        };

        fetchCartData();

        const handleCartUpdate = () => {
            fetchCartData();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, [accessToken]);

    return (
        <div className="relative">
            <FiShoppingCart className="w-6 h-6 text-black" />
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </div>
    );
};

export default CartIconWithCount;
