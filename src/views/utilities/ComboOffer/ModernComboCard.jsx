'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Paper } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { ShoppingCart } from "lucide-react";

const ModernComboCard = ({ offer }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/cart/`, 
        { main_prod_id: offer.id, quantity: 1 }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.dispatchEvent(new Event("cartUpdated"));
      if ([200, 201].includes(response.status)) {
        enqueueSnackbar("Added to cart", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to add to cart. Please try again.", { variant: "error" });
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`, 
        { main_prod_id: offer.id, quantity: 1 }, 
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      window.dispatchEvent(new Event("wishlistUpdated"));
      if ([200, 201].includes(response.status)) {
        enqueueSnackbar("Added to wishlist", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Failed to add to wishlist. Please try again.", { variant: "error" });
    }
  };

  const handleQuickView = () => {
    router.push(`/combo/${offer.id}`);
  };

  return (
    <>
      {/* Desktop / Tablet */}
      <div className="hidden sm:block transition-transform duration-300 hover:-translate-y-2">
        <Paper
          elevation={0}
          sx={{
            width: { xs: "80%", sm: "14rem", lg: "16rem" },
            height: "auto",
            minHeight: "22rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "1rem",
            border: "1px solid transparent",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#CFFFBE",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          {/* Ribbon */}
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
              {offer?.is_shop_the_look ? "SHOP THE LOOK" : "COMBO"}
            </div>
          </div>

          {/* Product Image */}
          <div
            className="relative w-full flex justify-center mb-2"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <img
              className={`w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[240px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
              src={`${process.env.NEXT_PUBLIC_API_URL}${offer?.image}`}
              alt={offer?.title}
              loading="lazy" 
              width="400" 
              height="400" 
              style={{ aspectRatio: '1/1' }}
            />

            {/* Hover Actions */}
            <div
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${isImageHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
            >
              <button 
                aria-label="Add to cart"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-green-600 hover:text-white transition-colors"
              >
                <MdOutlineShoppingBag className="w-4 h-4" />
              </button>

              <button 
                aria-label="Add to wishlist"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-green-600 hover:text-white transition-colors"
              >
                <FaRegHeart className="w-4 h-4" />
              </button>

              <button 
                aria-label="Quick view"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickView();
                }}
                className="w-8 h-8 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <FiEye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="w-full flex flex-col items-center mt-3 px-3 pb-3">
            <h2
              className="text-base sm:text-lg font-bold text-black mb-3 truncate max-w-full"
              title={offer?.title}
            >
              {offer?.title}
            </h2>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#15803D]">
                  ₹{Math.round(offer?.final_price)}
                </span>
                {offer?.total_price && (offer?.total_price > offer?.final_price) && (
                  <span className="text-sm text-gray-400 line-through mt-0.5">
                    ₹{Math.round(offer?.total_price)}
                  </span>
                )}
              </div>

              {offer?.total_price && offer?.final_price && (offer?.total_price > offer?.final_price) && (
                <div className="bg-green-100 text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border border-green-200">
                  SAVE ₹{Math.round(offer?.total_price - offer?.final_price)} ({Math.round(((offer?.total_price - offer?.final_price) / offer?.total_price) * 100)}% OFF)
                </div>
              )}
            </div>
            
            {/* Buy It Now Button - Shows on Hover */}
            <button
              className="w-full bg-[#15803D] text-white py-2 px-4 rounded-xl hover:bg-[#15803D]/90 transition-all duration-300 flex items-center justify-center mt-3 font-bold shadow-md opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ShoppingCart className="inline-block mr-2 w-4 h-4" />
              Buy It Now
            </button>
          </div>
        </Paper>
      </div>

      {/* Mobile */}
      <div className="sm:hidden transition-transform duration-300 hover:-translate-y-1.5">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "white",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#CFFFBE",
            },
          }}
        >
          {/* Ribbon */}
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded shadow-md">
              {offer?.is_shop_the_look ? "SHOP THE LOOK" : "COMBO"}
            </div>
          </div>

          <div className="relative w-full flex flex-col items-center p-3">
            {/* Image Section */}
            <div className="relative w-full flex justify-center mb-3">
              <img
                className="w-32 h-32 object-contain rounded-md transition-transform duration-300 relative z-10"
                src={`${process.env.NEXT_PUBLIC_API_URL}${offer?.image}`}
                alt={offer?.title}
                loading="lazy" 
                width="400" 
                height="400" 
                style={{ aspectRatio: '1/1' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-2">
              <button 
                aria-label="Add to cart"
                onClick={handleAddToCart}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <MdOutlineShoppingBag className="w-4 h-4" />
              </button>

              <button 
                aria-label="Add to wishlist"
                onClick={handleAddToWishlist}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaRegHeart className="w-4 h-4" />
              </button>

              <button 
                aria-label="Quick view"
                onClick={handleQuickView}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FiEye className="w-4 h-4" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col items-center text-center">
              {/* Product Name */}
              <h2 className="mt-1 font-bold text-black text-[0.9rem] leading-tight">
                {offer?.title}
              </h2>

              <div className="flex flex-col items-center gap-0.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-[#15803D]">
                    ₹{Math.round(offer?.final_price)}
                  </span>
                  {offer?.total_price && (offer?.total_price > offer?.final_price) && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{Math.round(offer?.total_price)}
                    </span>
                  )}
                </div>
                {offer?.total_price && offer?.final_price && (offer?.total_price > offer?.final_price) && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                    {Math.round(((offer?.total_price - offer?.final_price) / offer?.total_price) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default ModernComboCard;