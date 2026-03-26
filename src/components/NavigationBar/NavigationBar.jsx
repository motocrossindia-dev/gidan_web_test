'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import dynamic from "next/dynamic";

const SignIn = dynamic(() => import("../../AuthPages/SignIn/Signin"), { ssr: false });
const Verification = dynamic(() => import("../../AuthPages/Verification/Verification"), { ssr: false });
const Login = dynamic(() => import("../../AuthPages/Login/Login"), { ssr: false });
const WalletActivation = dynamic(() => import("../WalletActivation/WalletActivation"), { ssr: false });
import __logo from "../../Assets/Gidan_logo.webp";
const _logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;
const logo = typeof _logo === 'string' ? _logo : _logo?.src || _logo;
import __empty from "../../Assets/Cart.webp";
const _empty = typeof __empty === 'string' ? __empty : __empty?.src || __empty;
const empty = typeof _empty === 'string' ? _empty : _empty?.src || _empty;
import { IoIosLogOut } from "react-icons/io";
import WithoutLoginHamburger from "../WithoutLoginHamburger/WithoutLoginHamburger";
import __LogoutGif from "../../Assets/logout_anim.webp";
const _LogoutGif = typeof __LogoutGif === 'string' ? __LogoutGif : __LogoutGif?.src || __LogoutGif;
const LogoutGif = typeof _LogoutGif === 'string' ? _LogoutGif : _LogoutGif?.src || _LogoutGif;
import { resetVerification } from "../../redux/User/verificationSlice";
import { clearLocalStorage } from "../../Services/Services/LocalStorageServices";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CartIconWithCount from "../Cart/cartcount";
import WishlistIconWithCount from "../../views/utilities/WishList/wishlistcount";
import { trackSearch } from "../../utils/ga4Ecommerce";
import { useCategories } from "../../hooks/useCategories";

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

  const { data: categoryData = [], isLoading } = useCategories();

  const publishedCategories = categoryData.filter((category) => category?.is_published === true);

  const username = useSelector((state) => state.user.username || "Guest");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleWalletClick = () => {
    if (username === "Guest") {
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
    } else {
      setIsSignInOpen(true);
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

    // GA4: Track search event (only for meaningful queries)
    if (query.trim().length >= 3) {
      trackSearch(query.trim());
    }
  };

  const displayUsername = isMounted ? username : "Guest";

  return (
    <div className="relative z-50">
      <nav className="w-full px-4 py-3 bg-white font-sans border-b border-gray-100 sticky top-0 left-0 right-0">
        <div className="max-w-[1920px] mx-auto">
          {/* MOBILE (Below 800px): LOGO, SEARCH, HAMBURGER in one row */}
          <div className="flex md:hidden items-center justify-between w-full h-[60px] gap-3 px-3">
            <Link href="/" onClick={() => window.scrollTo({ top: -10 })} className="flex-shrink-0">
              <Image
                src={logo}
                alt="Gidan Logo"
                width={80}
                height={50}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <div className="relative flex-grow max-w-[60%]">
              <IoSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none text-sm"
              />
            </div>
            <div className="flex-shrink-0 flex items-center justify-center min-w-[40px]">
              <WithoutLoginHamburger />
            </div>
          </div>

          {/* TABLET (800px - 1200px): Logo, Categories & Icons top row, Search bottom row */}
          <div className="hidden md:flex xl:hidden flex-col gap-4 px-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" onClick={() => window.scrollTo({ top: -10 })} className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="Gidan Logo"
                  width={110}
                  height={70}
                  className="h-9 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Categories in the same line as logo and icons */}
              <div className="flex items-center justify-center flex-grow whitespace-nowrap overflow-x-auto no-scrollbar scroll-smooth">
                {publishedCategories.map((category, idx) => {
                  const href = category.name === "GIFTS" ? "/gifts/" :
                    category.name === "SERVICES" ? "/services/" :
                      category.name === "OFFERS" ? "/offer/" :
                        `/${category.slug}/`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={idx}
                      href={href}
                      className={`relative font-medium text-[14px] lg:text-[15px] px-2 py-1 transition-all duration-300 group
                        ${isActive ? 'text-[#375421]' : 'text-[#334155] hover:text-[#375421]'}
                      `}
                    >
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#375421] transition-all duration-300 transform 
                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                      `}></span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <button onClick={handleWishListClick} className="p-2 rounded-full transition-all duration-300 hover:bg-red-50 text-gray-700 hover:text-red-500 group">
                  <WishlistIconWithCount className="scale-100 lg:scale-110 transition-transform group-hover:scale-110" />
                </button>
                <button onClick={handleCartClick} className="p-2 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] group">
                  <CartIconWithCount className="scale-100 lg:scale-110 transition-transform group-hover:scale-110" />
                </button>
                <button onClick={handleWalletClick} className="p-2 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] group">
                  <IoWalletOutline className="text-xl lg:text-2xl transition-transform group-hover:scale-110" />
                </button>

                <div
                  className="relative p-1"
                  onMouseEnter={() => username !== "Guest" && setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    onClick={toggleDropdown}
                    className="p-2 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] flex items-center gap-1 group"
                  >
                    <FaRegUser className="text-xl lg:text-2xl transition-transform group-hover:scale-110" />
                  </button>

                  {isMounted && isDropdownOpen && username !== "Guest" && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[100]">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Welcome</p>
                        <p className="text-sm font-bold text-[#375421] truncate">{username}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaRegUser className="text-lg opacity-70" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/profile/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <MdOutlineShoppingBag className="text-lg opacity-70" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/profile/wallet"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <IoWalletOutline className="text-lg opacity-70" />
                        <span>My Wallet</span>
                      </Link>

                      <div className="mt-1 pt-1 border-t border-gray-50">
                        <button
                          onClick={handleLogOutClick}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <IoIosLogOut className="text-lg opacity-70" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Search Bar at the very bottom of the Tablet nav */}
            <div className="relative w-full max-w-[600px] mx-auto pb-1">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search plants, seeds, planters..."
                className="w-full pl-11 pr-5 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none text-base"
              />
            </div>
          </div>

          {/* DESKTOP (Above 1200px): Everything in one line */}
          <div className="hidden xl:flex items-center justify-between gap-6 px-8">
            <Link href="/" onClick={() => window.scrollTo({ top: -10 })} className="flex-shrink-0">
              <Image
                src={logo}
                alt="Gidan Logo"
                width={140}
                height={100}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            <div className="relative flex-[3] max-w-[500px]">
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search plants, seeds, planters..."
                className="w-full pl-11 pr-6 py-2.5 bg-white border border-slate-300 rounded-full focus:outline-none text-lg text-gray-600 font-light"
              />
            </div>

            <div className="flex items-center justify-center flex-[5] gap-2 whitespace-nowrap h-full">
              {publishedCategories.map((category, idx) => {
                const href = `/${category.slug}/`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={idx}
                    href={href}
                    className={`relative text-lg px-4 py-2 transition-all duration-300 font-normal group
                      ${isActive ? 'text-[#375421]' : 'text-[#334155] hover:text-[#375421]'}
                    `}
                  >
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#375421] transition-all duration-300 transform origin-center
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}></span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-6 border-l pl-8 border-gray-200 flex-shrink-0">
              <button onClick={handleWishListClick} className="p-3 rounded-full transition-all duration-300 hover:bg-red-50 text-gray-700 hover:text-red-500 group">
                <WishlistIconWithCount className="scale-125 transition-transform group-hover:scale-135" />
              </button>
              <button onClick={handleCartClick} className="p-3 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] group">
                <CartIconWithCount className="scale-125 transition-transform group-hover:scale-135" />
              </button>
              <button onClick={handleWalletClick} className="p-3 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] group">
                <IoWalletOutline className="text-2xl transition-transform group-hover:scale-110" />
              </button>
              <div
                className="relative group p-2"
                onMouseEnter={() => username !== "Guest" && setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  onClick={toggleDropdown}
                  className="p-3 rounded-full transition-all duration-300 hover:bg-green-50 text-gray-700 hover:text-[#375421] flex items-center gap-1 group"
                >
                  <FaRegUser className="text-2xl transition-transform group-hover:scale-110" />
                  {isMounted && username !== "Guest" && <FaChevronDown className={`text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isMounted && isDropdownOpen && username !== "Guest" && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Welcome</p>
                      <p className="text-sm font-bold text-[#375421] truncate">{username}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaRegUser className="text-lg opacity-70" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/profile/orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MdOutlineShoppingBag className="text-lg opacity-70" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/profile/wallet"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#375421] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <IoWalletOutline className="text-lg opacity-70" />
                      <span>My Wallet</span>
                    </Link>

                    <div className="mt-1 pt-1 border-t border-gray-50">
                      <button
                        onClick={handleLogOutClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <IoIosLogOut className="text-lg opacity-70" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
          <Popper open={openPopper} anchorEl={anchorEl} placement="bottom" transition style={{ zIndex: 11000 }}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps}>
                <Box className="w-80 p-4 mt-10 shadow-lg rounded-lg bg-white border">
                  <p className="text-center text-md">To add or view items in your wishlist, please sign in first.</p>
                  <div className="text-center mt-4">
                    <button
                      onClick={handleSignIn}
                      className="border border-[#375421] text-[#375421] px-4 py-2 rounded-md"
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
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[11000]">
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
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[11000]" onClick={() => setIsCartOpen(false)}>
          <div className="bg-white p-6 rounded-lg w-80 text-center" onClick={(e) => e.stopPropagation()}>
            <Image src={empty} alt="Empty Cart" width={320} height={240} className="mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-4">Your cart is currently empty</h2>
            <button
              className="bg-[#375421] text-white px-4 py-2 rounded-md"
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
//                 className="w-[90%] pl-10 pr-4 py-2 bg-site-bg border border-gray-300 rounded-lg focus:outline-none focus:border-[#375421]"
//               />
//
//             </div>
//           </div>
//
//           {/* Icons */}
//           <div className="flex items-center md:space-x-6 space-x-4 md:pr-10 pr-0 mr-25">
// <button
//   className="flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green hover:text-white rounded-lg transition-all duration-200 mr-4"
//   onClick={handleWishListClick}
// >
//   <WishlistIconWithCount/>
// </button>
//
// <button
//   className="flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green hover:text-white rounded-lg transition-all duration-200 mr-4"
//   onClick={handleCartClick}
// >
//   <CartIconWithCount />
// </button>
//
// <button
//   className="hidden sm:flex flex-col items-center justify-center w-12 h-12 text-gray-600 hover:text-white hover:bg-bio-green hover:text-white rounded-lg transition-all duration-200 mr-4"
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
//                   className="flex items-center justify-between px-4 py-2 bg-bio-green text-white rounded-md hover:bg-bio-green hover:text-white-100 w-40"
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
//                     <li className="flex items-center px-4 py-3 hover:bg-site-bg cursor-pointer">
//                       <Link to="/profile" className="flex items-center w-full">
//                         <FaRegUser className="mr-3 text-gray-600 text-lg" />
//                         <span className="text-gray-700">My Profile</span>
//                       </Link>
//                     </li>
//
//
//                     <li className="flex items-center px-4 py-3 hover:bg-site-bg cursor-pointer ">
//                       <Link
//                         to="/profile/trackorder"
//                         className="flex items-center w-full"
//                       >
//                         <TbCurrentLocation className="mr-3 text-gray-600 text-lg" />
//                         <span className="text-gray-700">Track Order</span>
//                       </Link>
//                     </li>
//                     <li
//                       className="flex items-center px-4 py-3 hover:bg-site-bg cursor-pointer"
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
//               className="w-full pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:border-[#375421]"
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
//                       className="bg-white text-[#375421] border border-[#375421] px-4 py-2 rounded-md hover:bg-green-100"
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
//         className="bg-[#375421] text-white px-4 py-2 rounded-md"
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
