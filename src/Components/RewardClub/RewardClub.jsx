import React from "react";
import plantImage from "../../../src/Assets/RewardClub.webp";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";

const RewardClub = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const navigate = useNavigate()
  const referafriend=async()=>{
    try {
      
          if (!isAuthenticated) {
            enqueueSnackbar("Please sign in to get a referal code", { variant: "error" });
            navigate(window.innerWidth <= 640 ? "/mobile-signin" : "/?modal=signIn", { replace: true });
            return;
          }
          if (isMobile) {
            navigate("/mobilesidebar/referalmobile")
          }else{
            navigate("/profile/referal")

          }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className="w-full bg-gray-100">
    <section className="flex justify-center md:p-10 w-full">
      <div className="bg-[#FFDDDE] md:rounded-lg overflow-hidden w-full">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="order-2 lg:order-1 w-full lg:w-[408px]">
            <img name=" "   
              src={plantImage}
              alt="Rewards Club"
              className="w-full h-[278.77px] lg:h-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 lg:flex-1 p-6 lg:p-8 flex flex-col justify-center w-full">
            <h2 className="text-md xs:text-base text-lg md:text-2xl lg:text-3xl font-semibold text-black mb-4 text-center whitespace-nowrap">
              Join our Plant Parent Rewards Club
            </h2>

            <p className="md:text-2xl text-md text-center text-gray-600 mb-6">
              Every plant purchase is a gift that keeps on giving. Earn coins
              and redeem them for exclusive discounts.
            </p>

            <div className="flex flex-row justify-center space-x-4">
              {/* <NavLink to="/profile/referal"> */}
              {/*<button className="border border-bio-green bg-white text-bio-green px-4 py-2 rounded font-bold text-sm lg:text-base" onClick={referafriend}>*/}
              {/*  Learn More*/}
              {/*</button>*/}
              {/* </NavLink> */}
               {/* <NavLink to="/profile/referal"> */}
              <button className="bg-bio-green text-white px-4 py-2  rounded font-semibold text-sm lg:text-base" onClick={referafriend}>
                Refer A Friend
              </button>
              {/* </NavLink> */}
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

  );
};

export default RewardClub;
