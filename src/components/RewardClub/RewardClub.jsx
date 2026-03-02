'use client';

import { useRouter } from "next/navigation";
import Image from "next/image";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import __plantImage from "../../Assets/RewardClub.webp";
const _plantImage = typeof __plantImage === 'string' ? __plantImage : __plantImage?.src || __plantImage;
const plantImage = typeof _plantImage === 'string' ? _plantImage : _plantImage?.src || _plantImage;
import { useRewardBanner } from "../../hooks/useRewardBanner";

const RewardClub = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const router = useRouter();

  // Use TanStack Query hook for banner data
  const { data: bannerData, isLoading } = useRewardBanner();

  const referafriend = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please sign in to get a referral code", { variant: "error" });
      router.push(
        window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn",
        { replace: true }
      );
      return;
    }
    router.push("/profile/referal");
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-white flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
          <div className="bg-[#FFDDDE] flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Full Width Grid - No container */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT: Image - 50% width, no gap */}
        <div className="bg-white flex items-center justify-center">
          <Image
            src={bannerData?.image || plantImage}
            alt="Rewards Club"
            width={1200}
            height={800}
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-full object-contain"
          />
        </div>

        {/* RIGHT: Content - 50% width, no gap */}
        <div className="bg-[#FFDDDE] flex flex-col justify-center text-center lg:text-left px-6 py-8 lg:px-16 lg:py-12">

          <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            {bannerData?.title || "Refer & Earn"}
          </h2>

          <p className="text-base sm:text-lg lg:text-2xl xl:text-3xl text-gray-700 mb-8 leading-relaxed">
            {bannerData?.subtitle || "Good things grow when shared—invite a friend to Gidan and earn GD Coins as they shop."}
          </p>

          <button
            onClick={referafriend}
            className="bg-[#8BC34A] text-white px-8 py-3.5 lg:px-10 lg:py-4 rounded-md w-fit mx-auto lg:mx-0 hover:bg-green-600 transition text-base lg:text-lg font-medium"
          >
            {bannerData?.button_text || "Refer Now"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RewardClub;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import React, { useEffect, useState } from "react";
// import plantImage from "../../../src/Assets/RewardClub.webp";
// // import { enqueueSnackbar } from "notistack";
// import { useSelector } from "react-redux";
// import { isMobile } from "react-device-detect";
// import axios from "axios";
//
// const RewardClub = () => {
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
//   const router = useRouter();
//   const [bannerData, setBannerData] = useState(null);
//
//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {
//         const res = await axios.get(
//             "https://backend.gidan.store/utils/content-blocks/?section=banner&title="
//         );
//         setBannerData(res.data?.[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchBanner();
//   }, []);
//
//   const referafriend = () => {
//     if (!isAuthenticated) {
//       enqueueSnackbar("Please sign in to get a referral code", { variant: "error" });
//       router.push(
//           window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn",
//           { replace: true }
//       );
//       return;
//     }
//     router.push(isMobile ? "/mobilesidebar/referalmobile" : "/profile/referal");
//   };
//
//   return (
//       <div className="w-full">
//         {/* Full Width Grid - No container */}
//         <div className="grid grid-cols-1 lg:grid-cols-2">
//
//           {/* LEFT: Image - 50% width, no gap */}
//           <div className="bg-white flex items-center justify-center">
//             <img
//                 src={bannerData?.image || plantImage}
//                 alt="Rewards Club"
//                 loading="lazy"
//                 className="w-full h-full object-contain"
//             />
//           </div>
//
//           {/* RIGHT: Content - 50% width, no gap */}
//           <div className="bg-[#FFDDDE] flex flex-col justify-center text-center lg:text-left px-6 py-8 lg:px-16 lg:py-12">
//
//             <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
//               {bannerData?.title || "Refer & Earn"}
//             </h2>
//
//             <p className="text-base sm:text-lg lg:text-2xl xl:text-3xl text-gray-700 mb-8 leading-relaxed">
//               {bannerData?.subtitle || "Good things grow when shared—invite a friend to Gidan and earn GD Coins as they shop."}
//             </p>
//
//             <button
//                 onClick={referafriend}
//                 className="bg-[#8BC34A] text-white px-8 py-3.5 lg:px-10 lg:py-4 rounded-md w-fit mx-auto lg:mx-0 hover:bg-green-600 transition text-base lg:text-lg font-medium"
//             >
//               {bannerData?.button_text || "Refer Now"}
//             </button>
//
//           </div>
//
//         </div>
//       </div>
//   );
// };
//
// export default RewardClub;
// ========== END OLD CODE ==========
