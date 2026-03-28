'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchHomeProducts = async (accessToken, filters = {}) => {
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};

  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?${queryParams.toString()}&page_size=20&limit=20&page=1`;
  const response = await axiosInstance.get(url, config);

  return response?.data?.results || response?.data?.products || [];
};

export const useHomeProducts = (accessToken, filters = {}, initialData = undefined) => {
  return useQuery({
    queryKey: ['homeProducts', filters, accessToken ? 'auth' : 'guest'], // Simplified auth state key
    queryFn: () => fetchHomeProducts(accessToken, filters),
    staleTime: 0, // Disable staleTime to force fresh data for highlights
    gcTime: 10 * 60 * 1000, // Replaces cacheTime in newer TanStack Query versions
    enabled: true,
    initialData: initialData,
  });
};
