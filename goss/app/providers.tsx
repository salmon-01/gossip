'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from './context/NotificationsContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { FollowProvider } from './context/FollowContext';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from './context/SessionContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client - FROM THE DOCS, WE CAN CHANGE
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <NotificationsProvider>
            <FollowProvider>
              <Toaster />
              {children}
              {/* <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="top-right"
              /> */}
            </FollowProvider>
          </NotificationsProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
