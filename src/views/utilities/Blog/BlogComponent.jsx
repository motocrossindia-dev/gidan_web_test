'use client';


import React, { useState, useEffect } from 'react';

import Category from './Category';
import CategoryFilter from './CategoryFilter';
import axiosInstance from '../../../Axios/axiosInstance';
import HomepageSchema from "../seo/HomepageSchema";
import StoreSchema from "../seo/StoreSchema";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all blogs
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/blog/blogs/`)
      .then((response) => {
        const blogData = response.data.data.blogs;
        setBlogs(blogData);
        setFilteredBlogs(blogData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    axiosInstance
      .get(`/blog/blogs-by-category/`)
      .then((response) => {
        setCategories(response.data.data.blog_categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Filter blogs when search query or selected category changes
  useEffect(() => {
    let result = blogs;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        (blog.excerpt && blog.excerpt.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, blogs]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
      useEffect(() => {
      window.scrollTo(0, 0); // Scroll to top on component mount
    }, []);

  return (
      <>
        
        <div className="container mx-auto px-4 py-8 bg-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Our Blogs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover tips, trends, and inspiration for creating your perfect outdoor space
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar for mobile */}
            <div className="lg:hidden w-full mb-6">
              <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
              />
            </div>

            {/* Main content */}
            <div className="w-full lg:w-2/3">
              <Category
                  blogs={filteredBlogs}
                  loading={loading}
                  selectedCategory={selectedCategory}
              />
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden lg:block w-full lg:w-1/3">
              <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
        <HomepageSchema/>
        <StoreSchema/>
      </>

  );
}

export default Blog;