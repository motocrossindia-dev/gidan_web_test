'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import SideBar from '@/views/Users/SideBar/SideBar';
import ProfileBreadcrumb from '@/components/Profile/ProfileBreadcrumb';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const username = useSelector((state: any) => state.user.username);
  const isGuest  = !username || username === 'Guest';
  const router   = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isGuest) {
      router.push(`/login?redirect=/profile`);
    }
  }, [mounted, isGuest, router]);

  return (
    <div className="bg-site-bg min-h-screen">
      <div className="flex px-4 md:px-8 md:py-6 relative">
        {/* Sidebar: Fixed/Sticky on Desktop */}
        <div className="hidden md:block md:w-[290px] flex-shrink-0">
          <div className="sticky top-24 h-fit">
            <SideBar />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 md:pl-8">
          <ProfileBreadcrumb />
          {children}
        </div>
      </div>
    </div>
  );
}
