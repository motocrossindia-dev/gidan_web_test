'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../Axios/axiosInstance";
import StoreCard from "../../../components/Shared/StoreCard";
import { ArrowRight, MapPin, Search } from "lucide-react";

const StoreLocations = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [stores, setStores] = useState([]); 
  const router = useRouter(); 

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/store_list/`
      );
      setStores(response?.data?.data?.stores || []); 
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
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#A7D949] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#173113]/60 font-medium">Discovering store locations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="py-24 text-center text-red-500 font-medium">{error}</div>;
  }

  const storesToDisplay = stores.slice(0, 3);

  return (
    <section className="py-24 px-6 lg:px-16 bg-white relative overflow-hidden">
      {/* Subtle Botanical BG Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img src="/logo.webp" alt="Gidan Logo watermark" className="w-full h-full object-contain scale-150" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] text-[#A7D949] tracking-[0.2em] uppercase font-bold mb-4 block">
            Visit Us
          </span>
          <h2 className="text-4xl md:text-5xl text-[#173113] font-serif tracking-tight !leading-tight">
            Checkout Our <span className="italic text-[#A7D949]">Experience Stores</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {storesToDisplay && storesToDisplay.length > 0 ? (
            storesToDisplay.map((store, index) => (
              <StoreCard key={index} store={store} />
            ))
          ) : (
            <div className="col-span-full bg-[#faf9f6] rounded-[3rem] p-16 text-center border border-[#173113]/5 shadow-sm">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[#A7D949]" />
              </div>
              <h3 className="text-2xl font-serif text-[#173113] mb-3">No Stores Found</h3>
              <p className="text-[#173113]/60 font-medium max-w-sm mx-auto">
                We're expanding rapidly! Check back soon or visit our online store.
              </p>
            </div>
          )}
        </div>

        {/* View All Button - Premium Styling */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/stores")}
            className="group flex items-center gap-3 bg-[#173113] text-white py-4 px-10 rounded-2xl font-bold shadow-xl shadow-[#173113]/10 hover:bg-[#1f3d19] transition-all duration-300 active:scale-95"
          >
            View All Stores
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoreLocations;