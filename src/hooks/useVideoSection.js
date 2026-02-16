/**
 * ============================================
 * CUSTOM HOOK: useVideoSection - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch video section data using TanStack Query
 * Used by: VideoSection
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchVideoData = async () => {
  const response = await axios.get(
    "https://backend.gidan.store/utils/content-blocks/?section=home_screen_video"
  );
  return response.data?.[0] || null;
};

export const useVideoSection = () => {
  return useQuery({
    queryKey: ['videoSection'],
    queryFn: fetchVideoData,
    staleTime: 15 * 60 * 1000, // Data stays fresh for 15 minutes (videos don't change often)
    cacheTime: 60 * 60 * 1000, // Cache persists for 60 minutes
    enabled: true,
  });
};
