'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import __logo from '@/Assets/Gidan_logo.webp';
const logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;

const StepOTP = ({ otp, setOtp, mobile, onSubmit, error, loading, onResend }) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < 3) inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <Image 
          src={logo} 
          alt="Gidan Logo" 
          width={120} 
          height={80} 
          className="mx-auto mb-6 h-16 w-auto object-contain"
        />
        <h1 className="text-2xl font-serif text-[#1a1f14] mb-2">Verify OTP</h1>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          Sent to <span className="text-[#375421] font-bold">+91 {mobile}</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-between gap-4 mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-14 text-center text-xl font-bold rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] transition-all group-hover:bg-white"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-[11px] mb-4 text-center font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading || otp.join('').length < 4}
          className={`w-full bg-[#1a1f14] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all
            ${loading || otp.join('').length < 4 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-[#375421] hover:shadow-xl hover:shadow-[#375421]/10 active:scale-[0.98]'}
          `}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={onResend}
          className="text-[11px] font-black uppercase tracking-[0.15em] text-[#375421] hover:text-[#1a1f14] transition-all"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default StepOTP;
