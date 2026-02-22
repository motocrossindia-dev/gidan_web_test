'use client';

import React, { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axiosInstance from "../../Axios/axiosInstance";
import { selectAccessToken } from "../../redux/User/verificationSlice";

const CartIconWithCount = () => {
    const [cartCount, setCartCount] = useState(0);
    const accessToken = useSelector(selectAccessToken);

    useEffect(() => {
        // If not logged in, just reset count to 0 and skip fetch
        if (!accessToken) {
            setCartCount(0);
            return;
        }

        const fetchCartData = async () => {
            try {
                const response = await axiosInstance.get('https://backend.gidan.store/order/cart/');
                const cartItems = response.data?.data?.cart || [];
                const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
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
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [accessToken]);

    return (
        <div className="relative">
            <FiShoppingCart className="w-6 h-6 text-black" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
        {cartCount}
      </span>
        </div>
    );
};

export default CartIconWithCount;
