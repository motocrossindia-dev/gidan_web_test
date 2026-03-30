'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { getBannerCategoryUrl } from "../../hooks/useBannerImages";
import { Star, ArrowRight } from "lucide-react";

const HeroSection = ({ hero, heroData }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds for original slider
  useEffect(() => {
    if (hero && hero.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === hero.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
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

  // If we have dynamic heroData from /homepage/ API, use the new layout
  if (heroData) {
    return (
      <section className="relative overflow-hidden bg-[#faf9f6] py-16 lg:py-24">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-[#f1f1e6] blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-[#f1f1e6] blur-3xl opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-[#375421] uppercase bg-[#375421]/10 rounded-full">
                {heroData.badge_text}
              </span>
              
              <h1 className="text-5xl lg:text-7xl font-serif text-[#1a1a1a] mb-6 leading-[1.1]">
                {heroData.heading}{" "}
                <span className="italic font-normal serif text-[#375421]">{heroData.italic_text}</span>{" "}
                {heroData.heading_suffix}
              </h1>

              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {heroData.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link 
                  href={heroData.btn1_link}
                  className="w-full sm:w-auto px-8 py-4 bg-[#375421] text-white rounded-full font-medium hover:bg-[#2a4019] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#375421]/20"
                >
                  {heroData.btn1_text}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href={heroData.btn2_link}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#375421] border border-[#375421]/20 rounded-full font-medium hover:bg-white/80 transition-all"
                >
                  {heroData.btn2_text}
                </Link>
              </div>

              {/* Stats/Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-gray-200/60">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill="currentColor" stroke="none" />
                    ))}
                    <span className="ml-1 text-sm font-bold text-gray-900">{heroData.stat_rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-light">
                    <span className="font-semibold text-gray-900">{heroData.stat_count}+</span> {heroData.stat_label}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Feed / Image side */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none">
              <div className="grid grid-cols-2 gap-4">
                {heroData.product_cards?.slice(0, 4).map((product, idx) => (
                  <Link 
                    key={product.id}
                    href={product.product_link}
                    className={`group relative overflow-hidden rounded-3xl aspect-[4/5] ${idx === 1 ? 'mt-8' : idx === 2 ? '-mt-8' : ''}`}
                  >
                    <Image 
                      src={`https://backend.gidan.store${product.image}`}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-white/80 text-sm">₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback to Slide-based Hero Section
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
                    src={`https://backend.gidan.store${banner.web_banner}`}
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
                    src={`https://backend.gidan.store${banner.mobile_banner}`}
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
                  text-xl font-bold"
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
                  text-xl font-bold"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {hero.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="w-12 h-12 flex items-center justify-center"
              >
                <span className={`w-3 h-3 rounded-full block ${index === currentIndex ? "bg-[#375421]" : "bg-gray-300"
                  }`} />
              </button>
            ))}
          </div>

        </div>
      ) : (
        <div className="w-full h-[450px] bg-site-bg flex items-center justify-center">
          <p>No hero images available</p>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
