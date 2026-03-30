'use client';

import React, { useState } from "react";
import RecentlyViewedProducts from "../../../components/Shared/RecentlyViewedProducts";
import giftImage from "../../../Assets/Gift/Gift1.webp";

// Helper to handle Next.js image imports safely
const gift34 = typeof giftImage === 'string' ? giftImage : giftImage?.src || giftImage;

const CorporateGiftingForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center bg-white rounded-[40px] shadow-sm mb-12">
        <h2 className="text-3xl font-serif italic text-[#1a1f14] mb-6">
          Thank you for choosing Gidan
        </h2>
        <p className="text-[#4a4a4a] text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Our corporate gifting specialist will get back to you shortly to help cultivate your perfect order.
        </p>
        <div className="flex flex-col items-center gap-2 text-sm font-bold text-[#2d5a1b] uppercase tracking-widest">
           <a href="mailto:kiran@biotechmagii.com" className="hover:underline">kiran@biotechmagii.com</a>
           <a href="tel:8884981840" className="hover:underline">+91 8884981840</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 bg-white rounded-[50px] shadow-sm border border-gray-100 mb-20 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1a1f14] mb-4">
          Corporate Gifting
        </h1>
        <p className="text-[#4a4a4a] italic opacity-70">
          Tailored botanical solutions for your business environment and gifting needs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-6 py-4 bg-[#f9f9f9] border-none rounded-2xl focus:ring-2 focus:ring-[#a8e070] transition-all"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Work Email"
            className="w-full px-6 py-4 bg-[#f9f9f9] border-none rounded-2xl focus:ring-2 focus:ring-[#a8e070] transition-all"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-6 py-4 bg-[#f9f9f9] border-none rounded-2xl focus:ring-2 focus:ring-[#a8e070] transition-all"
            required
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full px-6 py-4 bg-[#f9f9f9] border-none rounded-2xl focus:ring-2 focus:ring-[#a8e070] transition-all"
          />
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you? (Bulk orders, office decor, etc.)"
          rows={4}
          className="w-full px-6 py-4 bg-[#f9f9f9] border-none rounded-2xl focus:ring-2 focus:ring-[#a8e070] transition-all"
        />
        <button
          type="submit"
          className="w-full bg-[#1a1f14] text-white py-5 rounded-2xl text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#2d5a1b] transition-all shadow-xl hover:shadow-[#a8e070]/20"
        >
          Send Inquiry
        </button>
      </form>
    </div>
  );
};

const CorporateGiftingPage = () => {
  return (
      <div className="min-h-screen pt-10 pb-20 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Hero Section */}
          <div className="relative h-64 md:h-[450px] overflow-hidden rounded-[60px] shadow-2xl mb-20 group">
            <img 
                src={gift34}
                loading="lazy"
                alt="Corporate Gifting"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Form Section */}
          <CorporateGiftingForm />

          {/* Recently Viewed Section - Category Card Style */}
          <RecentlyViewedProducts title="Recently Viewed" />
        </div>
      </div>
  );
};

export default CorporateGiftingPage;
