import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { FaStar } from 'react-icons/fa';
import Verify from "../../../Services/Services/Verify";
import ReactStars from "react-rating-stars-component";
import StarsOnCards from "../../../Components/TrendingProducts/StarsOnCards";
import axiosInstance from "../../../Axios/axiosInstance";

const RecentlyViewedCard = ({
  product,
  name,
  price,
  imageUrl,
  inWishlist,
  inCart,
  userRating,
  getProducts,
  ratingNumber,
  mrp
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isAdded, setIsAdded] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
      navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {

      if (inWishlist) {

        const response = await axiosInstance.delete(
          `/order/wishlist/?main_product_id=${product}/`,
         
        );
        if (response.status == 200) {
          enqueueSnackbar("Product Removed from wishlist", { variant: "success" });

        }
      } else {
        const response = await axiosInstance.post(
          `/order/wishlist/`,
          { main_prod_id: product } );
        if (response.status == 200) {
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
      navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }

    try {

      if (inCart) {
        const response = await axiosInstance.delete(
          `/order/cart/?main_product_id=${product}/` );

        if (response.status === 200) {
          enqueueSnackbar("Product Removed from cart", { variant: "success" });
          setIsAdded(!isAdded);
        }
      } else {

        const response = await axiosInstance.post(
          `/order/cart/`,
          { main_prod_id: product });

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
    navigate(`/products/${product}`, { state: { product } });
  };

  return (
    <>
      <Verify />
      {/* mobile view */}
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
            backgroundColor: "#f3f4f6",
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
                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                alt={name}
                loading="lazy"
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

            <div className="flex flex-col items-center justify-center p-2 w-full text-center gap-2">
              {/* Rating & Product Name */}
              <div className="flex items-center gap-1">
                {product && (
                  <ReactStars
                    count={5}
                    value={userRating} // Provide a default value for rating
                    edit={false}
                    size={10}
                    activeColor="#0D2164"
                    char={<FaStar />}
                  />
                )}
                <p className="text-[10px] text-gray-500">({ratingNumber})</p> {/* Smaller text */}
              </div>

              {/* Product Name */}
              <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
                {name.length > 15 ? `${name.slice(0, 12)}...` : name}
              </Typography>


              {/* Price Section */}
              <div className="flex flex-col items-center justify-center mt-1">
                <p className="text-xs font-medium text-black">₹{price}</p>
                {mrp && (
                  <p className="text-[10px] text-gray-400 line-through">₹{mrp}</p>
                )}
              </div>
            </div>

          </div>
        </Paper>
      </div>
      {/* desktop view */}
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
                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                alt={name}
              />

              <div
                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${isImageHovered
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-5 pointer-events-none"
                  }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from affecting the card's onClick
                    handleAddToCart();
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"
                    }`}
                >
                  <MdOutlineShoppingBag className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist();
                  }}
                  className={`w-8 h-8 rounded-full ${inWishlist ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"
                    } flex items-center justify-center transition-colors duration-200 cursor-pointer`}
                >
                  {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickView();
                  }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-5">
            <div className="flex gap-1 mb-2">
              <StarsOnCards rating={userRating} ratingNumber={ratingNumber} />
            </div>

            <h3 className="text-sm text-gray-400 mb-2">{name}</h3>

            <div className="flex items-center gap-2">
              <span className="text-sm  text-navy-blue">₹{price}</span>
              {mrp && (
                <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default RecentlyViewedCard;