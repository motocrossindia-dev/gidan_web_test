/**
 * ============================================
 * CUSTOM HOOK: useRewardBanner - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch reward club banner data using TanStack Query
 * Used by: RewardClub
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchRewardBanner = async () => {
  const response = await axios.get(
    "https://backend.gidan.store/utils/content-blocks/?section=banner&title="
  );
  return response.data?.[0] || null;
};

export const useRewardBanner = () => {
  return useQuery({
    queryKey: ['rewardBanner'],
    queryFn: fetchRewardBanner,
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    enabled: true,
  });
};
