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
    <header className="bg-[#375421] font-poppins relative overflow-hidden h-[34px] md:h-[40px] flex items-center">
      <div className="w-full px-4 md:px-8 py-1 flex items-center justify-center m-auto text-white">
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center font-medium">
          <AnimatePresence mode="wait">
            {isActive && announcements.length > 0 ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full text-center"
              >
                <Link 
                  href={announcements[currentIndex].url || "#"} 
                  className="text-white text-[10px] md:text-[13px] hover:text-white/80 transition-all uppercase tracking-wider inline-block"
                >
                  {announcements[currentIndex].text}
                </Link>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-[10px] md:text-[13px] text-center uppercase tracking-wider"
              >
                Free Shipping above ₹2000 | Delivery in Bengaluru
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* Subtle Progress Bar for multiple announcements */}
          {isActive && announcements.length > 1 && (
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none opacity-30">
              {announcements.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    currentIndex === idx ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
