import React from "react";
import Image from "next/image";
import { Star, Smartphone, Package, Clock, Leaf } from "lucide-react";

const DownloadApp = () => {
    return (
        <section className="relative w-full bg-[#173113] py-12 lg:py-0 lg:h-[440px] xl:h-[480px] px-6 lg:px-16 overflow-hidden flex items-center" style={{ backgroundColor: "#173113" }}>

            <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full">
                {/* Left Content */}
                <div className="w-full lg:w-[50%] xl:w-[55%] flex flex-col items-start text-left z-20">
                    <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold mb-3">
                        Download the app
                    </span>

                    <h2 className="text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] text-white font-serif tracking-tight mb-4 !leading-[1.1]">
                        Your garden, <br className="hidden md:block" />
                        <span className="italic text-[#A7D949]">in your pocket.</span>
                    </h2>

                    <p className="text-white/70 text-sm max-w-[420px] mb-8 leading-relaxed font-medium">
                        App-only deals, live order tracking, plant care reminders, and seamless shopping — always just a tap away.
                    </p>

                    {/* Feature Pills (Matches User Screenshot Style) */}
                    <div className="flex flex-wrap gap-2.5 mb-8">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-transparent text-[11px] text-white/90">
                            <Smartphone className="w-3.5 h-3.5 text-[#A7D949]" /> App-only deals
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-transparent text-[11px] text-white/90">
                            <Package className="w-3.5 h-3.5 text-[#A7D949]" /> Live order tracking
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-transparent text-[11px] text-white/90">
                            <Clock className="w-3.5 h-3.5 text-[#A7D949]" /> Care reminders
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-transparent text-[11px] text-white/90">
                            <Leaf className="w-3.5 h-3.5 text-[#A7D949]" /> Plant journal
                        </div>
                    </div>

                    {/* Full Logo Badge Buttons - Horizontal & Massive - Reduced Gap */}
                    <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
                        {/* Google Play - Full Badge */}
                        <a
                            href="#"
                            className="group transition-all duration-300 hover:scale-105 active:scale-95 block h-[120px] md:h-[150px] min-w-[200px]"
                        >
                            <Image
                                src="/playstore.svg"
                                alt="Get it on Google Play"
                                width={400}
                                height={150}
                                className="h-full w-auto object-contain"
                                priority
                            />
                        </a>

                        {/* App Store - Full Badge */}
                        <a
                            href="#"
                            className="group transition-all duration-300 hover:scale-105 active:scale-95 block h-[120px] md:h-[150px] min-w-[200px]"
                        >
                            <Image
                                src="/appstore.svg"
                                alt="Download on the App Store"
                                width={400}
                                height={150}
                                className="h-full w-auto object-contain"
                                priority
                            />
                        </a>
                    </div>

                    {/* Maybe Later (Secondary Action) */}
                </div>

                {/* Right Content - Stats Grid */}
                <div className="w-full lg:w-[50%] xl:w-[45%] h-full flex flex-col items-center justify-center lg:items-end lg:justify-center mt-8 lg:mt-0">
                    <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full max-w-[400px]">
                        {/* 50K+ APP DOWNLOADS */}
                        <div className="flex flex-col gap-1.5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
                            <span className="text-3xl lg:text-4xl text-[#A7D949] font-serif leading-none">50K+</span>
                            <span className="text-[10px] text-white/70 font-bold tracking-wider uppercase mt-1">App downloads</span>
                        </div>

                        {/* 4.7 APP STORE RATING */}
                        <div className="flex flex-col gap-1.5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
                            <span className="text-3xl lg:text-4xl text-[#A7D949] font-serif flex items-center gap-1.5 leading-none">
                                4.7 <Star className="w-5 h-5 lg:w-6 lg:h-6 text-[#A7D949] fill-[#A7D949] -mt-1" />
                            </span>
                            <span className="text-[10px] text-white/70 font-bold tracking-wider uppercase mt-1">App store rating</span>
                        </div>

                        {/* 200+ PLANT VARIETIES */}
                        <div className="flex flex-col gap-1.5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
                            <span className="text-3xl lg:text-4xl text-[#A7D949] font-serif leading-none">200+</span>
                            <span className="text-[10px] text-white/70 font-bold tracking-wider uppercase mt-1">Plant varieties</span>
                        </div>

                        {/* 12K+ HAPPY GARDENERS */}
                        <div className="flex flex-col gap-1.5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg">
                            <span className="text-3xl lg:text-4xl text-[#A7D949] font-serif leading-none">12K+</span>
                            <span className="text-[10px] text-white/70 font-bold tracking-wider uppercase mt-1">Happy gardeners</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadApp;
