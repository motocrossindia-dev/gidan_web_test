/**
 * ============================================
 * CUSTOM HOOK: useStores - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch stores data using TanStack Query
 * Used by: CheckOutStore
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchStores = async () => {
  const response = await axiosInstance.get(
    `${process.env.REACT_APP_API_URL}/store/store_list/`
  );
  return response?.data?.data?.stores || [];
};

export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    staleTime: 30 * 60 * 1000, // Data stays fresh for 30 minutes (stores rarely change)
    cacheTime: 60 * 60 * 1000, // Cache persists for 60 minutes
    enabled: true,
  });
};
