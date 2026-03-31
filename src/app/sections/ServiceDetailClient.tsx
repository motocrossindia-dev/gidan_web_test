'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Settings, Sun, Zap, Leaf, Clock, Phone, 
  ArrowRight, CheckCircle2, ShieldCheck, HelpCircle 
} from 'lucide-react';

interface ServiceData {
  id: number;
  Heading: string;
  title: string;
  Image: string;
}

const ServiceDetailClient = ({ serviceData }: { serviceData: ServiceData }) => {
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConnectClick = () => {
    router.push('/services');
  };

  const defaultSteps = [
    { id: '01', title: 'Consultation', description: 'Expert assessment of your specific space and requirements.', Icon: Settings },
    { id: '02', title: 'Custom Design', description: 'Tailored planning to maximize efficiency and sustainable growth.', Icon: Sun },
    { id: '03', title: 'Installation', description: 'Professional setup by our skilled technical team.', Icon: Zap },
    { id: '04', title: 'Support', description: 'Ongoing care and maintenance for long-term success.', Icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${serviceData.Image}`}
            alt={serviceData.Heading}
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-widest mb-6">
            <ShieldCheck size={12} className="text-[#A3CD39]" />
            Verified Gidan Service
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.1]">
            {serviceData.Heading}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
            {serviceData.title}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#A3CD39]" />
              Expert Service
            </div>
            <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full" />
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-[#A3CD39]" />
              +91 7483316150
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#375421] opacity-60 mb-4 block">
              Professional Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1a1f14] leading-tight mb-6">
              Our <span className="italic text-[#375421]">Expertise</span> in {serviceData.Heading}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We specialize in providing high-end, sustainable solutions for your {serviceData.Heading.toLowerCase()}. 
              Our team of experts uses state-of-the-art technology and deep botanical knowledge to ensure 
              your space thrives with minimal environmental impact.
            </p>
            
            <ul className="space-y-4">
              {[
                "Customized design for your specific space",
                "High-quality materials and professional installation",
                "Sustainable and water-efficient practices",
                "Post-installation support and maintenance"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#1a1f14]/80 font-medium">
                  <CheckCircle2 size={20} className="text-[#375421]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl">
            <Image
              src={`https://backend.gidan.store${serviceData.Image}`}
              alt="Service Setup"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Simplified Light-Theme Process Section */}
      <section className="bg-[#faf9f6] py-20 md:py-32 rounded-[40px] md:rounded-[80px] my-8 mx-4 md:mx-10 overflow-hidden relative border border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-block px-3 py-1 rounded-full bg-[#375421]/5 text-[#375421] text-[10px] font-black uppercase tracking-[0.25em] mb-4">
              Our Process
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1a1f14] leading-tight mb-6">
              A Journey to <span className="italic text-[#375421]">Green Reality</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
              A streamlined, professional journey from your initial idea to a flourishing green reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {defaultSteps.map(({ id, title, description, Icon }) => (
              <div key={id} className="relative group">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:bg-[#375421] group-hover:border-[#375421] transition-all duration-500 group-hover:shadow-[0_10px_25px_-5px_rgba(55,84,33,0.2)]">
                    <Icon size={24} className="text-[#375421] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-[11px] font-black text-[#375421]/30 mb-2 block tracking-widest">{id}</span>
                  <h3 className="text-xl font-serif text-[#1a1f14] mb-4 group-hover:text-[#375421] transition-colors duration-500">{title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm font-medium">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button
              onClick={handleConnectClick}
              className="group flex items-center gap-4 bg-[#375421] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#1a1f14] transition-all duration-500 shadow-xl shadow-[#375421]/10"
            >
              Start Your Project
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ/CTA Support */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <HelpCircle size={48} className="mx-auto text-[#375421] opacity-20 mb-6" />
        <h2 className="text-2xl md:text-3xl font-serif text-[#1a1f14] mb-4">
          Still Have Questions?
        </h2>
        <p className="text-gray-500 mb-8">
          Our garden experts are ready to help you choose the right solution for your home or business.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="tel:+917483316150" 
            className="flex items-center gap-2 text-[12px] font-bold text-[#375421] border-b-2 border-[#375421]/10 hover:border-[#375421] transition-all pb-1"
          >
            Call +91 7483316150
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailClient;
