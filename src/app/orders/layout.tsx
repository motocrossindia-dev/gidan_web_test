'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const SignIn       = dynamic(() => import('@/AuthPages/SignIn/Signin'),             { ssr: false });
const Verification = dynamic(() => import('@/AuthPages/Verification/Verification'), { ssr: false });
const Login        = dynamic(() => import('@/AuthPages/Login/Login'),               { ssr: false });

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const username = useSelector((state: any) => state.user.username);
  const isGuest  = !username || username === 'Guest';
  const router   = useRouter();

  const [isSignInOpen,       setIsSignInOpen]       = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isLoginOpen,        setIsLoginOpen]        = useState(false);

  useEffect(() => {
    if (isGuest) {
      setIsSignInOpen(true);
    }
  }, [isGuest]);

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
    <div className="min-h-screen bg-gray-50">
      {isGuest ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400 text-sm">Please sign in to view your orders.</p>
        </div>
      ) : (
        children
      )}

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
