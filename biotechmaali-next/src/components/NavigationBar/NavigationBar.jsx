'use client';

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { FaRegUser, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoWalletOutline, IoSearch } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
import { Popper, Box, Fade } from "@mui/material";
import SignIn from "../../AuthPages/SignIn/Signin";
import Verification from "../../AuthPages/Verification/Verification";
import Login from "../../AuthPages/Login/Login";
import WalletActivation from "../../components/WalletActivation/WalletActivation";
import __logo from "../../../src/Assets/Gidan_logo.webp";
const _logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logo = typeof _logo === 'string' ? _logo : _logo?.src || _logo;
import __empty from "../../Assets/Cart.webp";
const _empty = typeof __empty === 'string' ? __empty : __empty?.src || __empty;
const empty = typeof _empty === 'string' ? _empty : _empty?.src || _empty;
import { IoIosLogOut } from "react-icons/io";
import WithoutLoginHamburger from "../../components/WithoutLoginHamburger/WithoutLoginHamburger";
import __LogoutGif from "../../Assets/logout.webp";
const _LogoutGif = typeof __LogoutGif === 'string' ? __LogoutGif : __LogoutGif?.src || __LogoutGif;
const LogoutGif = typeof _LogoutGif === 'string' ? _LogoutGif : _LogoutGif?.src || _LogoutGif;
import { resetVerification } from "../../redux/User/verificationSlice";
import { clearLocalStorage } from "../../Services/Services/LocalStorageServices";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CartIconWithCount from "../Cart/cartcount";
import WishlistIconWithCount from "../../views/utilities/WishList/wishlistcount";

const NavigationModalParams = ({ setIsSignInOpen, setIsVerificationOpen, setIsLoginOpen }) => {
  const searchParams = useSearchParams();
  useEffect(() => {
    const modal = searchParams.get("modal");
    if (modal === "signIn") setIsSignInOpen(true);
    if (modal === "verification") setIsVerificationOpen(true);
    if (modal === "login") setIsLoginOpen(true);
  }, [searchParams, setIsSignInOpen, setIsVerificationOpen, setIsLoginOpen]);
  return null;
};

const NavBar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const username = useSelector((state) => state.user.username || "Guest");
  const [userName, setUserName] = useState("Guest");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.first_name) {
      setUserName(userData.first_name);
    }
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleWalletClick = () => {
    if (userName === "Guest") {
      setIsWalletPopupOpen(true);
    } else {
      router.push("/profile/wallet");
    }
  };

  const handleGetOtpClick = () => {
    setIsSignInOpen(false);
    setIsVerificationOpen(true);
  };

  const handleVerificationSubmit = () => {
    setIsVerificationOpen(false);
    setIsLoginOpen(true);
  };

  const toggleDropdown = () => {
    if (username !== "Guest") {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogOutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutDialogOpen(true);
  };

  const handleLogOutConfirm = () => {
    dispatch(logout());
    dispatch(resetVerification());
    clearLocalStorage();
    setIsLogoutDialogOpen(false);
    router.push("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleWishListClick = (event) => {
    if (username === "Guest") {
      setAnchorEl(event.currentTarget);
      setOpenPopper(true);
    } else {
      router.push("/wishlist");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignIn = () => {
    setOpenPopper(false);
    setIsSignInOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsSignInOpen(false);
    router.push("/wishlist");
  };

  const handleCartClick = () => {
    if (username === "Guest") {
      setIsCartOpen(true);
    } else {
      router.push("/cart");
    }
  };

  const handleClickAway = (event) => {
    if (anchorEl && anchorEl.contains(event.target)) return;
    setOpenPopper(false);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const displayUsername = isMounted ? username : "Guest";

  return (
    <div>
      <nav className="w-full px-4 py-3 bg-white shadow-sm font-sans">
        <div className="max-w-full mx-auto flex items-center justify-between sm:justify-between md:ml-10">

          {/* MOBILE */}
          <div className="sm:hidden flex justify-left items-center space-x-4">
            <WithoutLoginHamburger />
            <Link href="/" onClick={() => window.scrollTo({ top: -10 })}>
              <Image
                src={logo}
                alt="Gidan Logo"
                width={115}
                height={82}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:flex items-center">
            <Link href="/" onClick={() => window.scrollTo({ top: -10 })}>
              <Image
                src={logo}
                alt="Gidan Logo"
                width={172}
                height={122}
                className="h-24 max-h-32 w-auto object-contain"
                priority
              />

            </Link>
          </div>

          {/* Search bar (Desktop) */}
          <div className="flex-1 max-w-full mx-4 px-10 hidden sm:block">
            <div className="relative w-full">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search Products, Brands and More"
                className="w-[90%] pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center md:space-x-6 space-x-4 md:pr-10">

            <button
              onClick={handleWishListClick}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-bio-green hover:text-white"
              aria-label="View wishlist"
            >
              <WishlistIconWithCount />
            </button>

            <button
              onClick={handleCartClick}
              className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-bio-green hover:text-white"
              aria-label="View shopping cart"
            >
              <CartIconWithCount />
            </button>

            <button
              onClick={handleWalletClick}
              className="hidden sm:flex w-12 h-12 items-center justify-center rounded-lg hover:bg-bio-green hover:text-white"
              aria-label="View wallet"
            >
              <IoWalletOutline className="text-xl" />
            </button>

            {/* User Dropdown */}
            <div className="relative hidden sm:flex gap-4">
              {displayUsername === "Guest" ? (
                <button
                  className="flex items-center space-x-2 text-gray-500"
                  onClick={() => setIsSignInOpen(true)}
                  aria-label="Sign in to your account"
                >
                  <FaRegUser className="text-xl" />
                  <span>Guest</span>
                </button>
              ) : (
                <button
                  className="flex items-center justify-between px-4 py-2 bg-bio-green text-white rounded-md w-40"
                  onClick={toggleDropdown}
                  aria-label="User account menu"
                >
                  <div className="flex items-center space-x-2">
                    <FaRegUser className="text-xl" />
                    <span>{displayUsername.slice(0, 5)}..</span>
                  </div>
                  <FaChevronDown />
                </button>
              )}

              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white rounded-lg shadow-lg w-40 z-50">
                  <ul className="py-1">
                    <li className="px-4 py-3 hover:bg-gray-50">
                      <Link href="/profile" className="flex items-center">
                        <FaRegUser className="mr-3 text-gray-600" />
                        My Profile
                      </Link>
                    </li>

                    <li className="px-4 py-3 hover:bg-gray-50">
                      <Link href="/profile/trackorder" className="flex items-center">
                        <TbCurrentLocation className="mr-3 text-gray-600" />
                        Track Order
                      </Link>
                    </li>

                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={handleLogOutClick}>
                      <IoIosLogOut className="mr-3 text-gray-600" />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE Search */}
        <div className="block sm:hidden mt-3">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              onChange={handleSearch}
              placeholder="Search for Products, Brands and More"
              className="w-full pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </nav>

      {/* Modals */}
      <Suspense fallback={null}>
        <NavigationModalParams
          setIsSignInOpen={setIsSignInOpen}
          setIsVerificationOpen={setIsVerificationOpen}
          setIsLoginOpen={setIsLoginOpen}
        />
      </Suspense>

      {isSignInOpen && <SignIn onClose={() => setIsSignInOpen(false)} onGetOtpClick={handleGetOtpClick} onLoginSuccess={handleLoginSuccess} />}

      {isVerificationOpen && <Verification onClose={() => setIsVerificationOpen(false)} onSubmit={handleVerificationSubmit} />}

      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}

      {isWalletPopupOpen && <WalletActivation onClose={() => setIsWalletPopupOpen(false)} />}

      {/* Wishlist Popper */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Popper open={openPopper} anchorEl={anchorEl} placement="bottom" transition style={{ zIndex: 1000 }}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps}>
                <Box className="w-80 p-4 mt-10 shadow-lg rounded-lg bg-white border">
                  <p className="text-center text-md">To add or view items in your wishlist, please sign in first.</p>
                  <div className="text-center mt-4">
                    <button
                      onClick={handleSignIn}
                      className="border border-green-500 text-green-500 px-4 py-2 rounded-md"
                      aria-label="Sign in to view wishlist"
                    >
                      Sign In
                    </button>
                  </div>
                </Box>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>

      {/* Logout Modal */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Logout</h3>
            <Image src={LogoutGif} alt="Logout" width={160} height={160} className="mx-auto mb-4" />
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-around">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleCancelLogout}
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleLogOutConfirm}
                aria-label="Confirm logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart Popup */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-80 text-center" onClick={(e) => e.stopPropagation()}>
            <Image src={empty} alt="Empty Cart" width={320} height={240} className="mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-4">Your cart is currently empty</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close empty cart message and add products"
            >
              Add Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;

// import React, { useState, useEffect } from "react";
// import { FaRegUser, FaRegHeart, FaChevronDown } from "react-icons/fa";
// import {
//   MdOutlineShoppingBag,
//
// } from "react-icons/md";
// import { IoWalletOutline, IoSearch } from "react-icons/io5";
// import { TbCurrentLocation } from "react-icons/tb";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/Slice/userSlice";
// // import { Popper, Box, Fade } from "@mui/material";
// import SignIn from "../../AuthPages/SignIn/Signin";
// import Verification from "../../AuthPages/Verification/Verification";
// import Login from "../../AuthPages/Login/Login";
// import WalletActivation from "../../components/WalletActivation/WalletActivation";
// import logo from "../../../src/Assets/Gidan_logo.webp";
// import empty from "../../Assets/Cart.webp";
// import { IoIosLogOut } from "react-icons/io";
// import WithoutLoginHamburger from "../../components/WithoutLoginHamburger/WithoutLoginHamburger";
// import LogoutGif from "../../Assets/logout.gif";
// import { resetVerification } from "../../redux/User/verificationSlice";
// import { clearLocalStorage } from "../../Services/Services/LocalStorageServices";
// import ClickAwayListener from "@mui/material/ClickAwayListener";
// import CartIconWithCount from "../Cart/cartcount";
// import WishlistIconWithCount from "../../views/utilities/WishList/wishlistcount";
//
//
// const NavBar = () => {
//   const [isSignInOpen, setIsSignInOpen] = useState(false);
//   const [isVerificationOpen, setIsVerificationOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
//   const [openPopper, setOpenPopper] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const username = useSelector((state) => state.user.username ||"Guest")
//   const [userName, setUserName] = useState('Guest');
//
//
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   useEffect(() => {
//     const params = new URLSearchParams(`?${searchParams.toString()}`);
//     const modal = params.get("modal"); // Check query parameter 'modal'
//     if (modal === "signIn") setIsSignInOpen(true);
//     if (modal === "verification") setIsVerificationOpen(true);
//     if (modal === "login") setIsLoginOpen(true);
//   }, [pathname]);
//     useEffect(() => {
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       if (userData && userData?.first_name) {
//         setUserName(userData?.first_name);
//       }
//     }, []);
//   // ======================
//   const dispatch = useDispatch();
//   const router = useRouter();
//
//   const handleWalletClick = () => {
//
//     if (userName === "Guest") {
//       setIsWalletPopupOpen(true);
//     } else  {
//       router.push("/profile/Wallet");
//     }
//   };
//
//   const handleGetOtpClick = () => {
//     setIsSignInOpen(false);
//     setIsVerificationOpen(true);
//   };
//
//   const handleVerificationSubmit = () => {
//     setIsVerificationOpen(false);
//     setIsLoginOpen(true);
//   };
//
//   const toggleDropdown = () => {
//     if (username !== "Guest") {
//       setIsDropdownOpen(!isDropdownOpen);
//     }
//   };
//
//   const handleLogOutClick = () => {
//     setIsDropdownOpen(false);
//     setIsLogoutDialogOpen(true);
//   };
//
//   const handleLogOutConfirm = () => {
//     dispatch(logout());
//     dispatch(resetVerification());
//     clearLocalStorage();
//     setIsLogoutDialogOpen(false);
//     router.push("/"); // Redirect to home after logout
//   };
//
//   const handleCancelLogout = () => {
//     setIsLogoutDialogOpen(false);
//   };
//
//   const handleWishListClick = (event) => {
//
//     if (username === "Guest") {
//       setAnchorEl(event.currentTarget);
//       setOpenPopper(true);
//     } else {
//       router.push("/WishList");
//     }
//   };
//    useEffect(() => {
//       window.scrollTo(0, 0); // Scroll to top on component mount
//     }, []);
//   const handleSignIn = () => {
//     setOpenPopper(false);
//     setIsSignInOpen(true);
//   };
//
//
//   const handleLoginSuccess = () => {
//     setIsSignInOpen(false);
//     router.push("/WishList");
//   };
//
//   const handleCartClick = () => {
//     if (username === "Guest") {
//       setIsCartOpen(true);
//     } else {
//       router.push("/Cart");
//     }
//   };
//
//   const handleClickAway = (event) => {
//     if (anchorEl && anchorEl.contains(event.target)) {
//       // Prevent closing if the click is on the anchor element
//       return;
//     }
//     setOpenPopper(false); // Close the Popper
//   };
//   const handleSearch = async (e) => {
//     const query = e.target.value;
//     setSearchTerm(query);
//
//     router.push(`/search?query=${encodeURIComponent(query)}`);
//
//   };
//
//   return (
//     <div className="">
//       <nav className="w-full px-4 py-3 bg-white shadow-sm font-sans">
//         <div className="max-w-full mx-auto flex items-center justify-between sm:justify-between md:ml-10">
//
//           <div className="sm:hidden flex justify-left items-center space-x-4">
//   <WithoutLoginHamburger />
//   <Link to="/" onClick={() => window.scrollTo({ top: -10, left: 0, behavior: 'auto' })}>
//     <img
//       src={logo}
//       alt="Gidan Logo"
//       className="h-20 w-auto"   // Smaller logo on mobile
//       name="Gidan"
//     />
//   </Link>
// </div>
//
//
//
//           <div className="hidden sm:flex items-center">
//   <Link to="/" onClick={() => window.scrollTo({ top: -10, left: 0, behavior: 'auto' })}>
//     <img
//       src={logo}
//       alt="Gidan Logo"
//       className="h-20 w-auto"   // Slightly larger on desktop
//       name="Gidan"
//     />
//   </Link>
// </div>
//
//
//           {/* Desktop: Search bar */}
//           <div className="flex-1 max-w-full mx-4 px-10 hidden sm:block ">
//
//             <div className="relative w-full">
//               <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 placeholder="Search Products, Brands and More"
//                 className="w-[90%] pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//
//             </div>
//           </div>
//
//           {/* Icons */}
//           <div className="flex items-center md:space-x-6 space-x-4 md:pr-10 pr-0 mr-25">
// <button
//   className="flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green rounded-lg transition-all duration-200 mr-4"
//   onClick={handleWishListClick}
// >
//   <WishlistIconWithCount/>
// </button>
//
// <button
//   className="flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green rounded-lg transition-all duration-200 mr-4"
//   onClick={handleCartClick}
// >
//   <CartIconWithCount />
// </button>
//
// <button
//   className="hidden sm:flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green rounded-lg transition-all duration-200 mr-4"
//   onClick={handleWalletClick}
// >
//   <IoWalletOutline className="text-xl" />
// </button>
//
//             <div className="relative hidden sm:flex gap-4">
//
//               {username === "Guest" ? (
//                 <button
//                   className="flex items-center space-x-2 text-gray-500 hover:text-black"
//                   onClick={() => setIsSignInOpen(true)}
//                 >
//                   <FaRegUser className="text-xl" />
//                   <span className="font-medium">Guest</span>
//                 </button>
//               ) : (
//                 <button
//                   className="flex items-center justify-between px-4 py-2 bg-bio-green text-white rounded-md hover:bg-bio-green-100 w-40"
//                   onClick={toggleDropdown}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <FaRegUser className="text-xl" />
//                   <span className="font-medium">{username.slice(0, 5)}..</span>
//                   </div>
//                   <FaChevronDown className="text-base" />
//                 </button>
//               )}
//
//               {isDropdownOpen && (
//                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 bg-white rounded-lg shadow-lg w-40 z-50 border border-gray-100">
//                   <ul className="py-1">
//                     <li className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
//                       <Link to="/profile" className="flex items-center w-full">
//                         <FaRegUser className="mr-3 text-gray-600 text-lg" />
//                         <span className="text-gray-700">My Profile</span>
//                       </Link>
//                     </li>
//
//
//                     <li className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer ">
//                       <Link
//                         to="/profile/trackorder"
//                         className="flex items-center w-full"
//                       >
//                         <TbCurrentLocation className="mr-3 text-gray-600 text-lg" />
//                         <span className="text-gray-700">Track Order</span>
//                       </Link>
//                     </li>
//                     <li
//                       className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
//                       onClick={handleLogOutClick}
//                     >
//                       <IoIosLogOut className="mr-3 text-gray-600 text-lg" />
//                       <span className="text-gray-700">Logout</span>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//
//         {/* Mobile: Search bar */}
//         <div className="block sm:hidden mt-3">
//           <div className="relative">
//             <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               onChange={handleSearch}
//               placeholder="Search for Products, Brands and More"
//               className="w-full pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             />
//           </div>
//         </div>
//       </nav>
//
//       {isSignInOpen && (
//         <SignIn
//           onClose={() => setIsSignInOpen(false)}
//           onGetOtpClick={handleGetOtpClick}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//
//       {isVerificationOpen && (
//         <Verification
//           onClose={() => setIsVerificationOpen(false)}
//           onSubmit={handleVerificationSubmit}
//         />
//       )}
//
//       {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
//
//       {isWalletPopupOpen && (
//         <WalletActivation onClose={() => setIsWalletPopupOpen(false)} />
//       )}
//
//       {/* =================handlesignin======= */}
//       <ClickAwayListener onClickAway={handleClickAway}>
//         <div> {/* Wrap the Popper with a parent container */}
//           <Popper
//             open={openPopper}
//             anchorEl={anchorEl}
//             placement="bottom"
//             transition
//             style={{ zIndex: 1000 }}
//           >
//             {({ TransitionProps }) => (
//               <Fade {...TransitionProps}>
//                 <Box
//                   sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
//                   className="w-80 p-4 mt-10 shadow-lg rounded-lg"
//                 >
//                   <p className="text-center text-md">
//                     To add or view items in your wishlist, please sign in first.
//                   </p>
//                   <div className="text-center mt-4">
//                     <button
//                       onClick={handleSignIn}
//                       className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md hover:bg-green-100"
//                     >
//                       Sign In
//                     </button>
//                   </div>
//                 </Box>
//               </Fade>
//             )}
//           </Popper>
//         </div>
//       </ClickAwayListener>
//
//       {isLogoutDialogOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
//             <h3 className="text-lg font-semibold mb-4">Logout</h3>
//             <div className="mb-4">
//               {/* Replace 'your-gif-file.gif' with the actual path to your GIF */}
//               <img name=" "    src={LogoutGif}  alt="Logout" className="mx-auto w-40" />
//             </div>
//             <p className="text-gray-700 mb-6">
//               Are you sure you want to logout?
//             </p>
//             <div className="flex justify-around">
//               <button
//                 className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400"
//                 onClick={handleCancelLogout}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
//                 onClick={handleLogOutConfirm}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//
// {isCartOpen && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//     onClick={() => setIsCartOpen(false)} // Clicking on overlay closes modal
//   >
//     <div
//       className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
//       onClick={(e) => e.stopPropagation()} // Prevents modal click from closing
//     >
//       <img name=" "    src={empty}  alt="Empty Cart" className="mx-auto mb-4" />
//       <h2 className="text-lg font-semibold mb-4">
//         Your cart is currently empty
//       </h2>
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded-md"
//         onClick={() => setIsCartOpen(false)}
//       >
//         Add Products
//       </button>
//     </div>
//   </div>
// )}
//
//     </div>
//   );
// };
//
// export default NavBar;
