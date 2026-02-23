'use client';

/**
 * ============================================
 * TANSTACK QUERY PROVIDER SETUP - Created: Feb 16, 2026
 * ============================================
 * Purpose: Configure React Query for data fetching and caching
 * Benefits:
 * - Automatic caching (prevents unnecessary API calls)
 * - Background refetching
 * - Reduces re-renders
 * - Better performance
 * ============================================
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: false, // Don't refetch on component mount if data exists
      retry: 1, // Retry failed requests once
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
