'use client';
import { usePathname, useRouter } from 'next/navigation';
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

  const router = useRouter();

  const handleCreatePostClick = () => {
    router.push('/create-post'); // Redirect to the create-post page
  };

  // Filter unread notifications from fetched data
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const hideRecordPost = pathname === '/create-post';

  return (
    <nav className="fixed bottom-0 w-full bg-gray-50 text-gray-500 shadow-md dark:bg-darkModePrimaryBackground dark:text-darkModeParaText lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-auto lg:flex-col lg:items-center lg:justify-start lg:space-y-8 lg:px-16 lg:py-8">
      {/* Mobile Record Post Button */}
      {!hideRecordPost && (
        <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 transform lg:hidden">
          <RecordPost />
        </div>
      )}

      <div className="flex justify-between lg:flex-col lg:items-center lg:space-y-8">
        {/* Home */}
        <NavItem
          href="/home"
          icon={HiOutlineHome}
          isActive={isActive('/home')}
          label="Home"
        >
          {/* Conditionally render the label on desktop */}
          <span className="hidden lg:ml-2 lg:block">Home</span>
        </NavItem>

        {/* Search */}
        <NavItem
          href="/search"
          icon={HiOutlineMagnifyingGlass}
          isActive={isActive('/search')}
          label="Search"
        >
          {/* Conditionally render the label on desktop */}
          <span className="hidden lg:ml-2 lg:block">Search</span>
        </NavItem>

        {/* Notifications */}
        <NavItem
          href="/notifications"
          icon={HiOutlineBell}
          isActive={isActive('/notifications')}
          label="Notifications"
        >
          {!isLoading && unreadCount > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white lg:hidden">
              {unreadCount}
            </span>
          )}
          <span className="hidden lg:ml-2 lg:flex lg:items-center">
            Notifications
            <span
              className={`ml-2 flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white ${
                unreadCount > 0 ? 'visible' : 'invisible'
              }`}
            >
              {unreadCount}
            </span>
          </span>
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
              // color={isActive(`/${username}`) ? '#9333ea' : '#7b53bb'}
              size={32}
              style={{ strokeWidth: isActive(`/${username}`) ? 2.5 : 1 }}
            />
          )}
          {/* Conditionally render the label on desktop */}
          <span className="hidden lg:ml-2 lg:block">Profile</span>
        </NavItem>

        {/* Record Post Button for Desktop */}
        <div className="hidden w-full lg:block">
          <button
            onClick={handleCreatePostClick}
            className="dark:bg-darkModePrimaryBtn bg-darkModePrimaryBtn flex w-full items-center justify-center space-x-2 rounded-md px-4 py-2 text-white hover:scale-110 lg:rounded-xl"
          >
            <RecordPost />
            <span>Record Post</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
