'use client';

/**
 * ============================================
 * CUSTOM HOOK: useShopTheLook - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch shop the look data using TanStack Query
 * Used by: ShopTheLook
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchShopTheLook = async () => {
  const response = await axios.get(
    "https://backend.gidan.store/combo/shop_the_look_offers/"
  );
  const data = response?.data?.data?.shop_the_look[0];
  return {
    shoplookData: data,
    products: data?.products || [],
    shopid: data?.id
  };
};

export const useShopTheLook = () => {
  return useQuery({
    queryKey: ['shopTheLook'],
    queryFn: fetchShopTheLook,
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    enabled: true,
  });
};
