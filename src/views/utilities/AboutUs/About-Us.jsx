'use client';

import React from "react";
import Image from "next/image";
import aboutUsImg from "../../../Assets/OurWork/ourwork3.webp";
import CategoryHero from "@/components/Shared/CategoryHero";
import { Leaf, GraduationCap, Globe, CheckCircle2 } from "lucide-react";
import AboutUsSchema from "../seo/AboutUsSchema";

const AboutUs = () => {
    const _aboutUsImg = typeof aboutUsImg === 'string' ? aboutUsImg : aboutUsImg?.src || aboutUsImg;

    const aboutHeroData = {
        heading_before: "About",
        italic_text: "Gidan",
        heading_after: "Our Mission",
        description: "Cultivating Green Ecosystems, One Plant at a Time. Built with a deep respect for nature and a commitment to education-driven gardening.",
    };

    const breadcrumb = {
        items: [],
        currentPage: "About Us"
    };
    
    return (
        <main className="font-sans text-[#173113] bg-[#faf9f6]">
            <AboutUsSchema />
            
            <CategoryHero 
                data={aboutHeroData} 
                breadcrumb={breadcrumb}
            />

            {/* Introduction Section */}
            <section className="py-20 px-6 lg:px-16 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
                        {/* Content */}
                        <div className="w-full lg:w-1/2">
                            <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold mb-4 block">
                                The Story
                            </span>
                            <h2 className="text-4xl md:text-5xl text-[#173113] font-serif tracking-tight mb-8 !leading-[1.1]">
                                India’s newest <span className="italic text-[#A7D949]">gardening destination.</span>
                            </h2>
                            
                            <div className="space-y-6 text-[#173113]/70 text-base md:text-lg leading-relaxed font-medium">
                                <p>
                                    <strong className="text-[#173113]">Gidan</strong> is India’s newest destination for thoughtfully curated garden products, plants, planters, pots, and supplies. Built with a deep respect for nature and a commitment to education-driven gardening, we are a unit of Biotech Maali.
                                </p>
                                <p>
                                    Created by a plant parent—for plant lovers and cultivators. The name <strong className="text-[#173113]">Gidan</strong> is derived from <span className="italic text-[#375421]">“Gida”</span> (Plant in Kannada) and <span className="italic text-[#375421]">“Vana”</span> (Forest in Kannada), reflecting our belief that individual plants create thriving ecosystems.
                                </p>
                                <p>
                                    Based in Bangalore, we draw inspiration from the city’s evolving relationship with greenery—balancing urban growth with sustainable, mindful living.
                                </p>
                            </div>
                        </div>

                        {/* Image Container */}
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-[#A7D949]/10 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src={_aboutUsImg}
                                    loading="lazy"
                                    alt="About Gidan Illustration"
                                    className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The GIDAN Difference Section */}
            <section className="py-24 px-6 lg:px-16 bg-white relative overflow-hidden">
                {/* Subtle Botanical SVG Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 text-[#A7D949]/5 -mr-20 -mt-20">
                   <Leaf className="w-full h-full rotate-45" />
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl text-[#173113] font-serif tracking-tight mb-16 !leading-[1.1]">
                        Why Choose <span className="italic text-[#A7D949]">Gidan?</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Card 1 */}
                        <div className="group bg-[#faf9f6] p-10 rounded-[2.5rem] hover:bg-[#173113] transition-all duration-500 text-left border border-[#173113]/5 hover:translate-y-[-8px]">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#A7D949] transition-colors">
                                <CheckCircle2 className="w-7 h-7 text-[#173113]" />
                            </div>
                            <h3 className="text-2xl font-serif text-[#173113] group-hover:text-white mb-4 transition-colors">Quality Tested</h3>
                            <p className="text-[#173113]/70 group-hover:text-white/80 leading-relaxed font-medium line-clamp-4 transition-colors">
                                Our focus is on quality-tested gardening and agricultural products that are practical, reliable, and suitable for Indian climatic conditions.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-[#faf9f6] p-10 rounded-[2.5rem] hover:bg-[#173113] transition-all duration-500 text-left border border-[#173113]/5 hover:translate-y-[-8px]">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#A7D949] transition-colors">
                                <GraduationCap className="w-7 h-7 text-[#173113]" />
                            </div>
                            <h3 className="text-2xl font-serif text-[#173113] group-hover:text-white mb-4 transition-colors">Education First</h3>
                            <p className="text-[#173113]/70 group-hover:text-white/80 leading-relaxed font-medium line-clamp-4 transition-colors">
                                We believe right products must go hand in hand with right knowledge. Our goal is to reduce trial-and-error and improve long-term plant health.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-[#faf9f6] p-10 rounded-[2.5rem] hover:bg-[#173113] transition-all duration-500 text-left border border-[#173113]/5 hover:translate-y-[-8px]">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#A7D949] transition-colors">
                                <Globe className="w-7 h-7 text-[#173113]" />
                            </div>
                            <h3 className="text-2xl font-serif text-[#173113] group-hover:text-white mb-4 transition-colors">Sustainability</h3>
                            <p className="text-[#173113]/70 group-hover:text-white/80 leading-relaxed font-medium line-clamp-4 transition-colors">
                                All products are carefully selected to ensure they are safe for home use and aligned with sustainable, mindful gardening practices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Elevated Text Section */}
            <section className="py-24 px-6 lg:px-16 bg-[#173113] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <img src="/logo.webp" alt="Gidan Logo watermark" className="w-full h-full object-contain grayscale invert scale-150" />
                </div>
                
                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-20">
                    <div className="space-y-6">
                        <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold opacity-80">Our Vision</span>
                        <h3 className="text-3xl md:text-5xl text-white font-serif leading-tight">
                            "Rooted in a holistic approach—where <span className="italic text-[#A7D949]">greenery and development</span> coexist to enable sustainable growth for humanity."
                        </h3>
                    </div>
                    
                    <div className="w-24 h-px bg-white/20 mx-auto" />

                    <div className="space-y-6">
                        <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold opacity-80">Our Mission</span>
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
                            To provide the right set of plants, the right garden products, and the right guidance to every customer we serve.
                        </p>
                    </div>
                </div>
            </section>

            {/* Brands & Founder Grid */}
            <section className="py-24 px-6 lg:px-16 bg-[#faf9f6]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Family and Brands Card */}
                        <div className="w-full lg:w-2/3">
                            <h2 className="text-4xl text-[#173113] font-serif tracking-tight mb-8">Our Family of <span className="italic text-[#A7D949]">Brands</span></h2>
                            <p className="text-[#173113]/70 mb-10 text-lg leading-relaxed font-medium max-w-2xl">
                                Gidan operates under <strong className="text-[#173113]">Farm Amino Private Limited</strong>, bringing together multiple specialized green-focused brands.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#173113]/5 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                    <h3 className="text-xl font-bold text-[#173113] mb-2">Biotech Maali</h3>
                                    <p className="text-[#173113]/60 text-sm font-medium">Expert garden setup and maintenance services for homes and commercial spaces.</p>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#173113]/5 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                    <h3 className="text-xl font-bold text-[#173113] mb-2">Vaneera</h3>
                                    <p className="text-[#173113]/60 text-sm font-medium">Bespoke landscaping and large-scale greenery solutions for luxury estates.</p>
                                </div>
                                <div className="bg-[#A7D949] p-8 rounded-3xl shadow-sm border border-[#173113]/5 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 sm:col-span-2">
                                    <h3 className="text-xl font-bold text-[#173113] mb-2">GIDAN</h3>
                                    <p className="text-[#173113]/80 text-sm font-medium">Your premium destination for garden and agricultural products, tools, and supplies.</p>
                                </div>
                            </div>
                        </div>

                        {/* Founder Spotlight */}
                        <div className="w-full lg:w-1/3 flex flex-col justify-end">
                            <div className="bg-[#173113] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A7D949]/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                <h3 className="text-2xl font-serif mb-6 inline-block border-b border-[#A7D949] pb-2">The Founder</h3>
                                <p className="text-white/80 leading-relaxed font-medium mb-8">
                                    Founded with the vision and expertise of <strong className="text-white italic">Sujith Nadig</strong>, a biotech engineer, Gidan is not just a store—it is a growing community committed to mindful gardening, responsible agriculture, and greener living.
                                </p>
                                <div className="flex items-center gap-2 text-[#A7D949] font-bold text-sm">
                                    <CheckCircle2 className="w-4 h-4" /> BIO-ENGINEERED ROOTS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
export default AboutUs;