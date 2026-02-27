'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import StarsOnCards from "../../../components/TrendingProducts/StarsOnCards";
import ReactStars from "react-rating-stars-component";
import Verify from "../../../Services/Services/Verify";
import { getProductUrl } from "../../../utils/urlHelper";


const ProductCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, ratingNumber, mrp, ribbon }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const router = useRouter();
    const accessToken = useSelector(selectAccessToken);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const { id, prod_id } = product;

    useEffect(() => { }, [product, inCart, inWishlist]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        const isMainProduct = !!prod_id;
        const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 };

        try {
            if (inCart) {
                enqueueSnackbar("Product already exists in cart.", { variant: "info" });
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/cart/`, payload, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                window.dispatchEvent(new Event("cartUpdated"));
                if ([200, 201].includes(response.status)) {
                    enqueueSnackbar("Added to cart", { variant: "success" });
                }
            }
        } catch (error) {
            if (error.response?.data?.message === "Product already exists in cart.") {
                enqueueSnackbar("Product already exists in cart.", { variant: "info" });
            } else {
                enqueueSnackbar("Failed to add to cart. Please try again.", { variant: "error" });
            }
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
            router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        const isMainProduct = !!prod_id;
        const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 };

        try {
            if (inWishlist) {
                enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
            } else {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`, payload, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                window.dispatchEvent(new Event("wishlistUpdated"));
                if ([200, 201].includes(response.status)) {
                    enqueueSnackbar("Added to wishlist", { variant: "success" });
                }
            }
        } catch (error) {
            if (error.response?.data?.message === "Product already exists in wishlist.") {
                enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
            } else {
                enqueueSnackbar("Failed to add to wishlist. Please try again.", { variant: "error" });
            }
        }
    };

    const handleQuickView = () => {
        router.push(getProductUrl(product));
    };


    return (
        <>
            <Verify />

            {/* Desktop / Tablet */}
            <div className="hidden sm:block transition-transform duration-300 hover:-translate-y-2">
                <Paper
                    elevation={0}
                    sx={{
                        width: { xs: "80%", sm: "14rem", lg: "16rem" },
                        height: "25rem",
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
                    {ribbon && (
                        <div className="absolute top-3 right-3 z-20">
                            <div className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-md shadow-lg">
                                {ribbon}
                            </div>
                        </div>
                    )}

                    {/* Product Image */}
                    <div
                        className="relative w-full flex justify-center mb-2"
                        onMouseEnter={() => setIsImageHovered(true)}
                        onMouseLeave={() => setIsImageHovered(false)}
                    >
                        <img
                            className={`w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[260px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
                            src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                            alt={name}
                            loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }}
                        />

                        {/* Hover Actions */}
                        <div
                            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${isImageHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
                        >
                            <button aria-label="Add to cart"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${inCart ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
                            >
                                <MdOutlineShoppingBag className="w-4 h-4" />
                            </button>

                            <button aria-label="Add to wishlist"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToWishlist();
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${inWishlist ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
                            >
                                {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                            </button>

                            <button aria-label="Quick view"
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
                    <div className="w-full flex flex-col items-center mt-5">
                        <div className="flex gap-1 mb-2">
                            <StarsOnCards rating={userRating} ratingNumber={ratingNumber} />
                        </div>
                        <h2
                            className="text-base sm:text-lg font-bold text-black mb-2 truncate max-w-full"
                            title={name}
                        >
                            {name}
                        </h2>
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#15803D]">
                                    ₹{Math.round(price)}
                                </span>
                                {mrp && (mrp > price) && (
                                    <span className="text-sm text-gray-400 line-through mt-0.5">
                                        ₹{Math.round(mrp)}
                                    </span>
                                )}
                            </div>

                            {mrp && price && (mrp > price) && (
                                <div className="bg-green-100 text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border border-green-200">
                                    SAVE ₹{Math.round(mrp - price)} ({Math.round(((mrp - price) / mrp) * 100)}% OFF)
                                </div>
                            )}
                        </div>

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
                    {ribbon && (
                        <div className="absolute top-2 right-2 z-20">
                            <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded shadow-md">
                                {ribbon}
                            </div>
                        </div>
                    )}

                    <div className="relative w-full flex flex-col items-center p-3">
                        {/* Image Section */}
                        <div className="relative w-full flex justify-center mb-3">
                            <img
                                className="w-32 h-32 object-contain rounded-md transition-transform duration-300 relative z-10"
                                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                                alt={name}
                                loading="lazy" width="400" height="400" style={{ aspectRatio: '1/1' }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-2">
                            <button aria-label="Add to cart"
                                onClick={handleAddToCart}
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

                        {/* Product Info */}
                        <div className="flex flex-col items-center text-center">
                            {/* Rating */}
                            <div className="flex justify-center gap-1 items-center">
                                <ReactStars
                                    count={5}
                                    value={userRating}
                                    edit={false}
                                    size={12}
                                    activeColor="#0D2164"
                                />
                                <p className="text-[10px] text-gray-600">({ratingNumber})</p>
                            </div>

                            {/* Product Name */}
                            <h2 className="mt-1 font-bold text-black text-[0.9rem] leading-tight">
                                {name}
                            </h2>

                            <div className="flex flex-col items-center gap-0.5 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg font-bold text-[#15803D]">
                                        ₹{Math.round(price)}
                                    </span>
                                    {mrp && (mrp > price) && (
                                        <span className="text-[11px] text-gray-400 line-through">
                                            ₹{Math.round(mrp)}
                                        </span>
                                    )}
                                </div>
                                {mrp && price && (mrp > price) && (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                                        {Math.round(((mrp - price) / mrp) * 100)}% OFF
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

export default ProductCard;
// =====================old============
// import React, { useEffect, useState } from "react";
// import { Paper, Typography } from "@mui/material";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { FiEye } from "react-icons/fi";
// // import { useSelector } from "react-redux";
// import axios from "axios";
// import { enqueueSnackbar } from "notistack";
// import { selectAccessToken } from "../../../redux/User/verificationSlice";
// import StarsOnCards from "../../../components/TrendingProducts/StarsOnCards";
// import ReactStars from "react-rating-stars-component";
// import Verify from "../../../Services/Services/Verify";
//
// const ProductCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, ratingNumber, mrp, ribbon }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [isImageHovered, setIsImageHovered] = useState(false);
//     const router = useRouter();
//     const accessToken = useSelector(selectAccessToken);
//     const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//     const {id, prod_id}=product;
//
//     useEffect(() => {
//         console.log("Product changed:", product);
//     }, [product, inCart, inWishlist]);
//
//     const handleAddToCart = async () => {
//         if (!isAuthenticated) {
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         const isMainProduct = !!prod_id;
//         const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;
//
//         try {
//             if (inCart) {
//                 enqueueSnackbar("Product already exists in cart.", { variant: "info" });
//             } else {
//                 const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/cart/`, payload, {
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
//
//     const handleAddToWishlist = async () => {
//         if (!isAuthenticated) {
//             enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
//             router.push(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         const isMainProduct = !!prod_id;
//         const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;
//
//         try {
//             if (inWishlist) {
//                 enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
//             } else {
//                 const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/order/wishlist/`, payload, {
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
//
//     const handleQuickView = () => {
//         const category_slug = product?.category_slug;
//         const sub_category_slug = product?.sub_category_slug;
//
//         router.push(`/category/${category_slug}/${product.slug}/`, {       state: {
//                 product_id: product.id,
//                 category_slug:category_slug,
//                 sub_category_slug:sub_category_slug
//
//             } });
//
//     };
//
//     return (
//         <>
//             <Verify />
//
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
//
//                     {/* Product Image */}
//                     <div
//                         className="relative w-full flex justify-center mb-2"
//                         onMouseEnter={() => setIsImageHovered(true)}
//                         onMouseLeave={() => setIsImageHovered(false)}
//                     >
//                         <img
//                             className={`w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[260px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
//                             src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
//                             alt={name}
//                             loading="lazy"
//                         />
//
//                         {/* Hover Actions */}
//                         <div
//                             className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${isImageHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
//                         >
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleAddToCart();
//                                 }}
//                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${inCart ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
//                             >
//                                 <MdOutlineShoppingBag className="w-4 h-4" />
//                             </button>
//
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleAddToWishlist();
//                                 }}
//                                 className={`w-8 h-8 rounded-full flex items-center justify-center ${inWishlist ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
//                             >
//                                 {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                             </button>
//
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleQuickView();
//                                 }}
//                                 className="w-8 h-8 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors"
//                             >
//                                 <FiEye className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>
//
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
//
//                     </div>
//                 </Paper>
//             </div>
//
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
//
//                     <div className="relative w-full flex flex-col items-center p-3">
//                         {/* Image Section */}
//                         <div className="relative w-full flex justify-center mb-3">
//                             <img
//                                 className="w-32 h-32 object-contain rounded-md transition-transform duration-300 relative z-10"
//                                 src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
//                                 alt={name}
//                                 loading="lazy"
//                             />
//                         </div>
//
//                         {/* Action Buttons */}
//                         <div className="flex gap-2 mb-2">
//                             <button
//                                 onClick={handleAddToCart}
//                                 className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 <MdOutlineShoppingBag className="w-4 h-4" />
//                             </button>
//
//                             <button
//                                 onClick={handleAddToWishlist}
//                                 className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
//                             </button>
//
//                             <button
//                                 onClick={handleQuickView}
//                                 className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                             >
//                                 <FiEye className="w-4 h-4" />
//                             </button>
//                         </div>
//
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
//                                 <p className="text-[10px] text-gray-500">({ratingNumber})</p>
//                             </div>
//
//                             {/* Product Name */}
//                             <Typography variant="caption" className="mt-1" style={{ fontWeight: "bold", color: "black", fontSize: "0.9rem" }}>
//                                 {/*{name?.length > 12 ? `${name.slice(0, 11)}..` : name}*/}
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
//
//                         </div>
//                     </div>
//                 </Paper>
//             </div>
//         </>
//     );
// };
//
// export default ProductCard;