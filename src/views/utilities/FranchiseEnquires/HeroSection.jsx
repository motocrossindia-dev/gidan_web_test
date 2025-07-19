import React from "react";
import franchiseenquires from "../../../Assets/FranchiseEnquires/franchiseenquires.png";

const HeroSection = () => (
  <div className="relative flex justify-center bg-gray-100 items-center w-full">
    <img name=" "   
      src={franchiseenquires}
      loading="lazy"
      alt="Franchise Banner"
      className="w-full h-[200px] md:h-[448px] object-cover"
    />
    
    <div className="absolute inset-0 flex justify-center items-center">
      <p className="text-white text-sm md:text-xl font-semibold px-4 py-2 border-2 border-white rounded-full bg-white bg-opacity-10 backdrop-blur-sm">
        Your Next Big Venture Starts Here
      </p>
    </div>
  </div>
);

export default HeroSection;
