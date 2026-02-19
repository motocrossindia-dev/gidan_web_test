'use client';

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp
} from "react-icons/fa";
import axiosInstance from "../../../Axios/axiosInstance";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  // Map categories to type_choices
  const categoryToTypeMap = {
    PLANTS: "plant",
    POTS: "pot",
    SEEDS: "seed",
    "PLANT CARE": "plantcare",
  };

  // --- Data Fetching ---
  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(`/category/`);
      const data = response?.data?.data?.categories;
      if (data) {
        // Fetch subcategories for each category
        const categoriesWithSubs = await Promise.all(
          data.map(async (category) => {
            const subcategories = await getSubCategories(category.slug);
            return { ...category, subcategories };
          })
        );
        setCategories(categoriesWithSubs);
      }
    } catch (error) {} finally {
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

  // --- Handlers ---
  const handleLogoutClick = () => {
    // Add your logout logic here
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleCategoryClick = (category) => {
    const { id, name, slug } = category;
    const typeKey = categoryToTypeMap[name];

    // If category has subcategories, toggle expansion instead of navigating
    if (category.subcategories && category.subcategories.length > 0) {
      setExpandedCategory(expandedCategory === id ? null : id);
      return;
    }

    closeMenu();

    if (name === "GIFTS") {
      navigate(`/gifts/`);
    } else if (name === "SERVICES") {
      navigate(`/services/`);
    } else if (name === "OFFERS") {
      navigate(`/offer`);
    } else {
      // Clean URL structure
      navigate(`/${slug}/`, {
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
    closeMenu();
    const typeKey = categoryToTypeMap[category.name];
    navigate(`/${category.slug}/${subcategory.slug}/`, {
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
    { label: "My Account", path: "/orders" },
    { label: "Track Order", path: "/orders" },
    { label: "Services", path: "/services" },
    { label: "Become A Franchise", path: "/franchise-enquiry" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
      <div>
        {/* 1. Hamburger Button - Hide when menu is open */}
        {!isOpen && (
            <button
                onClick={toggleMenu}
                className="p-2 focus:outline-none z-[1100] relative"
                aria-label="Toggle Menu"
            >
              <FaBars className="text-2xl text-gray-700" />
            </button>
        )}

        {/* 2. Sidebar Overlay */}
        {isOpen && (
            <>
              {/* Backdrop */}
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-[1000] md:hidden"
                  onClick={closeMenu}
              ></div>

              {/* Sidebar Menu Container */}
              <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3 font-semibold text-gray-800">
                    <FaUser className="text-green-600" />
                    <span>My Account</span>
                  </div>
                  <button aria-label="Button"
                          className="text-gray-600 hover:text-red-500 transition-colors text-sm flex items-center gap-2"
                          onClick={handleLogoutClick}
                  >
                    <span>Logout</span>
                    <FaSignOutAlt />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5">

                  {/* DYNAMIC CATEGORIES SECTION (List Only) */}
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                      Shop Categories
                    </h3>

                    {loading ? (
                        <div className="animate-pulse space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="h-10 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                    ) : (
                        <div className="space-y-1">
                          {categories.map((category) => (
                              <div key={category.id}>
                                {/* Main Category */}
                                <div
                                    onClick={() => handleCategoryClick(category)}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50"
                                >
                                  <span className="text-gray-700 font-medium group-hover:text-green-700">
                                    {category.name}
                                  </span>
                                  {category.subcategories && category.subcategories.length > 0 ? (
                                      <FaBars 
                                        className={`text-gray-700 text-xs transition-transform duration-200 ${
                                          expandedCategory === category.id ? 'rotate-0' : '-rotate-90'
                                        }`} 
                                      />
                                  ) : (
                                      <FaBars className="text-gray-700 text-xs transform -rotate-90" />
                                  )}
                                </div>

                                {/* Subcategories Dropdown */}
                                {expandedCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
                                    <div className="ml-4 mt-1 mb-2 space-y-1 bg-gray-50 rounded-lg p-2">
                                      {category.subcategories.map((subcategory) => (
                                          <div
                                              key={subcategory.id}
                                              onClick={() => handleSubcategoryClick(category, subcategory)}
                                              className="flex items-center justify-between p-2 pl-4 rounded-lg hover:bg-white cursor-pointer transition-colors group"
                                          >
                                            <span className="text-gray-600 text-sm group-hover:text-green-700">
                                              {subcategory.name}
                                            </span>
                                            {subcategory.product_count && (
                                              <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
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

                  {/* ADDITIONAL LINKS SECTION */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                      Information
                    </h3>
                    <div className="space-y-1">
                      {additionalLinks.map((item, index) => (
                          <Link
                              key={index}
                              to={item.path}
                              onClick={closeMenu}
                              className="block p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            {item.label}
                          </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SOCIAL MEDIA FOOTER */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-center items-center space-x-6">
                    <a
                        href="https://www.facebook.com/thegidanstore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-green-500 transition-colors"
                    >
                      <FaFacebookF size={20} />
                    </a>
                    <a
                        href="https://www.instagram.com/thegidanstore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-green-500 transition-colors"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/thegidanstore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-green-500 transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a
                        href="https://www.youtube.com/@thegidanstore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-green-500 transition-colors"
                    >
                      <FaYoutube size={20} />
                    </a>
                    <a
                        href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-green-500 transition-colors"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </>
        )}
      </div>
  );
};

export default Hamburger;
// ================old==========
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaBars,
//   FaUser,
//   FaSignOutAlt,
//   FaTimes,
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedin,
//   FaYoutube,
//   FaWhatsapp
// } from "react-icons/fa";
// import axiosInstance from "../../../Axios/axiosInstance";
//
// const Hamburger = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//
//   // Map categories to type_choices
//   const categoryToTypeMap = {
//     PLANTS: "plant",
//     POTS: "pot",
//     SEEDS: "seed",
//     "PLANT CARE": "plantcare",
//   };
//
//   // --- Data Fetching ---
//   const getCategories = async () => {
//     try {
//       const response = await axiosInstance.get(`/category/`);
//       const data = response?.data?.data?.categories;
//       if (data) {
//         setCategories(data);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     getCategories();
//   }, []);
//
//   // --- Handlers ---
//   const handleLogoutClick = () => {
//     // Add your logout logic here
//     setIsOpen(false);
//   };
//
//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
//
//   const closeMenu = () => {
//     setIsOpen(false);
//   };
//
//   const handleCategoryClick = (category) => {
//     const { id, name, slug } = category;
//     const typeKey = categoryToTypeMap[name];
//
//     closeMenu();
//
//     if (name === "GIFTS") {
//       navigate(`/gifts/`);
//     } else if (name === "SERVICES") {
//       navigate(`/services/`);
//     } else if (name === "OFFERS") {
//       navigate(`/offer`);
//     } else {
//       navigate(`/category/${slug}/`, {
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
//   const additionalLinks = [
//     { label: "My Account", path: "/orders" },
//     { label: "Track Order", path: "/orders" },
//     { label: "Services", path: "/services" },
//     { label: "Become A Franchise", path: "/franchise-enquiry" },
//     { label: "Contact Us", path: "/contact-us" },
//     { label: "FAQ", path: "/faq" },
//   ];
//
//   return (
//       <div>
//         {/* 1. Hamburger Button */}
//         <button
//             onClick={toggleMenu}
//             className="p-2 focus:outline-none z-[1100] relative"
//             aria-label="Toggle Menu"
//         >
//           {isOpen ? <FaTimes className="text-2xl text-gray-700" /> : <FaBars className="text-2xl text-gray-700" />}
//         </button>
//
//         {/* 2. Sidebar Overlay */}
//         {isOpen && (
//             <>
//               {/* Backdrop */}
//               <div
//                   className="fixed inset-0 bg-black bg-opacity-50 z-[1000] md:hidden"
//                   onClick={closeMenu}
//               ></div>
//
//               {/* Sidebar Menu Container */}
//               <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden flex flex-col">
//
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
//                   <div className="flex items-center gap-3 font-semibold text-gray-800">
//                     <FaUser className="text-green-600" />
//                     <span>My Account</span>
//                   </div>
//                   <button
//                       className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center gap-2"
//                       onClick={handleLogoutClick}
//                   >
//                     <span>Logout</span>
//                     <FaSignOutAlt />
//                   </button>
//                 </div>
//
//                 {/* Scrollable Content */}
//                 <div className="flex-1 overflow-y-auto p-5">
//
//                   {/* DYNAMIC CATEGORIES SECTION (List Only) */}
//                   <div className="mb-8">
//                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                       Shop Categories
//                     </h3>
//
//                     {loading ? (
//                         <div className="animate-pulse space-y-3">
//                           {[1, 2, 3, 4].map((i) => (
//                               <div key={i} className="h-10 bg-gray-200 rounded"></div>
//                           ))}
//                         </div>
//                     ) : (
//                         <div className="space-y-1">
//                           {categories.map((category) => (
//                               <div
//                                   key={category.id}
//                                   onClick={() => handleCategoryClick(category)}
//                                   className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
//                               >
//                         <span className="text-gray-700 font-medium group-hover:text-green-700">
//                           {category.name}
//                         </span>
//                                 {/* Arrow Icon indicating navigation */}
//                                 <FaBars className="text-gray-300 text-xs transform -rotate-90" />
//                               </div>
//                           ))}
//                         </div>
//                     )}
//                   </div>
//
//                   {/* ADDITIONAL LINKS SECTION */}
//                   <div>
//                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                       Information
//                     </h3>
//                     <div className="space-y-1">
//                       {additionalLinks.map((item, index) => (
//                           <Link
//                               key={index}
//                               to={item.path}
//                               onClick={closeMenu}
//                               className="block p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors text-sm font-medium"
//                           >
//                             {item.label}
//                           </Link>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//
//                 {/* SOCIAL MEDIA FOOTER */}
//                 <div className="p-6 border-t border-gray-100 bg-gray-50">
//                   <div className="flex justify-center items-center space-x-6">
//                     <a
//                         href="https://www.facebook.com/thegidanstore/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-black hover:text-green-500 transition-colors"
//                     >
//                       <FaFacebookF size={20} />
//                     </a>
//                     <a
//                         href="https://www.instagram.com/thegidanstore/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-black hover:text-green-500 transition-colors"
//                     >
//                       <FaInstagram size={20} />
//                     </a>
//                     <a
//                         href="https://www.linkedin.com/company/thegidanstore/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-black hover:text-green-500 transition-colors"
//                     >
//                       <FaLinkedin size={20} />
//                     </a>
//                     <a
//                         href="https://www.youtube.com/@thegidanstore/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-black hover:text-green-500 transition-colors"
//                     >
//                       <FaYoutube size={20} />
//                     </a>
//                     <a
//                         href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-black hover:text-green-500 transition-colors"
//                     >
//                       <FaWhatsapp size={20} />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </>
//         )}
//       </div>
//   );
// };
//
// export default Hamburger;