
import React from 'react';
import creative from '../../../src/Assets/ExploreWorks.png';
import { NavLink } from 'react-router-dom';

const ExploreWorks = () => {
  return (
    <div className="bg-white-100 py-2 md:py-4 lg:py-8 md:px-14">
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-8 text-center font-sans">
        {/* Heading */}
        <h2 className="text-md sm:text-lg md:text-2xl font-semibold md:font-bold text-center">
          Explore Our Work & Creative Projects
        </h2>

        {/* Image and Content Container */}
        <div className="relative mt-4 rounded-lg shadow-lg overflow-hidden h-[240px] sm:h-[150px] md:h-[350px] lg:h-[500px]">
          {/* Background Image */}
          <img name=" "   
            className="w-full h-full object-cover"
            src={creative}
            alt="Gidan"
          />

          {/* Overlay with Text */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
            <h3 className="text-md sm:text-lg md:text-5xl lg:text-3xl md:font-semibold font-normal text-white mb-2 mt-20">
              What Makes Gidan Stand Out?
            </h3>
            <NavLink to="/ourwork">
              <button 
                className="bg-bio-green text-white md:font-semibold font-normal py-1 md:py-2 px-4 md:px-6 rounded-md hover:bg-green-600 text-md md:text-base"
              >
                Explore Now
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreWorks;