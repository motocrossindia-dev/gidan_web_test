'use client';

import React from "react";

const TestimonialsSection = () => (
  <div className="bg-gray-100 py-12 px-4">
    <div className="bg-pink-100 rounded-lg max-w-7xl mx-auto py-10 px-6 md:px-12 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-green-900 mb-10">
        Our Happy Franchise Owners
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 place-items-center">
        <div className="bg-gray-300 rounded-md w-full h-64 md:h-96"></div>
        <div className="bg-gray-300 rounded-md w-full h-64 md:h-96"></div>
      </div>
    </div>
  </div>
);

export default TestimonialsSection;
