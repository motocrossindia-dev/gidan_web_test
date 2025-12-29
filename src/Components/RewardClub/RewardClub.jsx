// import React from "react";
// import plantImage from "../../../src/Assets/RewardClub.webp";
// import { useNavigate } from "react-router-dom";
// import { enqueueSnackbar } from "notistack";
// import { useSelector } from "react-redux";
// import { isMobile } from "react-device-detect";
// import { useEffect, useState } from "react";
// import axios from "axios";


// const RewardClub = () => {
//   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);


//   const [bannerData, setBannerData] = useState(null);

// useEffect(() => {
//   const fetchBanner = async () => {
//     try {
//       const res = await axios.get(
//         "https://backend.biotechmaali.com/utils/content-blocks/?section=banner&title="
//       );
//       setBannerData(res.data?.[0]);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchBanner();
// }, []);


//   const navigate = useNavigate()
//   const referafriend=async()=>{
//     try {
      
//           if (!isAuthenticated) {
//             enqueueSnackbar("Please sign in to get a referal code", { variant: "error" });
//             navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
//             return;
//           }
//           if (isMobile) {
//             navigate("/mobilesidebar/referalmobile")
//           }else{
//             navigate("/profile/referal")

//           }
//     } catch (error) {
//       console.log(error);
      
//     }
//   }
//   return (
//     <div className="w-full bg-gray-100">
//     <section className="flex justify-center md:p-10 w-full">
//       <div className="bg-[#FFDDDE] md:rounded-lg overflow-hidden w-full">
//         <div className="flex flex-col lg:flex-row w-full">
//           <div className="order-2 lg:order-1 w-full lg:w-[408px]">
//             <img name=" "   
//               src={bannerData?.image || plantImage}
//               alt="Rewards Club"
//               className="w-full h-[278.77px] lg:h-full object-cover"
//             />
//           </div>
//           <div className="order-1 lg:order-2 lg:flex-1 p-6 lg:p-8 flex flex-col justify-center w-full">
//             <h2 className="text-md xs:text-base text-lg md:text-2xl lg:text-3xl font-semibold text-black mb-4 text-center whitespace-nowrap">
//               {bannerData?.title || "Join our Plant Parent Rewards Club"}
//             </h2>

//             <p className="md:text-2xl text-md text-center text-gray-600 mb-6">
//               {bannerData?.subtitle || "Every plant purchase is a gift that keeps on giving. Earn coins and redeem them for exclusive discounts."}
//             </p>

//             <div className="flex flex-row justify-center space-x-4">
//               {/* <NavLink to="/profile/referal"> */}
//               {/*<button className="border border-bio-green bg-white text-bio-green px-4 py-2 rounded font-bold text-sm lg:text-base" onClick={referafriend}>*/}
//               {/*  Learn More*/}
//               {/*</button>*/}
//               {/* </NavLink> */}
//                {/* <NavLink to="/profile/referal"> */}
//               <button className="bg-bio-green text-white px-4 py-2  rounded font-semibold text-sm lg:text-base" onClick={referafriend}>
//                 {bannerData?.button_text || "Refer A Friend"}
//               </button>
//               {/* </NavLink> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
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
          "https://backend.biotechmaali.com/utils/content-blocks/?section=banner&title="
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
      <div className="w-full max-w-screen-xl mx-auto py-6">
        <div className="flex flex-col lg:flex-row items-center bg-[#FFDDDE] rounded-lg overflow-hidden shadow-sm">

          {/* IMAGE SECTION (REFERENCE FROM BANNER) */}
          <div className="w-full lg:w-1/2">
            {/* Desktop Image */}
            <img
              src={bannerData?.image || plantImage}
              alt="Rewards Club"
              className="hidden sm:block w-full object-cover"
              style={{ maxWidth: "600px" }}   // horizontal increase only
            />

            {/* Mobile Image */}
            <img
              src={bannerData?.image || plantImage}
              alt="Rewards Club Mobile"
              className="block sm:hidden w-full object-contain"
            />
          </div>

          {/* TEXT SECTION */}
          <div className="w-full lg:w-1/2 px-4 py-6 lg:px-10 flex flex-col justify-center text-center lg:text-left">

            <h2 className="text-sm md:text-2xl lg:text-3xl font-semibold text-black mb-4">
              {bannerData?.title || "Join our Plant Parent Rewards Club"}
            </h2>

            <p className="text-sm md:text-lg lg:text-xl text-gray-700 mb-6">
              {bannerData?.subtitle ||
                "Every plant purchase is a gift that keeps on giving. Earn coins and redeem them for exclusive discounts."}
            </p>

            <button
              onClick={referafriend}
              className="bg-bio-green text-white px-4 py-2 rounded-md w-fit mx-auto lg:mx-0 text-sm lg:text-base"
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
