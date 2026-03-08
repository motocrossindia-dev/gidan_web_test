'use client';

import Link from "next/link";

const Header = () => {

  return (
    <header className="bg-[#062e25] font-poppins">

      <div className="max-w-full px-4 md:px-8 py-2 flex flex-row items-center justify-between gap-2 m-auto">

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

          <Link
            href="/franchise-enquiry/"
            className="bg-white text-[#062e25] font-bold uppercase whitespace-nowrap rounded-lg px-2 md:py-1
            hover:bg-[#062e25] hover:text-white hover:border hover:border-white transition text-[11px] md:text-[13px] flex items-center justify-center"
          >
            Franchise Enquiry
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
