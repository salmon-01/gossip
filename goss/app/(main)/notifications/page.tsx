'use client';

import NotificationCard from '@/app/ui/NotificationCard';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '@/app/api/fetchNotifications';
import { useSessionContext } from '@/app/context/SessionContext';

export default function Notifications() {
  const { data: session } = useSessionContext();
  const user = session?.profile;

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(user.user_id),
    staleTime: 0, // Ensure cache is not used, and fresh data is fetched
    refetchOnWindowFocus: true, // Fetch fresh data whenever the window is refocused
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-500">
          Error loading notifications: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="mb-6 text-center text-2xl font-bold">Notifications</h1>

      {/* Container for notifications, centered in the screen */}
      <div className="flex flex-col items-center">
        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            You have no new notifications
          </p>
        )}
        {notifications.length > 0 &&
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              className="transform transition-transform hover:scale-105 hover:shadow-lg"
            />
          ))}
      </div>
    </div>
  );
}
