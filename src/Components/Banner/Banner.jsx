import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const Banner = ({ home }) => {
  const navigate = useNavigate();

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
          {home.map((banner, index) => (
            <SwiperSlide key={banner.id || index}>
              <div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-white to-gray-200 rounded-lg shadow-sm p-4">

                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  
                  {/* Desktop Banner */}
                  <img
                    src={`https://backend.biotechmaali.com${banner.web_banner}`}
                    alt="banner"
                    className="hidden sm:block w-full h-[250px] lg:h-[350px] object-cover rounded-lg"
                  />

                  {/* Mobile Banner */}
                  <img
                    src={`https://backend.biotechmaali.com${banner.mobile_banner}`}
                    alt="banner-mobile"
                    className="block sm:hidden w-full h-[230px] object-contain rounded-lg"
                  />
                </div>

                {/* Text Section */}
                <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-10 flex flex-col justify-center text-center lg:text-left">

                  <h2 className="text-sm md:text-lg lg:text-3xl text-green-800 mb-2">
                    Vibrant and Thriving Plants Online
                  </h2>

                  <h3 className="text-sm md:text-xl lg:text-4xl font-semibold text-green-800 mb-4">
                    Celebrate Friendship with 15% Off
                  </h3>

                  <button
                    onClick={() => navigate(`/feature`)}
                    className="bg-bio-green text-white px-3 md:px-4 py-2 rounded-md w-fit mx-auto lg:mx-0 hover:bg-green-700 transition text-xs md:text-sm"
                  >
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
