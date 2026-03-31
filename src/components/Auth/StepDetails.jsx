'use client';

import React from 'react';
import Image from 'next/image';
import __logo from '@/Assets/Gidan_logo.webp';
const logo = typeof __logo === 'string' ? __logo : __logo?.src || __logo;

const StepDetails = ({ name, setName, referral, setReferral, onSubmit, error, loading }) => {
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
        <h1 className="text-2xl font-serif text-[#1a1f14] mb-2">Complete Profile</h1>
        <p className="text-gray-500 text-sm font-medium">Just a few more details to get started</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] transition-all text-sm font-bold"
            required
          />
        </div>

        <div>
          <label htmlFor="referral" className="block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">
            Referral Code (Optional)
          </label>
          <input
            type="text"
            id="referral"
            name="referral"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            placeholder="000000"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#375421]/20 focus:border-[#375421] transition-all text-sm font-bold tracking-widest"
          />
        </div>

        {error && <p className="text-red-500 text-[11px] mb-4 text-center font-bold px-1">{error}</p>}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className={`w-full bg-[#375421] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all
            ${loading || !name.trim() ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-[#1a1f14] hover:shadow-xl hover:shadow-[#375421]/10 active:scale-[0.98]'}
          `}
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};

export default StepDetails;
