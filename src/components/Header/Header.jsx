'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/utils/announcement/`);
        if (response.data && response.data.is_active && response.data.items?.length > 0) {
          setAnnouncements(response.data.items);
          setIsActive(true);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (isActive && announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000); // 5-second interval for better readability
      return () => clearInterval(timer);
    }
  }, [isActive, announcements]);

  return (
    <header className="bg-[#375421] font-poppins relative overflow-hidden min-h-[34px] md:h-auto flex items-center py-1.5 md:py-2.5 w-full">
      <div className="w-full flex items-center justify-center text-white px-2">
        <div className="relative w-full font-medium">
          
          {/* DESKTOP LAYOUT (MD+): Show all announcements side-by-side on one line */}
          <div className="hidden md:flex flex-row items-center justify-center gap-6 lg:gap-8 overflow-hidden">
            {isActive && announcements.length > 0 ? (
              announcements.map((item, idx) => (
                <React.Fragment key={idx}>
                  <Link 
                    href={item.url || "#"} 
                    className="text-white text-[11px] lg:text-[12px] hover:text-[#A7D949] transition-all uppercase tracking-[0.12em] whitespace-nowrap"
                  >
                    {item.text}
                  </Link>
                  {idx < announcements.length - 1 && (
                    <span className="text-white/20 text-[9px] select-none">|</span>
                  )}
                </React.Fragment>
              ))
            ) : (
               <p className="text-white text-[11px] lg:text-[12px] uppercase tracking-[0.12em] whitespace-nowrap">
                Free Shipping above ₹2000 | Delivery in Bengaluru
              </p>
            )}
          </div>

          {/* MOBILE LAYOUT (SM): Show one announcement with transition */}
          <div className="md:hidden flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {isActive && announcements.length > 0 ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full text-center"
                >
                  <Link 
                    href={announcements[currentIndex].url || "#"} 
                    className="text-white text-[9px] hover:text-white/80 transition-all uppercase tracking-[0.08em] inline-block px-4 font-semibold"
                  >
                    {announcements[currentIndex].text}
                  </Link>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-[9px] text-center uppercase tracking-[0.08em] font-semibold"
                >
                  Free Shipping above ₹2000 | Delivery in Bengaluru
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Subtle Progress Bar for mobile multiple announcements */}
            {isActive && announcements.length > 1 && (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none opacity-30">
                {announcements.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      currentIndex === idx ? 'w-3 bg-white' : 'w-1 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
