'use client';

import React from "react";
import __WhyWeRockImage from "../../../Assets/franches_banners/Franchise Page Banner-3.jpg.webp";
import { Leaf } from "lucide-react";

const WhyWeRock = () => {
    const _WhyWeRockImage = typeof __WhyWeRockImage === 'string' ? __WhyWeRockImage : __WhyWeRockImage?.src || __WhyWeRockImage;

    return (
        <section className="bg-[#faf9f6] py-20 px-6 lg:px-16 relative overflow-hidden">
            {/* Subtle Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 text-[#A7D949]/5 -mr-20 -mt-20">
                <Leaf className="w-full h-full rotate-45" />
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold mb-4 block">
                    Our Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl text-[#173113] font-serif tracking-tight mb-8 !leading-tight">
                    Why We <span className="italic text-[#A7D949]">Rock?</span>
                </h2>

                <p className="text-[#173113]/70 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
                    Gidan is India’s newest destination for thoughtfully curated garden products, plants, planters, and supplies. Built with a deep respect for nature and a strong commitment to education-driven gardening, we represent a community of plant lovers, growers, and cultivators across homes, farms, and agricultural ecosystems.
                </p>

                {/* Image Container - Premium Styling */}
                <div className="relative group max-w-5xl mx-auto">
                    <div className="absolute -inset-4 bg-[#173113]/5 rounded-[3rem] rotate-1 group-hover:rotate-0 transition-transform duration-700" />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-[#173113]/5 overflow-hidden">
                        <img
                            src={_WhyWeRockImage}
                            alt="Gidan Outlet Showcase"
                            loading="lazy"
                            className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-1000"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyWeRock;