'use client'; // Make this component a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname hook
import { HiOutlineHome } from 'react-icons/hi2';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { HiOutlineBell } from 'react-icons/hi2';
import { HiOutlineUser } from 'react-icons/hi2';
import RecordPost from './RecordPost';

function NavBar() {
  const pathname = usePathname(); // Get current path on the client-side

  const isActive = (path: string) => pathname === path; // Client-side check

  return (
    <nav className="fixed bottom-0 w-full rounded-t-lg bg-gray-50">
      {isActive('/home') && (
        <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform">
          <RecordPost />
        </div>
      )}

      <div className="flex justify-around py-5">
        <Link href="/home" aria-label="Home">
          <HiOutlineHome
            color={isActive('/home') ? '#9333ea' : '#7b53bb'} // Change color if active
            size={32}
            style={{ strokeWidth: isActive('/home') ? 2.5 : 1 }}
          />
        </Link>

        <Link href="/search" aria-label="Search">
          <HiOutlineMagnifyingGlass
            color={isActive('/search') ? '#9333ea' : '#7b53bb'} // Change color if active
            size={32}
            style={{ strokeWidth: isActive('/search') ? 2.5 : 1 }}
          />
        </Link>

        <Link href="/notifications" aria-label="Notifications">
          <HiOutlineBell
            color={isActive('/notifications') ? '#9333ea' : '#7b53bb'} // Change color if active
            size={32}
            style={{ strokeWidth: isActive('/notifications') ? 2.5 : 1 }}
          />
        </Link>

        <Link href="/profile" aria-label="Profile">
          <HiOutlineUser
            color={isActive('/profile') ? '#9333ea' : '#7b53bb'} // Change color if active
            size={32}
            style={{ strokeWidth: isActive('/profile') ? 2.5 : 1 }}
          />
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
