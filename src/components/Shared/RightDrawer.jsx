'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from 'lucide-react';

/**
 * A reusable Right Side Drawer (Sidebar) component used for 
 * selection lists like Coupons, Addresses, etc.
 */
const RightDrawer = ({ isOpen, onClose, title, subtitle, children, footerIcon, footerText }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div 
      className="fixed inset-0" 
      style={{ zIndex: 2147483647 }} 
    >
      {/* Overlay with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[4px] transition-opacity animate-in fade-in"
        style={{ zIndex: 2147483647 }}
        onClick={onClose}
      />

      {/* Drawer coming from the RIGHT */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[500px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out"
        style={{ zIndex: 2147483647 }}
      >
        {/* Header - Styled to be prominent and clear */}
        <div className="p-6 border-b flex justify-between items-center bg-site-bg/80">
          <div>
            <h3 className="font-black text-gray-900 text-xl tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-site-bg transition-all hover:rotate-90 shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {children}
        </div>

        {/* Footer - Optional informational area */}
        {(footerText || footerIcon) && (
          <div className="p-6 bg-site-bg border-t">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                {footerIcon || <Tag size={18} className="text-[#375421]" />}
              </div>
              <p className="text-[11px] font-bold leading-tight uppercase tracking-tight">
                {footerText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default RightDrawer;
