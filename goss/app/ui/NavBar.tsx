'use client'; // Keep this as a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineUser,
} from 'react-icons/hi2';
import RecordPost from './RecordPost';
import { useSessionContext } from '../context/SessionContext';

function NavBar() {
  const { data: session } = useSessionContext();
  const username = session?.profile.username;
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full rounded-t-lg bg-gray-50 shadow-md">
      {isActive('/home') && (
        <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform">
          <RecordPost />
        </div>
      )}

      <div className="flex">
        {/* Home */}
        <Link href="/home" aria-label="Home" className="w-1/4">
          <div
            className={`flex h-16 transform items-center justify-center transition-transform hover:scale-110 ${
              isActive('/home') ? 'bg-purple-100' : 'bg-gray-100'
            }`}
          >
            <HiOutlineHome
              color={isActive('/home') ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive('/home') ? 2.5 : 1 }}
            />
          </div>
        </Link>

        {/* Search */}
        <Link href="/search" aria-label="Search" className="w-1/4">
          <div
            className={`flex h-16 transform items-center justify-center transition-transform hover:scale-110 ${
              isActive('/search') ? 'bg-purple-100' : 'bg-gray-100'
            }`}
          >
            <HiOutlineMagnifyingGlass
              color={isActive('/search') ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive('/search') ? 2.5 : 1 }}
            />
          </div>
        </Link>

        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="w-1/4"
        >
          <div
            className={`flex h-16 transform items-center justify-center transition-transform hover:scale-110 ${
              isActive('/notifications') ? 'bg-purple-100' : 'bg-gray-100'
            }`}
          >
            <HiOutlineBell
              color={isActive('/notifications') ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive('/notifications') ? 2.5 : 1 }}
            />
          </div>
        </Link>

        {/* Profile */}
        <Link href={`/${username}`} aria-label="Profile" className="w-1/4">
          <div
            className={`flex h-16 transform items-center justify-center transition-transform hover:scale-110 ${
              isActive(`/${username}`) ? 'bg-purple-100' : 'bg-gray-100'
            }`}
          >
            {session?.profile.profile_img ? (
              <img
                src={session?.profile.profile_img}
                className="h-9 rounded-full"
                alt={`${username}'s profile`}
              />
            ) : (
              <HiOutlineUser
                color={isActive(`/${username}`) ? '#9333ea' : '#7b53bb'}
                size={32}
                style={{ strokeWidth: isActive(`/${username}`) ? 2.5 : 1 }}
              />
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
