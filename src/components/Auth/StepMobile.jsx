'use client';

import React from 'react';
import Image from 'next/image';
import __logo from '@/Assets/Gidan_logo.webp';
const logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;

const StepMobile = ({ mobile, setMobile, onSubmit, error, loading }) => {
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
        <h1 className="text-2xl font-serif text-[#1a1f14] mb-2">Welcome to Gidan</h1>
        <p className="text-gray-500 text-sm font-medium">Enter your mobile number to get started</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="mobile" className="block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">
            Mobile Number
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(e) => e.target.value.length <= 10 && setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] transition-all text-sm font-bold tracking-widest group-hover:bg-white"
              required
            />
          </div>
          {error && <p className="text-red-500 text-[11px] mt-2 font-bold px-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || mobile.length < 10}
          className={`w-full bg-[#375421] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all
            ${loading || mobile.length < 10 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-[#1a1f14] hover:shadow-xl hover:shadow-[#375421]/10 active:scale-[0.98]'}
          `}
        >
          {loading ? 'Requesting OTP...' : 'Get OTP'}
        </button>
      </form>

      <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed max-w-[280px] mx-auto">
        By continuing, you agree to Gidan's <br/>
        <a href="/terms" className="text-[#375421] font-bold border-b border-[#375421]/10 hover:border-[#375421] transition-all">Terms of Service</a> & <a href="/privacy-policy" className="text-[#375421] font-bold border-b border-[#375421]/10 hover:border-[#375421] transition-all">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default StepMobile;
