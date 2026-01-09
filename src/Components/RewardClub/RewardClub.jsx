
// import React, { useEffect, useState } from "react";
// import plantImage from "../../../src/Assets/RewardClub.webp";
// import { useNavigate } from "react-router-dom";
// import { enqueueSnackbar } from "notistack";
// import { useSelector } from "react-redux";
// import { isMobile } from "react-device-detect";
// import axios from "axios";

// const RewardClub = () => {
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//   const navigate = useNavigate();
//   const [bannerData, setBannerData] = useState(null);

//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         const res = await axios.get(
//           "https://backend.gidan.store/utils/content-blocks/?section=banner&title="
//         );
//         setBannerData(res.data?.[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchBanner();
//   }, []);

//   const referafriend = () => {
//     if (!isAuthenticated) {
//       enqueueSnackbar("Please sign in to get a referral code", { variant: "error" });
//       navigate(
//         window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn",
//         { replace: true }
//       );
//       return;
//     }
//     navigate(isMobile ? "/mobilesidebar/referalmobile" : "/profile/referal");
//   };

//   return (
//     <div className="w-full bg-gray-100">
//       <div className="w-full max-w-screen-xl mx-auto py-6">
//         <div className="flex flex-col lg:flex-row items-center bg-[#FFDDDE] rounded-lg overflow-hidden shadow-sm">

//           {/* IMAGE SECTION (REFERENCE FROM BANNER) */}
//           <div className="w-full lg:w-1/2">
//             {/* Desktop Image */}
//             <img
//               src={bannerData?.image || plantImage}
//               alt="Rewards Club"
//               className="hidden sm:block w-full object-cover"
//               style={{ maxWidth: "600px" }}   // horizontal increase only
//             />

//             {/* Mobile Image */}
//             <img
//               src={bannerData?.image || plantImage}
//               alt="Rewards Club Mobile"
//               className="block sm:hidden w-full object-contain"
//             />
//           </div>

//           {/* TEXT SECTION */}
//           <div className="w-full lg:w-1/2 px-4 py-6 lg:px-10 flex flex-col justify-center text-center lg:text-left">

//             <h2 className="text-sm md:text-2xl lg:text-3xl font-semibold text-black mb-4">
//               {bannerData?.title || "Join our Plant Parent Rewards Club"}
//             </h2>

//             <p className="text-sm md:text-lg lg:text-xl text-gray-700 mb-6">
//               {bannerData?.subtitle ||
//                 "Every plant purchase is a gift that keeps on giving. Earn coins and redeem them for exclusive discounts."}
//             </p>

//             <button
//               onClick={referafriend}
//               className="bg-bio-green text-white px-4 py-2 rounded-md w-fit mx-auto lg:mx-0 text-sm lg:text-base"
//             >
//               {bannerData?.button_text || "Refer A Friend"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RewardClub;

import React, { useEffect, useState } from "react";
import plantImage from "../../../src/Assets/RewardClub.webp";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import axios from "axios";

const RewardClub = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(
          "https://backend.gidan.store/utils/content-blocks/?section=banner&title="
        );
        setBannerData(res.data?.[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, []);

  const referafriend = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to get a referral code", { variant: "error" });
      navigate(
        window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn",
        { replace: true }
      );
      return;
    }
    navigate(isMobile ? "/mobilesidebar/referalmobile" : "/profile/referal");
  };

  return (
    <div className="w-full bg-gray-100">
      {/* Minimal spacing */}
      <div className="max-w-screen-xl mx-auto px-2 py-2">
        <div className="flex flex-col lg:flex-row rounded-md overflow-hidden bg-transparent lg:bg-[#FFDDDE]">
          {/* IMAGE (NO CROPPING ON MOBILE) */}
         {/* IMAGE */}
<div className="w-full lg:w-1/2">
  <img
    src={bannerData?.image || plantImage}
    alt="Rewards Club"
    className="
      w-full
      h-[120px]                 /* Mobile small */
      sm:h-[200px]              /* Tablet */
      lg:h-full                 /* Desktop original */
      object-contain            /* Mobile no crop */
      lg:object-cover           /* Desktop fill */
    "
    style={{
      maxWidth: window.innerWidth >= 1024 ? "600px" : "100%",
    }}
  />
</div>


          {/* CONTENT */}
          {/* CONTENT */}
<div
  className="
    w-full lg:w-1/2
    px-2 py-2                 /* Mobile compact */
    sm:px-5 sm:py-5
    lg:px-12 lg:py-10         /* Desktop BIG spacing */
    text-center lg:text-left
  "
>
  <h2
    className="
      text-xs sm:text-base     /* Mobile */
      lg:text-3xl xl:text-4xl  /* Desktop BIG */
      font-semibold text-black
      mb-1 lg:mb-4
    "
  >
    {bannerData?.title || "Join our Plant Parent Rewards Club"}
  </h2>

  <p
    className="
      text-[11px] sm:text-sm   /* Mobile */
      lg:text-lg xl:text-xl    /* Desktop BIG */
      text-gray-700
      mb-2 lg:mb-6
      leading-tight lg:leading-relaxed
    "
  >
    {bannerData?.subtitle ||
      "Earn coins on every plant purchase and redeem exclusive discounts."}
  </p>

  <button
    onClick={referafriend}
    className="
      bg-bio-green text-white
      px-2.5 py-1              /* Mobile */
      lg:px-6 lg:py-3          /* Desktop BIG */
      rounded
      text-[11px] lg:text-base
      mx-auto lg:mx-0
    "
  >
    {bannerData?.button_text || "Refer A Friend"}
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default RewardClub;

