/**
 * ============================================
 * CUSTOM HOOK: useBannerImages - Created: Feb 16, 2026
 * Updated: Feb 16, 2026 - Added mobile optimization
 * ============================================
 * Purpose: Fetch banner images using TanStack Query
 * Benefits:
 * - Automatic caching
 * - No unnecessary re-renders
 * - Background refetching
 * - Built-in loading/error states
 * - Mobile-optimized image URLs
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchBannerImages = async () => {
  const response = await axiosInstance.get(`/promotion/banner/`);
  const banner_images = response?.data?.data?.banners || [];
  
  return {
    homeImages: banner_images.filter((img) => img.type === 'Home' && img.is_visible === true),
    heroImages: banner_images.filter((img) => img.type === 'Hero' && img.is_visible === true),
  };
};

export const useBannerImages = () => {
  return useQuery({
    queryKey: ['bannerImages'], // Unique key for this query
    queryFn: fetchBannerImages,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
  });
};

/**
 * Helper function to get optimized banner URL for mobile
 * If mobile_banner exists, use it. Otherwise, use web_banner.
 * Note: If backend doesn't provide mobile_banner, this will still use web_banner
 * TODO: Backend should provide mobile_banner field with optimized images
 */
export const getMobileBannerUrl = (banner) => {
  return banner.mobile_banner || banner.web_banner || banner.image;
};

export const getDesktopBannerUrl = (banner) => {
  return banner.web_banner || banner.image;
};
