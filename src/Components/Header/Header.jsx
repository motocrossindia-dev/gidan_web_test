import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-[#062e25] via-[#062e25] to-white font-poppins">

      <div className="container px-6 py-2 flex flex-row items-center justify-between gap-2 m-auto">

        <div>
          <p className="text-white text-[11px] px-3 md:text-[13px]">
            Free Shipping above ₹2000 | Delivery in Bengaluru
          </p>
        </div>

        {/* FIXED: Responsive Stack to prevent overlap */}
        <div className="flex flex-col items-end space-y-1 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">

          <div className="flex flex-col text-white text-[10px] sm:text-xs leading-tight text-right">
            <p>Help line</p>
            <p className="font-semibold">+91 7483316150</p>
          </div>

          <button
            onClick={() => navigate("/franchiseenquery")}
            className="bg-bio-green text-white font-bold uppercase whitespace-nowrap rounded-lg px-2 md:py-1
            hover:bg-green-700 transition text-[11px] md:text-[13px]"
          >
            Franchise Enquiry
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
