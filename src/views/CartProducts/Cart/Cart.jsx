'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "../CartComponent/ProductCard";
import CartSummary from "../CartComponent/Cartsummary";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../../Axios/axiosInstance";
import { useSearchParams } from "next/navigation";
import { trackViewCart, trackRemoveFromCart } from "../../../utils/ga4Ecommerce";
import { applyGstToProduct } from "../../../utils/serverApi";
import emptyCartImg from "../../../Assets/emptycart.webp";

const Cart = () => {
  const accessToken = useSelector(selectAccessToken);
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get(`/order/cart/`);

        if (response.data?.message === "success") {
          const cartItems = (response.data.data.cart || []).map(applyGstToProduct);
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
  const handleUpdateQuantity = async (cartId, newQuantity, rollback) => {
    try {
      const response = await axiosInstance.patch(
        `/order/cart/`,
        { cart_id: cartId, quantity: newQuantity }
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
      const msg = err.response?.data?.message || "";
      const availableStock = err.response?.data?.available_stock;
      if ((msg.toLowerCase().includes("not enough stock") || msg.toLowerCase().includes("stock")) && availableStock !== undefined) {
        enqueueSnackbar(`Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available in stock.`, { variant: "warning" });
      } else {
        enqueueSnackbar(msg || "Failed to update product quantity!", { variant: "error" });
      }
      // Rollback the local quantity to previous value
      if (rollback) rollback();
    }
  };

  // Handle removing products from cart
  const handleRemove = async (id) => {
    try {
      const response = await axiosInstance.delete(`/order/cart/${id}/`);

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
          <div className="flex flex-col items-center justify-center w-full py-16">
            <Image
              src={emptyCartImg}
              alt="Empty Cart"
              width={280}
              height={280}
              className="mb-6 object-contain"
              priority
            />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything yet.</p>
            <button
              className="bg-lime-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
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
