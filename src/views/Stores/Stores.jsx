'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CategoryHero from "@/components/Shared/CategoryHero";
import axiosInstance from "../../Axios/axiosInstance";
import StoreCard from "../../components/Shared/StoreCard";

const Stores = () => {
  const storesHeroData = {
    heading_before: "Our",
    italic_text: "Retail",
    heading_after: "Locations",
    description: "Visit Gidan stores in person to explore our curated selection of indoor plants, premium planters, and expert gardening supplies. Experience the green difference.",
  };

  const breadcrumb = {
    items: [],
    currentPage: "Our Stores"
  };

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(`/store/store_list/`);
      setStores(response?.data?.data?.stores);
    } catch (error) {
      console.error(error);
      setError("Error fetching store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-[#173113] font-serif text-xl animate-pulse">Loading stores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  const handleClick = () => {
    router.push("/franchise-enquiry");
  };

  return (
    <>
      <CategoryHero 
        data={storesHeroData} 
        breadcrumb={breadcrumb}
      />

      <div className="w-full bg-white-100 p-6 md:p-16 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif text-[#173113] mb-12">
            Explore Our Green Spaces
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores && Array.isArray(stores) && stores.length > 0 ? (
              stores.map((store, index) => (
                <StoreCard key={index} store={store} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 font-medium">No stores available</div>
            )}
          </div>

          {/* Request a Free Franchise Consultation Section */}
          <section className="mt-24 md:mt-32">
            <div className="bg-[#A7D949] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 text-[#173113]/5 -mr-20 -mt-20">
                  <svg className="w-full h-full opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
               </div>
               <div className="relative z-10 max-w-xl text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#173113] mb-4">Interested in Partnering?</h2>
                  <p className="text-[#173113]/70 font-bold">Join India's fastest growing gardening brand. Request a free Franchise Consultation today.</p>
               </div>
               <button 
                 onClick={handleClick}
                 className="relative z-10 bg-[#173113] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-[#173113]/20"
               >
                 Apply for Franchise
               </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Stores;
