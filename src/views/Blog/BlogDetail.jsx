'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../Axios/axiosInstance";

function BlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blog/blogs/${slug}/`);
        if (response.status === 200) {
          setBlog(response.data.data?.blog_details);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (!blog) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="mb-4 text-[#375421] hover:text-[#375421]"
      >
        ← Back to Blogs
      </button>
      
      <span className="text-sm text-[#375421] font-semibold">{blog.category}</span>
      <h1 className="text-4xl font-bold mt-2 mb-4">{blog.title}</h1>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        <span>By {blog.author}</span>
        <span>•</span>
        <span>{new Date(blog.published_at).toLocaleDateString()}</span>
      </div>

      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
        alt={blog.title}
        className="w-full h-96 object-cover rounded-lg mb-8"
      />

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}

export default BlogDetail;