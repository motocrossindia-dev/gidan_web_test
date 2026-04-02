'use client';

import React, { useEffect } from 'react';
import CategoryHero from "@/components/Shared/CategoryHero";
import { Book, Shield, AlertTriangle, Scale, CreditCard, UserCheck, Mail } from 'lucide-react';

const TermsOfService = () => {
  const termsHeroData = {
    heading_before: "Terms &",
    italic_text: "Conditions",
    heading_after: "Our Agreement",
    description: "Our commitment to transparency and a seamless gardening community experience. Please read our terms carefully before starting your journey with us.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "Terms & Conditions"
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-24 font-sans text-[#173113]">
      <CategoryHero 
        data={termsHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-[#173113]/5">
          
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-[#173113] mb-6">Agreement to Terms</h1>
            <p className="text-[#173113]/70 font-medium leading-relaxed text-lg">
              Please read the following carefully to understand our expressions under each circumstance before you have a wonderful shopping experience with Gidan.
            </p>
          </div>

          <div className="space-y-16">
            {/* Definitions Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Book className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Definitions</h2>
              </div>
              <p className="text-[#173113]/60 mb-6 font-medium">For clarity, the following terms carry specific meanings within this agreement:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Buyer", desc: "The person who buys goods from the Seller." },
                  { label: "Seller", desc: "FARM AMMINO AGRITECH PRIVATE LIMITED." },
                  { label: "Goods", desc: "The products offered for sale on the website." },
                  { label: "List Price", desc: "The prices listed on the website for goods." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#faf9f6] p-5 rounded-2xl border border-[#173113]/5">
                    <span className="text-[10px] text-[#A7D949] font-black uppercase tracking-widest block mb-1">{item.label}</span>
                    <p className="font-bold text-[#173113]/80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* General Terms */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">General Terms</h2>
              </div>
              <div className="space-y-6 text-[#173113]/70 font-medium leading-relaxed">
                <p>The use of this website, its services and tools are all governed by the following terms and conditions. If you make any transaction through this website, you shall undergo policies that are applicable to the website. If you transact with this website, you are contracting with Gidan.</p>
                <p>We reserve the sole right to modify, add, change or remove the portion or content of these Terms and Conditions without any prior notification.</p>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Limitations</h2>
              </div>
              <div className="space-y-4">
                {[
                  "Gidan will not be responsible for any damage or direct loss suffered by the buyer due to negligence or breach of contract.",
                  "The seller is not responsible for any economic loss, loss of profit or any indirect third party loss suffered by the buyer.",
                  "The seller may choose not to accept or cancel a particular order without giving any particular reason.",
                  "Placing an order on Gidan will be treated as evidence for acceptance of these Terms."
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start p-5 bg-[#faf9f6] rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-[#A7D949] mt-2 shrink-0" />
                    <p className="text-[#173113]/80 font-bold text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Price, Payment and Delivery */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Price, Payment & Delivery</h2>
              </div>
              <div className="space-y-4 text-[#173113]/70 font-medium leading-relaxed">
                <p>Pricing of the goods shall be specified as given in the seller's current list price on the website inclusive of all applicable taxes. Orders will be delivered to the registered address within the specified timeframe subject to availability.</p>
                <div className="p-6 bg-[#faf9f6] rounded-3xl border-2 border-dashed border-[#173113]/10">
                  <p className="text-sm italic">The Risk and Rewards are transferred to the Buyer of the goods when the Invoice is prepared by the Seller in the POS System.</p>
                </div>
              </div>
            </section>

            {/* Membership Eligibility */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#173113]" />
                </div>
                <h2 className="text-2xl font-serif text-[#173113]">Membership Eligibility</h2>
              </div>
              <div className="bg-[#A7D949]/10 p-8 rounded-[2rem] border border-[#A7D949]/20">
                <p className="text-[#173113]/80 font-bold leading-relaxed">
                  Gidan is available only to users who can form legally binding contracts under the Indian Contract Act, 1872. If you are under 18, you shall not be a member of Gidan and shall not transact on this website.
                </p>
              </div>
            </section>

            {/* Hazardous Chemical Disclaimer */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-serif text-red-600">Hazardous Garden Chemical Disclaimer</h2>
              </div>
              <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
                <div className="space-y-4 text-red-900/70 font-medium leading-relaxed">
                  <p>Gidan uses a wide range of chemicals for its gardening products such as fertilizers, pesticides, and insecticides that contain harmful chemicals. These must be disposed of in a correct manner.</p>
                  <p className="font-bold text-red-700">We strictly put this to your notice that these chemicals should not be used for food, feed, oil or any other personal, experimental purposes.</p>
                  <p className="text-sm">Please do not pour these hazardous chemicals in sewage drains or sinks. Instead, please take them to your local recycling center for appropriate disposal.</p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-[#173113] p-10 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 text-[#A7D949]/10 -mr-20 -mt-20">
                 <Mail className="w-full h-full rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-serif mb-8">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] opacity-60 uppercase font-black tracking-widest block mb-2">Company</span>
                    <p className="font-bold text-lg leading-tight">FARM AMMINO AGRITECH PRIVATE LIMITED</p>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 uppercase font-black tracking-widest block mb-2">Email</span>
                    <p className="font-bold text-lg">info@gidan.store</p>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 uppercase font-black tracking-widest block mb-2">Support Phone</span>
                    <p className="font-bold text-lg">+91 7483316150</p>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-60 uppercase font-black tracking-widest block mb-2">Business Hours</span>
                    <p className="font-bold text-lg">Mon – Sat, 09 AM – 06 PM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;