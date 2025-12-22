import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Clock, Tag, X } from 'lucide-react';
import axiosInstance from '../../../Axios/axiosInstance';
import linkifyHtml from 'linkify-html';


// import 
function Category({ blogs, loading, selectedCategory }) {
  const [expandedPost, setExpandedPost] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F4333]"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
        <p className="text-gray-600">
          {selectedCategory 
            ? `No blogs found in the "${selectedCategory}" category.` 
            : "No blogs match your search criteria."}
        </p>
      </div>
    );
  }

  const handleReadMore = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      setExpandedContent(null);
      return;
    }

    setLoadingContent(true);
    try {
      const response = await axiosInstance.get(`/blog/blogs/${postId}/`);
      if (response.status == 200) {
      const blogDetails = response.data.data.blog_details;
      setExpandedPost(postId);
      setExpandedContent(blogDetails);
      }

    } catch (error) {
      console.error("Error fetching blog details:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <div className="space-y-8">
      {selectedCategory && (
        <div className="bg-[#f8faf8] p-4 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-[#2F4333]" />
            <span className="font-medium">Showing blogs in: <span className="text-[#2F4333]">{selectedCategory}</span></span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((post) => {
          const isExpanded = expandedPost === post.id;
          const postContent = isExpanded ? expandedContent : post;

          return (
            <div
              key={post.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg ${
                isExpanded ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative">
                <div className="w-full aspect-[800/665] bg-gray-100">
  <img
    src={`${process.env.REACT_APP_API_URL}${post.image}`}
    alt={post.title}
    loading="lazy"
    className="w-full h-full object-contain"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = 'https://via.placeholder.com/800x665?text=Image+Not+Available';
    }}
  />
</div>

                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag size={14} />
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  {post.date && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {post.date}
                    </div>
                  )}
                  {post.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {post.readTime}
                    </div>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                  {post.title}
                </h3>

                {loadingContent && isExpanded ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2F4333]"></div>
                  </div>
                ) : (
                 <div
  className={`max-w-none mb-4 text-gray-600
    [&_a]:text-blue-600
    [&_a]:underline
    [&_a]:font-medium
    [&_a:hover]:text-blue-800
    ${isExpanded ? '' : 'line-clamp-3'}
  `}
  dangerouslySetInnerHTML={{
    __html: isExpanded && expandedContent
      ? expandedContent.content
      : post.content
  }}
/>




                )}

                <div className="flex items-center justify-between mt-4">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{post.author}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="inline-flex items-center gap-1 text-[#2F4333] font-medium hover:gap-2 transition-all duration-300"
                  >
                    {isExpanded ? (
                      <>
                        Close
                        <X size={16} className="transition-transform duration-300" />
                      </>
                    ) : (
                      <>
                        Read More
                        <ArrowRight size={16} className="transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Category;
