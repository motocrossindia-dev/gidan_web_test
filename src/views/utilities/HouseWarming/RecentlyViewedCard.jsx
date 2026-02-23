'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaStar } from 'react-icons/fa';
import Verify from "../../../Services/Services/Verify";
import ReactStars from "react-rating-stars-component";
import { getProductUrl } from "../../../utils/urlHelper";


const RecentlyViewedCard = ({
  productId,
  name,
  price,
  oldPrice,
  imageUrl,
  product,

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
      if (!productId || !accessToken) {
        console.warn("Missing product ID or access token");
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
      setInWishlist(wishlistIds.includes(productId));
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistStatus();
    }
  }, [product?.id, isAuthenticated, accessToken]);

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();

    try {
      if (!isAuthenticated) {
        if (window.innerWidth <= 640) {
          router.push("/mobile-signin", { replace: true });
        } else {
          router.push("/?modal=signIn", { replace: true });
        }
        return;
      }


      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`,
        { main_prod_id: productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchWishlistStatus();
    } catch (error) {
      console.error("There was an error adding the item to the wishlist:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdded(!isAdded);

    if (!isAuthenticated) {
      if (window.innerWidth <= 640) { // Matches Tailwind's `sm` breakpoint
        router.push("/mobile-signin", { replace: true });
      } else {
        router.push("/?modal=signIn", { replace: true });
      }
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/cart/`,
        { main_prod_id: product.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("There was an error adding the item to the cart:", error);
    }
  };

  const handleQuickView = (e) => {
    router.push(getProductUrl(product));
  };



  return (
    <>
      <Verify />

      <div className="sm:hidden">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid transparent",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-5px)",
              backgroundColor: "#C2FFC7",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          <div className="relative w-full flex flex-col items-center p-2">
            <div className="relative w-full flex mb-4">
              <img name=" "
                className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 relative z-10 mt-6"
                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                loading="lazy"
                alt={name}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 z-20 opacity-0 hover:opacity-100 hover:translate-y-0">
              <button
                onClickCapture={handleAddToCart}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <MdOutlineShoppingBag className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                {inWishlist ? (
                  <FaHeart className="w-4 h-4" />
                ) : (
                  <FaRegHeart className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleQuickView}
                className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
              >
                <FiEye className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col p-2 w-full text-center gap-2">
              <div className="flex justify-center">
                {product && (
                  <ReactStars
                    count={5}
                    value={product.rating || 0} // Provide a default value for rating
                    edit={false}
                    size={10}
                    activeColor="#0D2164"
                    char={<FaStar />}
                  />
                )}
              </div>

              <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
                {name}
              </Typography>
              <div className="flex flex-col justify-center items-center mt-1">
                <p className="text-xs font-medium text-black">₹{price}.00</p>
                {oldPrice && (
                  <p className="text-xs text-gray-400 line-through">₹{oldPrice}.00</p>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
      <div className="hidden sm:block">
        <Paper
          elevation={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            width: { xs: "80%", sm: "14rem", lg: "16rem" },
            height: { xs: "20", sm: "24rem", md: "30rem", lg: "25rem" },
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
          <div
            className="relative w-full flex justify-center mb-2"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <div className="relative rounded-lg flex justify-center items-center w-full">
              <img name=" "
                className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] object-cover mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"
                  }`}
                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                loading="lazy"
                alt={name}
              />

              <div
                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${isImageHovered
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-5 pointer-events-none"
                  }`}
              >
                <button
                  onClickCapture={handleAddToCart}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${isAdded ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"
                    }`}
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

                <button
                  onClick={handleQuickView}
                  className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                </button>
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
              <span className="text-sm font-semibold text-navy-blue">₹{price}.00</span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">₹{oldPrice}.00</span>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default RecentlyViewedCard;