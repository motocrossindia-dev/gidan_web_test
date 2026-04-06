'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    MapPin, 
    Phone, 
    Clock, 
    ChevronLeft, 
    ExternalLink, 
    Navigation, 
    ArrowRight,
    Star,
    ShieldCheck,
    Truck,
    Camera
} from "lucide-react";
import axiosInstance from "../../Axios/axiosInstance";
import TrustBadges from "@/components/Shared/TrustBadges";

const StoreDetail = ({ slug }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axiosInstance.get(`/store/store_list/${slug}/`);
        setStore(response?.data?.data?.store);
      } catch (error) {
        console.error(error);
        setError("Error fetching store details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStore();
    }
  }, [slug]);

  if (loading) {
    return (
        <div className="w-full min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#375421]/20 border-t-[#375421] rounded-full animate-spin" />
            <p className="text-[#375421] font-bold animate-pulse uppercase tracking-widest text-[10px]">Opening Store Doors...</p>
        </div>
    );
  }

  if (error || !store) {
    return (
        <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-8">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-md">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin size={32} />
                </div>
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Store Not Found</h1>
                <p className="text-gray-500 mb-8">{error || "The requested experience center could not be found."}</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[#375421] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#375421]/20 hover:scale-105 transition-transform">
                    Back to Home <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
  }

  const mapLink = store.address_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  const primaryImage = store.images && store.images.length > 0 ? `https://backend.gidan.store${store.images[0].image}` : `https://backend.gidan.store${store.image}`;

  return (
    <main className="bg-[#faf9f6] min-h-screen pb-20 font-sans overflow-x-hidden">
        {/* Navigation Bar / Breadcrumb Area */}
        <div className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-[#375421] font-bold text-[11px] uppercase tracking-widest group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1f14]">Experience Center</span>
                </div>
            </div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] flex items-end">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={primaryImage} 
                    alt={store.location}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 pb-16 md:pb-24">
                <div className="max-w-3xl">
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        {store.location.split(',')[0]} EXPERIENCE STORE
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-tight mb-8">
                        {store.location.includes(',') ? store.location.split(',')[0] : store.location} <br />
                        <span className="italic font-normal text-white/80">{store.location.split(',')[1] || "Experience Store"}</span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => window.open(mapLink, "_blank")}
                        className="bg-white text-[#1a1f14] px-8 py-5 rounded-3xl font-black text-[12px] uppercase tracking-[0.1em] flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform group"
                    >
                        <Navigation size={18} className="text-[#375421] group-hover:animate-bounce" /> Get Directions
                    </button>
                    <a 
                        href={`tel:${store.contact}`}
                        className="bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-5 rounded-3xl font-black text-[12px] uppercase tracking-[0.1em] flex items-center gap-3 shadow-2xl hover:bg-white/20 transition-all hover:scale-105"
                    >
                        <Phone size={18} /> Call Specialist
                    </a>
                </div>
            </div>
        </section>

        {/* Content Area */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Information Cards */}
                <div className="lg:col-span-4 space-y-6 mt-0 lg:mt-8 relative z-20">
                    
                    {/* Main Info Box */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4 text-[#375421]">
                                <MapPin size={24} strokeWidth={1.5} />
                                <h3 className="font-serif font-black text-xl text-gray-900 tracking-tight">Location Details</h3>
                            </div>
                            <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                                {store.address}
                            </p>
                        </div>

                        <div className="h-px bg-gray-50 w-full" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#fafafa] rounded-2xl text-[#375421]">
                                    <Clock size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Business Hours</h4>
                                    <p className="text-[13px] font-bold text-gray-900 leading-none">{store.time_period || "09:00 - 18:00 Daily"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#fafafa] rounded-2xl text-[#375421]">
                                    <Phone size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Primary Contact</h4>
                                    <p className="text-[13px] font-bold text-gray-900 leading-none">{store.contact || "+91 Contact Gidan Support"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={() => window.open(mapLink, "_blank")}
                                className="w-full bg-[#375421] text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#375421]/20 hover:translate-y-[-2px] active:translate-y-0 transition-transform"
                            >
                                Open in Google Maps <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Badge Box */}
                    <div className="bg-[#375421] p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-serif font-bold italic">Why visit a <br />Gidan store?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[12px] font-medium text-white/90">
                                    <div className="p-1.5 bg-white/20 rounded-full"><Star size={12} fill="white" /></div> 
                                    Curated plant selection
                                </li>
                                <li className="flex items-center gap-3 text-[12px] font-medium text-white/90">
                                    <div className="p-1.5 bg-white/20 rounded-full"><ShieldCheck size={12} fill="white" /></div> 
                                    Expert plant doctors on site
                                </li>
                                <li className="flex items-center gap-3 text-[12px] font-medium text-white/90">
                                    <div className="p-1.5 bg-white/20 rounded-full"><Truck size={12} fill="white" /></div> 
                                    Instant delivery in Bangalore
                                </li>
                            </ul>
                        </div>
                        {/* Decorative Leaf Icon */}
                        <Star className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 transform rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                    </div>
                </div>

                {/* Right Side: Description and Gallery */}
                <div className="lg:col-span-8 flex flex-col gap-12">
                    
                    {/* Description Section */}
                    {store.description && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-0.5 w-12 bg-[#375421]" />
                                <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Our Store's Story</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                                    {store.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    {store.images && store.images.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="h-0.5 w-12 bg-[#375421]" />
                                    <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Inside The Gallery</h2>
                                </div>
                                <span className="text-[10px] font-black text-[#375421] bg-[#375421]/5 px-4 py-2 rounded-full uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Camera size={14} /> View All {store.images.length} Photos
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                {store.images.map((img, idx) => (
                                    <div 
                                        key={img.id} 
                                        className={`group relative overflow-hidden rounded-[2.5rem] shadow-xl ${
                                            idx === 0 ? "md:col-span-2 h-[450px]" : "h-[300px]"
                                        }`}
                                    >
                                        <img
                                            src={`https://backend.gidan.store${img.image}`}
                                            alt={`${store.location} interior ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white">
                                                <ExternalLink size={24} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* Global Branding / Trust Section */}
        <div className="mt-32">
            <TrustBadges />
        </div>
    </main>
  );
};

export default StoreDetail;
