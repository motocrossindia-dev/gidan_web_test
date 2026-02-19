'use client';

import { useRouter } from "next/navigation";
import React, { useState, useCallback, memo } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { FaStar } from 'react-icons/fa';
import Verify from "../../Services/Services/Verify";
import ReactStars from "react-rating-stars-component";
import StarsOnCards from "../TrendingProducts/StarsOnCards";
import axiosInstance from "../../Axios/axiosInstance";
import convertToSlug from "../../utils/slugConverter";

const SeasonalCard = ({
                          product,
                          name,
                          price,
                          imageUrl,
                          inWishlist,
                          inCart,
                          userRating,
                          getProducts,
                          ratingNumber,
                          mrp,
                          ribbon
                      }) => {
    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const [isAdded, setIsAdded] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);

    const handleAddToWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        try {
            if (inWishlist) {
                const response = await axiosInstance.delete(
                    `/order/wishlist/?main_product_id=${product}/`,
                );
                if (response.status === 200) {
                    enqueueSnackbar("Product Removed from wishlist", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                }
            } else {
                const response = await axiosInstance.post(
                    `/order/wishlist/`,
                    { main_prod_id: product },
                );
                if (response.status === 200) {
                    enqueueSnackbar("Added to wishlist", { variant: "success" });
                    window.dispatchEvent(new Event("wishlistUpdated"));
                }
            }
            getProducts()
        } catch (error) {}
    }, [isAuthenticated, router, inWishlist, product, getProducts]);

    const handleAddToCart = useCallback(async (e) => {
        if (!isAuthenticated) {
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        try {
            if (inCart) {
                const response = await axiosInstance.delete(
                    `/order/cart/?main_product_id=${product}/`,
                );

                if (response.status === 200) {
                    enqueueSnackbar("Product Removed from cart", { variant: "success" });
                    setIsAdded(!isAdded);
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            } else {
                const response = await axiosInstance.post(
                    `/order/cart/`,
                    { main_prod_id: product },
                );

                if (response.status === 200) {
                    enqueueSnackbar("Added to cart", { variant: "success" });
                    setIsAdded(!isAdded);
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            }
            getProducts()
        } catch (error) {}
    }, [isAuthenticated, router, inCart, product, getProducts, isAdded]);

    const handleQuickView = useCallback((e) => {
        const category_slug = product?.category_slug;
        const sub_category_slug = product?.sub_category_slug;

        // NEW: Clean URL structure
        const productUrl = sub_category_slug
            ? `/${category_slug}/${sub_category_slug}/${product.slug}/`
            : `/${category_slug}/${product.slug}/`;

        router.push(productUrl, {
            state: {
                product_id: product.slug,
                category_slug: category_slug,
                sub_category_slug: sub_category_slug
            }
        });
    }, [router, product?.category_slug, product?.sub_category_slug, product?.slug]);

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
                        <div className="relative w-full flex mb-4">
                            <img
                                className="w-full h-40 object-cover rounded-lg transition-transform duration-300 relative z-10"
                                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                                alt={name} loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }} />

                            {/* ICONS INSIDE IMAGE AREA */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                <button aria-label="Add to cart"
                                        onClickCapture={handleAddToCart}
                                        className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    <MdOutlineShoppingBag className="w-4 h-4" />
                                </button>

                                <button aria-label="Add to wishlist"
                                        onClick={handleAddToWishlist}
                                        className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                                </button>

                                <button aria-label="Quick view"
                                        onClick={handleQuickView}
                                        className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
                                >
                                    <FiEye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 w-full text-center gap-2">
                            {/* Rating & Product Name */}
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
                                {/* {name.length > 15 ? `${name.slice(0, 8)}...` : name} */}
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
                        </div>
                    </div>
                </Paper>
            </div>

            {/* desktop view */}
            <div className="hidden sm:block">
                <Paper
                    elevation={0}
                    onMouseEnter={() => setIsImageHovered(true)}
                    onMouseLeave={() => setIsImageHovered(false)}
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
                    {/* Ribbon */}
                    {ribbon && (
                        <div className="absolute top-3 right-3 z-20">
                            <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
                                {ribbon}
                            </div>
                        </div>
                    )}

                    <div
                        className="relative w-full flex justify-center mb-2"
                        onMouseEnter={() => setIsImageHovered(true)}
                        onMouseLeave={() => setIsImageHovered(false)}
                    >
                        <div className="relative rounded-lg flex justify-center items-center w-full">
                            <img name=" "
                                 className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
                                 src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                                 alt={name} loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }} />

                            <div
                                className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${isImageHovered
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 translate-y-5 pointer-events-none"
                                }`}
                            >
                                <button aria-label="Add to cart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart();
                                        }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"}`}
                                >
                                    <MdOutlineShoppingBag className="w-4 h-4" />
                                </button>

                                <button aria-label="Add to wishlist"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToWishlist();
                                        }}
                                        className={`w-8 h-8 rounded-full ${inWishlist ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"} flex items-center justify-center transition-colors duration-200 cursor-pointer`}
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

                        <h3 className="text-base font-semibold text-black mb-2 text-center leading-tight truncate w-full">
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
                    </div>
                </Paper>
            </div>
        </>
    );
};

// Memoize SeasonalCard to prevent unnecessary re-renders
export default memo(SeasonalCard, (prevProps, nextProps) => {
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
        prevProps.product === nextProps.product &&
        prevProps.getProducts === nextProps.getProducts
    );
});
// =============================old-----------
// import React, { useState } from "react";
// import { Paper, Typography } from "@mui/material";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { FiEye } from "react-icons/fi";
// // import { enqueueSnackbar } from "notistack";
// import { useSelector } from "react-redux";
// import { FaStar } from 'react-icons/fa';
// import Verify from "../../Services/Services/Verify";
// import ReactStars from "react-rating-stars-component";
// import StarsOnCards from "../TrendingProducts/StarsOnCards";
// import axiosInstance from "../../Axios/axiosInstance";
// import convertToSlug from "../../utils/slugConverter";
//
// const SeasonalCard = ({
//                           product,
//                           name,
//                           price,
//                           imageUrl,
//                           inWishlist,
//                           inCart,
//                           userRating,
//                           getProducts,
//                           ratingNumber,
//                           mrp,
//                           ribbon
//                       }) => {
//     const router = useRouter();
//     const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//     const [isAdded, setIsAdded] = useState(false);
//     const [isImageHovered, setIsImageHovered] = useState(false);
//
//     const handleAddToWishlist = async () => {
//         if (!isAuthenticated) {
//             enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         try {
//             if (inWishlist) {
//                 const response = await axiosInstance.delete(
//                     `/order/wishlist/?main_product_id=${product}/`,
//                 );
//                 if (response.status === 200) {
//                     enqueueSnackbar("Product Removed from wishlist", { variant: "success" });
//                     window.dispatchEvent(new Event("wishlistUpdated"));
//                 }
//             } else {
//                 const response = await axiosInstance.post(
//                     `/order/wishlist/`,
//                     { main_prod_id: product },
//                 );
//                 if (response.status === 200) {
//                     enqueueSnackbar("Added to wishlist", { variant: "success" });
//                     window.dispatchEvent(new Event("wishlistUpdated"));
//                 }
//             }
//             getProducts()
//         } catch (error) {
//             console.error("Error adding to wishlist:", error);
//         }
//     };
//
//     const handleAddToCart = async (e) => {
//         if (!isAuthenticated) {
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         try {
//             if (inCart) {
//                 const response = await axiosInstance.delete(
//                     `/order/cart/?main_product_id=${product}/`,
//                 );
//
//                 if (response.status === 200) {
//                     enqueueSnackbar("Product Removed from cart", { variant: "success" });
//                     setIsAdded(!isAdded);
//                     window.dispatchEvent(new Event("cartUpdated"));
//                 }
//             } else {
//                 const response = await axiosInstance.post(
//                     `/order/cart/`,
//                     { main_prod_id: product },
//                 );
//
//                 if (response.status === 200) {
//                     enqueueSnackbar("Added to cart", { variant: "success" });
//                     setIsAdded(!isAdded);
//                     window.dispatchEvent(new Event("cartUpdated"));
//                 }
//             }
//             getProducts()
//         } catch (error) {
//             console.error("Error adding item to cart:", error);
//         }
//     };
//
//     const handleQuickView = (e) => {
//
//         const category_slug = product?.category_slug;
//         const sub_category_slug = product?.sub_category_slug;
//
//         router.push(`/category/${category_slug}/${product.slug}/`, {       state: {
//                 product_id: product.slug,
//                 category_slug:category_slug,
//                 sub_category_slug:sub_category_slug
//
//             } });
//
//
//     };
//
//     return (
//         <>
//             <Verify />
//             {/* mobile view */}
//             <div className="sm:hidden">
//                 <Paper
//                     elevation={0}
//                     sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         textAlign: "center",
//                         position: "relative",
//                         overflow: "hidden",
//                         backgroundColor: "white",
//                         borderRadius: "8px",
//                         border: "1px solid transparent",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                             boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
//                             transform: "translateY(-5px)",
//                             backgroundColor: "#C2FFC7",
//                             border: "1px solid #e5e7eb",
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
//
//                     <div className="relative w-full flex flex-col items-center">
//                         <div className="relative w-full flex mb-4">
//                             <img
//                                 className="w-full h-40 object-cover rounded-lg transition-transform duration-300 relative z-10"
//                                 src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
//                                 alt={name}
//                             />
//
//                             {/* ICONS INSIDE IMAGE AREA */}
//                             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//                                 <button
//                                     onClickCapture={handleAddToCart}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                                 >
//                                     <MdOutlineShoppingBag className="w-4 h-4" />
//                                 </button>
//
//                                 <button
//                                     onClick={handleAddToWishlist}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                                 >
//                                     {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                                 </button>
//
//                                 <button
//                                     onClick={handleQuickView}
//                                     className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                                 >
//                                     <FiEye className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//
//                         <div className="flex flex-col items-center justify-center p-2 w-full text-center gap-2">
//                             {/* Rating & Product Name */}
//                             <div className="flex items-center gap-1">
//                                 {product && (
//                                     <ReactStars
//                                         count={5}
//                                         value={userRating}
//                                         edit={false}
//                                         size={10}
//                                         activeColor="#0D2164"
//                                         char="★"
//                                     />
//                                 )}
//                                 <p className="text-[10px] text-gray-500">({ratingNumber})</p>
//                             </div>
//
//                             {/* Product Name */}
//                             <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }} style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
//                                 {/* {name.length > 15 ? `${name.slice(0, 8)}...` : name} */}
//                                 {name}
//                             </Typography>
//
//                             <div className="flex items-center gap-2">
//                                 {/* Price */}
//                                 <p className="text-base font-semibold text-black mt-1">
//                                     ₹{Math.round(price)}
//                                 </p>
//
//                                 {/* MRP */}
//                                 {mrp && (mrp>price) && (
//                                     <span className="text-base text-gray-400 line-through mt-1">
//       ₹{Math.round(mrp)}
//     </span>
//                                 )}
//
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
//
//             {/* desktop view */}
//             <div className="hidden sm:block">
//                 <Paper
//                     elevation={0}
//                     onMouseEnter={() => setIsImageHovered(true)}
//                     onMouseLeave={() => setIsImageHovered(false)}
//                     sx={{
//                         width: { xs: "80%", sm: "14rem", lg: "16rem" },
//                         height: { xs: "20", sm: "24rem", md: "30rem", lg: "25rem" },
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "flex-start",
//                         textAlign: "center",
//                         transition: "all 0.3s ease",
//                         position: "relative",
//                         overflow: "hidden",
//                         backgroundColor: "#f3f4f6",
//                         borderRadius: "1rem",
//                         border: "1px solid transparent",
//                         "&:hover": {
//                             boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//                             transform: "translateY(-8px)",
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
//
//                     <div
//                         className="relative w-full flex justify-center mb-2"
//                         onMouseEnter={() => setIsImageHovered(true)}
//                         onMouseLeave={() => setIsImageHovered(false)}
//                     >
//                         <div className="relative rounded-lg flex justify-center items-center w-full">
//                             <img name=" "
//                                  className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
//                                  src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
//                                  alt={name}
//                             />
//
//                             <div
//                                 className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${isImageHovered
//                                     ? "opacity-100 translate-y-0 pointer-events-auto"
//                                     : "opacity-0 translate-y-5 pointer-events-none"
//                                 }`}
//                             >
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAddToCart();
//                                     }}
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"}`}
//                                 >
//                                     <MdOutlineShoppingBag className="w-4 h-4" />
//                                 </button>
//
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAddToWishlist();
//                                     }}
//                                     className={`w-8 h-8 rounded-full ${inWishlist ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"} flex items-center justify-center transition-colors duration-200 cursor-pointer`}
//                                 >
//                                     {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                                 </button>
//
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleQuickView();
//                                     }}
//                                     className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"
//                                 >
//                                     <FiEye className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="w-full flex flex-col items-center mt-5">
//                         <div className="flex gap-1 mb-2">
//                             <StarsOnCards rating={userRating} ratingNumber={ratingNumber} />
//                         </div>
//
//                         <h3 className="text-base font-semibold text-black mb-2 text-center leading-tight truncate w-full">
//                             {name}
//                         </h3>
//
//                         <div className="flex items-center gap-2">
//
//                             <span className="text-base font-semibold text-navy-blue">
//   ₹{Math.round(price)}
// </span>
//
//
//                             {mrp && (mrp>price) && <span className="text-base text-gray-400 line-through">₹{mrp}</span>}
//
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
//         </>
//     );
// };
//
// export default SeasonalCard;