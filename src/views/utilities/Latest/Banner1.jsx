import React from "react";
import bannerImage from "../../../Assets/Banner.png"; // Ensure correct path

const Banner1 = () => {
  const banner = {
    title: "Vibrant and Thriving Plants Online",
    subtitle: "Celebrate Friendship with 15% Off",
    buttonText: "Shop Now",
    image: bannerImage,
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto ">
      <div className="flex items-center bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-sm p-2">
        {/* Left side with plant image */}
        <div className="w-1/4 sm:w-1/4 lg:w-1/2">
          <img name=" "
            src={banner.image}
            loading="lazy"
            alt="Plant banner"
            className="w-full h-auto object-cover rounded-lg sm:w-[50px] sm:h-[50px] lg:w-[400px] lg:h-[160px]"
          />
        </div>

        {/* Right side with text content */}
        <div className="w-3/4 sm:w-3/4 lg:w-1/2 pl-8 flex flex-col justify-end ">
          <h2 className="text-xs md:text-sm lg:text-3xl text-green-800 mb-2 font-normal ml-11 md:ml-0">
            {banner.title}
          </h2>
          <h3 className="text-sm md:text-sm lg:text-4xl font-semibold text-green-800 mb-4">
            {banner.subtitle}
          </h3>
          <button className="bg-bio-green text-white md:px-6 md:py-2 py-1 px-4 rounded-md w-fit text-xs hover:bg-bio-green transition-colors ml-auto mr-9">
            {banner.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner1;
