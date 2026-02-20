'use client';

import React from 'react';
import SideBar from '@/views/Users/SideBar/SideBar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex px-4 md:px-8 md:py-6">
        <div className="hidden md:block md:w-[290px] flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
