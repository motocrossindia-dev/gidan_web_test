'use client';

/**
 * ============================================
 * CUSTOM HOOK: useComboOffer - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch combo offer data using TanStack Query
 * Used by: ComboOffer
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchComboOffer = async () => {
  const response = await axios.get(
    "https://backend.gidan.store/utils/content-blocks/?section=combo_offers&title="
  );
  return response.data?.[0] || null;
};

export const useComboOffer = () => {
  return useQuery({
    queryKey: ['comboOffer'],
    queryFn: fetchComboOffer,
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    enabled: true,
  });
};
