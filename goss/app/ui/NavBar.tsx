'use client'; // Keep this as a client component

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
import { useGlobalNotifications } from '../context/NotificationsContext';

function NavBar() {
  const { data: session } = useSessionContext();
  const username = session?.profile?.username;
  const pathname = usePathname();
  const { notifications, isLoading } = useGlobalNotifications();

  const isActive = (path: string) => pathname === path;

  // Filter unread notifications from fetched data
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <nav className="dark:bg-darkModePrimaryBackground dark:text-darkModeParaText fixed bottom-0 w-full bg-gray-50 text-gray-500 shadow-md md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-auto md:flex-col md:items-center md:justify-start md:space-y-8 md:px-16 md:py-8">
      {/* Mobile Record Post Button */}
      <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform md:hidden">
        <RecordPost />
      </div>

      <div className="flex justify-between md:flex-col md:items-center md:space-y-8">
        {/* Home */}
        <NavItem
          href="/home"
          icon={HiOutlineHome}
          isActive={isActive('/home')}
          label="Home"
        >
          {/* Conditionally render the label on desktop */}
          <span className="hidden md:ml-2 md:block">Home</span>
        </NavItem>

        {/* Search */}
        <NavItem
          href="/search"
          icon={HiOutlineMagnifyingGlass}
          isActive={isActive('/search')}
          label="Search"
        >
          {/* Conditionally render the label on desktop */}
          <span className="hidden md:ml-2 md:block">Search</span>
        </NavItem>

        {/* Notifications */}
        <NavItem
          href="/notifications"
          icon={HiOutlineBell}
          isActive={isActive('/notifications')}
          label="Notifications"
        >
          {!isLoading && unreadCount > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
          {/* Conditionally render the label on desktop */}
          <span className="hidden md:ml-2 md:block">Notifications</span>
        </NavItem>

        {/* Profile */}
        <NavItem
          href={`/${username}`}
          isActive={isActive(`/${username}`)}
          label="Profile"
        >
          {session?.profile?.profile_img ? (
            <img
              src={session?.profile.profile_img}
              className="h-10 w-10 rounded-full"
              alt={`${username}'s profile`}
            />
          ) : (
            <HiOutlineUser
              color={isActive(`/${username}`) ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive(`/${username}`) ? 2.5 : 1 }}
            />
          )}
          {/* Conditionally render the label on desktop */}
          <span className="hidden md:ml-2 md:block">Profile</span>
        </NavItem>

        {/* Record Post Button for Desktop */}
        <div className="hidden w-full md:block">
          <button className="flex w-full items-center justify-center space-x-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            <RecordPost />
            <span>Record Post</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
