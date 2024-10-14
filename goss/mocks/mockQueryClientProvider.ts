// mocks/mockQueryClientProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

export const MockQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();

  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
};
