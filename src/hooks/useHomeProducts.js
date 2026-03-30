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

  // Consistently use /filters/main_productsFilter/ for all homepage sections
  // to avoid 404s on the older /product/public-products/ endpoint.
  const url = `${process.env.NEXT_PUBLIC_API_URL}/filters/main_productsFilter/?${queryParams.toString()}&page_size=20&limit=20&page=1`;
  const response = await axiosInstance.get(url, config);

  // Return the results array directly from the response
  return response?.data?.results || response?.data?.products || response?.data?.data?.results || response?.data?.data?.products || [];
};

export const useHomeProducts = (accessToken, filters = {}, initialData = undefined) => {
  return useQuery({
    queryKey: ['homeProducts', filters, accessToken ? 'auth' : 'guest'],
    queryFn: () => fetchHomeProducts(accessToken, filters),
    staleTime: 0, 
    gcTime: 10 * 60 * 1000, 
    enabled: true,
    initialData: initialData,
  });
};
