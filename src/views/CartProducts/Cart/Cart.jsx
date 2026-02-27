'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ProductCard from "../CartComponent/ProductCard";
import CartSummary from "../CartComponent/Cartsummary";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { Helmet } from "react-helmet-async";
import { trackViewCart, trackRemoveFromCart } from "../../../utils/ga4Ecommerce";

const Cart = () => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/order/cart/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data?.message === "success") {
          const cartItems = response.data.data.cart;
          setProducts(cartItems);

          // GA4: Track view_cart event
          trackViewCart(cartItems);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err.message);
      }
    };

    fetchCartItems();
  }, [accessToken]);

  // Handle updating product quantity in cart
  const handleUpdateQuantity = async (cartId, newQuantity) => {
    try {
      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/cart/`,
        { cart_id: cartId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.message === "success") {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === cartId ? { ...product, quantity: newQuantity } : product
          )
        );
      }
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      enqueueSnackbar("Failed to update product quantity!", { variant: "error" });
    }
  };

  // Handle removing products from cart
  const handleRemove = async (id) => {
    try {
      const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_API_URL}/order/cart/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        enqueueSnackbar("Product removed from cart!", { variant: "success" });

        // GA4: Track remove_from_cart event
        const removedProduct = products.find((p) => p.id === id);
        if (removedProduct) trackRemoveFromCart(removedProduct, removedProduct.quantity || 1);
      }
      setProducts((prev) => prev.filter((product) => product.id !== id));
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      enqueueSnackbar("Failed to remove product from cart!", { variant: "error" });
    }
  };

  // Calculate total items and amount
  const totalItems = products.reduce((acc, product) => acc + product.quantity, 0);
  const totalAmount = products.reduce((acc, product) => acc + product.mrp * product.quantity, 0);

  const discount = products.reduce((acc, product) => acc + product.discount, 0);
  // const packagingFee = 198;

  return (
    <>
      <Helmet>
        <title>Gidan - Cart</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Review the items in your Gidan cart before checkout. Manage your selected plants, pots, seeds, and gardening products for a smooth shopping experience."
        />

        <link
          rel="canonical"
          href="https://www.gidan.store/Cart"
        />
      </Helmet>

      {/* <Verify /> */}
      <div className="flex flex-col md:flex-row justify-center md:p-8 bg-gray-50 overflow-y-auto">
        <style>
          {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
        `}
        </style>

        {products.length > 0 ? (
          <>
            <div className="w-full md:w-2/3 lg:w-1/2 space-y-4 bg-white p-0">
              <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: "600px" }}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleRemove={handleRemove}
                    handleQuantityChange={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/5 mt-4 md:mt-0 md:ml-10">
              <CartSummary
                totalItems={totalItems}
                totalAmount={Math.round(totalAmount)}
                discount={discount}
                // packagingFee={packagingFee}
                products={products}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <button
              className="bg-lime-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
