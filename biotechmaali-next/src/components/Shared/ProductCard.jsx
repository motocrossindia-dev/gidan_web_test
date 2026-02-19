'use client';

import { useRouter } from "next/navigation";
import React, { useState, useCallback, memo } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import Verify from "../../Services/Services/Verify";
import { enqueueSnackbar } from "notistack";
// import img from "./img";
import ReactStars from "react-rating-stars-component";
import axiosInstance from "../../Axios/axiosInstance";

const StarsOnCards = ({rating,ratingNumber}) => {
    
  return (
<div className="flex items-center gap-1 mb-2">
  {[1, 2, 3, 4, 5].map((star) => (
    <FaStar
      key={star}
      className={`w-4 h-4 ${
        star <= rating ? "text-blue-950" : "text-gray-300"
      }`}
    />
  ))}
  <p className="text-xs px-1 text-gray-600">({ratingNumber})</p>
</div>

  )
}

const ProductCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, getProducts, ratingNumber, mrp, ribbon }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign..", { variant: "info" });
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
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
        } catch (error) {}
    }, [isAuthenticated, router, inWishlist, product.id, getProducts]);

    const handleAddToCart = useCallback(async (e) => {
        if (!isAuthenticated) {
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        // Debug: Check if product and product.id exist
        if (!product || !product.id) {
            console.error("Product or product.id is undefined:", product);
            enqueueSnackbar("Error: Product information is missing", { variant: "error" });
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
                const payload = { main_prod_id: product.id };
                console.log("Add to cart payload:", payload); // Debug log
                
                const response = await axiosInstance.post(
                    `/order/cart/`,
                    payload,
                );

                if (response.status === 200 || response.status === 201) {
                    enqueueSnackbar("Added to cart", { variant: "success" });
                    setIsAdded(!isAdded);
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            }
            getProducts()
        } catch (error) {
            console.error("Add to cart error:", error);
            enqueueSnackbar("Failed to add to cart", { variant: "error" });
        }
    }, [isAuthenticated, router, inCart, product, getProducts, isAdded]);

    // ========== OLD CODE (Before Feb 16, 2026) - COMMENTED OUT ==========
    // const handleQuickView = useCallback((e) => {
    //     const category_slug = product?.category_slug;
    //     const sub_category_slug = product?.sub_category_slug;
    //     const productUrl = `/${category_slug}/${sub_category_slug}/${product.slug}/`;
    //     router.push(productUrl, {
    //         state: {
    //             product_id: product.id,
    //             category_slug: category_slug,
    //             sub_category_slug: sub_category_slug
    //         }
    //     });
    // }, [navigate, product.category_slug, product.sub_category_slug, product.slug, product.id]);
    // ========== END OLD CODE ==========

    // ========== NEW CODE (Feb 16, 2026) - Added smooth scroll to top ==========
    const handleQuickView = useCallback((e) => {
        const category_slug = product?.category_slug;
        const sub_category_slug = product?.sub_category_slug;

        // All products have category, subcategory, and product slug
        const productUrl = `/${category_slug}/${sub_category_slug}/${product.slug}/`;

        // Scroll to top smoothly before navigation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Small delay to allow scroll animation to start
        setTimeout(() => {
            router.push(productUrl, {
                state: {
                    product_id: product.id,
                    category_slug: category_slug,
                    sub_category_slug: sub_category_slug
                }
            });
        }, 100);
    }, [router, product.category_slug, product.sub_category_slug, product.slug, product.id]);
    // ========== END NEW CODE ==========

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
                        width: { xs: "100%", sm: "14rem", md: "15rem", lg: "16rem" },
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
                            <img
                                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                                alt={name}
                                width={226}
                                height={260}
                                loading="lazy"
                                className="w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] scale-100 hover:scale-105"
                            />

                            <div
                                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${
                                    isHovered
                                        ? "opacity-100 translate-y-0 pointer-events-auto"
                                        : "opacity-0 translate-y-5 pointer-events-none"
                                }`}
                            >
                                <button aria-label="Add to cart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart();
                                        }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"
                                        }`}
                                >
                                    <MdOutlineShoppingBag className="w-4 h-4" />
                                </button>

                                <button aria-label="Add to wishlist"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToWishlist();
                                        }}
                                        className={`w-8 h-8 rounded-full ${inWishlist ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"
                                        } flex items-center justify-center transition-colors duration-200 cursor-pointer`}
                                >
                                    {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                                </button>

                                <button aria-label="Quick view"
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


                            {mrp && (mrp>price) && <span className="text-base text-gray-600 line-through">₹{mrp}</span>}

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
                        {/*        <span className="text-sm text-gray-600 line-through">₹{Math.round(mrp)}</span>*/}
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
                                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                                alt={name}
                                width={400}
                                height={160}
                                loading="lazy"
                                className="w-full h-40 object-cover"
                            />


                            {/* ICONS INSIDE IMAGE AREA */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                <button aria-label="Add to cart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart();
                                        }}
                                        className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    <MdOutlineShoppingBag className="w-4 h-4" />
                                </button>

                                <button aria-label="Add to wishlist"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToWishlist();
                                        }}
                                        className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                                </button>

                                <button aria-label="Quick view"
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
                                <p className="text-[10px] text-gray-600">({ratingNumber})</p>
                            </div>

                            {/* Product Name */}
                            <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }} style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
                                {name}
                            </Typography>

                            <div className="flex items-center gap-2">
                                {/* Price */}
                                <p className="text-base font-semibold text-black mt-1">
                                    ₹{Math.round(price)}
                                </p>

                                {/* MRP */}
                                {mrp && (mrp>price) && (
                                    <span className="text-base text-gray-600 line-through mt-1">
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
                            {/*        <p className="text-[10px] text-gray-600 line-through">₹{Math.round(mrp)}</p>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </Paper>
            </div>
        </>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ProductCard, (prevProps, nextProps) => {
    // Custom comparison function for product card props
    return (
        prevProps.name === nextProps.name &&
        prevProps.price === nextProps.price &&
        prevProps.imageUrl === nextProps.imageUrl &&
        prevProps.userRating === nextProps.userRating &&
        prevProps.inWishlist === nextProps.inWishlist &&
        prevProps.inCart === nextProps.inCart &&
        prevProps.ratingNumber === nextProps.ratingNumber &&
        prevProps.mrp === nextProps.mrp &&
        prevProps.ribbon === nextProps.ribbon &&
        prevProps.product?.id === nextProps.product?.id &&
        prevProps.getProducts === nextProps.getProducts
    );
});

// ================================old===============
// import React, { useEffect, useState } from "react";
// import { Paper, Typography } from "@mui/material";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { FiEye } from "react-icons/fi";
// // import { useSelector } from "react-redux";
// import axios from "axios";
// import { enqueueSnackbar } from "notistack";
// import { selectAccessToken } from "../../redux/User/verificationSlice";
// import StarsOnCards from "../TrendingProducts/StarsOnCards";
// import ReactStars from "react-rating-stars-component";
// import Verify from "../../Services/Services/Verify";

// const ProductCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, ratingNumber, mrp, ribbon }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [isImageHovered, setIsImageHovered] = useState(false);
//     const router = useRouter();
//     const accessToken = useSelector(selectAccessToken);
//     const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//     const {id, prod_id}=product;

//     useEffect(() => {}, [product, inCart, inWishlist]);

//     const handleAddToCart = async () => {
//         if (!isAuthenticated) {
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }

//         const isMainProduct = !!prod_id;
//         const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;

//         try {
//             if (inCart) {
//                 enqueueSnackbar("Product already exists in cart.", { variant: "info" });
//             } else {
//                 const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/cart/`, payload, {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         "Content-Type": "application/json",
//                     },
//                 });
//                 window.dispatchEvent(new Event("cartUpdated"));
//                 if ([200, 201].includes(response.status)) {
//                     enqueueSnackbar("Added to cart", { variant: "success" });
//                 }
//             }
//         } catch (error) {
//             if (error.response?.data?.message === "Product already exists in cart.") {
//                 enqueueSnackbar("Product already exists in cart.", { variant: "info" });
//             } else {
//                 enqueueSnackbar("Failed to add to cart. Please try again.", { variant: "error" });
//             }
//         }
//     };

//     const handleAddToWishlist = async () => {
//         if (!isAuthenticated) {
//             enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }

//         const isMainProduct = !!prod_id;
//         const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;

//         try {
//             if (inWishlist) {
//                 enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
//             } else {
//                 const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/wishlist/`, payload, {
//                     headers: { Authorization: `Bearer ${accessToken}` },
//                 });
//                 window.dispatchEvent(new Event("wishlistUpdated"));
//                 if ([200, 201].includes(response.status)) {
//                     enqueueSnackbar("Added to wishlist", { variant: "success" });
//                 }
//             }
//         } catch (error) {
//             if (error.response?.data?.message === "Product already exists in wishlist.") {
//                 enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
//             } else {
//                 enqueueSnackbar("Failed to add to wishlist. Please try again.", { variant: "error" });
//             }
//         }
//     };

//     const handleQuickView = () => {
//         const category_slug = product?.category_slug;
//         const sub_category_slug = product?.sub_category_slug;

//         router.push(`/category/${category_slug}/${product.slug}/`, {       state: {
//                 product_id: product.id,
//                 category_slug:category_slug,
//                 sub_category_slug:sub_category_slug

//             } });

//     };

//     return (
//         <>
//             <Verify />

//             {/* Desktop / Tablet */}
//             <div className="hidden sm:block transition-transform duration-300 hover:-translate-y-2">
//                 <Paper
//                     elevation={0}
//                     sx={{
//                         width: { xs: "80%", sm: "14rem", lg: "16rem" },
//                         height: "25rem",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "flex-start",
//                         textAlign: "center",
//                         position: "relative",
//                         overflow: "hidden",
//                         backgroundColor: "white",
//                         borderRadius: "1rem",
//                         border: "1px solid transparent",
//                         transition: "box-shadow 0.3s ease",
//                         "&:hover": {
//                             boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//                             backgroundColor: "#CFFFBE",
//                             border: "1px solid #e5e7eb",
//                         },
//                     }}
//                 >
//                     {/* Ribbon */}
//                     {ribbon && (
//                         <div className="absolute top-3 right-3 z-20">
//                             <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
//                                 {ribbon}
//                             </div>
//                         </div>
//                     )}

//                     {/* Product Image */}
//                     <div
//                         className="relative w-full flex justify-center mb-2"
//                         onMouseEnter={() => setIsImageHovered(true)}
//                         onMouseLeave={() => setIsImageHovered(false)}
//                     >
//                         <img
//                             className={`w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[260px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
//                             src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
//                             alt={name}
//                             loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }}
//                         />

//                         {/* Hover Actions */}
//                         <div
//                             className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${isImageHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
//                         >
//                             <button aria-label="Add to cart"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAddToCart();
//                                     }}
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center ${inCart ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
//                             >
//                                 <MdOutlineShoppingBag className="w-4 h-4" />
//                             </button>

//                             <button aria-label="Add to wishlist"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAddToWishlist();
//                                     }}
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center ${inWishlist ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
//                             >
//                                 {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                             </button>

//                             <button aria-label="Quick view"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleQuickView();
//                                     }}
//                                     className="w-8 h-8 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors"
//                             >
//                                 <FiEye className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Details */}
//                     <div className="w-full flex flex-col items-center mt-5">
//                         <div className="flex gap-1 mb-2">
//                             <StarsOnCards rating={userRating} ratingNumber={ratingNumber} />
//                         </div>
//                         <h3
//                             className="text-base sm:text-lg font-bold text-black mb-2 truncate max-w-full"
//                             title={name}
//                         >
//                             {name}
//                         </h3>
//                         <div className="flex items-center gap-2">

//                             <span className="text-base font-semibold text-navy-blue">
//   ₹{Math.round(price)}
// </span>


//                             {mrp && (mrp>price) && <span className="text-base text-gray-600 line-through">₹{mrp}</span>}

//                             {/* Discount */}
//                             {mrp && price && (mrp>price) && (
//                                 <span className="text-base font-semibold text-green-600 mt-1">
//       {Math.round(((mrp - price) / mrp) * 100)}% OFF
//     </span>
//                             )}
//                         </div>

//                     </div>
//                 </Paper>
//             </div>

//             {/* Mobile */}
//             <div className="sm:hidden transition-transform duration-300 hover:-translate-y-1.5">
//                 <Paper
//                     elevation={0}
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         textAlign: "center",
//                         borderRadius: "12px",
//                         backgroundColor: "white",
//                         position: "relative",
//                         overflow: "hidden",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                             boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//                             backgroundColor: "#CFFFBE",
//                         },
//                     }}
//                 >
//                     {/* Ribbon */}
//                     {ribbon && (
//                         <div className="absolute top-2 right-2 z-20">
//                             <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded shadow-md">
//                                 {ribbon}
//                             </div>
//                         </div>
//                     )}

//                     <div className="relative w-full flex flex-col items-center p-3">
//                         {/* Image Section */}
//                         <div className="relative w-full flex justify-center mb-3">
//                             <img
//                                 className="w-32 h-32 object-contain rounded-md transition-transform duration-300 relative z-10"
//                                 src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
//                                 alt={name}
//                                 loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }}
//                             />
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2 mb-2">
//                             <button aria-label="Add to cart"
//                                     onClick={handleAddToCart}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 <MdOutlineShoppingBag className="w-4 h-4" />
//                             </button>

//                             <button aria-label="Add to wishlist"
//                                     onClick={handleAddToWishlist}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                             </button>

//                             <button aria-label="Quick view"
//                                     onClick={handleQuickView}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 <FiEye className="w-4 h-4" />
//                             </button>
//                         </div>

//                         {/* Product Info */}
//                         <div className="flex flex-col items-center text-center">
//                             {/* Rating */}
//                             <div className="flex justify-center gap-1 items-center">
//                                 <ReactStars
//                                     count={5}
//                                     value={userRating}
//                                     edit={false}
//                                     size={12}
//                                     activeColor="#0D2164"
//                                 />
//                                 <p className="text-[10px] text-gray-600">({ratingNumber})</p>
//                             </div>

//                             {/* Product Name */}
//                             <Typography variant="caption" className="mt-1" style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
//                                 {name}
//                             </Typography>

//                             <div className="flex items-center gap-2">
//                                 {/* Price */}
//                                 <p className="text-base font-semibold text-black mt-1">
//                                     ₹{Math.round(price)}
//                                 </p>

//                                 {/* MRP */}
//                                 {mrp && (mrp>price) && (
//                                     <span className="text-base text-gray-600 line-through mt-1">
//       ₹{Math.round(mrp)}
//     </span>
//                                 )}

//                                 {/* Discount */}
//                                 {mrp && price && (mrp>price) && (
//                                     <span className="text-sm font-semibold text-green-600 mt-1">
//       {Math.round(((mrp - price) / mrp) * 100)}% OFF
//     </span>
//                                 )}
//                             </div>

//                         </div>
//                     </div>
//                 </Paper>
//             </div>
//         </>
//     );
// };

// export default ProductCard;
