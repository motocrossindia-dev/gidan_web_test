


import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const Banner = (home_images) => {

  const navigate = useNavigate(); // Correct usage of useNavigate

  return (
    <div className="w-full bg-gray-100">
    <div className="max-w-screen-xl mx-auto py-6">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {home_images.home.map((banner, index) => (
          <SwiperSlide key={banner.id || index}>
            <div className="flex items-center bg-gradient-to-r from-white to-#D6D0D0 rounded-lg shadow-sm p-4">
              {/* Left side with plant image */}
              <div className="w-1/4 sm:w-1/4 lg:w-1/2">
                <img name=" "   
                  src={`${process.env.REACT_APP_API_URL}${banner.web_banner}`}
                  alt="Plant banner"
                  className="w-full h-auto object-cover rounded-lg sm:w-[50px] sm:h-[50px] lg:w-[400px] lg:h-[160px]"
                />          <img name=" "
                  src={`${process.env.REACT_APP_API_URL}${banner.mobile_banner}`}
                  alt="Plant banner"
                  className="w-full h-auto object-cover rounded-lg sm:w-[50px] sm:h-[50px] lg:w-[400px] lg:h-[160px]"
                />
              </div>

              {/* Right side with text content */}
              <div className="w-3/4 sm:w-3/4 lg:w-1/2 pl-8 flex flex-col justify-center">
                <h2 className="text-xs md:text-sm lg:text-3xl text-green-800 mb-2 pl-10 md:pl-32">
                  {"Vibrant and Thriving Plants Online"}
                </h2>
                <h3 className="text-xs md:text-sm lg:text-4xl pl-6 md:pl-0 font-semibold text-green-800 mb-4">
                  {"Celebrate Friendship with 15% Off"}
                </h3>
               
                <button onClick={()=>navigate(`/feature`)} className="bg-bio-green text-white md:px-4 px-2 md:py-2 py-2 rounded-md w-fit hover:bg-bio-green transition-colors ml-auto mr-9 text-xs md:text-sm">
                  {/* {banner.buttonText} */}

                  Shop Now
                </button>
                
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>
  );
};

export default Banner;