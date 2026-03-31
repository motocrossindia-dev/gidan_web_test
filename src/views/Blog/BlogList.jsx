'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../../Axios/axiosInstance";
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/blog/blogs/');
        if (response.status === 200) {
          const fetchedBlogs = response.data?.results?.blogs || response.data?.blogs || [];
          setBlogs(fetchedBlogs);
          
          // Extract unique categories
          const uniqueCats = ["All", ...new Set(fetchedBlogs.map(b => b.category).filter(Boolean))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  const featuredBlog = filteredBlogs[0];
  const otherBlogs = filteredBlogs.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-site-bg">
        <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-site-bg pb-24">
      {/* Editorial Header */}
      <div className="bg-white pt-16 pb-12 border-b border-gray-100 mb-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black text-[#375421] uppercase tracking-[0.3em] mb-4">Gidan Archive</p>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            Botanical <span className="text-[#375421] italic font-serif">Journal</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            Curated guides, care protocols, and seasonal inspiration for the modern indoor gardener.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? "bg-[#375421] text-white shadow-xl shadow-green-100 scale-105" 
                  : "bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post (Hero) */}
        {featuredBlog && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 mb-16 cursor-pointer"
            onClick={() => router.push(`/blog/${featuredBlog.slug}`)}
          >
            <div className="flex flex-col lg:flex-row items-stretch">
              <div className="lg:w-3/5 h-[400px] lg:h-[600px] overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${featuredBlog.image}`}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-[#375421] rounded-lg text-[10px] font-black uppercase tracking-widest mb-8 w-fit">
                  Featured Entry
                </div>
                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-6 group-hover:text-[#375421] transition-colors">
                  {featuredBlog.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
                  {featuredBlog.short_description}
                </p>
                
                <div className="flex items-center gap-6 mb-10 text-[11px] font-bold text-gray-400 uppercase tracking-tight pb-10 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>{featuredBlog.author || "Gidan Editor"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(featuredBlog.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-black text-[#375421] uppercase tracking-widest group/btn">
                  Read Full Journal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Journal Entries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherBlogs.map((blog, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={blog.id}
              className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-gray-100 transition-all hover:-translate-y-2 group flex flex-col"
              onClick={() => router.push(`/blog/${blog.slug}`)}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-[#375421] uppercase tracking-[0.2em]">
                    {blog.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>5 min read</span>
                  </div>
                </div>
                <h3 className="text-[1.35rem] font-black text-gray-900 leading-tight mb-4 group-hover:text-[#375421] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                  {blog.short_description}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-black text-[#375421]">
                      {blog.author?.charAt(0) || "G"}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{blog.author || "Editor"}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#375421] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
             <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-medium italic">No journal entries found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;