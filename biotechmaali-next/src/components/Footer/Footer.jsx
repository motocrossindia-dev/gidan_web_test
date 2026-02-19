'use client';


import React, { useState, useRef } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedin, FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignIn from "../../Pages/SignIn/Signin"; // Assuming you have a SignIn component
import emailjs from 'emailjs-com';
import { enqueueSnackbar } from "notistack";
import { isMobile } from "react-device-detect";

const Footer = () => {

    const navigate = useNavigate();
    const username = useSelector((state) => state.user.username);
    const [openSection, setOpenSection] = useState(""); // State to track open sections
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const formRef = useRef(null);


    const handleWalletClick = () => {
        if (username === "Guest") {
            setIsSignInOpen(true);
        } else {
            if (isMobile) {
                navigate('/mobilesidebar/walletmobile')
            } else {
                navigate("/profile/Wallet");
            }
        }
    };

    const handleClick = () => {
        if (username === "Guest") {
            setIsSignInOpen(true);
        } else {
            navigate("/profile/referal");
        }
    };

    const handleClickorder = () => {
        if (username === "Guest") {
            setIsSignInOpen(true);
        } else {
            navigate("/profile/trackorder");
        }
    };

    // Toggle function to manage dropdown visibility
    const toggleSection = (section) => {
        setOpenSection(openSection === section ? "" : section);
    };

    const handleGetOtpClick = () => {
        setIsSignInOpen(false);
    };

    const handleLoginSuccess = () => {
        setIsSignInOpen(false);
        navigate("/WishList");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) return;

        try {
            const response = await emailjs.sendForm(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                formRef.current,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            setSubscribed(true);
            enqueueSnackbar('Thankyou For Subscribing to Our Newsletter', { variant: 'success' })
        } catch (error) {
            console.error('EmailJS error:', error);
            enqueueSnackbar('Subscription failed. Try again later.', { variant: 'info' });
        }
    };

    return (
        <footer className="bg-white  border-black-100 py-8 px-4 md:px-16 font-sans mt-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 md:gap-8 ">

                {/* Quick Links */}
                <div>
                    <h3
                        className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
                        onClick={() => toggleSection("quick-links")}
                    >
                        Quick Links
                    </h3>
                    <ul
                        className={`space-y-2 transition-all duration-300 md:block ${openSection === "quick-links" ? "block" : "hidden"
                        }`}
                    >
                        <li className="hover:text-green-500 ">
                            <Link to="/">Home</Link>
                        </li>

                        <li className="hover:text-green-500">
                            <Link to="/careers">Careers</Link>
                        </li>
                        <li className="hover:text-green-500">
                            <Link to="/blogcomponent">Blogs</Link>
                        </li>
                        <li className="hover:text-green-500">
                            <Link to="/stores">Our Stores</Link>
                        </li>
                        <li className="hover:text-green-500">
                            <Link to="/franchise-enquiry">Franchise Enquiry</Link>
                        </li>
                    </ul>
                </div>

                {/* More Info (Updated from Customer Care) */}
                <div>
                    <h3
                        className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
                        onClick={() => toggleSection("more-info")}
                    >
                        More info
                    </h3>
                    <ul
                        className={`space-y-2 transition-all duration-300 md:block ${openSection === "more-info" ? "block" : "hidden"
                        }`}
                    >
                        <li className="hover:text-green-500">
                            <Link to="/contact-us">Contact Us</Link>
                        </li>
                        <li className="hover:text-green-500">
                            <Link to="/about-us">About Us</Link>
                        </li>
                        <li className="hover:text-green-500" onClick={handleClickorder}>
                            <Link to="/profile/trackorder">Track Order</Link>
                        </li>
                        <li className="hover:text-green-500">
                            <Link to="/faq">FAQs</Link>
                        </li>
                    </ul>
                </div>

                {/* Policies (New Section) */}
                <div>
                    <h3
                        className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
                        onClick={() => toggleSection("policies")}
                    >
                        Policies
                    </h3>
                    <ul
                        className={`space-y-2 transition-all duration-300 md:block ${openSection === "policies" ? "block" : "hidden"
                        }`}
                    >
                        <li className="hover:text-green-500 ">
                            <Link to="/terms">Terms and Conditions</Link>
                        </li>
                        <li className="hover:text-green-500 ">
                            <Link to="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li className="hover:text-green-500 ">
                            <Link to="/shipping">Shipping Policy</Link>
                        </li>
                        <li className="hover:text-green-500 ">
                            <Link to="/return">Return Policy</Link>
                        </li>
                    </ul>
                </div>

                {/* Offers & Rewards (Retained) */}
                <div>
                    <h3
                        className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
                        onClick={() => toggleSection("offers-rewards")}
                    >
                        Offers & Rewards
                    </h3>
                    <ul
                        className={`space-y-2 transition-all duration-300 md:block ${openSection === "offers-rewards" ? "block" : "hidden"
                        }`}
                    >
                        <li className="hover:text-green-500" onClick={handleWalletClick}>
                            <Link to="">Wallet</Link>
                        </li>
                    </ul>
                </div>

                {/* Get in Touch (Retained) */}
                <div>
                    <h3
                        className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
                        onClick={() => toggleSection("get-in-touch")}
                    >
                        Get in touch
                    </h3>


                    {/* Newsletter */}
                    <h3 className="font-normal text-md mb-4 mt-6">
                        Sign up for our newsletter
                    </h3>
                    <p className="text-gray-600 mb-4">
                        For plant care tips, our featured plant of the week, exclusive
                        offers, and discounts.
                    </p>

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="flex items-center border border-green-500 rounded-lg overflow-hidden"
                    >
                        <input
                            type="email"
                            name="user_email"
                            placeholder="Enter Your Email Address"
                            className="px-4 py-2 w-full font-semibold focus:outline-none text-xs"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={subscribed}
                        />
                        <button
                            type="submit"
                            className={`px-1 m-2 rounded-md py-1 text-xs ${
                                subscribed ? 'bg-gray-400' : 'bg-bio-green text-white'
                            }`}
                            disabled={subscribed}
                        >
                            {subscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </form>

                    {/* Social Icons */}
                    <h2 className="text-lg font-semibold mt-6">Follow Us</h2>

                    <div className="flex space-x-4 mt-2">
                        <a
                            href="https://www.facebook.com/thegidanstore/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-green-500"
                            aria-label="Visit our Facebook page"
                        >
                            <FaFacebookF size={20} />
                        </a>
                        <a
                            href="https://www.instagram.com/thegidanstore/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-green-500"
                            aria-label="Visit our Instagram page"
                        >
                            <FaInstagram size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/thegidanstore/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-green-500"
                            aria-label="Visit our LinkedIn page"
                        >
                            <FaLinkedin size={20} />
                        </a>
                        <a
                            href="https://www.youtube.com/@thegidanstore/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-green-500"
                            aria-label="Visit our YouTube channel"
                        >
                            <FaYoutube size={20} />
                        </a>
                        <a
                            href="https://whatsapp.com/channel/0029Vac6g6TB4hdL2NqaEc1f/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:text-green-500"
                            aria-label="Join our WhatsApp channel"
                        >
                            <FaWhatsapp size={20} />
                        </a>
                    </div>
                </div>

            </div>

            <div className="mt-6 text-left text-xs text-gray-600">
                <p>© FARM AMMINO AGRITECH PRIVATE LIMITED. All rights reserved.</p>
            </div>

            {isSignInOpen && (
                <SignIn
                    onClose={() => setIsSignInOpen(false)}
                    onGetOtpClick={handleGetOtpClick}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </footer>
    );
};

export default Footer;

// import React, { useState } from "react";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedin,
//   FaYoutube,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import SignIn from "../../Pages/SignIn/Signin"; // Assuming you have a SignIn component
// import emailjs from 'emailjs-com';
// import { useRef } from "react";
// import { enqueueSnackbar } from "notistack";
// import { isMobile } from "react-device-detect";
//
// const Footer = () => {
//
//   const navigate = useNavigate();
//   const username = useSelector((state) => state.user.username);
//   const [openSection, setOpenSection] = useState(""); // State to track open sections
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);
//   const [isSignInOpen, setIsSignInOpen] = useState(false);
//   const formRef = useRef(null);
//
//
//   const handleWalletClick = () => {
//     if (username === "Guest") {
//       // setIsWalletPopupOpen(true);
//       setIsSignInOpen(true);
//     } else {
// if (isMobile) {
//   navigate('/mobilesidebar/walletmobile')
// }else{
//       navigate("/profile/Wallet");
//
// }
//     }
//   };
//     const handleClick = () => {
//     if (username === "Guest") {
//       // setIsWalletPopupOpen(true);
//       setIsSignInOpen(true);
//     } else {
//       navigate("/profile/referal");
//     }
//   };
//       const handleClickorder = () => {
//     if (username === "Guest") {
//       // setIsWalletPopupOpen(true);
//       setIsSignInOpen(true);
//     } else {
//       navigate("/profile/trackorder");
//     }
//   };
//   // Toggle function to manage dropdown visibility
//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? "" : section);
//   };
//   const handleGetOtpClick = () => {
//     setIsSignInOpen(false);
//   };
//     const handleLoginSuccess = () => {
//     setIsSignInOpen(false);
//     navigate("/WishList");
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     if (!email.trim()) return;
//
//     try {
//      const response =  await emailjs.sendForm(
//         process.env.REACT_APP_EMAILJS_SERVICE_ID,
//      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
//   formRef.current,
//   process.env.REACT_APP_EMAILJS_PUBLIC_KEY
//       );
//
//       setSubscribed(true);
//       enqueueSnackbar('Thankyou For Subscribing to Our Newsletter',{variant:'success'})
//     } catch (error) {
//       console.error('EmailJS error:', error);
//       enqueueSnackbar('Subscription failed. Try again later.',{variant:'info'});
//     }
//   };
//
//   return (
//     <footer className="bg-white  border-black-100 py-8 px-4 md:px-16 font-sans mt-8">
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 md:gap-8 ">
//         {/* Quick Links */}
//         <div>
//           <h3
//             className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
//             onClick={() => toggleSection("quick-links")}
//           >
//             Quick Links
//           </h3>
//           <ul
//             className={`space-y-2 transition-all duration-300 md:block ${openSection === "quick-links" ? "block" : "hidden"
//               }`}
//           >
//             <li className="hover:text-green-500 ">
//               <Link to="/">Home</Link>
//             </li>
//             {/* <li className="hover:text-green-500">
//               <Link to="/ourwork"> Our Work</Link>
//             </li>
//             <li className="hover:text-green-500">
//               <Link to="/services">Services</Link>
//             </li> */}
//             <li className="hover:text-green-500">
//               <Link to="/careers">Careers</Link>
//             </li>
//             <li className="hover:text-green-500">
//               <Link to="/blogcomponent">Blogs</Link>
//             </li>
//             <li className="hover:text-green-500">
//               <Link to="/stores">Our Stores</Link>
//             </li>
//             <li className="hover:text-green-500">
//               <Link to="/franchise-enquiry">Franchise Enquiry</Link>
//             </li>
//             <li className="hover:text-green-500">
//                <Link to="/faq">FAQs</Link>
//             </li>
//           </ul>
//         </div>
//
//         {/* Customer Care */}
//         <div>
//           <h3
//             className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
//             onClick={() => toggleSection("customer-care")}
//           >
//             Customer Care
//           </h3>
//           <ul
//             className={`space-y-2 transition-all duration-300 md:block ${openSection === "customer-care" ? "block" : "hidden"
//               }`}
//           >
//             <li className="hover:text-green-500">
//               <Link to="/contact-us">Contact Us</Link>
//             </li>
//             <li className="hover:text-green-500">
//               <Link to="/about-us">About Us</Link>
//             </li>
//
//             <li className="hover:text-green-500" onClick={handleClickorder}>
//               <Link to="/profile/trackorder">Track Order</Link>
//             </li>
//             <li className="hover:text-green-500 ">
//               <Link to="/terms">Terms and Conditions</Link>
//             </li>
//             <li className="hover:text-green-500 ">
//               <Link to="/privacy-policy">Privacy Policy</Link>
//             </li>
//             <li className="hover:text-green-500 ">
//               <Link to="/shipping">Shipping Policy</Link>
//             </li>
//             <li className="hover:text-green-500 ">
//               <Link to="/return">Return Policy</Link>
//             </li>
//
//           </ul>
//         </div>
//
//         {/* Offers & Rewards */}
//         <div>
//           <h3
//             className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
//             onClick={() => toggleSection("offers-rewards")}
//           >
//             Offers & Rewards
//           </h3>
//           <ul
//             className={`space-y-2 transition-all duration-300 md:block ${openSection === "offers-rewards" ? "block" : "hidden"
//               }`}
//           >
//             {/* <li className="hover:text-green-500" onClick={handleClick}>
//               <Link to="">Rewards Club</Link>
//             </li> */}
//             <li className="hover:text-green-500" onClick={handleWalletClick}>
//               <Link to="">Wallet</Link>
//             </li>
//           </ul>
//         </div>
//
//         {/* Get in Touch */}
//         <div>
//           <h3
//             className="font-semibold text-lg mb-4 cursor-pointer md:cursor-auto border-b md:border-b-0"
//             onClick={() => toggleSection("get-in-touch")}
//           >
//             Get in touch
//           </h3>
//           <ul
//             className={`space-y-2 transition-all duration-300 md:block ${openSection === "get-in-touch" ? "block" : "hidden"
//               }`}
//           >
//             <li className="text-gray-700">+91 7483316150</li>
//             <li className="text-gray-700">
//               Email:{" "}
//               <Link
//                 to="mailto:info@gidan.store"
//                 className="hover:text-green-500"
//               >
//                 info@gidan.store
//               </Link>
//             </li>
//           </ul>
//         </div>
//
//         {/* Newsletter */}
//         <div>
//           <h3 className="font-normal text-md mb-4 ">
//             Sign up for our newsletter
//           </h3>
//           <p className="text-gray-600 mb-4">
//             For plant care tips, our featured plant of the week, exclusive
//             offers, and discounts.
//           </p>
//
//     <form
//       ref={formRef}
//       onSubmit={handleSubmit}
//       className="flex items-center border border-green-500 rounded-lg overflow-hidden"
//     >
//       <input
//         type="email"
//         name="user_email"
//         placeholder="Enter Your Email Address"
//         className="px-4 py-2 w-full font-semibold focus:outline-none text-xs"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         disabled={subscribed}
//       />
//       <button
//         type="submit"
//         className={`px-1 m-2 rounded-md py-1 text-xs ${
//           subscribed ? 'bg-gray-400' : 'bg-bio-green text-white'
//         }`}
//         disabled={subscribed}
//       >
//         {subscribed ? 'Subscribed' : 'Subscribe'}
//       </button>
//     </form>
//           {/* Social Icons */}
//           <h2 className="text-lg font-semibold mt-6">Follow Us</h2>
//
//           <div className="flex space-x-4 mt-2">
//   <a
//     href="https://www.facebook.com/thegidanstore/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-black hover:text-green-500"
//   >
//     <FaFacebookF size={20} />
//   </a>
//   <a
//     href="https://www.instagram.com/thegidanstore/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-black hover:text-green-500"
//   >
//     <FaInstagram size={20} />
//   </a>
//   <a
//     href="https://www.linkedin.com/company/thegidanstore/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-black hover:text-green-500"
//   >
//     <FaLinkedin size={20} />
//   </a>
//   <a
//     href="https://www.youtube.com/@thegidanstore/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="text-black hover:text-green-500"
//   >
//     <FaYoutube size={20} />
//   </a>
// </div>
//
//         </div>
//       </div>
//
// <div className="mt-8 text-left text-xs text-gray-600">
//   <p>© FARM AMMINO AGRITECH PRIVATE LIMITED. All rights reserved.</p>
//   {/* <p className="mt-1">This privacy policy is subject to change without notice. Last updated: 2024</p> */}
// </div>
//             {isSignInOpen && (
//         <SignIn
//           onClose={() => setIsSignInOpen(false)}
//           onGetOtpClick={handleGetOtpClick}
//           onLoginSuccess={handleLoginSuccess}
//         />
//       )}
//     </footer>
//   );
// };
//
// export default Footer;
