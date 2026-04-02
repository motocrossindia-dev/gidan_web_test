'use client';

import React, { useState, useEffect } from "react";
import CategoryHero from "@/components/Shared/CategoryHero";
import { ChevronDown, HelpCircle, Leaf, MessageCircle } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border-b border-[#173113]/10 last:border-none transition-all duration-300 ${isOpen ? 'bg-[#faf9f6]' : 'bg-white'}`}>
      <button
        onClick={onClick}
        className="w-full py-6 px-1 flex items-center justify-between text-left group"
      >
        <span className={`text-lg md:text-xl font-serif pr-8 transition-colors duration-300 ${isOpen ? 'text-[#A7D949]' : 'text-[#173113]'}`}>
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full border border-[#173113]/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#173113] border-[#173113] rotate-180' : 'group-hover:border-[#A7D949]'}`}>
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-white' : 'text-[#173113]/40 group-hover:text-[#A7D949]'}`} />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-1 text-[#173113]/70 leading-relaxed font-medium text-base md:text-lg max-w-3xl">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQs = () => {
  const faqHeroData = {
    heading_before: "Help",
    italic_text: "Center",
    heading_after: "Resources",
    description: "Find answers to common questions about plant delivery, care, and more. We're here to help you grow your perfect garden environment.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "FAQs"
  };

  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  const faqData = [
    {
      question: "How are the plants packaged for shipping?",
      answer: "We use eco-friendly, sturdy packaging designed to keep your plant safe and secure during transit. Each plant is carefully wrapped and supported to prevent movement or damage, ensuring it arrives in pristine condition."
    },
    {
      question: "Will my plant look exactly like the picture?",
      answer: "While we do our best to match the product image, each plant is unique. Variations in size, shape, and color are natural. Rest assured, you’ll receive a healthy plant of the same species and quality."
    },
    {
      question: "What if my plant arrives damaged?",
      answer: "If your plant arrives damaged, please contact us within 24 hours with photos of the package and plant. We’ll evaluate the issue immediately and offer a replacement or refund as appropriate."
    },
    {
      question: "How do I care for my plant once it arrives?",
      answer: "Each plant comes with a basic care guide. You’ll also find detailed care instructions on our website under the product page. Our support team is also available for personalized advice."
    },
    {
      question: "Do you ship all over India?",
      answer: "Yes, we ship to most pin codes across India. Delivery might depend on your specific location's courier service availability. You can check serviceability by entering your pin code on any product page."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be canceled or modified only before they are shipped. Please contact us immediately if you need to make changes. Once dispatched, modifications are unfortunately not possible."
    },
    {
      question: "What types of plants do you sell?",
      answer: "We offer a wide variety of indoor plants, outdoor plants, succulents, flowering plants, and air-purifying plants. Each product listing includes details about ideal conditions and maintenance requirements."
    },
    {
      question: "Can I gift plants to someone?",
      answer: "Absolutely! During checkout, you can mark your order as a gift and include a personalized message. We’ll ensure your gift is packed beautifully and delivered on time to your loved one."
    }
  ];

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-24 font-sans">
      <CategoryHero 
        data={faqHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-[#173113]/5 relative overflow-hidden">
          {/* Subtle Decorative Icon */}
          <div className="absolute top-0 right-0 w-48 h-48 text-[#A7D949]/5 -mr-12 -mt-12 pointer-events-none">
            <HelpCircle className="w-full h-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[#A7D949]/20 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#173113]" />
              </div>
              <h2 className="text-2xl font-serif text-[#173113]">General Questions</h2>
            </div>

            <div className="space-y-2">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-16 pt-10 border-t border-[#173113]/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h4 className="text-[#173113] font-bold">Still have questions?</h4>
                <p className="text-[#173113]/50 text-sm font-medium">We're here to help you grow your perfect garden.</p>
              </div>
              <button className="flex items-center gap-2 bg-[#173113] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#173113]/10 hover:bg-[#1f3d19] transition-all duration-300 active:scale-95">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQs;
