'use client';

import Link from "next/link";
// ========== NEW CODE (Feb 16, 2026) - With TanStack Query ==========
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useBlogs } from "../../hooks/useBlogs";

const Blog = () => {
  const swiperRef = useRef(null);

  // Use TanStack Query hook for blogs data
  const { data: blogs = [], isLoading } = useBlogs();

  const Blogcard = ({ image, title, heading, slug }) => {
    return (
      <Link href={`/blogs/${slug}`} className="block w-full max-w-[500px] mx-auto h-auto rounded-lg overflow-hidden font-sans flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow">
        <div className="w-full aspect-[800/665] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x665?text=Image+Not+Available";
            }}
          />
        </div>

        <div className="flex flex-col items-center text-center mt-4">
          <h3 className="text-gray-500 text-xs md:text-lg mt-1 max-w-[90%]">{title}</h3>
          <p className="text-gray-700 text-sm md:text-2xl font-bold">{heading}</p>
        </div>
      </Link>
    );
  };

  return (
    <>
      <section className="w-full py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6 font-sans">
            <h2 className="md:text-3xl text-xl font-bold mx-auto">Blogs</h2>
            <Link
              href="/blogs"
              className="text-white bg-bio-green md:text-xl text-xs rounded-md py-1 px-2 md:py-2 md:px-4 font-medium md:font-semibold"
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
              {/* Desktop View */}
              <div className="hidden md:block">
                <Swiper
                  modules={[Navigation]}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  spaceBetween={16}
                  slidesPerView={4}
                  loop={blogs.length > 4}
                  navigation={{
                    prevEl: ".prev-button",
                    nextEl: ".next-button",
                  }}
                  className="my-6"
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
              </div>

              {/* Mobile View with Auto-Slide */}
              <div className="block md:hidden">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  spaceBetween={16}
                  slidesPerView={1}
                  loop={blogs.length > 1}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    prevEl: ".prev-button",
                    nextEl: ".next-button",
                  }}
                  className="my-6"
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
                <div className="flex justify-center mt-4">
                  <button
                    aria-label="Previous"
                    className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
                  >
                    <span className="text-bio-green"><FaAngleLeft /></span>
                  </button>
                  <button
                    aria-label="View all blogs"
                    className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1"
                  >
                    <Link href="/blogs">View All</Link>
                  </button>
                  <button
                    aria-label="Next"
                    className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
                  >
                    <span className="text-bio-green"><FaAngleRight /></span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;

// ========== OLD CODE (Before Feb 16, 2026 - TanStack Query) - COMMENTED OUT ==========
// import React, { useState, useEffect, useRef } from "react";
// // import Verify from "../../Services/Services/Verify";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
// // import axiosInstance from "../../Axios/axiosInstance";
//
// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const swiperRef = useRef(null);
//
//   useEffect(() => {
//     axiosInstance.get(`/blog/blogs/`)
//       .then((response) => {
//         setBlogs(response.data.data.blogs);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching blog data:", error);
//         setLoading(false);
//       });
//   }, []);
//
//   const ViewAll = async () => {
//     try {
//       const response = await axiosInstance.get( `/product/viewAll` );
//       if (response.status === 200) {
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };
//   const Blogcard = ({ image, title, heading }) => {
//     return (
//       <div className="w-full max-w-[500px] mx-auto h-auto rounded-lg overflow-hidden font-sans flex flex-col items-center">
//        <div className="w-full aspect-[800/665] bg-gray-100 rounded-lg overflow-hidden">
//   <img
//     src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
//     alt={title}
//     loading="lazy"
//     className="w-full h-full object-contain"
//     onError={(e) => {
//       e.target.onerror = null;
//       e.target.src = "https://via.placeholder.com/800x665?text=Image+Not+Available";
//     }}
//   />
// </div>
//
//         <div className="flex flex-col items-center text-center mt-4">
//           <h3 className="text-gray-500 text-xs md:text-lg mt-1 max-w-[90%]">{title}</h3>
//           <p className="text-gray-700 text-sm md:text-2xl font-bold">{heading}</p>
//         </div>
//       </div>
//     );
//   };
//
//   return (
//     <>
//       <section className="w-full py-6 md:py-8">
//         <div className="container mx-auto px-4 md:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-6 font-sans">
//             <h2 className="md:text-3xl text-xl font-bold mx-auto">Blogs</h2>
//             <Link
//               to="/blogs"
//               className="text-white bg-bio-green md:text-xl text-xs rounded-md py-1 px-2 md:py-2 md:px-4 font-medium md:font-semibold"
//             >
//               View All
//             </Link>
//           </div>
//
//           {loading ? (
//             <div className="flex justify-center items-center h-60">
//               <p className="text-gray-500">Loading...</p>
//             </div>
//           ) : (
//             <>
//               {/* Desktop View */}
//               <div className="hidden md:block">
//                 <Swiper
//                   modules={[Navigation]}
//                   onSwiper={(swiper) => (swiperRef.current = swiper)}
//                   spaceBetween={16}
//                   slidesPerView={4}
//                   loop={true}
//                   navigation={{
//                     prevEl: ".prev-button",
//                     nextEl: ".next-button",
//                   }}
//                   className="my-6"
//                 >
//                   {blogs.map((blog, index) => (
//                     <SwiperSlide key={index}>
//                       <Blogcard
//                         image={blog.image}
//                         title={blog.title}
//                         heading={blog.summary}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>
//
//               {/* Mobile View with Auto-Slide */}
//               <div className="block md:hidden">
//                 <Swiper
//                   modules={[Navigation, Autoplay]}
//                   onSwiper={(swiper) => (swiperRef.current = swiper)}
//                   spaceBetween={16}
//                   slidesPerView={1}
//                   loop={true}
//                   autoplay={{
//                     delay: 2000,
//                     disableOnInteraction: false,
//                   }}
//                   navigation={{
//                     prevEl: ".prev-button",
//                     nextEl: ".next-button",
//                   }}
//                   className="my-6"
//                 >
//                   {blogs.map((blog, index) => (
//                     <SwiperSlide key={index}>
//                       <Blogcard
//                         image={blog.image}
//                         title={blog.title}
//                         heading={blog.summary}
//                       />
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//                 {/* <div className="flex justify-center mt-4">
//                   <Link
//                     to="/blogs"
//                     className="text-white bg-bio-green rounded-md py-2 px-4 font-semibold"
//                   >
//                     View All
//                   </Link>
//                 </div> */}
//                 <div className="flex justify-center mt-4">
//                   <button
//                     className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
//                   >
//                     <span className="text-bio-green"><FaAngleLeft /></span>
//                   </button>
//                   <button
//                     onClick={ViewAll}
//                     className="bg-bio-green text-white w-[94px] h-[34px] rounded mx-1"
//                   >
//                     <Link href="/blogs">View All</Link>
//                   </button>
//                   <button
//                     className="bg-white w-[30.24px] h-[30.24px] flex items-center justify-center rounded-full mx-1 border"
//                   >
//                     <span className="text-bio-green"><FaAngleRight /></span>
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };
//
// export default Blog;
// ========== END OLD CODE ==========
