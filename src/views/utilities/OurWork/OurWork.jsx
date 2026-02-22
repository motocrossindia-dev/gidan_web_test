'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import __ourwork from "../../../Assets/OurWork/ourwork1.webp";
const _ourwork = typeof __ourwork === 'string' ? __ourwork : __ourwork?.src || __ourwork;
const ourwork = typeof _ourwork === 'string' ? _ourwork : _ourwork?.src || _ourwork;
import __ourwork2 from "../../../Assets/OurWork/ourwork2.webp";
const _ourwork2 = typeof __ourwork2 === 'string' ? __ourwork2 : __ourwork2?.src || __ourwork2;
const ourwork2 = typeof _ourwork2 === 'string' ? _ourwork2 : _ourwork2?.src || _ourwork2;
import __ourwork3 from "../../../Assets/OurWork/ourwork3.webp";
const _ourwork3 = typeof __ourwork3 === 'string' ? __ourwork3 : __ourwork3?.src || __ourwork3;
const ourwork3 = typeof _ourwork3 === 'string' ? _ourwork3 : _ourwork3?.src || _ourwork3;
import __ourwork4 from "../../../Assets/OurWork/ourwork4.webp";
const _ourwork4 = typeof __ourwork4 === 'string' ? __ourwork4 : __ourwork4?.src || __ourwork4;
const ourwork4 = typeof _ourwork4 === 'string' ? _ourwork4 : _ourwork4?.src || _ourwork4;
import __ourwork5 from "../../../Assets/OurWork/ourwork5.webp";
const _ourwork5 = typeof __ourwork5 === 'string' ? __ourwork5 : __ourwork5?.src || __ourwork5;
const ourwork5 = typeof _ourwork5 === 'string' ? _ourwork5 : _ourwork5?.src || _ourwork5;
import __ourwork6 from "../../../Assets/OurWork/ourwork6.webp";
const _ourwork6 = typeof __ourwork6 === 'string' ? __ourwork6 : __ourwork6?.src || __ourwork6;
const ourwork6 = typeof _ourwork6 === 'string' ? _ourwork6 : _ourwork6?.src || _ourwork6;
import { FaPlay } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const OurWork = () => {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  const handleRedirect = () => {
    router.push('/services');
  };
  return (
      <>
        <Helmet>
          <title>About Gidan | Trusted Online Shopping Store</title>
        
          <meta
            name="description"
            content="Learn about Gidan – our story, values & commitment to quality products and customer satisfaction."
          />
        
        </Helmet>
    <div className="App">
    <h4 className="text-sm sm:text-base p-4">Home / Our Work</h4>

    {/* Hero Image */}
    <div className="flex items-center justify-center mt-4 px-4">
      <img name=" "    src={ourwork} loading="lazy" alt="hero" className="w-full max-w-[1280px] sm:h-[469px] object-cover" />
    </div>

    {/* Hero Section */}
    <div className="bg-gray-100 py-8 px-4 text-center">
      <h2 className="text-xl sm:text-2xl font-bold leading-tight">
        Elevate Your Outdoor Space. Transform your terrace into a lush green retreat with expert landscaping.
        <br /> Gidan
      </h2>
    </div>

    {/* Video Section */}
<div className="flex justify-center mt-8 px-4">
  <div className="relative w-full max-w-[1280px] h-[200px] sm:h-[450px]">
    {/* Background Image */}
    <img name=" "
      src={ourwork2}
      loading="lazy"
      alt="hero"
      className="w-full h-full object-cover rounded-lg"
    />

    {/* Overlay Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      {/* Play Button */}
      <button className="mb-6">
        <div className="border-4 border-white rounded-xl p-2 sm:p-3">
          <FaPlay className="text-white text-2xl sm:text-4xl" />
        </div>
      </button>

      {/* Text */}
      <h2 className="text-white text-lg sm:text-3xl font-bold mb-2">
        Growing together, naturally.
      </h2>

      {/* Logo */}
      <img name=" "
        src="/path-to-biotech-logo.png" // replace with actual path
        loading="lazy"
        alt="Gidan"
        className="w-32 sm:w-48"
      />
    </div>
  </div>
</div>


    {/* Call to Action 1 */}
    <div className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center max-w-[1280px]">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h4 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4">
            Design Your Dreamscape: <br /> Personalized Landscaping with Gidan
          </h4>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleRedirect}>
            Contact
          </button>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0">
          <img name=" "    src={ourwork3} loading="lazy" alt="Landscape Design" className="w-full max-w-[660px] h-auto object-cover" />
        </div>
      </div>
    </div>

    {/* Call to Action 2 */}
    <div className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center max-w-[1280px]">
        <div className="w-full lg:w-1/2 flex justify-center">
          <img name=" "    src={ourwork4} loading="lazy" alt="Landscape Design" className="w-full max-w-[660px] h-auto object-cover" />
        </div>
        <div className="w-full lg:w-1/2 text-center lg:text-right mt-6 lg:mt-0">
          <h4 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4">
            Expert Advice, Anytime <br /> Personalized Garden Consultations <br /> with Gidan
          </h4>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleRedirect}>
            Contact
          </button>
        </div>
      </div>
    </div>

    {/* Projects Section */}
    <div className="py-8 px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Creative Projects</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-span-1 row-span-1">
            <img name=" "    src={ourwork5} loading="lazy" alt={`Project ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>

    {/* Team Section */}
    <div className="py-8 px-4 bg-gray-50 text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Meet the Visionaries <br /> The People Behind the Plants at Gidan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white shadow-lg p-4">
            <img name=" "    src={ourwork6} loading="lazy" alt={`Team Member ${index + 1}`} className="w-full h-auto max-w-[440px]" />
            <p className="text-lg font-bold">Sujith <br /> CEO And Founder</p>
          </div>
        ))}
      </div>
    </div>
  </div>
        </>
  );
};

export default OurWork;
