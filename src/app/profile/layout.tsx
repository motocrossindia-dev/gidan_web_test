'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import SideBar from '@/views/Users/SideBar/SideBar';
import ProfileBreadcrumb from '@/components/Profile/ProfileBreadcrumb';

const SignIn       = dynamic(() => import('@/AuthPages/SignIn/Signin'),                 { ssr: false });
const Verification = dynamic(() => import('@/AuthPages/Verification/Verification'),     { ssr: false });
const Login        = dynamic(() => import('@/AuthPages/Login/Login'),                   { ssr: false });

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const username = useSelector((state: any) => state.user.username);
  const isGuest  = !username || username === 'Guest';
  const router   = useRouter();

  const [mounted,            setMounted]            = useState(false);
  const [isSignInOpen,       setIsSignInOpen]       = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLoginOpen,        setIsLoginOpen]        = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isGuest) {
      setIsSignInOpen(true);
    }
  }, [mounted, isGuest]);

  const handleClose = () => {
    setIsSignInOpen(false);
    setIsVerificationOpen(false);
    setIsLoginOpen(false);
    router.push('/');
  };

  const handleGetOtp = () => {
    setIsSignInOpen(false);
    setIsVerificationOpen(true);
  };

  const handleVerified = () => {
    setIsVerificationOpen(false);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="bg-site-bg min-h-screen">
      <div className="flex px-4 md:px-8 md:py-6">
        <div className="hidden md:block md:w-[290px] flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 min-w-0">
          <ProfileBreadcrumb />
          {children}
        </div>
      </div>

      {isSignInOpen && (
        <SignIn
          onClose={handleClose}
          onGetOtpClick={handleGetOtp}
        />
      )}
      {isVerificationOpen && (
        <Verification
          onClose={handleClose}
          onSubmit={handleVerified}
        />
      )}
      {isLoginOpen && (
        <Login
          onClose={handleLoginSuccess}
        />
      )}
    </div>
  );
}
