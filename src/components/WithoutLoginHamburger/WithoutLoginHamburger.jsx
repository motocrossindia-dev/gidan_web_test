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
} from "react-icons/fa";

const WithoutLoginHamburger = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const username = useSelector((state) => state.user.username || "Guest");
  const [userName, setUserName] = useState("Guest");
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(`/category/`);
      const data = response?.data?.data?.categories;
      if (data) {
        const categoriesWithSubs = await Promise.all(
          data.map(async (category) => {
            const subcategories = await getSubCategories(category.slug);
            return { ...category, subcategories };
          })
        );
        setCategories(categoriesWithSubs);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubCategories = async (categorySlug) => {
    try {
      const response = await axiosInstance.get(
        `/category/categoryWiseSubCategory/${categorySlug}/`
      );
      if (response.status === 200) {
        return response?.data?.data?.subCategorys || [];
      }
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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
    router.push("/mobile-signin");
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
            className="fixed inset-0 bg-black/50 z-[11010] flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white w-[85%] max-w-[320px] shadow-2xl h-full relative flex flex-col animate-slide-in-right transform transition-transform duration-300 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="p-5 bg-[#375421] text-white">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <FaUser className="text-xl" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs opacity-80">Welcome,</span>
                        {userName && userName !== "Guest" ? (
                          <span
                            className="font-bold text-sm cursor-pointer hover:underline"
                            onClick={handleUserNameClick}
                          >
                            {userName}
                          </span>
                        ) : (
                          <Link
                            href="/mobile-signin"
                            className="font-bold text-sm"
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
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Categories & Links Section - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white">
                  {loading ? (
                    <div className="p-4 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {categories.filter((category) => category.name !== "SERVICES").map((category) => (
                        <div key={category.id}>
                          {/* Main Category */}
                          <Link
                            href={
                              category.name === "GIFTS" ? "/gift/" :
                                category.name === "OFFERS" ? "/offer/" :
                                    `/${category.slug}/`
                            }
                            onClick={(e) => {
                              if (category.subcategories && category.subcategories.length > 0) {
                                e.preventDefault();
                                e.stopPropagation();
                                setExpandedCategory(expandedCategory === category.id ? null : category.id);
                              } else {
                                setIsOpen(false);
                              }
                            }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-site-bg cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <span className="text-gray-800 font-medium text-sm">
                              {category.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                            </span>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <FaChevronRight
                                className={`text-gray-400 text-xs transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-90' : ''
                                  }`}
                              />
                            )}
                          </Link>

                          {/* Subcategories */}
                          {expandedCategory === category.id &&
                            category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="bg-site-bg border-b border-gray-100">
                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/${category.slug}/${subcategory.slug}/`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between px-8 py-2 hover:bg-white cursor-pointer transition-colors"
                                  >
                                    <span className="text-gray-600 text-sm">
                                      {subcategory.name}
                                    </span>
                                    {subcategory.product_count && (
                                      <span className="text-xs text-gray-400">
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
                  )}
                </div>

                {/* INFORMATION SECTION */}
                <div className="border-t border-gray-200 mt-2">
                  <div className="px-4 py-2 bg-site-bg">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Information
                    </h3>
                  </div>
                  <div>
                    {additionalLinks.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                        className="block px-4 py-3 text-gray-700 hover:bg-site-bg transition-colors text-sm border-b border-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {/* Only show Sign Up when user is NOT logged in */}
                    {userName === "Guest" && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToSignup();
                        }}
                        className="block px-4 py-3 text-[#375421] font-semibold hover:bg-site-bg transition-colors text-sm cursor-pointer border-b border-gray-100"
                      >
                        Sign Up
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {userName !== "Guest" && (
                <div className="p-4 border-t border-gray-200 bg-site-bg">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-2 px-4 bg-[#375421] text-white rounded-lg hover:bg-[#375421] hover:text-white transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Social Media Footer */}
              <div className="p-4 border-t border-gray-200 bg-site-bg">
                <div className="flex justify-center items-center space-x-6">
                  <a
                    href="https://www.facebook.com/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#375421] transition-colors"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#375421] transition-colors"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#375421] transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href="https://www.youtube.com/@thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#375421] transition-colors"
                  >
                    <FaYoutube size={18} />
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#375421] transition-colors"
                  >
                    <FaWhatsapp size={18} />
                  </a>
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
//     router.push("/mobile-signin");
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
//                         to="/mobile-signin"
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
