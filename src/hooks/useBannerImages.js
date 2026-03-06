'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchBannerImages = async () => {
  const response = await axiosInstance.get(`/promotion/banner/`);
  const banner_images = response?.data?.data?.banners || [];

  return {
    homeImages: banner_images.filter((img) => img.type === 'Home' && img.is_visible === true),
    heroImages: banner_images
      .filter((img) => img.type === 'Hero' && img.is_visible === true)
      .sort((a, b) => {
        // Show plant banners before plantcare so visual order matches category order
        const order = { plant: 0, plantcare: 1 };
        const aOrder = order[a.category?.toLowerCase()] ?? 99;
        const bOrder = order[b.category?.toLowerCase()] ?? 99;
        return aOrder - bOrder;
      }),
  };
};

export const useBannerImages = (initialData = undefined) => {
  return useQuery({
    queryKey: ['bannerImages'], // Unique key for this query
    queryFn: fetchBannerImages,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
    initialData: initialData ? {
      homeImages: initialData.filter((img) => img.type === 'Home' && img.is_visible),
      heroImages: initialData.filter((img) => img.type === 'Hero' && img.is_visible),
    } : undefined
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

/**
 * Maps banner category/type values (from API) to actual frontend route slugs.
 * Banner API "type" field holds display-position (Home/Hero/Carousal) OR an actual
 * category name (pot, plant, etc.). "category" field is often incorrectly set to "plant"
 * for all banners. So: prefer type when it's a real category, fall back to category.
 */
const CATEGORY_SLUG_MAP = {
  plant: 'plants',
  plants: 'plants',
  plantcare: 'plant-care',
  'plant-care': 'plant-care',
  pot: 'pots',
  pots: 'pots',
  seed: 'seeds',
  seeds: 'seeds',
  offer: 'offers',
  offers: 'offers',
  gift: 'gifts',
  gifts: 'gifts',
  service: 'services',
  services: 'services',
};

// These are display-position values, NOT category names
const DISPLAY_TYPES = new Set(['home', 'hero', 'carousal', 'carousel']);

export const getBannerCategoryUrl = (banner) => {
  // If the banner type is "home", always redirect to the featured page
  const typeRaw = banner?.type?.toLowerCase();
  if (typeRaw === 'home') return '/featured';

  const catRaw = banner?.category?.toLowerCase();

  const source = (typeRaw && !DISPLAY_TYPES.has(typeRaw)) ? typeRaw : catRaw;
  if (!source) return '/featured';

  const slug = CATEGORY_SLUG_MAP[source] || source;
  return `/${slug}/`;
};
