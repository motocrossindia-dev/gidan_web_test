'use client';

import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useBlogs } from "../../hooks/useBlogs";

const Blog = () => {
  const swiperRef = useRef(null);
  const { data: blogs = [], isLoading } = useBlogs();

  const Blogcard = ({ image, title, heading, slug }) => {
    return (
      <Link href={`/blogs/${slug}`} className="block w-full h-auto rounded-lg overflow-hidden font-sans flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
        <div className="w-full aspect-[4/3] bg-site-bg rounded-lg overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
            }}
          />
        </div>

        <div className="flex flex-col text-left mt-3 px-1 gap-1">
          <h3 className="text-gray-500 text-xs md:text-sm leading-snug line-clamp-2">{title}</h3>
          <p className="text-gray-800 text-sm md:text-base lg:text-lg font-semibold leading-snug line-clamp-2">{heading}</p>
        </div>
      </Link>
    );
  };

  return (
    <>
      <section className="w-full py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative flex items-center justify-center mb-6 font-sans">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-center">Blogs</h2>
            <Link
              href="/blogs"
              className="absolute right-0 text-white bg-bio-green text-xs md:text-base rounded-md py-1.5 px-3 md:py-2 md:px-5 font-medium"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                480:  { slidesPerView: 2, spaceBetween: 16 },
                768:  { slidesPerView: Math.min(blogs.length, 3), spaceBetween: 20 },
                1024: { slidesPerView: Math.min(blogs.length, 4), spaceBetween: 24 },
              }}
              loop={blogs.length > 2}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              navigation={{ prevEl: ".blog-prev", nextEl: ".blog-next" }}
              className="my-4"
            >
              {blogs.map((blog, index) => (
                <SwiperSlide key={index}>
                  <Blogcard
                    image={blog.image}
                    title={blog.title}
                    heading={blog.summary}
                    slug={blog.slug}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {blogs.length > 1 && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button aria-label="Previous blog" className="blog-prev w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-site-bg transition-colors">
                  <FaAngleLeft className="text-bio-green" />
                </button>
                <button aria-label="Next blog" className="blog-next w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-site-bg transition-colors">
                  <FaAngleRight className="text-bio-green" />
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;