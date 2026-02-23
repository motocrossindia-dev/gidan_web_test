'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useSelector } from "react-redux";
import Verify from "../../../Services/Services/Verify";
import { getProductUrl } from "../../../utils/urlHelper";


const ProductFeaturedCard = ({

  name,
  price,
  oldPrice,
  imageUrl,
  product,
  isNewArrival,
  inCart,
  getProducts

}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isAdded, setIsAdded] = useState(false);

  const [inWishlist, setInWishlist] = useState(false);
  const fetchWishlistStatus = async () => {
    try {
      if (!product || !accessToken) {
        console.warn("Missing product ID or access token");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/?main_product_id_list=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the user token for authentication
          },
        }
      );


      const wishlistIds = response.data.main_product_ids || [];
      setInWishlist(wishlistIds.includes(product));
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistStatus();
    }
  }, [product, isAuthenticated, accessToken]);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {

      if (inWishlist) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/?main_product_id=${product}/`,
          // { main_prod_id: product.id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 200) {
          enqueueSnackbar("Product Removed from wishlist", { variant: "success" });

        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`,
          { main_prod_id: product },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        // fetchWishlistStatus();
        if (response.status === 200) {
          enqueueSnackbar("Added to wishlist", { variant: "success" });

        }
      }
      getProducts()
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleAddToCart = async (e) => {
    // e.stopPropagation();
    if (!isAuthenticated) {
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {

      if (inCart) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/order/cart/?main_product_id=${product}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            // data: { main_prod_id: product.id }, // <-- Pass data inside `data`
          }
        );

        if (response.status === 200) {
          enqueueSnackbar("Product Removed from cart", { variant: "success" });
          setIsAdded(!isAdded);
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/order/cart/`,
          { main_prod_id: product },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.status === 200) {
          enqueueSnackbar("Added to cart", { variant: "success" });
          setIsAdded(!isAdded);
        }
      }
      getProducts()
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleQuickView = (e) => {
    router.push(getProductUrl(product));
  };


  return (
    <>
      <Verify />
      <Paper
        elevation={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: { xs: "80%", sm: "14rem" },
          height: "23rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "center",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid transparent",
          "&:hover": {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-8px)",
            backgroundColor: "#C2FFC7",
            border: "1px solid #e5e7eb",
          },
        }}
      >
        <div className="relative w-full flex flex-col items-center p-2">
          <div className="relative w-full flex justify-center mb-6">
            <img name=" "
              className={`w-40 h-44 sm:w-52 sm:h-59 object-contain rounded-lg transition-transform duration-300 ${isHovered ? "scale-105" : "scale-100"
                }`}
              src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
              loading="lazy"
              alt={name}
            />
            {/* New Arrival Tag */}
            {isNewArrival && !isHovered && (
              <div className="absolute top-0 right-0 bg-bio-green text-white px-2 py-1 rounded-bl-lg">
                New Arrival
              </div>
            )}
          </div>
          {/* Action Icons */}
          <div
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 transition-all duration-300 z-20 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
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
        <div className="p-4 w-full">
          <h3 className="text-sm sm:text-md font-semibold mt-2">{name}</h3>
          <div className="flex flex-col justify-center items-center mt-2">
            <p className="text-sm font-medium text-black">₹{Math.round(price)}.00</p>
            {oldPrice && (
              <p className="text-sm text-gray-400 line-through">₹{Math.round(oldPrice)}.00</p>
            )}
          </div>
        </div>
      </Paper>
    </>
  );
};

export default ProductFeaturedCard;
