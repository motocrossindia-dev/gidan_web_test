'use client';

import React, { useEffect } from 'react';
import CategoryHero from "@/components/Shared/CategoryHero";
import { Truck, Package, RefreshCw, MessageCircle, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, Info, Zap } from 'lucide-react';
import HomepageSchema from "../../views/utilities/seo/HomepageSchema";
import StoreSchema from "../../views/utilities/seo/StoreSchema";

const ShippingPolicy = () => {
  const shippingHeroData = {
    heading_before: "Shipping &",
    italic_text: "Delivery",
    heading_after: "Promise",
    description: "Ensuring your green companions reach you safely and swiftly across India. We partner with reputed courier agencies for a safe and timely delivery.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "Shipping Policy"
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-24 font-sans text-[#173113]">
      <CategoryHero 
        data={shippingHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-[#173113]/5">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-[#173113] mb-6">Delivery Promise</h1>
            <p className="text-[#173113]/70 font-medium leading-relaxed text-lg">
              Gidan ensures quality products and premium packaging. We have partnered with reputed courier agencies for a safe and timely delivery. 
              <span className="text-[#A7D949] font-bold ml-2">Enjoy free shipping on orders above ₹2000.</span>
            </p>
          </div>

          <div className="space-y-16">
            {/* Delivery Timelines */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Order Timelines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#faf9f6] p-8 rounded-[2rem] border border-[#173113]/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 text-[#A7D949]/10 -mr-6 -mt-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-full h-full" />
                  </div>
                  <span className="text-[10px] text-[#A7D949] font-black uppercase tracking-widest block mb-1">Dispatch</span>
                  <p className="text-2xl font-serif text-[#173113] mb-2">Within 1 Day</p>
                  <p className="text-[#173113]/50 text-xs font-bold leading-tight uppercase tracking-tight">From our sustainable warehouse</p>
                </div>
                <div className="bg-[#faf9f6] p-8 rounded-[2rem] border border-[#173113]/5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 text-[#A7D949]/10 -mr-6 -mt-6 group-hover:scale-110 transition-transform">
                    <Truck className="w-full h-full" />
                  </div>
                  <span className="text-[10px] text-[#A7D949] font-black uppercase tracking-widest block mb-1">Delivery</span>
                  <p className="text-2xl font-serif text-[#173113] mb-2">2-6 Work Days</p>
                  <p className="text-[#173113]/50 text-xs font-bold leading-tight uppercase tracking-tight">Across most Indian pin codes</p>
                </div>
              </div>
            </section>

            {/* Plant Returns - Critical Info */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-serif text-red-600">Can you return plants?</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
                  <p className="text-red-900/80 font-bold leading-relaxed mb-6">
                     Gidan does not accept returns on plants as they may perish due to transit stress. However, we guarantee every plant will arrive at your doorstep in great condition.
                  </p>
                  <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-red-200/50 flex gap-4 items-center">
                    <Info className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-xs text-red-900/70 font-medium">
                      If your plant arrives damaged, contact us within 24 hours with photos for a resolution.
                    </p>
                  </div>
                </div>

                <div className="bg-[#A7D949]/10 p-8 rounded-[2.5rem] border border-[#A7D949]/20">
                   <h4 className="text-[#173113] font-bold mb-3 flex items-center gap-2">
                     <RefreshCw className="w-4 h-4 text-[#A7D949]" /> Reviving your plant
                   </h4>
                   <p className="text-[#173113]/70 font-medium text-sm leading-relaxed">
                     Plants might look slightly dull due to transit stress. Exposure to indirect sunlight and proper watering will revive them to their natural healthy state within a few days.
                   </p>
                </div>
              </div>
            </section>

            {/* Non-Plant Returns */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Non-Plant Products</h2>
              </div>
              <div className="bg-[#faf9f6] p-8 rounded-[2.5rem] border border-[#173113]/5">
                 <p className="text-[#173113]/70 font-bold leading-relaxed text-lg mb-4">
                   Unused or unopened products can be returned or exchanged within <span className="text-[#A7D949]">3 days of purchase</span>.
                 </p>
                 <p className="text-[#173113]/50 font-medium text-sm">
                   Simply reach out to our customer support team to initiate a return request for gardening supplies or accessories.
                 </p>
              </div>
            </section>

            {/* Contact & Support */}
            <section className="bg-[#173113] p-10 rounded-[2.5rem] text-white">
              <h2 className="text-3xl font-serif mb-8">Need Assistance?</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                         <Mail className="w-5 h-5 text-[#A7D949]" />
                      </div>
                      <div>
                        <span className="text-[10px] opacity-40 uppercase font-black tracking-widest block mb-1">Email us</span>
                        <p className="font-bold">support@gidan.store</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                         <MessageCircle className="w-5 h-5 text-[#A7D949]" />
                      </div>
                      <div>
                        <span className="text-[10px] opacity-40 uppercase font-black tracking-widest block mb-1">WhatsApp</span>
                        <p className="font-bold">+91 7483316150</p>
                      </div>
                   </div>
                </div>
                
                <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10">
                   <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-[#A7D949]" />
                      <h4 className="font-bold text-sm">Return Address</h4>
                   </div>
                   <p className="text-xs opacity-70 leading-relaxed font-medium">
                      Farm Ammino Agritech Private Limited<br />
                      1st floor, 282/C, 10th Main Rd, 5th Block,<br />
                      Jayanagar, Bengaluru, KA 560041
                   </p>
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

export default ShippingPolicy;