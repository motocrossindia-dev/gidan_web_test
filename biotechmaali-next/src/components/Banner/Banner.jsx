'use client';

import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {useNavigate} from "react-router-dom";
import { getMobileBannerUrl, getDesktopBannerUrl } from "../../hooks/useBannerImages";

/**
 * ============================================
 * Banner Component - Updated: Feb 16, 2026
 * ============================================
 * Uses <picture> element for responsive images
 * 
 * IMPORTANT: Mobile Performance Issue
 * - If API doesn't provide 'mobile_banner' field, mobile devices will load large web_banner images
 * - Current PageSpeed shows 234KB and 93KB images loading on mobile
 * - SOLUTION: Backend should provide mobile_banner field with optimized images:
 *   * Smaller dimensions (e.g., 400x230px vs 800x350px)
 *   * Compressed/optimized for mobile (target: <50KB per image)
 * ============================================
 */

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
                                    <picture>
                                        {/* Mobile: Use mobile_banner if available, otherwise web_banner */}
                                        <source
                                            media="(max-width: 639px)"
                                            srcSet={`https://backend.gidan.store${getMobileBannerUrl(banner)}`}
                                            width="400"
                                            height="230"
                                        />
                                        
                                        {/* Desktop: Use web_banner */}
                                        <source
                                            media="(min-width: 640px)"
                                            srcSet={`https://backend.gidan.store${getDesktopBannerUrl(banner)}`}
                                            width="800"
                                            height="350"
                                        />
                                        
                                        {/* Fallback image */}
                                        <img
                                            src={`https://backend.gidan.store${getDesktopBannerUrl(banner)}`}
                                            alt={banner.title || "Gidan promotional banner"}
                                            className="w-full h-auto max-h-[230px] sm:max-h-[350px] object-contain rounded-lg"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            fetchPriority={index === 0 ? "high" : "low"}
                                            decoding="async"
                                            width="800"
                                            height="350"
                                        />
                                    </picture>
                                </div>

                                {/* Text Section */}
                                <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-10 flex flex-col justify-center text-center lg:text-left">

                                    <h2 className="text-sm md:text-lg lg:text-3xl text-green-800 mb-2">
                                        {banner.title}
                                    </h2>

                                    <h3 className="text-sm md:text-xl lg:text-4xl font-semibold text-green-800 mb-4">
                                        {banner.subtitle}
                                    </h3>

                                    <button
                                        onClick={() => navigate(`/feature`)}
                                        className="bg-bio-green text-white px-3 md:px-4 py-2 rounded-md w-fit mx-auto lg:mx-0 hover:bg-green-700 transition text-xs md:text-sm"
                                    >
                                        {banner.button_text}
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
