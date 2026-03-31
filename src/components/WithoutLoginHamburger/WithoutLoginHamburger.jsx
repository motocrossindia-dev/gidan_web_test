'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
import axiosInstance from "../../Axios/axiosInstance";
import __LogoutGif from "../../Assets/logout_anim.webp";
const _LogoutGif = typeof __LogoutGif === 'string' ? __LogoutGif : __LogoutGif?.src || __LogoutGif;
const LogoutGif = typeof _LogoutGif === 'string' ? _LogoutGif : _LogoutGif?.src || _LogoutGif;
import React from 'react';
import {
  FaBars,
  FaUser,
  FaTimes,
  FaChevronRight,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaSignOutAlt,
} from "react-icons/fa";
import { useCategories } from "../../hooks/useCategories";

const WithoutLoginHamburger = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const username = useSelector((state) => state.user.username || "Guest");
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { data: categoryData = [], isLoading: loading } = useCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categoryToTypeMap = {
    PLANTS: "plant",
    POTS: "pot",
    SEEDS: "seed",
    "Plant Care": "plantcare",
  };

  useEffect(() => {
    if (username) {
      setUserName(username);
    }
  }, [username]);

  useEffect(() => {
    if (isOpen || isLogoutDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isLogoutDialogOpen]);


  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("userData");
    dispatch(logout());
    setUserName("Guest");
    setIsLogoutDialogOpen(false);
    router.push("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleUserNameClick = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const navigateToSignup = () => {
    setIsOpen(false);
    router.push("/login");
  };

  const handleCategoryClick = (category) => {
    const { id, name, slug } = category;
    const typeKey = categoryToTypeMap[name];

    if (category.subcategories && category.subcategories.length > 0) {
      setExpandedCategory(expandedCategory === id ? null : id);
      return;
    }

    setIsOpen(false);

    if (name === "GIFTS") {
      router.push(`/gift/`);
    } else if (name === "OFFERS") {
      router.push(`/offer`);
    } else {
      router.push(`/${slug}/`, {
        state: {
          categoryId: id,
          categoryName: name,
          typeKey: typeKey || "",
          category_slug: slug,
        },
      });
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {
    setIsOpen(false);
    const typeKey = categoryToTypeMap[category.name];
    router.push(`/${category.slug}/${subcategory.slug}/`, {
      state: {
        categoryId: category.id,
        categoryName: category.name,
        subcategoryID: subcategory.id,
        typeKey: typeKey || "",
        category_slug: category.slug,
        subCategory: {
          name: subcategory.name,
          subcategory_slug: subcategory.slug,
        },
      },
    });
  };

  const additionalLinks = [
    { label: "Blogs", path: "/blogs" },
    { label: "Track Order", path: "/profile/trackorder" },
    { label: "Get A Franchise", path: "/franchise-enquiry" },
    { label: "Contact Us", path: "/contact-us" },
  ];

  return (
    <>
      <div>
        {/* Hamburger Button - Hide when menu is open */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 focus:outline-none z-[1100] relative"
            aria-label="Toggle Menu"
          >
            <FaBars className="text-2xl text-gray-700" />
          </button>
        )}

        {/* Sidebar Menu */}
        {isOpen && (
          <div
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/70 z-[999999] flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white w-[85%] max-w-[320px] h-[100dvh] shadow-[0_0_40px_rgba(0,0,0,0.2)] relative flex flex-col animate-slide-in-right transform transition-all duration-300 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. Header Section (Fixed at top) */}
              <div className="p-6 bg-[#375421] text-white shrink-0 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/10 shadow-inner">
                      <FaUser className="text-xl text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Welcome,</span>
                      {userName && userName !== "Guest" ? (
                        <span
                          className="font-black text-lg cursor-pointer hover:text-orange-200 transition-colors"
                          onClick={handleUserNameClick}
                        >
                          {userName}
                        </span>
                      ) : (
                        <Link
                          href="/login"
                          className="font-black text-lg hover:text-orange-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                          }}
                        >
                          Login / Signup
                        </Link>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/10 hover:bg-white/20 transition-all active:scale-95"
                    aria-label="Close Menu"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* 2. Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto bg-white custom-scrollbar min-h-[200px]">
                {loading ? (
                  <div className="p-6 space-y-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="px-6 py-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Shop Categories</h3>
                      <div className="space-y-1">
                        {categoryData.filter((category) => category.name !== "SERVICES").map((category) => (
                          <div key={category.id} className="border-b border-gray-50 last:border-0">
                            <div
                              onClick={(e) => {
                                const hasSubs = category.subCategory && category.subCategory.length > 0;
                                if (hasSubs) {
                                  e.stopPropagation();
                                  setExpandedCategory(expandedCategory === category.id ? null : category.id);
                                } else {
                                  setIsOpen(false);
                                  router.push(category.name === "GIFTS" ? "/gift/" : category.name === "OFFERS" ? "/offer/" : `/${category.slug}/`);
                                }
                              }}
                              className={`flex items-center justify-between py-4 group cursor-pointer transition-all duration-300 ${expandedCategory === category.id ? 'text-[#375421]' : 'text-gray-700 hover:text-[#375421]'}`}
                            >
                              <span className="font-bold text-[15px]">
                                {category.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                              </span>
                              {category.subCategory && category.subCategory.length > 0 && (
                                <FaChevronRight
                                  className={`text-gray-300 text-xs transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-90 text-[#375421]' : ''}`}
                                />
                              )}
                            </div>

                            {/* Subcategories */}
                            {expandedCategory === category.id && category.subCategory && (
                              <div className="bg-gray-50/50 rounded-2xl mb-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                {category.subCategory.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/${category.slug}/${subcategory.slug}/`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between px-6 py-3.5 hover:bg-white text-gray-600 hover:text-[#375421] transition-all"
                                  >
                                    <span className="text-sm font-medium">{subcategory.name}</span>
                                    {subcategory.product_count > 0 && (
                                      <span className="text-[10px] font-bold bg-white text-gray-400 px-2 py-0.5 rounded-full border border-gray-100 italic">
                                        {subcategory.product_count}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Information Section */}
                    <div className="mt-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Support & Info</h3>
                      <div className="space-y-3">
                        {additionalLinks.map((item, index) => (
                          <Link
                            key={index}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-2 text-gray-600 hover:text-[#375421] font-bold text-sm transition-all"
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#375421]"></span>
                            {item.label}
                          </Link>
                        ))}
                        {userName === "Guest" && (
                          <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-2 text-[#375421] font-black text-sm transition-all group"
                          >
                            <div className="w-1 h-1 rounded-full bg-[#375421]"></div>
                            Sign Up Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Footer Section (Fixed at bottom) */}
              <div className="shrink-0 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                {/* Logout Button (Only for members) */}
                {userName !== "Guest" && (
                  <div className="p-6 pb-2">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full py-4 bg-[#375421] text-white rounded-2xl hover:bg-[#2d451b] transition-all font-black text-[12px] uppercase tracking-widest shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <FaSignOutAlt className="rotate-180" />
                      Logout Account
                    </button>
                  </div>
                )}

                {/* Social Links */}
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Connect with us</span>
                    <div className="flex items-center gap-4">
                      {[
                        { icon: <FaFacebookF />, url: "https://www.facebook.com/thegidanstore/" },
                        { icon: <FaInstagram />, url: "https://www.instagram.com/thegidanstore/" },
                        { icon: <FaLinkedin />, url: "https://www.linkedin.com/company/thegidanstore/" },
                        { icon: <FaYoutube />, url: "https://www.youtube.com/@thegidanstore/" },
                        { icon: <FaWhatsapp />, url: "https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/" }
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#375421]/10 hover:text-[#375421] transition-all active:scale-90"
                        >
                          {React.cloneElement(social.icon, { size: 16 })}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* App Version Info */}
                <div className="px-6 py-4 bg-gray-50/50 flex justify-center border-t border-gray-100">
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Gidan v2.4.0 — Made with 💚 in India</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        {isLogoutDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[1100]">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
              <h3 className="text-lg font-semibold mb-4">Logout</h3>
              <div className="mb-4">
                <img src={LogoutGif} alt="Logout" className="mx-auto w-40" />
              </div>
              <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-around">
                <button
                  className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400"
                  onClick={handleCancelLogout}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WithoutLoginHamburger;


// ==================== OLD CODE (COMMENTED) ====================
// import React, { useState, useEffect } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/Slice/userSlice";
// import axiosInstance from "../../Axios/axiosInstance";
// import LogoutGif from "../../Assets/logout.gif";
// 
// import {
//   FaBars,
//   FaUser,
//   FaTimes,
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedin,
//   FaYoutube,
//   FaWhatsapp,
// } from "react-icons/fa";
// 
// const WithoutLoginHamburger = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
// 
//   const username = useSelector((state) => state.user.username || "Guest");
//   const [userName, setUserName] = useState("Guest");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedCategory, setExpandedCategory] = useState(null);
// 
//   const categoryToTypeMap = {
//     PLANTS: "plant",
//     POTS: "pot",
//     SEEDS: "seed",
//     "PLANT CARE": "plantcare",
//   };
// 
//   useEffect(() => {
//     if (username) {
//       setUserName(username);
//     }
//   }, [username]);
// 
//   useEffect(() => {
//     if (isOpen || isLogoutDialogOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen, isLogoutDialogOpen]);
// 
//   const getCategories = async () => {
//     try {
//       const response = await axiosInstance.get(`/category/`);
//       const data = response?.data?.data?.categories;
//       if (data) {
//         const categoriesWithSubs = await Promise.all(
//           data.map(async (category) => {
//             const subcategories = await getSubCategories(category.slug);
//             return { ...category, subcategories };
//           })
//         );
//         setCategories(categoriesWithSubs);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
// 
//   const getSubCategories = async (categorySlug) => {
//     try {
//       const response = await axiosInstance.get(
//         `/category/categoryWiseSubCategory/${categorySlug}/`
//       );
//       if (response.status === 200) {
//         return response?.data?.data?.subCategorys || [];
//       }
//     } catch (error) {
//       return [];
//     }
//   };
// 
//   useEffect(() => {
//     getCategories();
//   }, []);
// 
//   const handleLogoutClick = () => {
//     setIsOpen(false);
//     setIsLogoutDialogOpen(true);
//   };
// 
//   const handleLogoutConfirm = () => {
//     localStorage.removeItem("userData");
//     dispatch(logout());
//     setUserName("Guest");
//     setIsLogoutDialogOpen(false);
//     router.push("/");
//   };
// 
//   const handleCancelLogout = () => {
//     setIsLogoutDialogOpen(false);
//   };
// 
//   const handleUserNameClick = () => {
//     setIsOpen(false);
//     router.push("/mobilesidebar");
//   };
// 
//   const navigateToSignup = () => {
//     setIsOpen(false);
//     router.push("/login");
//   };
// 
//   const handleCategoryClick = (category) => {
//     const { id, name, slug } = category;
//     const typeKey = categoryToTypeMap[name];
// 
//     if (category.subcategories && category.subcategories.length > 0) {
//       setExpandedCategory(expandedCategory === id ? null : id);
//       return;
//     }
// 
//     setIsOpen(false);
// 
//     if (name === "GIFTS") {
//       router.push(`/gifts/`);
//     } else if (name === "SERVICES") {
//       router.push(`/services/`);
//     } else if (name === "OFFERS") {
//       router.push(`/offer`);
//     } else {
//       router.push(`/category/${slug}/`, {
//         state: {
//           categoryId: id,
//           categoryName: name,
//           typeKey: typeKey || "",
//           category_slug: slug,
//         },
//       });
//     }
//   };
// 
//   const handleSubcategoryClick = (category, subcategory) => {
//     setIsOpen(false);
//     router.push(`/${category.slug}/${subcategory.slug}/`, {
//       state: {
//         categoryId: category.id,
//         categoryName: category.name,
//         subcategoryId: subcategory.id,
//         subcategoryName: subcategory.name,
//         category_slug: category.slug,
//         subcategory_slug: subcategory.slug,
//       },
//     });
//   };
// 
//   const additionalLinks = [
//     { label: "Blog", path: "/blogs" },
//     { label: "Track Order", path: "/trackorder" },
//     { label: "Become A Franchise", path: "/franchise-enquiry" },
//     { label: "Contact Us", path: "/contact-us" },
//   ];
// 
//   return (
//     <>
//       <div>
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="p-2 focus:outline-none z-[1100] relative"
//           aria-label="Toggle Menu"
//         >
//           <FaBars className="text-2xl text-gray-700" />
//         </button>
// 
//         {isOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
//             onClick={() => setIsOpen(false)}
//           >
//             <div
//               className="bg-white w-3/4 max-w-xs shadow-lg h-full relative flex flex-col"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-5 border-b border-gray-100 bg-site-bg">
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex items-center gap-2 text-gray-800 font-semibold">
//                     <FaUser className="text-[#375421]" />
//                     {userName && userName !== "Guest" ? (
//                       <span
//                         className="cursor-pointer hover:text-[#375421]"
//                         onClick={handleUserNameClick}
//                       >
//                         {userName.slice(0, 8)}
//                       </span>
//                     ) : (
//                       <Link
//                         to="/login"
//                         className="hover:text-[#375421]"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         Login or Signup
//                       </Link>
//                     )}
//                   </div>
//                   <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
//                     <FaTimes className="text-xl" />
//                   </button>
//                 </div>
//               </div>
// 
//               <div className="flex-1 overflow-y-auto p-5">
//                 <div className="mb-8">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                     Shop Categories
//                   </h3>
// 
//                   {loading ? (
//                     <div className="animate-pulse space-y-3">
//                       {[1, 2, 3, 4].map((i) => (
//                         <div key={i} className="h-10 bg-gray-200 rounded"></div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="space-y-1">
//                       {categories.map((category) => (
//                         <div key={category.id}>
//                           <div
//                             onClick={() => handleCategoryClick(category)}
//                             className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50"
//                           >
//                             <span className="text-gray-700 font-medium group-hover:text-[#375421]">
//                               {category.name}
//                             </span>
//                             {category.subcategories && category.subcategories.length > 0 ? (
//                               <FaBars 
//                                 className={`text-gray-400 text-xs transition-transform duration-200 ${
//                                   expandedCategory === category.id ? 'rotate-0' : '-rotate-90'
//                                 }`} 
//                               />
//                             ) : (
//                               <FaBars className="text-gray-400 text-xs transform -rotate-90" />
//                             )}
//                           </div>
// 
//                           {expandedCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
//                             <div className="ml-4 mt-1 mb-2 space-y-1 bg-site-bg rounded-lg p-2">
//                               {category.subcategories.map((subcategory) => (
//                                 <div
//                                   key={subcategory.id}
//                                   onClick={() => handleSubcategoryClick(category, subcategory)}
//                                   className="flex items-center justify-between p-2 pl-4 rounded-lg hover:bg-white cursor-pointer transition-colors group"
//                                 >
//                                   <span className="text-gray-600 text-sm group-hover:text-[#375421]">
//                                     {subcategory.name}
//                                   </span>
//                                   {subcategory.product_count && (
//                                     <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
//                                       {subcategory.product_count}
//                                     </span>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
// 
//                 <div className="mb-6">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                     Information
//                   </h3>
//                   <div className="space-y-1">
//                     {additionalLinks.map((item, index) => (
//                       <Link
//                         key={index}
//                         to={item.path}
//                         onClick={() => setIsOpen(false)}
//                         className="block p-3 rounded-lg text-gray-600 hover:text-[#375421] hover:bg-site-bg transition-colors text-sm font-medium"
//                       >
//                         {item.label}
//                       </Link>
//                     ))}
// 
//                     <div
//                       onClick={navigateToSignup}
//                       className="block p-3 rounded-lg text-[#375421] font-bold hover:bg-green-50 transition-colors text-sm cursor-pointer"
//                     >
//                       Sign Up
//                     </div>
//                   </div>
//                 </div>
//               </div>
// 
//               {userName !== "Guest" && (
//                 <div className="p-4 border-t border-gray-100 bg-site-bg">
//                   <button
//                     onClick={handleLogoutClick}
//                     className="w-full py-2 px-4 bg-[#375421] text-white rounded-lg hover:bg-[#375421] hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
// 
//               <div className="p-6 border-t border-gray-100 bg-site-bg flex justify-center items-center space-x-6">
//                 <a href="https://www.facebook.com/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#375421] transition-colors">
//                   <FaFacebookF size={20} />
//                 </a>
//                 <a href="https://www.instagram.com/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#375421] transition-colors">
//                   <FaInstagram size={20} />
//                 </a>
//                 <a href="https://www.linkedin.com/company/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#375421] transition-colors">
//                   <FaLinkedin size={20} />
//                 </a>
//                 <a href="https://www.youtube.com/@thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#375421] transition-colors">
//                   <FaYoutube size={20} />
//                 </a>
//                 <a href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#375421] transition-colors">
//                   <FaWhatsapp size={20} />
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}
// 
//         {isLogoutDialogOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
//             <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
//               <h3 className="text-lg font-semibold mb-4">Logout</h3>
//               <div className="mb-4">
//                 <img src={LogoutGif} alt="Logout" className="mx-auto w-40" />
//               </div>
//               <p className="text-gray-700 mb-6">Are you sure you want to logout?</p>
//               <div className="flex justify-around">
//                 <button className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400" onClick={handleCancelLogout}>
//                   Cancel
//                 </button>
//                 <button className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600" onClick={handleLogoutConfirm}>
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
// 
// export default WithoutLoginHamburger;
