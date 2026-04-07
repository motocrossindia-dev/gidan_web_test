'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/Header/Header";
import NavBar from "@/components/NavigationBar/NavigationBar";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const isCheckout = pathname === '/checkout' || pathname === '/checkout/';

  return (
    <header className={`${isCheckout ? 'relative' : 'fixed top-0 left-0'} w-full z-[1000] bg-white shadow-sm`}>
      <Header />
      <NavBar />
    </header>
  );
};

export default HeaderWrapper;
