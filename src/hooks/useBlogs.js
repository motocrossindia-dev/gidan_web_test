'use client';

/**
 * ============================================
 * CUSTOM HOOK: useBlogs - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch blogs data using TanStack Query
 * Used by: Blog
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchBlogs = async (categoryId) => {
  const response = await axiosInstance.get(`/blog/blogs/`);
  // Handle the provided API structure: response.data.results.blogs
  const allBlogs = response.data?.results?.blogs || response.data?.blogs || response.data?.data?.blogs || [];
  
  if (categoryId) {
    // Filter blogs by category ID if provided
    // Note: Adjust the filtering logic based on your actual API response structure for blog categories
    return allBlogs.filter(blog => blog.category_id === categoryId || blog.category?.id === categoryId);
  }
  
  return allBlogs;
};

export const useBlogs = (categoryId = null) => {
  return useQuery({
    queryKey: ['blogs', categoryId],
    queryFn: () => fetchBlogs(categoryId),
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    enabled: true,
  });
};
