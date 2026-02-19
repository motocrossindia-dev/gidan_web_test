'use client';

import React from 'react';
import __backgroundImage from '../../../Assets/Blog/Blog.png';
const _backgroundImage = typeof __backgroundImage === 'string' ? __backgroundImage : __backgroundImage?.src || __backgroundImage;
const backgroundImage = typeof _backgroundImage === 'string' ? _backgroundImage : _backgroundImage?.src || _backgroundImage;

function Blog() {
  return (
    <div
      className="relative flex items-center justify-center text-white w-full h-auto bg-cover bg-center" // Adjusted height here
      style={{
        backgroundImage: `url(${backgroundImage})`, // Corrected usage of url
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for dimming background */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Centered Content Box */}
      <div className="relative z-10 flex items-center justify-center w-full px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          Become a MoveonWheels Partner
        </h2>
      </div>
    </div>
  );
}

export default Blog;
