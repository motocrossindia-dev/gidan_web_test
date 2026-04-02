'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../Axios/axiosInstance';
import CategoryHero from "@/components/Shared/CategoryHero";
import { Briefcase, ChevronRight, MapPin, Search, Terminal, Users } from "lucide-react";

const Carriers = () => {
  const careersHeroData = {
    heading_before: "Join",
    italic_text: "Gidan",
    heading_after: "Our Team",
    description: "Help us build a greener future, one plant at a time. We're looking for passionate individuals to join our growing family.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "Careers"
  };

  const [activeTab, setActiveTab] = useState('non-tech');
  const [expanded, setExpanded] = useState(null);
  const [jobListings, setJobListings] = useState([]);

  const handleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        window.scrollTo(0, 0);
        const response = await axiosInstance.get(`/carrier/publicCarrier/`);
        if (response.status === 200) {
          setJobListings(response.data.data.carrier);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobListings.filter(
    (job) =>
      (activeTab === 'non-tech' && job.categories === 'Non-Tech Positions') ||
      (activeTab === 'tech' && job.categories === 'Tech Positions')
  );

  return (
    <main className="font-sans text-[#173113] bg-[#faf9f6] min-h-screen pb-24">
      {/* Premium Header */}
      <CategoryHero 
        data={careersHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 mt-12 md:mt-20">
        
        {/* Navigation Tabs - Modern Pill Style */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-[#173113]/5 flex shadow-sm">
            <button
              onClick={() => setActiveTab('non-tech')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'non-tech' 
                  ? 'bg-[#f0f9e8] text-[#173113] border border-[#A7D949] shadow-lg shadow-[#A7D949]/10' 
                  : 'text-[#173113]/60 hover:text-[#173113]'
              }`}
            >
              <div className={`p-1 rounded-md ${activeTab === 'non-tech' ? 'bg-[#A7D949]/20' : ''}`}>
                <Users className="w-4 h-4" />
              </div>
              Non-Tech
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeTab === 'tech' 
                  ? 'bg-[#f0f9e8] text-[#173113] border border-[#A7D949] shadow-lg shadow-[#A7D949]/10' 
                  : 'text-[#173113]/60 hover:text-[#173113]'
              }`}
            >
              <div className={`p-1 rounded-md ${activeTab === 'tech' ? 'bg-[#A7D949]/20' : ''}`}>
                <Terminal className="w-4 h-4" />
              </div>
              Technology
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-[3rem] py-24 px-8 text-center border border-[#173113]/5 shadow-sm">
              <div className="w-20 h-20 bg-[#faf9f6] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#A7D949]" />
              </div>
              <h3 className="text-2xl font-serif text-[#173113] mb-3">No Current Openings</h3>
              <p className="text-[#173113]/60 font-medium max-w-sm mx-auto">
                We're always growing! Check back soon for new opportunities in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative bg-white border border-[#173113]/5 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:translate-y-[-8px] flex flex-col h-full"
                >
                  {/* Job Header */}
                  <div className="mb-6 flex-grow">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#A7D949]/20 text-[#173113] text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {job.categories === 'Tech Positions' ? 'Engineering' : 'Creative / Sales'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif text-[#173113] mb-4 group-hover:text-[#A7D949] transition-colors leading-tight">
                      {job.position_name}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-[#173113]/50 text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#A7D949]" /> Bangalore, KA
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#A7D949]" /> Full-time
                      </div>
                    </div>
                  </div>

                  {/* Apply Button & Expand */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#173113]/5">
                    <button
                      onClick={() => handleExpand(job.id)}
                      className="text-sm font-bold text-[#173113]/60 hover:text-[#173113] transition-colors flex items-center gap-1"
                    >
                      {expanded === job.id ? "Minimize" : "Details"}
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${expanded === job.id ? '-rotate-90' : ''}`} />
                    </button>

                    {job.google_form && (
                      <a
                        href={job.google_form}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 text-xs font-bold text-[#173113] bg-[#A7D949] rounded-xl hover:bg-[#173113] hover:text-white transition-all duration-300 shadow-md active:scale-95"
                      >
                        Apply Now
                      </a>
                    )}
                  </div>

                  {/* Dynamic Details Area */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expanded === job.id ? "max-h-[1000px] opacity-100 mt-8" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-8 pt-8 border-t border-[#173113]/10">
                      <div>
                        <h4 className="text-xs font-bold text-[#173113] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#A7D949] rounded-full" /> Job Summary
                        </h4>
                        <p className="text-[#173113]/70 text-sm leading-relaxed font-medium">
                          {job.job_summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#173113] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#A7D949] rounded-full" /> Responsibilities
                        </h4>
                        <p className="text-[#173113]/70 text-sm leading-relaxed font-medium whitespace-pre-line">
                          {job.responsibilities}
                        </p>
                      </div>

                      {job.desired_skills && (
                        <div>
                          <h4 className="text-xs font-bold text-[#173113] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#A7D949] rounded-full" /> Desired Skills
                          </h4>
                          <p className="text-[#173113]/70 text-sm leading-relaxed font-medium">
                            {job.desired_skills}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Carriers;
