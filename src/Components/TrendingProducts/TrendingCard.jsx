import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Verify from "../../Services/Services/Verify";
import { enqueueSnackbar } from "notistack";
import StarsOnCards from "./StarsOnCards";
import ReactStars from "react-rating-stars-component";
import axiosInstance from "../../Axios/axiosInstance";
import convertToSlug from "../../utils/slugConverter";

const TrendingCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, getProducts, ratingNumber, mrp, ribbon }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign..", { variant: "info" });
            navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        try {
            if (inWishlist) {
                const response = await axiosInstance.delete(
                    `/order/wishlist/?main_product_id=${product.id}/`,
                );
                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Product Removed from wishlist!", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                }
            } else {
                const response = await axiosInstance.post(
                    `/order/wishlist/`,
                    { main_prod_id: product.id },
                );
                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Added to wishlist", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                }
            }
            getProducts()
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const handleAddToCart = async (e) => {
        if (!isAuthenticated) {
            navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        try {
            if (inCart) {
                const response = await axiosInstance.delete(
                    `/order/cart/?main_product_id=${product.id}/`,
                );

                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Product Removed from cart", { variant: "success" });
                    setIsAdded(!isAdded);
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            } else {
                const response = await axiosInstance.post(
                    `/order/cart/`,
                    { main_prod_id: product.id },
                );

                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Added to cart", { variant: "success" });
                    setIsAdded(!isAdded);
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            }
            getProducts()
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const handleQuickView = (e) => {
        const slug = convertToSlug(product.name);
        const category_slug = convertToSlug(product.category_slug);
        const sub_category_slug = convertToSlug(product.sub_category_slug);

        navigate(`/category/${category_slug}/${slug}/`, {       state: {
                product_id: product.id,

            } });

    };

    return (
        <>
            <Verify />

            {/* Desktop & Tablet View */}
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
                    {/* Ribbon */}
                    {ribbon && (
                        <div className="absolute top-3 right-3 z-20">
                            <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
                                {ribbon}
                            </div>
                        </div>
                    )}

                    <div className="relative w-full flex justify-center mb-2">
                        <div className="relative rounded-lg flex justify-center items-center w-full">
                            <img name=" "
                                 className="w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] scale-100 hover:scale-105"
                                 src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                                 alt={name}
                            />

                            <div
                                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${
                                    isHovered
                                        ? "opacity-100 translate-y-0 pointer-events-auto"
                                        : "opacity-0 translate-y-5 pointer-events-none"
                                }`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
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

                        <h3 className="text-base font-semibold text-black mb-2 truncate w-full text-center">
                            {name}
                        </h3>

                        <div className="flex items-center gap-2">

                            <span className="text-base font-semibold text-navy-blue">
  ₹{Math.round(price)}
</span>


                            {mrp && (mrp>price) && <span className="text-base text-gray-400 line-through">₹{mrp}</span>}

                            {/* Discount */}
                            {mrp && price && (mrp>price) && (
                                <span className="text-base font-semibold text-green-600 mt-1">
      {Math.round(((mrp - price) / mrp) * 100)}% OFF
    </span>
                            )}
                        </div>

                        {/*<div className="flex items-center gap-2">*/}
                        {/*    <span className="text-sm text-navy-blue">₹{Math.round(price)}</span>*/}
                        {/*    {mrp && (*/}
                        {/*        <span className="text-sm text-gray-400 line-through">₹{Math.round(mrp)}</span>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </div>
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
                    {/* Ribbon */}
                    {ribbon && (
                        <div className="absolute top-2 right-2 z-20">
                            <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded shadow-md">
                                {ribbon}
                            </div>
                        </div>
                    )}

                    <div className="relative w-full flex flex-col items-center">
                        {/* IMAGE WRAPPER */}
                        <div className="relative w-full bg-white overflow-hidden">
  <img
    className="w-full h-40 object-cover"
    src={`${process.env.REACT_APP_API_URL}${product.image}`}
    alt={product.name}
  />


                            {/* ICONS INSIDE IMAGE AREA */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart();
                                    }}
                                    className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    <MdOutlineShoppingBag className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToWishlist();
                                    }}
                                    className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickView();
                                    }}
                                    className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    <FiEye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-col items-center justify-center p-2 w-full text-center gap-2">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                {product && (
                                    <ReactStars
                                        count={5}
                                        value={userRating}
                                        edit={false}
                                        size={10}
                                        activeColor="#0D2164"
                                        char="★"
                                    />
                                )}
                                <p className="text-[10px] text-gray-500">({ratingNumber})</p>
                            </div>

                            {/* Product Name */}
                            <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }} style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
                                {/* {product.name.length > 12
                                    ? `${product.name.slice(0, 11)}..`
                                    : product.name} */}
                                    {product.name}
                            </Typography>

                            <div className="flex items-center gap-2">
                                {/* Price */}
                                <p className="text-base font-semibold text-black mt-1">
                                    ₹{Math.round(price)}
                                </p>

                                {/* MRP */}
                                {mrp && (mrp>price) && (
                                    <span className="text-base text-gray-400 line-through mt-1">
      ₹{Math.round(mrp)}
    </span>
                                )}

                                {/* Discount */}
                                {mrp && price && (mrp>price) && (
                                    <span className="text-sm font-semibold text-green-600 mt-1">
      {Math.round(((mrp - price) / mrp) * 100)}% OFF
    </span>
                                )}
                            </div>
                            {/* Price */}
                            {/*<div className="flex items-center gap-1 justify-center mt-1">*/}
                            {/*    <p className="text-xs font-bold text-black">₹{Math.round(price)}</p>*/}
                            {/*    {mrp && (*/}
                            {/*        <p className="text-[10px] text-gray-400 line-through">₹{Math.round(mrp)}</p>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </Paper>
            </div>
        </>
    );
};

export default TrendingCard;
