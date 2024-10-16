'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileNav({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 mt-6 flex w-full justify-center dark:bg-darkModePrimaryBackground">
      <Link
        href={`/${username}`}
        className={
          pathname === `/${username}`
            ? 'text-xl font-bold text-ds dark:text-darkModeHeader'
            : 'text-gray-500'
        }
      >
        Posts
      </Link>
    </nav>
  );
}
