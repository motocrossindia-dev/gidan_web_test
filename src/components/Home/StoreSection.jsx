'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import axiosInstance from '../../Axios/axiosInstance';
import StoreCard from '../Shared/StoreCard';

const StoreSection = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axiosInstance.get('/store/store_list/');
                if (response.status === 200) {
                    setStores(response?.data?.data?.stores?.slice(0, 3) || []);
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-full mb-8 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-3xl" />
                ))}
            </div>
        </div>
    );

    if (stores.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-[#375421] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block">
                        OUR PRESENCE
                    </span>
                    <h2 className="text-[36px] md:text-[48px] font-serif text-[#1a1f14] leading-tight max-w-xl">
                        Visit us at <br />
                        <span className="italic font-normal text-[#375421]">our experience centers.</span>
                    </h2>
                </div>
                <button 
                    onClick={() => router.push('/stores')}
                    className="group bg-white border border-gray-200 hover:border-[#375421] text-[#1a1f14] px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                    View All Stores
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map((store) => (
                    <StoreCard key={store.id || store.slug} store={store} />
                ))}
            </div>
        </section>
    );
};

export default StoreSection;
