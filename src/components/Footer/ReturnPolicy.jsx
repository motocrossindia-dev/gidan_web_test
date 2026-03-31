'use client';

import React, { useEffect } from 'react';
import PageHeader from "@/components/Shared/PageHeader";
import { Mail, Phone, Heart, Trash2, Clock, CheckCircle, AlertCircle, Info, Star, ShieldCheck } from 'lucide-react';
import HomepageSchema from "../../views/utilities/seo/HomepageSchema";
import StoreSchema from "../../views/utilities/seo/StoreSchema";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-24 font-sans text-[#173113]">
      <PageHeader 
        title="Refund & Cancellation" 
        subtitle="Our commitment to your satisfaction and the well-being of our green companions."
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-[#173113]/5">
          
          {/* Poetic Intro Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#A7D949]/10 rounded-full text-[#173113] text-[10px] font-black uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 text-[#A7D949]" />
              Gidan Promise
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#173113] mb-8 leading-tight">Your satisfaction is our priority.</h1>
            <div className="max-w-2xl mx-auto space-y-6 text-[#173113]/70 font-medium leading-relaxed italic text-lg">
              <p>
                "We've nurtured your plant with love and care, watching it grow, knowing it was meant for you. It was chosen just for you, and now, we're carefully packing it—wrapping it with the same warmth and attention it received while growing."
              </p>
              <p>
                "Somewhere, a little green life is waiting to become part of your world, to brighten your space, to grow with you. It's more than just a plant—it's a living, breathing promise of fresh beginnings."
              </p>
            </div>
          </div>

          <div className="space-y-16">
            {/* Common Understanding */}
            <section className="bg-[#faf9f6] p-8 rounded-[2.5rem] border border-[#173113]/5">
               <div className="flex gap-4 items-start">
                  <Info className="w-6 h-6 text-[#A7D949] shrink-0 mt-1" />
                  <div className="space-y-4">
                    <p className="text-[#173113]/80 font-bold leading-relaxed">
                      At Gidan, we take great care in delivering healthy and thriving plants.
                    </p>
                    <p className="text-[#173113]/60 text-sm font-medium leading-relaxed">
                      Due to the nature of live plants, it is common for them to show minor signs of stress during transit. But be assured, with proper care, your plant will quickly recover. Natural variations occur, and factors like size or color may differ slightly from images—this reflects each plant's unique growth pattern.
                    </p>
                  </div>
               </div>
            </section>

            {/* Replacement Policy */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Replacement Policy</h2>
              </div>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-[#faf9f6] rounded-2xl border border-[#173113]/5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#A7D949] mb-4">Eligibility</h3>
                    <ul className="space-y-3">
                      {["Damaged upon arrival", "Wrong item delivered"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[#173113] font-bold text-sm">
                           <CheckCircle className="w-4 h-4 text-[#A7D949]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-[#faf9f6] rounded-2xl border border-[#173113]/5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#A7D949] mb-4">The Process</h3>
                    <p className="text-[#173113]/70 text-xs font-medium leading-relaxed">
                      Once approved, a replacement will be dispatched at no cost. If unavailable, we offer alternatives, store credit, or a original payment refund.
                    </p>
                  </div>
                </div>

                <div className="bg-[#173113] p-8 rounded-[2.5rem] text-white">
                   <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="space-y-2">
                        <h4 className="text-xl font-serif">How to request?</h4>
                        <p className="text-white/60 text-sm font-medium">Contact us within 24 hours of delivery.</p>
                      </div>
                      <div className="flex flex-col gap-3">
                         <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full border border-white/10">
                            <Phone className="w-4 h-4 text-[#A7D949]" />
                            <span className="font-bold text-sm">+91 7483316150</span>
                         </div>
                         <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full border border-white/10">
                            <Mail className="w-4 h-4 text-[#A7D949]" />
                            <span className="font-bold text-sm">info@gidan.store</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Cancellation */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                   <Trash2 className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Cancellation Policy</h2>
              </div>
              <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 italic relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 text-orange-600/5 -mr-8 -mt-8">
                    <Clock className="w-full h-full" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <p className="text-orange-900/80 font-bold leading-relaxed">
                       Orders can be canceled within <span className="underline decoration-orange-300">2 hours</span> of placement for a full refund.
                    </p>
                    <p className="text-orange-900/60 text-sm font-medium">
                       Once your order has been shipped, cancellations will no longer be possible as our team has already started the delicate process of preparing your plant for its journey.
                    </p>
                 </div>
              </div>
            </section>

            {/* Refund Policy */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                   <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Refund Eligibility</h2>
              </div>
              <div className="space-y-6">
                <p className="text-[#173113]/70 font-medium leading-relaxed px-2">
                  Refunds are processed at our discretion on a case-by-case basis. Eligibility includes incorrect items delivered or products damaged/lost in transit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex gap-4 p-6 bg-white border border-[#173113]/10 rounded-[2rem] items-center">
                      <div className="w-10 h-10 rounded-full bg-[#faf9f6] flex items-center justify-center shrink-0">
                         <Trash2 className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                         <h4 className="font-bold text-sm text-[#173113]">Damaged Items</h4>
                         <p className="text-[10px] opacity-50 uppercase font-black tracking-widest">Full Refund</p>
                      </div>
                   </div>
                   <div className="flex gap-4 p-6 bg-white border border-[#173113]/10 rounded-[2rem] items-center">
                      <div className="w-10 h-10 rounded-full bg-[#faf9f6] flex items-center justify-center shrink-0">
                         <Heart className="w-4 h-4 text-[#A7D949]" />
                      </div>
                      <div>
                         <h4 className="font-bold text-sm text-[#173113]">Other Cases</h4>
                         <p className="text-[10px] opacity-50 uppercase font-black tracking-widest">Case-specific</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <HomepageSchema />
      <StoreSchema />
    </main>
  );
};

export default RefundPolicy;