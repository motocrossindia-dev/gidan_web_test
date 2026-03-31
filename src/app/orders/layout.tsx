'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const username = useSelector((state: any) => state.user.username);
  const isGuest  = !username || username === 'Guest';
  const router   = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isGuest) {
      router.push(`/login?redirect=/profile/orders`);
    }
  }, [mounted, isGuest, router]);

  return (
    <div className="min-h-screen bg-site-bg">
      {mounted && isGuest ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-sm animate-pulse">Redirecting to login...</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
