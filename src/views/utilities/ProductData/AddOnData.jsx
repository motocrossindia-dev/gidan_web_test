'use client';

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import { getProductUrl } from "../../../utils/urlHelper";
import { trackAddToCart, trackRemoveFromCart } from "../../../utils/ga4Ecommerce";
import axiosInstance from "../../../Axios/axiosInstance";
import { Loader2 } from "lucide-react";

const AddOnData = ({
  name,
  price,
  oldPrice,
  imageUrl,
  product,
  inCart,
}) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const router = useRouter();
  const accessToken = useSelector(selectAccessToken);
  const prodUrl = getProductUrl(product);

  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    setLoading(true);
    try {
      if (inCart) {
        const response = await axiosInstance.delete(
          `/order/cart/${product.id}/`
        );

        if (response.status === 200 || response.data?.message === 'success') {
          enqueueSnackbar("Product Removed from cart", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));
          trackRemoveFromCart(product);
        }
      } else {
        const response = await axiosInstance.post(
          `/order/cart/`,
          { prod_id: product.id, quantity: 1 }
        );

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar("Added to cart", { variant: "success" });
          window.dispatchEvent(new Event("cartUpdated"));
          trackAddToCart(product, 1);
        }
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const cardContent = (
    <>
      <div
        className="relative w-full flex justify-center mb-2"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <img
          name=" "
          className={`w-30 h-28 sm:w-44 sm:h-40 lg:h-[200px] object-cover mt-4 lg:w-[200px] object-contain transition-transform duration-300 rounded-[2rem] 
          ${isImageHovered ? "scale-105" : "scale-100"}`}
          src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
          loading="lazy"
          alt={name}
        />
      </div>

      <div className="flex flex-col items-center gap-1 mb-2 w-full px-2">
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className="w-4 h-4 text-navy-blue" />
          ))}
        </div>
      </div>

      <h3 className="text-sm font-medium mb-2">{name}</h3>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-navy-blue">
          ₹{Math.round(price)}.00
        </span>
        {oldPrice && (
          <span className="text-xs text-gray-400 line-through">
            ₹{Math.round(oldPrice)}.00
          </span>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop & Tablet View */}
      <div className="hidden sm:block">
        <Paper
          elevation={0}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            width: { xs: "70%", sm: "12rem", lg: "14rem" },
            height: { xs: "18rem", sm: "22rem", md: "28rem", lg: "22rem" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white",
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
          <Link href={prodUrl} className="flex flex-col items-center w-full h-full">
            {cardContent}
          </Link>
          <button
            className={`mt-auto mb-2 px-6 py-2 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 ${
              inCart ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-bio-green text-white hover:bg-opacity-90'
            }`}
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (inCart ? "In Cart ✓" : "Add to Cart")}
          </button>
        </Paper>
      </div>

      {/* Mobile View */}
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
          <Link href={prodUrl} className="flex flex-col items-center w-full p-2">
            <img name=" "
              className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
              loading="lazy"
              alt={product.name}
            />

            <div className="flex flex-col p-2 w-full text-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="w-4 h-4 text-navy-blue" />
                  ))}
                </div>
              </div>

              <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
                {product.name.length > 12 ? `${product.name.slice(0, 11)}..` : product.name}
              </Typography>

              <div className="flex flex-col justify-center items-center mt-1">
                <p className="text-xs font-medium text-black">
                  ₹{Math.round(product.selling_price)}.00
                </p>
                {product.mrp && (
                  <p className="text-xs text-gray-400 line-through">
                    ₹{Math.round(product.mrp)}.00
                  </p>
                )}
              </div>
            </div>
          </Link>
          <button
            className={`mt-auto mb-2 mx-4 py-2 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              inCart ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-bio-green text-white hover:bg-opacity-90'
            }`}
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (inCart ? "In Cart ✓" : "Add to Cart")}
          </button>
        </Paper>
      </div>
    </>
  );
};

export default AddOnData;
