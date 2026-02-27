'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../../Axios/axiosInstance";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blog/blogs/');
        if (response.status === 200) {
          setBlogs(response.data.data?.blogs || []);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/blogs/${blog.slug}`)}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${blog.image}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-xs text-green-600 font-semibold">{blog.category}</span>
              <h2 className="text-xl font-bold mt-2 mb-2">{blog.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{blog.short_description}</p>
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>By {blog.author}</span>
                <span>{new Date(blog.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;