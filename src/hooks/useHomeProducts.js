'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';
import { applyGstToProduct } from '../utils/serverApi';

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

  return (response?.data?.results || response?.data?.products || []).map(applyGstToProduct);
};

export const useHomeProducts = (accessToken, filters = {}, initialData = undefined) => {
  return useQuery({
    queryKey: ['homeProducts', filters, accessToken || 'guest'], // Unique key includes filters and auth state
    queryFn: () => fetchHomeProducts(accessToken, filters),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: true,
    initialData: initialData,
  });
};
