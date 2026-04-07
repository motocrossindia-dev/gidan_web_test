'use client';

import { usePathname } from "next/navigation";

export default function HeaderSpacer() {
  const pathname = usePathname();
  const isCheckout = pathname === '/checkout' || pathname === '/checkout/';
  
  return (
    <div 
      className={`${isCheckout ? 'h-[50px] md:h-[65px]' : 'h-[60px] md:h-[130px]'} w-full transition-all duration-300`} 
      aria-hidden="true" 
    />
  );
}
