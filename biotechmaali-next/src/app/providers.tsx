'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      })
  );

  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {hasMounted ? (
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </PersistGate>
          ) : (
            <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
          )}
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
