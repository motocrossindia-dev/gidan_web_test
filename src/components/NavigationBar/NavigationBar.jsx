'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { FaRegUser, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
import { Popper, Box, Fade } from "@mui/material";

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

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const toggleDropdown = () => {
    if (username !== "Guest") {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
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

  const handleWishListClick = () => {
    router.push("/wishlist");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignIn = () => {
    setOpenPopper(false);
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleClickAway = (event) => {
    if (anchorEl && anchorEl.contains(event.target)) return;
    setOpenPopper(false);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    router.push(`/search?query=${encodeURIComponent(query)}`);
    if (query.trim().length >= 3) {
      trackSearch(query.trim());
    }
  };

  const displayUsername = isMounted ? username : "Guest";

  // Check if we are on the checkout page to show the simplified 'Checkout Mode' header
  const isCheckoutPage = pathname === '/checkout' || pathname === '/checkout/';

  if (isCheckoutPage) {
    return (
      <div className="relative z-[1000]">
        <nav className="w-full px-4 md:px-12 py-3 md:py-4 bg-white font-sans border-b border-white shadow-sm">
          <div className="max-w-[1920px] mx-auto grid grid-cols-3 items-center">
            
            {/* LEFT: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="Gidan Logo"
                  width={140}
                  height={70}
                  className="h-9 md:h-11 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Checkout Title */}
            <div className="flex justify-center text-center">
              <h1 className="text-[15px] md:text-xl font-sans font-semibold text-[#173113] tracking-[0.02em] uppercase whitespace-nowrap">
                Secure <span className="text-[#173113]">Checkout</span>
              </h1>
            </div>

            {/* RIGHT: Back to Cart Action (Desktop Only) */}
            <div className="hidden md:flex justify-end">
              <Link 
                href="/cart" 
                className="group flex items-center gap-1.5 md:gap-2 text-[12px] md:text-base text-slate-500 hover:text-[#173113] transition-all font-medium"
              >
                <span className="hidden md:inline group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back<span className="hidden md:inline"> to Cart</span></span>
              </Link>
            </div>

          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="relative z-[1000]">
      <nav className="w-full px-4 py-3 bg-white font-sans border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex md:hidden items-center justify-between w-full h-[60px] gap-3 px-3">
            <Link href="/" onClick={() => window.scrollTo({ top: -10 })} className="flex-shrink-0">
              <Image
                src={logo}
                alt="Gidan Logo"
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
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
                  width={150}
                  height={80}
                  className="h-14 w-auto object-contain"
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
                      className={`relative font-medium text-[13px] lg:text-[14px] px-1.5 py-1 transition-all duration-300 group
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
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[11005]">
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
                width={180}
                height={120}
                className="h-18 w-auto object-contain"
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

            <div className="flex items-center justify-center flex-[5] gap-2 whitespace-nowrap h-full overflow-x-auto no-scrollbar scroll-smooth">
              {publishedCategories.map((category, idx) => {
                const href = `/${category.slug}/`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={idx}
                    href={href}
                    className={`relative text-[16px] px-3 py-2 transition-all duration-300 font-medium group
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
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[11005] animate-in fade-in slide-in-from-top-2 duration-200">
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

    </div>
  );
};

export default NavBar;
