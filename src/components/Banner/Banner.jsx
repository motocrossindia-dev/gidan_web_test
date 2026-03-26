'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import { getMobileBannerUrl, getDesktopBannerUrl, getBannerCategoryUrl } from "../../hooks/useBannerImages";

const Banner = ({ home }) => {
    const router = useRouter();

    return (
        <div className="w-full bg-site-bg">
            <div className="max-w-screen-xl mx-auto py-6">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    className="w-full sm:min-h-[380px]"
                >
                    {home.map((banner, index) => (
                        <SwiperSlide key={banner.id || index}>
                            <div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-white to-gray-200 rounded-lg shadow-sm p-4">

                                {/* Image Section */}
                                <div className="w-full lg:w-1/2 flex justify-center relative">
                                    {/* Desktop Image */}
                                    <div className="hidden sm:block w-full">
                                        <Image
                                            src={`https://backend.gidan.store${getDesktopBannerUrl(banner)}`}
                                            alt={banner.title || "Gidan promotional banner"}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                                            priority={index === 0}
                                            fetchPriority={index === 0 ? "high" : "low"}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            quality={75}
                                            sizes="(max-width: 1024px) 100vw, 800px"
                                        />
                                    </div>
                                    {/* Mobile Image */}
                                    <div className="block sm:hidden w-full">
                                        <Image
                                            src={`https://backend.gidan.store${getMobileBannerUrl(banner)}`}
                                            alt={banner.title || "Gidan promotional banner"}
                                            width={400}
                                            height={300}
                                            className="w-full h-auto max-h-[230px] object-contain rounded-lg"
                                            priority={index === 0}
                                            fetchPriority={index === 0 ? "high" : "low"}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            quality={75}
                                            sizes="(max-width: 640px) 100vw, 400px"
                                        />
                                    </div>
                                </div>

                                {/* Text Section */}
                                <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-10 flex flex-col justify-center text-center lg:text-left">
                                    <h2 className="text-sm md:text-lg lg:text-3xl text-[#051d18] mb-2">
                                        {banner.title}
                                    </h2>
                                    <h3 className="text-sm md:text-xl lg:text-4xl font-semibold text-[#051d18] mb-4">
                                        {banner.subtitle}
                                    </h3>
                                    {banner.button_text && (
                                        <Link
                                            href={getBannerCategoryUrl(banner)}
                                            className="bg-bio-green text-white px-3 md:px-4 py-2 rounded-md w-fit mx-auto lg:mx-0 hover:bg-[#375421] hover:text-white transition text-xs md:text-sm"
                                        >
                                            {banner.button_text}
                                        </Link>
                                    )}
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
