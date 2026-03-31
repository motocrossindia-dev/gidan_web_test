'use client';

/**
 * ============================================
 * CUSTOM HOOK: useCategories - Created: Feb 16, 2026
 * ============================================
 * Purpose: Fetch categories with subcategories using TanStack Query
 * Used by: CategoryIcons
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - No unnecessary re-renders
 * - Optimized data fetching
 * ============================================
 */

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

// Map categories to type_choices
const categoryToTypeMap = {
  'PLANTS': 'plant',
  'POTS': 'pot',
  'SEEDS': 'seed',
  'PLANT CARE': 'plantcare'
};

// Fetch subcategories for a specific category
const fetchSubCategory = async (categorySlug) => {
  try {
    const endpoint = categorySlug === 'offers' ? '/product/offerProducts/' : `/category/categoryWiseSubCategory/${categorySlug}/`;
    const response = await axiosInstance.get(endpoint);
    if (response.status === 200) {
      return response?.data?.data?.subCategorys || response?.data?.products || [];
    }
  } catch (error) {
    return [];
  }
};

// Fetch all categories with their subcategories
const fetchCategories = async () => {
  const response = await axiosInstance.get(`/category/`);
  const categories = response?.data?.data?.categories;

  if (categories?.length > 0) {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        if (category?.id) {
          const subCategory = await fetchSubCategory(category?.slug);
          const typeKey = categoryToTypeMap[category.name] || '';
          return { ...category, subCategory, typeKey };
        }
        return category;
      })
    );
    return updatedCategories;
  }

  return [];
};

export const useCategories = (initialData = undefined) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // Data stays fresh for 10 minutes (categories don't change often)
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    initialData: initialData,
    enabled: true,
  });
};
