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
import NavItem from './NavItem';

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
        <NavItem
          href="/home"
          icon={HiOutlineHome}
          isActive={isActive('/home')}
          label="Home"
        />
        {/* Search */}
        <NavItem
          href="/search"
          icon={HiOutlineMagnifyingGlass}
          isActive={isActive('/search')}
          label="Search"
        />

        {/* Notifications */}
        <NavItem
          href="/notifications"
          icon={HiOutlineBell}
          isActive={isActive('/notifications')}
          label="Notifications"
        />

        {/* Profile */}
        <NavItem
          href={`/${username}`}
          isActive={isActive(`/${username}`)}
          label="Profile"
        >
          {session?.profile?.profile_img ? (
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
        </NavItem>
      </div>
    </nav>
  );
}

export default NavBar;
