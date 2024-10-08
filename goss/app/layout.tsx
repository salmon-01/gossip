import './globals.css';
import React from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast'; // Import Toaster

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
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
