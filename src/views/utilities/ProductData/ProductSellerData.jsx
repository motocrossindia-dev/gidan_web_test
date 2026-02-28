'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axiosInstance from "../../../Axios/axiosInstance";
import { getProductUrl } from "../../../utils/urlHelper";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Verify from "../../../Services/Services/Verify";
import Link from "next/link";
import axios from "axios";
import { trackAddToCart, trackRemoveFromCart, trackAddToWishlist } from "../../../utils/ga4Ecommerce";

const ProductSellerCard = ({
  name,
  price,
  oldPrice,
  imageUrl,
  product,
  inCart,
  getProducts
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isAdded, setIsAdded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const fetchWishlistStatus = async () => {
    try {
      if (!product || !accessToken) {
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/?main_product_id_list=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const wishlistIds = response.data.main_product_ids || [];
      const productId = product.id || product;
      setInWishlist(wishlistIds.includes(productId));
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistStatus();
    }
  }, [product, isAuthenticated, accessToken]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      const productId = product.id || product;
      if (inWishlist) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/?main_product_id=${productId}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Product Removed from wishlist", { variant: "success" });
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`,
          { main_prod_id: productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Added to wishlist", { variant: "success" });

          // GA4: Track add_to_wishlist event
          trackAddToWishlist(typeof product === 'object' ? product : { id: product, name });
        }
      }
      if (getProducts) getProducts();
      fetchWishlistStatus();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      const productId = product.id || product;
      if (inCart) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/order/cart/?main_product_id=${productId}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Product Removed from cart", { variant: "success" });
          setIsAdded(!isAdded);
          window.dispatchEvent(new Event("cartUpdated"));

          // GA4: Track remove_from_cart event
          trackRemoveFromCart(typeof product === 'object' ? product : { id: product, name, selling_price: price });
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/order/cart/`,
          { main_prod_id: productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Added to cart", { variant: "success" });
          setIsAdded(!isAdded);
          window.dispatchEvent(new Event("cartUpdated"));

          // GA4: Track add_to_cart event
          trackAddToCart(typeof product === 'object' ? product : { id: product, name, selling_price: price });
        }
      }
      if (getProducts) getProducts();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const prodUrl = getProductUrl(product);

  return (
    <>
      <Verify />
      <Paper
        elevation={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: { xs: "80%", sm: "14rem", lg: "16rem" },
          height: { xs: "20rem", sm: "24rem", md: "30rem", lg: "25rem" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "center",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
          borderRadius: "1rem",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-8px)",
            backgroundColor: "#CFFFBE",
            border: "1px solid #e5e7eb",
          },
        }}
      >
        <Link href={prodUrl} className="w-full flex flex-col items-center">
          <div
            className="relative w-full flex justify-center mb-2"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <div className="relative rounded-lg flex justify-center items-center w-full">
              <img name=" "
                className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] object-cover mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] 
                  ${isImageHovered ? "scale-105" : "scale-100"}
                `}
                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                loading="lazy"
                alt={name}
              />

              <div
                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out
                  ${isImageHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}
              >
                <button
                  onClick={handleAddToCart}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer
                    ${isAdded || inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"}`}
                >
                  <MdOutlineShoppingBag className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`w-8 h-8 rounded-full ${inWishlist
                    ? "bg-bio-green text-white"
                    : "bg-white hover:bg-bio-green hover:text-white"
                    } flex items-center justify-center transition-colors duration-200 cursor-pointer`}
                >
                  {inWishlist ? (
                    <FaHeart className="w-4 h-4" />
                  ) : (
                    <FaRegHeart className="w-4 h-4" />
                  )}
                </button>

                <div
                  className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-5">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="w-4 h-4 text-navy-blue" />
              ))}
            </div>

            <h3 className="text-sm font-medium mb-2">{name}</h3>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-navy-blue">₹{Math.round(price)}.00</span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">₹{Math.round(oldPrice)}.00</span>
              )}
            </div>
          </div>
        </Link>
      </Paper>
    </>
  );
};

export default ProductSellerCard;