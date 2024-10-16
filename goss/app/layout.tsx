import './globals.css';
import React from 'react';
import Providers from './providers';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import NavBar from './ui/NavBar'; // Import NavBar here

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
        {/* Wrapping the whole content in Providers */}
        <Providers>
          <div className="mx-auto min-h-screen w-full dark:bg-darkModePrimaryBackground lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:px-16">
            {/* Sidebar / NavBar for Desktop */}
            <div className="hidden md:block">
              <NavBar />
            </div>

            {/* Main Content */}
            <main className="flex w-full flex-col">
              <Toaster />
              {children}
            </main>

            {/* Mobile NavBar at the bottom */}
            <div className="block md:hidden">
              <NavBar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
