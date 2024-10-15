import './globals.css';
import React from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from './context/SessionContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Goss App',
  description: 'A social media app for sharing voice notes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="mx-auto max-h-[932px] min-h-screen w-full max-w-[430px] bg-gray-100">
          <Toaster />
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
