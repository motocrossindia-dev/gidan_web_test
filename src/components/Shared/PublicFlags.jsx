'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Clock, Sun, Zap, LayoutGrid } from 'lucide-react';
import axiosInstance from '../../Axios/axiosInstance';

/**
 * PublicFlags - Interactive pill carousel for global product flags.
 * Source: /product/public-flags/
 */
const PublicFlags = ({ selectedFlag, onSelectFlag, initialFlags = [] }) => {
    const [flags, setFlags] = useState(initialFlags || []);
    const [loading, setLoading] = useState(!initialFlags || (Array.isArray(initialFlags) && initialFlags.length === 0));

    useEffect(() => {
        // Only fetch if initialFlags are not provided or empty
        if (Array.isArray(initialFlags) && initialFlags.length > 0) {
            setLoading(false);
            setFlags(initialFlags);
            return;
        }


        const fetchFlags = async () => {
            try {
                const res = await axiosInstance.get('/product/public-flags/');
                if (res.data?.flags) {
                    setFlags(res.data.flags);
                }
            } catch (err) {
                console.error('Error fetching public flags:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlags();
    }, [initialFlags]);


    // Icon mapping based on flag name/slug
    const getFlagIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('featured')) return <Star size={14} />;
        if (lower.includes('best_seller')) return <Award size={14} />;
        if (lower.includes('latest')) return <Clock size={14} />;
        if (lower.includes('seasonal')) return <Sun size={14} />;
        if (lower.includes('trending')) return <Zap size={14} />;
        return <Star size={14} />;
    };

    if (loading && flags.length === 0) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-4 px-4 md:px-8 no-scrollbar">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-32 bg-gray-100 animate-pulse rounded-full flex-shrink-0" />
                ))}
            </div>
        );
    }

    return (
        <div className="relative w-full py-6">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 md:px-8 scroll-smooth">
                {/* All Products / Reset Toggle */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectFlag(null)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border-2 whitespace-nowrap flex-shrink-0 shadow-sm ${
                        !selectedFlag 
                        ? "bg-[#375421] border-[#375421] text-white shadow-[#375421]/20" 
                        : "bg-white border-gray-100 text-gray-500 hover:border-[#375421] hover:text-[#375421]"
                    }`}
                >
                    <LayoutGrid size={14} className={!selectedFlag ? "text-white" : "text-gray-400"} />
                    <span>All Collections</span>
                </motion.button>

                {flags.map((flag) => {
                    const isActive = Number(selectedFlag) === Number(flag.id);
                    return (
                        <motion.button
                            key={flag.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectFlag(isActive ? null : flag.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border-2 whitespace-nowrap flex-shrink-0 shadow-sm ${
                                isActive 
                                ? "bg-[#375421] border-[#375421] text-white shadow-[#375421]/20" 
                                : "bg-white border-gray-100 text-gray-500 hover:border-[#375421] hover:text-[#375421]"
                            }`}
                        >
                            <span className={isActive ? "text-white" : "text-[#375421]/60"}>
                                {getFlagIcon(flag.name)}
                            </span>
                            <span>{flag.label}</span>
                        </motion.button>
                    );
                })}

            </div>

            {/* Subtle scroll masks for mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden opacity-50" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden opacity-50" />
        </div>
    );
};

export default PublicFlags;
