import React, { useState,useEffect } from "react";
import { Paper } from "@mui/material";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import { isMobile } from "react-device-detect";
import { FaHeart } from "react-icons/fa";

const RecentlyViewedCard = ({ name, price, oldPrice, imageUrl, rating, isNewArrival,product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [inWishlist, setInWishlist] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const fetchWishlistStatus = async () => {
    try {
      if (!product?.id || !accessToken) {
        console.warn("Missing product ID or access token");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/wishlist/?main_product_id_list=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the user token for authentication
          },
        }
      );

      const wishlistIds = response.data.main_product_ids || [];
      setInWishlist(wishlistIds.includes(product.id));
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
  };
    useEffect(() => {
      if (isAuthenticated) {
        fetchWishlistStatus();
      }
    }, [product?.id, isAuthenticated, accessToken]);
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate(isMobile ? "/mobile-signin" : "/?modal=signIn", { replace: true });
      return;
    }
  
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/order/wishlist/`,
        { main_prod_id: product.id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchWishlistStatus();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
  const handleAddToCart = async (e) => {
      e.stopPropagation();
      setIsAdded(!isAdded); // Prevents the event from propagating to parent elements
  
      // Check if the user is authenticated
      if (!isAuthenticated) {
        if (isMobile) {
          navigate("/mobile-signin", { replace: true });
        } else {
          navigate("/?modal=signIn", { replace: true });
        }
        return;
      }
  
      try {
        // Send the product id to the API to add to the cart
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/order/cart/`,
          { main_prod_id: product.id }, // Send only the product id
  
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Include the user token for authentication
            },
          }
        );
  
        // Handle the response, e.g., show a success message or update state
      } catch (error) {
        // Handle error, e.g., show an error message
        console.error("There was an error adding the item to the cart:", error);
      }
  };
  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`, { state: { product } });
  };
  return (
 <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: { xs: "80%", sm: "14rem" ,lg:'16rem' },
        height:  { xs: "20", sm: "24rem" ,md:'30rem',lg:'25rem' },
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
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            loading="lazy"
            alt={name}
          />

         
          <div
            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out
              ${isImageHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}
          >
            <button
              onClickCapture={handleAddToCart}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer
                ${isAdded ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"}`}
            >
              <MdOutlineShoppingBag className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToWishlist}
              className={`w-8 h-8 rounded-full ${
                inWishlist
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
          <span className="text-sm font-semibold text-navy-blue">₹{Math.round(price)}</span>
          {/* {oldPrice && (
            <span className="text-xs text-gray-400 line-through">₹{oldPrice}.00</span>
          )} */}
        </div>
      </div>
    </Paper>
  );
};

export default RecentlyViewedCard;