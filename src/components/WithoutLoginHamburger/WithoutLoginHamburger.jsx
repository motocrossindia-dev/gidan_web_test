'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
import axiosInstance from "../../Axios/axiosInstance";
import __LogoutGif from "../../Assets/logout.gif";
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
    "PLANT CARE": "plantcare",
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
    router.push("/mobilesidebar");
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
      router.push(`/gifts/`);
    } else if (name === "SERVICES") {
      router.push(`/services/`);
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
    { label: "Blog", path: "/blogcomponent" },
    { label: "Track Order", path: "/trackorder" },
    { label: "Become A Franchise", path: "/franchise-enquiry" },
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white w-3/4 max-w-xs shadow-lg h-full relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <FaUser className="text-green-600" />
                    {userName && userName !== "Guest" ? (
                      <span
                        className="cursor-pointer hover:text-green-700"
                        onClick={handleUserNameClick}
                      >
                        {userName.slice(0, 8)}
                      </span>
                    ) : (
                      <Link
                        href="/mobile-signin"
                        className="hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                      >
                        Login or Signup
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* CATEGORIES */}
                <div className="py-2">
                  {loading ? (
                    <div className="px-4 space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {categories.map((category) => (
                        <div key={category.id}>
                          {/* Main Category */}
                          <div
                            onClick={() => handleCategoryClick(category)}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                          >
                            <span className="text-gray-800 font-medium text-sm uppercase">
                              {category.name}
                            </span>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <FaChevronRight
                                className={`text-gray-400 text-xs transition-transform duration-200 ${
                                  expandedCategory === category.id ? 'rotate-90' : ''
                                }`}
                              />
                            )}
                          </div>

                          {/* Subcategories */}
                          {expandedCategory === category.id &&
                            category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="bg-gray-50 border-b border-gray-100">
                                {category.subcategories.map((subcategory) => (
                                  <div
                                    key={subcategory.id}
                                    onClick={() => handleSubcategoryClick(category, subcategory)}
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
                                  </div>
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
                  <div className="px-4 py-2 bg-gray-50">
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
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm border-b border-gray-100"
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
                        className="block px-4 py-3 text-green-600 font-semibold hover:bg-gray-50 transition-colors text-sm cursor-pointer border-b border-gray-100"
                      >
                        Sign Up
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {userName !== "Guest" && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Social Media Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-center items-center space-x-6">
                  <a
                    href="https://www.facebook.com/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href="https://www.youtube.com/@thegidanstore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaYoutube size={18} />
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
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
//     { label: "Blog", path: "/blogcomponent" },
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
//               <div className="p-5 border-b border-gray-100 bg-gray-50">
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex items-center gap-2 text-gray-800 font-semibold">
//                     <FaUser className="text-green-600" />
//                     {userName && userName !== "Guest" ? (
//                       <span
//                         className="cursor-pointer hover:text-green-700"
//                         onClick={handleUserNameClick}
//                       >
//                         {userName.slice(0, 8)}
//                       </span>
//                     ) : (
//                       <Link
//                         to="/mobile-signin"
//                         className="hover:text-green-700"
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
//                             <span className="text-gray-700 font-medium group-hover:text-green-700">
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
//                             <div className="ml-4 mt-1 mb-2 space-y-1 bg-gray-50 rounded-lg p-2">
//                               {category.subcategories.map((subcategory) => (
//                                 <div
//                                   key={subcategory.id}
//                                   onClick={() => handleSubcategoryClick(category, subcategory)}
//                                   className="flex items-center justify-between p-2 pl-4 rounded-lg hover:bg-white cursor-pointer transition-colors group"
//                                 >
//                                   <span className="text-gray-600 text-sm group-hover:text-green-700">
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
//                         className="block p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors text-sm font-medium"
//                       >
//                         {item.label}
//                       </Link>
//                     ))}
// 
//                     <div
//                       onClick={navigateToSignup}
//                       className="block p-3 rounded-lg text-green-600 font-bold hover:bg-green-50 transition-colors text-sm cursor-pointer"
//                     >
//                       Sign Up
//                     </div>
//                   </div>
//                 </div>
//               </div>
// 
//               {userName !== "Guest" && (
//                 <div className="p-4 border-t border-gray-100 bg-gray-50">
//                   <button
//                     onClick={handleLogoutClick}
//                     className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
// 
//               <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center items-center space-x-6">
//                 <a href="https://www.facebook.com/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-green-500 transition-colors">
//                   <FaFacebookF size={20} />
//                 </a>
//                 <a href="https://www.instagram.com/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-green-500 transition-colors">
//                   <FaInstagram size={20} />
//                 </a>
//                 <a href="https://www.linkedin.com/company/thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-green-500 transition-colors">
//                   <FaLinkedin size={20} />
//                 </a>
//                 <a href="https://www.youtube.com/@thegidanstore/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-green-500 transition-colors">
//                   <FaYoutube size={20} />
//                 </a>
//                 <a href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-green-500 transition-colors">
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
