import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#062e25] font-poppins ">
      <div className="container px-6 py-2 flex flex-row items-center justify-between gap-2 m-auto">
        <div>
          <p className="text-white text-[11px] px-3 md:text-[13px]">
            Free Shipping above ₹2000 | All India Delivery
          </p>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden md:flex flex-col text-white text-xs">
            <p>Help line</p>
            <p>+91 7892078318</p>
          </div>

          <button
            onClick={() => navigate("/franchiseenquery")}
            className="bg-[#062e25] text-white font-bold uppercase whitespace-nowrap rounded-lg px-2 md:py-1
            hover:bg-[#062e25] transition text-[11px] md:text-[13px]"
          >
            Franchise Enquiries
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
