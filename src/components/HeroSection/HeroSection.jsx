'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { getBannerCategoryUrl } from "../../hooks/useBannerImages";

const HeroSection = ({ hero }) => {
  const router = useRouter();
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
   <div className="relative w-full overflow-hidden mt-4">
      {hero && hero.length > 0 ? (
        <div className="relative w-full">

          {hero.map((banner, index) => {
            const bannerUrl = getBannerCategoryUrl(banner);

            return (
              <div
                key={banner.id}
                className={index === currentIndex ? "block" : "hidden"}
              >
                <Link href={bannerUrl} className="w-full block">
                  {/* Desktop Image */}
                  <Image
                    src={`https://gidanbackendtest.mymotokart.in${banner.web_banner}`}
                    alt={banner.title || `Hero Banner ${index + 1}`}
                    width={1440}
                    height={540}
                    sizes="100vw"
                    className="w-full h-auto hidden sm:block cursor-pointer"
                    priority={index === 0}
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={70}
                  />
                  {/* Mobile Image */}
                  <Image
                    src={`https://gidanbackendtest.mymotokart.in${banner.mobile_banner}`}
                    alt={banner.title || `Hero Banner ${index + 1}`}
                    width={800}
                    height={600}
                    sizes="100vw"
                    className="w-full h-auto block sm:hidden cursor-pointer"
                    priority={index === 0}
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={75}
                  />
                </Link>
              </div>
            );
          })}

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
                <span className={`w-3 h-3 rounded-full block ${index === currentIndex ? "bg-green-600" : "bg-gray-300"
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
