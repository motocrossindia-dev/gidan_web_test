import React, { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { selectAccessToken } from "../../../redux/User/verificationSlice";
import StarsOnCards from "../../../Components/TrendingProducts/StarsOnCards";
import ReactStars from "react-rating-stars-component";
import Verify from "../../../Services/Services/Verify";

const ProductCard = ({ name, price, imageUrl, product, userRating, inWishlist, inCart, ratingNumber, mrp }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const navigate = useNavigate();
    const accessToken = useSelector(selectAccessToken);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const {id, prod_id}=product;

    useEffect(() => {
        console.log("Product changed:", product);
    }, [product, inCart, inWishlist]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        const isMainProduct = !!prod_id;
    
        const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;

        try {
            if (inCart) {
                // const response = await axios.delete(`${process.env.REACT_APP_API_URL}/order/cart/`, {
                //     headers: { Authorization: `Bearer ${accessToken}` },
                //     data: payload,
                // });
                // window.dispatchEvent(new Event("cartUpdated"));
                // if ([200, 204].includes(response.status)) {
                //     enqueueSnackbar("Product removed from cart", { variant: "success" });
                // }
                enqueueSnackbar("Product already exists in cart.", { variant: "info" });
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/cart/`, payload, {
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
            navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
        }

        
        const isMainProduct = !!prod_id;
    
        const payload = isMainProduct ? { prod_id: prod_id, quantity: 1 } : { main_prod_id: id, quantity: 1 } ;
        
        try {
            if (inWishlist) {
                // const response = await axios.delete(`${process.env.REACT_APP_API_URL}/order/wishlist/`, {
                //     headers: { Authorization: `Bearer ${accessToken}` },
                //     data: payload,
                // });
                // window.dispatchEvent(new Event("wishlistUpdated"));
                // if ([200, 204].includes(response.status)) {
                //     enqueueSnackbar("Product removed from wishlist", { variant: "success" });
                // }
                enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
            } else {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/wishlist/`, payload, {
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
        navigate(`/productdata/${product}`, { state: { product } });
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
                        height: "25rem", // unified height
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
                    {/* Product Image */}
                    <div
                        className="relative w-full flex justify-center mb-2"
                        onMouseEnter={() => setIsImageHovered(true)}
                        onMouseLeave={() => setIsImageHovered(false)}
                    >
                        <img
                            className={`w-40 sm:w-48 lg:w-[226px] h-[200px] lg:h-[260px] object-contain mt-4 transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"}`}
                            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                            alt={name}
                            loading="lazy"
                        />

                        {/* Hover Actions */}
                        <div
                            className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ${isImageHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${inCart ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
                            >
                                <MdOutlineShoppingBag className="w-4 h-4" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToWishlist();
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${inWishlist ? "bg-green-600 text-white" : "bg-white hover:bg-green-600 hover:text-white"} transition-colors`}
                            >
                                {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                            </button>

                            <button
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
                        <h3 className="text-sm text-gray-500 mb-2">{name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-navy-blue font-medium">₹{Math.round(price)}</span>
                            {/*{mrp && <span className="text-xs text-gray-400 line-through">₹{mrp}.00</span>}*/}
                        </div>
                    </div>
                </Paper>
            </div>

            {/* Mobile */}
            <div className="sm:hidden transition-transform duration-300 hover:-translate-y-1.5">
                <Paper
                    elevation={0}
                    sx={{
                        height: "18rem", // match height with desktop for uniformity
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        borderRadius: "12px",
                        // border: "1px solid #e5e7eb",
                        backgroundColor: "white",
                        transition: "box-shadow 0.3s ease",
                        "&:hover": {
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#CFFFBE",
                        },
                    }}
                >
                    <div className="w-full flex flex-col items-center p-3">
                        <img
                            className="w-32 h-32 object-contain rounded-md mt-4"
                            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                            alt={name}
                            loading="lazy"
                        />

                        {/* Actions */}
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleAddToCart} className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors">
                                <MdOutlineShoppingBag className="w-4 h-4" />
                            </button>
                            <button onClick={handleAddToWishlist} className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors">
                                {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                            </button>
                            <button onClick={handleQuickView} className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors">
                                <FiEye className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="text-center mt-2">
                            <div className="flex justify-center gap-1 items-center">
                                <ReactStars count={5} value={userRating} edit={false} size={12} activeColor="#0D2164" />
                                <p className="text-[10px] text-gray-500">({ratingNumber})</p>
                            </div>
                            <Typography variant="caption" className="mt-1">{name?.length > 20 ? `${name.slice(0, 18)}...` : name}</Typography>
                            <p className="text-sm font-semibold text-black mt-1">₹{Math.round(price)}</p>
                            {/*{mrp && <p className="text-xs text-gray-400 line-through">₹{mrp}.00*/}
                            {/*</p>*/}
                            {/*}*/}
                        </div>
                    </div>
                </Paper>
            </div>
        </>
    );
};

export default ProductCard;

//
// import React, {useEffect, useState} from "react";
// import { Paper, Typography } from "@mui/material";
// import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { FiEye } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { selectAccessToken } from "../../../redux/User/verificationSlice";
// import Verify from "../../../Services/Services/Verify";
// import { enqueueSnackbar } from "notistack";
// import StarsOnCards from "../../../Components/TrendingProducts/StarsOnCards";
// import ReactStars from "react-rating-stars-component";
//
// const ProductCard = ({ name, price,imageUrl, product,userRating,inWishlist,inCart,ratingNumber,mrp }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();
//   const accessToken = useSelector(selectAccessToken);
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isImageHovered, setIsImageHovered] = useState(false);
//     console.log('isAdded')
//     useEffect(() => {
//         console.log("Product changed:", product);
//     }, [product,inCart,inWishlist]);
//     const handleAddToCart = async () => {
//         if (!isAuthenticated) {
//             navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         try {
//             const isMainProduct = !!product.main_prod_id;
//             const payload = isMainProduct
//                 ? { main_prod_id: product.main_prod_id, quantity: 1 }
//                 : { prod_id: product, quantity: 1 };
//
//
//             if (inCart) {
//                 const response = await axios.delete(
//                     `${process.env.REACT_APP_API_URL}/order/cart/`,
//                     {
//                         headers: { Authorization: `Bearer ${accessToken}` },
//                         data: payload,
//                     }
//                 );
//                 window.dispatchEvent(new Event("cartUpdated"));
//                 if (response.status === 200 || response.status === 204) {
//                     enqueueSnackbar("Product removed from cart", { variant: "success" });
//                     setIsAdded(false);
//
//                 }
//             } else {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/order/cart/`,
//                     payload,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${accessToken}`,
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
//                 window.dispatchEvent(new Event("cartUpdated"));
//                 if (response.status === 201 || response.status === 200) {
//                     enqueueSnackbar("Added to cart", { variant: "success" });
//                     setIsAdded(true);
//
//                 }
//             }
//         } catch (error) {
//             console.error("Error adding item to cart:", error.message);
//             // Handle known error from backend
//             if (error.response?.data?.message === "Product already exists in cart.") {
//                 enqueueSnackbar("Product already exists in cart.", { variant: "info" });
//             } else {
//                 console.error("Error adding to cart:", error);
//                 enqueueSnackbar("Failed to add to cart. Please try again.", { variant: "error" });
//             }
//         }
//     };
//
//     const handleAddToWishlist = async () => {
//         if (!isAuthenticated) {
//             enqueueSnackbar("Please sign in to add to wishlist", { variant: "error" });
//             navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//         }
//
//         try {
//             const isMainProduct = !!product.main_prod_id;
//             const payload = isMainProduct
//                 ? { main_prod_id: product.main_prod_id, quantity: 1 }
//                 : { prod_id: product, quantity: 1 };
//
//
//             if (inWishlist) {
//                 const response = await axios.delete(
//                     `${process.env.REACT_APP_API_URL}/order/wishlist/`,
//                     {
//                         headers: { Authorization: `Bearer ${accessToken}` },
//                         data: payload,
//                     }
//                 );
//                 window.dispatchEvent(new Event("wishlistUpdated"));
//                 if (response.status === 200 || response.status === 204) {
//                     enqueueSnackbar("Product removed from wishlist", { variant: "success" });
//
//                 }
//             } else {
//                 const response = await axios.post(
//                     `${process.env.REACT_APP_API_URL}/order/wishlist/`,
//                     payload,
//                     {
//                         headers: { Authorization: `Bearer ${accessToken}` },
//                     }
//                 );
//                 window.dispatchEvent(new Event("wishlistUpdated"));
//                 if (response.status === 201 || response.status === 200) {
//                     enqueueSnackbar("Added to wishlist", { variant: "success" });
//
//                 }
//             }
//         } catch (error) {
//             console.error("Error adding to wishlist:", error);
//             // Handle known error from backend
//             if (error.response?.data?.message === "Product already exists in wishlist.") {
//                 enqueueSnackbar("Product already exists in wishlist.", { variant: "info" });
//             } else {
//                 console.error("Error adding to wishlist:", error);
//                 enqueueSnackbar("Failed to add to wishlist. Please try again.", { variant: "error" });
//             }
//         }
//     };
//
//   const handleQuickView = (e) => {
//     // e.stopPropagation();
//     navigate(`/productdata/${product}`, { state: { product } });
//   };
//
//
//   return (
//     <>
//       <Verify />
//
//       {/* Desktop & Tablet View */}
//       <div className="hidden sm:block">
//          <Paper
//            elevation={0}
//            onMouseEnter={() => setIsHovered(true)}
//            onMouseLeave={() => setIsHovered(false)}
//            sx={{
//              width: { xs: "80%", sm: "14rem", lg: "16rem" },
//              height: { xs: "20", sm: "24rem", md: "30rem", lg: "25rem" },
//              display: "flex",
//              flexDirection: "column",
//              alignItems: "center",
//              justifyContent: "flex-start",
//              textAlign: "center",
//              transition: "all 0.3s ease",
//              position: "relative",
//              overflow: "hidden",
//              backgroundColor: "white",
//              borderRadius: "1rem",
//              border: "1px solid transparent",
//              "&:hover": {
//                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//                transform: "translateY(-8px)",
//                backgroundColor: "#CFFFBE",
//                border: "1px solid #e5e7eb",
//              },
//            }}
//          >
//            <div
//              className="relative w-full flex justify-center mb-2"
//              onMouseEnter={() => setIsImageHovered(true)}
//              onMouseLeave={() => setIsImageHovered(false)}
//            >
//              <div className="relative rounded-lg flex justify-center items-center w-full">
//                <img name=" "
//                  className={`w-40 h-43 sm:w-48 sm:h-53 lg:h-[260px] object-cover mt-4 lg:w-[226px] object-contain transition-transform duration-300 rounded-[2rem] ${isImageHovered ? "scale-105" : "scale-100"
//                    }`}
//                  src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
//                  loading="lazy"
//                  alt={name}
//                />
//
//                <div
//                  className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 transition-all duration-300 ease-in-out ${isImageHovered
//                      ? "opacity-100 translate-y-0 pointer-events-auto"
//                      : "opacity-0 translate-y-5 pointer-events-none"
//                    }`}
//                >
// {/*<button*/}
// {/*  onClick={(e) => {*/}
// {/*    e.stopPropagation(); // Prevent click from affecting the card's onClick*/}
// {/*    handleAddToCart();*/}
// {/*  }}*/}
// {/*  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer ${*/}
// {/*    inCart ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"*/}
// {/*  }`}*/}
// {/*>*/}
// {/*  <MdOutlineShoppingBag className="w-4 h-4" />*/}
// {/*</button>*/}
//
// {/*<button*/}
// {/*  onClick={(e) => {*/}
// {/*    e.stopPropagation();*/}
// {/*    handleAddToWishlist();*/}
// {/*  }}*/}
// {/*  className={`w-8 h-8 rounded-full ${*/}
// {/*    inWishlist ? "bg-bio-green text-white" : "bg-white hover:bg-bio-green hover:text-white"*/}
// {/*  } flex items-center justify-center transition-colors duration-200 cursor-pointer`}*/}
// {/*>*/}
// {/*  {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}*/}
// {/*</button>*/}
//
// {/*<button*/}
// {/*  onClick={(e) => {*/}
// {/*    e.stopPropagation();*/}
// {/*    handleQuickView();*/}
// {/*  }}*/}
// {/*  className="w-8 h-8 rounded-full bg-white hover:bg-bio-green hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer"*/}
// {/*>*/}
// {/*  <FiEye className="w-4 h-4" />*/}
// {/*</button>*/}
//                </div>
//              </div>
//            </div>
//
//            <div className="w-full flex flex-col items-center mt-5">
//              <div className="flex gap-1 mb-2">
//              <StarsOnCards rating={userRating} ratingNumber={ratingNumber} />
//              </div>
//
//              <h3 className="text-sm text-gray-400 mb-2">{name}</h3>
//
//              <div className="flex items-center gap-2">
//                <span className="text-sm  text-navy-blue">₹{price}.00</span>
//                {/* {mrp && (
//                  <span className="text-xs text-gray-400 line-through">₹{mrp}.00</span>
//                )} */}
//              </div>
//            </div>
//          </Paper>
//       </div>
//
//       {/* Mobile View */}
//       <div className="sm:hidden">
//         <Paper
//           elevation={0}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             textAlign: "center",
//             position: "relative",
//             overflow: "hidden",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             border: "1px solid transparent",
//             transition: "all 0.3s ease",
//             "&:hover": {
//               boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
//               transform: "translateY(-5px)",
//               backgroundColor: "#C2FFC7",
//               border: "1px solid #e5e7eb",
//             },
//           }}
//         >
//           <div className="relative w-full flex flex-col items-center p-2">
//             <img name=" "
//               className="w-40 h-24 sm:w-40 sm:h-36 object-contain rounded-lg transition-transform duration-300 mt-6"
//               src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
//               loading="lazy"
//               alt={product.name}
//             />
//
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 z-20 opacity-0 hover:opacity-100 hover:translate-y-0">
//                 {/* <button
//                   onClickCapture={handleAddToCart}
//                   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                 >
//                   <MdOutlineShoppingBag className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={handleAddToWishlist}
//                   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                 >
//                   {inWishlist ? (
//                     <FaHeart className="w-4 h-4" />
//                   ) : (
//                     <FaRegHeart className="w-4 h-4" />
//                   )}
//                 </button>
//                 <button
//                   onClick={handleQuickView}
//                   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
//                 >
//                   <FiEye className="w-4 h-4" />
//                 </button> */}
//                 <button
//   onClick={(e) => {
//     e.stopPropagation(); // Prevents click from affecting parent elements
//     handleAddToCart();
//   }}
//   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
// >
//   <MdOutlineShoppingBag className="w-4 h-4" />
// </button>
//
// <button
//   onClick={(e) => {
//     e.stopPropagation();
//     handleAddToWishlist();
//   }}
//   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
// >
//   {inWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
// </button>
//
// <button
//   onClick={(e) => {
//     e.stopPropagation();
//     handleQuickView();
//   }}
//   className="w-6 h-6 rounded-full bg-white hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors duration-200"
// >
//   <FiEye className="w-4 h-4" />
// </button>
//
//               </div>
//               <div className="flex flex-col items-center justify-center p-2 w-full text-center gap-2">
//   {/* Rating & Product Name */}
//   <div className="flex items-center gap-1">
//     {product && (
//         <ReactStars
//             count={5}
//             value={userRating}
//             edit={false}
//             size={10}
//             activeColor="#0D2164"
//             char="★" // ✅ string star
//         />
//     )}
//     <p className="text-[10px] text-gray-500">({ratingNumber})</p> {/* Smaller text */}
//   </div>
//
//   {/* Product Name */}
//   <Typography sx={{ typography: { xs: "caption", md: "subtitle2" } }}>
//   {name?.length > 15 ? `${name.slice(0, 12)}...` : name}
// </Typography>
//
//
//   {/* Price Section */}
//   <div className="flex flex-col items-center justify-center mt-1">
//     <p className="text-xs font-medium text-black">₹{price}.00</p>
//     {mrp && (
//       <p className="text-[10px] text-gray-400 line-through">₹{mrp}.00</p>
//     )}
//   </div>
// </div>
//
//           </div>
//         </Paper>
//       </div>
//     </>
//   );
// };
//
// export default ProductCard;
//
