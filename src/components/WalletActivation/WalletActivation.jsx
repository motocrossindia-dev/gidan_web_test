'use client';


import React, { useRef, useEffect } from 'react';
import __wallet from '../../Assets/Wallet.webp';
const _wallet = typeof __wallet === 'string' ? __wallet : __wallet?.src || __wallet;
const wallet = typeof _wallet === 'string' ? _wallet : _wallet?.src || _wallet;

const WalletActivation = ({ onClose }) => {
  // Create a ref for the popup container
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[11000]">
      <div
        ref={popupRef}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wallet Activation</h2>
          <img name=" " src={wallet} alt="Wallet Activation" className="w-48 h-48 rounded-full mb-4" />
          <p className="text-lg text-gray-700 mb-4">Please Login to activate the Wallet</p>
        </div>
      </div>
    </div>
  );
};

export default WalletActivation;
