'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Provider } from 'react-redux';

import { store } from '@/store';
import { hydrateLikes } from '@/store/slices/likeSlice';
import { hydrateSaves } from '@/store/slices/saveSlice';

interface ProviderContainerProps {
  children: ReactNode;
}

export default function ProviderContainer({
  children,
}: ProviderContainerProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000,
            gcTime: 300_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    store.dispatch(hydrateLikes());
    store.dispatch(hydrateSaves());
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
