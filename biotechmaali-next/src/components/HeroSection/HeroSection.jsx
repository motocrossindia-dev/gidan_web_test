'use client';

import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Image from 'next/image';
import convertToSlug from "../../utils/slugConverter";

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

  const handleBannerClick = () => {
    const activeBanner = hero[currentIndex];
    const slug = convertToSlug(activeBanner.category);

    navigate(`/carousel/${slug}`, {
      state: {
        heroId: hero[currentIndex].id,
        fullData: hero[currentIndex]
      }
    });
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
<div className="relative w-full overflow-hidden bg-white mt-4">
  {hero && hero.length > 0 ? (
    <div className="relative w-full">

      {hero.map((banner, index) => (
        <div
          key={banner.id}
          className={`transition-opacity duration-700 ease-in-out
            ${index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"}
          `}
        >

          {/* Maintain aspect ratio WITHOUT cropping */}
          <div className="relative w-full" style={{ aspectRatio: '1920/600' }}>
            <Image
              src={`https://backend.gidan.store${banner.web_banner}`}
              alt={`Hero Banner ${index + 1}`}
              fill
              sizes="100vw"
              onClick={() => handleBannerClick()}
              className="object-contain bg-white cursor-pointer"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={80}
            />
          </div>

        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={goLeft}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2
                  bg-black/50 hover:bg-black/70 text-white
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-xl font-bold z-20"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={goRight}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2
                  bg-black/50 hover:bg-black/70 text-white
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-xl font-bold z-20"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {hero.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="w-12 h-12 flex items-center justify-center"
          >
            <span className={`w-3 h-3 rounded-full block ${
              index === currentIndex ? "bg-green-600" : "bg-gray-300"
            }`} />
          </button>
        ))}
      </div>

    </div>
  ) : (
    <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
      <p>No hero images available</p>
    </div>
  )}
</div>


  );
};

export default HeroSection;
