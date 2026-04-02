'use client';

import React, { useEffect } from 'react';
import CategoryHero from "@/components/Shared/CategoryHero";
import { Shield, Lock, Eye, Database, Smartphone, Users, AlertTriangle, Scale, CheckCircle, Info } from 'lucide-react';
import ReturnPolicySchema from "../../views/utilities/seo/ReturnPolicySchema";
import HomepageSchema from "../../views/utilities/seo/HomepageSchema";
import StoreSchema from "../../views/utilities/seo/StoreSchema";

const PrivacyPolicy = () => {
  const privacyHeroData = {
    heading_before: "Privacy",
    italic_text: "Policy",
    heading_after: "Our Commitment",
    description: "Your privacy is the root of our relationship. We are committed to protecting your personal data and providing a secure gardening experience.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "Privacy Policy"
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-24 font-sans text-[#173113]">
      <CategoryHero 
        data={privacyHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-[#173113]/5">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-[#173113] mb-6">Our Privacy Commitment</h1>
            <p className="text-[#173113]/70 font-medium leading-relaxed text-lg italic">
              "At Gidan, we recognize that privacy is foundational. We promise to respect your contact preferences and protect your private information."
            </p>
          </div>

          <div className="space-y-16">
            {/* Introduction Card */}
            <section className="bg-[#A7D949]/10 p-8 rounded-[2rem] border border-[#A7D949]/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 text-[#A7D949]/10 -mr-8 -mt-8">
                  <Shield className="w-full h-full" />
               </div>
               <p className="relative z-10 text-[#173113]/80 font-bold leading-relaxed">
                 By using our services, you accept the practices described in this Privacy Policy and agree to be bound by our Terms of Use. Please read this carefully before conducting any transaction.
               </p>
            </section>

            {/* Data Collection */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Data Collection</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#faf9f6] p-6 rounded-2xl border border-[#173113]/5">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#173113]/5 shrink-0">
                      <Lock className="w-4 h-4 text-[#A7D949]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#173113]">Secure Payment Processing</h3>
                  </div>
                  <p className="text-[#173113]/70 text-sm font-medium leading-relaxed">
                    We do not store your credit card information on our servers. Gidan uses industry-leading secure payment gateways to provide safe procedures. Your data is encrypted and handled externally by trusted processors.
                  </p>
                </div>
                
                <p className="text-[#173113]/70 font-medium leading-relaxed px-2">
                  All collected information is used for billing, authentication, services improvement, and research. We never share your personally identifying information with third parties except for essential service providers.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Cookies & Tracking</h2>
              </div>
              <div className="space-y-6 text-[#173113]/70 font-medium leading-relaxed">
                <p>When you visit Gidan, cookies are created on your computer to improve your experience and facilitate access. These anonymous identifiers help us understand your preferences.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Record session information",
                    "Store encrypted login data",
                    "Compile user analytics",
                    "Track visit patterns"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-[#faf9f6] rounded-xl">
                      <CheckCircle className="w-4 h-4 text-[#A7D949]" />
                      <span className="text-sm font-bold text-[#173113]/80">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Information Sharing</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 flex gap-5">
                  <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
                  <div>
                    <h3 className="text-red-900 font-bold mb-2 uppercase text-xs tracking-widest">Public Information Warning</h3>
                    <p className="text-red-900/70 text-sm font-medium leading-relaxed">
                      Any information you voluntarily disclose online (reviews, public profile) becomes publicly available and can be collected by others.
                    </p>
                  </div>
                </div>
                <p className="text-[#173113]/70 font-medium leading-relaxed px-2">
                  Account creation deemed as consent for using your email for non-marketing administrative purposes, such as order updates or legal notifications.
                </p>
                <div className="bg-[#173113] p-6 rounded-2xl flex items-center gap-4 text-white">
                  <Info className="w-5 h-5 text-[#A7D949]" />
                  <p className="text-sm font-bold tracking-tight">We use your contact info to send offers based on your interests.</p>
                </div>
              </div>
            </section>

            {/* Android/Mobile Policy */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Mobile Application Policy</h2>
              </div>
              <div className="space-y-6 text-[#173113]/70 font-medium leading-relaxed">
                <p>The Gidan app is provided as a Commercial service. We may collect minimal identification and SMS permissions for secure OTP verification.</p>
                <div className="bg-[#faf9f6] p-6 rounded-[2rem] border border-[#173113]/5">
                  <span className="text-[10px] text-[#A7D949] uppercase font-black tracking-[0.2em] mb-4 block">Third Party Integrations</span>
                  <div className="flex flex-wrap gap-3">
                    {["Google Play", "Firebase", "Facebook", "Crashlytics"].map((tag, i) => (
                      <span key={i} className="px-4 py-1.5 bg-white border border-[#173113]/10 rounded-full text-xs font-bold text-[#173113]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Legal & Children */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100">
                  <h4 className="text-orange-900 font-bold mb-4 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Legal Disclosure
                  </h4>
                  <p className="text-orange-900/70 text-xs font-medium leading-relaxed">
                    Gidan may disclose identifiable info under special circumstances: subpoenas, legal threats, or violations of our Terms.
                  </p>
               </section>
               <section className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100">
                  <h4 className="text-purple-900 font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Children's Privacy
                  </h4>
                  <p className="text-purple-900/70 text-xs font-medium leading-relaxed">
                    Our services do not address anyone under 13. We immediately delete info if we discover a minor has provided data.
                  </p>
               </section>
            </div>

            {/* Security Commitment Summary */}
            <section className="bg-[#173113] p-10 rounded-[2.5rem] text-white">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif mb-2">Security Commitment</h2>
                <p className="text-[#A7D949]/80 font-medium text-sm">How we keep your roots secure.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Lock, title: "Secure Payments", desc: "No card data stored locally" },
                  { icon: Shield, title: "Data Protection", desc: "Encrypted storage & hash" },
                  { icon: Users, title: "No Data Selling", desc: "We never monetize your info" }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A7D949] transition-colors duration-500">
                      <item.icon className="w-6 h-6 text-white group-hover:text-[#173113] transition-colors" />
                    </div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-[11px] opacity-60 uppercase font-black tracking-widest">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <ReturnPolicySchema />
      <HomepageSchema />
      <StoreSchema />
    </main>
  );
};

export default PrivacyPolicy;