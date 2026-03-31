'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../Axios/axiosInstance";
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

function BlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/blog/blogs/${slug}/`);
        if (response.status === 200) {
          setBlog(response.data.data?.blog_details);
          
          // Fetch related blogs (mocked filter or from same category)
          const allBlogsResponse = await axiosInstance.get('/blog/blogs/');
          if (allBlogsResponse.status === 200) {
            const all = allBlogsResponse.data?.results?.blogs || [];
            setRelatedBlogs(all.filter(b => b.slug !== slug).slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlogData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-site-bg">
        <div className="w-12 h-12 border-4 border-[#375421] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return <div className="container mx-auto px-4 py-8">Journal Entry not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Cinematic Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Interaction Bar */}
        <div className="absolute top-8 left-0 right-0 z-20 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 px-6 py-2.5 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to Archive
            </button>
            <div className="flex gap-3">
              <button className="p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Title Card */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-6 z-30">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center border border-gray-100"
          >
            <span className="text-[11px] font-black text-[#375421] uppercase tracking-[0.3em] mb-4 inline-block">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-8">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#375421]">
                  <User className="w-4 h-4" />
                </div>
                <span>By {blog.author || "Gidan Editor"}</span>
              </div>
              <div className="w-px h-4 bg-gray-200 hidden md:block" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.published_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="w-px h-4 bg-gray-200 hidden md:block" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 Min Read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="pt-40 md:pt-64 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Article */}
          <div className="lg:w-2/3">
            <article 
              className="prose prose-lg md:prose-xl prose-bio-green max-w-none 
                prose-headings:font-black prose-headings:text-gray-900 
                prose-p:text-gray-600 prose-p:leading-relaxed 
                prose-img:rounded-[2rem] prose-img:shadow-xl
                prose-a:text-[#375421] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            {/* Post Footer */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-2">
                {["Botanical", "Care Guide", "Interior Design"].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-site-bg rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest ">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share this study</span>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-site-bg cursor-pointer transition-all">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-12">
              <div className="bg-site-bg rounded-[2rem] p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Recent Journal Entries</h3>
                <div className="space-y-8">
                  {relatedBlogs.map(rb => (
                    <div 
                      key={rb.id} 
                      className="group flex gap-4 cursor-pointer"
                      onClick={() => router.push(`/blog/${rb.slug}`)}
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL}${rb.image}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          alt="" 
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-[#375421] uppercase tracking-widest">{rb.category}</span>
                        <h4 className="text-sm font-black text-gray-900 leading-tight mt-1 line-clamp-2 group-hover:text-[#375421] transition-colors">
                          {rb.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => router.push('/blog')}
                  className="w-full mt-10 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black text-[#375421] uppercase tracking-widest hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  View Archive <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Newsletter / CTA */}
              <div className="bg-[#375421] rounded-[2rem] p-10 text-center text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Join the Club</h3>
                  <p className="text-green-100/70 text-sm mb-8">Exclusive botanical guides delivered to your inbox.</p>
                  <button className="w-full py-4 bg-white text-[#375421] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 hover:scale-105 transition-all">
                    Subscribe
                  </button>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-10">
                  <ArrowRight size={200} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;