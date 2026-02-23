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

const fetchBlogs = async () => {
  const response = await axiosInstance.get(`/blog/blogs/`);
  return response.data.data.blogs || [];
};

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    enabled: true,
  });
};
