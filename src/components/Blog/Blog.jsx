'use client';

import Link from "next/link";
import { ArrowRight, Clock, Calendar, Leaf, Sun, Wind, ShoppingBasket } from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";

/**
 * Blog Component - Redesigned: "Grow guides for Indian homes"
 * Matches the premium, high-trust aesthetic of digital gardening publications.
 * Displays a featured large card and smaller supporting cards.
 */
const Blog = ({ categoryId = null }) => {
    const { data: blogs = [], isLoading } = useBlogs(categoryId);

    // Helper: Select icon based on category
    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase() || "";
        if (cat.includes("kitchen") || cat.includes("vegetable")) return <ShoppingBasket className="w-12 h-12 text-white/40" strokeWidth={1} />;
        if (cat.includes("summer") || cat.includes("sun")) return <Sun className="w-12 h-12 text-white/40" strokeWidth={1} />;
        if (cat.includes("air") || cat.includes("indoor")) return <Wind className="w-12 h-12 text-white/40" strokeWidth={1} />;
        return <Leaf className="w-12 h-12 text-white/40" strokeWidth={1} />;
    };

    // Helper: Select gradient based on index/category
    const getCardGradient = (index) => {
        const gradients = [
            "from-[#8cb369] to-[#5c8a4c]", // Green
            "from-[#63a4b0] to-[#457e8a]", // Blue-Teal
            "from-[#d89c52] to-[#b37936]", // Orange-Gold
            "from-[#8b5cf6] to-[#6d28d9]", // Purple
        ];
        return gradients[index % gradients.length];
    };

    if (isLoading) {
        return (
            <div className="w-full py-16 animate-pulse">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 h-[500px] bg-gray-100 rounded-[40px]" />
                        <div className="h-[500px] bg-gray-100 rounded-[40px]" />
                    </div>
                </div>
            </div>
        );
    }

    const blogsToDisplay = blogs.slice(0, 3);

    return (
        <section className="w-full py-20 bg-[#faf9f6] font-sans">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="text-left">
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#375421] opacity-60 mb-3">
                            Free Plant Knowledge
                        </span>
                        <h2 className="text-[32px] md:text-[48px] font-serif text-[#1a1f14] leading-tight flex flex-wrap gap-x-2 items-baseline">
                            Grow guides <span className="italic font-normal text-[#375421]">for Indian homes</span>
                        </h2>
                        <p className="text-[14px] md:text-[16px] text-[#1a1f14]/60 font-medium max-w-xl mt-4">
                            Expert articles written specifically for Indian gardeners — climate, seasons, and local conditions.
                        </p>
                    </div>
                    <Link 
                        href="/blogs" 
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-[#375421]/20 text-[#375421] text-[12px] font-bold hover:bg-[#375421] hover:text-white transition-all duration-300"
                    >
                        All grow guides <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Blog Grid - Consistent Single Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogsToDisplay.map((blog, idx) => (
                        <Link 
                            key={blog.id} 
                            href={`/blogs/${blog.slug}`} 
                            className="group relative flex flex-col bg-white rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
                        >
                            {/* Card Header (Gradient Image Area) */}
                            <div className={`relative h-[240px] w-full bg-gradient-to-br ${getCardGradient(idx)} flex items-center justify-center overflow-hidden`}>
                                <div className="relative transform transition-transform duration-700 group-hover:scale-110">
                                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-150" />
                                    {blog.image ? (
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`} 
                                            alt={blog.title}
                                            onError={(e) => {
                                                e.target.src = "/logo.webp";
                                            }}
                                            className="w-32 h-32 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
                                        />
                                    ) : (
                                        getCategoryIcon(blog.category)
                                    )}
                                </div>
                                
                                {/* Centered Badge on Image */}
                                <div className="absolute bottom-6 inset-x-0 flex justify-center">
                                    <span className="bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[9px] font-bold uppercase tracking-widest border border-white/5">
                                        {blog.category} · 5 min read
                                    </span>
                                </div>
                            </div>

                            {/* Card Body (Info Area) */}
                            <div className="p-8 flex flex-col flex-grow">
                                <span className="text-[9px] font-black text-[#375421] opacity-40 uppercase tracking-[0.2em] mb-2.5">
                                    {blog.category || "Essential Guide"}
                                </span>
                                <h4 className="text-lg font-bold text-[#1a1f14] leading-snug line-clamp-2 md:line-clamp-3 mb-4 group-hover:text-[#375421] transition-colors">
                                    {blog.title}
                                </h4>
                                <p className="text-[13px] text-[#1a1f14]/40 leading-relaxed line-clamp-2 mb-8">
                                   {blog.short_description || blog.summary}
                                </p>
                                
                                <div className="mt-auto border-t border-gray-50 pt-5 flex justify-between items-center text-[#375421]">
                                    <div className="flex items-center gap-2.5 opacity-40">
                                        <Calendar size={13} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {new Date(blog.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                                        Read <ArrowRight size={14} strokeWidth={3} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;