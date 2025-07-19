import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    // You can add logout logic here
    setIsOpen(false); // Close the sidebar
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close the sidebar on navigation
  };

  const desktopMenu = [
    { label: "PLANTS", path: "/filter/10" },
    { label: "SEEDS", path: "/seeds" },
    { label: "POTS & PLANTERS", path: "/pots-and-planters" },
    { label: "PLANT CARE", path: "/plant-care" },
    { label: "GIFTING", path: "/gifting" },
    { label: "Offers", path: "/offers" },
  ];

  const mobileMenu = [
    { label: "PLANTS", path: "/filter/10" },
    { label: "SEEDS", path: "/filter/13" },
    { label: "POTS", path: "/pots-and-planters" },
    { label: "PLANT CARE", path: "/plant-care" },
    { label: "GIFTING", path: "/gifting" },
    { label: "OFFERS", path: "/offers" },
  ];

  const additionalLinks = [
    { label: "Blog", path: "/blog" },
    { label: "Track Order", path: "/track-order" },
    { label: "Services", path: "/services" },
    { label: "Become A Franchise", path: "/franchise" },
    { label: "Contact Us", path: "/contact" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <div>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label="Toggle Menu"
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl" />
      </button>

      {/* Sidebar Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 w-3/4 max-w-xs shadow-lg h-full overflow-y-auto">
          {/* Account Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              <span>My Account</span>
            </div>
            <button
              className="text-gray-700 flex items-center justify-between ml-auto"
              onClick={handleLogoutClick}
            >
              <span>Logout</span>
              <FontAwesomeIcon icon={faSignOutAlt} className="ml-4" />
            </button>
          </div>

          {/* Menu Items - Desktop View */}
          <div className="hidden md:block space-y-6">
            {desktopMenu.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={handleLinkClick}
                className="block border-b pb-2"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Menu Items - Mobile View */}
          <div className="md:hidden overflow-x-auto whitespace-nowrap flex gap-4 p-2 scrollbar-hide">
            {mobileMenu.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={handleLinkClick}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 text-center text-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Additional Links */}
          <div className="space-y-6 mt-6 text-gray-500 text-sm">
            {additionalLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={handleLinkClick}
                className="block"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center mt-8 space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-xl text-gray-600"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-xl text-gray-600"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-xl text-gray-600"
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faYoutube}
                className="text-xl text-gray-600"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hamburger;





// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBars,
//   faUser,
//   faSignOutAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   faInstagram,
//   faFacebook,
//   faLinkedin,
//   faYoutube,
// } from "@fortawesome/free-brands-svg-icons";
// import { Link } from "react-router-dom";

// const Hamburger = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogoutClick = () => {
//     setIsOpen(false); // Close the sidebar when logout is clicked
//   };

//   return (
//     <div>
//       {/* Hamburger Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="p-2">
//         <FontAwesomeIcon icon={faBars} className="text-2xl" />
//       </button>

//       {/* Sidebar Menu */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-white z-50 p-4 w-3/4 max-w-xs shadow-lg h-full">
//           {/* Account Section */}
//           <div className="flex items-center justify-between mb-6">
//             <FontAwesomeIcon icon={faUser} />
//             <span className="ml-2">My Account</span>
//             <button
//               className="text-gray-700 flex items-center justify-between ml-auto"
//               onClick={handleLogoutClick}
//             >
//               <span>Logout</span>
//               <FontAwesomeIcon icon={faSignOutAlt} className="ml-4" />
//             </button>
//           </div>

//           {/* Menu Items - Desktop View */}
//           <div className="hidden md:block space-y-6">
//             <Link to="#" className="block border-b pb-2">PLANTS</Link>
//             <Link to="#" className="block border-b pb-2">SEEDS</Link>
//             <Link to="#" className="block border-b pb-2">POTS & PLANTERS</Link>
//             <Link to="#" className="block border-b pb-2">PLANT CARE</Link>
//             <Link to="#" className="block border-b pb-2">GIFTING</Link>
//             <Link to="#" className="block border-b pb-2">Offers</Link>
//           </div>

//           {/* Menu Items - Mobile View (Scrollable Circles) */}
//           <div className="md:hidden overflow-x-auto whitespace-nowrap flex gap-4 p-2 scrollbar-hide">
//             {["PLANTS", "SEEDS", "POTS", "PLANT CARE", "GIFTING", "OFFERS"].map((item, index) => (
//               <Link key={index} to="#" className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 text-center text-xs">
//                 {item}
//               </Link>
//             ))}
//           </div>

//           {/* Additional Links */}
//           <div className="space-y-6 mt-6 text-gray-400">
//             <Link to="#" className="block">Blog</Link>
//             <Link to="#" className="block">Track Order</Link>
//             <Link to="#" className="block">Services</Link>
//             <Link to="#" className="block">Become A Franchise</Link>
//             <Link to="#" className="block">Contact Us</Link>
//             <Link to="#" className="block">FAQ</Link>
//           </div>

//           {/* Social Media Icons */}
//           <div className="flex items-center mt-8 space-x-6">
//             <Link to="#"><FontAwesomeIcon icon={faFacebook} className="text-xl text-gray-600" /></Link>
//             <Link to="#"><FontAwesomeIcon icon={faInstagram} className="text-xl text-gray-600" /></Link>
//             <Link to="#"><FontAwesomeIcon icon={faLinkedin} className="text-xl text-gray-600" /></Link>
//             <Link to="#"><FontAwesomeIcon icon={faYoutube} className="text-xl text-gray-600" /></Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Hamburger;
