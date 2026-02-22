'use client';

import React from "react";
import aboutUsImg from "../../../Assets/FranchiseEnquires/franchiseenquires_gidan.webp";// Ensure you have an image asset
import { Helmet } from "react-helmet-async";
import AboutUsSchema from "../seo/AboutUsSchema";

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About Gidan | Our Story, Mission & Vision</title>
                <meta
                    name="description"
                    content="GIDAN is India’s destination for curated garden products. Built by Biotech Maali, we provide plants, planters, and gardening education for Indian homes."
                />
                <link rel="canonical" href="https://www.gidan.store//about-us" />
            </Helmet>

            <div className="font-sans text-gray-800">
                {/* Header Section */}
                <header className="bg-green-100 text-center py-10 md:py-16 px-4 w-full">
                    <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-2">
                        About GIDAN
                    </h1>
                    <p className="text-lg md:text-2xl text-green-800 font-semibold">
                        Cultivating Green Ecosystems, One Plant at a Time
                    </p>
                </header>

                {/* Introduction Section
            Mobile: Text Top, Image Bottom
            Desktop: Image Left, Text Right
        */}
                <section className="p-4 md:p-12 bg-white w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 w-full">

                            {/* Content - Order 1 on Mobile, 2 on Desktop (controlled by flex-col-reverse) */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">
                                    India’s Newest Gardening Destination
                                </h2>
                                <div className="space-y-4 md:space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                                    <p>
                                        <strong>GIDAN</strong> is India’s newest destination for thoughtfully curated garden products, plants, planters, pots, garden supplies, and garden equipment. Built with a deep respect for nature and a strong commitment to education-driven gardening, GIDAN is a unit of Biotech Maali.
                                    </p>
                                    <p>
                                        Created by a plant parent—for plant lovers, growers, and cultivators across homes, farms, and agricultural ecosystems. The name <strong>GIDAN</strong> is derived from “Gida” (plant in Kannada) and “Vana” (forest in Kannada), reflecting our belief that individual plants create thriving ecosystems.
                                    </p>
                                    <p>
                                        Based in Bangalore, GIDAN draws inspiration from the city’s evolving relationship with greenery—balancing urban growth with sustainable living.
                                    </p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <img
                                    src={aboutUsImg}
                                    loading="lazy"
                                    alt="About GIDAN Illustration"
                                    className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg border border-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* The GIDAN Difference Section
            Mobile: 1 Column
            Tablet: 2 Columns
            Desktop: 3 Columns
        */}
                <section className="p-6 md:p-12 bg-gray-50 w-full">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-bold text-center text-green-900 mb-8 md:mb-12">
                            Why Choose GIDAN?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {/* Card 1 */}
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow h-full">
                                <div className="text-green-600 font-bold text-xl mb-3">Quality Tested</div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    Our focus is on quality-tested gardening and agricultural products that are practical, reliable, and suitable for Indian homes and climatic conditions.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow h-full">
                                <div className="text-green-600 font-bold text-xl mb-3">Education First</div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    We believe access to the right products must go hand in hand with the right knowledge. Our goal is to reduce trial-and-error and improve long-term plant health.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow h-full">
                                <div className="text-green-600 font-bold text-xl mb-3">Sustainable Practices</div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    All products are carefully selected to ensure they are safe for home use and aligned with sustainable gardening practices.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="p-6 md:p-16 bg-white w-full">
                    <div className="max-w-5xl mx-auto space-y-10 md:space-y-16">

                        {/* Vision */}
                        <div className="text-center px-2">
                            <h3 className="text-xl md:text-3xl font-bold text-green-800 mb-4 tracking-wide">Our Vision</h3>
                            <p className="text-gray-700 italic text-lg md:text-2xl leading-relaxed font-light">
                                "Rooted in a holistic approach—where greenery and development coexist to enable sustainable growth for humanity."
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-green-100 mx-auto w-1/2 md:w-1/4"></div>

                        {/* Mission */}
                        <div className="text-center px-2">
                            <h3 className="text-xl md:text-3xl font-bold text-green-800 mb-4 tracking-wide">Our Mission</h3>
                            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                                To provide the right set of plants, the right garden products, and the right guidance to every customer we serve.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Corporate Structure & Founder
             Mobile: Stacked
             Desktop: Side by Side
        */}
                <section className="p-6 md:p-16 bg-green-50 w-full">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                            {/* Brands List */}
                            <div className="w-full lg:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">Our Family of Brands</h2>
                                <p className="text-gray-700 mb-6 text-base md:text-lg">
                                    GIDAN operates under <strong>Farm Amino Private Limited</strong>, bringing together multiple green-focused brands:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                        <strong className="block text-green-800">Biotech Maali</strong>
                                        <span className="text-gray-600 text-sm">Garden setup and services</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                        <strong className="block text-green-800">Vaneera</strong>
                                        <span className="text-gray-600 text-sm">Landscaping solutions</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 sm:col-span-2">
                                        <strong className="block text-green-800">GIDAN</strong>
                                        <span className="text-gray-600 text-sm">Garden and agricultural products</span>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-base md:text-lg">
                                    Together, these brands work as a one-stop solution for gardening and agriculture needs, particularly for customers in and around Bangalore.
                                </p>
                            </div>

                            {/* Founder Card */}
                            <div className="w-full lg:w-1/3 bg-white p-6 md:p-8 rounded-xl shadow-md border border-green-200 flex flex-col justify-center">
                                <h3 className="text-xl font-bold text-green-800 mb-4 border-b border-green-100 pb-2">Founder</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Founded with the vision and expertise of <strong>Sujith Nadig</strong>, a biotech engineer, GIDAN is not just a store—it is a growing community committed to mindful gardening, responsible agriculture, and greener living.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <AboutUsSchema />
        </>
    );
};

export default AboutUs;