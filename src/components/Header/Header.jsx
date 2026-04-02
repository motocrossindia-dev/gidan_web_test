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
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isActive, announcements]);

  return (
    <header className="bg-[#375421] font-poppins relative overflow-hidden">
      <div className="max-w-full px-4 md:px-8 py-2.5 flex items-center justify-center m-auto text-white">
        <div className="flex flex-row items-center justify-between w-full max-w-5xl mx-auto gap-4 flex-wrap font-medium">
          {isActive ? (
            announcements.map((item, index) => (
              <Link 
                key={index}
                href={item.url || "#"} 
                className="text-white text-[10px] md:text-[13px] hover:text-white/80 transition-all whitespace-nowrap"
              >
                {item.text}
              </Link>
            ))
          ) : (
            <p className="text-white text-[10px] md:text-[13px] px-0 whitespace-nowrap">
              Free Shipping above ₹2000 | Delivery in Bengaluru
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
