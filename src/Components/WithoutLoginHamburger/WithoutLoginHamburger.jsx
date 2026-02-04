import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import LogoutGif from "../../Assets/logout.gif"; // Ensure this path is correct
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slice/userSlice";
const WithoutLoginHamburger = () => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
const username = useSelector((state) => state.user.username || "Guest");
const [userName, setUserName] = useState('Guest');
const navigate = useNavigate();

useEffect(() => {
  if (username) {
    setUserName(username);
  }
}, [username]);


useEffect(() => {
  // Disable scroll when sidebar or logout dialog is open
  if (isOpen || isLogoutDialogOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return () => {
    document.body.style.overflow = 'auto';
  };
}, [isOpen, isLogoutDialogOpen]);




  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutDialogOpen(true);
  };


  const handleLogoutConfirm = () => {
    // Perform logout operations
    localStorage.removeItem("userData");
    dispatch(logout());
    
    // setUserName(''); // Clear the userName state
    setIsLogoutDialogOpen(false);
    navigate("/"); // Navigate to home page after logout
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleUserNameClick = () => {
    setIsOpen(false);
    navigate("/mobilesidebar"); // Navigate to MobileSidebar
  };

  return (
    <div>
      {/* Hamburger Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        <FontAwesomeIcon icon={faBars} className="text-2xl" />
      </button>

      {/* Sidebar Menu */}
{isOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
    onClick={() => setIsOpen(false)} // clicking outside closes the sidebar
  >
    {/* Sidebar content - prevent closing when clicking inside */}
    <div
      className="bg-white p-4 w-3/4 max-w-xs shadow-lg h-full relative"
      onClick={(e) => e.stopPropagation()} // prevent click from bubbling to overlay
    >
      {/* Cancel Icon */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-xl"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      {/* Account Section */}
      <div className="flex items-center justify-start mb-8">
        <FontAwesomeIcon icon={faUser} className="text-gray-700" />
        {userName && userName !== 'Guest' ? (
          <span
            className="ml-2 text-black flex items-center justify-start cursor-pointer"
            onClick={handleUserNameClick}
          >
            {userName.slice(0, 8)}
          </span>
        ) : (
          <Link
            to="/mobile-signin"
            className="ml-2 text-black flex items-center justify-start"
            onClick={() => setIsOpen(false)}
          >
            Login or Signup
          </Link>
        )}
{/* {userName && userName !== 'Guest' ? (
  <span
    className="ml-2 text-black flex items-center justify-start cursor-pointer"
    onClick={handleUserNameClick}
  >
    {userName.slice(0, 8)}
  </span>
) : (
  <span
    className="ml-2 text-black flex items-center justify-start cursor-pointer"
    onClick={() => {
      setIsOpen(false);
      navigate("/mobile-signin");
    }}
  >
    Login or Signup
  </span>
)} */}

      </div>

      {/* Menu Links */}
      <div className="space-y-2">
        <Link onClick={() => setIsOpen(false)} to="/" className="block border-b pb-2">HOME</Link>
        <Link onClick={() => setIsOpen(false)} to="/filter/19" className="block border-b pb-2">PLANTS</Link>
        <Link onClick={() => setIsOpen(false)} to="/filter/20" className="block border-b pb-2">POTS & PLANTERS</Link>
        <Link onClick={() => setIsOpen(false)} to="/filter/21" className="block border-b pb-2">SEEDS</Link>
        <Link onClick={() => setIsOpen(false)} to="/gifts" className="block border-b pb-2">GIFTING</Link>
        <Link onClick={() => setIsOpen(false)} to="/offer" className="block border-b pb-2">Offers</Link>
      </div>

      {/* Additional Links */}
      <div className="space-y-2 mt-6 text-gray-400">
        <Link onClick={() => setIsOpen(false)} to="/blogcomponent" className="block">Blog</Link>
        <Link onClick={() => setIsOpen(false)} to="/trackorder" className="block">Track Order</Link>
        <Link onClick={() => setIsOpen(false)} to="/services" className="block">Services</Link>
        <Link onClick={() => setIsOpen(false)} to="/franchiseenquery" className="block">Become A Franchise</Link>
        <Link onClick={() => setIsOpen(false)} to="/contact-us" className="block">Contact Us</Link>
      </div>

      {/* Logout Button */}
      {userName !== 'Guest' && (
        <div className="mt-4">
          <button
            onClick={handleLogoutClick}
            className="w-full py-2 px-4 bg-bio-green border rounded-lg text-black"
          >
            Logout
          </button>
        </div>
      )}

      {/* Social Media Icons */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        <Link to="https://www.facebook.com/biotechmaali">
          <FontAwesomeIcon icon={faFacebook} className="text-xl text-gray-600" />
        </Link>
        <Link to="https://www.instagram.com/biotechmaali/">
          <FontAwesomeIcon icon={faInstagram} className="text-xl text-gray-600" />
        </Link>
        <Link to="https://www.linkedin.com/company/biotechmaali/">
          <FontAwesomeIcon icon={faLinkedin} className="text-xl text-gray-600" />
        </Link>
        <Link to="https://www.youtube.com/@biotechmaali">
          <FontAwesomeIcon icon={faYoutube} className="text-xl text-gray-600" />
        </Link>
      </div>
    </div>
  </div>
)}


      {/* Logout Confirmation Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-96 w-80">
            <h3 className="text-lg font-semibold mb-4">Logout</h3>
            <div className="mb-4">
              <img name=" "    src={LogoutGif}  alt="Logout" className="mx-auto w-40" />
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
                className="bg-red-500 px-4 py-2  rounded text-white hover:bg-red-600"
                onClick={handleLogoutConfirm}
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

export default WithoutLoginHamburger;