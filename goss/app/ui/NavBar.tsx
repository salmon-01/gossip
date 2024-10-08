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
    <nav className="fixed bottom-0 w-full rounded-t-lg bg-gray-50">
      {isActive('/home') && (
        <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform">
          <RecordPost />
        </div>
      )}

      <div className="flex justify-around py-5">
        <Link href="/home" aria-label="Home">
          <HiOutlineHome
            color={isActive('/home') ? '#9333ea' : '#7b53bb'}
            size={32}
            style={{ strokeWidth: isActive('/home') ? 2.5 : 1 }}
          />
        </Link>

        <Link href="/search" aria-label="Search">
          <HiOutlineMagnifyingGlass
            color={isActive('/search') ? '#9333ea' : '#7b53bb'}
            size={32}
            style={{ strokeWidth: isActive('/search') ? 2.5 : 1 }}
          />
        </Link>

        <Link href="/notifications" aria-label="Notifications">
          <HiOutlineBell
            color={isActive('/notifications') ? '#9333ea' : '#7b53bb'}
            size={32}
            style={{ strokeWidth: isActive('/notifications') ? 2.5 : 1 }}
          />
        </Link>

        {/* Use the username in the profile link */}
        <Link href={`/${username}`} aria-label="Profile">
          <img
            src={session?.profile.profile_img}
            className="h-9 rounded-full"
          />
          {/* <HiOutlineUser
            color={isActive(`/${username}`) ? '#9333ea' : '#7b53bb'}
            size={32}
            style={{ strokeWidth: isActive(`/${username}`) ? 2.5 : 1 }}
          /> */}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
