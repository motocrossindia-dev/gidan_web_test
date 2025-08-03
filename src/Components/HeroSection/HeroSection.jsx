import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ hero }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === hero.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [hero]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = (productId) => {
    if (productId) {
      navigate(`/productdata/${productId}`);
    }
  };

  const goLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? hero.length - 1 : prevIndex - 1
    );
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === hero.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full bg-white overflow-hidden">
      {hero && hero.length > 0 ? (
        <div className="relative w-full h-[500px]">
          {/* Carousel Slides */}
          {hero.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={`https://backend.biotechmaali.com${banner.web_banner}`}
                alt="Hero Banner"
                onClick={() => handleBannerClick(banner.product_id)}
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          ))}

          {/* Left Button */}
          <button
            onClick={goLeft}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition z-20"
          >
            &#8592;
          </button>

          {/* Right Button */}
          <button
            onClick={goRight}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition z-20"
          >
            &#8594;
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {hero.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500 text-lg">No hero images available</p>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
