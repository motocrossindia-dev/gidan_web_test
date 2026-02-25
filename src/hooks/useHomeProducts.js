'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../Axios/axiosInstance';

const fetchHomeProducts = async (accessToken) => {
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};

  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/homeProducts/`,
    config
  );

  return response?.data?.data?.products || [];
};

export const useHomeProducts = (accessToken) => {
  return useQuery({
    queryKey: ['homeProducts', accessToken], // Unique key includes auth state
    queryFn: () => fetchHomeProducts(accessToken),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
    enabled: true, // Always fetch
  });
};
