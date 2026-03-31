'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * TrustBadges Component
 * Displays a row of value propositions (badges) fetched from the API.
 * Designed with a premium, clean aesthetic using the site's color palette.
 */
const TrustBadges = ({ isGrid = false }) => {
    const [badges, setBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/trustBadges/`);
                if (res.ok) {
                    const json = await res.json();
                    setBadges(json.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch trust badges", err);
                // Fallback data provided by user in case of API failure during dev
                setBadges([
                    {
                        id: 1,
                        icon: "https://gidanbackendtest.mymotokart.in/media/trust_badges/ChatGPT_Image_Mar_30_2026_12_40_39_PM.gif",
                        title: "India-Climate Tested",
                        subtitle: "Every plant tested in Bangalore heat & humidity"
                    },
                    {
                        id: 2,
                        icon: "https://gidanbackendtest.mymotokart.in/media/trust_badges/Free_delivery_with_2000_purchase.gif",
                        title: "Free Delivery ₹2,000+",
                        subtitle: "Pan-India. Same-day in Bangalore"
                    },
                    {
                        id: 3,
                        icon: "https://gidanbackendtest.mymotokart.in/media/trust_badges/ChatGPT_Image_Mar_30_2026_12_41_22_PM.gif",
                        title: "7-Day Guarantee",
                        subtitle: "Plant doesn't survive? We reship free."
                    },
                    {
                        id: 4,
                        icon: "https://gidanbackendtest.mymotokart.in/media/trust_badges/ChatGPT_Image_Mar_30_2026_12_42_19_PM.gif",
                        title: "WhatsApp Support",
                        subtitle: "Real plant experts. Mon–Sat 9AM–7PM"
                    },
                    {
                        id: 5,
                        icon: "https://gidanbackendtest.mymotokart.in/media/trust_badges/ChatGPT_Image_Mar_30_2026_12_44_25_PM.gif",
                        title: "99.2% Arrive Healthy",
                        subtitle: "Expert packaging. Safe every time."
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBadges();
    }, []);

    if (isLoading && badges.length === 0) return null;

    if (isGrid) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {badges.filter(b => b.is_active !== false).map((badge) => (
                    <div 
                        key={badge.id}
                        className="flex flex-col p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 shrink-0 bg-[#ecf3e8] rounded-xl flex items-center justify-center overflow-hidden">
                                <Image src={badge.icon} alt={badge.title} width={24} height={24} className="object-contain" />
                            </div>
                            <h3 className="text-xs font-black text-[#1a1f14] group-hover:underline">{badge.title}</h3>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 leading-tight">
                            {badge.subtitle}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full bg-white border-y border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-[max-content] lg:w-full items-stretch">
                {badges.filter(b => b.is_active !== false).map((badge, idx) => (
                    <div 
                        key={badge.id} 
                        className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 border-r border-gray-100 last:border-r-0 transition-colors duration-300 hover:bg-gray-50/50 
                            ${badge.title.includes("7-Day") ? "bg-[#ebf4e6]/60" : ""}`}
                    >
                        {/* Icon Container */}
                        <div className="relative shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#ecf3e8] rounded-xl flex items-center justify-center overflow-hidden">
                            <Image 
                                src={badge.icon} 
                                alt={badge.title}
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col text-left shrink-0">
                            <h3 className="text-[11px] md:text-[13px] font-black text-[#1a1f14] leading-tight whitespace-nowrap">
                                {badge.title}
                            </h3>
                            <p className="text-[9px] md:text-[10px] font-medium text-[#1a1f14]/50 leading-tight mt-0.5 max-w-[120px] md:max-w-[140px]">
                                {badge.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default TrustBadges;
