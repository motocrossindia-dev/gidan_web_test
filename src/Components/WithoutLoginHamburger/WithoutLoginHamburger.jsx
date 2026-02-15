import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
import axiosInstance from "../../Axios/axiosInstance";
import LogoutGif from "../../Assets/logout.gif"; // Ensure this path is correct

// React Icons
import {
  FaBars,
  FaUser,
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const WithoutLoginHamburger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const username = useSelector((state) => state.user.username || "Guest");
  const [userName, setUserName] = useState("Guest");

  // Local UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map categories to type_choices (Consistent with other components)
  const categoryToTypeMap = {
    PLANTS: "plant",
    POTS: "pot",
    SEEDS: "seed",
    "PLANT CARE": "plantcare",
  };

  // --- Handlers ---
  useEffect(() => {
    if (username) {
      setUserName(username);
    }
  }, [username]);

  // Scroll Lock Logic
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

  // --- NEW: Auto-switch to Signup tab when on /mobile-signin ---
  useEffect(() => {
    if (window.location.pathname === "/mobile-signin") {
      // Small delay to ensure the DOM elements are rendered
      const timer = setTimeout(() => {
        const signupBtn = document.getElementById("auth-tab-signup");
        if (signupBtn) {
          signupBtn.click();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // --- Data Fetching ---
  const getCategories = async () => {
    try {
      const response = await axiosInstance.get(`/category/`);
      const data = response?.data?.data?.categories;
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
    navigate("/");
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleUserNameClick = () => {
    setIsOpen(false);
    navigate("/mobilesidebar");
  };

  // --- NEW: Handle Signup Click ---
  const navigateToSignup = () => {
    setIsOpen(false); // Close sidebar
    navigate("/mobile-signin"); // Navigate to sign in page
    // The useEffect above will handle clicking the signup tab
  };

  const handleCategoryClick = (category) => {
    setIsOpen(false);
    const { id, name, slug } = category;
    const typeKey = categoryToTypeMap[name];

    if (name === "GIFTS") {
      navigate(`/gifts/`);
    } else if (name === "SERVICES") {
      navigate(`/services/`);
    } else if (name === "OFFERS") {
      navigate(`/offer`);
    } else {
      navigate(`/category/${slug}/`, {
        state: {
          categoryId: id,
          categoryName: name,
          typeKey: typeKey || "",
          category_slug: slug,
        },
      });
    }
  };

  // Static Additional Links
  const additionalLinks = [
    { label: "Blog", path: "/blogcomponent" },
    { label: "Track Order", path: "/trackorder" },
    { label: "Become A Franchise", path: "/franchise-enquiry" },
    { label: "Contact Us", path: "/contact-us" },
  ];

  return (
      <>
        <div>
          {/* Hamburger Button */}
          <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none z-[1100] relative"
              aria-label="Toggle Menu"
          >
            <FaBars className="text-2xl text-gray-700" />
          </button>

          {/* Sidebar Menu */}
          {isOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
                  onClick={() => setIsOpen(false)}
              >
                {/* Sidebar content */}
                <div
                    className="bg-white w-3/4 max-w-xs shadow-lg h-full relative flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
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
                                to="/mobile-signin"
                                className="hover:text-green-700"
                                onClick={() => setIsOpen(false)}
                            >
                              Login or Signup
                            </Link>
                        )}
                      </div>
                      <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
                        <FaTimes className="text-xl" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {/* DYNAMIC CATEGORIES */}
                    <div className="mb-8">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
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
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
                                >
                          <span className="text-gray-700 font-medium group-hover:text-green-700">
                            {category.name}
                          </span>
                                  <FaBars className="text-gray-300 text-xs transform -rotate-90" />
                                </div>
                            ))}
                          </div>
                      )}
                    </div>

                    {/* ADDITIONAL LINKS */}
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Information
                      </h3>
                      <div className="space-y-1">
                        {additionalLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                              {item.label}
                            </Link>
                        ))}

                        {/* NEW SIGN UP LINK */}
                        <div
                            onClick={navigateToSignup}
                            className="block p-3 rounded-lg text-green-600 font-bold hover:bg-green-50 transition-colors text-sm cursor-pointer"
                        >
                          Sign Up
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button (Only if logged in) */}
                  {userName !== "Guest" && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={handleLogoutClick}
                            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          Logout
                        </button>
                      </div>
                  )}

                  {/* SOCIAL MEDIA FOOTER */}
                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center items-center space-x-6">
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
          )}

          {/* Logout Confirmation Dialog */}
          {isLogoutDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
                  <h3 className="text-lg font-semibold mb-4">Logout</h3>
                  <div className="mb-4">
                    <img src={LogoutGif} alt="Logout" className="mx-auto w-40" />
                  </div>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to logout?
                  </p>
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
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../redux/Slice/userSlice";
// import axiosInstance from "../../Axios/axiosInstance";
// import LogoutGif from "../../Assets/logout.gif"; // Ensure this path is correct
//
// // React Icons
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
//   const navigate = useNavigate();
//
//   // Redux State
//   const username = useSelector((state) => state.user.username || "Guest");
//   const [userName, setUserName] = useState("Guest");
//
//   // Local UI State
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   // Map categories to type_choices (Consistent with other components)
//   const categoryToTypeMap = {
//     PLANTS: "plant",
//     POTS: "pot",
//     SEEDS: "seed",
//     "PLANT CARE": "plantcare",
//   };
//
//   // --- Handlers ---
//   useEffect(() => {
//     if (username) {
//       setUserName(username);
//     }
//   }, [username]);
//
//   // Scroll Lock Logic
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
//     navigate("/");
//   };
//
//   const handleCancelLogout = () => {
//     setIsLogoutDialogOpen(false);
//   };
//
//   const handleUserNameClick = () => {
//     setIsOpen(false);
//     navigate("/mobilesidebar");
//   };
//
//   const handleCategoryClick = (category) => {
//     setIsOpen(false);
//     const { id, name, slug } = category;
//     const typeKey = categoryToTypeMap[name];
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
//   // Static Additional Links (Kept from original)
//   const additionalLinks = [
//     { label: "Blog", path: "/blogcomponent" },
//     { label: "Track Order", path: "/trackorder" },
//     // { label: "Services", path: "/services" },
//     { label: "Become A Franchise", path: "/franchise-enquiry" },
//     { label: "Contact Us", path: "/contact-us" },
//   ];
//
//   return (
//       <>
//         <div>
//           {/* Hamburger Button */}
//           <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 focus:outline-none z-[1100] relative"
//               aria-label="Toggle Menu"
//           >
//             <FaBars className="text-2xl text-gray-700" />
//           </button>
//
//           {/* Sidebar Menu */}
//           {isOpen && (
//               <div
//                   className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
//                   onClick={() => setIsOpen(false)}
//               >
//                 {/* Sidebar content */}
//                 <div
//                     className="bg-white w-3/4 max-w-xs shadow-lg h-full relative flex flex-col"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                   {/* Header */}
//                   <div className="p-5 border-b border-gray-100 bg-gray-50">
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center gap-2 text-gray-800 font-semibold">
//                         <FaUser className="text-green-600" />
//                         {userName && userName !== "Guest" ? (
//                             <span
//                                 className="cursor-pointer hover:text-green-700"
//                                 onClick={handleUserNameClick}
//                             >
//                       {userName.slice(0, 8)}
//                     </span>
//                         ) : (
//                             <Link
//                                 to="/mobile-signin"
//                                 className="hover:text-green-700"
//                                 onClick={() => setIsOpen(false)}
//                             >
//                               Login or Signup
//                             </Link>
//                         )}
//                       </div>
//                       <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500">
//                         <FaTimes className="text-xl" />
//                       </button>
//                     </div>
//                   </div>
//
//                   {/* Scrollable Content */}
//                   <div className="flex-1 overflow-y-auto p-5">
//
//                     {/* DYNAMIC CATEGORIES (List Only) */}
//                     <div className="mb-8">
//                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                         Shop Categories
//                       </h3>
//
//                       {loading ? (
//                           <div className="animate-pulse space-y-3">
//                             {[1, 2, 3, 4].map((i) => (
//                                 <div key={i} className="h-10 bg-gray-200 rounded"></div>
//                             ))}
//                           </div>
//                       ) : (
//                           <div className="space-y-1">
//                             {categories.map((category) => (
//                                 <div
//                                     key={category.id}
//                                     onClick={() => handleCategoryClick(category)}
//                                     className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
//                                 >
//                         <span className="text-gray-700 font-medium group-hover:text-green-700">
//                           {category.name}
//                         </span>
//                                   <FaBars className="text-gray-300 text-xs transform -rotate-90" />
//                                 </div>
//                             ))}
//                           </div>
//                       )}
//                     </div>
//
//                     {/* ADDITIONAL LINKS */}
//                     <div>
//                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
//                         Information
//                       </h3>
//                       <div className="space-y-1">
//                         {additionalLinks.map((item, index) => (
//                             <Link
//                                 key={index}
//                                 to={item.path}
//                                 onClick={() => setIsOpen(false)}
//                                 className="block p-3 rounded-lg text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors text-sm font-medium"
//                             >
//                               {item.label}
//                             </Link>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//
//                   {/* Logout Button (Only if logged in) */}
//                   {userName !== "Guest" && (
//                       <div className="p-4 border-t border-gray-100 bg-gray-50">
//                         <button
//                             onClick={handleLogoutClick}
//                             className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                   )}
//
//                   {/* SOCIAL MEDIA FOOTER */}
//                   <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center items-center space-x-6">
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
//           )}
//
//           {/* Logout Confirmation Dialog */}
//           {isLogoutDialogOpen && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1100]">
//                 <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
//                   <h3 className="text-lg font-semibold mb-4">Logout</h3>
//                   <div className="mb-4">
//                     <img src={LogoutGif} alt="Logout" className="mx-auto w-40" />
//                   </div>
//                   <p className="text-gray-700 mb-6">
//                     Are you sure you want to logout?
//                   </p>
//                   <div className="flex justify-around">
//                     <button
//                         className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400"
//                         onClick={handleCancelLogout}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                         className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
//                         onClick={handleLogoutConfirm}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//           )}
//         </div>
//
//       </>
//
//   );
// };
//
// export default WithoutLoginHamburger;
// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
// import {
//   faInstagram,
//   faFacebook,
//   faLinkedin,
//   faYoutube,
// } from "@fortawesome/free-brands-svg-icons";
// import { Link, useNavigate } from "react-router-dom";
// import LogoutGif from "../../Assets/logout.gif"; // Ensure this path is correct
// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { logout } from "../../redux/Slice/userSlice";
// const WithoutLoginHamburger = () => {
//   const dispatch = useDispatch()
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
// const username = useSelector((state) => state.user.username || "Guest");
// const [userName, setUserName] = useState('Guest');
// const navigate = useNavigate();
//
// useEffect(() => {
//   if (username) {
//     setUserName(username);
//   }
// }, [username]);
//
//
// useEffect(() => {
//   // Disable scroll when sidebar or logout dialog is open
//   if (isOpen || isLogoutDialogOpen) {
//     document.body.style.overflow = 'hidden';
//   } else {
//     document.body.style.overflow = 'auto';
//   }
//
//   return () => {
//     document.body.style.overflow = 'auto';
//   };
// }, [isOpen, isLogoutDialogOpen]);
//
//
//
//
//   const handleLogoutClick = () => {
//     setIsOpen(false);
//     setIsLogoutDialogOpen(true);
//   };
//
//
//   const handleLogoutConfirm = () => {
//     // Perform logout operations
//     localStorage.removeItem("userData");
//     dispatch(logout());
//
//     // setUserName(''); // Clear the userName state
//     setIsLogoutDialogOpen(false);
//     navigate("/"); // Navigate to home page after logout
//   };
//
//   const handleCancelLogout = () => {
//     setIsLogoutDialogOpen(false);
//   };
//
//   const handleUserNameClick = () => {
//     setIsOpen(false);
//     navigate("/mobilesidebar"); // Navigate to MobileSidebar
//   };
//
//   return (
//     <div>
//       {/* Hamburger Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="p-2">
//         <FontAwesomeIcon icon={faBars} className="text-2xl" />
//       </button>
//
//       {/* Sidebar Menu */}
// {isOpen && (
//   <div
//     className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
//     onClick={() => setIsOpen(false)} // clicking outside closes the sidebar
//   >
//     {/* Sidebar content - prevent closing when clicking inside */}
//     <div
//       className="bg-white p-4 w-3/4 max-w-xs shadow-lg h-full relative"
//       onClick={(e) => e.stopPropagation()} // prevent click from bubbling to overlay
//     >
//       {/* Cancel Icon */}
//       <button
//         onClick={() => setIsOpen(false)}
//         className="absolute top-4 right-4 text-xl"
//       >
//         <FontAwesomeIcon icon={faXmark} />
//       </button>
//
//       {/* Account Section */}
//       <div className="flex items-center justify-start mb-8">
//         <FontAwesomeIcon icon={faUser} className="text-gray-700" />
//         {userName && userName !== 'Guest' ? (
//           <span
//             className="ml-2 text-black flex items-center justify-start cursor-pointer"
//             onClick={handleUserNameClick}
//           >
//             {userName.slice(0, 8)}
//           </span>
//         ) : (
//           <Link
//             to="/mobile-signin"
//             className="ml-2 text-black flex items-center justify-start"
//             onClick={() => setIsOpen(false)}
//           >
//             Login or Signup
//           </Link>
//         )}
// {/* {userName && userName !== 'Guest' ? (
//   <span
//     className="ml-2 text-black flex items-center justify-start cursor-pointer"
//     onClick={handleUserNameClick}
//   >
//     {userName.slice(0, 8)}
//   </span>
// ) : (
//   <span
//     className="ml-2 text-black flex items-center justify-start cursor-pointer"
//     onClick={() => {
//       setIsOpen(false);
//       navigate("/mobile-signin");
//     }}
//   >
//     Login or Signup
//   </span>
// )} */}
//
//       </div>
//
//       {/* Menu Links */}
//       <div className="space-y-2">
//         <Link onClick={() => setIsOpen(false)} to="/" className="block border-b pb-2">HOME</Link>
//         <Link onClick={() => setIsOpen(false)} to="/filter/19" className="block border-b pb-2">PLANTS</Link>
//         <Link onClick={() => setIsOpen(false)} to="/filter/20" className="block border-b pb-2">POTS & PLANTERS</Link>
//         <Link onClick={() => setIsOpen(false)} to="/filter/21" className="block border-b pb-2">SEEDS</Link>
//         <Link onClick={() => setIsOpen(false)} to="/gifts" className="block border-b pb-2">GIFTING</Link>
//         <Link onClick={() => setIsOpen(false)} to="/offer" className="block border-b pb-2">Offers</Link>
//       </div>
//
//       {/* Additional Links */}
//       <div className="space-y-2 mt-6 text-gray-400">
//         <Link onClick={() => setIsOpen(false)} to="/blogcomponent" className="block">Blog</Link>
//         <Link onClick={() => setIsOpen(false)} to="/trackorder" className="block">Track Order</Link>
//         <Link onClick={() => setIsOpen(false)} to="/services" className="block">Services</Link>
//         <Link onClick={() => setIsOpen(false)} to="/franchise-enquiry" className="block">Become A Franchise</Link>
//         <Link onClick={() => setIsOpen(false)} to="/contact-us" className="block">Contact Us</Link>
//       </div>
//
//       {/* Logout Button */}
//       {userName !== 'Guest' && (
//         <div className="mt-4">
//           <button
//             onClick={handleLogoutClick}
//             className="w-full py-2 px-4 bg-bio-green border rounded-lg text-black"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//
//       {/* Social Media Icons */}
//       <div className="flex items-center justify-center mt-8 space-x-6">
//         <Link to="https://www.facebook.com/biotechmaali">
//           <FontAwesomeIcon icon={faFacebook} className="text-xl text-gray-600" />
//         </Link>
//         <Link to="https://www.instagram.com/biotechmaali/">
//           <FontAwesomeIcon icon={faInstagram} className="text-xl text-gray-600" />
//         </Link>
//         <Link to="https://www.linkedin.com/company/biotechmaali/">
//           <FontAwesomeIcon icon={faLinkedin} className="text-xl text-gray-600" />
//         </Link>
//         <Link to="https://www.youtube.com/@biotechmaali">
//           <FontAwesomeIcon icon={faYoutube} className="text-xl text-gray-600" />
//         </Link>
//       </div>
//     </div>
//   </div>
// )}
//
//
//       {/* Logout Confirmation Dialog */}
//       {isLogoutDialogOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
//             <h3 className="text-lg font-semibold mb-4">Logout</h3>
//             <div className="mb-4">
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
//                 className="bg-red-500 px-4 py-2  rounded text-white hover:bg-red-600"
//                 onClick={handleLogoutConfirm}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default WithoutLoginHamburger;