'use client';

import React from 'react';
import { Sparkles, Package } from 'lucide-react';

const OfferTabs = ({ activeTab, setTab }) => {
  const tabs = [
    { 
      id: 'products', 
      label: 'Special Products', 
      icon: Sparkles,
      description: 'Handpicked plant deals'
    },
    { 
      id: 'combos', 
      label: 'Value Combos', 
      icon: Package,
      description: 'Curated plant sets & Savings'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 mb-12 px-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex-1 flex items-start gap-4 p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
              isActive 
                ? 'bg-[#f0f9e8] border-[#A7D949] shadow-xl shadow-[#A7D949]/10 translate-y-[-4px]' 
                : 'bg-white border-gray-100 hover:border-[#A7D949]/30 hover:bg-[#faf9f6]'
            }`}
          >
            <div className={`p-3 rounded-xl transition-colors ${
              isActive ? 'bg-[#A7D949] text-white' : 'bg-[#faf9f6] text-[#375421]'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            
            <div>
              <p className={`text-sm font-black uppercase tracking-widest ${
                isActive ? 'text-[#375421]' : 'text-[#375421]/60'
              }`}>
                {tab.label}
              </p>
              <p className={`text-sm ${
                isActive ? 'text-[#375421]/70' : 'text-gray-400'
              }`}>
                {tab.description}
              </p>
            </div>
            
            {isActive && (
              <div className="ml-auto mt-1">
                <div className="w-2 h-2 rounded-full bg-[#375421] animate-pulse shadow-[0_0_8px_rgba(55,84,33,0.3)]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default OfferTabs;
